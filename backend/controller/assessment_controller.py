# controller/assessment_controller.py

from fastapi import HTTPException
from supabase import create_client
from graph.workflow import workflow
import os
from db.supabase_client import supabase

POINTS_COST = 20


async def run_assessment(teacher_doc: dict, student_doc: dict, user_id: str) -> dict:

    # ── 1. Fetch current points balance ───────────────────────────────────────
    profile = (
        supabase.table("user_profiles")
        .select("points_balance")
        .eq("id", user_id)
        .single()
        .execute()
    )

    if not profile.data:
        raise HTTPException(status_code=404, detail="User profile not found.")

    balance = profile.data["points_balance"]

    # ── 2. Guard: insufficient points ─────────────────────────────────────────
    if balance < POINTS_COST:
        raise HTTPException(
            status_code=402,
            detail=f"Insufficient points. You have {balance} pts, this check costs {POINTS_COST} pts."
        )

    # ── 3. Deduct points BEFORE running (optimistic lock) ────────────────────
    supabase.table("user_profiles").update({
        "points_balance": balance - POINTS_COST
    }).eq("id", user_id).execute()

    # ── 4. Run the LangGraph pipeline ─────────────────────────────────────────
    try:
        result = await workflow.ainvoke({
            "teacher_doc":      teacher_doc,
            "student_doc":      student_doc,
            "question_results": [],
            "similarity_score": 0.0,
            "plagiarism_pct":   0.0,
            "ai_results":       {},
            "overall_score":    0,
            "ai_confidence_pct": 0,
        })

        return result

    except Exception as e:
        # ── 5. Refund on failure ───────────────────────────────────────────────
        supabase.table("user_profiles").update({
            "points_balance": balance  # restore original balance
        }).eq("id", user_id).execute()

        raise HTTPException(
            status_code=500,
            detail=f"Assessment failed. Your {POINTS_COST} points have been refunded. Error: {str(e)}"
        )