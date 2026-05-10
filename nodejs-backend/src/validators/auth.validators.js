import { z } from "zod";
import { HttpError } from "../middleware/errorHandler.js";

export const signupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(2),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const emailSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  access_token: z.string(),
  new_password: z.string().min(6),
});

export const refreshSchema = z.object({
  refresh_token: z.string(),
});

// Middleware factory for Zod validation
export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const msg = result.error.errors.map((e) => e.message).join(", ");
    return next(new HttpError(422, msg));
  }
  req.body = result.data;
  next();
};
