import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/shared/SideNav";
import TopBar from "../components/shared/TopBar";

// Pipeline stages mapped to assessment_status transitions
const pipeline = [
  {
    icon: "check_circle",
    label: "Submission Received",
    desc: "Files & text data validated and stored",
    statusMatch: "pending",
  },
  {
    icon: "document_scanner",
    label: "OCR & Extraction",
    desc: "Extracting text from teacher & student uploads",
    statusMatch: "processing",
  },
  {
    icon: "psychology",
    label: "AI Grading",
    desc: "Semantic evaluation · rubric matching · similarity scoring",
    statusMatch: "processing",
  },
];

// Mock assessment row — in real app this comes from Supabase query by id
const mockAssessment = {
  id: "a1b2c3d4-...",
  title: "Mid-Term Paper",
  subject: "Environmental Systems",
  student_name: "Julian Mars",
  level: "Undergraduate",
  status: "processing",
  points_cost: 20,
  // teacher uploaded a file
  teacher_data_url: "https://storage.supabase.co/.../teacher_paper.pdf",
  teacher_text_data: null,
  // student uploaded a file
  student_data_url: "https://storage.supabase.co/.../student_answer.pdf",
  student_text_data: null,
};

export default function Processing() {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [progress, setProgress] = useState(62);
  const [timeLeft, setTimeLeft] = useState(14);
  const [assessment] = useState(mockAssessment);

  // Derive which pipeline steps are done / active / pending from progress
  const activePipelineIdx = progress < 30 ? 0 : progress < 85 ? 1 : 2;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => navigate("/results"), 500);
          return 100;
        }
        return p + 0.4;
      });
      setTimeLeft((t) => Math.max(0, t - 0.1));
    }, 200);
    return () => clearInterval(timer);
  }, [navigate]);

  const radius = 108;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (progress / 100) * circ;

  // Data source badge helper
  const sourceLabel = (url, text) => {
    if (url)  return { label: url.split("/").pop(), icon: "attach_file",    color: "#6366f1" };
    if (text) return { label: "Plain text",          icon: "text_snippet",  color: "#10b981" };
    return       { label: "No data",                 icon: "warning",       color: "#ef4444" };
  };

  const teacherSrc = sourceLabel(assessment.teacher_data_url, assessment.teacher_text_data);
  const studentSrc = sourceLabel(assessment.student_data_url, assessment.student_text_data);

  return (
    <div className="flex min-h-screen" style={{ background: "#0a0d12" }}>
      <SideNav isOpen={navOpen} onClose={() => setNavOpen(false)} />
      <main className="lg:ml-64 flex-1 min-h-screen">
        <TopBar showSearch={false} showPoints={false} onMenuToggle={() => setNavOpen((open) => !open)} />

        <div className="mt-16 p-6 lg:p-10">
          <div className="max-w-5xl mx-auto">

            {/* ── Header ── */}
            <div className="mb-10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
                    style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Live · {assessment.status}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
                    style={{ background: "rgba(99,102,241,0.08)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.15)" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>toll</span>
                    {assessment.points_cost} pts deducting
                  </span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-1" style={{ color: "#f9fafb", fontFamily: "Georgia, serif" }}>
                  {assessment.title}
                  <span style={{ color: "#f59e0b" }}> — AI Grading</span>
                </h2>
                <p className="text-sm" style={{ color: "#6b7280" }}>
                  {assessment.subject} · {assessment.level} · {assessment.student_name}
                </p>
              </div>
            </div>

            {/* ── Bento grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

              {/* Progress ring */}
              <div
                className="lg:col-span-7 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden"
                style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="relative w-56 h-56 mb-7">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
                    <circle cx="120" cy="120" r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                    <circle
                      cx="120" cy="120" r={radius}
                      fill="transparent" stroke="#f59e0b"
                      strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={circ} strokeDashoffset={offset}
                      style={{ transition: "stroke-dashoffset 0.3s ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-extrabold" style={{ color: "#f9fafb", fontFamily: "Georgia, serif" }}>
                      {Math.round(progress)}%
                    </span>
                    <span className="text-[10px] uppercase tracking-widest mt-1" style={{ color: "#374151" }}>Progress</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <p className="text-sm font-medium" style={{ color: "#e5e7eb" }}>
                      Analysing student handwriting &amp; content…
                    </p>
                  </div>
                  <p className="text-sm" style={{ color: "#4b5563" }}>
                    ~{Math.max(0, Math.round(timeLeft))}s remaining
                  </p>
                </div>

                {/* ambient glow */}
                <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full blur-3xl pointer-events-none"
                  style={{ background: "rgba(245,158,11,0.06)" }} />
              </div>

              {/* Right column */}
              <div className="lg:col-span-5 flex flex-col gap-5">

                {/* Pipeline */}
                <div
                  className="rounded-2xl p-6 flex-1"
                  style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-5" style={{ color: "#374151" }}>
                    Analysis Pipeline
                  </p>
                  <div className="space-y-5">
                    {pipeline.map((step, idx) => {
                      const done    = idx < activePipelineIdx;
                      const active  = idx === activePipelineIdx;
                      const pending = idx > activePipelineIdx;
                      return (
                        <div key={step.label} className={`flex items-center gap-4 transition-opacity ${pending ? "opacity-25" : ""}`}>
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative"
                            style={{
                              background: done ? "#f59e0b" : active ? "transparent" : "rgba(255,255,255,0.04)",
                              border: done ? "none" : active ? "2px solid #f59e0b" : "1px solid rgba(255,255,255,0.08)",
                              color: done ? "#111827" : active ? "#f59e0b" : "#374151",
                            }}
                          >
                            {active && <span className="absolute inset-0 rounded-full border-2 border-amber-400 animate-ping opacity-20" />}
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "18px", fontVariationSettings: done ? "'FILL' 1" : "'FILL' 0" }}
                            >
                              {step.icon}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: active ? "#f59e0b" : "#f9fafb" }}>
                              {step.label}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: "#4b5563" }}>{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Data sources — derived from schema columns */}
                <div
                  className="rounded-2xl p-6"
                  style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "#374151" }}>
                    Data Sources
                  </p>
                  <div className="space-y-3">
                    {[
                      { role: "Teacher", src: teacherSrc },
                      { role: "Student", src: studentSrc },
                    ].map(({ role, src }) => (
                      <div key={role} className="flex items-center justify-between gap-3">
                        <span className="text-xs" style={{ color: "#6b7280" }}>{role}</span>
                        <span
                          className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg truncate max-w-[200px]"
                          style={{ background: `${src.color}10`, color: src.color, border: `1px solid ${src.color}22` }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "13px", fontVariationSettings: "'FILL' 1" }}>
                            {src.icon}
                          </span>
                          <span className="truncate">{src.label}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Early insight */}
              <div
                className="lg:col-span-12 rounded-2xl p-6"
                style={{ background: "#111318", border: "1px solid rgba(245,158,11,0.12)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-amber-400" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>
                    lightbulb
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#f59e0b" }}>
                    Early Insight — ai_results will populate here
                  </span>
                </div>
                <p className="text-sm italic leading-relaxed" style={{ color: "#9ca3af" }}>
                  "The student displays strong argumentative logic in Section 2, but density suggests fatigue toward the conclusion…"
                </p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  {[
                    { label: "Logic: 8.5/10",   color: "#f59e0b" },
                    { label: "Clarity: 6.2/10", color: "#6366f1" },
                    { label: "Similarity: —",   color: "#10b981" },
                    { label: "Plagiarism: —",   color: "#ef4444" },
                  ].map(({ label, color }) => (
                    <span
                      key={label}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold"
                      style={{ background: `${color}12`, color }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skeleton loaders */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="lg:col-span-4 p-5 rounded-2xl space-y-3"
                  style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-20 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
                    <div className="h-5 w-5 rounded-full animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
                  </div>
                  <div className="h-16 w-full rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
                  <div className="flex gap-2">
                    <div className="h-3 w-12 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
                    <div className="h-3 w-16 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom toast */}
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full flex items-center gap-3 z-50"
          style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}
        >
          <span className="material-symbols-outlined text-emerald-400" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>
            verified_user
          </span>
          <span className="text-xs" style={{ color: "#9ca3af" }}>
            Encrypted · Private · {assessment.points_cost} points deducting
          </span>
          <button
            onClick={() => navigate("/new-check")}
            className="text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors"
            style={{ background: "rgba(255,255,255,0.07)", color: "#9ca3af" }}
          >
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
}