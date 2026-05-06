import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SideNav from "../components/shared/SideNav";
import TopBar from "../components/shared/TopBar";

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
function scoreColor(pct) {
  if (pct >= 90) return "#10b981";
  if (pct >= 70) return "#f59e0b";
  return "#ef4444";
}

function scoreLabel(pct) {
  if (pct >= 90) return "Excellent";
  if (pct >= 80) return "Good";
  if (pct >= 70) return "Satisfactory";
  if (pct >= 50) return "Needs Improvement";
  return "Below Standard";
}

function TagPill({ label, value, color }) {
  return (
    <span
      className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide"
      style={{ background: `${color}12`, color, border: `1px solid ${color}20` }}
    >
      {label}: {value}
    </span>
  );
}

function ScoreBar({ pct }) {
  const color = scoreColor(pct);
  return (
    <div className="w-full rounded-full h-1.5 mt-2" style={{ background: "rgba(255,255,255,0.06)" }}>
      <div
        className="h-1.5 rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
export default function Results() {
  const navigate   = useNavigate();
  const location   = useLocation();

  // ── Data from navigation state (set by NewCheck after grading) ──
  // Falls back to mock if navigated directly (development)
  const { results, teacherData, studentData, mode } = location.state || {};

  const assessment = results || {
    similarity_score: 84.48,
    plagiarism_pct: 0,
    overall_score: 88,
    ai_confidence_pct: 85,
    ai_results: {
      summary: "The overall performance is good with a score of 88. The student performed well in questions 1 and 4, but had some deductions in questions 2 and 3 due to incomplete or missing information.",
      early_insight: "The student has a good understanding of AI and its applications, but needs to work on providing more complete and detailed answers.",
      questions: [
        {
          num: "Q1",
          question: "What is Artificial Intelligence?",
          awarded_score: 9,
          max_score: 10,
          compliment: "Excellent answer, accurately covering the definition and applications of AI.",
          deduction: "Minor deduction for missing the phrase 'like humans' in the definition.",
          tags: { logic: 9, clarity: 9, completeness_pct: 90 },
        },
        {
          num: "Q2",
          question: "What is Machine Learning?",
          awarded_score: 8,
          max_score: 10,
          compliment: "Good job in providing a clear and concise definition of Machine Learning and its types.",
          deduction: "The answer lacks a few details and could provide more elaboration on the types of machine learning.",
          tags: { logic: 8, clarity: 9, completeness_pct: 80 },
        },
        {
          num: "Q3",
          question: "What is Deep Learning?",
          awarded_score: 8,
          max_score: 10,
          compliment: "Good understanding of the concept, but incomplete reference answer.",
          deduction: "Missing the word 'complex' in the first sentence.",
          tags: { logic: 8, clarity: 9, completeness_pct: 80 },
        },
        {
          num: "Q4",
          question: "Explain Natural Language Processing.",
          awarded_score: 10,
          max_score: 10,
          compliment: "Excellent answer, fully aligns with the reference.",
          deduction: null,
          tags: { logic: 10, clarity: 10, completeness_pct: 100 },
        },
      ],
    },
  };

  const { ai_results } = assessment;

  // Merge in student answers from extracted student data (if available)
  const enrichedQuestions = ai_results.questions.map((q, idx) => {
    const studentQ = studentData?.questions?.[idx];
    const teacherQ = teacherData?.questions?.[idx];
    return {
      ...q,
      student_answer: studentQ?.answer || null,
      expected_answer: teacherQ?.answer || null,
    };
  });

  const [expanded, setExpanded] = useState([]);
  const [navOpen, setNavOpen] = useState(false);
  const toggle = (i) =>
    setExpanded((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  const expandAll = () => setExpanded(enrichedQuestions.map((_, i) => i));
  const collapseAll = () => setExpanded([]);

  const score      = assessment.overall_score;
  const radius     = 52;
  const circ       = 2 * Math.PI * radius;
  const ringOffset = circ - (score / 100) * circ;

  const totalAwarded = enrichedQuestions.reduce((s, q) => s + q.awarded_score, 0);
  const totalMax     = enrichedQuestions.reduce((s, q) => s + q.max_score, 0);

  return (
    <div className="flex min-h-screen" style={{ background: "#0a0d12" }}>
      <SideNav isOpen={navOpen} onClose={() => setNavOpen(false)} />
      <main className="lg:ml-64 flex-1 min-h-screen">
        <TopBar showSearch={false} showPoints={false} onMenuToggle={() => setNavOpen((open) => !open)} />
        <div className="mt-16">
          <div className="max-w-5xl mx-auto p-6 lg:p-8">

            {/* ── Hero header ── */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 mb-8">
              <div>
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-1.5 text-xs mb-4 transition-colors"
                  style={{ color: "#4b5563" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#9ca3af")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#4b5563")}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_back</span>
                  Back to Assessments
                </button>
                <h1 className="text-2xl font-bold mb-1" style={{ color: "#f9fafb" }}>
                  Assessment Results
                </h1>
                <p className="text-sm" style={{ color: "#6b7280" }}>
                  {mode ? `Mode: ${mode} · ` : ""}
                  {enrichedQuestions.length} questions graded · {totalAwarded}/{totalMax} pts
                </p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  className="px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#d1d5db" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>download</span>
                  Export PDF
                </button>
                <button
                  onClick={() => navigate("/new-check")}
                  className="px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
                  style={{ background: "#f59e0b", color: "#111827", boxShadow: "0 4px 14px rgba(245,158,11,0.25)" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
                  New Check
                </button>
              </div>
            </div>

            {/* ── Overview Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

              {/* Overall Score Ring */}
              <div
                className="col-span-2 lg:col-span-1 rounded-2xl p-6 flex flex-col items-center justify-center text-center"
                style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "#374151" }}>
                  Overall Score
                </p>
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r={radius} fill="transparent"
                      stroke={scoreColor(score)}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={circ} strokeDashoffset={ringOffset}
                      style={{ transition: "stroke-dashoffset 1s ease" }}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-2xl font-extrabold" style={{ color: "#f9fafb" }}>{score}</span>
                    <span className="text-xs block" style={{ color: "#374151" }}>/100</span>
                  </div>
                </div>
                <p
                  className="mt-3 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: `${scoreColor(score)}12`, color: scoreColor(score) }}
                >
                  {scoreLabel(score)}
                </p>
              </div>

              {/* AI Confidence */}
              <div
                className="rounded-2xl p-6 flex flex-col justify-center"
                style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#374151" }}>AI Confidence</p>
                <p className="text-3xl font-extrabold mb-1" style={{ color: "#f9fafb" }}>
                  {assessment.ai_confidence_pct}%
                </p>
                <ScoreBar pct={assessment.ai_confidence_pct} />
                <p className="mt-2 text-xs" style={{ color: "#4b5563" }}>
                  {assessment.ai_confidence_pct >= 85 ? "High reliability" : assessment.ai_confidence_pct >= 70 ? "Moderate reliability" : "Review recommended"}
                </p>
              </div>

              {/* Similarity */}
              <div
                className="rounded-2xl p-6 flex flex-col justify-center"
                style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#374151" }}>Similarity</p>
                <p
                  className="text-3xl font-extrabold mb-1"
                  style={{ color: scoreColor(assessment.similarity_score) }}
                >
                  {assessment.similarity_score}%
                </p>
                <ScoreBar pct={assessment.similarity_score} />
                <p className="mt-2 text-xs" style={{ color: "#4b5563" }}>Semantic match score</p>
              </div>

              {/* Plagiarism */}
              <div
                className="rounded-2xl p-6 flex flex-col justify-center"
                style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#374151" }}>Plagiarism</p>
                <p
                  className="text-3xl font-extrabold mb-1"
                  style={{ color: assessment.plagiarism_pct === 0 ? "#10b981" : "#ef4444" }}
                >
                  {assessment.plagiarism_pct}%
                </p>
                <ScoreBar pct={100 - assessment.plagiarism_pct} />
                <p
                  className="mt-2 text-xs font-semibold"
                  style={{ color: assessment.plagiarism_pct === 0 ? "#10b981" : "#ef4444" }}
                >
                  {assessment.plagiarism_pct === 0 ? "✓ Original work" : "⚠ Detected"}
                </p>
              </div>
            </div>

            {/* ── AI Summary ── */}
            <div
              className="mb-6 rounded-2xl p-5"
              style={{ background: "#111318", border: "1px solid rgba(245,158,11,0.12)" }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-amber-400 mt-0.5 shrink-0"
                  style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}
                >
                  lightbulb
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#f59e0b" }}>
                    AI Summary
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
                    {ai_results.summary}
                  </p>
                  {ai_results.early_insight && (
                    <p className="text-xs mt-2 leading-relaxed" style={{ color: "#6b7280" }}>
                      <strong style={{ color: "#d97706" }}>Insight: </strong>
                      {ai_results.early_insight}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Question Breakdown ── */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: "#f9fafb" }}>
                  Question Breakdown
                  <span className="ml-2 text-xs font-normal" style={{ color: "#4b5563" }}>
                    {totalAwarded}/{totalMax} pts
                  </span>
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={expandAll}
                    className="text-xs font-semibold transition-colors"
                    style={{ color: "#6b7280" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#d1d5db")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
                  >
                    Expand All
                  </button>
                  <span style={{ color: "#374151" }}>·</span>
                  <button
                    onClick={collapseAll}
                    className="text-xs font-semibold transition-colors"
                    style={{ color: "#6b7280" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#d1d5db")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {enrichedQuestions.map((q, idx) => {
                  const isOpen  = expanded.includes(idx);
                  const pct     = Math.round((q.awarded_score / q.max_score) * 100);
                  const qColor  = scoreColor(pct);

                  return (
                    <div
                      key={idx}
                      className="rounded-2xl overflow-hidden"
                      style={{
                        background: "#111318",
                        border: isOpen ? "1px solid rgba(245,158,11,0.18)" : "1px solid rgba(255,255,255,0.06)",
                        transition: "border-color 0.2s",
                      }}
                    >
                      {/* Header */}
                      <div
                        className="px-5 py-4 flex items-center justify-between cursor-pointer select-none"
                        onClick={() => toggle(idx)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                            style={{
                              background: isOpen ? "#f59e0b" : "rgba(255,255,255,0.05)",
                              color: isOpen ? "#111827" : "#6b7280",
                            }}
                          >
                            {q.num}
                          </span>
                          <p className="text-sm font-semibold truncate" style={{ color: "#f9fafb" }}>
                            {q.question}
                          </p>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0 ml-4">
                          <div className="text-right hidden sm:block">
                            <span
                              className="text-xs font-bold"
                              style={{ color: qColor }}
                            >
                              {q.awarded_score}/{q.max_score}
                            </span>
                            <div className="w-16 rounded-full h-1 mt-1" style={{ background: "rgba(255,255,255,0.06)" }}>
                              <div className="h-1 rounded-full" style={{ width: `${pct}%`, background: qColor }} />
                            </div>
                          </div>
                          <span
                            className="material-symbols-outlined transition-transform duration-200"
                            style={{ fontSize: "20px", color: "#4b5563", transform: isOpen ? "rotate(180deg)" : "none" }}
                          >
                            expand_more
                          </span>
                        </div>
                      </div>

                      {/* Body */}
                      {isOpen && (
                        <div
                          className="px-5 pb-5 grid grid-cols-1 lg:grid-cols-12 gap-5"
                          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                        >
                          {/* Left */}
                          <div className="lg:col-span-8 space-y-4 pt-4">
                            {q.student_answer && (
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#374151" }}>
                                  Student Answer
                                </p>
                                <div
                                  className="p-4 rounded-xl text-sm leading-relaxed whitespace-pre-line"
                                  style={{ background: "rgba(255,255,255,0.03)", borderLeft: "3px solid rgba(255,255,255,0.12)", color: "#d1d5db" }}
                                >
                                  {q.student_answer}
                                </div>
                              </div>
                            )}
                            {q.expected_answer && (
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#374151" }}>
                                  Expected Answer
                                </p>
                                <div
                                  className="p-4 rounded-xl text-sm leading-relaxed"
                                  style={{ background: "rgba(255,255,255,0.02)", borderLeft: "3px solid rgba(255,255,255,0.06)", color: "#6b7280" }}
                                >
                                  {q.expected_answer}
                                </div>
                              </div>
                            )}
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 pt-1">
                              <TagPill label="Logic"    value={`${q.tags.logic}/10`}           color="#f59e0b" />
                              <TagPill label="Clarity"  value={`${q.tags.clarity}/10`}         color="#6366f1" />
                              <TagPill label="Complete" value={`${q.tags.completeness_pct}%`}  color="#10b981" />
                            </div>
                          </div>

                          {/* Right — AI Reasoning */}
                          <div className="lg:col-span-4 pt-4">
                            <div
                              className="rounded-xl p-4 h-full"
                              style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.1)" }}
                            >
                              <div className="flex items-center gap-2 mb-3" style={{ color: "#f59e0b" }}>
                                <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>psychology</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider">AI Reasoning</span>
                              </div>
                              <p className="text-xs leading-relaxed mb-3" style={{ color: "#9ca3af" }}>
                                {q.compliment}
                              </p>
                              {q.deduction && (
                                <div
                                  className="rounded-lg p-3 text-xs leading-relaxed"
                                  style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.1)", color: "#fca5a5" }}
                                >
                                  <span className="font-semibold" style={{ color: "#ef4444" }}>Deduction: </span>
                                  {q.deduction}
                                </div>
                              )}
                              {!q.deduction && (
                                <div
                                  className="rounded-lg p-3 text-xs"
                                  style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.1)", color: "#6ee7b7" }}
                                >
                                  ✓ Full marks awarded
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Score Distribution (quick visual) ── */}
            <div
              className="mb-6 rounded-2xl p-5"
              style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#374151" }}>
                Score Distribution
              </p>
              <div className="space-y-2.5">
                {enrichedQuestions.map((q, idx) => {
                  const pct = Math.round((q.awarded_score / q.max_score) * 100);
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-xs font-bold w-6 shrink-0" style={{ color: "#6b7280" }}>{q.num}</span>
                      <div className="flex-1 rounded-full h-2" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div
                          className="h-2 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: scoreColor(pct) }}
                        />
                      </div>
                      <span className="text-xs font-semibold w-16 text-right shrink-0" style={{ color: scoreColor(pct) }}>
                        {q.awarded_score}/{q.max_score} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Bottom Actions ── */}
            <div
              className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl"
              style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div>
                <h5 className="font-bold text-sm" style={{ color: "#f9fafb" }}>Review Complete?</h5>
                <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                  Save the report or start a new assessment check.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#d1d5db" }}
                >
                  Save Report
                </button>
                <button
                  onClick={() => navigate("/new-check")}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm"
                  style={{ background: "#f59e0b", color: "#111827", boxShadow: "0 4px 14px rgba(245,158,11,0.25)" }}
                >
                  New Assessment
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}