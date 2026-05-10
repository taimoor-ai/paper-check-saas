import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import billingRoutes from "./routes/billing.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import studentRoutes from "./routes/student.routes.js";
import assessmentRoutes from "./routes/assessment.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";

const app = express();
const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ─── CORS ────────────────────────────────────────────────
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// ─── Body parsers ────────────────────────────────────────
// NOTE: /billing/webhook needs raw body BEFORE json parser
app.use(
  "/billing/webhook",
  express.raw({ type: "application/json" })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────────────────
app.use("/auth", authRoutes);
app.use("/billing", billingRoutes);
app.use("/teacher", teacherRoutes);
app.use("/student", studentRoutes);
app.use("/assessment", assessmentRoutes);

// ─── Health check ────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ message: "API is running" });
});

// ─── Global error handler ────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
