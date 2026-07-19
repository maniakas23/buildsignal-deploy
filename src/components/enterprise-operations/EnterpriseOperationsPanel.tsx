import {
  Users, Shield, Bookmark, FileText, BarChart3,
  Activity, Clock, CheckCircle2, AlertTriangle,
  Eye, TrendingUp, Zap, Globe, Lock, History,
  ChevronRight, UserCircle, Layers, CreditCard
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-22: Enterprise Operations Panel
// Team workspaces, shared watchlists, internal notes, role-based
// permissions, audit history, executive dashboards, usage reporting.
// ═══════════════════════════════════════════════════════════════

const TEAM_MEMBERS = [
  { name: 'Sarah Chen', role: 'Admin', department: 'Strategy', lastActive: 'Now', savedOpps: 24, actions: 18 },
  { name: 'Marcus Johnson', role: 'Analyst', department: 'Acquisitions', lastActive: '5m ago', savedOpps: 19, actions: 12 },
  { name: 'Emily Rodriguez', role: 'Viewer', department: 'Operations', lastActive: '1h ago', savedOpps: 8, actions: 3 },
  { name: 'David Park', role: 'Analyst', department: 'Estimating', lastActive: '2h ago', savedOpps: 14, actions: 9 },
  { name: 'Lisa Thompson', role: 'Admin', department: 'Leadership', lastActive: '3h ago', savedOpps: 31, actions: 22 },
];

const SHARED_WATCHLISTS = [
  { name: 'Highway Corridors', items: 12, collaborators: 4, lastUpdated: '1h ago', trend: '+3' },
  { name: 'School Construction', items: 8, collaborators: 3, lastUpdated: '3h ago', trend: '+2' },
  { name: 'Utility Projects', items: 6, collaborators: 3, lastUpdated: '6h ago', trend: '+1' },
  { name: 'Commercial Development', items: 15, collaborators: 5, lastUpdated: '8h ago', trend: '+4' },
  { name: 'Public Contracts', items: 9, collaborators: 4, lastUpdated: '12h ago', trend: '+2' },
];

const AUDIT_LOG = [
  { action: 'Added member David Park', user: 'Sarah Chen', time: '2h ago', type: 'member' as const },
  { action: 'Updated "Highway Corridors" watchlist', user: 'Marcus Johnson', time: '3h ago', type: 'watchlist' as const },
  { action: 'Changed role: Emily → Viewer', user: 'Lisa Thompson', time: '5h ago', type: 'permission' as const },
  { action: 'Generated executive report', user: 'Lisa Thompson', time: '8h ago', type: 'report' as const },
  { action: 'Saved Weld County School RFP', user: 'Marcus Johnson', time: '10h ago', type: 'opp' as const },
  { action: 'Enabled SSO authentication', user: 'Sarah Chen', time: '1d ago', type: 'security' as const },
];

const PERMISSIONS_MATRIX = [
  { role: 'Admin', can: ['Full access', 'Manage team', 'View reports', 'Export data', 'Configure alerts', 'Manage billing'], count: 2 },
  { role: 'Analyst', can: ['View all opps', 'Save watchlists', 'Export data', 'View reports'], count: 2 },
  { role: 'Viewer', can: ['View assigned opps', 'Save watchlists', 'Add comments'], count: 1 },
];

const USAGE_METRICS = [
  { label: 'Active Users', value: '5/8', sub: ' seats used', trend: '+1 this week' },
  { label: 'Opportunities Saved', value: '96', sub: ' team total', trend: '+14 this week' },
  { label: 'Actions Taken', value: '64', sub: ' this month', trend: '+22 this month' },
  { label: 'Watchlists Shared', value: '5', sub: ' collaborative', trend: '+2 this week' },
  { label: 'Reports Generated', value: '12', sub: ' this month', trend: '+5 this month' },
  { label: 'Avg Session', value: '18m', sub: ' per user', trend: '+3m vs last week' },
];

function AuditIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    member: <Users className="w-3.5 h-3.5 text-accent-indigo" />,
    watchlist: <Bookmark className="w-3.5 h-3.5 text-emerald-600" />,
    permission: <Lock className="w-3.5 h-3.5 text-amber-500" />,
    report: <FileText className="w-3.5 h-3.5 text-accent-indigo" />,
    opp: <Zap className="w-3.5 h-3.5 text-accent-indigo" />,
    security: <Shield className="w-3.5 h-3.5 text-accent-crimson" />,
  };
  return <>{icons[type] || <Activity className="w-3.5 h-3.5 text-ink-tertiary" />}</>;
}

export default function EnterpriseOperationsPanel() {
  return (
    <div className="space-y-6">
      {/* Usage Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {USAGE_METRICS.map((m) => (
          <div key={m.label} className="bg-surface border border-ink-wash rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-ink-primary">{m.value}</div>
            <div className="text-[8px] text-ink-tertiary">{m.label}{m.sub}</div>
            <div className="text-[8px] text-emerald-600 font-medium">{m.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Members */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-ink-primary flex items-center gap-2"><Users className="w-4 h-4 text-accent-indigo" /> Team Members</h4>
            <span className="text-[10px] text-ink-tertiary">{TEAM_MEMBERS.length} active</span>
          </div>
          <div className="space-y-2">
            {TEAM_MEMBERS.map((m) => (
              <div key={m.name} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-accent-indigo/10 text-accent-indigo flex items-center justify-center text-[10px] font-bold">
                    {m.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-ink-primary">{m.name}</span>
                    <span className="text-[9px] text-ink-tertiary ml-1.5">{m.department}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${m.role === 'Admin' ? 'bg-accent-indigo/10 text-accent-indigo' : m.role === 'Analyst' ? 'bg-amber-50 text-amber-700' : 'bg-ink-wash text-ink-tertiary'}`}>
                    {m.role}
                  </span>
                  <span className="text-[9px] text-ink-tertiary">{m.lastActive}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shared Watchlists */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-ink-primary flex items-center gap-2"><Bookmark className="w-4 h-4 text-accent-indigo" /> Shared Watchlists</h4>
            <span className="text-[10px] text-ink-tertiary">{SHARED_WATCHLISTS.length} lists</span>
          </div>
          <div className="space-y-2">
            {SHARED_WATCHLISTS.map((w) => (
              <div key={w.name} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
                <div>
                  <span className="text-[11px] font-medium text-ink-primary">{w.name}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-ink-tertiary">{w.items} items</span>
                    <span className="text-[9px] text-ink-tertiary">{w.collaborators} collaborators</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-emerald-600 font-medium">{w.trend}</span>
                  <span className="text-[8px] text-ink-tertiary block">{w.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audit Log */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2"><History className="w-4 h-4 text-accent-indigo" /> Audit Log</h4>
          <div className="space-y-1.5">
            {AUDIT_LOG.map((a, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-canvas rounded-lg">
                <AuditIcon type={a.type} />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] text-ink-secondary">{a.action}</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[9px] text-accent-indigo block">{a.user}</span>
                  <span className="text-[8px] text-ink-tertiary">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-accent-indigo" /> Role Permissions</h4>
          <div className="space-y-3">
            {PERMISSIONS_MATRIX.map((pm) => (
              <div key={pm.role} className="p-3 bg-canvas rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-ink-primary">{pm.role}</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-accent-indigo/10 text-accent-indigo rounded-full font-bold">{pm.count} users</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {pm.can.map((c) => (
                    <span key={c} className="text-[8px] px-1.5 py-0.5 bg-ink-wash/50 text-ink-secondary rounded-full">{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
