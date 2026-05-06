import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputs = useRef([]);

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0)
      inputs.current[idx - 1]?.focus();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 font-body">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-900/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-6">
            <span
              className="material-symbols-outlined text-amber-600"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: "28px" }}
            >
              mark_email_read
            </span>
          </div>

          <h1 className="font-headline text-xl font-bold text-gray-900 mb-2">
            Check your inbox
          </h1>
          <p className="text-gray-500 text-sm font-body leading-relaxed max-w-[260px] mx-auto mb-8">
            We sent a 6-digit verification code to your email address.
          </p>

          {/* OTP input row */}
          <div className="flex gap-2.5 justify-center mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-11 h-13 text-center bg-gray-50 border border-gray-200 rounded-xl font-headline font-bold text-lg text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/10 transition-all"
                style={{ height: "52px" }}
              />
            ))}
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full h-11 bg-gray-900 text-white font-headline font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-[0.98] transition-all shadow-sm"
          >
            Verify email
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              arrow_forward
            </span>
          </button>

          <p className="text-sm text-gray-400 font-body mt-5">
            Didn't receive it?{" "}
            <button className="font-semibold text-gray-700 hover:text-amber-600 transition-colors">
              Resend code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}