const team = [
  {
    name: "Dr. Marcus Vance",
    role: "Founder & CEO",
    bio: "Former Head of Linguistics at Cambridge Scholarly Press.",
    initials: "MV",
    color: "#f59e0b",
  },
  {
    name: "Elena Rostova",
    role: "Chief of AI",
    bio: "Pioneer in Transformer models for semantic text analysis.",
    initials: "ER",
    color: "#10b981",
  },
  {
    name: "Jameson Thorne",
    role: "Head of Product",
    bio: "Passionate about bridging pedagogy and modern technology.",
    initials: "JT",
    color: "#6366f1",
  },
  {
    name: "Sarah Jenkins",
    role: "Director of Ethics",
    bio: "Ensuring AI integrity and data privacy in academic research.",
    initials: "SJ",
    color: "#f59e0b",
  },
];

export default function TeamSection() {
  return (
    <section className="py-24" style={{ background: "#0d1117" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-6"
            style={{ background: "rgba(245,158,11,0.10)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            The Team
          </div>
          <h2 className="text-4xl font-extrabold font-headline mb-4" style={{ color: "#f9fafb" }}>
            The Editorial Board
          </h2>
          <p style={{ color: "#6b7280" }}>A collective of linguists, engineers, and educators.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {team.map(({ name, role, bio, initials, color }) => (
            <div
              key={name}
              className="rounded-2xl p-6 text-center transition-all hover:scale-[1.02]"
              style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Avatar */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-gray-900 text-2xl font-extrabold font-headline mx-auto mb-5"
                style={{ background: color }}
              >
                {initials}
              </div>

              <h4 className="font-bold font-headline text-lg mb-1" style={{ color: "#f9fafb" }}>
                {name}
              </h4>
              <p
                className="text-xs font-bold uppercase tracking-wider font-headline mb-3"
                style={{ color }}
              >
                {role}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>
                {bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}