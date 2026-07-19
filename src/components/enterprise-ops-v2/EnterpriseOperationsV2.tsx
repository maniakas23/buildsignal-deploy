import {
  Users, BarChart3, Activity, Shield, Clock, CheckCircle2,
  AlertTriangle, TrendingUp, DollarSign, FileText, Layers,
  Globe, Zap, Star, Target, Eye, MessageSquare
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-25: Enterprise Operations v2
// Organization analytics, usage reporting, team activity,
// audit history, permissions, enterprise administration,
// customer health metrics.
// ═══════════════════════════════════════════════════════════════

const ORG_ANALYTICS = [
  { label: 'Team Members', value: '12', trend: '+2', icon: Users },
  { label: 'Active Sessions', value: '34', trend: '+18%', icon: Activity },
  { label: 'Opps Tracked', value: '1,247', trend: '+24%', icon: Target },
  { label: 'Actions Taken', value: '3,891', trend: '+31%', icon: Zap },
];

const USAGE_REPORTING = [
  { metric: 'Daily Active Users', value: '234', change: '+18%', trend: 'up' },
  { metric: 'Avg Session Duration', value: '18 min', change: '+22%', trend: 'up' },
  { metric: 'Searches Per User', value: '12.4', change: '+15%', trend: 'up' },
  { metric: 'Reports Generated', value: '156', change: '+28%', trend: 'up' },
  { metric: 'Exports', value: '89', change: '+35%', trend: 'up' },
  { metric: 'API Calls', value: '45,231', change: '+42%', trend: 'up' },
];

const TEAM_ACTIVITY = [
  { member: 'Sarah Chen', role: 'Lead Analyst', actions: 47, lastActive: '2 min ago', status: 'active' },
  { member: 'Marcus Johnson', role: 'Senior Researcher', actions: 38, lastActive: '15 min ago', status: 'active' },
  { member: 'David Park', role: 'Field Analyst', actions: 52, lastActive: '1 hr ago', status: 'active' },
  { member: 'Lisa Wong', role: 'Executive Viewer', actions: 12, lastActive: '3 hrs ago', status: 'away' },
  { member: 'Team Alpha', role: 'Field Operations', actions: 34, lastActive: '30 min ago', status: 'active' },
];

const AUDIT_HISTORY = [
  { id: 'a1', user: 'Sarah Chen', action: 'Qualified Highway 287 opportunity', target: 'Opportunities', time: '2 hrs ago', type: 'qualification' },
  { id: 'a2', user: 'Marcus Johnson', action: 'Verified bonding capacity', target: 'Weld School RFP', time: '4 hrs ago', type: 'verification' },
  { id: 'a3', user: 'David Park', action: 'Uploaded site visit photos', target: 'Xcel Substation', time: '5 hrs ago', type: 'document' },
  { id: 'a4', user: 'Lisa Wong', action: 'Exported monthly executive report', target: 'Reports', time: '6 hrs ago', type: 'export' },
  { id: 'a5', user: 'Sarah Chen', action: 'Added team member: David Park', target: 'Team', time: '8 hrs ago', type: 'admin' },
  { id: 'a6', user: 'System', action: 'Automated confidence recalculation', target: 'AI Engine', time: '1 hr ago', type: 'system' },
  { id: 'a7', user: 'Marcus Johnson', action: 'Watchlist alert acknowledged', target: 'Alerts', time: '10 hrs ago', type: 'alert' },
];

const CUSTOMER_HEALTH = [
  { customer: 'Summit Construction', tier: 'Enterprise', health: 95, usage: 'High', lastLogin: '5 min ago', oppsTracked: 45 },
  { customer: 'Front Range Dev', tier: 'Professional', health: 88, usage: 'High', lastLogin: '1 hr ago', oppsTracked: 23 },
  { customer: 'Pikes Peak Partners', tier: 'Professional', health: 76, usage: 'Medium', lastLogin: '3 hrs ago', oppsTracked: 12 },
  { customer: 'Colorado Builders Co', tier: 'Enterprise', health: 92, usage: 'High', lastLogin: '20 min ago', oppsTracked: 38 },
  { customer: 'Mile High Properties', tier: 'Starter', health: 62, usage: 'Low', lastLogin: '2 days ago', oppsTracked: 5 },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700',
    away: 'bg-amber-50 text-amber-700',
    offline: 'bg-ink-wash text-ink-tertiary',
  };
  return <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${colors[status] || colors.offline}`}>{status.toUpperCase()}</span>;
}

function HealthBar({ value }: { value: number }) {
  const color = value >= 90 ? 'bg-emerald-500' : value >= 75 ? 'bg-accent-indigo' : value >= 60 ? 'bg-amber-500' : 'bg-accent-crimson';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-ink-wash/30 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-[10px] font-bold ${value >= 90 ? 'text-emerald-600' : value >= 75 ? 'text-accent-indigo' : 'text-amber-600'}`}>{value}</span>
    </div>
  );
}

