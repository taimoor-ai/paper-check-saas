import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/shared/SideNav";
import TopBar from "../components/shared/TopBar";

const historyData = [
  { date: "Oct 24, 2023", initials: "EW", color: "#f59e0b", name: "Emily Watson",  title: "The Ethical Implications of AI in Medicine",    status: "COMPLETED",  statusBg: "rgba(16,185,129,0.08)",  statusText: "#10b981", dot: "#10b981", score: 94  },
  { date: "Oct 23, 2023", initials: "JM", color: "#6366f1", name: "James Miller",  title: "Urban Planning in the 22nd Century",             status: "FLAGGED",    statusBg: "rgba(239,68,68,0.08)",   statusText: "#ef4444", dot: "#ef4444", score: 42  },
  { date: "Oct 22, 2023", initials: "SC", color: "#10b981", name: "Sophia Chen",   title: "Shakespearean Motifs in Modern Cinema",           status: "IN REVIEW",  statusBg: "rgba(245,158,11,0.08)", statusText: "#f59e0b", dot: "#f59e0b", score: null },
  { date: "Oct 21, 2023", initials: "DB", color: "#f59e0b", name: "David Brooks",  title: "Macroeconomic Shifts in Emerging Markets",        status: "COMPLETED",  statusBg: "rgba(16,185,129,0.08)",  statusText: "#10b981", dot: "#10b981", score: 88  },
];

const stats = [
  { label: "Total Checks",     value: "1,248", trend: "+12% this month",    trendColor: "#10b981", icon: "trending_up",  accent: true  },
  { label: "Avg Score",        value: "76.4%",  trend: "Stable vs last year", trendColor: "#4b5563",  icon: "bar_chart",    accent: false },
  { label: "Plagiarism Flags", value: "14",     trend: "3 critical alerts",   trendColor: "#ef4444",  icon: "warning",      accent: false },
  { label: "Pending Review",   value: "6",      trend: "Est. 2h remaining",   trendColor: "#f59e0b",  icon: "schedule",     accent: false },
];

const FILTERS = [
  { label: "Date Range",    options: ["Date Range", "Last 7 Days", "Last 30 Days", "Custom"] },
  { label: "Class/Section", options: ["Class/Section", "English 101", "Ethics & Law", "Advanced Lit"] },
  { label: "Status",        options: ["Status", "Completed", "In Review", "Flagged"] },
];

