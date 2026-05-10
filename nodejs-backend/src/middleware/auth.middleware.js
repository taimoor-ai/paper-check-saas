import { supabase } from "../config/supabase.js";
import { HttpError } from "./errorHandler.js";

/**
 * Validates the Bearer token and attaches user to req.user
 * Equivalent to FastAPI's `get_current_user` dependency
 */
export const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError(401, "Missing or invalid Authorization header");
    }

    const token = authHeader.split(" ")[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new HttpError(401, "Invalid or expired token");
    }

    const user = data.user;

    // Fetch points_balance from user_profiles table
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("points_balance")
      .eq("id", user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email,
      username: user.user_metadata?.username,
      points_balance: profile?.points_balance ?? 0,
    };

    next();
  } catch (err) {
    next(err);
  }
};
