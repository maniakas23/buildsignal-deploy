import type { ReactNode } from 'react';
import Navbar from './Navbar';
import ToastContainer from './ToastContainer';
import SurgeAlertModal from './SurgeAlertModal';
import BetaFeedback from './BetaFeedback';
import OnboardingModal from './Onboarding';
import DemoBadge from './DemoBadge';
import { SkipNavLink, MainContent } from './SkipNav';

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
      <MainContent>
        <div className="relative">
          {children}
        </div>
      </MainContent>
      <ToastContainer />
      <SurgeAlertModal />
      <BetaFeedback />
      <OnboardingModal />
    </div>
  );
}
