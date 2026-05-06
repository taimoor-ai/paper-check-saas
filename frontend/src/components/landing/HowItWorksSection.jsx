const steps = [
  {
    num: "01",
    icon: "upload_file",
    title: "Upload Answer Key",
    desc: "Upload the teacher's model solution as a file (PDF, DOCX, image) or paste text directly. Our AI extracts rubric points automatically.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.10)",
  },
  {
    num: "02",
    icon: "description",
    title: "Submit Student Paper",
    desc: "Upload the student's submission — any format works, including handwritten scans. Advanced OCR converts everything to text.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.10)",
  },
  {
    num: "03",
    icon: "psychology",
    title: "AI Analyzes",
    desc: "Our AI compares submissions using semantic understanding, not just keywords. Scores are generated per question with detailed feedback.",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.10)",
  },
  {
    num: "04",
    icon: "grading",
    title: "Review & Export",
    desc: "Review the AI's grading, override any score manually, and export a full PDF report. Results in your LMS within 30 seconds.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.10)",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-28 relative" id="how-it-works" style={{ background: "#0d1117" }}>
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-6"
            style={{ background: "rgba(245,158,11,0.10)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            How It Works
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-headline mb-4" style={{ color: "#f9fafb" }}>
            Precision in Four Steps
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: "#6b7280" }}>
            From answer key to graded report — in under 30 seconds. Each check costs just 20 points.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="relative rounded-2xl p-7 flex flex-col transition-all hover:scale-[1.02]"
              style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Step number */}
              <span
                className="text-xs font-extrabold font-headline uppercase tracking-widest mb-5"
                style={{ color: "rgba(255,255,255,0.12)" }}
              >
                {step.num}
              </span>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: step.bg }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: "22px", color: step.color }}
                >
                  {step.icon}
                </span>
              </div>

              <h3 className="font-headline font-bold text-lg mb-3" style={{ color: "#f9fafb" }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "#6b7280" }}>
                {step.desc}
              </p>

              {/* Arrow connector (not for last) */}
              {idx < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center z-10"
                  style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#374151" }}>
                    arrow_forward
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}