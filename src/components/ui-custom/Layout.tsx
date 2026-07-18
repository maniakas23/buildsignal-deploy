import type { ReactNode } from 'react';
import Navbar from './Navbar';
import ToastContainer from './ToastContainer';
import SurgeAlertModal from './SurgeAlertModal';
import BetaFeedback from './BetaFeedback';
import OnboardingModal from './Onboarding';
import DemoBadge from './DemoBadge';

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
          {children}
        </div>
      </main>
      <ToastContainer />
      <SurgeAlertModal />
      <BetaFeedback />
      <OnboardingModal />
    </div>
  );
}
