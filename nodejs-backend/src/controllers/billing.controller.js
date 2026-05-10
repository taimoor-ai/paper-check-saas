import Stripe from "stripe";
import { supabase, supabaseAdmin } from "../config/supabase.js";
import { HttpError } from "../middleware/errorHandler.js";
import logger from "../utils/logger.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// ─── CREATE CHECKOUT SESSION ─────────────────────────────
export const createCheckout = async (req, res, next) => {
  try {
    const { price_id, points, amount_usd } = req.body;
    const { id: user_id, email } = req.user;

    logger.info(`🚀 Creating checkout session | user=${user_id} | points=${points}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [{ price: price_id, quantity: 1 }],
      metadata: {
        user_id,
        points: String(points),
        amount_usd: String(amount_usd),
      },
      success_url: `${FRONTEND_URL}/billing?success=true`,
      cancel_url: `${FRONTEND_URL}/billing?cancelled=true`,
    });

    logger.info(`✅ Stripe session created | session_id=${session.id}`);

    // Insert pending billing record
    const { data: insertData } = await supabase.from("billing_history").insert({
      user_id,
      stripe_session_id: session.id,
      points_added: points,
      amount_usd,
      status: "pending",
    });

    logger.info(`🧾 Billing row inserted | response=${JSON.stringify(insertData)}`);

    res.json({ checkout_url: session.url });
  } catch (err) {
    logger.error(`❌ Checkout creation failed: ${err.message}`);
    next(err instanceof HttpError ? err : new HttpError(400, err.message));
  }
};

// ─── STRIPE WEBHOOK HANDLER ──────────────────────────────
export const stripeWebhook = async (req, res, next) => {
  logger.info("========== 🔔 WEBHOOK START ==========");

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // req.body is raw Buffer here (set in server.js for this route)
    event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
    logger.info("✅ Webhook verified");
  } catch (err) {
    logger.error(`❌ Invalid webhook signature: ${err.message}`);
    return next(new HttpError(400, "Invalid webhook signature"));
  }

  const eventType = event.type;
  logger.info(`📌 Event type: ${eventType}`);

  if (eventType === "checkout.session.completed") {
    const session = event.data.object;
    const { id: stripeSessionId, payment_intent: paymentIntentId } = session;
    const { user_id, points, amount_usd } = session.metadata;

    if (!user_id || !points || !amount_usd) {
      logger.error(`❌ Missing metadata | got: ${JSON.stringify(session.metadata)}`);
      return res.json({ message: "Missing metadata" });
    }

    const parsedPoints = parseInt(points, 10);
    const parsedAmount = parseFloat(amount_usd);

    logger.info(`✅ Processing | user=${user_id} | points=${parsedPoints} | amount=$${parsedAmount}`);

    // ── Fetch payment method label ──────────────────────────
    let paymentMethodLabel = null;
    try {
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ["payment_method"],
      });
      const pm = pi.payment_method;
      if (pm?.card) {
        const brand = pm.card.brand.charAt(0).toUpperCase() + pm.card.brand.slice(1);
        paymentMethodLabel = `${brand} •••• ${pm.card.last4}`;
        logger.info(`💳 Payment method: ${paymentMethodLabel}`);
      }
    } catch (err) {
      logger.warn(`⚠️ Could not fetch payment method: ${err.message}`);
    }

    // ── Duplicate check ──────────────────────────────────────
    const { data: existing } = await supabaseAdmin
      .from("billing_history")
      .select("id, status")
      .eq("stripe_session_id", stripeSessionId);

    logger.info(`🔍 Existing record: ${JSON.stringify(existing)}`);

    if (!existing || existing.length === 0) {
      logger.error("❌ No billing record found");
      return res.json({ message: "No billing record" });
    }

    if (existing[0].status === "completed") {
      logger.warn("⚠️ Already processed — skipping");
      return res.json({ message: "Already processed" });
    }

    // ── Update billing_history ───────────────────────────────
    const updatePayload = {
      status: "completed",
      stripe_payment_intent_id: paymentIntentId,
      ...(paymentMethodLabel && { payment_method: paymentMethodLabel }),
    };

    const { data: updatedBilling } = await supabaseAdmin
      .from("billing_history")
      .update(updatePayload)
      .eq("stripe_session_id", stripeSessionId);

    logger.info(`🧾 Billing updated: ${JSON.stringify(updatedBilling)}`);

    // ── Add points to user ───────────────────────────────────
    const { data: profileData } = await supabaseAdmin
      .from("user_profiles")
      .select("points_balance")
      .eq("id", user_id);

    if (!profileData || profileData.length === 0) {
      logger.error("❌ User profile not found");
      return res.json({ message: "User not found" });
    }

    const currentBalance = profileData[0].points_balance;
    const newBalance = currentBalance + parsedPoints;

    await supabaseAdmin
      .from("user_profiles")
      .update({ points_balance: newBalance })
      .eq("id", user_id);

    logger.info(`✅ Points updated: ${currentBalance} → ${newBalance}`);
  }

  res.json({ received: true });
};

// ─── GET BILLING HISTORY ─────────────────────────────────
export const getBillingHistory = async (req, res, next) => {
  try {
    const { id: user_id } = req.user;

    logger.info(`📋 Fetching billing history for user=${user_id}`);

    const { data, error } = await supabase
      .from("billing_history")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) throw new HttpError(400, error.message);

    logger.info(`📊 Billing history rows: ${(data || []).length}`);

    res.json(data || []);
  } catch (err) {
    next(err);
  }
};
