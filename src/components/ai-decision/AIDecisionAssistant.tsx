import { useState } from 'react';
import {
  Brain, FileText, TrendingUp, CheckCircle2, AlertTriangle,
  ArrowRight, Clock, MapPin, Shield, DollarSign, BarChart3,
  Lightbulb, ChevronDown, ChevronUp, Zap, Target, Users
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-20: AI Decision Assistant
// Every opportunity surfaces an executive summary, analyst-style
// insights, risk indicators, and prioritized actions.
// ═══════════════════════════════════════════════════════════════

interface Analysis {
  id: string;
  title: string;
  executiveSummary: string;
  whyItMatters: string;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  county: string;
  type: string;
  detectedAt: string;
  analyst: string;
  evidence: { source: string; detail: string; date: string; confidence: number }[];
  historicalComparison: { project: string; outcome: string; timeline: string }[];
  similarProjects: string[];
  riskIndicators: { label: string; severity: 'low' | 'medium' | 'high' }[];
  recommendedActions: { priority: number; action: string; deadline: string; impact: string }[];
  businessImpact: { label: string; value: string; timeframe: string }[];
}

const ANALYSES: Analysis[] = [
  {
    id: 'ai-001',
    title: 'Highway 287 Corridor Expansion — Land Acquisition Window Closing',
    executiveSummary: 'A rare convergence of 5 infrastructure signals indicates a major commercial corridor expansion is imminent. CDOT has filed expansion plans, the county has approved commercial rezoning, utilities are relocating, and demolition permits have been issued. Historical data from similar corridor projects shows 25-40% land appreciation within 24 months. The acquisition window is estimated at 45-60 days before pricing adjusts.',
    whyItMatters: 'Corridor expansions of this magnitude occur approximately once every 18-24 months in this region. Early land acquisition within 0.5 miles of the corridor has historically produced the highest returns. The combination of DOT, planning, utility, and permit signals creates one of the highest-confidence detection patterns in our system.',
    confidence: 94,
    riskLevel: 'low',
    county: 'Larimer County, CO',
    type: 'DOT-Corridor',
    detectedAt: 'Jul 18, 2026',
    analyst: 'SignalCore AI Analyst',
    evidence: [
      { source: 'DOT Permits', detail: 'HWY-287-EXP-2026 — 4.2-mile expansion, $12.4M budget', date: 'Jul 18', confidence: 99 },
      { source: 'County Planning', detail: 'Commercial rezoning approved parcels 287-A through 287-F', date: 'Jul 15', confidence: 97 },
      { source: 'Xcel Energy', detail: 'Underground utility relocation notice filed', date: 'Jul 14', confidence: 91 },
      { source: 'Building Permits', detail: '3 demolition permits within corridor buffer zone', date: 'Jul 10', confidence: 85 },
      { source: 'CIP Tracker', detail: '$12.4M road widening budget approved FY2026', date: 'Jul 8', confidence: 96 },
    ],
    historicalComparison: [
      { project: 'Highway 34 Expansion, Greeley (2023)', outcome: '+34% land appreciation, 18 developments', timeline: '24 months' },
      { project: 'I-25 Frontage Road, Loveland (2022)', outcome: '+28% appreciation, 12 commercial projects', timeline: '18 months' },
      { project: 'Highway 14, Fort Collins (2021)', outcome: '+22% appreciation, $45M total development', timeline: '20 months' },
    ],
    similarProjects: ['Highway 34 Greeley', 'I-25 Loveland', 'Highway 14 Fort Collins', 'US-287 Berthoud'],
    riskIndicators: [
      { label: 'Zoning effective date may shift', severity: 'medium' },
      { label: 'CDOT timeline subject to budget approval', severity: 'low' },
      { label: 'Competing acquisitions may emerge', severity: 'medium' },
    ],
    recommendedActions: [
      { priority: 1, action: 'Pull parcel ownership records for 0.5-mile buffer', deadline: 'Jul 21', impact: 'Critical — identifies acquisition targets' },
      { priority: 2, action: 'Contact county planner — confirm zoning effective date', deadline: 'Jul 22', impact: 'High — determines timeline pressure' },
      { priority: 3, action: 'Schedule site visit for top 5 parcels', deadline: 'Jul 24', impact: 'High — physical due diligence' },
      { priority: 4, action: 'Submit LOI for priority parcels', deadline: 'Jul 31', impact: 'Critical — secures position' },
      { priority: 5, action: 'Set automated alerts for new corridor filings', deadline: 'Jul 21', impact: 'Medium — ongoing monitoring' },
    ],
    businessImpact: [
      { label: 'Land Appreciation', value: '+25-40%', timeframe: '24 months' },
      { label: 'Total Market Value', value: '$30-45M', timeframe: 'Development cycle' },
      { label: 'Projected Deals', value: '15-20', timeframe: '18 months' },
      { label: 'Acquisition Window', value: '45-60 days', timeframe: 'Closing urgency' },
    ],
  },
  {
    id: 'ai-002',
    title: 'Weld County School Campus — $48M RFP Competitive Positioning',
    executiveSummary: 'Weld County School District RE-4 has issued a $48M RFP for a new K-8 campus. This represents one of the largest public contracts in the district\'s history. Four supporting infrastructure signals create a complete project profile. Historical analysis of WCSD awards shows a preference for bidders with school construction experience who attend pre-bid meetings. The pre-qualification window closes in 14 days.',
    whyItMatters: 'Public school construction contracts of this size are rare in this region — typically 1-2 per year. The $48M budget represents significant revenue potential for general contractors and subcontractors. The district\'s previous campus award went to a regional JV at $52M, indicating willingness to invest in quality. Supporting infrastructure (road, sewer, land use) is already approved, reducing project risk.',
    confidence: 91,
    riskLevel: 'medium',
    county: 'Weld County, CO',
    type: 'Public Contract',
    detectedAt: 'Jul 17, 2026',
    analyst: 'SignalCore AI Analyst',
    evidence: [
      { source: 'School Construction DB', detail: 'RFP-WCSD-NEWCAMPUS-2026 — K-8, 85,000 sq ft, $48M', date: 'Jul 17', confidence: 99 },
      { source: 'Capital Improvement', detail: '$4.2M road extension to campus site', date: 'Jul 15', confidence: 94 },
      { source: 'Water Authority', detail: 'Sewer extension permit APP-2026-0847', date: 'Jul 14', confidence: 89 },
      { source: 'Planning', detail: 'Land use change: agricultural to educational', date: 'Jul 10', confidence: 95 },
    ],
    historicalComparison: [
      { project: 'WCSD Previous Campus (2022)', outcome: '$52M award to regional JV', timeline: '22 months' },
      { project: 'Thompson SD Campus (2023)', outcome: '$38M, 14 subcontractors', timeline: '20 months' },
    ],
    similarProjects: ['WCSD Previous Campus', 'Thompson SD New Build', 'Poudre SD Expansion'],
    riskIndicators: [
      { label: 'Bonding capacity requirement may exceed small firms', severity: 'high' },
      { label: 'JV partnership may be necessary', severity: 'medium' },
      { label: 'Pre-qualification deadline is firm', severity: 'high' },
    ],
    recommendedActions: [
      { priority: 1, action: 'Download full RFP and addenda', deadline: 'Jul 21', impact: 'Critical — full scope understanding' },
      { priority: 2, action: 'Verify bonding capacity for $48M', deadline: 'Jul 23', impact: 'Critical — determines eligibility' },
      { priority: 3, action: 'Attend mandatory pre-bid meeting', deadline: 'Aug 3', impact: 'High — district expects attendance' },
      { priority: 4, action: 'Schedule site visit with facilities director', deadline: 'Jul 28', impact: 'High — demonstrates commitment' },
    ],
    businessImpact: [
      { label: 'Contract Value', value: '$48M', timeframe: 'Award target' },
      { label: 'Subcontractor Ops', value: '$15-20M', timeframe: 'Bidding window' },
      { label: 'Win Probability', value: '65-75%', timeframe: 'With proper prep' },
      { label: 'Pre-Qual Deadline', value: '14 days', timeframe: 'Immediate action' },
    ],
  },
];

function RiskBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    low: 'bg-emerald-50 text-emerald-700',
    medium: 'bg-amber-50 text-amber-700',
    high: 'bg-accent-crimson/10 text-accent-crimson',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colors[level] || colors.low}`}>
      {level.toUpperCase()} RISK
    </span>
  );
}

function AnalysisCard({ analysis }: { analysis: Analysis }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-surface border border-ink-wash rounded-xl overflow-hidden">
      <div className="p-4">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-[10px] font-bold bg-accent-indigo/10 text-accent-indigo px-1.5 py-0.5 rounded-full uppercase">
            {analysis.type}
          </span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            analysis.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}>
            {analysis.confidence}% CONFIDENCE
          </span>
          <RiskBadge level={analysis.riskLevel} />
          <span className="text-[10px] text-ink-tertiary flex items-center gap-1">
            <Clock className="w-3 h-3" /> {analysis.detectedAt}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-ink-primary mb-1">{analysis.title}</h3>
        <div className="flex items-center gap-2 text-[10px] text-ink-tertiary mb-3">
          <MapPin className="w-3 h-3" /> {analysis.county}
          <span>·</span>
          <Brain className="w-3 h-3" /> {analysis.analyst}
        </div>

        {/* Executive Summary */}
        <div className="p-3 bg-canvas rounded-lg mb-3">
          <p className="text-[10px] font-semibold text-accent-indigo mb-1 flex items-center gap-1">
            <FileText className="w-3 h-3" /> EXECUTIVE SUMMARY
          </p>
          <p className="text-[11px] text-ink-secondary leading-relaxed">{analysis.executiveSummary}</p>
        </div>

        {/* Why It Matters */}
        <div className="p-3 bg-accent-indigo/[0.03] border border-accent-indigo/10 rounded-lg mb-3">
          <p className="text-[10px] font-semibold text-accent-indigo mb-1 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" /> WHY THIS MATTERS
          </p>
          <p className="text-[11px] text-ink-secondary leading-relaxed">{analysis.whyItMatters}</p>
        </div>

        {/* Business Impact Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {analysis.businessImpact.map((bi) => (
            <div key={bi.label} className="bg-canvas border border-ink-wash rounded-lg p-2.5 text-center">
              <div className="text-sm font-bold text-emerald-600">{bi.value}</div>
              <div className="text-[9px] text-ink-tertiary">{bi.label}</div>
              <div className="text-[8px] text-ink-tertiary mt-0.5">{bi.timeframe}</div>
            </div>
          ))}
        </div>

        {/* Expand */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[11px] font-medium text-accent-indigo hover:text-accent-indigo/80 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? 'Collapse full analysis' : 'View full analyst report'}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-ink-wash px-4 py-4 space-y-4">
          {/* Evidence */}
          <div>
            <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Supporting Evidence
            </h5>
            <div className="space-y-1.5">
              {analysis.evidence.map((e, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-canvas rounded-lg">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-accent-indigo/10 text-accent-indigo flex items-center justify-center text-[8px] font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-accent-indigo">{e.source}</span>
                      <span className="text-[9px] text-ink-tertiary">{e.date}</span>
                    </div>
                    <p className="text-[11px] text-ink-secondary">{e.detail}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                    e.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {e.confidence}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Comparison */}
          <div>
            <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-blue-500" /> Historical Comparisons
            </h5>
            <div className="space-y-1.5">
              {analysis.historicalComparison.map((hc, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-canvas rounded-lg">
                  <div>
                    <span className="text-[11px] font-medium text-ink-primary">{hc.project}</span>
                    <p className="text-[10px] text-emerald-600 font-medium">{hc.outcome}</p>
                  </div>
                  <span className="text-[9px] text-ink-tertiary">{hc.timeline}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Indicators */}
          <div>
            <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-500" /> Risk Indicators
            </h5>
            <div className="space-y-1.5">
              {analysis.riskIndicators.map((ri, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-canvas rounded-lg">
                  <span className={`w-2 h-2 rounded-full ${
                    ri.severity === 'high' ? 'bg-accent-crimson' : ri.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <span className="text-[11px] text-ink-secondary">{ri.label}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto ${
                    ri.severity === 'high' ? 'bg-accent-crimson/10 text-accent-crimson' :
                    ri.severity === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {ri.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Actions */}
          <div>
            <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
              <ArrowRight className="w-3 h-3 text-accent-indigo" /> Prioritized Actions
            </h5>
            <div className="space-y-1.5">
              {analysis.recommendedActions.map((a) => (
                <div key={a.priority} className="flex items-start gap-2 p-2.5 bg-canvas rounded-lg">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-indigo text-white flex items-center justify-center text-[9px] font-bold">
                    {a.priority}
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
        </div>
      )}
    </div>
  );
}

export default function AIDecisionAssistant() {
  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'AI Analyses', value: ANALYSES.length.toString(), icon: Brain },
          { label: 'Avg Confidence', value: `${Math.round(ANALYSES.reduce((s, a) => s + a.confidence, 0) / ANALYSES.length)}%`, icon: Target },
          { label: 'Evidence Sources', value: ANALYSES.reduce((s, a) => s + a.evidence.length, 0).toString(), icon: CheckCircle2 },
          { label: 'Action Items', value: ANALYSES.reduce((s, a) => s + a.recommendedActions.length, 0).toString(), icon: Zap },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-ink-wash rounded-xl p-3 text-center">
            <s.icon className="w-4 h-4 text-accent-indigo mx-auto mb-1" />
            <div className="text-lg font-bold text-ink-primary">{s.value}</div>
            <div className="text-[10px] text-ink-tertiary">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Analysis cards */}
      <div className="space-y-3">
        {ANALYSES.map((a) => (
          <AnalysisCard key={a.id} analysis={a} />
        ))}
      </div>
    </div>
  );
}
