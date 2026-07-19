import { useState } from 'react';
import {
  Zap, TrendingUp, AlertTriangle, Star, MapPin,
  Clock, CheckCircle2, Eye, Bookmark, ArrowRight,
  Flame, BarChart3, Target, Bell, ChevronDown, ChevronUp,
  Brain, Layers, Activity, Globe, FileText, Sparkles
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-21: Priority Dashboard — "Today's Opportunities" Workspace
// Highest-value opportunities, infrastructure events, alerts,
// recommendations, trending regions, watchlist updates.
// ═══════════════════════════════════════════════════════════════

interface Opportunity {
  id: string;
  title: string;
  county: string;
  type: string;
  value: string;
  confidence: number;
  urgency: 'high' | 'medium' | 'low';
  detectedAt: string;
  summary: string;
  newToday: boolean;
  trend: string;
}

const TOP_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-001',
    title: 'Highway 287 Corridor — Land Acquisition',
    county: 'Larimer County, CO',
    type: 'DOT-Corridor',
    value: '$30-45M',
    confidence: 94,
    urgency: 'high',
    detectedAt: 'Today, 8:32 AM',
    summary: '5 converging signals. CDOT expansion filed, rezoning approved, utility relocation in progress.',
    newToday: true,
    trend: '+150%',
  },
  {
    id: 'opp-002',
    title: 'Weld County School Campus RFP',
    county: 'Weld County, CO',
    type: 'Public Contract',
    value: '$48M',
    confidence: 91,
    urgency: 'high',
    detectedAt: 'Today, 7:15 AM',
    summary: '$48M K-8 campus RFP issued. 14-day pre-qual window. Road and sewer already approved.',
    newToday: true,
    trend: '+80%',
  },
  {
    id: 'opp-003',
    title: 'Xcel Substation Upgrade Program',
    county: 'Adams County, CO',
    type: 'Utilities',
    value: '$22M',
    confidence: 89,
    urgency: 'medium',
    detectedAt: 'Yesterday, 4:45 PM',
    summary: 'Substation upgrade program with underground relocation. Multi-phase over 18 months.',
    newToday: false,
    trend: '+45%',
  },
  {
    id: 'opp-004',
    title: 'Boulder East Arapahoe Mixed-Use',
    county: 'Boulder County, CO',
    type: 'Commercial',
    value: '$18-25M',
    confidence: 76,
    urgency: 'medium',
    detectedAt: 'Yesterday, 2:20 PM',
    summary: 'Downtown zoning changes enable mixed-use development. 6 signals detected.',
    newToday: false,
    trend: '+110%',
  },
];

const INFRASTRUCTURE_EVENTS = [
  { id: 'e1', change: 'Commercial rezoning approved — Larimer County', impact: 'high' as const, time: '2h ago', source: 'County Planning' },
  { id: 'e2', change: 'Road widening budget approved — $12.4M', impact: 'high' as const, time: '3h ago', source: 'CIP Tracker' },
  { id: 'e3', change: 'Sewer extension permit issued — Weld County', impact: 'medium' as const, time: '5h ago', source: 'Water Authority' },
  { id: 'e4', change: 'New school RFP published — $48M', impact: 'high' as const, time: '7h ago', source: 'School Construction DB' },
  { id: 'e5', change: 'DOT filing: HWY-287-EXP-2026 — 4.2-mile expansion', impact: 'high' as const, time: '8h ago', source: 'DOT Permits' },
  { id: 'e6', change: 'Utility relocation notice filed — Xcel Energy', impact: 'medium' as const, time: '10h ago', source: 'Xcel Energy' },
];

const PRIORITY_ALERTS = [
  { id: 'a1', message: 'Highway 287 acquisition window closing in 45-60 days', severity: 'critical' as const, action: 'Pull parcel records' },
  { id: 'a2', message: 'Weld County school RFP pre-qual deadline in 14 days', severity: 'critical' as const, action: 'Verify bonding' },
  { id: 'a3', message: 'Greeley Highway 34 corridor: signal density up 150%', severity: 'high' as const, action: 'Review analysis' },
  { id: 'a4', message: 'Permit filing velocity up 12% across all counties', severity: 'medium' as const, action: 'View trends' },
];

