import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const inputBase = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#f9fafb",
  };
  const onFocus = e => (e.currentTarget.style.border = "1px solid rgba(245,158,11,0.5)");
  const onBlur  = e => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading("Sending reset link...");

    try {
      await api.post("/auth/forgot-password", { email });

      toast.success("Reset link sent! Check your inbox.", { id: loadingToast });
      setSent(true);

    } catch (err) {
      const message = err.response?.data?.detail || "Something went wrong. Try again.";
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
          <span className="inline-flex items-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-widest font-headline" style={{ color: "#f59e0b" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Account Recovery
          </span>

          <h1 className="font-headline text-4xl font-bold text-white leading-tight mb-4">
            Regain access to your{" "}
            <span style={{ color: "#f59e0b" }}>workspace.</span>
          </h1>

          <p className="text-sm leading-relaxed mb-8" style={{ color: "#4b5563" }}>
            We'll help you get back to grading in no time.
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

          <div className="mb-8">
            <h2 className="font-headline text-2xl font-bold text-white mb-1">
              {sent ? "Check your email" : "Password recovery"}
            </h2>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              {sent 
                ? `We sent a reset link to ${email}. It may take a minute.` 
                : "Enter your email to receive a reset link."}
            </p>
          </div>

          {sent ? (
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold font-headline transition-all active:scale-[0.98]"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#d1d5db" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
            >
              Try a different email
            </button>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="recovery-email" className="block text-xs font-semibold font-headline mb-1.5" style={{ color: "#6b7280" }}>
                  Email address
                </label>
                <input
                  id="recovery-email"
                  type="email"
                  placeholder="name@university.edu"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-11 rounded-xl px-4 text-sm placeholder:text-gray-600 transition-all font-body"
                  style={inputBase}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 font-headline font-bold text-sm rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                style={{
                  background: !loading ? "#f59e0b" : "#374151",
                  color: !loading ? "#111827" : "#6b7280",
                  boxShadow: !loading ? "0 4px 20px rgba(245,158,11,0.3)" : "none",
                }}
              >
                {loading ? "Sending..." : "Send reset link"}
                {!loading && (
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                    arrow_forward
                  </span>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-sm mt-8" style={{ color: "#4b5563" }}>
            Remembered your password?{" "}
            <Link to="/login" className="font-semibold text-amber-500 hover:text-amber-400 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}