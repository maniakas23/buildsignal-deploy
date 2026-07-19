import { useState } from 'react';
import {
  Brain, TrendingUp, MapPin, Calendar, Building2, Zap,
  ChevronDown, ChevronUp, CheckCircle2, AlertCircle, FileText,
  Lightbulb, BarChart3, Users, ArrowRight, Shield, Clock
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-18: Decision Intelligence Panel
// Every opportunity surfaces explainability, evidence,
// confidence, business impact, and recommended actions.
// ═══════════════════════════════════════════════════════════════

interface SignalEvidence {
  source: string;
  value: string;
  date: string;
  confidence: number;
}

interface Opportunity {
  id: string;
  title: string;
  county: string;
  type: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  detectedAt: string;
  whyDetected: string;
  summary: string;
  evidence: SignalEvidence[];
  historicalContext: string;
  businessImpact: string;
  recommendedActions: string[];
  similarOpportunities: number;
}

const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-001',
    title: 'Highway 287 Expansion — New Commercial Corridor',
    county: 'Larimer County, CO',
    type: 'DOT Project',
    confidence: 94,
    impact: 'high',
    detectedAt: '3 hours ago',
    whyDetected: 'Multiple correlated signals across DOT permits, planning agendas, and utility filings indicate a major infrastructure corridor expansion. Cross-provider validation confirms high-confidence detection.',
    summary: 'CDOT filed expansion plans for Highway 287 with associated commercial zoning changes and utility relocations. This pattern historically precedes commercial development within 0.5 miles of the corridor.',
    evidence: [
      { source: 'DOT Permit DB', value: 'HWY-287-EXP-2026', date: '2026-07-18', confidence: 99 },
      { source: 'Planning Agendas', value: 'Commercial rezoning approved', date: '2026-07-15', confidence: 97 },
      { source: 'Utility Filings', value: 'Xcel Energy relocation notice', date: '2026-07-14', confidence: 91 },
      { source: 'Building Permits', value: '3 demolition permits filed', date: '2026-07-10', confidence: 85 },
      { source: 'Capital Improvement', value: '$12.4M road widening', date: '2026-07-08', confidence: 96 },
    ],
    historicalContext: 'Similar Highway 34 expansion in Greeley (2023) led to 18 commercial developments within 18 months, averaging $2.3M per project. Corridor properties appreciated 34% within 2 years.',
    businessImpact: 'Early land acquisition along the corridor could yield 25-40% appreciation within 24 months. Estimated 15-20 commercial development opportunities worth $30-45M total project value.',
    recommendedActions: [
      'Review parcel maps within 0.5 miles of Highway 287 corridor',
      'Contact Larimer County planning for zoning timeline',
      'Set up automated alerts for new permits near corridor',
      'Schedule site visit for priority parcels',
      'Add corridor parcels to watchlist for tracking',
    ],
    similarOpportunities: 4,
  },
  {
    id: 'opp-002',
    title: 'Downtown Fort Collins — Mixed-Use Development Signal',
    county: 'Larimer County, CO',
    type: 'Urban Development',
    confidence: 87,
    impact: 'medium',
    detectedAt: '8 hours ago',
    whyDetected: 'Cluster of building permits, site plans, and water tap applications around downtown core indicates coordinated multi-phase development.',
    summary: '5 contiguous parcels in downtown Fort Collins have filed permits or applications in the past 21 days, suggesting a coordinated mixed-use development project.',
    evidence: [
      { source: 'Building Permits', value: '2 commercial foundation permits', date: '2026-07-17', confidence: 99 },
      { source: 'Water Authority', value: 'Large-meter tap application', date: '2026-07-16', confidence: 88 },
      { source: 'Planning Agendas', value: 'Site plan review scheduled', date: '2026-07-12', confidence: 92 },
    ],
    historicalContext: 'Downtown mixed-use developments in comparable markets (Boulder, Loveland) averaged 18-month completion timelines with 22% ROI for early investors.',
    businessImpact: 'Subcontractor bidding opportunities estimated at $8-12M. Early engagement with developer could secure preferred vendor status.',
    recommendedActions: [
      'Identify the coordinating developer through permit records',
      'Attend upcoming site plan review meeting',
      'Research subcontractor requirements for mixed-use projects',
      'Connect with general contractors in Larimer County',
    ],
    similarOpportunities: 2,
  },
  {
    id: 'opp-003',
    title: 'Weld County School District — New Campus Construction',
    county: 'Weld County, CO',
    type: 'School Construction',
    confidence: 91,
    impact: 'high',
    detectedAt: '12 hours ago',
    whyDetected: 'RFP published for new school campus with associated infrastructure upgrades detected across education and capital improvement data sources.',
    summary: 'Weld County School District RE-4 issued RFP for a new K-8 campus with estimated $48M construction budget. Supporting infrastructure includes road, water, and sewer extensions.',
    evidence: [
      { source: 'School Construction', value: 'RFP-WCSD-NEWCAMPUS-2026', date: '2026-07-17', confidence: 99 },
      { source: 'Capital Improvement', value: '$4.2M road extension', date: '2026-07-15', confidence: 94 },
      { source: 'Water Authority', value: 'Sewer extension permit', date: '2026-07-14', confidence: 89 },
      { source: 'Planning Agendas', value: 'Land use change approved', date: '2026-07-10', confidence: 95 },
    ],
    historicalContext: 'Previous WCSD campus (2022) resulted in $52M contract awarded to regional JV, with 14 local subcontractors participating. Construction timeline was 22 months.',
    businessImpact: 'Prime contractor pre-qualification window opens in 14 days. $48M project with significant subcontractor opportunities in electrical, HVAC, sitework, and roofing.',
    recommendedActions: [
      'Download full RFP and pre-qualification requirements',
      'Form JV partnership if bonding capacity is limited',
      'Attend pre-bid meeting on Aug 3',
      'Contact district facilities director for site visit',
    ],
    similarOpportunities: 1,
  },
];

