import { Router } from "express";
import multer from "multer";
import os from "os";
import { extractStudentData } from "../controllers/student.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

const upload = multer({ dest: os.tmpdir() });

router.post(
  "/extract-student-data",
  authenticate,
  upload.single("file"),
  extractStudentData
);

export default router;
