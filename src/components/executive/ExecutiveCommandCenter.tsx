import { useState } from 'react';
import {
  Sparkles, Zap, TrendingUp, MapPin, Clock, AlertTriangle,
  ArrowRight, Star, Flame, Eye, Target, CheckCircle2,
  ChevronDown, ChevronUp, Brain, Activity, BarChart3,
  Globe, Bookmark, Bell, Layers, Users, Shield,
  FileText, DollarSign, ChevronRight, Hash
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-24: AI Executive Command Center
// When users log in, immediately present prioritized intelligence:
// highest-value opps, new infrastructure activity, regional momentum,
// AI priority ranking, recently changed projects, recommended actions,
// watchlist updates, team assignments.
// Everything prioritized by customer value, not chronology.
// ═══════════════════════════════════════════════════════════════

const AI_PRIORITY_RANKING = [
  {
    rank: 1,
    title: 'Highway 287 Corridor Expansion',
    value: '$30-45M',
    confidence: 94,
    urgency: 'critical',
    county: 'Larimer County, CO',
    whyRanked: '5 signals converged in 72hrs — acquisition window closing',
    action: 'Pull parcel records immediately',
    deadline: 'Jul 21',
    newSignals: 2,
    teamAssigned: 'Sarah Chen',
    valueScore: 98,
  },
  {
    rank: 2,
    title: 'Weld County School Campus RFP',
    value: '$48M',
    confidence: 91,
    urgency: 'high',
    county: 'Weld County, CO',
    whyRanked: 'Pre-qual deadline in 14 days — $48M public contract',
    action: 'Verify bonding capacity',
    deadline: 'Jul 23',
    newSignals: 1,
    teamAssigned: 'Marcus Johnson',
    valueScore: 95,
  },
  {
    rank: 3,
    title: 'Xcel Substation Upgrade Program',
    value: '$22M',
    confidence: 89,
    urgency: 'medium',
    county: 'Adams County, CO',
    whyRanked: 'Multi-phase utility project — early entry advantage',
    action: 'Review scope documents',
    deadline: 'Jul 25',
    newSignals: 0,
    teamAssigned: 'Unassigned',
    valueScore: 82,
  },
  {
    rank: 4,
    title: 'Denver Metro I-25 Expansion Planning',
    value: '$120M',
    confidence: 78,
    urgency: 'medium',
    county: 'Denver County, CO',
    whyRanked: 'Long-term corridor development — planning phase entry',
    action: 'Monitor planning meetings',
    deadline: 'Aug 1',
    newSignals: 3,
    teamAssigned: 'Team Alpha',
    valueScore: 76,
  },
  {
    rank: 5,
    title: 'Boulder County Downtown Rezoning',
    value: '$15-25M',
    confidence: 85,
    urgency: 'low',
    county: 'Boulder County, CO',
    whyRanked: 'Commercial rezoning creates development opportunities',
    action: 'Review zoning maps',
    deadline: 'Aug 5',
    newSignals: 1,
    teamAssigned: 'Unassigned',
    valueScore: 71,
  },
];

const NEW_INFRASTRUCTURE_ACTIVITY = [
  { id: 'nia1', type: 'DOT Filing', detail: 'HWY-287-EXP-2026 — 4.2-mile expansion', county: 'Larimer', date: '2 hrs ago', impact: 'high' },
  { id: 'nia2', type: 'Permit', detail: '3 demolition permits issued', county: 'Larimer', date: '4 hrs ago', impact: 'high' },
  { id: 'nia3', type: 'CIP Budget', detail: '$12.4M approved for road widening', county: 'Larimer', date: '6 hrs ago', impact: 'high' },
  { id: 'nia4', type: 'RFP', detail: 'K-8 campus — 85,000 sq ft, $48M', county: 'Weld', date: '8 hrs ago', impact: 'critical' },
  { id: 'nia5', type: 'Utility', detail: 'Substation upgrade filing', county: 'Adams', date: '12 hrs ago', impact: 'medium' },
  { id: 'nia6', type: 'Planning', detail: 'Commercial rezoning 6 parcels', county: 'Larimer', date: '18 hrs ago', impact: 'high' },
];

const REGIONAL_MOMENTUM = [
  { region: 'Denver Metro', projects: 67, trend: '+24%', hotSignals: 12, topProject: 'I-25 expansion planning', momentum: 'accelerating' },
  { region: 'Front Range North', projects: 42, trend: '+18%', hotSignals: 8, topProject: 'Highway 287 corridor', momentum: 'steady' },
  { region: 'Greeley Area', projects: 28, trend: '+31%', hotSignals: 6, topProject: 'School campus RFP', momentum: 'surging' },
  { region: 'Boulder County', projects: 19, trend: '+15%', hotSignals: 5, topProject: 'Downtown rezoning', momentum: 'steady' },
  { region: 'Colorado Springs', projects: 34, trend: '+22%', hotSignals: 7, topProject: 'Pikes Peak highway', momentum: 'accelerating' },
];

const RECENTLY_CHANGED = [
  { id: 'rc1', project: 'Highway 287 Corridor', change: '+2 new signals', type: 'upgrade', time: '2 hrs ago' },
  { id: 'rc2', project: 'Weld County School RFP', change: 'Bonding verified', type: 'progress', time: '4 hrs ago' },
  { id: 'rc3', project: 'Xcel Substation', change: 'Scope documents added', type: 'update', time: '6 hrs ago' },
  { id: 'rc4', project: 'Denver I-25', change: '+3 planning signals', type: 'upgrade', time: '8 hrs ago' },
  { id: 'rc5', project: 'Boulder Rezoning', change: 'Hearing date confirmed', type: 'progress', time: '12 hrs ago' },
];

const WATCHLIST_UPDATES = [
  { id: 'wu1', item: 'Highway 287 — parcel records', status: 'pending', priority: 'critical', assigned: 'Sarah Chen' },
  { id: 'wu2', item: 'Weld RFP — bonding verification', status: 'in-progress', priority: 'high', assigned: 'Marcus Johnson' },
  { id: 'wu3', item: 'Xcel scope review', status: 'pending', priority: 'medium', assigned: 'Unassigned' },
  { id: 'wu4', item: 'I-25 planning meeting', status: 'scheduled', priority: 'medium', assigned: 'Team Alpha' },
];

const TEAM_ASSIGNMENTS = [
  { member: 'Sarah Chen', role: 'Lead Analyst', assigned: 3, completed: 12, active: ['Highway 287', 'Boulder Rezoning'] },
  { member: 'Marcus Johnson', role: 'Senior Researcher', assigned: 2, completed: 8, active: ['Weld School RFP'] },
  { member: 'Team Alpha', role: 'Field Team', assigned: 4, completed: 6, active: ['Denver I-25', 'Colorado Springs'] },
];

function UrgencyBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    critical: 'bg-accent-crimson/10 text-accent-crimson',
    high: 'bg-amber-50 text-amber-700',
    medium: 'bg-blue-50 text-blue-700',
    low: 'bg-emerald-50 text-emerald-700',
  };
  return <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${colors[level] || colors.low}`}>{level.toUpperCase()}</span>;
}

function ImpactBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    critical: 'bg-accent-crimson/10 text-accent-crimson',
    high: 'bg-amber-50 text-amber-700',
    medium: 'bg-blue-50 text-blue-700',
    low: 'bg-emerald-50 text-emerald-700',
  };
  return <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold ${colors[level] || colors.low}`}>{level.toUpperCase()}</span>;
}

