import { NavLink, useNavigate } from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";

const navItems = [
  { icon: "dashboard",   label: "Dashboard", to: "/dashboard" },
  { icon: "add_circle",  label: "New Check", to: "/new-check" },
  { icon: "settings",    label: "Settings",  to: "/settings"  },
  { icon: "payments",    label: "Billing",   to: "/billing"   },
];

export default function SideNav({ isOpen = true, onClose = () => {} }) {
  const navigate = useNavigate();
  const { user, loading } = useCurrentUser();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 h-screen w-64 transform flex flex-col transition-transform duration-300 bg-[#0d1117] border-r border-white/10 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* ── Logo ── */}
        <div
          className="h-16 px-5 flex items-center shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center mr-3 shrink-0">
            <span
              className="material-symbols-outlined text-gray-900"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: "17px" }}
            >
              auto_awesome
            </span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm font-headline leading-none">
              Editorial AI
            </h1>
            <p className="text-[10px] uppercase tracking-[0.12em] mt-0.5" style={{ color: "#374151" }}>
              Paper Grader
            </p>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-headline font-semibold text-sm transition-all duration-150 ${
                  isActive
                    ? "text-white"
                    : "hover:bg-white/[0.04]"
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { background: "rgba(245,158,11,0.10)", color: "#f9fafb" }
                  : { color: "#4b5563" }
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 inset-y-2 w-0.5 bg-amber-500 rounded-r-full" />
                  )}
                  <span
                    className="material-symbols-outlined text-xl"
                    style={
                      isActive
                        ? { fontVariationSettings: "'FILL' 1", color: "#f59e0b" }
                        : {}
                    }
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div
          className="p-4 shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {loading ? (
            <div className="rounded-2xl p-4 bg-white/5 text-sm text-center text-[#d1d5db]">
              Loading account...
            </div>
          ) : user ? (
            <>
              <div
                className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.12)" }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-amber-500"
                    style={{ fontVariationSettings: "'FILL' 1", fontSize: "16px" }}
                  >
                    token
                  </span>
                  <span className="text-xs font-bold font-headline" style={{ color: "#d1d5db" }}>
                    {(user.points_balance ?? 0).toLocaleString()} pts
                  </span>
                </div>
                <span className="text-[10px] font-headline" style={{ color: "#4b5563" }}>
                  {Math.max(0, Math.floor((user.points_balance ?? 0) / 20))} checks left
                </span>
              </div>

              <div className="flex items-center gap-3 px-1 mt-4">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-gray-900 font-bold text-xs font-headline shrink-0">
                  {user.name
                    ? user.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()
                    : user.email?.slice(0, 2).toUpperCase() || "AC"}
                </div>
                <div className="overflow-hidden flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate font-headline leading-none mb-0.5">
                    {user.name ?? "Academic Curator"}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: "#374151" }}>
                    {user.email ?? "curator@university.edu"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  localStorage.removeItem("access_token");
                  window.location.href = "/login";
                }}
                className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all bg-white/5 hover:bg-white/10"
                style={{ color: "#f59e0b" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>logout</span>
                Logout
              </button>
            </>
          ) : (
            <div className="rounded-2xl p-4 bg-white/5 text-sm text-center text-[#d1d5db]">
              No account data available.
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
