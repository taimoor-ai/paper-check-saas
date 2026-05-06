import time
import os
from fastapi import HTTPException
from llama_cloud import LlamaCloud
from schemas.teacher_schema import TeacherQADocument


def run_extraction(tmp_path: str) -> TeacherQADocument:
    client = LlamaCloud(api_key=os.environ["LLAMA_CLOUD_API_KEY"])

    # Upload file
    with open(tmp_path, "rb") as f:
        uploaded_file = client.files.create(file=f, purpose="extract")

    # Start extraction job
    job = client.extract.create(
        file_input=uploaded_file.id,
        configuration={
            "data_schema": TeacherQADocument.model_json_schema(),
            "extraction_target": "per_doc",
            "tier": "agentic",
        },
    )

    # Polling
    max_wait, elapsed = 120, 0
    while job.status not in ("COMPLETED", "FAILED", "CANCELLED"):
        if elapsed >= max_wait:
            raise HTTPException(status_code=504, detail="Extraction timed out after 120 seconds.")
        time.sleep(2)
        elapsed += 2
        job = client.extract.get(job.id)

    if job.status in ("FAILED", "CANCELLED"):
        raise HTTPException(status_code=422, detail=f"Extraction job {job.status.lower()}.")

    return TeacherQADocument(**job.extract_result)