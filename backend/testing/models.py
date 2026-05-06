from pydantic import BaseModel, Field
from typing import List, Optional


# ── Teacher extraction ────────────────────────────────────────────────────────

class TeacherQAItem(BaseModel):
    id: int = Field(..., description="Unique sequential ID starting from 1")
    question_no: Optional[str] = Field(None, description="Original question number e.g. Q1")
    question: str = Field(..., description="Full question text")
    answer: str = Field(..., description="Complete reference answer")
    marks: Optional[int] = Field(None, description="Maximum marks allocated")
    rubric: Optional[str] = Field(None, description="Evaluation criteria or key points")


class TeacherQADocument(BaseModel):
    questions: List[TeacherQAItem]


# ── Student extraction ────────────────────────────────────────────────────────

class StudentQAItem(BaseModel):
    id: int = Field(..., description="Must match the teacher question ID")
    question_no: Optional[str] = Field(None, description="Question number e.g. Q1")
    question: Optional[str] = Field(None, description="Question text if restated by student")
    answer: str = Field(..., description="Student's full answer")


class StudentQADocument(BaseModel):
    questions: List[StudentQAItem]


# ── Per-question evaluation ───────────────────────────────────────────────────

class QuestionTags(BaseModel):
    logic: float = Field(..., ge=0, le=10, description="Logical reasoning score 0-10")
    clarity: float = Field(..., ge=0, le=10, description="Clarity of writing score 0-10")
    completeness_pct: float = Field(..., ge=0, le=100, description="Percentage of key points covered")


class QuestionEvalOutput(BaseModel):
    """Structured evaluation output for a single question."""
    awarded_score: float = Field(..., description="Marks awarded, between 0 and max_score")
    compliment: str = Field(..., description="1-2 sentences on what the student did well")
    deduction: Optional[str] = Field(None, description="1-2 sentences on what was missing or wrong, null if perfect")
    tags: QuestionTags


class QuestionResult(BaseModel):
    num: str
    question: str
    awarded_score: float
    max_score: float
    compliment: str
    deduction: Optional[str]
    tags: QuestionTags


# ── Overall evaluation ────────────────────────────────────────────────────────

class OverallEvalOutput(BaseModel):
    """Holistic assessment summary produced by the overall evaluator node."""
    summary: str = Field(..., description="2 sentence overall summary of student performance")
    early_insight: str = Field(..., description="1 sentence notable pattern — key strength or weakness")
    ai_confidence_pct: int = Field(..., ge=0, le=100, description="Confidence in this evaluation 0-100")
    plagiarism_pct: float = Field(..., ge=0, le=100, description="Estimated plagiarism likelihood 0-100, 0 means clean")


# ── Final JSONB shape ─────────────────────────────────────────────────────────

class AIResults(BaseModel):
    summary: str
    early_insight: str
    questions: List[QuestionResult]


# ── LangGraph state ───────────────────────────────────────────────────────────

class AssessmentState(BaseModel):
    model_config = {"arbitrary_types_allowed": True}

    # ── Identity
    assessment_id: str

    # ── File input (bytes from frontend upload)
    teacher_data: Optional[bytes] = None
    teacher_data_filename: Optional[str] = None
    student_data: Optional[bytes] = None
    student_data_filename: Optional[str] = None

    # ── Plain text fallback (when no file uploaded)
    teacher_text_data: Optional[str] = None
    student_text_data: Optional[str] = None

    # ── Intermediate
    teacher_doc: Optional[TeacherQADocument] = None
    student_doc: Optional[StudentQADocument] = None
    question_results: List[QuestionResult] = []

    # ── Final output
    ai_results: Optional[AIResults] = None
    overall_score: Optional[int] = None
    ai_confidence_pct: Optional[int] = None
    similarity_score: Optional[float] = None
    plagiarism_pct: Optional[float] = None

    # ── Error propagation
    error: Optional[str] = None