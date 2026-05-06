const audiences = [
  {
    icon: "person",
    title: "Individual Educators",
    desc: "Empower your teaching with an AI assistant that gives students instant, high-quality feedback on their writing style and subject knowledge.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.10)",
  },
  {
    icon: "corporate_fare",
    title: "School Districts",
    desc: "Implement standardized excellence across entire campuses. Gain district-wide insights on student performance through a secure analytics dashboard.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.10)",
  },
  {
    icon: "school",
    title: "Universities",
    desc: "Handle thousands of submissions per semester. LMS integration, bulk uploads, and detailed departmental reporting built for scale.",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.10)",
  },
];

export default function TargetAudience() {
  return (
    <section className="py-24" style={{ background: "#0d1117" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-6"
            style={{ background: "rgba(245,158,11,0.10)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            Who It's For
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-headline mb-4" style={{ color: "#f9fafb" }}>
            Designed for the Academy
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: "#6b7280" }}>
            Whether you're a solo educator or managing an entire institution, Editorial AI scales to your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {audiences.map(({ icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="rounded-2xl p-8 transition-all hover:scale-[1.02]"
              style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: bg }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: "22px", color }}
                >
                  {icon}
                </span>
              </div>
              <h4 className="text-xl font-bold font-headline mb-3" style={{ color: "#f9fafb" }}>
                {title}
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}