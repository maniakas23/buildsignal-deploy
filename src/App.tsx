import { Suspense, lazy, useState, useEffect } from 'react';
import Layout from '@/components/ui-custom/Layout';
import { LoadingState } from '@/components/ui-custom/EngineStates';
import { useStore } from '@/store/useStore';
import { useReducedMotionClass } from '@/hooks/useReducedMotion';

// ─── PI-7: Beta access gate ───
const BetaAccessGate = lazy(() => import('@/components/beta/BetaAccessGate'));
const SampleIntelligenceWalkthrough = lazy(() => import('@/components/beta/SampleIntelligenceWalkthrough'));

// ─── Customer pages — lazy loaded for performance ───
const Home = lazy(() => import('@/pages/Home'));
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
// ─── PI-9: New pages ───
const SecurityPage = lazy(() => import('@/pages/SecurityPage'));
const DataCoveragePage = lazy(() => import('@/pages/DataCoveragePage'));
const CustomerOnboardingPage = lazy(() => import('@/pages/CustomerOnboardingPage'));
// ─── PI-10: Operations & RC pages ───
const OperationsCenterPage = lazy(() => import('@/pages/OperationsCenterPage'));
const ReleaseChecklistPage = lazy(() => import('@/pages/ReleaseChecklistPage'));
// ─── PI-11: System Validation page ───
const SystemValidationPage = lazy(() => import('@/pages/SystemValidationPage'));
// ─── PI-12: RC Validation page ───
const RCValidationPage = lazy(() => import('@/pages/RCValidationPage'));
// ─── PI-13: Launch Readiness page ───
const LaunchReadinessPage = lazy(() => import('@/pages/LaunchReadinessPage'));
// ─── PI-14: Commercial Launch Candidate page ───
const CommercialLaunchCandidatePage = lazy(() => import('@/pages/CommercialLaunchCandidatePage'));
// ─── PI-15: Production Excellence page ───
const ProductionExcellencePage = lazy(() => import('@/pages/ProductionExcellencePage'));

// ─── Customer page router ───
function PageRouter() {
  const { currentPage } = useStore();

  switch (currentPage) {
    case 'home': return <Home />;
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
    // PI-9 routes
    case 'security': return <SecurityPage />;
    case 'data-coverage': return <DataCoveragePage />;
    case 'getting-started': return <CustomerOnboardingPage />;
    // PI-10 routes
    case 'operations': return <OperationsCenterPage />;
    case 'release-checklist': return <ReleaseChecklistPage />;
    case 'system-validation': return <SystemValidationPage />;
    // PI-12 route
    case 'rc-validation': return <RCValidationPage />;
    // PI-13 route
    case 'launch-readiness': return <LaunchReadinessPage />;
    // PI-14 route
    case 'commercial-launch': return <CommercialLaunchCandidatePage />;
    // PI-15 route
    case 'production-excellence': return <ProductionExcellencePage />;
    default: return <OpportunityDashboard />;
  }
}

// ─── Auth-aware app shell ───
export default function App() {
  useReducedMotionClass();
  const { currentPage } = useStore();

  // ─── PI-7: Beta access gate ───
  const [betaGranted, setBetaGranted] = useState(() => {
    return localStorage.getItem('buildsignal_beta_access') === 'granted';
  });
  const [walkthroughDone, setWalkthroughDone] = useState(() => {
    return localStorage.getItem('buildsignal_walkthrough_done') === 'true';
  });

  const handleBetaAccess = () => {
    setBetaGranted(true);
  };

  const handleWalkthroughComplete = () => {
    setWalkthroughDone(true);
  };

  // Show beta gate if not granted
  if (!betaGranted) {
    return (
      <Suspense fallback={<LoadingState message="Loading..." />}>
        <BetaAccessGate onAccessGranted={handleBetaAccess} />
      </Suspense>
    );
  }

  const showWalkthrough = betaGranted && !walkthroughDone;

  // Auth pages render without the Layout shell
  if (currentPage === 'login' || currentPage === 'signup' || currentPage === 'password-reset') {
    return (
      <Suspense fallback={<LoadingState message="Loading..." />}>
        <PageRouter />
        {showWalkthrough && (
          <SampleIntelligenceWalkthrough
            onComplete={handleWalkthroughComplete}
            onSkip={handleWalkthroughComplete}
          />
        )}
      </Suspense>
    );
  }

  return (
    <>
      <Layout>
        <Suspense fallback={<LoadingState message="Loading..." />}>
          <PageRouter />
        </Suspense>
      </Layout>
      {showWalkthrough && (
        <Suspense fallback={null}>
          <SampleIntelligenceWalkthrough
            onComplete={handleWalkthroughComplete}
            onSkip={handleWalkthroughComplete}
          />
        </Suspense>
      )}
    </>
  );
}
