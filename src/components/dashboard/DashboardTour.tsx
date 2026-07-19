import { useState, useEffect, useCallback } from 'react';
import {
  X, ChevronRight, ChevronLeft, Compass,
  BarChart3, Map, Bell, Search, Flag
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  target?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Dashboard',
    description: 'This is your command center for construction intelligence. Let\'s take a quick tour of the key features.',
    icon: Compass,
  },
  {
    id: 'signals',
    title: 'Live Signal Feed',
    description: 'These cards show your highest-confidence opportunities. Each one includes ROI projections, signal counts, and data sources.',
    icon: BarChart3,
    target: 'recommended-actions',
  },
  {
    id: 'map',
    title: 'Intelligence Map',
    description: 'Switch to the Map view to see opportunities geographically. Filter by county, confidence, and project type.',
    icon: Map,
    target: 'nav-map',
  },
  {
    id: 'alerts',
    title: 'Smart Alerts',
    description: 'Set up alerts to get notified when new opportunities match your criteria. Never miss a project in your area.',
    icon: Bell,
    target: 'nav-alerts',
  },
  {
    id: 'search',
    title: 'Search & Filter',
    description: 'Use Search to find specific counties, projects, or keywords. Use filters to narrow down by type and confidence.',
    icon: Search,
    target: 'nav-search',
  },
  {
    id: 'complete',
    title: 'You\'re Ready',
    description: 'Your dashboard is live. Opportunities will appear here as our system detects them across your monitored counties.',
    icon: Flag,
  },
];

const STORAGE_KEY = 'buildsignal-tour-completed';

export default function DashboardTour() {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  const handleNext = useCallback(() => {
    if (step < TOUR_STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleDismiss();
    }
  }, [step, handleDismiss]);

  const handlePrev = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const handleSkip = useCallback(() => {
    handleDismiss();
  }, [handleDismiss]);

  // Minimized pill state
  if (dismissed && !isVisible) {
    return (
      <button
        onClick={() => { setDismissed(false); setIsVisible(true); setStep(0); }}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-accent-indigo text-white text-xs font-medium shadow-lg shadow-accent-indigo/20 hover:bg-accent-indigo-dim transition-all"
      >
        <Compass className="w-3.5 h-3.5" />
        Take Tour
      </button>
    );
  }

  if (!isVisible) return null;

  const current = TOUR_STEPS[step];
  const Icon = current.icon;
  const isLast = step === TOUR_STEPS.length - 1;
  const isFirst = step === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-canvas/80 backdrop-blur-sm" onClick={handleSkip} />

      {/* Spotlight indicator for target element */}
      {current.target && (
        <div
          className="absolute rounded-2xl border-2 border-accent-indigo/50 shadow-[0_0_40px_rgba(91,141,239,0.15)] pointer-events-none animate-pulse"
          style={{
            top: current.target === 'nav-map' ? '48px' : current.target === 'nav-alerts' ? '48px' : current.target === 'nav-search' ? '48px' : '200px',
            left: current.target === 'nav-map' ? '200px' : current.target === 'nav-alerts' ? '260px' : current.target === 'nav-search' ? '140px' : '20px',
            width: current.target === 'recommended-actions' ? 'calc(100% - 40px)' : '80px',
            height: current.target === 'recommended-actions' ? '300px' : '40px',
          }}
        />
      )}

      {/* Tour card */}
      <div className="relative w-full max-w-[380px] bg-surface border border-ink-wash rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-ink-wash/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent-indigo/10 flex items-center justify-center">
              <Icon className="w-3.5 h-3.5 text-accent-indigo" />
            </div>
            <span className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider">
              Tour {step + 1} of {TOUR_STEPS.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="w-7 h-7 rounded-lg hover:bg-canvas flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 text-ink-tertiary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-base font-semibold text-ink-primary mb-2">
            {current.title}
          </h3>
          <p className="text-sm text-ink-secondary leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-ink-wash/50 bg-canvas/30">
          <button
            onClick={handlePrev}
            disabled={isFirst}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              isFirst ? 'text-ink-tertiary cursor-not-allowed' : 'text-ink-secondary hover:bg-surface-hover'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === step ? 'bg-accent-indigo w-4' : i < step ? 'bg-accent-indigo/50' : 'bg-ink-wash'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-accent-indigo text-white text-xs font-semibold hover:bg-accent-indigo-dim transition-all active:scale-[0.98]"
          >
            {isLast ? 'Finish' : 'Next'}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
