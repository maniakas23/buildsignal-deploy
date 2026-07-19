import { useState } from 'react';
import {
  FileText, Brain, TrendingUp, CheckCircle2, Clock, MapPin,
  ArrowRight, Zap, DollarSign, Users, ChevronDown, ChevronUp,
  BarChart3, AlertCircle, Lightbulb
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-19: Actionable Recommendations
// Professional analyst-style recommendations with full
// explainability, evidence, and actionable next steps.
// ═══════════════════════════════════════════════════════════════

interface Recommendation {
  id: string;
  title: string;
  analyst: string;
  generatedAt: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  county: string;
  why: string;
  evidence: { source: string; detail: string; date: string }[];
  historicalContext: string;
  nextActions: { step: number; action: string; deadline?: string }[];
  relatedOpps: string[];
  estimatedImpact: { metric: string; value: string }[];
}

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-001',
    title: 'Acquire Land Along Highway 287 Corridor Before Q3 End',
    analyst: 'BuildSignal Intelligence Engine',
    generatedAt: 'Today, 6:00 AM',
    confidence: 94,
    impact: 'high',
    category: 'Land Acquisition',
    county: 'Larimer County, CO',
    why: 'Five independent infrastructure signals have correlated within a 14-day window across DOT permits, planning agendas, utility filings, building permits, and capital improvement plans. Cross-provider validation yields a 94% confidence score — the highest threshold for auto-generated recommendations.',
    evidence: [
      { source: 'DOT Permit Database', detail: 'HWY-287-EXP-2026 filed — 4.2-mile expansion with commercial zoning overlay', date: 'Jul 18' },
      { source: 'Larimer County Planning', detail: 'Commercial rezoning approved for parcels 287-A through 287-F', date: 'Jul 15' },
      { source: 'Xcel Energy', detail: 'Underground utility relocation notice filed for corridor right-of-way', date: 'Jul 14' },
      { source: 'Building Permits', detail: '3 demolition permits issued for structures within corridor buffer', date: 'Jul 10' },
      { source: 'CIP Tracker', detail: '$12.4M road widening budget approved for FY2026', date: 'Jul 8' },
    ],
    historicalContext: 'The Highway 34 expansion in Greeley (2023) followed an identical 5-signal pattern. Properties within 0.5 miles of the corridor appreciated 34% within 24 months. 18 commercial developments broke ground within 18 months, averaging $2.3M per project. Early acquirers who closed within 60 days of first signal captured the highest appreciation.',
    nextActions: [
      { step: 1, action: 'Pull parcel ownership records for 0.5-mile corridor buffer', deadline: 'Jul 21' },
      { step: 2, action: 'Contact Larimer County Planning — confirm zoning effective date', deadline: 'Jul 22' },
      { step: 3, action: 'Schedule site visit for top 5 priority parcels', deadline: 'Jul 24' },
      { step: 4, action: 'Submit LOI for priority parcels before Aug 1', deadline: 'Jul 31' },
      { step: 5, action: 'Set up automated alerts for new filings near corridor', deadline: 'Jul 21' },
    ],
    relatedOpps: ['Downtown Fort Collins Mixed-Use', 'Xcel Substation Upgrade'],
    estimatedImpact: [
      { metric: 'Land Appreciation (24mo)', value: '+25-40%' },
      { metric: 'Total Development Value', value: '$30-45M' },
      { metric: 'Projected Deals', value: '15-20' },
      { metric: 'ROI Timeline', value: '18-24 months' },
    ],
  },
  {
    id: 'rec-002',
    title: 'Bid Preparation for Weld County School Campus RFP',
    analyst: 'BuildSignal Intelligence Engine',
    generatedAt: 'Today, 6:00 AM',
    confidence: 91,
    impact: 'high',
    category: 'Public Contract',
    county: 'Weld County, CO',
    why: 'A major school construction RFP was published with $48M estimated budget. Supporting infrastructure filings (road extension, sewer, land use change) create a complete project profile. Historical data from the district shows consistent award patterns.',
    evidence: [
      { source: 'School Construction DB', detail: 'RFP-WCSD-NEWCAMPUS-2026 published — K-8, 85,000 sq ft', date: 'Jul 17' },
      { source: 'Capital Improvement', detail: '$4.2M road extension to campus site approved', date: 'Jul 15' },
      { source: 'Water Authority', detail: 'Sewer extension permit APP-2026-0847 issued', date: 'Jul 14' },
      { source: 'Planning', detail: 'Land use change from agricultural to educational approved', date: 'Jul 10' },
    ],
    historicalContext: 'WCSD awarded their previous campus project (2022) at $52M to a regional JV after 22-month construction. 14 local subcontractors participated. The district favors bidders who attend pre-bid meetings and conduct site visits. Awards typically go to firms with demonstrated school construction experience.',
    nextActions: [
      { step: 1, action: 'Download complete RFP and addenda from WCSD portal', deadline: 'Jul 21' },
      { step: 2, action: 'Verify bonding capacity for $48M project scope', deadline: 'Jul 23' },
      { step: 3, action: 'Attend mandatory pre-bid meeting', deadline: 'Aug 3' },
      { step: 4, action: 'Schedule site visit with district facilities director', deadline: 'Jul 28' },
    ],
    relatedOpps: ['Greeley CIP Road Extension', 'Weld County Water Projects'],
    estimatedImpact: [
      { metric: 'Contract Value', value: '$48M' },
      { metric: 'Subcontractor Ops', value: '$15-20M' },
      { metric: 'Timeline', value: '22 months' },
      { metric: 'Win Probability', value: '65-75%' },
    ],
  },
  {
    id: 'rec-003',
    title: 'Monitor Greeley Corridor — Emerging Hotspot Pattern',
    analyst: 'BuildSignal Intelligence Engine',
    generatedAt: 'Today, 6:00 AM',
    confidence: 82,
    impact: 'medium',
    category: 'Market Monitoring',
    county: 'Weld County, CO',
    why: 'Signal density along Highway 34 in Greeley has increased 150% above the 30-day average. A cluster of 8 correlated signals suggests coordinated development activity that has not yet reached the threshold for individual opportunity detection.',
    evidence: [
      { source: 'Multi-Provider Analysis', detail: '8 signals across 4 providers in 0.8-mile radius', date: 'Jul 19' },
      { source: 'Trend Analysis', detail: '150% above 30-day rolling average for this corridor', date: 'Jul 20' },
      { source: 'Permit Velocity', detail: 'Permit filing rate increased 3x week-over-week', date: 'Jul 18' },
    ],
    historicalContext: 'Corridors that reach this signal density threshold have a 78% probability of producing at least one high-confidence opportunity within 30 days. Early monitoring positions you ahead of competitors who typically react after the primary opportunity surfaces.',
    nextActions: [
      { step: 1, action: 'Create dedicated watchlist for Greeley Highway 34 corridor', deadline: 'Jul 21' },
      { step: 2, action: 'Set alert threshold to notify on any new permit within 0.5 miles', deadline: 'Jul 21' },
      { step: 3, action: 'Review historical sales data for corridor parcels', deadline: 'Jul 25' },
    ],
    relatedOpps: ['Highway 287 Expansion'],
    estimatedImpact: [
      { metric: 'Probability of Major Opp', value: '78%' },
      { metric: 'Time to Detection', value: '14-30 days' },
      { metric: 'First-Mover Advantage', value: '2-4 weeks' },
    ],
  },
];

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

