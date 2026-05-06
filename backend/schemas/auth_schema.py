from pydantic import BaseModel, EmailStr
class UserSignup(BaseModel):
    email: EmailStr
    username: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class EmailRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    access_token: str  # extracted from URL by frontend
    new_password: str


class RefreshRequest(BaseModel):
    refresh_token: str