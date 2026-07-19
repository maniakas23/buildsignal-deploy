import { useState, useRef, useEffect } from 'react';
import { Brain, X, TrendingUp, Database, Target, Clock, MapPin } from 'lucide-react';

interface AIExplanationProps {
  confidence: number;
  signals: number;
  sources: number;
  factorBreakdown?: {
    patternMatch: number;
    sourceReliability: number;
    dataFreshness: number;
    geographicContext: number;
  };
}

export default function AIExplanation({
  confidence,
  signals,
  sources,
  factorBreakdown = { patternMatch: 85, sourceReliability: 92, dataFreshness: 78, geographicContext: 88 },
}: AIExplanationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const getConfidenceLabel = (score: number) => {
    if (score >= 90) return { label: 'Very High', color: 'text-accent-teal' };
    if (score >= 75) return { label: 'High', color: 'text-accent-teal' };
    if (score >= 60) return { label: 'Moderate', color: 'text-accent-amber' };
    return { label: 'Early Signal', color: 'text-accent-amber' };
  };

  const conf = getConfidenceLabel(confidence);

  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 rounded-md bg-accent-indigo/10 hover:bg-accent-indigo/20 transition-colors"
        title="How this score is calculated"
      >
        <Brain className="w-3 h-3 text-accent-indigo" />
        <span className="text-[10px] font-medium text-accent-indigo">AI Score: {confidence}%</span>
      </button>

      {/* Tooltip panel */}
      {isOpen && (
        <div className="absolute z-50 bottom-full left-0 mb-2 w-[280px] bg-surface border border-ink-wash rounded-xl shadow-xl p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-accent-indigo" />
              <span className="text-xs font-semibold text-ink-primary">AI Confidence</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-md hover:bg-canvas flex items-center justify-center"
            >
              <X className="w-3 h-3 text-ink-tertiary" />
            </button>
          </div>

          {/* Overall score */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className={`text-2xl font-bold font-mono ${conf.color}`}>
              {confidence}%
            </span>
            <span className={`text-xs font-medium ${conf.color}`}>{conf.label}</span>
          </div>

          {/* Score bar */}
          <div className="h-2 bg-canvas rounded-full overflow-hidden mb-4">
            <div
              className={`h-full rounded-full transition-all ${
                confidence >= 75 ? 'bg-accent-teal' : confidence >= 60 ? 'bg-accent-amber' : 'bg-accent-crimson'
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>

          {/* Factor breakdown */}
          <div className="space-y-2.5 mb-3">
            <FactorRow
              icon={TrendingUp}
              label="Pattern Match"
              score={factorBreakdown.patternMatch}
              description="How well this matches known opportunity patterns"
            />
            <FactorRow
              icon={Database}
              label="Source Reliability"
              score={factorBreakdown.sourceReliability}
              description="Quality and trustworthiness of data sources"
            />
            <FactorRow
              icon={Clock}
              label="Data Freshness"
              score={factorBreakdown.dataFreshness}
              description="Recency of the underlying signal data"
            />
            <FactorRow
              icon={MapPin}
              label="Geographic Context"
              score={factorBreakdown.geographicContext}
              description="Relevance to your monitored regions"
            />
          </div>

          {/* Source count */}
          <div className="pt-3 border-t border-ink-wash/50">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-ink-tertiary">Correlated signals</span>
              <span className="text-ink-primary font-medium">{signals}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] mt-1">
              <span className="text-ink-tertiary">Verified sources</span>
              <span className="text-ink-primary font-medium">{sources}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FactorRow({
  icon: Icon,
  label,
  score,
  description,
}: {
  icon: React.ElementType;
  label: string;
  score: number;
  description: string;
}) {
  return (
    <div className="group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3 h-3 text-ink-tertiary" />
          <span className="text-[11px] text-ink-secondary">{label}</span>
        </div>
        <span className={`text-[11px] font-medium font-mono ${
          score >= 80 ? 'text-accent-teal' : score >= 60 ? 'text-accent-amber' : 'text-accent-crimson'
        }`}>
          {score}%
        </span>
      </div>
      <div className="ml-[18px] h-1 bg-canvas rounded-full overflow-hidden mt-1">
        <div
          className={`h-full rounded-full ${
            score >= 80 ? 'bg-accent-teal' : score >= 60 ? 'bg-accent-amber' : 'bg-accent-crimson'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="ml-[18px] text-[10px] text-ink-tertiary mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {description}
      </p>
    </div>
  );
}
