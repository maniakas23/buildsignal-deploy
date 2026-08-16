import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  Bell,
  MapPin,
  FileText,
  Eye,
  Settings,
  HelpCircle,
  X,
  Signal,
  CreditCard,
  LogOut,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { NotificationBell } from "./NotificationBell";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{
    className?: string;
    size?: number;
    strokeWidth?: number;
  }>;
  ariaLabel: string;
}

const topNavItems: NavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
    ariaLabel: "Navigate to Dashboard",
  },
  {
    label: "Opportunities",
    to: "/opportunities",
    icon: Target,
    ariaLabel: "Navigate to Opportunities",
  },
  {
    label: "Alerts",
    to: "/alerts",
    icon: Bell,
    ariaLabel: "Navigate to Alerts",
  },
  {
    label: "Counties",
    to: "/county-coverage",
    icon: MapPin,
    ariaLabel: "Navigate to Counties",
  },
  {
    label: "Reports",
    to: "/reports",
    icon: FileText,
    ariaLabel: "Navigate to Reports",
  },
  {
    label: "Watchlist",
    to: "/watchlist",
    icon: Eye,
    ariaLabel: "Navigate to Watchlist",
  },
];

const bottomNavItems: NavItem[] = [
  {
    label: "Billing",
    to: "/billing",
    icon: CreditCard,
    ariaLabel: "Navigate to Billing",
  },
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
    ariaLabel: "Navigate to Settings",
  },
  {
    label: "Help",
    to: "/help",
    icon: HelpCircle,
    ariaLabel: "Navigate to Help",
  },
];

const planBadgeConfig: Record<string, { label: string; className: string }> = {
  starter: { label: "Starter", className: "bg-[var(--bs-surface-hover)] text-[var(--bs-text-tertiary)]" },
  scout: { label: "Scout", className: "bg-[var(--bs-action)]/10 text-[var(--bs-action)]" },
  professional: { label: "Pro", className: "bg-[var(--bs-intelligence)]/10 text-[var(--bs-intelligence)]" },
  business: { label: "Business", className: "bg-[var(--bs-text-primary)]/8 text-[var(--bs-text-primary)]" },
  enterprise: { label: "Enterprise", className: "bg-[var(--bs-opportunity)]/12 text-[var(--bs-opportunity)]" },
};

export default function AppSidebar({
  isMobileOpen,
  onMobileClose,
}: AppSidebarProps) {
  const location = useLocation();
  const { user, isLoading, logout } = useAuth();

  const isActive = (to: string) => {
    if (to === "/county-coverage") {
      return (
        location.pathname === "/county-coverage" ||
        location.pathname.startsWith("/counties/")
      );
    }
    return location.pathname === to;
  };

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      onMobileClose();
    }
  };

  const planBadge = planBadgeConfig[user?.plan || "starter"];

  return (
    <aside
      id="main-navigation"
      className={`
        fixed inset-y-0 left-0 z-50 w-[260px] transform bg-[var(--bs-surface)] shadow-2xl transition-transform duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:shadow-none md:transition-none
        flex flex-col border-r border-[var(--bs-border)]
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <Signal className="h-5 w-5 text-[var(--bs-action)]" />
          <span className="font-bold text-lg text-[var(--bs-text-primary)]">
            BuildSignal
          </span>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <NotificationBell />
          <button
            type="button"
            onClick={onMobileClose}
            className="p-1 rounded-md text-[var(--bs-text-primary)] hover:bg-[var(--bs-surface-hover)] transition-colors duration-200 cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Notification Bell - Desktop */}
      <div className="hidden md:flex px-4 pb-2">
        <div className="ml-auto">
          <NotificationBell />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-3 py-2 gap-1 overflow-y-auto">
        {topNavItems.map((item) => {
          const active = isActive(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-label={item.ariaLabel}
              aria-current={active ? "page" : undefined}
              className={`
                flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold tracking-[0.5px] transition-colors duration-200 ease-out cursor-pointer
                ${active
                  ? "bg-[var(--bs-action)]/8 text-[var(--bs-action)]"
                  : "text-[var(--bs-text-primary)] hover:text-[var(--bs-intelligence)] hover:bg-[var(--bs-intelligence)]/4"
                }
              `}
              onClick={handleNavClick}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="my-2 h-px bg-[var(--bs-border)]" role="separator" />

        {bottomNavItems.map((item) => {
          const active = isActive(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-label={item.ariaLabel}
              aria-current={active ? "page" : undefined}
              className={`
                flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold tracking-[0.5px] transition-colors duration-200 ease-out cursor-pointer
                ${active
                  ? "bg-[var(--bs-action)]/8 text-[var(--bs-action)]"
                  : "text-[var(--bs-text-primary)] hover:text-[var(--bs-intelligence)] hover:bg-[var(--bs-intelligence)]/4"
                }
              `}
              onClick={handleNavClick}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-[var(--bs-border)] p-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-3">
            <Loader2 className="h-4 w-4 animate-spin text-[var(--bs-action)]" />
          </div>
        ) : user ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--bs-canvas)]">
              <div className="h-8 w-8 rounded-full bg-[var(--bs-action)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--bs-text-primary)] truncate">
                  {user.name || "User"}
                </p>
                <p className="text-[10px] text-[var(--bs-text-tertiary)] truncate">
                  {user.email}
                </p>
              </div>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0", planBadge?.className)}>
                {planBadge?.label}
              </span>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--bs-text-tertiary)] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
