import { useState } from 'react';
import {
  Target, FileText, MapPin, Calendar, History, ArrowRight,
  CheckCircle2, AlertTriangle, Shield, Star, Layers, Clock,
  ChevronDown, ChevronUp, Zap, Activity, Eye, TrendingUp,
  MessageSquare, Paperclip, Flag
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-25: Customer Decision Center
// Unified workspace where every opportunity includes:
// Executive summary, evidence, maps, documents, timeline,
// historical comparisons, related projects, recommended actions,
// risk indicators.
// ═══════════════════════════════════════════════════════════════

const OPPORTUNITIES = [
  {
    id: 'dc1',
    title: 'Highway 287 Corridor Expansion',
    type: 'DOT-Corridor',
    value: '$30-45M',
    confidence: 94,
    county: 'Larimer County, CO',
    executiveSummary: 'Five independent infrastructure signals have converged within 72 hours. The combination of DOT expansion plans, commercial rezoning, utility relocation, demolition permits, and CIP budget approval creates one of the highest-confidence detection patterns in the system. Historical data shows 25-40% land appreciation for early acquisitions near corridor expansions.',
    evidence: [
      { source: 'CDOT Filing', detail: 'HWY-287-EXP-2026 — 4.2-mile expansion, $12.4M budget', date: 'Jul 18', confidence: 99 },
      { source: 'County Planning', detail: 'Commercial rezoning approved for 6 parcels', date: 'Jul 15', confidence: 97 },
      { source: 'Xcel Energy', detail: 'Underground utility relocation notice filed', date: 'Jul 14', confidence: 91 },
      { source: 'Building Permits', detail: '3 demolition permits within corridor buffer', date: 'Jul 10', confidence: 85 },
      { source: 'CIP Tracker', detail: '$12.4M budget approved for road widening FY2026', date: 'Jul 8', confidence: 96 },
    ],
    timeline: [
      { date: 'Jul 8', event: 'CIP budget approved', type: 'milestone' },
      { date: 'Jul 10', event: 'Demolition permits issued', type: 'milestone' },
      { date: 'Jul 14', event: 'Utility relocation filed', type: 'milestone' },
      { date: 'Jul 15', event: 'Rezoning approved', type: 'milestone' },
      { date: 'Jul 18', event: 'DOT expansion filing — AI detection', type: 'action' },
      { date: 'Jul 20', event: 'Executive summary generated', type: 'action' },
    ],
    historicalComparison: { project: 'Highway 34, Greeley (2023)', outcome: '+34% appreciation, 18 developments', relevance: 'Same corridor type, 5-signal pattern', accuracy: 94 },
    relatedProjects: [
      { name: 'I-25 Frontage, Loveland', value: '$22M', confidence: 88 },
      { name: 'Highway 14, Fort Collins', value: '$18M', confidence: 82 },
    ],
    recommendedActions: [
      { step: 1, action: 'Pull parcel ownership records', deadline: 'Jul 21', priority: 'critical' },
      { step: 2, action: 'Contact county planner', deadline: 'Jul 22', priority: 'high' },
      { step: 3, action: 'Schedule site visit', deadline: 'Jul 24', priority: 'high' },
      { step: 4, action: 'Submit LOI', deadline: 'Jul 31', priority: 'critical' },
    ],
    riskIndicators: [
      { risk: 'Acquisition window closing', level: 'high', mitigation: 'Act within 45-60 days' },
      { risk: 'Competing interest possible', level: 'medium', mitigation: 'Early research advantage' },
      { risk: 'Regulatory approval pending', level: 'low', mitigation: 'DOT filing already submitted' },
    ],
    documents: 12,
    mapLocation: 'Larimer County, CO — Highway 287 corridor, mile markers 14-18',
  },
  {
    id: 'dc2',
    title: 'Weld County School Campus RFP',
    type: 'Public Contract',
    value: '$48M',
    confidence: 91,
    county: 'Weld County, CO',
    executiveSummary: 'A $48M K-8 campus RFP represents one of the largest public construction contracts in Weld County this year. Four supporting infrastructure signals indicate a well-planned project with reduced execution risk. Historical WCSD awards favor prepared bidders who attend pre-bid meetings.',
    evidence: [
      { source: 'School DB', detail: 'RFP issued — K-8 campus, 85,000 sq ft, $48M', date: 'Jul 17', confidence: 99 },
      { source: 'Capital Improvement', detail: '$4.2M road extension to campus site approved', date: 'Jul 15', confidence: 94 },
      { source: 'Water Authority', detail: 'Sewer extension permit APP-2026-0847', date: 'Jul 14', confidence: 89 },
      { source: 'Planning', detail: 'Land use changed from agricultural to educational', date: 'Jul 10', confidence: 92 },
    ],
    timeline: [
      { date: 'Jul 10', event: 'Land use change approved', type: 'milestone' },
      { date: 'Jul 14', event: 'Sewer extension permit', type: 'milestone' },
      { date: 'Jul 15', event: 'Road extension approved', type: 'milestone' },
      { date: 'Jul 17', event: 'RFP published — AI detection', type: 'action' },
      { date: 'Jul 20', event: 'Bonding verification started', type: 'action' },
    ],
    historicalComparison: { project: 'WCSD Previous Campus (2022)', outcome: '$52M award to regional JV', relevance: 'Same district, similar scope', accuracy: 100 },
    relatedProjects: [
      { name: 'Thompson SD Campus', value: '$38M', confidence: 85 },
      { name: 'Denver Metro School RFP', value: '$42M', confidence: 78 },
    ],
    recommendedActions: [
      { step: 1, action: 'Download full RFP and addenda', deadline: 'Jul 21', priority: 'critical' },
      { step: 2, action: 'Verify bonding capacity', deadline: 'Jul 23', priority: 'critical' },
      { step: 3, action: 'Attend pre-bid meeting', deadline: 'Aug 3', priority: 'high' },
      { step: 4, action: 'Site visit with facilities director', deadline: 'Jul 28', priority: 'high' },
    ],
    riskIndicators: [
      { risk: 'Pre-qual deadline in 13 days', level: 'high', mitigation: 'Immediate bonding verification' },
      { risk: 'Bonding may require JV', level: 'medium', mitigation: 'Identify JV partner early' },
      { risk: 'Competition from regional firms', level: 'medium', mitigation: 'Pre-bid meeting attendance' },
    ],
    documents: 7,
    mapLocation: 'Weld County, CO — School district zone 4, 4500 County Rd 32',
  },
];

function PriorityBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    critical: 'bg-accent-crimson/10 text-accent-crimson',
    high: 'bg-amber-50 text-amber-700',
    medium: 'bg-blue-50 text-blue-700',
    low: 'bg-emerald-50 text-emerald-700',
  };
  return <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${colors[level] || colors.low}`}>{level.toUpperCase()}</span>;
}

function RiskBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    high: 'bg-accent-crimson/10 text-accent-crimson',
    medium: 'bg-amber-50 text-amber-700',
    low: 'bg-emerald-50 text-emerald-700',
  };
  return <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${colors[level] || colors.low}`}>{level.toUpperCase()}</span>;
}

