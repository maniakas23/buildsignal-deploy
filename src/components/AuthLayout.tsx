import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, Loader2 } from "lucide-react";
import AppSidebar from "./AppSidebar";
import { useAuth } from "@/hooks/useAuth";

export default function AuthLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  const openMobile = () => setIsMobileOpen(true);
  const closeMobile = () => setIsMobileOpen(false);
  const toggleMobile = () => setIsMobileOpen((prev) => !prev);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMobile();
      }
    };

    if (isMobileOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Show loading state while auth is resolving
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bs-canvas)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--bs-action)]" />
      </div>
    );
  }

  // Redirect unauthenticated users to login with return URL
  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${returnUrl}`} replace />;
  }

  return (
    <div className="flex min-h-screen bg-[var(--bs-canvas)]">
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
          role="presentation"
        />
      )}

      {/* Sidebar */}
      <AppSidebar isMobileOpen={isMobileOpen} onMobileClose={closeMobile} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between bg-[var(--bs-surface)] border-b border-[var(--bs-border)] px-4 py-3">
          <button
            type="button"
            onClick={toggleMobile}
            className="p-2 rounded-md text-[var(--bs-text-primary)] hover:bg-[var(--bs-surface-hover)] transition-colors duration-200 cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileOpen}
            aria-controls="main-navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold text-lg text-[var(--bs-text-primary)]">
            BuildSignal
          </span>
          <div className="w-9" />
        </header>

        <main className="flex-1 min-h-screen bg-[var(--bs-canvas)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
