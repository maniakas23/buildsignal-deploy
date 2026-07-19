import { useState } from 'react';
import { BarChart3, ChevronDown, ChevronUp, Signal, Database, TrendingUp, Clock, Shield } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-11: Confidence Breakdown Panel
// Explainable AI — shows exactly how confidence is calculated.
// ═══════════════════════════════════════════════════════════════

interface Factor {
  name: string;
  weight: number;
  score: number;
  maxScore: number;
  icon: React.ReactNode;
  description: string;
  evidence: string[];
}

const DEFAULT_FACTORS: Factor[] = [
  {
    name: 'Signal Count',
    weight: 25,
    score: 92,
    maxScore: 100,
    icon: <Signal className="w-4 h-4 text-accent-indigo" />,
    description: 'Number of correlated signals detected across data sources',
    evidence: ['12 permit filings', '8 zoning changes', '4 utility requests'],
  },
  {
    name: 'Source Diversity',
    weight: 20,
    score: 85,
    maxScore: 100,
    icon: <Database className="w-4 h-4 text-accent-teal" />,
    description: 'Variety of independent data sources confirming the signal',
    evidence: ['Permit database', 'Utility records', 'Zoning board', 'Public notices'],
  },
  {
    name: 'Historical Accuracy',
    weight: 25,
    score: 94,
    maxScore: 100,
    icon: <TrendingUp className="w-4 h-4 text-accent-amber" />,
    description: 'Past predictions with similar signal patterns proved accurate',
    evidence: ['89% historical accuracy', 'Similar projects: 23', 'Avg lead time: 73 days'],
  },
  {
    name: 'Data Freshness',
    weight: 15,
    score: 88,
    maxScore: 100,
    icon: <Clock className="w-4 h-4 text-accent-crimson" />,
    description: 'How recently the signals were detected and verified',
    evidence: ['Latest signal: 2 hrs ago', 'Data refresh: < 4 hrs', 'Real-time tracking active'],
  },
  {
    name: 'Cross-Validation',
    weight: 15,
    score: 90,
    maxScore: 100,
    icon: <Shield className="w-4 h-4 text-accent-indigo" />,
    description: 'Signals verified across multiple providers and systems',
    evidence: ['3 providers corroborate', 'Geospatial match: 99.2%', 'Entity resolution: confirmed'],
  },
];

interface Props {
  overallConfidence?: number;
  factors?: Factor[];
}

export default function ConfidenceBreakdown({ overallConfidence = 91, factors = DEFAULT_FACTORS }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [hoveredFactor, setHoveredFactor] = useState<string | null>(null);

  const weightedScore = Math.round(
    factors.reduce((sum, f) => sum + (f.score * f.weight) / 100, 0)
  );

  const getColor = (score: number) => {
    if (score >= 90) return 'text-accent-teal';
    if (score >= 75) return 'text-accent-indigo';
    if (score >= 60) return 'text-accent-amber';
    return 'text-accent-crimson';
  };

  const getBarColor = (score: number) => {
    if (score >= 90) return 'bg-accent-teal';
    if (score >= 75) return 'bg-accent-indigo';
    if (score >= 60) return 'bg-accent-amber';
    return 'bg-accent-crimson';
  };

  return (
    <div className="bg-surface rounded-xl border border-ink-wash overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-canvas/30 transition-colors"
      >
        <BarChart3 className="w-4 h-4 text-accent-indigo" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink-primary">Confidence Breakdown</span>
            <span className={`text-sm font-semibold font-mono ${getColor(weightedScore)}`}>{weightedScore}%</span>
          </div>
          <p className="text-[11px] text-ink-secondary">Weighted score across {factors.length} quality dimensions</p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-ink-tertiary" /> : <ChevronDown className="w-4 h-4 text-ink-tertiary" />}
      </button>

      {expanded && (
        <div className="border-t border-ink-wash px-4 pb-4">
          {/* Factor bars */}
          <div className="space-y-3 mt-4">
            {factors.map((factor) => (
              <div
                key={factor.name}
                onMouseEnter={() => setHoveredFactor(factor.name)}
                onMouseLeave={() => setHoveredFactor(null)}
                className="relative"
              >
                <div className="flex items-center gap-2 mb-1">
                  {factor.icon}
                  <span className="text-xs text-ink-primary flex-1">{factor.name}</span>
                  <span className="text-[10px] text-ink-tertiary">{factor.weight}% weight</span>
                  <span className={`text-xs font-mono font-semibold ${getColor(factor.score)}`}>{factor.score}</span>
                </div>
                <div className="h-2 bg-canvas rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getBarColor(factor.score)} rounded-full transition-all`}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>

                {/* Evidence tooltip */}
                {hoveredFactor === factor.name && (
                  <div className="mt-2 p-2.5 rounded-lg bg-canvas border border-ink-wash">
                    <p className="text-[11px] text-ink-secondary mb-1.5">{factor.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {factor.evidence.map((e, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-accent-indigo/10 text-accent-indigo text-[10px]">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Overall */}
          <div className="mt-4 pt-3 border-t border-ink-wash flex items-center justify-between">
            <span className="text-xs text-ink-secondary">Overall Confidence</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 bg-canvas rounded-full overflow-hidden">
                <div className={`h-full ${getBarColor(weightedScore)} rounded-full`} style={{ width: `${weightedScore}%` }} />
              </div>
              <span className={`text-sm font-semibold font-mono ${getColor(weightedScore)}`}>{weightedScore}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
