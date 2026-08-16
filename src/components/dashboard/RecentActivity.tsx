import { useEffect, useState } from 'react';
import { fetchRecentSignals, formatRelativeTime, type RecentSignal } from '@/signalcore/engine';
import { TrendingUp, Clock, ChevronRight } from 'lucide-react';

export default function RecentActivity() {
  const [signals, setSignals] = useState<RecentSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchRecentSignals(10)
      .then((items) => {
        if (!cancelled) setSignals(items);
      })
      .catch(() => {
        if (!cancelled) setSignals([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const displayItems = expanded ? signals : signals.slice(0, 5);

  return (
    <div className="bg-surface border border-ink-wash rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ink-wash/50">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent-indigo" />
          <h3 className="text-sm font-semibold text-ink-primary">Recent Signal Activity</h3>
        </div>
        <span className="text-[10px] text-ink-tertiary">Live</span>
      </div>

      {/* Activity list */}
      <div className="divide-y divide-ink-wash/30">
        {loading && (
          <div className="px-4 py-6 text-center text-[11px] text-ink-tertiary">
            Loading live activity…
          </div>
        )}
        {!loading && signals.length === 0 && (
          <div className="px-4 py-6 text-center">
            <p className="text-[11px] text-ink-secondary">No recent live signal activity yet.</p>
            <p className="text-[10px] text-ink-tertiary mt-1">
              Newly detected patterns in your monitored counties will appear here.
            </p>
          </div>
        )}
        {!loading && displayItems.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 px-4 py-3 hover:bg-canvas/50 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-canvas flex items-center justify-center shrink-0 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-accent-teal" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-ink-primary truncate">
                {item.title}
              </p>
              <p className="text-[11px] text-ink-secondary mt-0.5 leading-relaxed">
                {item.category} detected{[item.county, item.state].filter(Boolean).length > 0
                  ? ` in ${[item.county, item.state].filter(Boolean).join(', ')}`
                  : ''} — {item.confidence}% confidence, {item.evidenceCount} signals
              </p>
            </div>
            <span className="text-[10px] text-ink-tertiary shrink-0">
              {formatRelativeTime(item.detectedAt)}
            </span>
          </div>
        ))}
      </div>

      {/* Expand/collapse */}
      {signals.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 py-2.5 text-[11px] text-accent-indigo hover:bg-canvas/50 transition-colors"
        >
          {expanded ? 'Show less' : `Show ${signals.length - 5} more`}
          <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
      )}
    </div>
  );
}
