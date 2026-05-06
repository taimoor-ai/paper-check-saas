from pydantic import BaseModel, Field, field_validator
from typing import List, Optional


class TeacherQAItem(BaseModel):
    id: int = Field(..., description="Unique ID of the question")
    question_no: Optional[str] = Field(None, description="Original question number")
    question: str = Field(..., description="The question text")
    answer: str = Field(..., description="Reference answer (ground truth)")
    marks: Optional[int] = Field(10, description="Maximum marks")

    @field_validator("marks", mode="before")
    @classmethod
    def default_marks_if_none(cls, v):
        return 10 if v is None else v


class TeacherQADocument(BaseModel):
    questions: List[TeacherQAItem]
    