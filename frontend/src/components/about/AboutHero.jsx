export default function AboutHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-28" style={{ background: "#0d1117" }}>
      {/* Glow */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{
          background: "radial-gradient(circle at top right, rgba(245,158,11,0.07) 0%, transparent 60%)",
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

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Left */}
          <div className="lg:col-span-7">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-bold tracking-widest uppercase rounded-full font-headline"
              style={{
                color: "#f59e0b",
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.18)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Our Mission
            </span>

            <h1
              className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8 leading-[1.08] font-headline"
              style={{ color: "#f9fafb" }}
            >
              Elevating the standards of{" "}
              <span style={{ color: "#f59e0b" }}>academic assessment</span>{" "}
              through precision AI.
            </h1>

            <p className="text-xl leading-relaxed max-w-2xl" style={{ color: "#6b7280" }}>
              We believe every manuscript deserves the scrutiny of a master editor. Editorial AI merges
              linguistic expertise with advanced neural networks to give educators a tool worthy of their standards.
            </p>

            {/* Key stats */}
            <div className="flex flex-wrap gap-10 mt-12">
              {[
                { value: "284K+", label: "Papers Graded" },
                { value: "2,500+", label: "Educators" },
                { value: "98.7%", label: "Accuracy" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-extrabold font-headline" style={{ color: "#f59e0b" }}>
                    {s.value}
                  </div>
                  <div className="text-sm mt-1" style={{ color: "#4b5563" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-5 relative">
            {/* Glowing card stack */}
            <div className="relative">
              {/* Background card */}
              <div
                className="absolute -top-4 -right-4 w-full h-full rounded-2xl"
                style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.04)" }}
              />

              {/* Main card */}
              <div
                className="relative rounded-2xl p-7"
                style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(245,158,11,0.12)" }}
                  >
                    <span
                      className="material-symbols-outlined text-amber-500"
                      style={{ fontVariationSettings: "'FILL' 1", fontSize: "20px" }}
                    >
                      auto_awesome
                    </span>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-sm" style={{ color: "#f9fafb" }}>
                      AI Analysis Active
                    </p>
                    <p className="text-xs" style={{ color: "#4b5563" }}>Real-time grading in progress</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Thesis Strength", pct: 92, color: "#f59e0b" },
                    { label: "Citation Accuracy", pct: 88, color: "#10b981" },
                    { label: "Structural Logic", pct: 79, color: "#6366f1" },
                    { label: "Originality", pct: 96, color: "#f9fafb" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-headline" style={{ color: "#6b7280" }}>{item.label}</span>
                        <span className="text-xs font-bold font-headline" style={{ color: item.color }}>{item.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${item.pct}%`, background: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-5 pt-4 flex items-center justify-between"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span className="text-xs" style={{ color: "#4b5563" }}>Cost of this check</span>
                  <span
                    className="text-xs font-bold font-headline px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(245,158,11,0.10)", color: "#f59e0b" }}
                  >
                    20 points
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}