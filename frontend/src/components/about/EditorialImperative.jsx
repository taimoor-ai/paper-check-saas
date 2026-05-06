export default function EditorialImperative() {
  return (
    <section className="py-24" style={{ background: "#111827" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-6"
            style={{ background: "rgba(245,158,11,0.10)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            Why It Matters
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-headline mb-4" style={{ color: "#f9fafb" }}>
            The Editorial Imperative
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: "#6b7280" }}>
            Bridging the gap between manual labor and intelligent automation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Problem card */}
          <div
            className="md:col-span-1 p-8 rounded-2xl flex flex-col justify-between"
            style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: "rgba(239,68,68,0.10)" }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: "22px", color: "#ef4444" }}
                >
                  history_edu
                </span>
              </div>
              <h3 className="text-2xl font-bold font-headline mb-4" style={{ color: "#f9fafb" }}>
                The Grading Burden
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                Educators spend upwards of 20 hours a week on manual paper correction — time that could be
                spent on pedagogy, research, and student mentorship.
              </p>
            </div>
            <div className="pt-6 mt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-xs font-bold font-headline uppercase tracking-widest" style={{ color: "#ef4444" }}>
                Bottleneck identified
              </span>
            </div>
          </div>

          {/* Solution card */}
          <div
            className="md:col-span-2 p-8 rounded-2xl relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1c1906 0%, #0d1117 100%)", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: "rgba(245,158,11,0.15)" }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1", fontSize: "22px", color: "#f59e0b" }}
                  >
                    bolt
                  </span>
                </div>
                <h3 className="text-3xl font-bold font-headline mb-4" style={{ color: "#f9fafb" }}>
                  Autonomous Precision
                </h3>
                <p className="text-lg leading-relaxed max-w-lg" style={{ color: "#9ca3af" }}>
                  Editorial AI doesn't just check grammar — it analyzes the rhetorical structure, logic,
                  and academic rigor of a paper in seconds. Each check costs just{" "}
                  <strong style={{ color: "#f59e0b" }}>20 points</strong>.
                </p>
              </div>
              <div className="mt-10 flex gap-12">
                {[
                  { value: "94%", label: "Efficiency Increase" },
                  { value: "2.4m+", label: "Analyses Completed" },
                  { value: "20 pts", label: "Per Check" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-3xl font-extrabold font-headline mb-1" style={{ color: "#f59e0b" }}>
                      {s.value}
                    </div>
                    <div className="text-xs uppercase tracking-widest" style={{ color: "#4b5563" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Glow */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl"
              style={{ background: "rgba(245,158,11,0.06)", transform: "translate(50%,-50%)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}