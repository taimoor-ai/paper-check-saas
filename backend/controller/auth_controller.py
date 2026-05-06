from fastapi import HTTPException
from db.supabase_client import supabase
from dotenv import load_dotenv
load_dotenv()
import os

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# =========================
# 🚀 SIGNUP
# =========================
def signup_user(email: str, username: str, password: str):
    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {"username": username}
            }
        })

        if response.user is None:
            raise HTTPException(status_code=400, detail="Signup failed")

        return {
            "message": "Signup successful. Check your email to confirm your account.",
            "email": response.user.email,
            "username": username
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================
# 🔐 LOGIN
# =========================
def login_user(email: str, password: str):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if response.user is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "token_type": "bearer",
            "email": response.user.email,
            "username": response.user.user_metadata.get("username")
        }

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


# =========================
# 📧 FORGOT PASSWORD
# — Supabase sends the email automatically via your SMTP
# =========================
def forgot_password(email: str):
    try:
        supabase.auth.reset_password_for_email(
            email,
            options={
                "redirect_to": "f{FRONTEND_URL}/reset-password"
            }
        )
        return {"message": "If the email exists, a reset link has been sent"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================
# 🔑 RESET PASSWORD
# — Frontend sends access_token from the reset link URL
# =========================
def reset_password(access_token: str, new_password: str):
    try:
        supabase.auth.set_session(access_token, "")
        response = supabase.auth.update_user({"password": new_password})

        if response.user is None:
            raise HTTPException(status_code=400, detail="Password reset failed")

        return {"message": "Password reset successful"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================
# 🔁 REFRESH SESSION
# =========================
def refresh_session(refresh_token: str):
    try:
        response = supabase.auth.refresh_session(refresh_token)

        if response.session is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "token_type": "bearer"
        }

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


# =========================
# 🚪 LOGOUT
# =========================
def logout_user():
    try:
        supabase.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# =========================
# 👤 GET CURRENT USER
# =========================
def get_current_user(access_token: str):
    try:
        response = supabase.auth.get_user(access_token)

        if response.user is None:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        user = response.user

        # Fetch points_balance from user_profiles
        profile = supabase.table("user_profiles") \
            .select("points_balance") \
            .eq("id", str(user.id)) \
            .single() \
            .execute()

        points_balance = profile.data.get("points_balance", 0) if profile.data else 0

        return {
            "id": user.id,
            "email": user.email,
            "username": user.user_metadata.get("username"),
            "points_balance": points_balance      # ← new
        }

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))