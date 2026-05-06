import asyncio
from typing import List, Optional
from pydantic import BaseModel, Field
from typing_extensions import TypedDict

from langchain_groq import ChatGroq
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from langgraph.graph import StateGraph, START, END

# ─────────────────────────────────────────────────────────
# MODELS
# ─────────────────────────────────────────────────────────

class TeacherQAItem(BaseModel):
    id: int
    question_no: str
    question: str
    answer: str
    marks: int = 10
    rubric: Optional[str] = None


class TeacherQADocument(BaseModel):
    questions: List[TeacherQAItem]


class StudentQAItem(BaseModel):
    id: int
    question_no: str
    question: Optional[str] = None
    answer: str


class StudentQADocument(BaseModel):
    questions: List[StudentQAItem]


class QuestionTags(BaseModel):
    logic: float = Field(ge=0, le=10)
    clarity: float = Field(ge=0, le=10)
    completeness_pct: float = Field(ge=0, le=100)


class QuestionResult(BaseModel):
    num: str
    question: str
    awarded_score: float = Field(ge=0)
    max_score: float = Field(gt=0)
    compliment: str
    deduction: Optional[str]
    tags: QuestionTags


class AIResults(BaseModel):
    summary: str
    early_insight: str
    questions: List[QuestionResult]


class OverallMeta(BaseModel):
    summary: str
    early_insight: str
    ai_confidence_pct: int = Field(ge=0, le=100)


class PlagiarismSchema(BaseModel):
    plagiarism_pct: float = Field(ge=0, le=100)


class AssessmentState(TypedDict):
    teacher_doc: dict
    student_doc: dict

    question_results: list
    similarity_score: float
    plagiarism_pct: float

    ai_results: dict
    overall_score: int
    ai_confidence_pct: int


# ─────────────────────────────────────────────────────────
# LLM + EMBEDDINGS
# ─────────────────────────────────────────────────────────
from dotenv import load_dotenv
load_dotenv()


llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.1
)

embedder = SentenceTransformer("all-MiniLM-L6-v2")


# ─────────────────────────────────────────────────────────
# NODE A — QUESTION EVALUATION
# ─────────────────────────────────────────────────────────

async def node_evaluate_questions(state: AssessmentState):

    teacher = TeacherQADocument(**state["teacher_doc"])
    student = StudentQADocument(**state["student_doc"])

    structured_llm = llm.with_structured_output(QuestionResult)

    student_map = {q.id: q for q in student.questions}

    async def _eval_one(tq: TeacherQAItem):

        sq = student_map.get(tq.id)

        prompt = f"""
You are a strict academic evaluator.

Rules:
- Be precise and objective
- Do not inflate marks
- Award 0 if answer is missing
- Respect max_score strictly

Return evaluation for this:

QUESTION: {tq.question}
REFERENCE: {tq.answer}
STUDENT: {sq.answer if sq else "No answer"}
MAX_SCORE: {tq.marks}
RUBRIC: {tq.rubric or "Use reference answer"}
"""

        result = await structured_llm.ainvoke(prompt)

        return {
            **result.model_dump(),
            "num": tq.question_no,
            "question": tq.question,
            "max_score": tq.marks
        }

    results = await asyncio.gather(*[_eval_one(q) for q in teacher.questions])

    return {"question_results": results}


# ─────────────────────────────────────────────────────────
# NODE B — SIMILARITY
# ─────────────────────────────────────────────────────────

async def node_compute_similarity(state: AssessmentState):

    teacher = TeacherQADocument(**state["teacher_doc"])
    student = StudentQADocument(**state["student_doc"])

    t = " ".join(q.answer for q in teacher.questions)
    s = " ".join(q.answer for q in student.questions)

    def compute():
        return float(cosine_similarity(
            embedder.encode([t]),
            embedder.encode([s])
        )[0][0]) * 100

    score = await asyncio.to_thread(compute)

    return {"similarity_score": round(score, 2)}


# ─────────────────────────────────────────────────────────
# NODE C — PLAGIARISM
# ─────────────────────────────────────────────────────────

async def node_check_plagiarism(state: AssessmentState):

    student = StudentQADocument(**state["student_doc"])

    structured_llm = llm.with_structured_output(PlagiarismSchema)

    text = "\n".join(q.answer for q in student.questions)

    prompt = f"""
Estimate plagiarism likelihood (0–100).

Text:
{text}
"""

    result = await structured_llm.ainvoke(prompt)

    return {"plagiarism_pct": result.plagiarism_pct}


# ─────────────────────────────────────────────────────────
# NODE D — OVERALL
# ─────────────────────────────────────────────────────────

async def node_overall_evaluator(state: AssessmentState):

    results = state["question_results"]

    total_got = sum(q["awarded_score"] for q in results)
    total_max = sum(q["max_score"] for q in results)

    overall = round((total_got / total_max) * 100) if total_max else 0

    structured_llm = llm.with_structured_output(OverallMeta)

    prompt = f"""
Summarize performance.

Score: {overall}
Results: {results}
"""

    meta = await structured_llm.ainvoke(prompt)

    ai_results = AIResults(
        summary=meta.summary,
        early_insight=meta.early_insight,
        questions=[QuestionResult(**q) for q in results]
    )

    return {
        "overall_score": overall,
        "ai_confidence_pct": meta.ai_confidence_pct,
        "ai_results": ai_results.model_dump()
    }


# ─────────────────────────────────────────────────────────
# GRAPH
# ─────────────────────────────────────────────────────────

graph = StateGraph(AssessmentState)

graph.add_node("eval", node_evaluate_questions)
graph.add_node("sim", node_compute_similarity)
graph.add_node("plag", node_check_plagiarism)
graph.add_node("final", node_overall_evaluator)

graph.add_edge(START, "eval")
graph.add_edge(START, "sim")
graph.add_edge(START, "plag")

graph.add_edge("eval", "final")
graph.add_edge("sim", "final")
graph.add_edge("plag", "final")

graph.add_edge("final", END)

workflow = graph.compile()
