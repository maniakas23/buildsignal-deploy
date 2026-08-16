import { useEffect, useState } from 'react';
import { fetchRecentSignals, type RecentSignal } from '@/signalcore/engine';
import { Mail, MapPin, TrendingUp } from 'lucide-react';

export default function WeeklyDigest() {
  const [signals, setSignals] = useState<RecentSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchRecentSignals(3)
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

  return (
    <div className="bg-surface rounded-2xl p-5 shadow-card border border-ink-wash">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-4 h-4 text-accent-indigo" />
        <h3 className="text-sm font-semibold text-ink-primary">Weekly Digest</h3>
      </div>

      {loading && (
        <p className="text-[11px] text-ink-tertiary">Loading live intelligence…</p>
      )}

      {!loading && signals.length === 0 && (
        <p className="text-xs text-ink-secondary leading-relaxed">
          No live intelligence detected yet. New patterns in your monitored counties will appear here as they are verified.
        </p>
      )}

      {!loading && signals.length > 0 && (
        <div className="space-y-2">
          {signals.map((item) => (
            <div key={item.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-canvas">
              <TrendingUp className="w-3.5 h-3.5 text-accent-teal shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-ink-primary font-medium">{item.title}</p>
                {[item.county, item.state].filter(Boolean).length > 0 && (
                  <p className="text-[10px] text-ink-tertiary flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" /> {[item.county, item.state].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
              <span className="text-[10px] font-mono text-accent-teal">{item.confidence}%</span>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-ink-tertiary mt-3">
        Email delivery of digests is not yet enabled — the latest live signals are shown here.
      </p>
    </div>
  );
}
