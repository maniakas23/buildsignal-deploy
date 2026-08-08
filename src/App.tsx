import { Routes, Route, Navigate } from "react-router-dom";
import { TRPCProvider } from "./providers/trpc";
import { usePageTracking } from "./hooks/usePageTracking";
import { useAuth } from "./hooks/useAuth";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { SignupPage } from "./pages/SignupPage";
import { WelcomePage } from "./pages/WelcomePage";
import { Dashboard } from "./pages/Dashboard";
import { BillingPage } from "./pages/BillingPage";
import { PricingPage } from "./pages/PricingPage";
import AlertsPage from "./pages/AlertsPage";
import { RecommendationsPage } from "./pages/RecommendationsPage";
import OpportunityDashboard from "./pages/OpportunityDashboard";
import { CountyDetail } from "./pages/CountyDetail";
import CountyCoveragePage from "./pages/CountyCoveragePage";
import { WatchlistPage } from "./pages/WatchlistPage";
import { ReportsPage } from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import { SSOPage } from "./pages/SSOPage";
import { HelpPage } from "./pages/HelpPage";
import { ContactPage } from "./pages/ContactPage";
import { FeatureRequestPage } from "./pages/FeatureRequestPage";
import { ProductImprovementDashboard } from "./pages/ProductImprovementDashboard";
import { ReportsHubPage } from "./pages/ReportsHubPage";
import { DemoRequestPage } from "./pages/DemoRequestPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { SampleReportPage } from "./pages/SampleReportPage";
import { RoadmapPage } from "./pages/RoadmapPage";
import EmailPreviewPage from "./pages/EmailPreviewPage";
import { PaletteShowcasePage } from "./pages/PaletteShowcasePage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import NotFound from "./pages/NotFound";
import AuthLayout from "./components/AuthLayout";
import { Toaster } from "@/components/ui/toaster";
import { ThemeSwitcher } from "./components/theme/ThemeSwitcher";

function AuthenticatedRedirect({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

// BuildSignal v1.3.0 — Theme System & Design System
function App() {
  usePageTracking();

  return (
    <TRPCProvider>
      <ThemeSwitcher />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <AuthenticatedRedirect>
              <Login />
            </AuthenticatedRedirect>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthenticatedRedirect>
              <SignupPage />
            </AuthenticatedRedirect>
          }
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/feature-requests" element={<FeatureRequestPage />} />
        <Route path="/product-improvement" element={<ProductImprovementDashboard />} />
        <Route path="/reports-hub" element={<ReportsHubPage />} />
        <Route path="/demo" element={<DemoRequestPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/sample-report" element={<SampleReportPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/email-preview" element={<EmailPreviewPage />} />
        <Route path="/palettes" element={<PaletteShowcasePage />} />

        {/* Auth-gated routes */}
        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/opportunities" element={<OpportunityDashboard />} />
          <Route path="/counties" element={<CountyCoveragePage />} />
          <Route path="/counties/:id" element={<CountyDetail />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/sso" element={<SSOPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </TRPCProvider>
  );
}

export default App;
