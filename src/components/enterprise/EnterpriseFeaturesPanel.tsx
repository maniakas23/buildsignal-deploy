import { useState } from 'react';
import {
  Users, Shield, UserCog, Bookmark, FileText, History,
  Key, BarChart3, CheckCircle2, XCircle, Clock, Globe,
  ChevronDown, ChevronRight, Lock, Unlock, Eye, Pencil
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-18: Enterprise Features Panel
// Team collaboration, organization management, roles & permissions,
// shared watchlists, shared reports, audit history, API management,
// and usage reporting.
// ═══════════════════════════════════════════════════════════════

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'invited' | 'inactive';
  lastActive: string;
  searches: number;
  reports: number;
}

interface AuditEntry {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'view' | 'share';
}

interface APIKey {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
  calls: number;
  active: boolean;
}

const TEAM_MEMBERS: TeamMember[] = [
  { id: 'u1', name: 'Sarah Chen', email: 'sarah@acme.com', role: 'Admin', status: 'active', lastActive: '2 min ago', searches: 342, reports: 28 },
  { id: 'u2', name: 'Marcus Johnson', email: 'marcus@acme.com', role: 'Analyst', status: 'active', lastActive: '15 min ago', searches: 189, reports: 12 },
  { id: 'u3', name: 'Priya Patel', email: 'priya@acme.com', role: 'Viewer', status: 'active', lastActive: '1 hour ago', searches: 45, reports: 0 },
  { id: 'u4', name: 'David Kim', email: 'david@acme.com', role: 'Analyst', status: 'invited', lastActive: '-', searches: 0, reports: 0 },
  { id: 'u5', name: 'Lisa Rodriguez', email: 'lisa@acme.com', role: 'Viewer', status: 'inactive', lastActive: '3 days ago', searches: 78, reports: 3 },
];

const ROLE_PERMISSIONS = [
  { role: 'Admin', permissions: ['Full access', 'User management', 'Billing', 'API keys', 'Reports', 'Watchlists', 'Alerts', 'Settings'] },
  { role: 'Analyst', permissions: ['Search', 'Reports', 'Watchlists', 'Alerts', 'Export', 'Maps'], restricted: ['User management', 'Billing', 'API keys', 'Settings'] },
  { role: 'Viewer', permissions: ['View reports', 'View watchlists', 'View maps'], restricted: ['Search', 'Create reports', 'Export', 'Alerts', 'User management', 'Billing', 'API keys', 'Settings'] },
];

const AUDIT_LOG: AuditEntry[] = [
  { id: 'a1', user: 'Sarah Chen', action: 'Created watchlist', target: 'Highway 287 Corridor', timestamp: '2026-07-20 09:15', type: 'create' },
  { id: 'a2', user: 'Marcus Johnson', action: 'Generated report', target: 'Weekly Opportunity Summary', timestamp: '2026-07-20 08:42', type: 'view' },
  { id: 'a3', user: 'Sarah Chen', action: 'Invited user', target: 'David Kim (Analyst)', timestamp: '2026-07-19 16:30', type: 'create' },
  { id: 'a4', user: 'Priya Patel', action: 'Viewed opportunity', target: 'Weld County School RFP', timestamp: '2026-07-19 14:22', type: 'view' },
  { id: 'a5', user: 'Marcus Johnson', action: 'Updated alert rule', target: 'Permit threshold: 5 → 3', timestamp: '2026-07-19 11:08', type: 'update' },
  { id: 'a6', user: 'Sarah Chen', action: 'Shared report', target: 'Q3 Growth Analysis with team', timestamp: '2026-07-18 17:45', type: 'share' },
  { id: 'a7', user: 'System', action: 'API key rotated', target: 'Production Key', timestamp: '2026-07-18 02:00', type: 'update' },
  { id: 'a8', user: 'Lisa Rodriguez', action: 'Deleted watchlist', target: 'Old Denver Projects', timestamp: '2026-07-17 10:30', type: 'delete' },
];

const API_KEYS: APIKey[] = [
  { id: 'k1', name: 'Production', prefix: 'bsk_prod_••••8f3a', created: '2026-06-01', lastUsed: '2 min ago', calls: 48293, active: true },
  { id: 'k2', name: 'Staging', prefix: 'bsk_stag_••••4b21', created: '2026-06-15', lastUsed: '1 hour ago', calls: 8921, active: true },
  { id: 'k3', name: 'Integration', prefix: 'bsk_int_••••9c7e', created: '2026-07-01', lastUsed: '3 hours ago', calls: 3456, active: true },
  { id: 'k4', name: 'Deprecated', prefix: 'bsk_old_••••2d5f', created: '2026-04-01', lastUsed: '14 days ago', calls: 12034, active: false },
];

