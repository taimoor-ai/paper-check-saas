import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/shared/SideNav";
import TopBar from "../components/shared/TopBar";
import useCurrentUser from "../hooks/useCurrentUser";


function StatCard({ icon, iconColor, iconBg, label, value, sub }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4 hover:scale-[1.01] transition-all"
      style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: iconBg }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1", fontSize: "22px", color: iconColor }}
        >
          {icon}
        </span>
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest font-headline mb-1" style={{ color: "#374151" }}>
          {label}
        </p>
        <h3 className="text-3xl font-extrabold font-headline leading-none" style={{ color: "#f9fafb" }}>
          {value}
        </h3>
        {sub && <div className="text-xs mt-1.5" style={{ color: "#4b5563" }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [showAI, setShowAI] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useCurrentUser();

  const pointsBalance = user?.points_balance ?? 180;
  const checksRemaining = Math.max(0, Math.floor(pointsBalance / 20));
  const displayName = user?.name ?? "Academic Curator";

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: "#0d1117" }}>
      <SideNav isOpen={navOpen} onClose={() => setNavOpen(false)} />

      <main className="lg:ml-64 flex-1 flex flex-col min-h-screen">
        <TopBar showSearch={false} onMenuToggle={() => setNavOpen((open) => !open)} />

        <section className="mt-16 p-6 lg:p-8 flex-1">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold text-amber-500 uppercase tracking-widest font-headline mb-1">Overview</p>
              <h2 className="text-3xl font-extrabold tracking-tight font-headline" style={{ color: "#f9fafb" }}>
                Editorial Dashboard
              </h2>
              <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
                AI-powered academic assessment at a glance.
              </p>
              <p className="text-sm mt-2" style={{ color: "#9ca3af" }}>
                Welcome back, {displayName}.
              </p>
            </div>
            <button
              onClick={() => navigate("/new-check")}
              className="inline-flex items-center gap-2 px-5 py-2.5 font-headline font-bold text-sm rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shrink-0"
              style={{ background: "#f59e0b", color: "#111827", boxShadow: "0 4px 14px rgba(245,158,11,0.3)" }}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}>add_circle</span>
              New Check — 20 pts
            </button>
          </div>

          {/* Points info banner */}
          <div
            className="flex items-center gap-3 px-5 py-3.5 rounded-xl mb-8"
            style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.12)" }}
          >
            <span
              className="material-symbols-outlined text-amber-400"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}
            >
              info
            </span>
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              Each check costs <strong style={{ color: "#f59e0b" }}>20 points</strong> ·{" "}
              <strong style={{ color: "#f59e0b" }}>$1 = 100 points</strong> · You have{" "}
              <strong style={{ color: "#f9fafb" }}>{pointsBalance.toLocaleString()} points remaining</strong> ({checksRemaining} checks)
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
            <StatCard
              icon="analytics"
              iconBg="rgba(99,102,241,0.10)"
              iconColor="#6366f1"
              label="Total Checks"
              value="284"
              sub={<span style={{ color: "#10b981" }}>↑ 12% from last month</span>}
            />
            <StatCard
              icon="star"
              iconBg="rgba(245,158,11,0.10)"
              iconColor="#f59e0b"
              label="Average Score"
              value={<>86.4<span className="text-base font-normal" style={{ color: "#374151" }}>/100</span></>}
              sub="Top 5% of all users"
            />
            <StatCard
              icon="token"
              iconBg="rgba(245,158,11,0.10)"
              iconColor="#f59e0b"
              label="Points Balance"
              value={pointsBalance.toLocaleString()}
              sub={
                <div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden mb-1" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (checksRemaining / 25) * 100)}%`, background: "#f59e0b" }} />
                  </div>
                  {checksRemaining} checks remaining · $1 = 100 pts
                </div>
              }
            />
          </div>

          {/* Recent Checks Table */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="px-6 py-5"
            >
              <h3 className="text-base font-bold font-headline" style={{ color: "#f9fafb" }}>
                Activity summary
              </h3>
              <p className="text-sm mt-2" style={{ color: "#6b7280" }}>
                Check history is available in Account settings after your first submission completes.
              </p>
            </div>

          </div>
        </section>
      </main>

      {/* AI Suggestion Bubble */}
      {showAI && (
        <div
          className="fixed bottom-6 right-6 w-72 p-4 rounded-2xl z-50"
          style={{
            background: "#161b22",
            border: "1px solid rgba(245,158,11,0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-gray-900"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}
              >
                auto_awesome
              </span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm font-headline mb-1" style={{ color: "#f9fafb" }}>
                Curator Insight
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>
                Your average score improved by 5 pts this week. You have 9 checks remaining in your balance.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  className="px-3 py-1.5 rounded-lg text-xs font-bold font-headline transition-colors"
                  style={{ background: "#f59e0b", color: "#111827" }}
                >
                  Show me
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg text-xs font-bold font-headline transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#6b7280" }}
                  onClick={() => setShowAI(false)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