export default function History() {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [page, setPage] = useState(1);

  const selStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#9ca3af",
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: "#0d1117" }}>
      <SideNav isOpen={navOpen} onClose={() => setNavOpen(false)} />
      <main className="lg:ml-64 flex-1 min-h-screen">
        <TopBar showSearch={false} showPoints={false} onMenuToggle={() => setNavOpen((open) => !open)} />

        <div className="mt-16 p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
            <div>
              <p className="text-xs font-bold text-amber-500 uppercase tracking-widest font-headline mb-1">
                Workspace Archive
              </p>
              <h2 className="text-3xl font-extrabold font-headline" style={{ color: "#f9fafb" }}>
                Analysis History
              </h2>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              {FILTERS.map((f) => (
                <select
                  key={f.label}
                  className="h-9 rounded-xl px-3 pr-8 text-xs font-semibold font-body appearance-none cursor-pointer transition-all"
                  style={selStyle}
                  onFocus={e => (e.currentTarget.style.border = "1px solid rgba(245,158,11,0.35)")}
                  onBlur={e => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)")}
                >
                  {f.options.map((o) => (
                    <option key={o} style={{ background: "#161b22" }}>{o}</option>
                  ))}
                </select>
              ))}
            </div>
          </div>

          {/* Table */}
          <div
            className="rounded-2xl overflow-hidden mb-6"
            style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                    {["Date", "Student", "Paper Title", "Status", "Cost", "Score", ""].map((h, i) => (
                      <th
                        key={i}
                        className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest font-headline"
                        style={{ color: "#374151" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="cursor-pointer transition-colors group"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="px-6 py-4 text-sm whitespace-nowrap" style={{ color: "#6b7280" }}>{row.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-900 font-bold text-[10px] font-headline shrink-0"
                            style={{ background: row.color }}
                          >
                            {row.initials}
                          </div>
                          <span className="font-semibold text-sm whitespace-nowrap font-headline" style={{ color: "#f9fafb" }}>
                            {row.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm max-w-xs" style={{ color: "#9ca3af" }}>
                        <span className="line-clamp-1">{row.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-headline"
                          style={{ background: row.statusBg, color: row.statusText }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: row.dot }} />
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-xs font-bold font-headline px-2 py-1 rounded-full"
                          style={{ background: "rgba(245,158,11,0.08)", color: "#f59e0b" }}
                        >
                          20 pts
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {row.score != null ? (
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold font-headline" style={{ color: "#f9fafb" }}>{row.score}</span>
                            <span className="text-xs" style={{ color: "#374151" }}>/100</span>
                          </div>
                        ) : (
                          <span className="text-xl font-bold" style={{ color: "#374151" }}>—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="p-1.5 opacity-0 group-hover:opacity-100 rounded-lg transition-all"
                          style={{ color: "#f59e0b" }}
                          onClick={() => navigate("/results")}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>chevron_right</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              {historyData.map((row, idx) => (
                <div
                  key={idx}
                  className="px-5 py-4 cursor-pointer transition-colors"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                  onClick={() => navigate("/results")}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-gray-900 font-bold text-xs font-headline shrink-0"
                        style={{ background: row.color }}
                      >
                        {row.initials}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-semibold text-sm truncate font-headline" style={{ color: "#f9fafb" }}>{row.name}</p>
                        <p className="text-xs truncate" style={{ color: "#4b5563" }}>{row.title}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="font-bold font-headline" style={{ color: row.score ? "#f9fafb" : "#374151" }}>
                        {row.score ?? "—"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 ml-12">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-headline"
                      style={{ background: row.statusBg, color: row.statusText }}
                    >
                      <span className="w-1 h-1 rounded-full" style={{ background: row.dot }} />
                      {row.status}
                    </span>
                    <span className="text-xs" style={{ color: "#4b5563" }}>{row.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}
            >
              <p className="text-xs font-headline" style={{ color: "#374151" }}>Showing 1–4 of 42 records</p>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg transition-colors" style={{ color: "#374151" }} disabled>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>keyboard_arrow_left</span>
                </button>
                {[1, 2, 3, 4].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 rounded-lg text-xs font-bold font-headline transition-all"
                    style={{
                      background: page === p ? "#f59e0b" : "transparent",
                      color: page === p ? "#111827" : "#4b5563",
                    }}
                  >
                    {p}
                  </button>
                ))}
                <button className="p-1.5 rounded-lg transition-colors" style={{ color: "#4b5563" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>keyboard_arrow_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats bento */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl"
                style={{
                  background: "#161b22",
                  border: s.accent ? "1px solid rgba(245,158,11,0.25)" : "1px solid rgba(255,255,255,0.06)",
                  borderLeft: s.accent ? "3px solid #f59e0b" : undefined,
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest font-headline mb-1.5" style={{ color: "#374151" }}>
                  {s.label}
                </p>
                <h4 className="text-2xl font-extrabold font-headline mb-2" style={{ color: "#f9fafb" }}>{s.value}</h4>
                <div className="flex items-center gap-1 text-[10px] font-bold font-headline" style={{ color: s.trendColor }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>{s.icon}</span>
                  {s.trend}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating AI button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all"
            style={{
              background: "#161b22",
              border: "1px solid rgba(245,158,11,0.2)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}>
              smart_toy
            </span>
            <span className="text-xs font-bold font-headline" style={{ color: "#f9fafb" }}>AI Assistant</span>
          </button>
        </div>
      </main>
    </div>
  );
}