const SHARED_WATCHLISTS = [
  { name: 'Highway 287 Corridor', owner: 'Sarah Chen', members: 4, items: 12, updated: '2 hours ago' },
  { name: 'Weld County Schools', owner: 'Marcus Johnson', members: 3, items: 8, updated: '1 day ago' },
  { name: 'Denver Metro Growth', owner: 'Sarah Chen', members: 5, items: 23, updated: '3 hours ago' },
  { name: 'Utility Projects 2026', owner: 'Priya Patel', members: 2, items: 6, updated: '2 days ago' },
];

const SHARED_REPORTS = [
  { name: 'Q3 Growth Analysis', author: 'Sarah Chen', views: 34, shared: 'Jul 18' },
  { name: 'Weekly Opportunity Summary', author: 'Marcus Johnson', views: 28, shared: 'Jul 20' },
  { name: 'County Coverage Review', author: 'Sarah Chen', views: 19, shared: 'Jul 15' },
  { name: 'Competitor Activity Report', author: 'Marcus Johnson', views: 12, shared: 'Jul 12' },
];

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-ink-wash rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-wash bg-canvas/50">
        <Icon className="w-4 h-4 text-accent-indigo" />
        <h4 className="text-sm font-semibold text-ink-primary">{title}</h4>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function EnterpriseFeaturesPanel() {
  const [subTab, setSubTab] = useState<'team' | 'roles' | 'audit' | 'api'>('team');
  const [expandedRole, setExpandedRole] = useState<string | null>('Admin');

  const activeMembers = TEAM_MEMBERS.filter((m) => m.status === 'active').length;
  const totalAPICalls = API_KEYS.reduce((s, k) => s + k.calls, 0);

  return (
    <div className="space-y-5">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Team Members', value: TEAM_MEMBERS.length.toString(), active: `${activeMembers} active`, icon: Users },
          { label: 'Shared Watchlists', value: SHARED_WATCHLISTS.length.toString(), active: `${SHARED_WATCHLISTS.reduce((s, w) => s + w.members, 0)} collaborators`, icon: Bookmark },
          { label: 'API Calls (30d)', value: totalAPICalls.toLocaleString(), active: `${API_KEYS.filter((k) => k.active).length} active keys`, icon: Key },
          { label: 'Audit Events', value: AUDIT_LOG.length.toString(), active: 'Last 7 days', icon: History },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-surface border border-ink-wash rounded-xl p-4">
            <kpi.icon className="w-4 h-4 text-accent-indigo mb-2" />
            <div className="text-xl font-bold text-ink-primary">{kpi.value}</div>
            <div className="text-[10px] text-ink-tertiary mt-0.5">{kpi.label}</div>
            <div className="text-[9px] text-emerald-600 font-medium mt-0.5">{kpi.active}</div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 p-1 bg-canvas border border-ink-wash rounded-xl w-fit">
        {([
          { id: 'team' as const, label: 'Team', icon: Users },
          { id: 'roles' as const, label: 'Roles', icon: Shield },
          { id: 'audit' as const, label: 'Audit Log', icon: History },
          { id: 'api' as const, label: 'API Keys', icon: Key },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              subTab === t.id ? 'bg-accent-indigo text-white' : 'text-ink-secondary hover:bg-surface'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Team Members */}
      {subTab === 'team' && (
        <div className="space-y-4">
          <Section title="Team Members" icon={Users}>
            <div className="space-y-2">
              {TEAM_MEMBERS.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 border border-ink-wash rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-indigo/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-accent-indigo">{member.name.split(' ').map((n) => n[0]).join('')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-ink-primary">{member.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        member.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                        member.status === 'invited' ? 'bg-amber-50 text-amber-700' :
                        'bg-ink-wash/50 text-ink-tertiary'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-ink-tertiary">{member.email}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-[10px] text-ink-tertiary">
                    <span className="px-2 py-0.5 bg-canvas rounded-full">{member.role}</span>
                    <span>{member.searches} searches</span>
                    <span>{member.reports} reports</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {member.lastActive}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Section title="Shared Watchlists" icon={Bookmark}>
              <div className="space-y-2">
                {SHARED_WATCHLISTS.map((wl) => (
                  <div key={wl.name} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
                    <div>
                      <span className="text-[11px] font-medium text-ink-primary">{wl.name}</span>
                      <div className="text-[9px] text-ink-tertiary mt-0.5">by {wl.owner} · {wl.items} items</div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-ink-tertiary">
                      <Users className="w-3 h-3" /> {wl.members}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Shared Reports" icon={FileText}>
              <div className="space-y-2">
                {SHARED_REPORTS.map((r) => (
                  <div key={r.name} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
                    <div>
                      <span className="text-[11px] font-medium text-ink-primary">{r.name}</span>
                      <div className="text-[9px] text-ink-tertiary mt-0.5">by {r.author} · {r.shared}</div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-ink-tertiary">
                      <Eye className="w-3 h-3" /> {r.views}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      )}

      {/* Roles & Permissions */}
      {subTab === 'roles' && (
        <Section title="Role Permissions" icon={Shield}>
          <div className="space-y-2">
            {ROLE_PERMISSIONS.map((role) => (
              <div key={role.role} className="border border-ink-wash rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedRole(expandedRole === role.role ? null : role.role)}
                  className="w-full flex items-center justify-between p-3 hover:bg-canvas/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <UserCog className="w-4 h-4 text-accent-indigo" />
                    <span className="text-sm font-semibold text-ink-primary">{role.role}</span>
                    <span className="text-[10px] text-ink-tertiary">({role.permissions.length} permissions)</span>
                  </div>
                  {expandedRole === role.role ? <ChevronDown className="w-4 h-4 text-ink-tertiary" /> : <ChevronRight className="w-4 h-4 text-ink-tertiary" />}
                </button>
                {expandedRole === role.role && (
                  <div className="px-3 pb-3 space-y-2">
                    <div>
                      <p className="text-[10px] font-semibold text-emerald-600 mb-1 uppercase tracking-wider">Granted</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((p) => (
                          <span key={p} className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                            <CheckCircle2 className="w-2.5 h-2.5" /> {p}
                          </span>
                        ))}
                      </div>
                    </div>
                    {role.restricted && (
                      <div>
                        <p className="text-[10px] font-semibold text-ink-tertiary mb-1 uppercase tracking-wider">Restricted</p>
                        <div className="flex flex-wrap gap-1">
                          {role.restricted.map((r) => (
                            <span key={r} className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-ink-wash/40 text-ink-tertiary rounded-full">
                              <XCircle className="w-2.5 h-2.5" /> {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Audit Log */}
      {subTab === 'audit' && (
        <Section title="Audit History" icon={History}>
          <div className="space-y-1.5">
            {AUDIT_LOG.map((entry) => {
              const typeColors: Record<string, string> = {
                create: 'text-emerald-600',
                update: 'text-blue-600',
                delete: 'text-accent-crimson',
                view: 'text-ink-tertiary',
                share: 'text-violet-600',
              };
              return (
                <div key={entry.id} className="flex items-center gap-3 p-2.5 bg-canvas rounded-lg">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    entry.type === 'delete' ? 'bg-accent-crimson/10' :
                    entry.type === 'create' ? 'bg-emerald-50' :
                    entry.type === 'update' ? 'bg-blue-50' :
                    entry.type === 'share' ? 'bg-violet-50' :
                    'bg-ink-wash/30'
                  }`}>
                    {entry.type === 'create' && <CheckCircle2 className={`w-3 h-3 ${typeColors[entry.type]}`} />}
                    {entry.type === 'update' && <Pencil className={`w-3 h-3 ${typeColors[entry.type]}`} />}
                    {entry.type === 'delete' && <XCircle className={`w-3 h-3 ${typeColors[entry.type]}`} />}
                    {entry.type === 'view' && <Eye className={`w-3 h-3 ${typeColors[entry.type]}`} />}
                    {entry.type === 'share' && <Globe className={`w-3 h-3 ${typeColors[entry.type]}`} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-ink-primary">{entry.action}</span>
                      <span className={`text-[9px] font-bold px-1 py-0.5 rounded-full uppercase ${
                        entry.type === 'delete' ? 'bg-accent-crimson/10 text-accent-crimson' :
                        entry.type === 'create' ? 'bg-emerald-50 text-emerald-700' :
                        entry.type === 'update' ? 'bg-blue-50 text-blue-700' :
                        entry.type === 'share' ? 'bg-violet-50 text-violet-700' :
                        'bg-ink-wash/30 text-ink-tertiary'
                      }`}>
                        {entry.type}
                      </span>
                    </div>
                    <span className="text-[10px] text-ink-tertiary">{entry.target}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[10px] font-medium text-ink-secondary">{entry.user}</span>
                    <div className="text-[9px] text-ink-tertiary flex items-center gap-0.5 justify-end">
                      <Clock className="w-2.5 h-2.5" /> {entry.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* API Keys */}
      {subTab === 'api' && (
        <Section title="API Key Management" icon={Key}>
          <div className="space-y-2">
            {API_KEYS.map((key) => (
              <div key={key.id} className={`flex items-center gap-3 p-3 border rounded-lg ${key.active ? 'border-ink-wash' : 'border-ink-wash/50 opacity-60'}`}>
                <div className="flex-shrink-0">
                  {key.active ? <Unlock className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4 text-ink-tertiary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-ink-primary">{key.name}</span>
                    {key.active ? (
                      <span className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-medium">Active</span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 bg-ink-wash/50 text-ink-tertiary rounded-full font-medium">Revoked</span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-ink-tertiary">{key.prefix}</span>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-[10px] text-ink-tertiary">
                  <span>{key.calls.toLocaleString()} calls</span>
                  <span>Last: {key.lastUsed}</span>
                  <span>Created: {key.created}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