function RecCard({ rec }: { rec: Recommendation }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-surface border border-ink-wash rounded-xl overflow-hidden">
      <div className="p-4">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-[10px] font-bold bg-accent-indigo/10 text-accent-indigo px-1.5 py-0.5 rounded-full uppercase">
            {rec.category}
          </span>
          <ImpactBadge impact={rec.impact} />
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            rec.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}>
            {rec.confidence}% confidence
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-ink-primary mb-1">{rec.title}</h3>
        <div className="flex items-center gap-2 text-[10px] text-ink-tertiary mb-3">
          <MapPin className="w-3 h-3" /> {rec.county}
          <span>·</span>
          <Brain className="w-3 h-3" /> {rec.analyst}
          <span>·</span>
          <Clock className="w-3 h-3" /> {rec.generatedAt}
        </div>

        {/* Why */}
        <div className="p-3 bg-canvas rounded-lg mb-3">
          <p className="text-[10px] font-semibold text-ink-secondary mb-1 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-accent-indigo" /> ANALYSIS
          </p>
          <p className="text-[11px] text-ink-secondary leading-relaxed">{rec.why}</p>
        </div>

        {/* Expand */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[11px] font-medium text-accent-indigo hover:text-accent-indigo/80 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? 'Collapse report' : 'View full analyst report'}
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
              {rec.evidence.map((e, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-canvas rounded-lg">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-accent-indigo/10 text-accent-indigo flex items-center justify-center text-[8px] font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <span className="text-[10px] font-semibold text-accent-indigo">{e.source}</span>
                    <span className="text-[9px] text-ink-tertiary ml-1">{e.date}</span>
                    <p className="text-[11px] text-ink-secondary mt-0.5">{e.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Context */}
          <div>
            <h5 className="text-[10px] font-bold text-ink-secondary mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-blue-500" /> Historical Context
            </h5>
            <p className="text-[11px] text-ink-secondary leading-relaxed bg-canvas p-3 rounded-lg">{rec.historicalContext}</p>
          </div>

          {/* Next Actions */}
          <div>
            <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
              <ArrowRight className="w-3 h-3 text-accent-indigo" /> Recommended Actions
            </h5>
            <div className="space-y-1.5">
              {rec.nextActions.map((a) => (
                <div key={a.step} className="flex items-start gap-2 p-2.5 bg-canvas rounded-lg">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-indigo text-white flex items-center justify-center text-[9px] font-bold">
                    {a.step}
                  </span>
                  <div className="flex-1">
                    <span className="text-[11px] text-ink-secondary">{a.action}</span>
                    {a.deadline && (
                      <span className="block text-[9px] text-accent-crimson font-medium mt-0.5">Due: {a.deadline}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estimated Impact */}
          <div>
            <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-500" /> Estimated Impact
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {rec.estimatedImpact.map((ei) => (
                <div key={ei.metric} className="bg-canvas border border-ink-wash rounded-lg p-2.5 text-center">
                  <div className="text-sm font-bold text-emerald-600">{ei.value}</div>
                  <div className="text-[9px] text-ink-tertiary mt-0.5">{ei.metric}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Related */}
          <div>
            <h5 className="text-[10px] font-bold text-ink-secondary mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Related Opportunities
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {rec.relatedOpps.map((ro) => (
                <span key={ro} className="text-[10px] px-2 py-1 bg-amber-50 text-amber-700 rounded-full font-medium">
                  {ro}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ActionableRecommendations() {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all');
  const filtered = filter === 'all' ? RECOMMENDATIONS : RECOMMENDATIONS.filter((r) => r.impact === filter);

  return (
    <div className="space-y-5">
      {/* Header summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Recommendations', value: RECOMMENDATIONS.length.toString(), icon: FileText },
          { label: 'Avg Confidence', value: `${Math.round(RECOMMENDATIONS.reduce((s, r) => s + r.confidence, 0) / RECOMMENDATIONS.length)}%`, icon: Brain },
          { label: 'High Impact', value: RECOMMENDATIONS.filter((r) => r.impact === 'high').length.toString(), icon: AlertCircle },
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
        {(['all', 'high', 'medium'] as const).map((f) => (
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

      {/* Recommendation cards */}
      <div className="space-y-3">
        {filtered.map((rec) => (
          <RecCard key={rec.id} rec={rec} />
        ))}
      </div>
    </div>
  );
}
