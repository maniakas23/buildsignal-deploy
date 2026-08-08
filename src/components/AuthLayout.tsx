import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import AppSidebar from "./AppSidebar";

/**
 * AuthLayout — Shell for all authenticated routes.
 *
 * In a production implementation this would:
 * 1. Check authentication state (token validity, session expiry)
 * 2. Show a loading skeleton while auth state is resolving
 * 3. Redirect unauthenticated users to /login (with ?redirect= for return-after-login)
 * 4. Redirect unverified users to /verify-email
 * 5. Potentially show a persistent nav/sidebar for authenticated app views
 *
 * For BuildSignal, the protected routes share this layout wrapper so that
 * auth logic can be added in one place without duplicating it per-route.
 */
export default function AuthLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
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
        <header className="md:hidden flex items-center justify-between bg-white border-b border-[#F5F5F5] px-4 py-3">
          <button
            type="button"
            onClick={toggleMobile}
            className="p-2 rounded-md text-[#0B1F33] hover:bg-[#F5F5F5] transition-colors duration-200 cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileOpen}
            aria-controls="main-navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold text-lg text-[#0B1F33]">
            BuildSignal
          </span>
          <div className="w-9" />
        </header>

        <main className="flex-1 min-h-screen bg-[#F7F9FC]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
