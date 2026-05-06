from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from schemas.auth_schema import (
    UserSignup, UserLogin, EmailRequest,
    ResetPasswordRequest, RefreshRequest
)
from controller.auth_controller import (
    signup_user, login_user, forgot_password,
    reset_password, refresh_session,
    logout_user, get_current_user
)

security = HTTPBearer()

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup")
def signup(data: UserSignup):
    return signup_user(data.email, data.username, data.password)


@router.post("/login")
def login(data: UserLogin):
    return login_user(data.email, data.password)


@router.post(
    "/logout",
    openapi_extra={"security": [{"BearerAuth": []}]}  # 👈 add this
)
def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return logout_user()


@router.post("/forgot-password")
def forgot(payload: EmailRequest):
    return forgot_password(payload.email)


@router.post("/reset-password")
def reset(payload: ResetPasswordRequest):
    return reset_password(payload.access_token, payload.new_password)


@router.post("/refresh")
def refresh(payload: RefreshRequest):
    return refresh_session(payload.refresh_token)


@router.get(
    "/me",
    openapi_extra={"security": [{"BearerAuth": []}]}  
)
def me(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    return get_current_user(token)