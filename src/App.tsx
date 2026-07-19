import { Suspense, lazy } from 'react';
import Layout from '@/components/ui-custom/Layout';
import { LoadingState } from '@/components/ui-custom/EngineStates';
import { useStore } from '@/store/useStore';
import { useReducedMotionClass } from '@/hooks/useReducedMotion';

// ─── Customer pages — lazy loaded for performance ───
const OpportunityDashboard = lazy(() => import('@/pages/OpportunityDashboard'));
const OpportunityPortfolio = lazy(() => import('@/pages/OpportunityPortfolio'));
const ProjectFeed = lazy(() => import('@/pages/ProjectFeed'));
const GrowthSignalsPage = lazy(() => import('@/pages/GrowthSignalsPage'));
const AlertsPage = lazy(() => import('@/pages/AlertsPage'));
const SummaryPage = lazy(() => import('@/pages/SummaryPage'));
const MarketInsightsPage = lazy(() => import('@/pages/MarketInsightsPage'));
const GrowthStories = lazy(() => import('@/pages/GrowthStories'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const HelpPage = lazy(() => import('@/pages/HelpPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const MapPage = lazy(() => import('@/pages/MapPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const PasswordResetPage = lazy(() => import('@/pages/PasswordResetPage'));
const Login = lazy(() => import('@/pages/Login'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const WatchlistsPage = lazy(() => import('@/pages/WatchlistsPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const ProviderStatusPage = lazy(() => import('@/pages/ProviderStatusPage'));
const CountyCoveragePage = lazy(() => import('@/pages/CountyCoveragePage'));
const DailyBriefPage = lazy(() => import('@/pages/DailyBriefPage'));
const IntelligenceOpsPage = lazy(() => import('@/pages/IntelligenceOpsPage'));
const AdminConsolePage = lazy(() => import('@/pages/AdminConsolePage'));
const OrganizationPage = lazy(() => import('@/pages/OrganizationPage'));
const LaunchAnalyticsPage = lazy(() => import('@/pages/LaunchAnalyticsPage'));
const ReadinessChecklistPage = lazy(() => import('@/pages/ReadinessChecklistPage'));
const LaunchDocsPage = lazy(() => import('@/pages/LaunchDocsPage'));
const GoNoGoPage = lazy(() => import('@/pages/GoNoGoPage'));
const ValidationScorecardPage = lazy(() => import('@/pages/ValidationScorecardPage'));
const EnterpriseOpsPage = lazy(() => import('@/pages/EnterpriseOpsPage'));
const PatternLibraryPage = lazy(() => import('@/pages/PatternLibraryPage'));
const LearningEnginePage = lazy(() => import('@/pages/LearningEnginePage'));
const NationalIntelligencePage = lazy(() => import('@/pages/NationalIntelligencePage'));
// ─── PI-2: Onboarding ───
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
// ─── PI-4: Operations Center ───
const OperationsCenterPage = lazy(() => import('@/pages/OperationsCenterPage'));

// ─── Customer page router ───
function PageRouter() {
  const { currentPage } = useStore();

  switch (currentPage) {
    case 'dashboard': return <OpportunityDashboard />;
    case 'portfolio': return <OpportunityPortfolio />;
    case 'projects': return <ProjectFeed />;
    case 'growth-signals': return <GrowthSignalsPage />;
    case 'alerts': return <AlertsPage />;
    case 'summary': return <SummaryPage />;
    case 'market-insights': return <MarketInsightsPage />;
    case 'growth-stories': return <GrowthStories />;
    case 'settings': return <SettingsPage />;
    case 'pricing': return <PricingPage />;
    case 'help': return <HelpPage />;
    case 'contact': return <ContactPage />;
    case 'map': return <MapPage />;
    case 'login': return <Login />;
    case 'signup': return <SignupPage />;
    case 'password-reset': return <PasswordResetPage />;
    case 'search': return <SearchPage />;
    case 'watchlists': return <WatchlistsPage />;
    case 'account': return <AccountPage />;
    case 'provider-status': return <ProviderStatusPage />;
    case 'county-coverage': return <CountyCoveragePage />;
    case 'daily-brief': return <DailyBriefPage />;
    case 'intelligence-ops': return <IntelligenceOpsPage />;
    case 'admin': return <AdminConsolePage />;
    case 'organization': return <OrganizationPage />;
    case 'launch-analytics': return <LaunchAnalyticsPage />;
    case 'readiness': return <ReadinessChecklistPage />;
    case 'launch-docs': return <LaunchDocsPage />;
    case 'gongo': return <GoNoGoPage />;
    case 'validation': return <ValidationScorecardPage />;
    case 'enterprise-ops': return <EnterpriseOpsPage />;
    case 'patterns': return <PatternLibraryPage />;
    case 'learning': return <LearningEnginePage />;
    case 'national': return <NationalIntelligencePage />;
    // PI-2: Onboarding
    case 'onboarding': return <OnboardingPage />;
    // PI-4: Operations Center
    case 'ops-center': return <OperationsCenterPage />;
    default: return <OpportunityDashboard />;
  }
}

// ─── Auth-aware app shell ───
export default function App() {
  useReducedMotionClass();
  const { currentPage } = useStore();

  // Auth pages render without the Layout shell
  if (currentPage === 'login' || currentPage === 'signup' || currentPage === 'password-reset') {
    return (
      <Suspense fallback={<LoadingState message="Loading..." />}>
        <PageRouter />
      </Suspense>
    );
  }

  return (
    <Layout>
      <Suspense fallback={<LoadingState message="Loading..." />}>
        <PageRouter />
      </Suspense>
    </Layout>
  );
}
