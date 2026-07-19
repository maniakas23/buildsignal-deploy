import { useState } from 'react';
import {
  Brain, Target, CheckCircle2, AlertTriangle, TrendingUp,
  ArrowRight, BarChart3, Clock, Shield, Zap, FileText,
  ChevronDown, ChevronUp, Lightbulb, Star, Hash,
  Eye, Globe, DollarSign, Activity
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-23: AI Decision Engine
// Enhanced recommendations: why it matters, evidence, confidence,
// historical examples, similar projects, business impact, actions.
// Distinguishes observed facts from AI-generated predictions.
// ═══════════════════════════════════════════════════════════════

const RECOMMENDATIONS = [
  {
    id: 'ai-001',
    title: 'Highway 287 Corridor — Land Acquisition Opportunity',
    whyMatters: 'Five independent infrastructure signals have converged within 72 hours. The combination of DOT expansion plans, commercial rezoning, utility relocation, demolition permits, and CIP budget approval creates one of the highest-confidence detection patterns in the system. Historical data shows 25-40% land appreciation for early acquisitions near corridor expansions.',
    confidence: 94,
    riskLevel: 'low' as const,
    county: 'Larimer County, CO',
    type: 'DOT-Corridor',
    isPrediction: false,
    observedFacts: [
      'CDOT filed HWY-287-EXP-2026 — 4.2-mile expansion, $12.4M budget (Jul 18)',
      'Larimer County approved commercial rezoning for 6 parcels (Jul 15)',
      'Xcel Energy filed underground utility relocation notice (Jul 14)',
      '3 demolition permits issued within corridor buffer zone (Jul 10)',
      'CIP budget of $12.4M approved for road widening FY2026 (Jul 8)',
    ],
    aiPredictions: [
      'Land appreciation of 25-40% within 24 months based on historical models',
      'Acquisition window of 45-60 days before pricing adjusts',
      '15-20 projected development deals within 18 months',
      'Total market value of $30-45M over the development cycle',
    ],
    historicalExamples: [
      { project: 'Highway 34, Greeley (2023)', outcome: '+34% appreciation, 18 developments', relevance: 'High' },
      { project: 'I-25 Frontage, Loveland (2022)', outcome: '+28% appreciation, 12 projects', relevance: 'High' },
      { project: 'Highway 14, Fort Collins (2021)', outcome: '+22% appreciation, $45M total', relevance: 'Medium' },
    ],
    businessImpact: [
      { label: 'Land Appreciation', value: '+25-40%', timeframe: '24 months', type: 'prediction' as const },
      { label: 'Total Market Value', value: '$30-45M', timeframe: 'Dev cycle', type: 'prediction' as const },
      { label: 'Projected Deals', value: '15-20', timeframe: '18 months', type: 'prediction' as const },
      { label: 'Acquisition Window', value: '45-60 days', timeframe: 'Immediate', type: 'fact' as const },
    ],
    nextActions: [
      { step: 1, action: 'Pull parcel ownership records', deadline: 'Jul 21', impact: 'Critical' },
      { step: 2, action: 'Contact county planner', deadline: 'Jul 22', impact: 'High' },
      { step: 3, action: 'Schedule site visit', deadline: 'Jul 24', impact: 'High' },
      { step: 4, action: 'Submit LOI', deadline: 'Jul 31', impact: 'Critical' },
    ],
  },
  {
    id: 'ai-002',
    title: 'Weld County School Campus — $48M RFP',
    whyMatters: 'A $48M K-8 campus RFP represents one of the largest public construction contracts in Weld County this year. Four supporting infrastructure signals (road extension, sewer, zoning, RFP) indicate a well-planned project with reduced execution risk. Historical WCSD awards favor prepared bidders who attend pre-bid meetings.',
    confidence: 91,
    riskLevel: 'medium' as const,
    county: 'Weld County, CO',
    type: 'Public Contract',
    isPrediction: false,
    observedFacts: [
      'WCSD issued RFP for K-8 campus — 85,000 sq ft, $48M (Jul 17)',
      '$4.2M road extension to campus site approved (Jul 15)',
      'Sewer extension permit APP-2026-0847 approved (Jul 14)',
      'Land use changed from agricultural to educational (Jul 10)',
    ],
    aiPredictions: [
      'Win probability of 65-75% with proper preparation',
      'Pre-qualification deadline is the primary constraint',
      'Bonding requirement may require JV partnership',
      'Subcontractor opportunities estimated at $15-20M',
    ],
    historicalExamples: [
      { project: 'WCSD Previous Campus (2022)', outcome: '$52M award to regional JV', relevance: 'Very High' },
      { project: 'Thompson SD Campus (2023)', outcome: '$38M, 14 subcontractors', relevance: 'High' },
    ],
    businessImpact: [
      { label: 'Contract Value', value: '$48M', timeframe: 'Award target', type: 'fact' as const },
      { label: 'Subcontractor Ops', value: '$15-20M', timeframe: 'Bidding', type: 'prediction' as const },
      { label: 'Win Probability', value: '65-75%', timeframe: 'With prep', type: 'prediction' as const },
      { label: 'Pre-Qual Deadline', value: '14 days', timeframe: 'Immediate', type: 'fact' as const },
    ],
    nextActions: [
      { step: 1, action: 'Download full RFP and addenda', deadline: 'Jul 21', impact: 'Critical' },
      { step: 2, action: 'Verify bonding capacity', deadline: 'Jul 23', impact: 'Critical' },
      { step: 3, action: 'Attend pre-bid meeting', deadline: 'Aug 3', impact: 'High' },
      { step: 4, action: 'Site visit with facilities director', deadline: 'Jul 28', impact: 'High' },
    ],
  },
];

function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const colors = { low: 'bg-emerald-50 text-emerald-700', medium: 'bg-amber-50 text-amber-700', high: 'bg-accent-crimson/10 text-accent-crimson' };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colors[level]}`}>{level.toUpperCase()} RISK</span>;
}

export default function AIDecisionEngine() {
  const [expandedId, setExpandedId] = useState<string | null>('ai-001');

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <Eye className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-semibold text-amber-800">Observed Facts vs. AI Predictions</p>
          <p className="text-[10px] text-amber-700 leading-relaxed">
            All recommendations clearly distinguish between <strong>observed facts</strong> (confirmed public records)
            and <strong>AI-generated predictions</strong> (modeled outcomes based on historical patterns).
          </p>
        </div>
      </div>

      {RECOMMENDATIONS.map((rec) => {
        const expanded = expandedId === rec.id;
        return (
          <div key={rec.id} className="bg-surface border border-ink-wash rounded-2xl overflow-hidden">
            <div className="p-5">
              {/* Header */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-bold bg-accent-indigo/10 text-accent-indigo px-1.5 py-0.5 rounded-full uppercase">{rec.type}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${rec.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {rec.confidence}% CONFIDENCE
                </span>
                <RiskBadge level={rec.riskLevel} />
                <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-full font-bold flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" /> FACTS + PREDICTIONS
                </span>
              </div>

              <h3 className="text-sm font-bold text-ink-primary mb-1">{rec.title}</h3>
              <p className="text-[10px] text-ink-tertiary mb-3">{rec.county}</p>

              {/* Why It Matters */}
              <div className="p-3 bg-canvas rounded-lg mb-3">
                <p className="text-[10px] font-semibold text-accent-indigo mb-1 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" /> WHY THIS MATTERS
                </p>
                <p className="text-[11px] text-ink-secondary leading-relaxed">{rec.whyMatters}</p>
              </div>

              <button
                onClick={() => setExpandedId(expanded ? null : rec.id)}
                className="flex items-center gap-1 text-[11px] font-medium text-accent-indigo hover:text-accent-indigo/80 transition-colors"
              >
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {expanded ? 'Collapse' : 'Full analysis'}
              </button>
            </div>

            {expanded && (
              <div className="border-t border-ink-wash px-5 py-4 space-y-5">
                {/* Observed Facts */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-[10px] font-semibold text-emerald-800 mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> OBSERVED FACTS (Confirmed Public Records)
                  </p>
                  <div className="space-y-1">
                    {rec.observedFacts.map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-[11px] text-emerald-800">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Predictions */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-[10px] font-semibold text-blue-800 mb-2 flex items-center gap-1">
                    <Brain className="w-3 h-3" /> AI-GENERATED PREDICTIONS (Historical Model-Based)
                  </p>
                  <div className="space-y-1">
                    {rec.aiPredictions.map((p, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Brain className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-[11px] text-blue-800">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Historical Examples */}
                <div>
                  <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-accent-indigo" /> Historical Examples
                  </h5>
                  <div className="space-y-1.5">
                    {rec.historicalExamples.map((h, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
                        <div>
                          <span className="text-[11px] font-medium text-ink-primary">{h.project}</span>
                          <p className="text-[10px] text-emerald-600 font-medium">{h.outcome}</p>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${h.relevance === 'Very High' ? 'bg-emerald-50 text-emerald-700' : 'bg-accent-indigo/10 text-accent-indigo'}`}>
                          {h.relevance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Impact */}
                <div>
                  <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-accent-indigo" /> Estimated Business Impact
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {rec.businessImpact.map((bi) => (
                      <div key={bi.label} className={`p-2.5 rounded-lg text-center ${bi.type === 'fact' ? 'bg-emerald-50 border border-emerald-200' : 'bg-blue-50 border border-blue-200'}`}>
                        <span className={`text-[8px] font-bold px-1 py-0.5 rounded-full ${bi.type === 'fact' ? 'bg-emerald-200 text-emerald-800' : 'bg-blue-200 text-blue-800'}`}>
                          {bi.type === 'fact' ? 'FACT' : 'PREDICTION'}
                        </span>
                        <div className="text-sm font-bold text-ink-primary mt-1">{bi.value}</div>
                        <div className="text-[9px] text-ink-tertiary">{bi.label}</div>
                        <div className="text-[8px] text-ink-tertiary">{bi.timeframe}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Actions */}
                <div>
                  <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-accent-indigo" /> Suggested Next Actions
                  </h5>
                  <div className="space-y-1.5">
                    {rec.nextActions.map((a) => (
                      <div key={a.step} className="flex items-start gap-2 p-2.5 bg-canvas rounded-lg">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-indigo text-white flex items-center justify-center text-[9px] font-bold">
                          {a.step}
                        </span>
                        <div className="flex-1">
                          <span className="text-[11px] font-medium text-ink-primary">{a.action}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-accent-crimson font-medium">Due: {a.deadline}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${a.impact === 'Critical' ? 'bg-accent-crimson/10 text-accent-crimson' : 'bg-amber-50 text-amber-700'}`}>
                              {a.impact}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
