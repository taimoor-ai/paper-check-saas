import { Router } from "express";
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  refreshSession,
  getMe,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  validate,
  signupSchema,
  loginSchema,
  emailSchema,
  resetPasswordSchema,
  refreshSchema,
} from "../validators/auth.validators.js";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", authenticate, logout);
router.post("/forgot-password", validate(emailSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/refresh", validate(refreshSchema), refreshSession);
router.get("/me", authenticate, getMe);

export default router;
