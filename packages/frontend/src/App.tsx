import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Navbar } from '@/components/Navbar';
import { MobileNavDrawer } from '@/components/MobileNavDrawer';
import { Footer } from '@/components/Footer';
import { LoadingFallback } from '@/components/LoadingFallback';
import { Toaster } from '@/components/ui/sonner';
import PrivateBetaGate from '@/components/PrivateBetaGate';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const OpportunityDashboard = lazy(() => import('@/pages/OpportunityDashboard'));

function App() {
  return (
    <PrivateBetaGate>
      <div className="min-h-[100dvh] flex flex-col bg-[var(--canvas)]">
        <Navbar />
        <MobileNavDrawer />
        <main className="flex-1">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/dashboard" element={<OpportunityDashboard />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Toaster />
      </div>
    </PrivateBetaGate>
  );
}

export default App;
