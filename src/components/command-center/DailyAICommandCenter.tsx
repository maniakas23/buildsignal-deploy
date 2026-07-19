import { useState } from 'react';
import {
  Sparkles, Zap, TrendingUp, MapPin, Clock, AlertTriangle,
  ArrowRight, Star, Flame, Eye, Target, CheckCircle2,
  ChevronDown, ChevronUp, Brain, Activity, BarChart3,
  Globe, Bookmark, Bell, Layers
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-23: Daily AI Command Center
// Personalized executive briefing answering:
// What changed? Highest priority opps? Projects needing action?
// Regions heating up? What to review first?
// ═══════════════════════════════════════════════════════════════

const SINCE_LAST_VISIT = {
  lastVisit: 'Jul 19, 4:32 PM',
  newOpportunities: 7,
  updatedProjects: 12,
  newAlerts: 3,
  infrastructureEvents: 6,
  watchlistChanges: 4,
};

const PRIORITY_OPPORTUNITIES = [
  {
    id: 'pc-001',
    title: 'Highway 287 Corridor Expansion',
    priority: 1,
    value: '$30-45M',
    confidence: 94,
    urgency: 'critical',
    reason: '5 signals converged — acquisition window closing',
    action: 'Pull parcel records',
    deadline: 'Jul 21',
    county: 'Larimer County, CO',
    newSinceVisit: true,
  },
  {
    id: 'pc-002',
    title: 'Weld County School Campus RFP',
    priority: 2,
    value: '$48M',
    confidence: 91,
    urgency: 'high',
    reason: 'Pre-qual deadline in 14 days',
    action: 'Verify bonding capacity',
    deadline: 'Jul 23',
    county: 'Weld County, CO',
    newSinceVisit: true,
  },
  {
    id: 'pc-003',
    title: 'Xcel Substation Upgrade Program',
    priority: 3,
    value: '$22M',
    confidence: 89,
    urgency: 'medium',
    reason: 'Multi-phase utility project starting',
    action: 'Review scope documents',
    deadline: 'Jul 25',
    county: 'Adams County, CO',
    newSinceVisit: false,
  },
];

const ACTION_REQUIRED = [
  { id: 'ar1', task: 'Pull parcel records — Highway 287', due: 'Jul 21', priority: 'critical', status: 'pending' },
  { id: 'ar2', task: 'Verify bonding for $48M RFP', due: 'Jul 23', priority: 'high', status: 'pending' },
  { id: 'ar3', task: 'Attend pre-bid meeting', due: 'Aug 3', priority: 'high', status: 'scheduled' },
  { id: 'ar4', task: 'Review site visit notes', due: 'Jul 24', priority: 'medium', status: 'completed' },
  { id: 'ar5', task: 'Set corridor alert filters', due: 'Jul 21', priority: 'medium', status: 'pending' },
];

const HEATING_REGIONS = [
  { region: 'Denver Metro', projects: 67, trend: '+24%', hotSignals: 12, topProject: 'I-25 expansion planning' },
  { region: 'Front Range North', projects: 42, trend: '+18%', hotSignals: 8, topProject: 'Highway 287 corridor' },
  { region: 'Greeley Area', projects: 28, trend: '+31%', hotSignals: 6, topProject: 'School campus RFP' },
  { region: 'Boulder County', projects: 19, trend: '+15%', hotSignals: 5, topProject: 'Downtown rezoning' },
];

const REVIEW_QUEUE = [
  { id: 'rq1', item: 'Highway 287 full analysis', type: 'opportunity', importance: 'critical', estimatedTime: '5 min' },
  { id: 'rq2', item: 'Weld County RFP documents', type: 'document', importance: 'high', estimatedTime: '10 min' },
  { id: 'rq3', item: 'Weekly infrastructure report', type: 'report', importance: 'medium', estimatedTime: '3 min' },
  { id: 'rq4', item: 'Team watchlist updates', type: 'collaboration', importance: 'medium', estimatedTime: '2 min' },
  { id: 'rq5', item: 'New permit filings — Larimer', type: 'alert', importance: 'high', estimatedTime: '4 min' },
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

export default function DailyAICommandCenter() {
  const [expandedOpp, setExpandedOpp] = useState<string | null>(null);
  const pendingActions = ACTION_REQUIRED.filter((a) => a.status !== 'completed').length;

  return (
    <div className="space-y-6">
      {/* Since Last Visit Summary */}
      <div className="bg-accent-indigo/[0.03] border border-accent-indigo/10 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-accent-indigo" />
          <h4 className="text-sm font-bold text-accent-indigo">Since Your Last Visit — {SINCE_LAST_VISIT.lastVisit}</h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { label: 'New Opps', value: SINCE_LAST_VISIT.newOpportunities, icon: Zap },
            { label: 'Updated', value: SINCE_LAST_VISIT.updatedProjects, icon: Activity },
            { label: 'Alerts', value: SINCE_LAST_VISIT.newAlerts, icon: Bell },
            { label: 'Infra Events', value: SINCE_LAST_VISIT.infrastructureEvents, icon: Layers },
            { label: 'Watchlist', value: SINCE_LAST_VISIT.watchlistChanges, icon: Bookmark },
            { label: 'Actions Due', value: pendingActions, icon: Target },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-ink-wash rounded-lg p-2.5 text-center">
              <s.icon className="w-3.5 h-3.5 text-accent-indigo mx-auto mb-0.5" />
              <div className="text-lg font-bold text-ink-primary">{s.value}</div>
              <div className="text-[8px] text-ink-tertiary">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Opportunities */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-accent-indigo" />
          <h4 className="text-sm font-bold text-ink-primary">Highest Priority Opportunities</h4>
        </div>
        <div className="space-y-3">
          {PRIORITY_OPPORTUNITIES.map((opp) => {
            const expanded = expandedOpp === opp.id;
            return (
              <div key={opp.id} className={`border rounded-xl overflow-hidden ${opp.newSinceVisit ? 'border-accent-indigo/30 bg-accent-indigo/[0.02]' : 'border-ink-wash bg-canvas'}`}>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-indigo text-white flex items-center justify-center text-[9px] font-bold">{opp.priority}</span>
                    <UrgencyBadge level={opp.urgency} />
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${opp.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {opp.confidence}%
                    </span>
                    {opp.newSinceVisit && (
                      <span className="text-[9px] font-bold bg-accent-indigo text-white px-1.5 py-0.5 rounded-full">NEW</span>
                    )}
                  </div>
                  <h5 className="text-sm font-bold text-ink-primary mb-1">{opp.title}</h5>
                  <div className="flex items-center gap-2 text-[10px] text-ink-tertiary mb-2">
                    <MapPin className="w-3 h-3" /> {opp.county}
                    <span>·</span>
                    <span className="text-emerald-600 font-medium">{opp.value}</span>
                  </div>
                  <p className="text-[11px] text-ink-secondary mb-2">{opp.reason}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 text-accent-indigo" />
                      <span className="text-[10px] text-accent-indigo font-medium">{opp.action}</span>
                      <span className="text-[9px] text-accent-crimson">Due: {opp.deadline}</span>
                    </div>
                    <button
                      onClick={() => setExpandedOpp(expanded ? null : opp.id)}
                      className="text-[10px] text-ink-tertiary hover:text-accent-indigo transition-colors"
                    >
                      {expanded ? 'Less' : 'Details'}
                    </button>
                  </div>
                </div>
                {expanded && (
                  <div className="border-t border-ink-wash px-4 py-3">
                    <p className="text-[11px] text-ink-secondary">
                      This opportunity requires immediate attention. {opp.confidence}% confidence based on converging signals.
                      Recommended action: {opp.action} before {opp.deadline}.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Action Required */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-ink-primary flex items-center gap-2">
              <Target className="w-4 h-4 text-accent-indigo" /> Action Required Today
            </h4>
            <span className="text-[10px] text-accent-crimson font-medium">{pendingActions} pending</span>
          </div>
          <div className="space-y-2">
            {ACTION_REQUIRED.map((a) => (
              <div key={a.id} className={`flex items-center justify-between p-2.5 rounded-lg ${a.status === 'completed' ? 'bg-emerald-50/50 border border-emerald-200/50' : 'bg-canvas'}`}>
                <div className="flex items-center gap-2">
                  {a.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <div className={`w-3.5 h-3.5 rounded-full border-2 ${a.priority === 'critical' ? 'border-accent-crimson' : a.priority === 'high' ? 'border-amber-500' : 'border-blue-400'}`} />
                  )}
                  <span className={`text-[11px] ${a.status === 'completed' ? 'text-ink-tertiary line-through' : 'text-ink-secondary font-medium'}`}>{a.task}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UrgencyBadge level={a.priority} />
                  <span className="text-[9px] text-ink-tertiary">{a.due}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Queue */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4 text-accent-indigo" /> What to Review First
          </h4>
          <div className="space-y-2">
            {REVIEW_QUEUE.map((rq, i) => (
              <div key={rq.id} className="flex items-center gap-2 p-2.5 bg-canvas rounded-lg">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-indigo/10 text-accent-indigo flex items-center justify-center text-[9px] font-bold">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-medium text-ink-secondary">{rq.item}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] px-1.5 py-0.5 bg-accent-indigo/10 text-accent-indigo rounded-full">{rq.type}</span>
                    <span className="text-[9px] text-ink-tertiary">{rq.estimatedTime}</span>
                  </div>
                </div>
                <UrgencyBadge level={rq.importance} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heating Regions */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <Flame className="w-4 h-4 text-accent-crimson" /> Regions Heating Up
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {HEATING_REGIONS.map((r) => (
            <div key={r.region} className="bg-canvas border border-ink-wash rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-ink-primary">{r.region}</span>
                <span className="text-[10px] font-bold text-accent-crimson">{r.trend}</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <div className="flex-1 h-1.5 bg-ink-wash/30 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-crimson rounded-full" style={{ width: `${Math.min((r.projects / 80) * 100, 100)}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-ink-tertiary">{r.projects} projects</span>
                <span className="text-[9px] text-ink-tertiary">{r.hotSignals} hot signals</span>
              </div>
              <p className="text-[9px] text-accent-indigo mt-1 truncate">{r.topProject}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