function ConfidenceBadge({ score }: { score: number }) {
  const color = score >= 90 ? 'bg-emerald-50 text-emerald-700' : score >= 75 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${color}`}>
      <Brain className="w-3 h-3" />
      {score}% confidence
    </span>
  );
}

function ImpactBadge({ impact }: { impact: string }) {
  const colors: Record<string, string> = {
    high: 'bg-accent-crimson/10 text-accent-crimson',
    medium: 'bg-amber-50 text-amber-700',
    low: 'bg-blue-50 text-blue-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colors[impact] || colors.low}`}>
      {impact.toUpperCase()} IMPACT
    </span>
  );
}

function OpportunityCard({ opp }: { opp: Opportunity }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-surface border border-ink-wash rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-accent-indigo/10 text-accent-indigo px-1.5 py-0.5 rounded-full uppercase">
              {opp.type}
            </span>
            <ConfidenceBadge score={opp.confidence} />
            <ImpactBadge impact={opp.impact} />
          </div>
          <span className="text-[10px] text-ink-tertiary flex items-center gap-1">
            <Clock className="w-3 h-3" /> {opp.detectedAt}
          </span>
        </div>

        <h3 className="text-sm font-bold text-ink-primary mb-1">{opp.title}</h3>
        <div className="flex items-center gap-1 text-[11px] text-ink-tertiary mb-2">
          <MapPin className="w-3 h-3" /> {opp.county}
        </div>

        <p className="text-[12px] text-ink-secondary leading-relaxed mb-3">{opp.summary}</p>

        {/* Quick stats */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="text-[10px] flex items-center gap-1 text-ink-tertiary">
            <FileText className="w-3 h-3" /> {opp.evidence.length} evidence sources
          </span>
          <span className="text-[10px] flex items-center gap-1 text-ink-tertiary">
            <Lightbulb className="w-3 h-3" /> {opp.recommendedActions.length} recommended actions
          </span>
          <span className="text-[10px] flex items-center gap-1 text-ink-tertiary">
            <BarChart3 className="w-3 h-3" /> {opp.similarOpportunities} similar
          </span>
        </div>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[11px] font-medium text-accent-indigo hover:text-accent-indigo/80 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? 'Show less' : 'View full intelligence'}
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-ink-wash px-4 py-4 space-y-4">
          {/* Why detected */}
          <div>
            <h4 className="text-[11px] font-bold text-ink-primary mb-1.5 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-accent-indigo" />
              Why This Was Detected
            </h4>
            <p className="text-[11px] text-ink-secondary leading-relaxed bg-canvas p-3 rounded-lg">{opp.whyDetected}</p>
          </div>

          {/* Evidence table */}
          <div>
            <h4 className="text-[11px] font-bold text-ink-primary mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Supporting Evidence
            </h4>
            <div className="space-y-1.5">
              {opp.evidence.map((e, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-canvas rounded-lg">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-medium text-accent-indigo min-w-[100px]">{e.source}</span>
                    <span className="text-[10px] text-ink-secondary truncate">{e.value}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[9px] text-ink-tertiary">{e.date}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${e.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {e.confidence}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical context */}
          <div>
            <h4 className="text-[11px] font-bold text-ink-primary mb-1.5 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
              Historical Comparison
            </h4>
            <p className="text-[11px] text-ink-secondary leading-relaxed bg-canvas p-3 rounded-lg">{opp.historicalContext}</p>
          </div>

          {/* Business impact */}
          <div>
            <h4 className="text-[11px] font-bold text-ink-primary mb-1.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Potential Business Impact
            </h4>
            <p className="text-[11px] text-ink-secondary leading-relaxed bg-amber-50/50 border border-amber-200/50 p-3 rounded-lg">{opp.businessImpact}</p>
          </div>

          {/* Recommended actions */}
          <div>
            <h4 className="text-[11px] font-bold text-ink-primary mb-2 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-accent-indigo" />
              Recommended Next Actions
            </h4>
            <div className="space-y-1.5">
              {opp.recommendedActions.map((action, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 bg-canvas rounded-lg">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-indigo/10 text-accent-indigo flex items-center justify-center text-[9px] font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-[11px] text-ink-secondary leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DecisionIntelligencePanel() {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filtered = filter === 'all' ? OPPORTUNITIES : OPPORTUNITIES.filter((o) => o.impact === filter);
  const avgConfidence = Math.round(OPPORTUNITIES.reduce((s, o) => s + o.confidence, 0) / OPPORTUNITIES.length);

  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Opportunities', value: OPPORTUNITIES.length.toString(), icon: Lightbulb },
          { label: 'Avg Confidence', value: `${avgConfidence}%`, icon: Brain },
          { label: 'High Impact', value: OPPORTUNITIES.filter((o) => o.impact === 'high').length.toString(), icon: Zap },
          { label: 'Evidence Sources', value: OPPORTUNITIES.reduce((s, o) => s + o.evidence.length, 0).toString(), icon: CheckCircle2 },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-ink-wash rounded-xl p-3 text-center">
            <s.icon className="w-4 h-4 text-accent-indigo mx-auto mb-1" />
            <div className="text-lg font-bold text-ink-primary">{s.value}</div>
            <div className="text-[10px] text-ink-tertiary">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-ink-tertiary">Filter:</span>
        {(['all', 'high', 'medium', 'low'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${
              filter === f ? 'bg-accent-indigo text-white' : 'bg-canvas text-ink-secondary hover:bg-surface'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Opportunity cards */}
      <div className="space-y-3">
        {filtered.map((opp) => (
          <OpportunityCard key={opp.id} opp={opp} />
        ))}
      </div>
    </div>
  );
}
