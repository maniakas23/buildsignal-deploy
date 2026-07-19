import { useState, useEffect, useRef } from 'react';
import { X, Lightbulb, ArrowRight, Check } from 'lucide-react';

interface HelpTip {
  id: string;
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const HELP_TIPS: HelpTip[] = [
  {
    id: 'tip-dashboard',
    target: 'recommended-actions',
    title: 'Your Opportunities',
    description: 'These cards show your highest-confidence opportunities. Click any card to see detailed signal breakdowns, ROI projections, and recommended actions.',
    position: 'bottom',
  },
  {
    id: 'tip-search',
    target: 'nav-search',
    title: 'Find Projects Fast',
    description: 'Use Search to find specific counties, project types, or keywords. Try "Wake County mixed-use" to get started.',
    position: 'bottom',
  },
  {
    id: 'tip-alerts',
    target: 'nav-alerts',
    title: 'Stay Informed',
    description: 'Set up alerts to get notified when new opportunities match your criteria. Never miss a project in your monitored areas.',
    position: 'bottom',
  },
  {
    id: 'tip-map',
    target: 'nav-map',
    title: 'Visual Intelligence',
    description: 'Switch to the Map to see opportunities geographically. Filter by type, confidence, and county.',
    position: 'bottom',
  },
];

const STORAGE_KEY = 'buildsignal-help-dismissed';

export default function ContextualHelp() {
  const [activeTip, setActiveTip] = useState<HelpTip | null>(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [showSystem, setShowSystem] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load dismissed tips
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDismissed(new Set(JSON.parse(raw)));
    } catch { /* ignore */ }

    // Show first undismissed tip after a delay
    const timer = setTimeout(() => {
      const firstUndismissed = HELP_TIPS.find((t) => !dismissed.has(t.id));
      if (firstUndismissed) {
        setActiveTip(firstUndismissed);
        setShowSystem(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const dismissTip = (id: string) => {
    const next = new Set(dismissed);
    next.add(id);
    setDismissed(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch { /* ignore */ }

    // Show next tip
    const nextIndex = HELP_TIPS.findIndex((t) => t.id === id) + 1;
    const nextTip = HELP_TIPS[nextIndex];
    if (nextTip && !next.has(nextTip.id)) {
      setActiveTip(nextTip);
      setTipIndex(nextIndex);
    } else {
      setActiveTip(null);
      setShowSystem(false);
    }
  };

  const dismissAll = () => {
    const allIds = HELP_TIPS.map((t) => t.id);
    setDismissed(new Set(allIds));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allIds));
    } catch { /* ignore */ }
    setActiveTip(null);
    setShowSystem(false);
  };

  if (!showSystem || !activeTip || dismissed.has(activeTip.id)) return null;

  const currentIndex = HELP_TIPS.findIndex((t) => t.id === activeTip.id);
  const isLast = currentIndex === HELP_TIPS.length - 1;

  return (
    <div className="fixed bottom-5 left-5 z-50 w-[320px]">
      <div
        ref={ref}
        className="bg-surface border border-accent-indigo/30 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Progress bar */}
        <div className="h-1 bg-canvas">
          <div
            className="h-full bg-accent-indigo rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / HELP_TIPS.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent-indigo/10 flex items-center justify-center">
                <Lightbulb className="w-3.5 h-3.5 text-accent-indigo" />
              </div>
              <span className="text-[10px] text-ink-tertiary uppercase tracking-wider">
                Tip {currentIndex + 1} of {HELP_TIPS.length}
              </span>
            </div>
            <button
              onClick={dismissAll}
              className="w-6 h-6 rounded hover:bg-canvas flex items-center justify-center"
            >
              <X className="w-3 h-3 text-ink-tertiary" />
            </button>
          </div>

          <h4 className="text-sm font-semibold text-ink-primary mb-1">
            {activeTip.title}
          </h4>
          <p className="text-xs text-ink-secondary leading-relaxed mb-3">
            {activeTip.description}
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={dismissAll}
              className="text-[11px] text-ink-tertiary hover:text-ink-secondary transition-colors"
            >
              Skip all
            </button>
            <button
              onClick={() => dismissTip(activeTip.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-indigo text-white text-xs font-semibold hover:bg-accent-indigo-dim transition-all"
            >
              {isLast ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Got it
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
