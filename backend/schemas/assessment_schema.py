from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


# ───────── INPUT ─────────

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


# ───────── OUTPUT ─────────

class QuestionTags(BaseModel):
    logic: float
    clarity: float
    completeness_pct: float


class QuestionResult(BaseModel):
    num: str
    question: str
    awarded_score: float
    max_score: float
    compliment: str
    deduction: Optional[str]
    tags: QuestionTags


class AIResults(BaseModel):
    summary: str
    early_insight: str
    questions: List[QuestionResult]


class AssessmentResponse(BaseModel):
    similarity_score: float
    plagiarism_pct: float
    overall_score: int
    ai_confidence_pct: int
    ai_results: Dict[str, Any]