const TRENDING_REGIONS = [
  { region: 'Denver Metro', projects: 67, trend: '+24%', confidence: 88 },
  { region: 'Front Range North', projects: 42, trend: '+18%', confidence: 84 },
  { region: 'Front Range South', projects: 31, trend: '+12%', confidence: 79 },
  { region: 'Western Slope', projects: 22, trend: '+15%', confidence: 72 },
  { region: 'Eastern Plains', projects: 14, trend: '+8%', confidence: 65 },
];

const WATCHLIST_UPDATES = [
  { id: 'w1', name: 'Highway Corridors', changes: 3, lastUpdated: '1h ago', topChange: 'Highway 287 expansion filed' },
  { id: 'w2', name: 'School Construction', changes: 2, lastUpdated: '3h ago', topChange: '$48M Weld County RFP' },
  { id: 'w3', name: 'Utility Projects', changes: 1, lastUpdated: '6h ago', topChange: 'Xcel substation upgrade' },
  { id: 'w4', name: 'Commercial Development', changes: 4, lastUpdated: '8h ago', topChange: 'Boulder rezoning approved' },
];

function ImpactBadge({ impact }: { impact: 'high' | 'medium' | 'low' }) {
  const colors = { high: 'bg-accent-crimson/10 text-accent-crimson', medium: 'bg-amber-50 text-amber-700', low: 'bg-blue-50 text-blue-700' };
  return <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${colors[impact]}`}>{impact.toUpperCase()}</span>;
}

function UrgencyBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    high: 'bg-accent-crimson/10 text-accent-crimson',
    medium: 'bg-amber-50 text-amber-700',
    low: 'bg-emerald-50 text-emerald-700',
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colors[level] || colors.low}`}>{level.toUpperCase()}</span>;
}

function AlertSeverity({ severity }: { severity: string }) {
  if (severity === 'critical') return <span className="w-2 h-2 rounded-full bg-accent-crimson animate-pulse" />;
  if (severity === 'high') return <span className="w-2 h-2 rounded-full bg-amber-500" />;
  return <span className="w-2 h-2 rounded-full bg-blue-400" />;
}

