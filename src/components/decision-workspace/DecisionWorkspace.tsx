import { useState } from 'react';
import {
  Briefcase, MapPin, FileText, Clock, CheckCircle2,
  ArrowRight, TrendingUp, Zap, Building2, DollarSign,
  Users, Activity, Calendar, ChevronDown, ChevronUp,
  ExternalLink, Target, Shield, BarChart3, Hash
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-22: Decision Workspace
// Unified opportunity workspace: exec summary, evidence, timeline,
// maps, documents, infrastructure, comparable projects, actions.
// Everything on one screen.
// ═══════════════════════════════════════════════════════════════

const OPPORTUNITY = {
  id: 'dw-001',
  title: 'Highway 287 Corridor Expansion',
  subtitle: 'Multi-signal land acquisition opportunity',
  county: 'Larimer County, CO',
  type: 'DOT-Corridor',
  confidence: 94,
  value: '$30-45M',
  timeline: '6-12 months',
  urgency: 'high' as const,
  stage: 'Signal Cluster',
  execSummary: 'Five independent infrastructure signals have converged within 72 hours indicating a major Highway 287 corridor expansion. CDOT filed expansion plans, the county approved commercial rezoning for 6 parcels, Xcel Energy initiated utility relocation, demolition permits were issued in the buffer zone, and the CIP budget was approved. Historical data from 3 similar corridor projects shows 25-40% land appreciation within 24 months.',
  evidence: [
    { source: 'DOT Permits', detail: 'HWY-287-EXP-2026 — 4.2-mile expansion, $12.4M budget', date: 'Jul 18', confidence: 99, type: 'permit' as const },
    { source: 'County Planning', detail: 'Commercial rezoning approved parcels 287-A through 287-F', date: 'Jul 15', confidence: 97, type: 'zoning' as const },
    { source: 'Xcel Energy', detail: 'Underground utility relocation notice filed', date: 'Jul 14', confidence: 91, type: 'utility' as const },
    { source: 'Building Permits', detail: '3 demolition permits within corridor buffer zone', date: 'Jul 10', confidence: 85, type: 'permit' as const },
    { source: 'CIP Tracker', detail: '$12.4M road widening budget approved FY2026', date: 'Jul 8', confidence: 96, type: 'budget' as const },
  ],
  eventTimeline: [
    { date: 'Jul 8', event: 'CIP budget approved — $12.4M', category: 'budget' },
    { date: 'Jul 10', event: '3 demolition permits issued', category: 'permit' },
    { date: 'Jul 14', event: 'Utility relocation notice filed', category: 'utility' },
    { date: 'Jul 15', event: 'Commercial rezoning approved', category: 'zoning' },
    { date: 'Jul 18', event: 'DOT expansion plan filed', category: 'permit' },
    { date: 'Jul 20', event: 'AI detection — 5 signals converged', category: 'ai' },
  ],
  comparableProjects: [
    { project: 'Highway 34 Expansion, Greeley', outcome: '+34% land appreciation, 18 developments', timeline: '24 months', match: 92 },
    { project: 'I-25 Frontage Road, Loveland', outcome: '+28% appreciation, 12 commercial projects', timeline: '18 months', match: 87 },
    { project: 'Highway 14, Fort Collins', outcome: '+22% appreciation, $45M total development', timeline: '20 months', match: 81 },
  ],
  infrastructure: [
    { change: 'Road widening — 4.2 miles', status: 'planned' as const, impact: 'high' as const },
    { change: 'Commercial rezoning — 6 parcels', status: 'approved' as const, impact: 'high' as const },
    { change: 'Utility relocation — underground', status: 'in-progress' as const, impact: 'medium' as const },
    { change: 'Demolition — 3 structures', status: 'permitted' as const, impact: 'medium' as const },
  ],
  actions: [
    { step: 1, action: 'Pull parcel ownership records for 0.5-mile buffer', deadline: 'Jul 21', owner: 'Research', impact: 'Critical' },
    { step: 2, action: 'Contact county planner — confirm zoning effective date', deadline: 'Jul 22', owner: 'Planning', impact: 'High' },
    { step: 3, action: 'Schedule site visit for top 5 parcels', deadline: 'Jul 24', owner: 'Field', impact: 'High' },
    { step: 4, action: 'Submit LOI for priority parcels', deadline: 'Jul 31', owner: 'Acquisitions', impact: 'Critical' },
    { step: 5, action: 'Set automated alerts for new corridor filings', deadline: 'Jul 21', owner: 'Systems', impact: 'Medium' },
  ],
  documents: [
    { name: 'CDOT Expansion Plan HWY-287-EXP-2026', type: 'Permit', pages: 24 },
    { name: 'Larimer County Rezoning Ordinance 2026-14', type: 'Zoning', pages: 12 },
    { name: 'Xcel Utility Relocation Notice UR-2026-0847', type: 'Utility', pages: 8 },
    { name: 'CIP Budget Authorization FY2026', type: 'Budget', pages: 6 },
  ],
  stakeholders: [
    { role: 'CDOT Region 4', contact: 'Public', relevance: 'Project owner' },
    { role: 'Larimer County Planning', contact: 'Public', relevance: 'Zoning authority' },
    { role: 'Xcel Energy', contact: 'Public', relevance: 'Utility provider' },
  ],
};

function ImpactBadge({ impact }: { impact: 'high' | 'medium' | 'low' }) {
  const colors = { high: 'bg-accent-crimson/10 text-accent-crimson', medium: 'bg-amber-50 text-amber-700', low: 'bg-blue-50 text-blue-700' };
  return <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${colors[impact]}`}>{impact.toUpperCase()}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    planned: 'bg-blue-50 text-blue-700',
    approved: 'bg-emerald-50 text-emerald-700',
    'in-progress': 'bg-amber-50 text-amber-700',
    permitted: 'bg-accent-indigo/10 text-accent-indigo',
  };
  return <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${colors[status] || colors.planned}`}>{status.toUpperCase()}</span>;
}

