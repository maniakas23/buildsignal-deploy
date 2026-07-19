import { useState } from 'react';
import {
  Brain, Eye, CheckCircle2, AlertTriangle, BarChart3,
  Target, ArrowRight, Clock, TrendingUp, FileText,
  ChevronDown, ChevronUp, Shield, Zap, Lightbulb,
  Hash, Activity, Database, Star
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-22: Intelligence Explainability Panel
// Every AI recommendation answers: Why detected, which sources,
// signal weights, confidence, historical support, next actions.
// ═══════════════════════════════════════════════════════════════

interface SignalWeight {
  source: string;
  signal: string;
  weight: number;
  date: string;
  confidence: number;
}

interface RecommendationExplainability {
  id: string;
  title: string;
  whyDetected: string;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  county: string;
  type: string;
  signals: SignalWeight[];
  historicalSupport: { event: string; outcome: string; similarity: number; date: string }[];
  nextActions: { step: number; action: string; deadline: string; impact: string }[];
  transparencyNote: string;
}

const RECOMMENDATIONS: RecommendationExplainability[] = [
  {
    id: 'exp-001',
    title: 'Highway 287 Corridor Expansion — Land Acquisition',
    whyDetected: 'Five independent infrastructure signals converged within a 72-hour window across multiple data providers. The system detected a pattern matching 94% of previous successful corridor expansion predictions. Each signal source independently confirmed infrastructure activity, creating a high-confidence composite detection.',
    confidence: 94,
    riskLevel: 'low',
    county: 'Larimer County, CO',
    type: 'DOT-Corridor',
    signals: [
      { source: 'DOT Permits', signal: 'Highway expansion filing — 4.2 miles', weight: 28, date: 'Jul 18', confidence: 99 },
      { source: 'County Planning', signal: 'Commercial rezoning approved — 6 parcels', weight: 24, date: 'Jul 15', confidence: 97 },
      { source: 'Xcel Energy', signal: 'Underground utility relocation notice', weight: 18, date: 'Jul 14', confidence: 91 },
      { source: 'Building Permits', signal: '3 demolition permits in buffer zone', weight: 16, date: 'Jul 10', confidence: 85 },
      { source: 'CIP Tracker', signal: '$12.4M road widening budget approved', weight: 14, date: 'Jul 8', confidence: 96 },
    ],
    historicalSupport: [
      { event: 'Highway 34 Expansion, Greeley (2023)', outcome: '+34% land appreciation, 18 developments', similarity: 92, date: '2023' },
      { event: 'I-25 Frontage Road, Loveland (2022)', outcome: '+28% appreciation, 12 commercial projects', similarity: 87, date: '2022' },
      { event: 'Highway 14, Fort Collins (2021)', outcome: '+22% appreciation, $45M total development', similarity: 81, date: '2021' },
    ],
    nextActions: [
      { step: 1, action: 'Pull parcel ownership records for 0.5-mile buffer', deadline: 'Jul 21', impact: 'Identifies acquisition targets' },
      { step: 2, action: 'Contact county planner — confirm zoning effective date', deadline: 'Jul 22', impact: 'Determines timeline pressure' },
      { step: 3, action: 'Schedule site visit for top 5 parcels', deadline: 'Jul 24', impact: 'Physical due diligence' },
      { step: 4, action: 'Submit LOI for priority parcels', deadline: 'Jul 31', impact: 'Secures position' },
    ],
    transparencyNote: 'This recommendation is based on publicly available permit, planning, and utility data. No proprietary or private information was used. Confidence score reflects the convergence of independent signal sources, not certainty of outcome.',
  },
  {
    id: 'exp-002',
    title: 'Weld County School Campus — $48M RFP Positioning',
    whyDetected: 'A major public contract RFP was issued with four supporting infrastructure signals already in place. The system recognized a pattern where pre-approved infrastructure (roads, sewer, zoning) combined with large public RFPs creates high-probability project opportunities. Historical WCSD awards show consistent preference for prepared bidders.',
    confidence: 91,
    riskLevel: 'medium',
    county: 'Weld County, CO',
    type: 'Public Contract',
    signals: [
      { source: 'School Construction DB', signal: 'RFP issued — K-8, 85,000 sq ft, $48M', weight: 35, date: 'Jul 17', confidence: 99 },
      { source: 'Capital Improvement', signal: '$4.2M road extension to campus site', weight: 22, date: 'Jul 15', confidence: 94 },
      { source: 'Water Authority', signal: 'Sewer extension permit approved', weight: 20, date: 'Jul 14', confidence: 89 },
      { source: 'County Planning', signal: 'Land use: agricultural to educational', weight: 23, date: 'Jul 10', confidence: 95 },
    ],
    historicalSupport: [
      { event: 'WCSD Previous Campus (2022)', outcome: '$52M award to regional JV', similarity: 95, date: '2022' },
      { event: 'Thompson SD Campus (2023)', outcome: '$38M, 14 subcontractors', similarity: 78, date: '2023' },
    ],
    nextActions: [
      { step: 1, action: 'Download full RFP and addenda', deadline: 'Jul 21', impact: 'Full scope understanding' },
      { step: 2, action: 'Verify bonding capacity for $48M', deadline: 'Jul 23', impact: 'Determines eligibility' },
      { step: 3, action: 'Attend mandatory pre-bid meeting', deadline: 'Aug 3', impact: 'Demonstrates commitment' },
      { step: 4, action: 'Schedule site visit with facilities director', deadline: 'Jul 28', impact: 'Shows preparation' },
    ],
    transparencyNote: 'This recommendation uses publicly published RFP data and permit records. The bonding capacity requirement may exclude some bidders. Historical comparison does not guarantee similar outcomes.',
  },
];

function WeightBar({ weight, color = 'bg-accent-indigo' }: { weight: number; color?: string }) {
  return (
    <div className="h-2 bg-ink-wash/30 rounded-full overflow-hidden w-full">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${weight}%` }} />
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    low: 'bg-emerald-50 text-emerald-700',
    medium: 'bg-amber-50 text-amber-700',
    high: 'bg-accent-crimson/10 text-accent-crimson',
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colors[level] || colors.low}`}>{level.toUpperCase()} RISK</span>;
}

export default function ExplainabilityPanel() {
  const [expandedId, setExpandedId] = useState<string | null>('exp-001');

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 bg-accent-indigo/[0.03] border border-accent-indigo/10 rounded-xl">
        <Eye className="w-4 h-4 text-accent-indigo flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-semibold text-accent-indigo">Transparent Intelligence</p>
          <p className="text-[10px] text-ink-secondary leading-relaxed">
            Every recommendation shows exactly why it was detected, which data sources contributed,
            how signals were weighted, and what historical evidence supports it.
          </p>
        </div>
      </div>

      {RECOMMENDATIONS.map((rec) => {
        const expanded = expandedId === rec.id;
        return (
          <div key={rec.id} className="bg-surface border border-ink-wash rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-bold bg-accent-indigo/10 text-accent-indigo px-1.5 py-0.5 rounded-full uppercase">{rec.type}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${rec.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {rec.confidence}% CONFIDENCE
                </span>
                <RiskBadge level={rec.riskLevel} />
              </div>

              <h3 className="text-sm font-bold text-ink-primary mb-1">{rec.title}</h3>
              <p className="text-[10px] text-ink-tertiary mb-3">{rec.county}</p>

              {/* Why Detected */}
              <div className="p-3 bg-canvas rounded-lg mb-3">
                <p className="text-[10px] font-semibold text-accent-indigo mb-1 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" /> WHY WAS THIS DETECTED?
                </p>
                <p className="text-[11px] text-ink-secondary leading-relaxed">{rec.whyDetected}</p>
              </div>

              {/* Signal Weights Summary */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] text-ink-tertiary">{rec.signals.length} signals</span>
                <span className="text-[10px] text-ink-tertiary">·</span>
                <span className="text-[10px] text-ink-tertiary">{rec.historicalSupport.length} historical matches</span>
                <span className="text-[10px] text-ink-tertiary">·</span>
                <span className="text-[10px] text-ink-tertiary">{rec.nextActions.length} actions</span>
                <button
                  onClick={() => setExpandedId(expanded ? null : rec.id)}
                  className="flex items-center gap-1 text-[11px] font-medium text-accent-indigo hover:text-accent-indigo/80 transition-colors ml-auto"
                >
                  {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {expanded ? 'Collapse' : 'Full breakdown'}
                </button>
              </div>
            </div>

            {expanded && (
              <div className="border-t border-ink-wash px-5 py-4 space-y-5">
                {/* Signal Weights */}
                <div>
                  <h5 className="text-[10px] font-bold text-ink-secondary mb-3 uppercase tracking-wider flex items-center gap-1">
                    <BarChart3 className="w-3 h-3 text-accent-indigo" /> Signal Weights
                  </h5>
                  <div className="space-y-2.5">
                    {rec.signals.map((s, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-accent-indigo">{s.source}</span>
                            <span className="text-[10px] text-ink-secondary">{s.signal}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-ink-primary">{s.weight}%</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${s.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                              {s.confidence}%
                            </span>
                          </div>
                        </div>
                        <WeightBar weight={s.weight} />
                        <span className="text-[8px] text-ink-tertiary">{s.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Historical Support */}
                <div>
                  <h5 className="text-[10px] font-bold text-ink-secondary mb-3 uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" /> Historical Support
                  </h5>
                  <div className="space-y-2">
                    {rec.historicalSupport.map((h, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
                        <div>
                          <span className="text-[11px] font-medium text-ink-primary">{h.event}</span>
                          <p className="text-[10px] text-emerald-600 font-medium">{h.outcome}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-accent-indigo">{h.similarity}% match</span>
                          <span className="text-[9px] text-ink-tertiary block">{h.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Actions */}
                <div>
                  <h5 className="text-[10px] font-bold text-ink-secondary mb-3 uppercase tracking-wider flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-accent-indigo" /> Recommended Next Actions
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
                            <span className="text-[9px] text-ink-tertiary">{a.impact}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transparency Note */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-[10px] font-semibold text-amber-800 mb-0.5 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> TRANSPARENCY NOTE
                  </p>
                  <p className="text-[10px] text-amber-700 leading-relaxed">{rec.transparencyNote}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