export default function ExecutiveCommandCenter() {
  const [expandedRank, setExpandedRank] = useState<number | null>(1);

  return (
    <div className="space-y-6">
      {/* AI Priority Ranking — Value-Prioritized */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-ink-primary flex items-center gap-2">
            <Brain className="w-4 h-4 text-accent-indigo" /> AI Priority Ranking
          </h4>
          <span className="text-[10px] text-ink-tertiary">Ranked by customer value, not time</span>
        </div>
        <div className="space-y-3">
          {AI_PRIORITY_RANKING.map((opp) => {
            const expanded = expandedRank === opp.rank;
            return (
              <div key={opp.rank} className="border rounded-xl overflow-hidden border-ink-wash bg-canvas">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-indigo text-white flex items-center justify-center text-[10px] font-bold">{opp.rank}</span>
                    <UrgencyBadge level={opp.urgency} />
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${opp.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {opp.confidence}%
                    </span>
                    <span className="text-[9px] text-ink-tertiary ml-auto">Value Score: <span className="font-bold text-accent-indigo">{opp.valueScore}</span></span>
                  </div>
                  <h5 className="text-sm font-bold text-ink-primary mb-1">{opp.title}</h5>
                  <div className="flex items-center gap-2 text-[10px] text-ink-tertiary mb-2">
                    <MapPin className="w-3 h-3" /> {opp.county}
                    <span>·</span>
                    <span className="text-emerald-600 font-medium">{opp.value}</span>
                    {opp.newSignals > 0 && (
                      <span className="text-[9px] font-bold bg-accent-crimson/10 text-accent-crimson px-1.5 py-0.5 rounded-full">+{opp.newSignals} new</span>
                    )}
                  </div>
                  <p className="text-[11px] text-ink-secondary mb-2">{opp.whyRanked}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-3 h-3 text-accent-indigo" />
                      <span className="text-[10px] text-accent-indigo font-medium">{opp.action}</span>
                      <span className="text-[9px] text-accent-crimson">Due: {opp.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-ink-tertiary" />
                      <span className="text-[9px] text-ink-tertiary">{opp.teamAssigned}</span>
                      <button
                        onClick={() => setExpandedRank(expanded ? null : opp.rank)}
                        className="text-[10px] text-ink-tertiary hover:text-accent-indigo transition-colors ml-2"
                      >
                        {expanded ? 'Less' : 'Details'}
                      </button>
                    </div>
                  </div>
                </div>
                {expanded && (
                  <div className="border-t border-ink-wash px-4 py-3 bg-accent-indigo/[0.02]">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="p-2 bg-surface rounded-lg text-center">
                        <div className="text-lg font-bold text-accent-indigo">{opp.valueScore}</div>
                        <div className="text-[8px] text-ink-tertiary">AI Value Score</div>
                      </div>
                      <div className="p-2 bg-surface rounded-lg text-center">
                        <div className="text-lg font-bold text-emerald-600">{opp.confidence}%</div>
                        <div className="text-[8px] text-ink-tertiary">Confidence</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-ink-secondary">
                      This opportunity ranks #{opp.rank} based on a composite value score considering projected revenue,
                      confidence level, time sensitivity, signal convergence, and team capacity.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Infrastructure Activity */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent-indigo" /> New Infrastructure Activity
          </h4>
          <div className="space-y-2">
            {NEW_INFRASTRUCTURE_ACTIVITY.map((a) => (
              <div key={a.id} className="flex items-start gap-2 p-2.5 bg-canvas rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-semibold text-accent-indigo">{a.type}</span>
                    <ImpactBadge level={a.impact} />
                  </div>
                  <p className="text-[11px] text-ink-secondary font-medium">{a.detail}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-ink-tertiary">{a.county}</span>
                    <span className="text-[9px] text-ink-tertiary">{a.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Changed Projects */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent-indigo" /> Recently Changed Projects
          </h4>
          <div className="space-y-2">
            {RECENTLY_CHANGED.map((rc) => (
              <div key={rc.id} className="flex items-center gap-2 p-2.5 bg-canvas rounded-lg">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${rc.type === 'upgrade' ? 'bg-emerald-500' : rc.type === 'progress' ? 'bg-accent-indigo' : 'bg-blue-500'}`} />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-medium text-ink-primary">{rc.project}</span>
                  <p className="text-[10px] text-emerald-600 font-medium">{rc.change}</p>
                </div>
                <span className="text-[9px] text-ink-tertiary flex-shrink-0">{rc.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Watchlist Updates */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-accent-indigo" /> Watchlist Updates
          </h4>
          <div className="space-y-2">
            {WATCHLIST_UPDATES.map((wu) => (
              <div key={wu.id} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
                <div className="flex items-center gap-2">
                  {wu.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : wu.status === 'in-progress' ? (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-accent-indigo border-t-transparent animate-spin" />
                  ) : (
                    <div className={`w-3.5 h-3.5 rounded-full border-2 ${wu.priority === 'critical' ? 'border-accent-crimson' : 'border-amber-500'}`} />
                  )}
                  <span className={`text-[11px] ${wu.status === 'completed' ? 'text-ink-tertiary line-through' : 'text-ink-secondary font-medium'}`}>{wu.item}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${wu.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : wu.status === 'in-progress' ? 'bg-accent-indigo/10 text-accent-indigo' : 'bg-amber-50 text-amber-700'}`}>
                    {wu.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Assignments */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-accent-indigo" /> Team Assignments
          </h4>
          <div className="space-y-3">
            {TEAM_ASSIGNMENTS.map((tm) => (
              <div key={tm.member} className="p-3 bg-canvas rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-ink-primary">{tm.member}</span>
                  <span className="text-[9px] text-ink-tertiary">{tm.role}</span>
                </div>
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-[9px] text-ink-tertiary">{tm.assigned} assigned</span>
                  <span className="text-[9px] text-emerald-600">{tm.completed} completed</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {tm.active.map((a) => (
                    <span key={a} className="text-[9px] px-1.5 py-0.5 bg-accent-indigo/10 text-accent-indigo rounded-full">{a}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Momentum */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-accent-indigo" /> Regional Momentum
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {REGIONAL_MOMENTUM.map((r) => (
            <div key={r.region} className="bg-canvas border border-ink-wash rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-ink-primary">{r.region}</span>
                <span className={`text-[10px] font-bold ${r.momentum === 'surging' ? 'text-accent-crimson' : r.momentum === 'accelerating' ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {r.trend}
                </span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <div className="flex-1 h-1.5 bg-ink-wash/30 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-indigo rounded-full" style={{ width: `${Math.min((r.projects / 80) * 100, 100)}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] text-ink-tertiary">{r.projects} projects</span>
                <span className="text-[9px] text-ink-tertiary">{r.hotSignals} hot</span>
              </div>
              <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${r.momentum === 'surging' ? 'bg-accent-crimson/10 text-accent-crimson' : r.momentum === 'accelerating' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {r.momentum}
              </span>
              <p className="text-[9px] text-accent-indigo mt-1 truncate">{r.topProject}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
