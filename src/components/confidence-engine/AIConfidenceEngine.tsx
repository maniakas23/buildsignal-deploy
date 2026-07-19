import {
  Target, Zap, Clock, Shield, TrendingUp, Activity,
  CheckCircle2, AlertTriangle, Star, FileText, BarChart3,
  Lightbulb, TrendingDown, ArrowUp
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-25: AI Confidence Engine
// 6-factor confidence scoring with clear explanations.
// Number of signals · Historical similarity · Data freshness
// Source reliability · Regional momentum · Trend acceleration
// ═══════════════════════════════════════════════════════════════

const SCORING_FACTORS = [
  {
    factor: 'Supporting Signals',
    weight: 25,
    score: 94,
    description: 'Number of independent signals confirming the opportunity',
    detail: '5 signals from 4 different domains (DOT, Planning, Utilities, Permits, CIP)',
    icon: Zap,
    color: 'text-accent-indigo',
  },
  {
    factor: 'Historical Similarity',
    weight: 20,
    score: 91,
    description: 'How closely this matches previously validated patterns',
    detail: 'Highway 34 (2023) showed +34% with similar 5-signal pattern. I--25 (2022) +28%.',
    icon: Clock,
    color: 'text-blue-600',
  },
  {
    factor: 'Data Freshness',
    weight: 15,
    score: 96,
    description: 'Recency of the most recent confirming signal',
    detail: 'Latest signal 2 hours ago. All 5 signals within 72-hour window.',
    icon: Activity,
    color: 'text-emerald-600',
  },
  {
    factor: 'Source Reliability',
    weight: 15,
    score: 98,
    description: 'Historical accuracy of the signal sources involved',
    detail: 'DOT filings: 99.7% reliable. County planning: 97.2%. CIP budgets: 96.8%.',
    icon: Shield,
    color: 'text-purple-600',
  },
  {
    factor: 'Regional Momentum',
    weight: 15,
    score: 82,
    description: 'Overall infrastructure activity trend in the region',
    detail: 'Larimer County: +18% project growth. Front Range North: accelerating.',
    icon: TrendingUp,
    color: 'text-amber-600',
  },
  {
    factor: 'Trend Acceleration',
    weight: 10,
    score: 88,
    description: 'Whether signals are increasing in frequency or intensity',
    detail: '3 signals in past 48 hours vs. 2 in prior week. Accelerating pattern.',
    icon: ArrowUp,
    color: 'text-accent-indigo',
  },
];

const CONFIDENCE_LEVELS = [
  { range: '95-100%', label: 'Exceptional', color: 'bg-emerald-500', count: 12, description: 'Multi-domain convergence with strong historical validation' },
  { range: '85-94%', label: 'High', color: 'bg-accent-indigo', count: 34, description: 'Multiple confirming signals from reliable sources' },
  { range: '75-84%', label: 'Moderate', color: 'bg-blue-500', count: 28, description: 'Some confirming signals, limited historical data' },
  { range: '65-74%', label: 'Developing', color: 'bg-amber-500', count: 19, description: 'Early signals detected, awaiting confirmation' },
  { range: 'Below 65%', label: 'Early', color: 'bg-ink-tertiary', count: 8, description: 'Single signal or limited data available' },
];

const EXAMPLE_SCORING = [
  {
    project: 'Highway 287 Corridor Expansion',
    overall: 94,
    factors: [
      { name: 'Signals', score: 98, why: '5 signals, 4 domains' },
      { name: 'Historical', score: 92, why: 'Hwy 34: +34%' },
      { name: 'Freshness', score: 96, why: 'All within 72hrs' },
      { name: 'Reliability', score: 98, why: '99.7% DOT accuracy' },
      { name: 'Momentum', score: 82, why: '+18% regional' },
      { name: 'Acceleration', score: 88, why: '3 in 48hrs' },
    ],
  },
  {
    project: 'Weld County School Campus RFP',
    overall: 91,
    factors: [
      { name: 'Signals', score: 88, why: '4 signals, 3 domains' },
      { name: 'Historical', score: 94, why: 'WCSD: $52M win' },
      { name: 'Freshness', score: 90, why: 'RFP 8hrs ago' },
      { name: 'Reliability', score: 96, why: 'School DB: 98.1%' },
      { name: 'Momentum', score: 92, why: '+31% Greeley' },
      { name: 'Acceleration', score: 85, why: 'RFP just issued' },
    ],
  },
  {
    project: 'Xcel Substation Upgrade',
    overall: 89,
    factors: [
      { name: 'Signals', score: 78, why: '3 signals, 2 domains' },
      { name: 'Historical', score: 86, why: 'Xcel Ph2: completed' },
      { name: 'Freshness', score: 88, why: 'Filing 12hrs ago' },
      { name: 'Reliability', score: 94, why: 'Utility: 97.4%' },
      { name: 'Momentum', score: 80, why: '+11% utility trend' },
      { name: 'Acceleration', score: 82, why: 'Steady pattern' },
    ],
  },
];

export default function AIConfidenceEngine() {
  const weightedAvg = Math.round(
    SCORING_FACTORS.reduce((sum, f) => sum + f.score * f.weight, 0) /
    SCORING_FACTORS.reduce((sum, f) => sum + f.weight, 0)
  );

  return (
    <div className="space-y-6">
      {/* Overall Confidence Score */}
      <div className="bg-accent-indigo/[0.03] border border-accent-indigo/10 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-accent-indigo" />
          <h3 className="text-sm font-bold text-accent-indigo">AI Confidence Engine</h3>
        </div>
        <p className="text-[11px] text-ink-secondary mb-3 leading-relaxed">
          Every recommendation is scored across 6 independent factors. Each factor is weighted
          by its historical predictive value. The overall score represents the probability that
          the recommended action will produce a positive outcome.
        </p>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-accent-indigo">{weightedAvg}%</div>
          <div>
            <div className="text-[11px] font-semibold text-ink-primary">Weighted Average Confidence</div>
            <div className="text-[10px] text-ink-secondary">Across all active opportunities</div>
          </div>
        </div>
      </div>

      {/* 6 Scoring Factors */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-accent-indigo" /> 6-Factor Scoring Breakdown
        </h4>
        <div className="space-y-3">
          {SCORING_FACTORS.map((f) => (
            <div key={f.factor} className="p-3 bg-canvas rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <f.icon className={`w-4 h-4 ${f.color}`} />
                  <span className="text-[11px] font-semibold text-ink-primary">{f.factor}</span>
                  <span className="text-[9px] text-ink-tertiary">({f.weight}% weight)</span>
                </div>
                <span className="text-[12px] font-bold text-accent-indigo">{f.score}%</span>
              </div>
              <div className="h-1.5 bg-ink-wash/30 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-accent-indigo rounded-full" style={{ width: `${f.score}%` }} />
              </div>
              <p className="text-[10px] text-ink-secondary">{f.description}</p>
              <p className="text-[10px] text-accent-indigo mt-0.5"><span className="font-medium">Evidence:</span> {f.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence Distribution */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-accent-indigo" /> Confidence Distribution
        </h4>
        <div className="space-y-2">
          {CONFIDENCE_LEVELS.map((cl) => (
            <div key={cl.range} className="flex items-center gap-3">
              <div className="w-20 text-right">
                <span className="text-[10px] font-semibold text-ink-primary">{cl.label}</span>
                <span className="text-[9px] text-ink-tertiary block">{cl.range}</span>
              </div>
              <div className="flex-1 h-4 bg-ink-wash/30 rounded-full overflow-hidden">
                <div className={`h-full ${cl.color} rounded-full`} style={{ width: `${(cl.count / 34) * 100}%` }} />
              </div>
              <span className="w-8 text-[11px] font-bold text-ink-primary">{cl.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Example Scoring */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-accent-indigo" /> Live Confidence Scores
        </h4>
        <div className="space-y-3">
          {EXAMPLE_SCORING.map((ex) => (
            <div key={ex.project} className="bg-canvas border border-ink-wash rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-[12px] font-bold text-ink-primary">{ex.project}</h5>
                <span className={`text-lg font-bold ${ex.overall >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>{ex.overall}%</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {ex.factors.map((f) => (
                  <div key={f.name} className="p-1.5 bg-surface rounded-lg text-center">
                    <span className="text-[8px] text-ink-tertiary block">{f.name}</span>
                    <span className="text-[11px] font-bold text-accent-indigo">{f.score}</span>
                    <span className="text-[7px] text-ink-tertiary block">{f.why}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
