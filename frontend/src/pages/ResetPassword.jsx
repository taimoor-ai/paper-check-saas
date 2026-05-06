import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const inputBase = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#f9fafb",
  };
  const onFocus = e => (e.currentTarget.style.border = "1px solid rgba(245,158,11,0.5)");
  const onBlur  = e => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)");

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");
    const type  = params.get("type");

    if (!token || type !== "recovery") {
      setTokenError(true);
      return;
    }

    setAccessToken(token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Updating password...");

    try {
      await api.post("/auth/reset-password", {
        access_token: accessToken,
        new_password: newPassword,
      });

      toast.success("Password updated! Please log in.", { id: loadingToast });

      setTimeout(() => navigate("/login"), 1000);

    } catch (err) {
      const message = err.response?.data?.detail || "Reset failed. The link may have expired.";
      toast.error(message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-body" style={{ background: "#0d1117" }}>

      {/* ── LEFT — Branding panel ──────────────────────────── */}
      <div
        className="hidden lg:flex flex-col w-[44%] min-h-screen justify-between px-12 py-10"
        style={{ background: "#111827", borderRight: "1px solid rgba(255,255,255,0.05)" }}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-gray-900" style={{ fontVariationSettings: "'FILL' 1", fontSize: "20px" }}>auto_awesome</span>
          </div>
          <span className="text-white font-headline font-bold text-lg">Editorial AI</span>
        </Link>

        <div className="max-w-xs">
          <span className="inline-flex items-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-widest font-headline" style={{ color: "#10b981" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Secure account
          </span>

          <h1 className="font-headline text-4xl font-bold text-white leading-tight mb-4">
            Set a new{" "}
            <span style={{ color: "#f59e0b" }}>password.</span>
          </h1>

          <p className="text-sm leading-relaxed mb-8" style={{ color: "#4b5563" }}>
            Ensure your new password is strong and unique to protect your workspace.
          </p>
        </div>

        <p className="text-xs" style={{ color: "#1f2937" }}>© 2024 Editorial AI. All rights reserved.</p>
      </div>

      {/* ── RIGHT — Form panel ────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-900" style={{ fontVariationSettings: "'FILL' 1", fontSize: "16px" }}>auto_awesome</span>
            </div>
            <span className="font-headline font-bold text-white text-lg">Editorial AI</span>
          </div>

          {tokenError ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 mx-auto" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <span className="material-symbols-outlined text-red-500" style={{ fontSize: "26px" }}>link_off</span>
              </div>
              <h1 className="font-headline text-2xl font-bold text-white mb-2">Link invalid or expired</h1>
              <p className="text-sm mb-7" style={{ color: "#6b7280" }}>
                This reset link is no longer valid. Please request a new one.
              </p>
              <Link
                to="/forgot-password"
                className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold font-headline transition-all active:scale-[0.98]"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#d1d5db" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
                Request new link
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="font-headline text-2xl font-bold text-white mb-1">Reset Password</h2>
                <p className="text-sm" style={{ color: "#6b7280" }}>Enter and confirm your new password below.</p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* New Password */}
                <div>
                  <label htmlFor="new-password" className="block text-xs font-semibold font-headline mb-1.5" style={{ color: "#6b7280" }}>New password</label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full h-11 rounded-xl px-4 pr-12 text-sm placeholder:text-gray-600 transition-all font-body"
                      style={inputBase}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: "#4b5563" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#9ca3af")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#4b5563")}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{showPass ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm-password" className="block text-xs font-semibold font-headline mb-1.5" style={{ color: "#6b7280" }}>Confirm password</label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPass ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full h-11 rounded-xl px-4 pr-12 text-sm placeholder:text-gray-600 transition-all font-body"
                      style={{
                        ...inputBase,
                        border: confirmPassword && newPassword !== confirmPassword 
                          ? "1px solid rgba(239,68,68,0.5)" 
                          : inputBase.border
                      }}
                      onFocus={onFocus}
                      onBlur={e => {
                        if (confirmPassword && newPassword !== confirmPassword) {
                          e.currentTarget.style.border = "1px solid rgba(239,68,68,0.5)";
                        } else {
                          onBlur(e);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: "#4b5563" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#9ca3af")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#4b5563")}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{showConfirmPass ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                  {/* Live mismatch warning */}
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-500 font-headline">Passwords don't match</p>
                  )}
                </div>

                  <button
                  type="submit"
                  disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                  className="w-full h-11 font-headline font-bold text-sm rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  style={{
                    background: (newPassword && confirmPassword && newPassword === confirmPassword && !loading) ? "#f59e0b" : "rgba(245,158,11,0.5)",
                    color: "#111827",
                    boxShadow: (newPassword && confirmPassword && newPassword === confirmPassword && !loading) ? "0 4px 20px rgba(245,158,11,0.3)" : "none",
                    cursor: loading ? "not-allowed" : "pointer"
                  }}
                >
                  {loading ? "Updating..." : "Set new password"}
                  {!loading && (
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
                  )}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm mt-8" style={{ color: "#4b5563" }}>
            Back to{" "}
            <Link to="/login" className="font-semibold text-amber-500 hover:text-amber-400 transition-colors">Sign in</Link>
          </p>

        </div>
      </div>
    </div>
  );
}