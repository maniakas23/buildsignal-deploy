import { useState } from 'react';
import {
  Sparkles, Zap, Bell, Map, TrendingUp, Shield,
  ChevronRight, X, Star, Check, Clock
} from 'lucide-react';

interface ReleaseItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  tag: string;
  date: string;
}

const RELEASES: ReleaseItem[] = [
  {
    id: 'r1',
    title: 'AI-Powered Opportunity Scoring',
    description: 'Every opportunity now includes a confidence score, ROI projection, and full signal breakdown. Know which projects to prioritize at a glance.',
    icon: Zap,
    color: 'text-accent-teal',
    tag: 'New',
    date: 'July 2026',
  },
  {
    id: 'r2',
    title: 'Interactive Intelligence Map',
    description: 'Visualize all active opportunities on an interactive map. Filter by project type, confidence level, and county. Zoom, pan, and explore.',
    icon: Map,
    color: 'text-accent-indigo',
    tag: 'New',
    date: 'July 2026',
  },
  {
    id: 'r3',
    title: 'Smart Alert System',
    description: 'Configure alerts for your monitored counties and get notified when new opportunities match your criteria or cross confidence thresholds.',
    icon: Bell,
    color: 'text-accent-amber',
    tag: 'New',
    date: 'July 2026',
  },
  {
    id: 'r4',
    title: 'Predictive Analytics Engine',
    description: 'Our machine learning models now analyze historical patterns to predict which early signals will convert into active construction projects.',
    icon: TrendingUp,
    color: 'text-accent-violet',
    tag: 'Enhanced',
    date: 'July 2026',
  },
  {
    id: 'r5',
    title: 'Executive PDF Reports',
    description: 'Generate professional intelligence briefs with evidence, data sources, recommended actions, and ROI projections — ready for your leadership team.',
    icon: Shield,
    color: 'text-accent-indigo',
    tag: 'New',
    date: 'June 2026',
  },
  {
    id: 'r6',
    title: '3,100+ County Coverage',
    description: 'Expanded coverage to all 3,143 US counties. Real-time monitoring of planning boards, DOT filings, utility requests, and zoning records.',
    icon: Map,
    color: 'text-accent-teal',
    tag: 'Expanded',
    date: 'June 2026',
  },
];

const STORAGE_KEY = 'buildsignal-release-seen';

export default function ReleaseHighlights() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) !== 'true';
  });

  const handleOpen = () => {
    setIsOpen(true);
    setHasUnread(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-canvas/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        <div className="relative w-full max-w-[520px] bg-surface border border-ink-wash rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-wash/50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-indigo" />
              <h2 className="text-base font-semibold text-ink-primary">What&apos;s New</h2>
              <span className="px-2 py-0.5 rounded-full bg-accent-indigo/10 text-[10px] font-medium text-accent-indigo">
                Beta
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg hover:bg-canvas flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5 text-ink-tertiary" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 p-5">
            <p className="text-xs text-ink-secondary mb-4">
              BuildSignal Private Beta includes these new features and improvements. We update this list with every release.
            </p>

            <div className="space-y-3">
              {RELEASES.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-canvas border border-ink-wash"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center shrink-0">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-xs font-semibold text-ink-primary">
                          {item.title}
                        </h3>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-accent-indigo/10 text-accent-indigo">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-secondary leading-relaxed">
                        {item.description}
                      </p>
                      <p className="text-[10px] text-ink-tertiary mt-1 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {item.date}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-ink-wash/50 bg-canvas/30">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 rounded-xl bg-accent-indigo text-white text-sm font-semibold hover:bg-accent-indigo-dim transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Floating trigger button
  return (
    <button
      onClick={handleOpen}
      className="fixed bottom-5 left-5 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface border border-ink-wash shadow-lg hover:border-accent-indigo/30 hover:bg-surface-hover transition-all"
    >
      <Sparkles className="w-4 h-4 text-accent-indigo" />
      <span className="text-xs font-medium text-ink-primary">What&apos;s New</span>
      {hasUnread && (
        <span className="w-2 h-2 rounded-full bg-accent-crimson" />
      )}
    </button>
  );
}
