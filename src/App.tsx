import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout";
import { AlertsPage } from "@/pages/AlertsPage";
import { ContactPage } from "@/pages/ContactPage";
import { GrowthSignalsPage } from "@/pages/GrowthSignalsPage";
import { GrowthStoriesPage } from "@/pages/GrowthStoriesPage";
import { HelpPage } from "@/pages/HelpPage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { MapPage } from "@/pages/MapPage";
import { MarketInsightsPage } from "@/pages/MarketInsightsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PasswordResetPage } from "@/pages/PasswordResetPage";
import { PortfolioPage } from "@/pages/PortfolioPage";
import { PricingPage } from "@/pages/PricingPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { SignalsPage } from "@/pages/SignalsPage";
import { SignupPage } from "@/pages/SignupPage";

const App = () => (
  <Layout>
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
      <Route path="/flow-canvas" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Layout>
);

export default App;
