import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const questions = [
  { label: "Q1 — Cell Structure", score: 5, max: 5, pct: 100 },
  { label: "Q2 — Photosynthesis", score: 4, max: 5, pct: 80 },
  { label: "Q3 — Respiration", score: 3.5, max: 5, pct: 70 },
  { label: "Q4 — Ecosystems", score: 4, max: 5, pct: 80 },
];

export default function HeroSection() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const similarity = 82;
  const circumference = 2 * Math.PI * 30;
  const dash = (similarity / 100) * circumference;

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center" style={{ background: "#0d1117" }}>
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Amber glow */}
      <div
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* ── LEFT — Copy ── */}
        <div
          className="flex flex-col justify-center"
          style={{
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          {/* Live badge */}
          <div
            className="inline-flex items-center gap-2.5 text-xs font-bold px-4 py-2 rounded-full mb-8 w-fit"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b" }}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" style={{ boxShadow: "0 0 6px #f59e0b" }} />
            AI-Powered Paper Grading — Live
          </div>

          <h1
            className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6 font-headline"
            style={{ color: "#f9fafb" }}
          >
            Grade Papers with
            <br />
            <span style={{ color: "#f59e0b" }}>Editorial</span>
            {" "}Precision
          </h1>

          <p className="text-lg leading-relaxed mb-10 max-w-lg" style={{ color: "#9ca3af" }}>
            Upload answer keys and student submissions in any format — PDF, DOCX,
            image, or handwritten scan. Get instant similarity scores, per-question marks,
            and AI-curated feedback in under 30 seconds.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Link
              to="/register"
              className="flex items-center gap-2 text-gray-900 px-8 py-4 rounded-xl font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all font-headline"
              style={{ background: "#f59e0b", boxShadow: "0 12px 32px rgba(245,158,11,0.3)" }}
            >
              Start Free — 200 Points
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all font-headline"
              style={{ background: "rgba(255,255,255,0.06)", color: "#d1d5db", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              See It in Action
            </a>
          </div>

          {/* Micro stats */}
          <div
            className="flex flex-wrap gap-0 rounded-xl overflow-hidden w-fit"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {[
              { value: "98.7%", label: "Accuracy" },
              { value: "< 30s", label: "Per paper" },
              { value: "20 pts", label: "Per check" },
            ].map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col items-center py-4 px-6"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}
              >
                <span className="text-2xl font-extrabold font-headline" style={{ color: "#f59e0b" }}>
                  {s.value}
                </span>
                <span className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Points info */}
          <div className="mt-6 flex items-center gap-2">
            <span
              className="material-symbols-outlined text-amber-500"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: "16px" }}
            >
              info
            </span>
            <p className="text-xs" style={{ color: "#6b7280" }}>
              20 points per check · $1 = 100 points · No subscription required
            </p>
          </div>
        </div>

        {/* ── RIGHT — Dashboard mock ── */}
        <div
          className="relative flex items-center justify-center"
          style={{
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
          }}
        >
          {/* Glow halo */}
          <div
            className="absolute inset-0 rounded-3xl blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, transparent 70%)" }}
          />

          {/* Card shell */}
          <div
            className="relative w-full max-w-lg rounded-2xl overflow-hidden"
            style={{
              background: "#161b22",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3)",
            }}
          >
            {/* Browser chrome */}
            <div
              className="flex items-center gap-3 px-5 py-3"
              style={{ background: "#0d1117", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
              </div>
              <div
                className="flex-1 text-center text-xs py-1 px-3 rounded-md"
                style={{ background: "rgba(255,255,255,0.05)", color: "#6b7280" }}
              >
                papercheck.ai/results/bio-exam-2024
              </div>
            </div>

            {/* Dashboard body */}
            <div className="p-5 space-y-4">
              {/* File info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(245,158,11,0.12)" }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "#f59e0b", fontVariationSettings: "'FILL' 1", fontSize: "20px" }}
                    >
                      description
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold font-headline" style={{ color: "#f9fafb" }}>
                      Biology_Exam_Ahmed.pdf
                    </p>
                    <p className="text-xs" style={{ color: "#6b7280" }}>
                      Checked 28 seconds ago · 20 points used
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
                >
                  ✓ Complete
                </span>
              </div>

              {/* Score summary strip */}
              <div
                className="flex items-center gap-4 rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Donut */}
                <div className="relative flex-shrink-0 w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                    <circle
                      cx="40" cy="40" r="30"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="8"
                      strokeDasharray={`${dash} ${circumference}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold font-headline" style={{ color: "#f59e0b" }}>
                      {similarity}%
                    </span>
                  </div>
                </div>

                <div className="w-px self-stretch" style={{ background: "rgba(255,255,255,0.06)" }} />

                <div className="flex-1 grid grid-cols-2 gap-3">
                  {[
                    { label: "Score", value: "16.5/20" },
                    { label: "Grade", value: "A−" },
                    { label: "Similarity", value: "82%" },
                    { label: "Questions", value: "4/4" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="text-xs" style={{ color: "#6b7280" }}>{item.label}</div>
                      <div className="text-base font-bold font-headline" style={{ color: "#f9fafb" }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Per-question bars */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider font-headline" style={{ color: "#4b5563" }}>
                  Question Breakdown
                </p>
                {questions.map((q) => (
                  <div key={q.label} className="flex items-center gap-3">
                    <span className="text-xs flex-shrink-0 w-36 truncate" style={{ color: "#9ca3af" }}>
                      {q.label}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${q.pct}%`,
                          background: q.pct === 100 ? "#f59e0b" : q.pct >= 75 ? "#d97706" : "#92400e",
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold flex-shrink-0 w-10 text-right font-headline" style={{ color: "#f9fafb" }}>
                      {q.score}/{q.max}
                    </span>
                  </div>
                ))}
              </div>

              {/* AI Feedback */}
              <div className="space-y-2">
                {[
                  { tag: "Thesis Match", text: "Student correctly explains cellular structure with strong conceptual alignment.", color: "#10b981", bg: "rgba(16,185,129,0.08)" },
                  { tag: "Partial Credit", text: "Photosynthesis answer misses ATP production in the light-dependent stage. 80% match.", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
                ].map((item) => (
                  <div
                    key={item.tag}
                    className="p-3 rounded-xl"
                    style={{ borderLeft: `3px solid ${item.color}`, background: item.bg }}
                  >
                    <p className="text-xs font-bold uppercase tracking-tight mb-1 font-headline" style={{ color: item.color }}>
                      {item.tag}
                    </p>
                    <p className="text-xs leading-snug" style={{ color: "#9ca3af" }}>{item.text}</p>
                  </div>
                ))}
              </div>

              {/* Action row */}
              <div className="flex gap-3 pt-1">
                <button
                  className="flex-1 text-gray-900 text-xs font-bold py-3 rounded-xl transition-all font-headline"
                  style={{ background: "#f59e0b", boxShadow: "0 4px 16px rgba(245,158,11,0.25)" }}
                >
                  Export PDF Report
                </button>
                <button
                  className="flex-1 text-xs font-bold py-3 rounded-xl transition-colors font-headline"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  Override Scores
                </button>
              </div>
            </div>
          </div>

          {/* Floating chips */}
          <div
            className="absolute -top-4 -left-4 hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold font-headline"
            style={{
              background: "#161b22",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#d1d5db",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <span className="material-symbols-outlined text-amber-400" style={{ fontSize: "14px" }}>upload_file</span>
            PDF · DOCX · JPG · Handwritten
          </div>

          <div
            className="absolute -bottom-4 -right-4 hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold font-headline"
            style={{
              background: "#161b22",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-900 text-xs font-bold flex-shrink-0"
              style={{ background: "#f59e0b" }}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "14px" }}>token</span>
            </div>
            <div>
              <div style={{ color: "#d1d5db" }}>Points remaining</div>
              <div style={{ color: "#f59e0b" }}>180 / 200</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}