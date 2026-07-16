import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";

const HomePage = lazy(() => import("./pages/HomePage"));
const MapPage = lazy(() => import("./pages/MapPage"));
const AlertsPage = lazy(() => import("./pages/AlertsPage"));
const PortfolioPage = lazy(() => import("./pages/OpportunityPortfolio"));
const SignalsPage = lazy(() => import("./pages/ProjectFeed"));
const GrowthSignalsPage = lazy(() => import("./pages/GrowthSignalsPage"));
const GrowthStoriesPage = lazy(() => import("./pages/GrowthStories"));
const MarketInsightsPage = lazy(() => import("./pages/MarketInsightsPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const LoginPage = lazy(() => import("./pages/Login"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const PasswordResetPage = lazy(() => import("./pages/PasswordResetPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const SummaryPage = lazy(() => import("./pages/SummaryPage"));
const FlowCanvas = lazy(() => import("./components/FlowCanvas"));

function App() {
  return (
    <div className="min-h-screen bg-canvas">
      <Suspense fallback={<div className="min-h-screen bg-canvas flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-accent-indigo border-t-transparent rounded-full" /></div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/signals" element={<SignalsPage />} />
          <Route path="/growth-signals" element={<GrowthSignalsPage />} />
          <Route path="/growth-stories" element={<GrowthStoriesPage />} />
          <Route path="/market-insights" element={<MarketInsightsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/password-reset" element={<PasswordResetPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/flow" element={<FlowCanvas />} />
        </Routes>
      </Suspense>
      <Toaster />
    </div>
  );
}

export default App;
