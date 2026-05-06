import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "#0d1117" }}>
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.08) 0%, transparent 65%)",
        }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <div
          className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-8"
          style={{ background: "rgba(245,158,11,0.10)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Get started in under 2 minutes
        </div>

        <h2
          className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight mb-6"
          style={{ color: "#f9fafb" }}
        >
          Ready to reclaim your
          <br />
          <span style={{ color: "#f59e0b" }}>grading hours?</span>
        </h2>

        <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "#6b7280" }}>
          Join thousands of teachers focused on teaching, not checking.
          Start with <strong style={{ color: "#f59e0b" }}>200 free points</strong> — no credit card required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            to="/register"
            className="flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-base font-headline transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "#f59e0b", color: "#111827", boxShadow: "0 8px 32px rgba(245,158,11,0.3)" }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}
            >
              token
            </span>
            Start Free — 200 Points
          </Link>
          <button
            className="flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-base font-headline transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#d1d5db",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
          >
            Contact Sales
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-8">
          {[
            { icon: "lock", label: "End-to-end encrypted" },
            { icon: "schedule", label: "Results in < 30 seconds" },
            { icon: "verified", label: "98.7% accuracy" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: "16px", color: "#4b5563" }}
              >
                {item.icon}
              </span>
              <span className="text-sm font-semibold font-headline" style={{ color: "#4b5563" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}