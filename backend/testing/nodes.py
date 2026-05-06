import os
import json
import time
import tempfile
import asyncio
from typing import Optional

from llama_cloud import LlamaCloud
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

from models import (
    AssessmentState,
    TeacherQADocument,
    StudentQADocument,
    QuestionEvalOutput,
    QuestionResult,
    QuestionTags,
    OverallEvalOutput,
    AIResults,
)

from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file
# ── Clients ───────────────────────────────────────────────────────────────────

# Base LLM — reasoning_format="hidden" keeps chain-of-thought internal
# so structured output tool-calling is never polluted by <think> tokens
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
    max_tokens=4096,
    reasoning_format="hidden",
  
)

embedder = SentenceTransformer("all-MiniLM-L6-v2")
llama    = LlamaCloud(api_key=os.environ["LLAMA_CLOUD_API_KEY"])


# ── Structured output LLM variants ───────────────────────────────────────────
# Each is a separate chain — avoids re-creating on every call

llm_teacher_extractor  = llm.with_structured_output(TeacherQADocument)
llm_student_extractor  = llm.with_structured_output(StudentQADocument)
llm_question_evaluator = llm.with_structured_output(QuestionEvalOutput)
llm_overall_evaluator  = llm.with_structured_output(OverallEvalOutput)


# ── Helper: LlamaCloud extraction (file path → Pydantic model) ───────────────

def _llamacloud_extract(
    data: Optional[bytes],
    filename: Optional[str],
    text_fallback: Optional[str],
    schema: dict,
) -> dict:
    """
    Uploads a file (or a text wrapped as .txt) to LlamaCloud, runs agentic
    extraction against the given JSON schema, polls until done, returns the
    raw result dict.
    """
    if data and filename:
        file_bytes   = data
        upload_name  = filename
    else:
        file_bytes   = text_fallback.encode("utf-8")
        upload_name  = "input.txt"

    suffix = os.path.splitext(upload_name)[-1] or ".txt"

    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    try:
        uploaded = llama.files.create(file=tmp_path, purpose="extract")

        job = llama.extract.create(
            file_input=uploaded.id,
            configuration={
                "data_schema":       schema,
                "extraction_target": "per_doc",
                "tier":              "agentic",
            },
        )

        while job.status not in ("COMPLETED", "FAILED", "CANCELLED"):
            time.sleep(2)
            job = llama.extract.get(job.id)

        if job.status != "COMPLETED":
            raise RuntimeError(
                f"LlamaCloud extraction ended with status '{job.status}' "
                f"(job_id={job.id})"
            )

        return job.extract_result

    finally:
        os.unlink(tmp_path)


# ── NODE 1: Extract teacher Q&A ───────────────────────────────────────────────

async def node_extract_teacher(state: AssessmentState) -> AssessmentState:
    try:
        if state.teacher_data or state.teacher_text_data:
            # LlamaCloud handles file/image/pdf/docx/txt natively
            result = await asyncio.to_thread(
                _llamacloud_extract,
                state.teacher_data,
                state.teacher_data_filename,
                state.teacher_text_data,
                TeacherQADocument.model_json_schema(),
            )
            state.teacher_doc = TeacherQADocument(**result)
        else:
            raise ValueError("No teacher data provided — supply teacher_data (bytes) or teacher_text_data.")

    except Exception as e:
        state.error = f"Teacher extraction failed: {e}"

    return state


# ── NODE 2: Extract student answers ──────────────────────────────────────────

