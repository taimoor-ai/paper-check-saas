const testimonials = [
  {
    quote:
      "Editorial AI has saved me hours every week. I used to spend entire evenings marking biology exams — now I review the AI's suggestions in minutes and focus on actually teaching.",
    name: "Dr. Amina Khalid",
    role: "Biology Lecturer, University of Lahore",
    initials: "AK",
    color: "#f59e0b",
  },
  {
    quote:
      "The handwriting recognition is the real game-changer. My students write in Urdu and English, and it reads both accurately. I don't have to force typed submissions anymore.",
    name: "Muhammad Tariq",
    role: "High School English Teacher, Islamabad",
    initials: "MT",
    color: "#10b981",
  },
  {
    quote:
      "What I love most is the per-question breakdown. I can see exactly which concept each student misunderstood and give targeted feedback — something I couldn't do manually at scale.",
    name: "Sarah Johnson",
    role: "Mathematics Teacher, United Kingdom",
    initials: "SJ",
    color: "#6366f1",
  },
  {
    quote:
      "The points system is exactly what I needed. No monthly commitment — I buy a pack at the start of exam season and it lasts me perfectly. 20 pts per check is incredibly fair.",
    name: "Prof. David Osei",
    role: "History Department Head, Ghana",
    initials: "DO",
    color: "#f59e0b",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-28" style={{ background: "#111827" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-6"
            style={{ background: "rgba(245,158,11,0.10)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "14px" }}>
              grade
            </span>
            Educator Stories
          </div>
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4" style={{ color: "#f9fafb" }}>
            Trusted by Teachers Worldwide
          </h2>
          <p style={{ color: "#6b7280" }}>
            See how educators are reclaiming their time and improving student feedback quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-8 rounded-2xl transition-all hover:scale-[1.01]"
              style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="#f59e0b" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="font-body italic mb-6 leading-relaxed" style={{ color: "#9ca3af" }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-gray-900 text-sm font-bold font-headline shrink-0"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold font-headline text-sm" style={{ color: "#f9fafb" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "#4b5563" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
