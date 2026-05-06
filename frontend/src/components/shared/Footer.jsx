import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ background: "#0d1117", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#f59e0b" }}
            >
              <span
                className="material-symbols-outlined text-gray-900"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: "16px" }}
              >
                auto_awesome
              </span>
            </div>
            <span className="text-white font-bold font-headline">Editorial AI</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>
            The premier AI platform for academic paper grading and assessment.
          </p>
          <div className="mt-5 flex items-center gap-2 text-xs" style={{ color: "#374151" }}>
            <span
              className="material-symbols-outlined text-amber-500"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: "13px" }}
            >
              token
            </span>
            $1 = 100 pts · 20 pts / check
          </div>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-white font-bold text-xs mb-5 uppercase tracking-widest font-headline">
            Product
          </h4>
          <ul className="space-y-3">
            {[
              { label: "Features", href: "/#features" },
              { label: "Pricing", href: "/#pricing" },
              { label: "How It Works", href: "/#how-it-works" },
              { label: "Documentation", href: "#" },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className="text-xs transition-colors"
                  style={{ color: "#374151" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#9ca3af")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-bold text-xs mb-5 uppercase tracking-widest font-headline">
            Company
          </h4>
          <ul className="space-y-3">
            <li>
              <Link
                to="/about"
                className="text-xs transition-colors"
                style={{ color: "#374151" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#9ca3af")}
                onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
              >
                About
              </Link>
            </li>
            {["Careers", "Privacy Policy", "Terms of Service"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-xs transition-colors"
                  style={{ color: "#374151" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#9ca3af")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold text-xs mb-5 uppercase tracking-widest font-headline">
            Support
          </h4>
          <ul className="space-y-3">
            {["Help Center", "Contact Us", "System Status"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-xs transition-colors"
                  style={{ color: "#374151" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#9ca3af")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p className="text-xs" style={{ color: "#1f2937" }}>
          © 2024 Editorial AI. All rights reserved.
        </p>
        <p className="text-xs" style={{ color: "#1f2937" }}>
          All analysis is encrypted and private.
        </p>
      </div>
    </footer>
  );
}