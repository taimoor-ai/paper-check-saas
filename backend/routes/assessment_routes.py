from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from schemas.assessment_schema import (
    TeacherQADocument,
    StudentQADocument,
    AssessmentResponse
)

from controller.assessment_controller import run_assessment
from controller.auth_controller import get_current_user


# ─────────────────────────────────────────────
# Security
# ─────────────────────────────────────────────
security = HTTPBearer()

router = APIRouter(prefix="/assessment", tags=["Assessment"])


def get_current_user_from_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    return get_current_user(credentials.credentials)


# ─────────────────────────────────────────────
# PROTECTED ENDPOINT
# ─────────────────────────────────────────────
# routes/assessment_route.py

@router.post("/evaluate", response_model=AssessmentResponse)
async def evaluate_paper(
    teacher_doc: TeacherQADocument,
    student_doc: StudentQADocument,
    user=Depends(get_current_user_from_token)
):
    result = await run_assessment(
        teacher_doc.model_dump(),
        student_doc.model_dump(),
        user_id=user["id"]   # ← pass user id down
    )
    return result