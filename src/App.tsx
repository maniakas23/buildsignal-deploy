import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { TRPCProvider } from "@/providers/trpc";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import SignupPage from "@/pages/SignupPage";
import WelcomePage from "@/pages/WelcomePage";
import ForgotPassword from "@/pages/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import OpportunitiesPage from "@/pages/OpportunitiesPage";
import AlertsPage from "@/pages/AlertsPage";
import CountiesPage from "@/pages/CountiesPage";
import ReportsPage from "@/pages/ReportsPage";
import SettingsPage from "@/pages/SettingsPage";
import BillingPage from "@/pages/BillingPage";
import PricingPage from "@/pages/PricingPage";
import WatchlistsPage from "@/pages/WatchlistsPage";
import RecommendationsPage from "@/pages/RecommendationsPage";
import RoadmapPage from "@/pages/RoadmapPage";
import HelpPage from "@/pages/HelpPage";
import NotFound from "@/pages/NotFound";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Track page views for analytics
    if (typeof window !== "undefined" && (window as any).umami) {
      (window as any).umami.track((props: any) => ({
        ...props,
        url: location.pathname,
      }));
    }
  }, [location]);
}

function App() {
  usePageTracking();

  return (
    <TRPCProvider>
      <Toaster />
      <SonnerToaster richColors position="top-right" />
      <ThemeSwitcher />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/counties" element={<CountiesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/watchlists" element={<WatchlistsPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TRPCProvider>
  );
}

export default App;
