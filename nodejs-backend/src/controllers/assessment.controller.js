import { supabase } from "../config/supabase.js";
import { runWorkflow } from "../services/workflow.service.js";
import { HttpError } from "../middleware/errorHandler.js";
import logger from "../utils/logger.js";

const POINTS_COST = 20;

export const evaluatePaper = async (req, res, next) => {
  try {
    const { teacher_doc, student_doc } = req.body;
    const { id: user_id } = req.user;

    // ── 1. Fetch current points balance ────────────────────
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("points_balance")
      .eq("id", user_id)
      .single();

    if (profileError || !profile) {
      throw new HttpError(404, "User profile not found.");
    }

    const balance = profile.points_balance;
    logger.info(`💰 User ${user_id} balance: ${balance} pts`);

    // ── 2. Guard: insufficient points ──────────────────────
    if (balance < POINTS_COST) {
      throw new HttpError(
        402,
        `Insufficient points. You have ${balance} pts, this check costs ${POINTS_COST} pts.`
      );
    }

    // ── 3. Deduct points BEFORE running (optimistic lock) ──
    await supabase
      .from("user_profiles")
      .update({ points_balance: balance - POINTS_COST })
      .eq("id", user_id);

    logger.info(`💸 Deducted ${POINTS_COST} pts from user ${user_id}`);

    // ── 4. Run AI pipeline ─────────────────────────────────
    try {
      const result = await runWorkflow(teacher_doc, student_doc);
      logger.info(`✅ Assessment complete for user ${user_id}`);
      res.json(result);
    } catch (pipelineErr) {
      // ── 5. Refund on failure ───────────────────────────────
      await supabase
        .from("user_profiles")
        .update({ points_balance: balance }) // restore
        .eq("id", user_id);

      logger.error(`❌ Pipeline failed, refunding ${POINTS_COST} pts: ${pipelineErr.message}`);

      throw new HttpError(
        500,
        `Assessment failed. Your ${POINTS_COST} points have been refunded. Error: ${pipelineErr.message}`
      );
    }
  } catch (err) {
    next(err);
  }
};