export default function CustomerDecisionCenter() {
  const [expandedId, setExpandedId] = useState<string | null>('dc1');

  return (
    <div className="space-y-6">
      {OPPORTUNITIES.map((opp) => {
        const expanded = expandedId === opp.id;
        return (
          <div key={opp.id} className="bg-surface border border-ink-wash rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-bold bg-accent-indigo/10 text-accent-indigo px-1.5 py-0.5 rounded-full uppercase">{opp.type}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${opp.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {opp.confidence}%
                </span>
                <span className="text-[9px] px-1.5 py-0.5 bg-accent-indigo/10 text-accent-indigo rounded-full font-bold flex items-center gap-1">
                  <FileText className="w-2.5 h-2.5" /> {opp.documents} docs
                </span>
              </div>
              <h3 className="text-sm font-bold text-ink-primary mb-1">{opp.title}</h3>
              <div className="flex items-center gap-2 text-[10px] text-ink-tertiary mb-3">
                <MapPin className="w-3 h-3" /> {opp.county}
                <span>·</span>
                <span className="text-emerald-600 font-medium">{opp.value}</span>
              </div>

              {/* Executive Summary */}
              <div className="p-3 bg-canvas rounded-lg mb-3">
                <p className="text-[10px] font-semibold text-accent-indigo mb-1 flex items-center gap-1">
                  <Target className="w-3 h-3" /> EXECUTIVE SUMMARY
                </p>
                <p className="text-[11px] text-ink-secondary leading-relaxed">{opp.executiveSummary}</p>
              </div>

              {/* Map */}
              <div className="p-3 bg-canvas rounded-lg mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent-indigo flex-shrink-0" />
                <span className="text-[11px] text-ink-secondary">{opp.mapLocation}</span>
              </div>

              <button
                onClick={() => setExpandedId(expanded ? null : opp.id)}
                className="text-[11px] font-medium text-accent-indigo hover:text-accent-indigo/80 transition-colors flex items-center gap-1"
              >
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {expanded ? 'Collapse' : 'Full analysis'}
              </button>
            </div>

            {expanded && (
              <div className="border-t border-ink-wash px-5 py-4 space-y-5">
                {/* Evidence */}
                <div>
                  <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3 text-accent-indigo" /> Evidence
                  </h5>
                  <div className="space-y-1.5">
                    {opp.evidence.map((e, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-canvas rounded-lg">
                        <div>
                          <span className="text-[10px] font-semibold text-accent-indigo">{e.source}</span>
                          <p className="text-[11px] text-ink-secondary">{e.detail}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-[9px] text-ink-tertiary block">{e.date}</span>
                          <span className="text-[9px] font-bold text-emerald-600">{e.confidence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-accent-indigo" /> Timeline
                  </h5>
                  <div className="relative pl-4 border-l-2 border-ink-wash space-y-2">
                    {opp.timeline.map((t, i) => (
                      <div key={i} className="relative">
                        <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full border-2 bg-surface border-accent-indigo/30" />
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-accent-indigo">{t.date}</span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${t.type === 'action' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{t.type}</span>
                        </div>
                        <p className="text-[11px] text-ink-secondary">{t.event}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Historical Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-canvas rounded-lg">
                    <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
                      <History className="w-3 h-3 text-accent-indigo" /> Historical Comparison
                    </h5>
                    <p className="text-[11px] font-medium text-ink-primary">{opp.historicalComparison.project}</p>
                    <p className="text-[10px] text-emerald-600 font-medium">{opp.historicalComparison.outcome}</p>
                    <p className="text-[10px] text-ink-secondary mt-1">{opp.historicalComparison.relevance}</p>
                    <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full mt-1 inline-block">
                      {opp.historicalComparison.accuracy}% AI accuracy
                    </span>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
                      <Layers className="w-3 h-3 text-accent-indigo" /> Related Projects
                    </h5>
                    <div className="space-y-1.5">
                      {opp.relatedProjects.map((rp) => (
                        <div key={rp.name} className="p-2 bg-canvas rounded-lg flex items-center justify-between">
                          <span className="text-[11px] text-ink-secondary">{rp.name}</span>
                          <div className="text-right">
                            <span className="text-[10px] text-emerald-600 font-medium">{rp.value}</span>
                            <span className="text-[9px] text-ink-tertiary block">{rp.confidence}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommended Actions */}
                <div>
                  <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-accent-indigo" /> Recommended Actions
                  </h5>
                  <div className="space-y-1.5">
                    {opp.recommendedActions.map((a) => (
                      <div key={a.step} className="flex items-start gap-2 p-2.5 bg-canvas rounded-lg">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-indigo text-white flex items-center justify-center text-[9px] font-bold">{a.step}</span>
                        <div className="flex-1">
                          <span className="text-[11px] font-medium text-ink-primary">{a.action}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-accent-crimson">Due: {a.deadline}</span>
                            <PriorityBadge level={a.priority} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Indicators */}
                <div>
                  <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-accent-crimson" /> Risk Indicators
                  </h5>
                  <div className="space-y-1.5">
                    {opp.riskIndicators.map((r, i) => (
                      <div key={i} className="p-2.5 bg-canvas rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <RiskBadge level={r.level} />
                          <span className="text-[11px] font-medium text-ink-primary">{r.risk}</span>
                        </div>
                        <p className="text-[10px] text-ink-secondary"><span className="text-accent-indigo font-medium">Mitigation:</span> {r.mitigation}</p>
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
