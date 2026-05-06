import stripe
import os
import logging
from fastapi import HTTPException, Request
from db.supabase_client import supabase , supabase_admin

# =========================
# 🪵 LOGGER SETUP
# =========================
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("billing")

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")


# =========================
# 💳 CREATE CHECKOUT SESSION
# =========================
def create_checkout_session(user_id: str, email: str, price_id: str, points: int, amount_usd: float):
    try:
        logger.info(f"🚀 Creating checkout session | user={user_id} | points={points}")

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            customer_email=email,
            line_items=[{"price": price_id, "quantity": 1}],
            metadata={
                "user_id": user_id,
                "points": points,
                "amount_usd": amount_usd,
            },
            success_url=f"{FRONTEND_URL}/billing?success=true",
            cancel_url=f"{FRONTEND_URL}/billing?cancelled=true",
        )

        logger.info(f"✅ Stripe session created | session_id={session.id}")

        # Insert pending row
        insert_res = supabase.table("billing_history").insert({
            "user_id": user_id,
            "stripe_session_id": session.id,
            "points_added": points,
            "amount_usd": amount_usd,
            "status": "pending",
        }).execute()

        logger.info(f"🧾 Billing row inserted | response={insert_res.data}")

        return {"checkout_url": session.url}

    except Exception as e:
        logger.error(f"❌ Checkout creation failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


# =========================
# 🔔 STRIPE WEBHOOK HANDLER
# =========================
async def handle_stripe_webhook(request: Request):
    logger.info("========== 🔔 WEBHOOK START ==========")
    print("\n\n\n")
    print("Request data ", request)
    print("\n\n\n")
    
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    logger.info("📦 Payload received")
    logger.info(f"🔐 Signature header: {sig_header}")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
        logger.info("✅ Webhook verified")
    except stripe.error.SignatureVerificationError:
        logger.error("❌ Invalid webhook signature")
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    event_type = event["type"]
    logger.info(f"📌 Event type: {event_type}")

    if event_type == "checkout.session.completed":
        session           = event["data"]["object"]
        stripe_session_id = session["id"]
        payment_intent_id = session["payment_intent"]

        user_id    = session["metadata"]["user_id"]
        points     = int(session["metadata"]["points"])
        amount_usd = float(session["metadata"]["amount_usd"])

        if not user_id or not points or not amount_usd:
            logger.error(f"❌ Missing metadata | got: {session['metadata']}")
            return {"message": "Missing metadata"}

        logger.info(f"✅ Processing | user={user_id} | points={points} | amount=${amount_usd}")

        # ── Fetch payment method details from PaymentIntent ──
        payment_method_label = None
        try:
            pi = stripe.PaymentIntent.retrieve(
                payment_intent_id,
                expand=["payment_method"]   # ← this gives us card details
            )
            pm = pi.payment_method
            if pm and pm.card:
                brand = pm.card.brand.capitalize()          # e.g. "Visa"
                last4 = pm.card.last4                       # e.g. "4242"
                payment_method_label = f"{brand} •••• {last4}"  # "Visa •••• 4242"
                logger.info(f"💳 Payment method: {payment_method_label}")
        except Exception as e:
            logger.warning(f"⚠️ Could not fetch payment method: {e}")

        # ── Duplicate check ──────────────────────────────────
        existing_res = supabase_admin.table("billing_history") \
            .select("id, status") \
            .eq("stripe_session_id", stripe_session_id) \
            .execute()

        logger.info(f"🔍 Existing record: {existing_res.data}")

        if not existing_res.data:
            logger.error("❌ No billing record found")
            return {"message": "No billing record"}

        if existing_res.data[0]["status"] == "completed":
            logger.warning("⚠️ Already processed — skipping")
            return {"message": "Already processed"}

        # ── Update billing_history ───────────────────────────
        update_payload = {
            "status": "completed",
            "stripe_payment_intent_id": payment_intent_id,
        }
        if payment_method_label:
            update_payload["payment_method"] = payment_method_label

        update_res = supabase_admin.table("billing_history").update(
            update_payload
        ).eq("stripe_session_id", stripe_session_id).execute()

        logger.info(f"🧾 Billing updated: {update_res.data}")

        # ── Add points to user ───────────────────────────────
        profile_res = supabase_admin.table("user_profiles") \
            .select("points_balance") \
            .eq("id", user_id) \
            .execute()

        if not profile_res.data:
            logger.error("❌ User profile not found")
            return {"message": "User not found"}

        current_balance = profile_res.data[0]["points_balance"]
        new_balance     = current_balance + points

        supabase_admin.table("user_profiles").update({
            "points_balance": new_balance
        }).eq("id", user_id).execute()

        logger.info(f"✅ Points updated: {current_balance} → {new_balance}")

# =========================
# 📋 GET BILLING HISTORY
# =========================
def get_billing_history(user_id: str):
    try:
        logger.info(f"📋 Fetching billing history for user={user_id}")

        result = supabase.table("billing_history") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .execute()

        logger.info(f"📊 Billing history rows: {len(result.data or [])}")

        return result.data or []

    except Exception as e:
        logger.error(f"❌ Failed to fetch billing history: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))