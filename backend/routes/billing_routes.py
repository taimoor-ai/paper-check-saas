from fastapi import APIRouter, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from schemas.billing_schema import CreateCheckoutRequest
from controller.billing_controller import (
    create_checkout_session,
    handle_stripe_webhook,
    get_billing_history
)
from controller.auth_controller import get_current_user

security = HTTPBearer()

router = APIRouter(prefix="/billing", tags=["Billing"])


def get_current_user_from_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    return get_current_user(credentials.credentials)


@router.post(
    "/create-checkout",
    openapi_extra={"security": [{"BearerAuth": []}]}
)
def create_checkout(
    payload: CreateCheckoutRequest,
    user=Depends(get_current_user_from_token)
):
    return create_checkout_session(
        user_id=user["id"],
        email=user["email"],
        price_id=payload.price_id,
        points=payload.points,
        amount_usd=payload.amount_usd,
    )


@router.post("/webhook")
async def stripe_webhook(request: Request):
    # No auth here — Stripe calls this directly
    return await handle_stripe_webhook(request)


@router.get(
    "/history",
    openapi_extra={"security": [{"BearerAuth": []}]}
)
def billing_history(user=Depends(get_current_user_from_token)):
    return get_billing_history(user["id"])