export default function EnterpriseOperationsV2() {
  return (
    <div className="space-y-6">
      {/* Organization Analytics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ORG_ANALYTICS.map((s) => (
          <div key={s.label} className="bg-surface border border-ink-wash rounded-xl p-4 text-center">
            <s.icon className="w-5 h-5 text-accent-indigo mx-auto mb-1" />
            <div className="text-xl font-bold text-ink-primary">{s.value}</div>
            <div className="text-[10px] text-ink-tertiary">{s.label}</div>
            <span className="text-[9px] text-emerald-600 font-medium">{s.trend}</span>
          </div>
        ))}
      </div>

      {/* Usage Reporting */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-accent-indigo" /> Usage Reporting
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {USAGE_REPORTING.map((u) => (
            <div key={u.metric} className="p-3 bg-canvas rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-ink-primary">{u.metric}</span>
                <span className="text-[10px] text-emerald-600 font-medium">{u.change}</span>
              </div>
              <span className="text-lg font-bold text-accent-indigo">{u.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Team Activity */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-accent-indigo" /> Team Activity
        </h4>
        <div className="space-y-2">
          {TEAM_ACTIVITY.map((tm) => (
            <div key={tm.member} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-accent-indigo/10 text-accent-indigo flex items-center justify-center text-[10px] font-bold">
                  {tm.member.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-ink-primary">{tm.member}</span>
                  <span className="text-[9px] text-ink-tertiary ml-1">{tm.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-accent-indigo font-medium">{tm.actions} actions</span>
                <StatusBadge status={tm.status} />
                <span className="text-[9px] text-ink-tertiary">{tm.lastActive}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit History */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent-indigo" /> Audit History
        </h4>
        <div className="space-y-2">
          {AUDIT_HISTORY.map((ah) => (
            <div key={ah.id} className="flex items-start gap-2 p-2.5 bg-canvas rounded-lg">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${ah.type === 'admin' ? 'bg-accent-crimson' : ah.type === 'system' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-ink-secondary">
                  <span className="font-medium text-ink-primary">{ah.user}</span> {ah.action}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-accent-indigo">{ah.target}</span>
                  <span className="text-[9px] text-ink-tertiary">{ah.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Health */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent-indigo" /> Customer Health Metrics
        </h4>
        <div className="space-y-3">
          {CUSTOMER_HEALTH.map((ch) => (
            <div key={ch.customer} className="p-3 bg-canvas rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-[11px] font-semibold text-ink-primary">{ch.customer}</span>
                  <span className="text-[9px] text-ink-tertiary ml-2">{ch.tier}</span>
                </div>
                <span className="text-[9px] text-ink-tertiary">{ch.lastLogin}</span>
              </div>
              <HealthBar value={ch.health} />
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[9px] text-ink-tertiary">Usage: <span className="font-medium text-ink-secondary">{ch.usage}</span></span>
                <span className="text-[9px] text-ink-tertiary">Opps: <span className="font-medium text-ink-secondary">{ch.oppsTracked}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
