import type { ReactNode } from 'react';
import { lazy, Suspense } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ToastContainer from './ToastContainer';
import SurgeAlertModal from './SurgeAlertModal';
import BetaFeedback from './BetaFeedback';
import OnboardingModal from './Onboarding';
import DemoBadge from './DemoBadge';
import { SkipNavLink, MainContent } from './SkipNav';

// ─── PI Global Components (lazy loaded) ───
const WelcomeBanner = lazy(() => import('@/components/dashboard/WelcomeBanner'));
const CustomerFeedback = lazy(() => import('@/components/feedback/CustomerFeedback'));
const ContextualHelp = lazy(() => import('@/components/education/ContextualHelp'));
const ReleaseHighlights = lazy(() => import('@/components/beta/ReleaseHighlights'));
const InAppNotifications = lazy(() => import('@/components/dashboard/InAppNotifications'));

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-canvas pb-16 md:pb-0">
      <SkipNavLink />
      <Navbar />
      <div className="flex justify-center pt-2">
        <DemoBadge />
      </div>

      {/* PI-6: Welcome banner for first-time users */}
      <Suspense fallback={null}>
        <WelcomeBanner />
      </Suspense>

      <MainContent>
        <div className="relative">
          {children}
        </div>
      </MainContent>

      <Footer />

      <ToastContainer />
      <SurgeAlertModal />
      <BetaFeedback />
      <OnboardingModal />

      {/* ─── PI Global floating components ─── */}
      <Suspense fallback={null}>
        <CustomerFeedback />
      </Suspense>
      <Suspense fallback={null}>
        <ContextualHelp />
      </Suspense>
      <Suspense fallback={null}>
        <ReleaseHighlights />
      </Suspense>
      <Suspense fallback={null}>
        <InAppNotifications />
      </Suspense>
    </div>
  );
}
