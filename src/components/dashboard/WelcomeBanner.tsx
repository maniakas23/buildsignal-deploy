import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { trackEvent } from '@/hooks/useTelemetry';
import {
  X, Sparkles, Search, MapPin, Bell, ArrowRight,
  Zap, TrendingUp, Compass
} from 'lucide-react';

const SAMPLE_SEARCHES = [
  { label: 'Wake County mixed-use', icon: MapPin },
  { label: 'Transit projects NC', icon: Compass },
  { label: 'Utility expansion Raleigh', icon: Zap },
];

const QUICK_ACTIONS = [
  { label: 'Explore Map', page: 'map', icon: MapPin, description: 'See opportunities geographically' },
  { label: 'Set Up Alerts', page: 'alerts', icon: Bell, description: 'Get notified about new projects' },
  { label: 'View Trending', page: 'growth-signals', icon: TrendingUp, description: 'Fastest-growing opportunities' },
];

const STORAGE_KEY = 'buildsignal-welcome-dismissed';

export default function WelcomeBanner() {
  const { setCurrentPage } = useStore();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = localStorage.getItem(STORAGE_KEY);
    if (!wasDismissed) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleSearch = (query: string) => {
    trackEvent('first_search', { query, source: 'welcome_banner' });
    setCurrentPage('search');
    handleDismiss();
  };

  const handleAction = (page: string) => {
    trackEvent('feature_use', { feature: page, source: 'welcome_banner' });
    setCurrentPage(page);
    handleDismiss();
  };

  if (!visible || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-accent-indigo/10 via-accent-violet/10 to-accent-indigo/10 border border-accent-indigo/20 rounded-2xl p-5 sm:p-6 mb-6 relative overflow-hidden">
      {/* Decorative sparkle */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-indigo/5 rounded-full blur-3xl pointer-events-none" />

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 w-7 h-7 rounded-lg hover:bg-canvas/50 flex items-center justify-center transition-colors z-10"
      >
        <X className="w-3.5 h-3.5 text-ink-tertiary" />
      </button>

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent-indigo" />
          </div>
          <h2 className="text-base font-semibold text-ink-primary">
            Welcome to BuildSignal
          </h2>
        </div>
        <p className="text-sm text-ink-secondary mb-5 max-w-[480px] leading-relaxed">
          Your intelligence dashboard is live. Here are three ways to find your first construction opportunity in under two minutes.
        </p>

        {/* Sample searches */}
        <div className="mb-5">
          <p className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2">
            Try a sample search
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_SEARCHES.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.label}
                  onClick={() => handleSearch(s.label)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-canvas border border-ink-wash hover:border-accent-indigo/30 hover:bg-surface text-xs text-ink-secondary hover:text-ink-primary transition-all"
                >
                  <Icon className="w-3.5 h-3.5 text-accent-indigo" />
                  {s.label}
                  <ArrowRight className="w-3 h-3 text-ink-tertiary" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <p className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2">
            Or jump straight to
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {QUICK_ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.page}
                  onClick={() => handleAction(a.page)}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-canvas/50 border border-ink-wash hover:border-accent-indigo/20 hover:bg-surface text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center shrink-0 group-hover:bg-accent-indigo/20 transition-colors">
                    <Icon className="w-4 h-4 text-accent-indigo" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-ink-primary">{a.label}</p>
                    <p className="text-[10px] text-ink-secondary">{a.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
