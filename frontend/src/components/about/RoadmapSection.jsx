const roadmap = [
  {
    quarter: "Q4 2024",
    title: "Multi-lingual Nuance",
    desc: "Extending rhetorical analysis to French, German, Urdu, and Mandarin academic standards.",
    status: "done",
  },
  {
    quarter: "Q1 2025",
    title: "Citation Verification",
    desc: "AI-powered cross-referencing against global research databases to ensure fact integrity.",
    status: "done",
  },
  {
    quarter: "Q2 2025",
    title: "Predictive Grading",
    desc: "Helping educators predict student learning outcomes based on writing evolution over time.",
    status: "active",
  },
  {
    quarter: "Q3 2025",
    title: "AuthorID Synthesis",
    desc: "Ensuring individual voice preservation while enhancing technical clarity and originality.",
    status: "upcoming",
  },
];

export default function RoadmapSection() {
  return (
    <section className="py-24 overflow-hidden" style={{ background: "#111827" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="rounded-2xl p-10 lg:p-14 relative overflow-hidden"
          style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="grid lg:grid-cols-3 gap-12 relative z-10">
            {/* Left */}
            <div className="lg:col-span-1">
              <div
                className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-6"
                style={{ background: "rgba(245,158,11,0.10)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
              >
                Roadmap
              </div>
              <h2 className="text-3xl font-extrabold font-headline mb-4" style={{ color: "#f9fafb" }}>
                Our Future Vision
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: "#6b7280" }}>
                We aren't just building a tool — we're building the definitive standard for editorial intelligence in academia.
              </p>
              <button
                className="flex items-center gap-2 font-bold text-sm font-headline transition-all"
                style={{ color: "#f59e0b" }}
                onMouseEnter={e => e.currentTarget.style.gap = "12px"}
                onMouseLeave={e => e.currentTarget.style.gap = "8px"}
              >
                View full vision
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
              </button>
            </div>

            {/* Grid */}
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
              {roadmap.map(({ quarter, title, desc, status }) => (
                <div
                  key={quarter}
                  className="p-6 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderLeft: `3px solid ${status === "done" ? "#10b981" : status === "active" ? "#f59e0b" : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-xs font-bold font-headline uppercase tracking-widest"
                      style={{
                        color: status === "done" ? "#10b981" : status === "active" ? "#f59e0b" : "#4b5563",
                      }}
                    >
                      {quarter}
                    </span>
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full font-headline"
                      style={{
                        background:
                          status === "done"
                            ? "rgba(16,185,129,0.10)"
                            : status === "active"
                            ? "rgba(245,158,11,0.10)"
                            : "rgba(255,255,255,0.05)",
                        color:
                          status === "done"
                            ? "#10b981"
                            : status === "active"
                            ? "#f59e0b"
                            : "#4b5563",
                      }}
                    >
                      {status === "done" ? "Shipped" : status === "active" ? "In Progress" : "Planned"}
                    </span>
                  </div>
                  <h4 className="font-bold font-headline mb-2" style={{ color: "#f9fafb" }}>
                    {title}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative glow */}
          <div
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(245,158,11,0.05)" }}
          />
        </div>
      </div>
    </section>
  );
}