export default function TopBar({ showSearch = true, showPoints = false, searchPlaceholder = "Search papers...", onMenuToggle = () => {} }) {
  return (
    <header
      className="fixed top-0 right-0 h-16 z-40 flex items-center justify-between px-4 sm:px-6 w-full lg:w-[calc(100%-16rem)]"
      style={{
        background: "#0d1117",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 rounded-xl transition-colors text-amber-400 hover:bg-white/5"
          onClick={onMenuToggle}
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>menu</span>
        </button>
      </div>

      {showSearch && (
        <div className="flex items-center flex-1 max-w-sm">
          <div className="relative w-full">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ fontSize: "17px", color: "#374151" }}
            >
              search
            </span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full h-9 rounded-xl pl-10 pr-4 text-sm font-body transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#f9fafb",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid rgba(245,158,11,0.35)";
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 ml-4">
        {showPoints && (
          <>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}
            >
              <span
                className="material-symbols-outlined text-amber-500"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: "14px" }}
              >
                token
              </span>
              <span className="text-sm font-bold font-headline whitespace-nowrap" style={{ color: "#f59e0b" }}>
                0 pts
              </span>
            </div>

            <div className="w-px h-5 mx-1" style={{ background: "rgba(255,255,255,0.07)" }} />
          </>
        )}

        <button
          className="p-2 rounded-xl transition-colors"
          style={{ color: "#374151" }}
          aria-label="Notifications"
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#9ca3af";
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#374151";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>notifications</span>
        </button>
        <button
          className="p-2 rounded-xl transition-colors"
          style={{ color: "#374151" }}
          aria-label="Settings"
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#9ca3af";
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#374151";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>settings</span>
        </button>
      </div>
    </header>
  );
}
