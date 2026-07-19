import { useState, useEffect } from 'react';
import { HelpCircle, X, ChevronRight } from 'lucide-react';

interface HelpTip {
  id: string;
  page: string;
  title: string;
  content: string;
}

const HELP_TIPS: HelpTip[] = [
  {
    id: 'dash_confidence',
    page: 'dashboard',
    title: 'Confidence Scores',
    content: 'Each opportunity shows a confidence score (0-100%) based on signal count, source diversity, historical accuracy, and data freshness. Scores above 85% are considered high confidence.',
  },
  {
    id: 'dash_roi',
    page: 'dashboard',
    title: 'ROI Projection',
    content: 'ROI is estimated based on project type, market conditions, and historical win rates for similar opportunities.',
  },
  {
    id: 'map_filters',
    page: 'map',
    title: 'Map Filters',
    content: 'Use the filter bar to show only high-confidence opportunities or specific signal types. Click any dot to see details.',
  },
  {
    id: 'search_advanced',
    page: 'search',
    title: 'Advanced Search',
    content: 'Combine keywords with filters like county, signal type, and confidence range. Save frequent searches to your watchlist.',
  },
  {
    id: 'alerts_setup',
    page: 'alerts',
    title: 'Alert Configuration',
    content: 'Set up custom alerts for specific counties or signal types. You can choose email, SMS, or in-app notifications.',
  },
  {
    id: 'portfolio_mgmt',
    page: 'portfolio',
    title: 'Portfolio Management',
    content: 'Track opportunities through 8 lifecycle stages. Drag and drop to change status. Add notes and set reminders.',
  },
  {
    id: 'reports_export',
    page: 'reports',
    title: 'Report Export',
    content: 'Generate PDF or CSV reports for any opportunity. Include market context, signals, and risk factors.',
  },
];

export default function ContextualHelp() {
  const [open, setOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState<HelpTip | null>(null);
  const [dismissedTips, setDismissedTips] = useState<Set<string>>(
    new Set(JSON.parse(localStorage.getItem('buildsignal_help_dismissed') || '[]'))
  );

  useEffect(() => {
    // Get current page from URL or state
    const page = window.location.pathname.replace(/^\//, '') || 'dashboard';
    const tipsForPage = HELP_TIPS.filter(
      (t) => t.page === page && !dismissedTips.has(t.id)
    );
    if (tipsForPage.length > 0 && !open) {
      // Show first available tip after delay
      const timer = setTimeout(() => {
        setCurrentTip(tipsForPage[0]);
        setOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dismissedTips, open]);

  const handleDismiss = () => {
    if (currentTip) {
      const updated = new Set(dismissedTips);
      updated.add(currentTip.id);
      setDismissedTips(updated);
      localStorage.setItem('buildsignal_help_dismissed', JSON.stringify([...updated]));
    }
    setOpen(false);
  };

  const handleNext = () => {
    if (!currentTip) return;
    const page = currentTip.page;
    const tipsForPage = HELP_TIPS.filter(
      (t) => t.page === page && !dismissedTips.has(t.id) && t.id !== currentTip.id
    );
    if (tipsForPage.length > 0) {
      setCurrentTip(tipsForPage[0]);
    } else {
      setOpen(false);
    }
  };

  if (!open || !currentTip) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[80] max-w-xs animate-fade-in-up">
      <div className="bg-surface rounded-2xl shadow-lg border border-accent-indigo/10 p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent-indigo/10 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-accent-indigo" />
            </div>
            <h4 className="text-sm font-semibold text-ink-primary">{currentTip.title}</h4>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded hover:bg-canvas transition-colors"
          >
            <X className="w-3.5 h-3.5 text-ink-tertiary" />
          </button>
        </div>

        <p className="text-xs text-ink-secondary leading-relaxed mb-3">
          {currentTip.content}
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={handleDismiss}
            className="text-[11px] text-ink-tertiary hover:text-ink-secondary transition-colors"
          >
            Don&apos;t show again
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-1 text-[11px] text-accent-indigo font-medium hover:underline"
          >
            Next tip <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
