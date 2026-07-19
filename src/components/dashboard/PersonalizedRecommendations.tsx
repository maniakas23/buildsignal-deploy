import { useStore } from '@/store/useStore';
import { trackEvent } from '@/hooks/useTelemetry';
import {
  Sparkles, TrendingUp, MapPin, ArrowRight, Eye,
  Building2, HardHat, Zap, Target, Clock
} from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  reason: string;
  confidence: number;
  type: string;
  county: string;
  signals: number;
  icon: React.ElementType;
  iconColor: string;
  action: string;
}

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'Apex Town Center Phase 2',
    description: '42-acre mixed-use development with strong permit velocity and utility expansion signals.',
    reason: 'Matches your monitored counties and high confidence threshold',
    confidence: 92,
    type: 'mixed-use',
    county: 'Wake County, NC',
    signals: 47,
    icon: Building2,
    iconColor: 'text-accent-indigo',
    action: 'View Opportunity',
  },
  {
    id: 'rec-2',
    title: 'Morrisville Station District',
    description: 'Transit-adjacent commercial development with strong early signals.',
    reason: 'Based on your interest in transportation projects',
    confidence: 78,
    type: 'transit',
    county: 'Wake County, NC',
    signals: 31,
    icon: TrendingUp,
    iconColor: 'text-accent-teal',
    action: 'Explore',
  },
  {
    id: 'rec-3',
    title: 'Duke Energy Regional Substation',
    description: 'Major electrical infrastructure upgrade serving Research Triangle.',
    reason: 'Utility projects you have been tracking',
    confidence: 85,
    type: 'utility',
    county: 'Durham County, NC',
    signals: 23,
    icon: Zap,
    iconColor: 'text-accent-amber',
    action: 'Investigate',
  },
  {
    id: 'rec-4',
    title: 'Garner Industrial Park Expansion',
    description: 'Industrial zoning change with environmental clearance and road access.',
    reason: 'New in your monitored area — early signal',
    confidence: 72,
    type: 'industrial',
    county: 'Wake County, NC',
    signals: 18,
    icon: HardHat,
    iconColor: 'text-accent-violet',
    action: 'Review',
  },
];

export default function PersonalizedRecommendations() {
  const { setCurrentPage } = useStore();

  const handleAction = (rec: Recommendation) => {
    trackEvent('opportunity_click', {
      recommendationId: rec.id,
      confidence: rec.confidence,
      type: rec.type,
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
          AI-personalized
        </span>
      </div>

      {/* Recommendations list */}
      <div className="divide-y divide-ink-wash/30">
        {RECOMMENDATIONS.map((rec) => {
          const Icon = rec.icon;
          return (
            <div
              key={rec.id}
              className="group px-4 py-3 hover:bg-canvas/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-canvas flex items-center justify-center shrink-0">
                  <Icon className={`w-4 h-4 ${rec.iconColor}`} />
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
                  <p className="text-[10px] text-ink-tertiary mb-2">
                    {rec.reason}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-ink-tertiary mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {rec.county}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {rec.signals} signals
                    </span>
                  </div>
                  <button
                    onClick={() => handleAction(rec)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent-indigo/10 text-[11px] font-medium text-accent-indigo hover:bg-accent-indigo/20 transition-colors"
                  >
                    {rec.action}
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