export default function PriorityDashboard() {
  const [expandedOpp, setExpandedOpp] = useState<string | null>(null);
  const newOpps = TOP_OPPORTUNITIES.filter((o) => o.newToday).length;
  const criticalAlerts = PRIORITY_ALERTS.filter((a) => a.severity === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Opportunities Today', value: TOP_OPPORTUNITIES.length.toString(), icon: Target, color: 'text-accent-indigo', sub: `${newOpps} new` },
          { label: 'Critical Alerts', value: criticalAlerts.toString(), icon: AlertTriangle, color: 'text-accent-crimson', sub: 'Action required' },
          { label: 'Infrastructure Events', value: INFRASTRUCTURE_EVENTS.length.toString(), icon: Activity, color: 'text-emerald-600', sub: 'Last 24h' },
          { label: 'Avg Confidence', value: `${Math.round(TOP_OPPORTUNITIES.reduce((s, o) => s + o.confidence, 0) / TOP_OPPORTUNITIES.length)}%`, icon: Brain, color: 'text-accent-indigo', sub: 'AI-generated' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-surface border border-ink-wash rounded-xl p-4 text-center">
            <kpi.icon className={`w-5 h-5 ${kpi.color} mx-auto mb-1`} />
            <div className="text-xl font-bold text-ink-primary">{kpi.value}</div>
            <div className="text-[10px] text-ink-tertiary">{kpi.label}</div>
            <div className="text-[9px] text-emerald-600 font-medium">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Top Opportunities */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-accent-indigo" />
          <h4 className="text-sm font-bold text-ink-primary">Today's Top Opportunities</h4>
          <span className="text-[9px] text-emerald-600 font-medium ml-auto">{newOpps} new today</span>
        </div>
        <div className="space-y-3">
          {TOP_OPPORTUNITIES.map((opp) => {
            const expanded = expandedOpp === opp.id;
            return (
              <div key={opp.id} className={`border rounded-xl overflow-hidden transition-colors ${opp.newToday ? 'border-accent-indigo/30 bg-accent-indigo/[0.02]' : 'border-ink-wash bg-canvas'}`}>
                <div className="p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold bg-accent-indigo/10 text-accent-indigo px-1.5 py-0.5 rounded-full uppercase">
                      {opp.type}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${opp.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {opp.confidence}%
                    </span>
                    <UrgencyBadge level={opp.urgency} />
                    {opp.newToday && (
                      <span className="text-[9px] font-bold bg-accent-indigo text-white px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> NEW
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-ink-primary mb-1">{opp.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-ink-tertiary mb-2">
                    <MapPin className="w-3 h-3" /> {opp.county}
                    <span>·</span>
                    <Clock className="w-3 h-3" /> {opp.detectedAt}
                    <span>·</span>
                    <TrendingUp className="w-3 h-3" /> {opp.trend}
                  </div>

                  <p className="text-[11px] text-ink-secondary leading-relaxed mb-3">{opp.summary}</p>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-600">{opp.value}</span>
                    <button
                      onClick={() => setExpandedOpp(expanded ? null : opp.id)}
                      className="flex items-center gap-1 text-[11px] font-medium text-accent-indigo hover:text-accent-indigo/80 transition-colors ml-auto"
                    >
                      {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      {expanded ? 'Less' : 'View evidence & actions'}
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="border-t border-ink-wash px-4 py-3 space-y-2">
                    <div className="flex items-start gap-2 p-2 bg-surface rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-semibold text-ink-secondary">Evidence</span>
                        <p className="text-[11px] text-ink-secondary">Multiple independent signal sources confirm this opportunity with {opp.confidence}% confidence.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-surface rounded-lg">
                      <ArrowRight className="w-3.5 h-3.5 text-accent-indigo flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-semibold text-ink-secondary">Recommended Action</span>
                        <p className="text-[11px] text-ink-secondary">
                          {opp.urgency === 'high' ? 'Immediate follow-up required. Review full analysis and prioritize action items.' : 'Monitor and schedule follow-up within 48 hours.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Infrastructure Events */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-accent-indigo" />
            <h4 className="text-sm font-bold text-ink-primary">Infrastructure Events</h4>
            <span className="text-[9px] text-ink-tertiary ml-auto">Last 24h</span>
          </div>
          <div className="space-y-2">
            {INFRASTRUCTURE_EVENTS.map((e) => (
              <div key={e.id} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-medium text-ink-secondary">{e.change}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-accent-indigo">{e.source}</span>
                    <span className="text-[9px] text-ink-tertiary">{e.time}</span>
                  </div>
                </div>
                <ImpactBadge impact={e.impact} />
              </div>
            ))}
          </div>
        </div>

        {/* Priority Alerts */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-accent-crimson" />
            <h4 className="text-sm font-bold text-ink-primary">Priority Alerts</h4>
            <span className="text-[9px] text-accent-crimson font-medium ml-auto">{criticalAlerts} critical</span>
          </div>
          <div className="space-y-2">
            {PRIORITY_ALERTS.map((a) => (
              <div key={a.id} className={`flex items-start gap-2 p-2.5 rounded-lg ${a.severity === 'critical' ? 'bg-accent-crimson/[0.03] border border-accent-crimson/10' : 'bg-canvas'}`}>
                <AlertSeverity severity={a.severity} />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-medium text-ink-secondary">{a.message}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-accent-indigo font-medium">{a.action}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Regions */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-accent-indigo" />
            <h4 className="text-sm font-bold text-ink-primary">Trending Regions</h4>
          </div>
          <div className="space-y-3">
            {TRENDING_REGIONS.map((r) => (
              <div key={r.region}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-ink-secondary">{r.region}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-emerald-600 font-bold">{r.trend}</span>
                    <span className="text-[9px] text-ink-tertiary">{r.projects} projects</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-ink-wash/30 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-indigo rounded-full" style={{ width: `${Math.min((r.projects / 80) * 100, 100)}%` }} />
                  </div>
                  <span className="text-[9px] text-ink-tertiary w-8 text-right">{r.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Watchlist Updates */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bookmark className="w-4 h-4 text-accent-indigo" />
            <h4 className="text-sm font-bold text-ink-primary">Watchlist Updates</h4>
          </div>
          <div className="space-y-2">
            {WATCHLIST_UPDATES.map((w) => (
              <div key={w.id} className="p-3 bg-canvas rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-ink-primary">{w.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-accent-indigo/10 text-accent-indigo rounded-full font-bold">
                    {w.changes} changes
                  </span>
                </div>
                <span className="text-[10px] text-ink-secondary">{w.topChange}</span>
                <div className="text-[9px] text-ink-tertiary mt-0.5">{w.lastUpdated}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
