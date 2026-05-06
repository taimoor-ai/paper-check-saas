import { Link } from "react-router-dom";

const tiers = [
  {
    name: "Starter",
    price: "$5",
    points: "500 points",
    checks: "25 checks",
    perPoint: "$0.01 / point",
    features: [
      "25 paper checks",
      "All analysis modes",
      "No expiration",
      "Standard support",
    ],
    recommended: false,
    cta: "Buy Starter",
    highlight: false,
  },
  {
    name: "Standard",
    price: "$10",
    points: "1,000 points",
    checks: "50 checks",
    perPoint: "$0.01 / point",
    features: [
      "50 paper checks",
      "All analysis modes",
      "No expiration",
      "Priority processing",
      "Beta feature access",
    ],
    recommended: true,
    cta: "Buy Standard",
    highlight: true,
  },
  {
    name: "Power",
    price: "$25",
    points: "2,500 points",
    checks: "125 checks",
    perPoint: "$0.01 / point",
    features: [
      "125 paper checks",
      "All analysis modes",
      "No expiration",
      "Dedicated support",
      "LMS integration",
      "Analytics export",
    ],
    recommended: false,
    cta: "Buy Power",
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section className="py-28 relative" id="pricing" style={{ background: "#0d1117" }}>
      {/* Grid bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-6"
            style={{ background: "rgba(245,158,11,0.10)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "14px" }}>token</span>
            Simple Credit-Based Pricing
          </div>
          <h2 className="text-4xl font-extrabold font-headline mb-4" style={{ color: "#f9fafb" }}>
            Pay Only for What You Grade
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: "#6b7280" }}>
            No subscriptions, no hidden fees. Each paper check costs <strong style={{ color: "#f59e0b" }}>20 points</strong> and{" "}
            <strong style={{ color: "#f59e0b" }}>$1 = 100 points</strong>.
          </p>
        </div>

        {/* Key rule banner */}
        <div
          className="flex flex-wrap items-center justify-center gap-8 px-8 py-5 rounded-2xl mb-12"
          style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}
        >
          {[
            { icon: "token", label: "$1 = 100 points" },
            { icon: "check_circle", label: "20 points / check" },
            { icon: "all_inclusive", label: "Points never expire" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-amber-400"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}
              >
                {item.icon}
              </span>
              <span className="font-bold text-sm font-headline" style={{ color: "#d1d5db" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="relative rounded-2xl p-7 flex flex-col transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: tier.highlight ? "linear-gradient(135deg, #1c1906 0%, #1a1200 100%)" : "#161b22",
                border: tier.highlight
                  ? "1px solid rgba(245,158,11,0.4)"
                  : "1px solid rgba(255,255,255,0.06)",
                boxShadow: tier.highlight ? "0 0 40px rgba(245,158,11,0.12)" : "none",
              }}
            >
              {tier.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className="text-gray-900 text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full font-headline"
                    style={{ background: "#f59e0b" }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className="font-headline font-bold text-xl mb-1"
                  style={{ color: "#f9fafb" }}
                >
                  {tier.name}
                </h3>
                <div className="flex items-end gap-2 mb-1">
                  <span
                    className="text-5xl font-extrabold font-headline"
                    style={{ color: tier.highlight ? "#f59e0b" : "#f9fafb" }}
                  >
                    {tier.price}
                  </span>
                </div>
                <p className="text-sm font-bold font-headline" style={{ color: "#f59e0b" }}>
                  {tier.points}
                </p>
                <p className="text-xs mt-1" style={{ color: "#6b7280" }}>
                  {tier.checks} · {tier.perPoint}
                </p>
              </div>

              <ul className="space-y-3 mb-7 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
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

              <Link
                to="/register"
                className="block text-center py-3.5 rounded-xl font-bold text-sm font-headline transition-all active:scale-[0.98]"
                style={
                  tier.highlight
                    ? { background: "#f59e0b", color: "#111827" }
                    : {
                        background: "rgba(255,255,255,0.05)",
                        color: "#d1d5db",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }
                }
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-sm italic" style={{ color: "#4b5563" }}>
          All checks use the same point pool. Points never expire. Bulk purchases available on request.
        </p>
      </div>
    </section>
  );
}