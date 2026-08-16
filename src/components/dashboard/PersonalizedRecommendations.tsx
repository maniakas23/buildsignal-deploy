import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { trackEvent } from '@/hooks/useTelemetry';
import { fetchRecommendations, type Recommendation } from '@/signalcore/engine';
import {
  Sparkles, TrendingUp, MapPin, ArrowRight, Eye,
  Building2, HardHat, Zap, Target
} from 'lucide-react';

function iconFor(category: string): { icon: React.ElementType; iconColor: string } {
  const c = (category || '').toLowerCase();
  if (c.includes('util') || c.includes('power') || c.includes('electric')) {
    return { icon: Zap, iconColor: 'text-accent-amber' };
  }
  if (c.includes('industrial') || c.includes('construction') || c.includes('permit') || c.includes('dwelling')) {
    return { icon: HardHat, iconColor: 'text-accent-violet' };
  }
  if (c.includes('commercial') || c.includes('mixed') || c.includes('development')) {
    return { icon: Building2, iconColor: 'text-accent-indigo' };
  }
  return { icon: TrendingUp, iconColor: 'text-accent-teal' };
}

export default function PersonalizedRecommendations() {
  const { setCurrentPage } = useStore();
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchRecommendations()
      .then((res) => {
        if (!cancelled) setRecs((res.data || []).slice(0, 4));
      })
      .catch(() => {
        if (!cancelled) setRecs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAction = (rec: Recommendation) => {
    trackEvent('opportunity_click', {
      recommendationId: rec.id,
      confidence: rec.confidence,
      type: rec.category,
    });
    setCurrentPage('dashboard');
  };

  return (
    <div className="bg-surface border border-ink-wash rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ink-wash/50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-indigo" />
          <h3 className="text-sm font-semibold text-ink-primary">Recommended for You</h3>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-ink-tertiary">
          <Target className="w-3 h-3" />
          Live intelligence
        </span>
      </div>

      {/* Recommendations list */}
      <div className="divide-y divide-ink-wash/30">
        {loading && (
          <div className="px-4 py-6 text-center text-[11px] text-ink-tertiary">
            Loading live recommendations…
          </div>
        )}
        {!loading && recs.length === 0 && (
          <div className="px-4 py-6 text-center">
            <p className="text-[11px] text-ink-secondary">
              No live recommendations yet.
            </p>
            <p className="text-[10px] text-ink-tertiary mt-1">
              Recommendations appear here as verified patterns are detected in your monitored counties.
            </p>
          </div>
        )}
        {!loading && recs.map((rec) => {
          const { icon: Icon, iconColor } = iconFor(rec.category);
          const location = [rec.county, rec.state].filter(Boolean).join(', ');
          return (
            <div
              key={rec.id}
              className="group px-4 py-3 hover:bg-canvas/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-canvas flex items-center justify-center shrink-0">
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-xs font-semibold text-ink-primary truncate">
                      {rec.title}
                    </h4>
                    <span
                      className={`shrink-0 text-[10px] font-medium font-mono px-1.5 py-0.5 rounded ${
                        rec.confidence >= 85
                          ? 'bg-accent-teal/10 text-accent-teal'
                          : rec.confidence >= 70
                          ? 'bg-accent-indigo/10 text-accent-indigo'
                          : 'bg-accent-amber/10 text-accent-amber'
                      }`}
                    >
                      {rec.confidence}%
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-secondary leading-relaxed mb-1">
                    {rec.description}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-ink-tertiary mb-2">
                    {location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {rec.relatedSignals} signals
                    </span>
                  </div>
                  <button
                    onClick={() => handleAction(rec)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent-indigo/10 text-[11px] font-medium text-accent-indigo hover:bg-accent-indigo/20 transition-colors"
                  >
                    {rec.nextAction || 'View details'}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-ink-wash/50 bg-canvas/30">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="w-full flex items-center justify-center gap-1 text-[11px] text-accent-indigo hover:underline"
        >
          View all opportunities
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
