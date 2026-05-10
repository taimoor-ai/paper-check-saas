import logger from "../utils/logger.js";

export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error(`[${status}] ${message}`);

  res.status(status).json({ detail: message });
};

// Helper to create HTTP errors (mimics FastAPI's HTTPException)
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
