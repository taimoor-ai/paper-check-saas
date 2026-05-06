import { useEffect, useState } from "react";
import SideNav from "../components/shared/SideNav";
import TopBar from "../components/shared/TopBar";
import api from "../lib/api"; // your axios instance

// ── Plan config ──────────────────────────────────────────────
const packs = [
  {
    name: "Starter",
    price: "$5",
    points: "500 points",
    checks: "25 checks",
    hint: "$1 = 100 pts · 20 pts / check",
    features: ["25 paper checks", "All analysis modes", "No expiration", "Standard support"],
    recommended: false,
    cta: "Buy Starter",
    payload: { price_id: "price_1TOxIzA2ZszIQlfB2mXW5Ege", points: 500, amount_usd: 5 },
  },
  {
    name: "Standard",
    price: "$10",
    points: "1,000 points",
    checks: "50 checks",
    hint: "Best value for regular use",
    features: ["50 paper checks", "All analysis modes", "No expiration", "Priority processing", "Beta features"],
    recommended: true,
    cta: "Buy Standard",
    payload: { price_id: "price_1TOxJcA2ZszIQlfBt2GTwGUN", points: 1000, amount_usd: 10 },
  },
  {
    name: "Power",
    price: "$25",
    points: "2,500 points",
    checks: "125 checks",
    hint: "For institutions & heavy use",
    features: ["125 paper checks", "All analysis modes", "No expiration", "Dedicated support", "LMS integration", "Analytics export"],
    recommended: false,
    cta: "Buy Power",
    payload: { price_id: "price_1TOxK5A2ZszIQlfBII25sdTn", points: 2500, amount_usd: 22 },
  },
];

// ── Helpers ───────────────────────────────────────────────────
function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function statusStyle(status) {
  if (status === "completed")
    return { bg: "rgba(16,185,129,0.08)", text: "#10b981", dot: "#10b981", label: "Successful" };
  if (status === "failed")
    return { bg: "rgba(239,68,68,0.08)", text: "#ef4444", dot: "#ef4444", label: "Declined" };
  return { bg: "rgba(245,158,11,0.08)", text: "#f59e0b", dot: "#f59e0b", label: "Pending" };
}

function methodIcon(method) {
  if (!method) return "receipt";
  if (method.toLowerCase().includes("visa") || method.toLowerCase().includes("stripe")) return "credit_card";
  return "account_balance";
}

