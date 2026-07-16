import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Activity } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  ["/", "Home"],
  ["/map", "Map"],
  ["/alerts", "Alerts"],
  ["/portfolio", "Portfolio"],
  ["/signals", "Signals"],
  ["/growth-signals", "Growth Signals"],
  ["/growth-stories", "Growth Stories"],
  ["/market-insights", "Market Insights"],
  ["/pricing", "Pricing"],
  ["/settings", "Settings"],
  ["/contact", "Contact"],
  ["/help", "Help"],
] as const;

export const Layout = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, userEmail } = useAuth();

  return (
    <div className="min-h-screen px-4 py-6 text-slate-100">
      <header className="mx-auto mb-6 flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <Link to="/" className="inline-flex items-center gap-2 text-lg font-bold">
          <Activity className="h-5 w-5 text-blue-400" />
          BuildSignal
        </Link>
        <nav className="flex flex-wrap gap-2 text-sm text-slate-300">
          {navItems.map(([to, label]) => (
            <Link key={to} to={to} className="rounded px-2 py-1 hover:bg-slate-800">
              {label}
            </Link>
          ))}
        </nav>
        <div className="text-sm text-slate-400">{isAuthenticated ? userEmail : "Guest"}</div>
      </header>
      <main>{children}</main>
    </div>
  );
};
