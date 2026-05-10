import fs from "fs";
import path from "path";
import os from "os";
import { runExtraction } from "../services/llamaExtract.service.js";
import { HttpError } from "../middleware/errorHandler.js";
import logger from "../utils/logger.js";

// JSON Schema for student Q&A document (used by LlamaCloud)
const STUDENT_SCHEMA = {
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
        },
        required: ["id", "answer"],
      },
    },
  },
  required: ["questions"],
};

export const extractStudentData = async (req, res, next) => {
  let tmpPath = null;

  try {
    const file = req.file;
    const text = req.body.text;

    if (!file && !text) {
      throw new HttpError(400, "Provide either a 'file' upload or a 'text' field.");
    }

    if (file && text) {
      throw new HttpError(400, "Provide either a 'file' upload or a 'text' field — not both.");
    }

    if (file) {
      tmpPath = file.path;
      logger.info(`📁 Student file received: ${file.originalname}`);
    } else {
      const trimmed = text.trim();
      if (!trimmed) throw new HttpError(400, "Text cannot be empty.");

      tmpPath = path.join(os.tmpdir(), `student_${Date.now()}.txt`);
      fs.writeFileSync(tmpPath, trimmed, "utf-8");
      logger.info(`📝 Student text written to: ${tmpPath}`);
    }

    const result = await runExtraction(tmpPath, STUDENT_SCHEMA);

    res.json(result);
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(500, err.message));
  } finally {
    if (tmpPath && fs.existsSync(tmpPath)) {
      fs.unlinkSync(tmpPath);
    }
  }
};
