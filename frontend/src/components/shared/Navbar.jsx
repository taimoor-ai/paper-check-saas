import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "/#features", anchor: true },
    { label: "Pricing", href: "/#pricing", anchor: true },
    { label: "About", href: "/about", anchor: false },
  ];

  const isActive = (href) =>
    href === "/about" && location.pathname === "/about";

  return (
    <nav
      className="fixed top-0 w-full z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(13,17,23,0.95)"
          : "rgba(13,17,23,0.80)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5"
        >
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
          <span className="text-white font-bold text-base font-headline">
            Editorial AI
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7 font-semibold text-sm font-headline">
          {navLinks.map((link) =>
            link.anchor ? (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors"
                style={{ color: "#9ca3af" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#f9fafb"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#9ca3af"; }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="transition-colors"
                style={{ color: isActive(link.href) ? "#f59e0b" : "#9ca3af" }}
                onMouseEnter={e => { if (!isActive(link.href)) e.currentTarget.style.color = "#f9fafb"; }}
                onMouseLeave={e => { if (!isActive(link.href)) e.currentTarget.style.color = "#9ca3af"; }}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:block text-sm font-semibold font-headline transition-colors"
            style={{ color: "#9ca3af" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f9fafb")}
            onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="text-gray-900 px-5 py-2 rounded-lg font-bold text-sm font-headline hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ background: "#f59e0b", boxShadow: "0 4px 14px rgba(245,158,11,0.3)" }}
          >
            Get Started Free
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: "#9ca3af" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 py-4 space-y-1"
          style={{ background: "#0d1117", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {navLinks.map((link) =>
            link.anchor ? (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block font-semibold text-sm py-2.5 transition-colors font-headline"
                style={{ color: "#9ca3af" }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="block font-semibold text-sm py-2.5 transition-colors font-headline"
                style={{ color: "#9ca3af" }}
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block font-semibold text-sm py-2.5 font-headline"
            style={{ color: "#9ca3af" }}
          >
            Log In
          </Link>
        </div>
      )}
    </nav>
  );
}