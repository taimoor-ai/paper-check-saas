import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api"; // adjust path to your axios instance

export default function Register() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputBase = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#f9fafb",
  };
  const onFocus = e => (e.currentTarget.style.border = "1px solid rgba(245,158,11,0.5)");
  const onBlur  = e => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;

    setLoading(true);
    setError("");

    const loadingToast = toast.loading("Creating your account...");

    try {
      await api.post("/auth/signup", { email, username, password });

      toast.success("Account created! Check your email to confirm.", { id: loadingToast });

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      const message = err.response?.data?.detail || "Signup failed. Please try again.";
      setError(message);
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
            Free to start
          </span>

          <h1 className="font-headline text-4xl font-bold text-white leading-tight mb-4">
            Elevate your{" "}
            <span style={{ color: "#f59e0b" }}>academic grading</span>{" "}
            with AI precision.
          </h1>

          <p className="text-sm leading-relaxed mb-8" style={{ color: "#4b5563" }}>
            Join 2,500+ educators who grade faster and give better feedback every day.
          </p>

          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.15)" }}
          >
            <span className="material-symbols-outlined text-amber-400 shrink-0" style={{ fontVariationSettings: "'FILL' 1", fontSize: "20px" }}>token</span>
            <div>
              <p className="text-amber-300 font-headline font-bold text-sm leading-none mb-0.5">200 free points on sign-up</p>
              <p className="text-xs" style={{ color: "#4b5563" }}>$1 = 100 pts · 20 pts per check · No card required</p>
            </div>
          </div>
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

          {/* Heading */}
          <div className="mb-8">
            <h2 className="font-headline text-2xl font-bold text-white mb-1">Create your workspace</h2>
            <p className="text-sm" style={{ color: "#6b7280" }}>Sign up and get 200 free points instantly.</p>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="mb-4 px-4 py-3 rounded-xl text-sm"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* Full name → username */}
            <div>
              <label htmlFor="fullname" className="block text-xs font-semibold font-headline mb-1.5" style={{ color: "#6b7280" }}>Full name</label>
              <input
                id="fullname"
                type="text"
                placeholder="Dr. Julian Reed"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full h-11 rounded-xl px-4 text-sm placeholder:text-gray-600 transition-all font-body"
                style={inputBase}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-xs font-semibold font-headline mb-1.5" style={{ color: "#6b7280" }}>Email address</label>
              <input
                id="reg-email"
                type="email"
                placeholder="julian@university.edu"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-11 rounded-xl px-4 text-sm placeholder:text-gray-600 transition-all font-body"
                style={inputBase}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-xs font-semibold font-headline mb-1.5" style={{ color: "#6b7280" }}>Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded cursor-pointer"
                style={{ accentColor: "#f59e0b" }}
              />
              <label htmlFor="terms" className="text-xs leading-relaxed cursor-pointer" style={{ color: "#6b7280" }}>
                I agree to the{" "}
                <a href="#" className="text-amber-500 hover:text-amber-400 transition-colors">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-amber-500 hover:text-amber-400 transition-colors">Privacy Policy</a>.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!agreed || loading}
              className="w-full h-11 font-headline font-bold text-sm rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
              style={{
                background: agreed && !loading ? "#f59e0b" : "#374151",
                color: agreed && !loading ? "#111827" : "#6b7280",
                boxShadow: agreed && !loading ? "0 4px 20px rgba(245,158,11,0.3)" : "none",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}>token</span>
              {loading ? "Creating account..." : "Create account · Get 200 pts"}
            </button>
          </form>

          <p className="text-center text-sm mt-8" style={{ color: "#4b5563" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-amber-500 hover:text-amber-400 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}