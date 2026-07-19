import type { ReactNode } from 'react';
import { lazy, Suspense } from 'react';
import Navbar from './Navbar';
import ToastContainer from './ToastContainer';
import SurgeAlertModal from './SurgeAlertModal';
import BetaFeedback from './BetaFeedback';
import OnboardingModal from './Onboarding';
import DemoBadge from './DemoBadge';

// PI-3: Customer-facing improvements
const DashboardTour = lazy(() => import('@/components/dashboard/DashboardTour'));
// PI-4: Customer feedback loop
const CustomerFeedback = lazy(() => import('@/components/feedback/CustomerFeedback'));
// PI-5: Product education
const ContextualHelp = lazy(() => import('@/components/education/ContextualHelp'));
// PI-6: First-time user welcome + success milestones
const WelcomeBanner = lazy(() => import('@/components/dashboard/WelcomeBanner'));
const SuccessMilestones = lazy(() => import('@/components/dashboard/SuccessMilestones'));

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-canvas pb-16 md:pb-0">
      <Navbar />
      <div className="flex justify-center pt-2">
        <DemoBadge />
      </div>
      <main id="main-content" className="flex-1 min-w-0" role="main">
        <div className="relative">
          {/* PI-6: Welcome banner for first-time users */}
          <Suspense fallback={null}>
            <WelcomeBanner />
          </Suspense>
          {children}
        </div>
      </main>
      <ToastContainer />
      <SurgeAlertModal />
      <BetaFeedback />
      <OnboardingModal />
      {/* PI-3: Guided dashboard tour for first-time users */}
      <Suspense fallback={null}>
        <DashboardTour />
      </Suspense>
      {/* PI-4: Floating customer feedback widget on every page */}
      <Suspense fallback={null}>
        <CustomerFeedback />
      </Suspense>
      {/* PI-5: Contextual product education tooltips */}
      <Suspense fallback={null}>
        <ContextualHelp />
      </Suspense>
      {/* PI-6: Success milestone celebrations */}
      <Suspense fallback={null}>
        <SuccessMilestones />
      </Suspense>
    </div>
  );
}