async def node_extract_student(state: AssessmentState) -> AssessmentState:
    try:
        if state.student_data or state.student_text_data:
            result = await asyncio.to_thread(
                _llamacloud_extract,
                state.student_data,
                state.student_data_filename,
                state.student_text_data,
                StudentQADocument.model_json_schema(),
            )
            raw_doc = StudentQADocument(**result)
        else:
            raise ValueError("No student data provided — supply student_data (bytes) or student_text_data.")

        # ── Align student IDs to teacher IDs via structured LLM ──────────────
        # LlamaCloud extracts answers correctly but may number them independently.
        # We re-align with a structured output call so IDs always match teacher.
        teacher_structure = json.dumps(
            [
                {"id": q.id, "question_no": q.question_no, "question": q.question}
                for q in state.teacher_doc.questions
            ],
            indent=2,
        )

        alignment_prompt = [
            SystemMessage(content=(
                "You are a document alignment assistant. "
                "Re-map the student answers to the correct teacher question IDs. "
                "Match by question number or content similarity. "
                "If a student skipped a question, omit it. "
                "Return the corrected student document."
            )),
            HumanMessage(content=(
                f"TEACHER QUESTIONS (for ID reference):\n{teacher_structure}\n\n"
                f"EXTRACTED STUDENT ANSWERS (may have wrong IDs):\n"
                f"{raw_doc.model_dump_json(indent=2)}"
            )),
        ]

        state.student_doc = await llm_student_extractor.ainvoke(alignment_prompt)

    except Exception as e:
        state.error = f"Student extraction failed: {e}"

    return state


# ── NODE 3: Evaluate each question concurrently ───────────────────────────────

async def node_evaluate_questions(state: AssessmentState) -> AssessmentState:
    try:
        teacher_map = {q.id: q for q in state.teacher_doc.questions}
        student_map = {q.id: q for q in state.student_doc.questions}

        async def evaluate_one(teacher_q, student_q) -> QuestionResult:
            max_marks = teacher_q.marks or 10

            messages = [
                SystemMessage(content=(
                    "You are a strict but fair academic evaluator. "
                    "Evaluate the student's answer against the reference answer and rubric. "
                    f"The maximum marks for this question is {max_marks}. "
                    f"Rubric: {teacher_q.rubric or 'No rubric provided — use the reference answer as the guide.'} "
                    "Deduct proportionally for missing key points. "
                    "awarded_score must be between 0 and max_marks."
                )),
                HumanMessage(content=(
                    f"QUESTION: {teacher_q.question}\n\n"
                    f"REFERENCE ANSWER:\n{teacher_q.answer}\n\n"
                    f"STUDENT ANSWER:\n"
                    f"{student_q.answer if student_q else '[No answer provided — award 0 marks]'}\n\n"
                    f"MAX MARKS: {max_marks}"
                )),
            ]

            eval_output: QuestionEvalOutput = await llm_question_evaluator.ainvoke(messages)

            # Clamp awarded_score to valid range (model may occasionally exceed bounds)
            awarded = max(0.0, min(float(eval_output.awarded_score), float(max_marks)))

            return QuestionResult(
                num=teacher_q.question_no or str(teacher_q.id).zfill(2),
                question=teacher_q.question,
                awarded_score=awarded,
                max_score=float(max_marks),
                compliment=eval_output.compliment,
                deduction=eval_output.deduction,
                tags=eval_output.tags,
            )

        tasks = [
            evaluate_one(teacher_map[tid], student_map.get(tid))
            for tid in teacher_map
        ]

        state.question_results = list(await asyncio.gather(*tasks))

    except Exception as e:
        state.error = f"Question evaluation failed: {e}"

    return state


# ── NODE 4: Compute semantic similarity ───────────────────────────────────────

async def node_compute_similarity(state: AssessmentState) -> AssessmentState:
    try:
        teacher_text = " ".join(q.answer for q in state.teacher_doc.questions)
        student_text = " ".join(q.answer for q in state.student_doc.questions)

        def _compute() -> float:
            t_emb = embedder.encode([teacher_text])
            s_emb = embedder.encode([student_text])
            return round(float(cosine_similarity(t_emb, s_emb)[0][0]) * 100, 2)

        state.similarity_score = await asyncio.to_thread(_compute)

    except Exception as e:
        state.error = f"Similarity computation failed: {e}"

    return state


# ── NODE 5: Overall evaluator ─────────────────────────────────────────────────

