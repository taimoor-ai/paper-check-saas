const features = [
  {
    icon: "auto_awesome",
    title: "Editorial-Grade AI Grading",
    desc: "Go beyond basic grammar. Our AI evaluates argumentative logic, thesis strength, and citation integrity using custom rubrics you define.",
    size: "large",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.12)",
  },
  {
    icon: "photo_camera",
    title: "Advanced OCR",
    stat: "99.2%",
    statLabel: "Success Rate",
    desc: "Proprietary handwriting recognition converts even the messiest student scribbles into digital text for analysis.",
    size: "small",
    color: "#10b981",
    bg: "rgba(16,185,129,0.06)",
    border: "rgba(16,185,129,0.12)",
  },
  {
    icon: "analytics",
    title: "Detailed Reports",
    desc: "Export comprehensive student progress reports with actionable insights and historical performance tracking.",
    size: "small",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.06)",
    border: "rgba(99,102,241,0.12)",
  },
  {
    icon: "rule",
    title: "Plagiarism Detection",
    desc: "Cross-reference papers against billions of web pages and academic archives. Get similarity scores in seconds.",
    size: "wide",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.12)",
  },
];

export default function FeaturesSection() {
  return (
    <section
      className="py-28 relative"
      id="features"
      style={{ background: "#111827" }}
    >
      {/* grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-16">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-6"
            style={{ background: "rgba(245,158,11,0.10)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: "14px" }}
            >
              bolt
            </span>
            Features
          </div>
          <h2 className="text-4xl font-extrabold font-headline tracking-tight mb-3" style={{ color: "#f9fafb" }}>
            Academic Powerhouse
          </h2>
          <p className="max-w-md" style={{ color: "#6b7280" }}>
            Tools built for the rigors of modern education — at every scale.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Card 1 — Large/featured */}
          <div
            className="lg:col-span-2 rounded-2xl p-8 flex flex-col transition-all hover:scale-[1.01]"
            style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
              style={{ background: "rgba(245,158,11,0.12)" }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: "24px", color: "#f59e0b" }}
              >
                auto_awesome
              </span>
            </div>
            <h3 className="text-2xl font-bold font-headline mb-3" style={{ color: "#f9fafb" }}>
              Editorial-Grade AI Grading
            </h3>
            <p className="leading-relaxed mb-6" style={{ color: "#6b7280" }}>
              Go beyond basic grammar. Our AI evaluates argumentative logic, thesis strength, and citation
              integrity using custom rubrics you define. Supports multiple-choice, short-answer, and essays.
            </p>
            {/* Mini dashboard preview */}
            <div
              className="mt-auto rounded-xl p-4 space-y-2"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {[
                { label: "Thesis Strength", pct: 88, color: "#f59e0b" },
                { label: "Citation Accuracy", pct: 94, color: "#10b981" },
                { label: "Structural Logic", pct: 76, color: "#6366f1" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xs w-32 shrink-0" style={{ color: "#4b5563" }}>{item.label}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
                  </div>
                  <span className="text-xs font-bold font-headline w-8 text-right" style={{ color: "#d1d5db" }}>
                    {item.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2 — OCR */}
          <div
            className="rounded-2xl p-8 flex flex-col transition-all hover:scale-[1.01]"
            style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
              style={{ background: "rgba(16,185,129,0.10)" }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: "24px", color: "#10b981" }}
              >
                photo_camera
              </span>
            </div>
            <h3 className="text-xl font-bold font-headline mb-3" style={{ color: "#f9fafb" }}>
              Advanced OCR
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#6b7280" }}>
              Proprietary handwriting recognition converts even the messiest student scribbles into digital text.
            </p>
            <div
              className="mt-auto pt-6"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-xs font-bold uppercase tracking-widest font-headline mb-1" style={{ color: "#4b5563" }}>
                Recognition Rate
              </p>
              <p className="text-4xl font-extrabold font-headline" style={{ color: "#10b981" }}>
                99.2%
              </p>
            </div>
          </div>

          {/* Card 3 — Reports */}
          <div
            className="rounded-2xl p-8 flex flex-col transition-all hover:scale-[1.01]"
            style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
              style={{ background: "rgba(99,102,241,0.10)" }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: "24px", color: "#6366f1" }}
              >
                analytics
              </span>
            </div>
            <h3 className="text-xl font-bold font-headline mb-3" style={{ color: "#f9fafb" }}>
              Detailed Reports
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#6b7280" }}>
              Export comprehensive student progress reports with actionable insights and historical tracking.
            </p>
            {/* Mini chart */}
            <div
              className="mt-auto p-4 rounded-xl space-y-2"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {[
                { w: "85%", c: "#6366f1" },
                { w: "45%", c: "#f59e0b" },
                { w: "70%", c: "#10b981" },
              ].map((bar, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: bar.c }} />
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: bar.w, background: bar.c }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4 — Plagiarism (wide) */}
          <div
            className="lg:col-span-2 rounded-2xl p-8 flex flex-col md:flex-row items-start gap-8 transition-all hover:scale-[1.01]"
            style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex-1">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: "rgba(239,68,68,0.10)" }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: "24px", color: "#ef4444" }}
                >
                  rule
                </span>
              </div>
              <h3 className="text-2xl font-bold font-headline mb-3" style={{ color: "#f9fafb" }}>
                Plagiarism Detection
              </h3>
              <p className="leading-relaxed" style={{ color: "#6b7280" }}>
                Cross-reference papers against a database of billions of web pages and proprietary academic
                archives. Instant similarity breakdown with source citations.
              </p>
            </div>
            <div
              className="flex-1 w-full rounded-xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold font-headline" style={{ color: "#f9fafb" }}>
                  Similarity Score
                </span>
                <span className="text-sm font-bold font-headline" style={{ color: "#ef4444" }}>
                  12% match
                </span>
              </div>
              <div className="h-2 w-full rounded-full overflow-hidden mb-4" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full w-[12%]" style={{ background: "#ef4444" }} />
              </div>
              <p className="text-[11px] italic" style={{ color: "#4b5563" }}>
                "Matches found in 3 external sources: Wikipedia, 2 academic journals..."
              </p>
              <div className="flex gap-3 mt-4">
                {[
                  { label: "Unique", pct: "88%", color: "#10b981" },
                  { label: "Similar", pct: "9%",  color: "#f59e0b" },
                  { label: "Copied",  pct: "3%",  color: "#ef4444" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-base font-extrabold font-headline" style={{ color: item.color }}>
                      {item.pct}
                    </div>
                    <div className="text-[10px]" style={{ color: "#374151" }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}