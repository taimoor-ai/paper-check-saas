const feedbackItems = [
  {
    type: "Thesis Analysis",
    color: "#f59e0b",
    text: "The core argument is present but lacks specific evidentiary links in the third paragraph. Suggest adding context on the Industrial Revolution's social impact.",
  },
  {
    type: "Partial Credit",
    color: "#ef4444",
    text: 'Consider a more formal academic voice in the conclusion. Rephrase "It was basically okay" to "The outcomes were fundamentally sufficient."',
  },
  {
    type: "Thesis Match",
    color: "#10b981",
    text: "3 comma splices detected in section 2. Student consistently misses Oxford commas — automated comment added.",
  },
];

const checklistItems = [
  { icon: "auto_awesome", text: "Automatic rubric mapping" },
  { icon: "edit_note",    text: "Inline commentary & suggestions" },
  { icon: "psychology",   text: "Personalized feedback generation" },
  { icon: "token",        text: "20 points per check · $1 = 100 pts" },
];

export default function DemoSection() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "#111827" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Left: Description */}
          <div className="lg:w-1/2">
            <div
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-8"
              style={{ background: "rgba(245,158,11,0.10)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
            >
              Live Demo
            </div>
            <h2
              className="text-4xl font-extrabold font-headline mb-6 leading-tight"
              style={{ color: "#f9fafb" }}
            >
              Insightful Feedback,
              <br />
              <span style={{ color: "#f59e0b" }}>No Effort Required.</span>
            </h2>
            <p className="text-lg mb-10 leading-relaxed" style={{ color: "#6b7280" }}>
              Our Results UI highlights exactly where students need help. See structure suggestions,
              tone adjustments, and factual verifications — all in real-time.
            </p>
            <ul className="space-y-4">
              {checklistItems.map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(245,158,11,0.10)" }}
                  >
                    <span
                      className="material-symbols-outlined text-amber-500"
                      style={{ fontVariationSettings: "'FILL' 1", fontSize: "16px" }}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <span className="text-sm font-semibold font-headline" style={{ color: "#d1d5db" }}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Feedback Panel */}
          <div className="lg:w-1/2 w-full">
            <div
              className="rounded-2xl p-6"
              style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(245,158,11,0.10)" }}
                  >
                    <span
                      className="material-symbols-outlined text-amber-500"
                      style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}
                    >
                      description
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold font-headline" style={{ color: "#f9fafb" }}>
                      History_Paper_V2.pdf
                    </p>
                    <p className="text-xs" style={{ color: "#4b5563" }}>Uploaded 2 mins ago · 20 pts deducted</p>
                  </div>
                </div>
                <div
                  className="px-3 py-1 text-xs font-bold font-headline rounded-full flex items-center gap-1.5"
                  style={{ background: "rgba(245,158,11,0.10)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Scoring…
                </div>
              </div>

              {/* Feedback items */}
              <div className="space-y-3">
                {feedbackItems.map(({ type, color, text }) => (
                  <div
                    key={type}
                    className="p-4 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      borderLeft: `3px solid ${color}`,
                    }}
                  >
                    <p
                      className="text-xs font-bold mb-1 uppercase tracking-tight font-headline"
                      style={{ color }}
                    >
                      {type}
                    </p>
                    <p className="text-sm leading-snug" style={{ color: "#9ca3af" }}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Score bar */}
              <div
                className="mt-5 pt-4 flex items-center justify-between"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="text-xs font-headline" style={{ color: "#4b5563" }}>Similarity Match</span>
                <div className="flex items-center gap-3 flex-1 mx-4">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full w-[78%]" style={{ background: "#f59e0b" }} />
                  </div>
                  <span className="text-xs font-bold font-headline" style={{ color: "#f59e0b" }}>78%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}