// ── Component ─────────────────────────────────────────────────
export default function Billing() {
  const [user, setUser]               = useState(null);
  const [history, setHistory]         = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingHist, setLoadingHist] = useState(true);
  const [buying, setBuying]           = useState(null); // pack name being purchased
  const [error, setError]             = useState(null);
  const [navOpen, setNavOpen]         = useState(false);

  // Fetch user balance
  useEffect(() => {
    api.get("/auth/me")
      .then(r => setUser(r.data))
      .catch(() => setError("Failed to load account info."))
      .finally(() => setLoadingUser(false));
  }, []);

  // Fetch transaction history
  useEffect(() => {
    api.get("/billing/history")
      .then(r => setHistory(r.data))
      .catch(() => setError("Failed to load transaction history."))
      .finally(() => setLoadingHist(false));
  }, []);

  // Handle plan purchase
  async function handleBuy(pack) {
    if (buying) return;
    setBuying(pack.name);
    setError(null);
    try {
      const { data } = await api.post("/billing/create-checkout", pack.payload);
      if (data?.checkout_url) {
        window.location.href = data.checkout_url; // redirect to Stripe
      } else {
        setError("No checkout URL returned. Please try again.");
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Checkout failed. Please try again.");
    } finally {
      setBuying(null);
    }
  }

  const balance = user?.points_balance ?? 0;
  const checksRemaining = Math.floor(balance / 20);

  return (
    <div className="flex min-h-screen" style={{ background: "#0d1117" }}>
      <SideNav isOpen={navOpen} onClose={() => setNavOpen(false)} />
      <main className="lg:ml-64 flex-1 min-h-screen">
        <TopBar showSearch={false} showPoints={false} onMenuToggle={() => setNavOpen((open) => !open)} />
        <div className="mt-16 p-6 lg:p-8">

          {/* ── Page header ── */}
          <div className="mb-8">
            <p className="text-xs font-bold text-amber-500 uppercase tracking-widest font-headline mb-1">Workspace</p>
            <h1 className="text-3xl font-extrabold font-headline tracking-tight" style={{ color: "#f9fafb" }}>
              Billing &amp; Points
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
              Manage your editorial points and purchase history.
            </p>
          </div>

          {/* ── Global error banner ── */}
          {error && (
            <div
              className="flex items-center gap-3 px-5 py-3 rounded-xl mb-6 text-sm font-semibold"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>error</span>
              {error}
              <button className="ml-auto opacity-60 hover:opacity-100" onClick={() => setError(null)}>✕</button>
            </div>
          )}

          {/* ── Pricing rule banner ── */}
          <div
            className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 rounded-2xl mb-8"
            style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}
          >
            <div className="flex flex-wrap gap-8">
              {[
                { icon: "token",        label: "$1 = 100 points" },
                { icon: "check_circle", label: "20 points / check" },
                { icon: "all_inclusive", label: "Points never expire" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-amber-400"
                    style={{ fontVariationSettings: "'FILL' 1", fontSize: "17px" }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm font-bold font-headline" style={{ color: "#d1d5db" }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <a href="#purchase" className="text-xs font-bold font-headline text-amber-400 hover:text-amber-300 transition-colors">
              Buy more points →
            </a>
          </div>

          {/* ── Balance + usage row ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {/* Balance card */}
            <div
              className="md:col-span-2 rounded-2xl p-7 relative overflow-hidden"
              style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest font-headline mb-3" style={{ color: "#4b5563" }}>
                  Current Balance
                </p>
                {loadingUser ? (
                  <div className="flex items-end gap-3 mb-4">
                    <div className="w-32 h-14 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
                  </div>
                ) : (
                  <div className="flex items-end gap-3 mb-4">
                    <h2 className="text-6xl font-extrabold font-headline leading-none" style={{ color: "#f9fafb" }}>
                      {balance.toLocaleString()}
                    </h2>
                    <span className="text-lg mb-1" style={{ color: "#6b7280" }}>points</span>
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5" style={{ color: "#6b7280" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>schedule</span>
                    Points never expire
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-headline"
                    style={{ background: "rgba(245,158,11,0.10)", color: "#f59e0b" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "12px" }}>bolt</span>
                    {checksRemaining} checks remaining
                  </div>
                </div>
              </div>
              {/* Decorative orbs */}
              <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full blur-3xl" style={{ background: "rgba(245,158,11,0.06)" }} />
              <div
                className="absolute right-8 bottom-8 w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.1)" }}
              >
                <span
                  className="material-symbols-outlined text-amber-500"
                  style={{ fontVariationSettings: "'FILL' 1", fontSize: "24px" }}
                >
                  token
                </span>
              </div>
            </div>

            {/* Usage guide */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <h3 className="font-headline font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "#f9fafb" }}>
                <span className="material-symbols-outlined text-amber-500" style={{ fontSize: "16px" }}>bolt</span>
                Points Usage
              </h3>
              <div className="space-y-3">
                {[
                  { mode: "Fast Mode",     desc: "Direct matching",        cost: "10 pts" },
                  { mode: "Standard Mode", desc: "Semantic analysis",       cost: "15 pts" },
                  { mode: "Advanced Mode", desc: "Deep editorial critique", cost: "20 pts" },
                ].map((m) => (
                  <div key={m.mode} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div>
                      <p className="text-sm font-semibold font-headline" style={{ color: "#d1d5db" }}>{m.mode}</p>
                      <p className="text-xs" style={{ color: "#4b5563" }}>{m.desc}</p>
                    </div>
                    <span
                      className="text-[11px] font-bold font-headline px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(245,158,11,0.10)", color: "#f59e0b" }}
                    >
                      {m.cost}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] mt-3" style={{ color: "#374151" }}>
                All modes cost 20 points per check · $1 = 100 points
              </p>
            </div>
          </div>

          {/* ── Pricing cards ── */}
          <div className="mb-8" id="purchase">
            <h2 className="text-lg font-bold font-headline mb-5" style={{ color: "#f9fafb" }}>
              Purchase Points
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {packs.map((pack) => (
                <div
                  key={pack.name}
                  className="relative rounded-2xl p-6 flex flex-col transition-all hover:scale-[1.01]"
                  style={{
                    background: pack.recommended ? "linear-gradient(135deg, #1c1906 0%, #1a1200 100%)" : "#161b22",
                    border: pack.recommended
                      ? "1px solid rgba(245,158,11,0.35)"
                      : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: pack.recommended ? "0 0 30px rgba(245,158,11,0.10)" : "none",
                  }}
                >
                  {pack.recommended && (
                    <div className="absolute -top-3 left-5">
                      <span
                        className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full font-headline"
                        style={{ background: "#f59e0b", color: "#111827" }}
                      >
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-5">
                    <h4 className="font-headline font-bold text-lg mb-1" style={{ color: "#f9fafb" }}>{pack.name}</h4>
                    <div className="flex items-end gap-2">
                      <span
                        className="text-4xl font-extrabold font-headline"
                        style={{ color: pack.recommended ? "#f59e0b" : "#f9fafb" }}
                      >
                        {pack.price}
                      </span>
                    </div>
                    <p className="text-sm font-bold font-headline mt-1" style={{ color: "#f59e0b" }}>{pack.points}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#4b5563" }}>
                      {pack.checks} · {pack.hint}
                    </p>
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {pack.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <span
                          className="material-symbols-outlined flex-shrink-0"
                          style={{ fontVariationSettings: "'FILL' 1", fontSize: "16px", color: "#f59e0b" }}
                        >
                          check_circle
                        </span>
                        <span style={{ color: "#9ca3af" }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleBuy(pack)}
                    disabled={!!buying}
                    className="w-full py-3 rounded-xl font-headline font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={
                      pack.recommended
                        ? { background: "#f59e0b", color: "#111827" }
                        : {
                            background: "rgba(255,255,255,0.05)",
                            color: "#d1d5db",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }
                    }
                  >
                    {buying === pack.name ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Redirecting…
                      </>
                    ) : pack.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Transaction Table ── */}
          <div
            className="rounded-2xl overflow-hidden mb-8"
            style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <h3 className="font-headline font-bold" style={{ color: "#f9fafb" }}>Transaction History</h3>
              <button className="text-sm font-semibold font-headline flex items-center gap-1.5 transition-colors" style={{ color: "#f59e0b" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>download</span>
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              {loadingHist ? (
                <div className="px-6 py-10 text-center text-sm" style={{ color: "#4b5563" }}>
                  <svg className="animate-spin w-5 h-5 mx-auto mb-2" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="4" />
                    <path className="opacity-75" fill="#f59e0b" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Loading transactions…
                </div>
              ) : history.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm" style={{ color: "#4b5563" }}>
                  No transactions yet. Purchase a plan to get started.
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                      {["Date", "Points", "Amount", "Method", "Status"].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest font-headline"
                          style={{ color: "#374151" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((tx) => {
                      const s = statusStyle(tx.status);
                      return (
                        <tr
                          key={tx.id}
                          className="transition-colors"
                          style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <td className="px-6 py-4 text-sm whitespace-nowrap" style={{ color: "#6b7280" }}>
                            {formatDate(tx.purchase_date)}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold font-headline" style={{ color: "#f9fafb" }}>
                            {tx.points_added.toLocaleString()} pts
                          </td>
                          <td className="px-6 py-4 text-sm" style={{ color: "#6b7280" }}>
                            ${tx.amount_usd.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm" style={{ color: "#6b7280" }}>
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#374151" }}>
                                {methodIcon(tx.payment_method)}
                              </span>
                              {tx.payment_method ?? "—"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-headline"
                              style={{ background: s.bg, color: s.text }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                              {s.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* ── FAQ row ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                q: "How do points work?",
                a: "Points are Editorial AI's currency. $1 buys 100 points. Each paper check deducts 20 points regardless of mode. Points never expire while your account is active.",
              },
              {
                q: "Can I get a refund?",
                a: "Unused point packs can be refunded within 14 days of purchase. Once any points from a pack are used, the standard refund policy no longer applies.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl p-6"
                style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <h4 className="font-headline font-bold mb-2" style={{ color: "#f9fafb" }}>{faq.q}</h4>
                <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>{faq.a}</p>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}