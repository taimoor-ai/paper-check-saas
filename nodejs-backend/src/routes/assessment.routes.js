import { Router } from "express";
import { evaluatePaper } from "../controllers/assessment.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/evaluate", authenticate, evaluatePaper);

export default router;
