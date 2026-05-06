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


# ─────────────────────────────────────────────────────────
# RUNNER
# ─────────────────────────────────────────────────────────

teacher_doc = {
  "questions": [
    {
      "id": 1,
      "question_no": "Q1",
      "question": "What is Artificial Intelligence?",
      "answer": "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think, reason, and learn like humans. It encompasses a wide range of technologies, including machine learning, natural language processing, and computer vision.",
      "marks": 10
    },
    {
      "id": 2,
      "question_no": "Q2",
      "question": "What is Machine Learning?",
      "answer": "Machine Learning (ML) is a subset of Artificial Intelligence that focuses on building systems that can learn from data and improve their performance over time without being explicitly programmed. ML algorithms identify patterns in data and make predictions or decisions based on those patterns.",
      "marks": 10
    },
    {
      "id": 3,
      "question_no": "Q3",
      "question": "What is Deep Learning?",
      "answer": "Deep Learning is a specialized subset of machine learning that uses artificial neural networks with multiple layers (hence \"deep\") to model complex patterns in data. These neural networks are inspired by the structure of the human brain.",
      "marks": 10
    },
    {
      "id": 4,
      "question_no": "Q4",
      "question": "Explain Natural Language Processing.",
      "answer": "Natural Language Processing (NLP) is a field of artificial intelligence that focuses on the interaction between computers and human language.",
      "marks": 10
    }
  ]
}


student_doc = {
  "questions": [
    {
      "id": 1,
      "question_no": "Q1",
      "question": "What is Artificial Intelligence?",
      "answer": "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think, reason, and learn like human\nIt encompasses a wide range of technologies, including machine learning, natural language processing, and computer vision.\nAI systems can perform tasks such as decision-making, problem-solving, speech recognition, and language translation.\nIn modern applications, AI is used in healthcare, finance, autonomous vehicles, and recommendation systems."
    },
    {
      "id": 2,
      "question_no": "Q2",
      "question": "What is Machine Learning?",
      "answer": "Machine Learning (ML) is a subset of Artificial Intelligence that focuses on building systems that can learn from data and improve their performan\nover time without being explicitly programmed.\nML algorithms identify patterns in data and make predictions or decisions based on those patterns.\nThere are three main types of machine learning:\n1. Supervised Learning - where models are trained on labeled data.\n2. Unsupervised Learning - where models find hidden patterns in unlabeled data.\n3. Reinforcement Learning - where agents learn by interacting with an environment.\nMachine learning is widely used in spam detection, recommendation systems, and fraud detection."
    },
    {
      "id": 3,
      "question_no": "Q3",
      "question": "What is Deep Learning?",
      "answer": "Deep Learning is a specialized subset of machine learning that uses artificial neural networks with multiple layers (hence \"deep\") to model comple\npatterns in data.\nThese neural networks are inspired by the structure of the human brain.\nDeep learning models are particularly effective in handling large volumes of unstructured data such as images, audio, and text.\nCommon architectures include Convolutional Neural Networks (CNNs) for image processing and Recurrent Neural Networks (RNNs) for sequence data.\nDeep learning powers applications like image recognition, voice assistants, and self-driving cars."
    },
    {
      "id": 4,
      "question_no": "Q4",
      "question": "Explain Natural Language Processing.",
      "answer": "Natural Language Processing (NLP) is a field of artificial intelligence that focuses on the interaction between computers and human language.\nIt enables machines to understand, interpret, and generate human language in a meaningful way.\nNLP involves several tasks such as tokenization, part-of-speech tagging, named entity recognition, sentiment analysis, and machine translation.\nModern NLP systems use transformer-based architectures like BERT and GPT to achieve state-of-the-art performance.\nApplications include chatbots, virtual assistants, translation services, and text summarization systems."
    }
  ]
}

async def main():

    result = await workflow.ainvoke({
        "teacher_doc": teacher_doc,
        "student_doc": student_doc,
        "question_results": [],
        "similarity_score": 0,
        "plagiarism_pct": 0,
        "ai_results": {},
        "overall_score": 0,
        "ai_confidence_pct": 0,
    })

    import json
    print(json.dumps(result, indent=2))

asyncio.run(main())