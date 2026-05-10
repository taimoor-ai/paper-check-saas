import fs from "fs";
import path from "path";
import os from "os";
import { runExtraction } from "../services/llamaExtract.service.js";
import { HttpError } from "../middleware/errorHandler.js";
import logger from "../utils/logger.js";

// JSON Schema for teacher Q&A document (used by LlamaCloud)
const TEACHER_SCHEMA = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          question_no: { type: "string" },
          question: { type: "string" },
          answer: { type: "string" },
          marks: { type: "integer" },
          rubric: { type: "string" },
        },
        required: ["id", "question", "answer"],
      },
    },
  },
  required: ["questions"],
};

export const extractTeacherData = async (req, res, next) => {
  let tmpPath = null;

  try {
    const file = req.file;       // multer upload
    const text = req.body.text;

    if (!file && !text) {
      throw new HttpError(400, "Provide either a 'file' upload or a 'text' field.");
    }

    if (file && text) {
      throw new HttpError(400, "Provide either a 'file' upload or a 'text' field — not both.");
    }

    // Write to temp file
    if (file) {
      // multer already saved it to disk (diskStorage) — use its path
      tmpPath = file.path;
      logger.info(`📁 File received: ${file.originalname}`);
    } else {
      const trimmed = text.trim();
      if (!trimmed) throw new HttpError(400, "Text cannot be empty.");

      tmpPath = path.join(os.tmpdir(), `teacher_${Date.now()}.txt`);
      fs.writeFileSync(tmpPath, trimmed, "utf-8");
      logger.info(`📝 Text written to temp file: ${tmpPath}`);
    }

    const result = await runExtraction(tmpPath, TEACHER_SCHEMA);

    res.json(result);
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(500, err.message));
  } finally {
    // Cleanup temp file
    if (tmpPath && fs.existsSync(tmpPath)) {
      fs.unlinkSync(tmpPath);
    }
  }
};
