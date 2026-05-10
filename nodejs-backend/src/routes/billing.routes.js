import { Router } from "express";
import {
  createCheckout,
  stripeWebhook,
  getBillingHistory,
} from "../controllers/billing.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// Protected routes
router.post("/create-checkout", authenticate, createCheckout);
router.get("/history", authenticate, getBillingHistory);

// Stripe webhook — NO auth (Stripe calls this directly)
// Raw body parsing is configured in server.js for this path
router.post("/webhook", stripeWebhook);

export default router;
