import { supabase } from "../config/supabase.js";
import { HttpError } from "../middleware/errorHandler.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ─── SIGNUP ──────────────────────────────────────────────
export const signup = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error || !data.user) {
      throw new HttpError(400, error?.message || "Signup failed");
    }

    res.status(201).json({
      message: "Signup successful. Check your email to confirm your account.",
      email: data.user.email,
      username,
    });
  } catch (err) {
    next(err);
  }
};

// ─── LOGIN ───────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new HttpError(401, error?.message || "Invalid credentials");
    }

    res.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      token_type: "bearer",
      email: data.user.email,
      username: data.user.user_metadata?.username,
    });
  } catch (err) {
    next(err);
  }
};

// ─── LOGOUT ──────────────────────────────────────────────
export const logout = async (_req, res, next) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new HttpError(400, error.message);
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

// ─── FORGOT PASSWORD ─────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${FRONTEND_URL}/reset-password`,
    });

    if (error) throw new HttpError(400, error.message);

    res.json({ message: "If the email exists, a reset link has been sent" });
  } catch (err) {
    next(err);
  }
};

// ─── RESET PASSWORD ──────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const { access_token, new_password } = req.body;

    // Set session with the token from the reset email link
    await supabase.auth.setSession({ access_token, refresh_token: "" });

    const { data, error } = await supabase.auth.updateUser({
      password: new_password,
    });

    if (error || !data.user) {
      throw new HttpError(400, error?.message || "Password reset failed");
    }

    res.json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};

// ─── REFRESH SESSION ─────────────────────────────────────
export const refreshSession = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;

    const { data, error } = await supabase.auth.refreshSession({ refresh_token });

    if (error || !data.session) {
      throw new HttpError(401, error?.message || "Invalid refresh token");
    }

    res.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      token_type: "bearer",
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET CURRENT USER (/me) ──────────────────────────────
export const getMe = (req, res) => {
  // req.user is already populated by auth middleware
  res.json(req.user);
};
