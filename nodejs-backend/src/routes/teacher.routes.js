import { Router } from "express";
import multer from "multer";
import os from "os";
import { extractTeacherData } from "../controllers/teacher.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

// Multer: save uploaded files to OS temp dir
const upload = multer({ dest: os.tmpdir() });

router.post(
  "/extract-teacher-data",
  authenticate,
  upload.single("file"),   // optional file field named "file"
  extractTeacherData
);

export default router;
