import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { HttpError } from "../middleware/errorHandler.js";
import logger from "../utils/logger.js";

const LLAMA_API_KEY = process.env.LLAMA_CLOUD_API_KEY;
const LLAMA_BASE = "https://api.cloud.llamaindex.ai/api/v1";

const headers = () => ({
  Authorization: `Bearer ${LLAMA_API_KEY}`,
});

/**
 * Runs LlamaCloud structured extraction on a file path.
 * Equivalent to Python's run_extraction(tmp_path)
 *
 * @param {string} filePath - absolute path to the temp file
 * @param {object} schema   - JSON schema for structured output
 * @returns {Promise<object>} - extracted structured data
 */
export const runExtraction = async (filePath, schema) => {
  // 1. Upload file
  logger.info(`📤 Uploading file to LlamaCloud: ${filePath}`);
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("purpose", "extract");

  const uploadRes = await axios.post(`${LLAMA_BASE}/files`, form, {
    headers: { ...headers(), ...form.getHeaders() },
  });

  const fileId = uploadRes.data.id;
  logger.info(`✅ File uploaded | id=${fileId}`);

  // 2. Start extraction job
  const jobRes = await axios.post(
    `${LLAMA_BASE}/extraction/jobs`,
    {
      file_id: fileId,
      extraction_target: "per_doc",
      tier: "agentic",
      data_schema: schema,
    },
    { headers: headers() }
  );

  const jobId = jobRes.data.id;
  logger.info(`🏃 Extraction job started | id=${jobId}`);

  // 3. Poll until done
  const MAX_WAIT = 120_000; // 120 seconds
  const POLL_INTERVAL = 2_000;
  let elapsed = 0;

  while (elapsed < MAX_WAIT) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL));
    elapsed += POLL_INTERVAL;

    const statusRes = await axios.get(`${LLAMA_BASE}/extraction/jobs/${jobId}`, {
      headers: headers(),
    });

    const { status, extract_result } = statusRes.data;

    if (status === "COMPLETED") {
      logger.info(`✅ Extraction complete | job=${jobId}`);
      return extract_result;
    }

    if (status === "FAILED" || status === "CANCELLED") {
      throw new HttpError(422, `Extraction job ${status.toLowerCase()}`);
    }

    logger.info(`⏳ Polling... status=${status} elapsed=${elapsed / 1000}s`);
  }

  throw new HttpError(504, "Extraction timed out after 120 seconds");
};