const SECTIONS = [
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'evidence', label: 'Evidence', icon: CheckCircle2 },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'comparable', label: 'Comparable', icon: BarChart3 },
  { id: 'infrastructure', label: 'Infrastructure', icon: Building2 },
  { id: 'actions', label: 'Actions', icon: ArrowRight },
  { id: 'documents', label: 'Documents', icon: FileText },
] as const;

export default function DecisionWorkspace() {
  const [section, setSection] = useState<typeof SECTIONS[number]['id']>('summary');

  return (
    <div className="space-y-5">
      {/* Opportunity Header Card */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-[10px] font-bold bg-accent-indigo/10 text-accent-indigo px-1.5 py-0.5 rounded-full uppercase">{OPPORTUNITY.type}</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${OPPORTUNITY.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            {OPPORTUNITY.confidence}% CONFIDENCE
          </span>
          <span className="text-[10px] font-bold bg-accent-crimson/10 text-accent-crimson px-1.5 py-0.5 rounded-full uppercase">{OPPORTUNITY.urgency} URGENCY</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded-full font-bold">{OPPORTUNITY.stage}</span>
        </div>

        <h2 className="text-lg font-bold text-ink-primary mb-1">{OPPORTUNITY.title}</h2>
        <p className="text-[11px] text-ink-secondary mb-3">{OPPORTUNITY.subtitle}</p>

        <div className="flex flex-wrap gap-3 mb-3">
          <span className="text-[10px] text-ink-tertiary flex items-center gap-1"><MapPin className="w-3 h-3" /> {OPPORTUNITY.county}</span>
          <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1"><DollarSign className="w-3 h-3" /> {OPPORTUNITY.value}</span>
          <span className="text-[10px] text-ink-tertiary flex items-center gap-1"><Calendar className="w-3 h-3" /> {OPPORTUNITY.timeline}</span>
          <span className="text-[10px] text-ink-tertiary flex items-center gap-1"><Target className="w-3 h-3" /> {OPPORTUNITY.evidence.length} signals</span>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { label: 'Confidence', value: `${OPPORTUNITY.confidence}%`, icon: Target },
            { label: 'Value', value: OPPORTUNITY.value, icon: DollarSign },
            { label: 'Signals', value: OPPORTUNITY.evidence.length.toString(), icon: Zap },
            { label: 'Comparables', value: OPPORTUNITY.comparableProjects.length.toString(), icon: TrendingUp },
            { label: 'Actions', value: OPPORTUNITY.actions.length.toString(), icon: ArrowRight },
            { label: 'Docs', value: OPPORTUNITY.documents.length.toString(), icon: FileText },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-canvas border border-ink-wash rounded-lg p-2 text-center">
              <kpi.icon className="w-3.5 h-3.5 text-accent-indigo mx-auto mb-0.5" />
              <div className="text-sm font-bold text-ink-primary">{kpi.value}</div>
              <div className="text-[8px] text-ink-tertiary">{kpi.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-canvas border border-ink-wash rounded-xl w-fit">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              section === s.id ? 'bg-accent-indigo text-white' : 'text-ink-secondary hover:bg-surface'
            }`}
          >
            <s.icon className="w-3.5 h-3.5" />
            {s.label}
          </button>
        ))}
      </div>

      {/* SUMMARY */}
      {section === 'summary' && (
        <div className="space-y-4">
          <div className="bg-surface border border-ink-wash rounded-2xl p-5">
            <h4 className="text-sm font-bold text-ink-primary mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-accent-indigo" /> Executive Summary</h4>
            <p className="text-[12px] text-ink-secondary leading-relaxed">{OPPORTUNITY.execSummary}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-surface border border-ink-wash rounded-xl p-4">
              <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase">Key Stakeholders</h5>
              {OPPORTUNITY.stakeholders.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-ink-wash/50 last:border-0">
                  <span className="text-[11px] text-ink-secondary">{s.role}</span>
                  <span className="text-[9px] text-ink-tertiary">{s.relevance}</span>
                </div>
              ))}
            </div>
            <div className="bg-surface border border-ink-wash rounded-xl p-4">
              <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase">Quick Stats</h5>
              <div className="space-y-1.5">
                {[
                  { label: 'Detection', value: 'Jul 20, 8:32 AM' },
                  { label: 'Window', value: '45-60 days' },
                  { label: 'Appreciation', value: '+25-40%' },
                  { label: 'Timeline', value: '24 months' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-[10px] text-ink-tertiary">{s.label}</span>
                    <span className="text-[11px] font-medium text-ink-primary">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-surface border border-ink-wash rounded-xl p-4">
              <h5 className="text-[10px] font-bold text-ink-secondary mb-2 uppercase">Top Action</h5>
              <p className="text-[11px] font-medium text-accent-indigo mb-1">{OPPORTUNITY.actions[0].action}</p>
              <span className="text-[9px] text-accent-crimson font-medium">Due: {OPPORTUNITY.actions[0].deadline}</span>
              <div className="mt-2 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-500" />
                <span className="text-[9px] text-emerald-600">{OPPORTUNITY.actions[0].impact} priority</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EVIDENCE */}
      {section === 'evidence' && (
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent-indigo" /> Supporting Evidence</h4>
          <div className="space-y-2">
            {OPPORTUNITY.evidence.map((e, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-canvas rounded-xl">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-indigo/10 text-accent-indigo flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-bold text-accent-indigo">{e.source}</span>
                    <span className="text-[9px] text-ink-tertiary">{e.date}</span>
                  </div>
                  <p className="text-[11px] text-ink-secondary">{e.detail}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] px-1.5 py-0.5 bg-accent-indigo/10 text-accent-indigo rounded-full font-bold">{e.type}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${e.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {e.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TIMELINE */}
      {section === 'timeline' && (
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-accent-indigo" /> Event Timeline</h4>
          <div className="relative pl-4 border-l-2 border-ink-wash space-y-4">
            {OPPORTUNITY.eventTimeline.map((t, i) => (
              <div key={i} className="relative">
                <span className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 ${t.category === 'ai' ? 'bg-accent-indigo border-accent-indigo' : 'bg-surface border-accent-indigo/30'}`} />
                <div className="p-3 bg-canvas rounded-lg">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-bold text-accent-indigo uppercase">{t.category}</span>
                    <span className="text-[9px] text-ink-tertiary">{t.date}</span>
                  </div>
                  <p className="text-[11px] text-ink-secondary">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPARABLE */}
      {section === 'comparable' && (
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-accent-indigo" /> Comparable Historical Projects</h4>
          <div className="space-y-2">
            {OPPORTUNITY.comparableProjects.map((p, i) => (
              <div key={i} className="p-3 bg-canvas rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-ink-primary">{p.project}</span>
                  <span className="text-[10px] font-bold text-accent-indigo">{p.match}% match</span>
                </div>
                <p className="text-[10px] text-emerald-600 font-medium">{p.outcome}</p>
                <span className="text-[9px] text-ink-tertiary">{p.timeline}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INFRASTRUCTURE */}
      {section === 'infrastructure' && (
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2"><Building2 className="w-4 h-4 text-accent-indigo" /> Infrastructure Activity</h4>
          <div className="space-y-2">
            {OPPORTUNITY.infrastructure.map((inf, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
                <span className="text-[11px] text-ink-secondary">{inf.change}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={inf.status} />
                  <ImpactBadge impact={inf.impact} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIONS */}
      {section === 'actions' && (
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2"><ArrowRight className="w-4 h-4 text-accent-indigo" /> Recommended Actions</h4>
          <div className="space-y-2">
            {OPPORTUNITY.actions.map((a) => (
              <div key={a.step} className="flex items-start gap-3 p-3 bg-canvas rounded-xl">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-indigo text-white flex items-center justify-center text-[10px] font-bold">{a.step}</span>
                <div className="flex-1">
                  <span className="text-[12px] font-medium text-ink-primary">{a.action}</span>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-[9px] text-accent-crimson font-medium">Due: {a.deadline}</span>
                    <span className="text-[9px] text-ink-tertiary">{a.owner}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${a.impact === 'Critical' ? 'bg-accent-crimson/10 text-accent-crimson' : a.impact === 'High' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                      {a.impact}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOCUMENTS */}
      {section === 'documents' && (
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-accent-indigo" /> Related Documents</h4>
          <div className="space-y-2">
            {OPPORTUNITY.documents.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-canvas rounded-xl hover:bg-accent-indigo/[0.03] transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-accent-indigo" />
                  <div>
                    <span className="text-[11px] font-medium text-ink-primary">{d.name}</span>
                    <span className="text-[9px] text-ink-tertiary ml-2">{d.type} · {d.pages} pages</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-ink-tertiary" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
