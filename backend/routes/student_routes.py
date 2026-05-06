import os
import tempfile
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import Optional

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from controller.auth_controller import get_current_user

from controller.teacher_controller import run_extraction
from schemas.student_schema import StudentQADocument

router = APIRouter(prefix="/student", tags=["Student"])

security = HTTPBearer()


def get_current_user_from_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    return get_current_user(credentials.credentials)


@router.post(
    "/extract-student-data",
    response_model=StudentQADocument,
    openapi_extra={"security": [{"BearerAuth": []}]}
)
async def extract_student_data(
    file: Optional[UploadFile] = File(default=None),
    text: Optional[str] = Form(default=None),
    user=Depends(get_current_user_from_token)  # 🔐 PROTECTION ADDED
):
    if file is None and text is None:
        raise HTTPException(
            status_code=400,
            detail="Provide either a 'file' upload or a 'text' field."
        )

    if file is not None and text is not None:
        raise HTTPException(
            status_code=400,
            detail="Provide either a 'file' upload or a 'text' field — not both."
        )

    tmp_path = None

    try:
        # File mode
        if file:
            suffix = os.path.splitext(file.filename)[-1] or ".tmp"
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(await file.read())
                tmp_path = tmp.name

        # Text mode
        else:
            text = text.strip()
            if not text:
                raise HTTPException(status_code=400, detail="Text cannot be empty.")

            with tempfile.NamedTemporaryFile(delete=False, suffix=".txt", mode="w", encoding="utf-8") as tmp:
                tmp.write(text)
                tmp_path = tmp.name

        return run_extraction(tmp_path)

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)