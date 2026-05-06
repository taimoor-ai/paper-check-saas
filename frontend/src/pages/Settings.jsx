import { useState } from "react";
import SideNav from "../components/shared/SideNav";
import TopBar from "../components/shared/TopBar";
import useCurrentUser from "../hooks/useCurrentUser";

export default function Settings() {
  const [navOpen, setNavOpen] = useState(false);
  const { user, loading, error } = useCurrentUser();

  const pointsBalance = user?.points_balance ?? 0;
  const checksRemaining = Math.max(0, Math.floor(pointsBalance / 20));
  const accountName = user?.name || user?.email || "Editorial Curator";
  const accountEmail = user?.email || "curator@university.edu";
  const planName = user?.plan || user?.subscription || "Starter";
  const status = user?.status || "Active";

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: "#0d1117" }}>
      <SideNav isOpen={navOpen} onClose={() => setNavOpen(false)} />
      <main className="lg:ml-64 flex-1 min-h-screen">
        <TopBar showSearch={false} showPoints={false} onMenuToggle={() => setNavOpen((open) => !open)} />
        <div className="mt-16 p-6 lg:p-8">
          <div className="mb-8">
            <p className="text-xs font-bold text-amber-500 uppercase tracking-widest font-headline mb-1">
              Workspace Settings
            </p>
            <h1 className="text-3xl font-extrabold font-headline tracking-tight" style={{ color: "#f9fafb" }}>
              Account & Billing
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
              Review your profile, points balance, and workspace preferences.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5 mb-8">
            <div className="rounded-2xl p-6" style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest font-headline" style={{ color: "#4b5563" }}>
                    Profile
                  </p>
                  <h2 className="text-2xl font-extrabold font-headline" style={{ color: "#f9fafb" }}>
                    {loading ? "Loading profile…" : accountName}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: "#f9fafb" }}>
                    {planName}
                  </p>
                  <p className="text-xs" style={{ color: "#6b7280" }}>
                    {status}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold font-headline mb-2" style={{ color: "#4b5563" }}>
                    Email
                  </p>
                  <p className="text-sm" style={{ color: "#d1d5db" }}>{accountEmail}</p>
                </div>
                <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold font-headline mb-2" style={{ color: "#4b5563" }}>
                    Member since
                  </p>
                  <p className="text-sm" style={{ color: "#d1d5db" }}>
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Not available"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xs uppercase tracking-[0.18em] font-bold font-headline mb-2" style={{ color: "#4b5563" }}>
                Points summary
              </p>
              <div className="space-y-4">
                <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-sm text-amber-400 font-semibold">Current balance</p>
                  <p className="text-4xl font-extrabold font-headline" style={{ color: "#f9fafb" }}>
                    {loading ? "—" : pointsBalance.toLocaleString()} pts
                  </p>
                </div>
                <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-sm text-amber-400 font-semibold">Available checks</p>
                  <p className="text-2xl font-extrabold font-headline" style={{ color: "#f9fafb" }}>
                    {loading ? "—" : checksRemaining}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-2xl p-6" style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="font-headline font-bold text-sm mb-4" style={{ color: "#f9fafb" }}>
                Account details
              </h3>
              <div className="space-y-4 text-sm text-[#d1d5db]">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold font-headline mb-2" style={{ color: "#4b5563" }}>
                    Display name
                  </p>
                  <p>{user?.name ?? "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold font-headline mb-2" style={{ color: "#4b5563" }}>
                    Email address
                  </p>
                  <p>{user?.email ?? "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold font-headline mb-2" style={{ color: "#4b5563" }}>
                    Account role
                  </p>
                  <p>{user?.role ?? "Editor"}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl p-6" style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="font-headline font-bold text-sm mb-4" style={{ color: "#f9fafb" }}>
                Workspace preferences
              </h3>
              <div className="space-y-4 text-sm text-[#d1d5db]">
                <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold font-headline mb-2" style={{ color: "#4b5563" }}>
                    Notification mode
                  </p>
                  <p>Enabled for billing updates and account alerts.</p>
                </div>
                <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold font-headline mb-2" style={{ color: "#4b5563" }}>
                    Plan type
                  </p>
                  <p>{planName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
