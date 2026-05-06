from pydantic import BaseModel, Field, field_validator
from typing import List, Optional



class StudentQAItem(BaseModel):
    id: int = Field(..., description="Must match teacher question ID")
    question_no: Optional[str] = Field(None, description="Question number")
    question: Optional[str] = Field(None, description="Optional question text")
    answer: str = Field(..., description="Student answer")

class StudentQADocument(BaseModel):
    questions: List[StudentQAItem]