async def node_overall_evaluator(state: AssessmentState) -> AssessmentState:
    try:
        total_awarded = sum(q.awarded_score for q in state.question_results)
        total_max     = sum(q.max_score     for q in state.question_results)
        overall_score = round((total_awarded / total_max) * 100) if total_max else 0

        results_summary = json.dumps(
            [r.model_dump() for r in state.question_results],
            indent=2,
        )

        messages = [
            SystemMessage(content=(
                "You are a senior academic reviewer. "
                "Analyse the per-question evaluation results holistically. "
                "ai_confidence_pct reflects how consistent and clear the student answers were. "
                "plagiarism_pct is an estimate based on writing style uniformity — 0 means clean, "
                "high values mean suspiciously polished or copied text."
            )),
            HumanMessage(content=(
                f"PER-QUESTION RESULTS:\n{results_summary}\n\n"
                f"OVERALL SCORE: {overall_score}/100"
            )),
        ]

        meta: OverallEvalOutput = await llm_overall_evaluator.ainvoke(messages)

        state.overall_score     = overall_score
        state.ai_confidence_pct = max(0, min(100, meta.ai_confidence_pct))
        state.plagiarism_pct    = round(max(0.0, min(100.0, meta.plagiarism_pct)), 2)

        state.ai_results = AIResults(
            summary=meta.summary,
            early_insight=meta.early_insight,
            questions=list(state.question_results),
        )

    except Exception as e:
        state.error = f"Overall evaluation failed: {e}"

    return state


# ── NODE 6: Persist to Supabase ───────────────────────────────────────────────

async def node_persist(state: AssessmentState) -> AssessmentState:
    try:
        from supabase import create_client

        supabase = create_client(
            os.environ["SUPABASE_URL"],
            os.environ["SUPABASE_SERVICE_ROLE_KEY"],
        )

        BUCKET = "assessments"

        teacher_data_url: Optional[str] = None
        student_data_url: Optional[str] = None

        # ── Upload files to Supabase Storage ──────────────────────────────────
        if state.teacher_data and state.teacher_data_filename:
            path = f"{state.assessment_id}/teacher/{state.teacher_data_filename}"
            await asyncio.to_thread(
                lambda: supabase.storage.from_(BUCKET).upload(
                    path, state.teacher_data, {"upsert": "true"}
                )
            )
            teacher_data_url = supabase.storage.from_(BUCKET).get_public_url(path)

        if state.student_data and state.student_data_filename:
            path = f"{state.assessment_id}/student/{state.student_data_filename}"
            await asyncio.to_thread(
                lambda: supabase.storage.from_(BUCKET).upload(
                    path, state.student_data, {"upsert": "true"}
                )
            )
            student_data_url = supabase.storage.from_(BUCKET).get_public_url(path)

        # ── Build DB payload ──────────────────────────────────────────────────
        payload = {
            "status":            "completed",
            "ai_results":        state.ai_results.model_dump(),
            "overall_score":     state.overall_score,
            "ai_confidence_pct": state.ai_confidence_pct,
            "similarity_score":  state.similarity_score,
            "plagiarism_pct":    state.plagiarism_pct,
            "completed_at":      "now()",
        }

        if teacher_data_url:
            payload["teacher_data_url"] = teacher_data_url
        if student_data_url:
            payload["student_data_url"] = student_data_url
        if state.teacher_text_data:
            payload["teacher_text_data"] = state.teacher_text_data
        if state.student_text_data:
            payload["student_text_data"] = state.student_text_data

        await asyncio.to_thread(
            lambda: supabase.table("assessments")
                .update(payload)
                .eq("id", state.assessment_id)
                .execute()
        )

    except Exception as e:
        state.error = f"Persist failed: {e}"

    return state


# ── Error handler ─────────────────────────────────────────────────────────────

async def node_handle_error(state: AssessmentState) -> AssessmentState:
    try:
        from supabase import create_client

        supabase = create_client(
            os.environ["SUPABASE_URL"],
            os.environ["SUPABASE_SERVICE_ROLE_KEY"],
        )

        await asyncio.to_thread(
            lambda: supabase.table("assessments")
                .update({"status": "failed"})
                .eq("id", state.assessment_id)
                .execute()
        )
    except Exception:
        pass  # Best-effort — original error is already in state.error

    return state