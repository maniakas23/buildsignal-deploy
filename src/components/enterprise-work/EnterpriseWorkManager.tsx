import { useState } from 'react';
import {
  Users, CheckCircle2, Clock, AlertTriangle, ChevronDown, ChevronUp,
  Target, Zap, Shield, FileText, MessageSquare, Activity,
  UserCircle, Lock, Unlock, Eye, Edit3, Trash2, Plus,
  BarChart3, Globe, Bookmark, Bell, Star, Hash,
  Layers, TrendingUp, ArrowRight, FolderOpen
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-24: Enterprise Work Management
// Assignments, task management, shared workspaces, executive
// dashboards, approvals, internal notes, activity history,
// role-based permissions.
// ═══════════════════════════════════════════════════════════════

const TEAM_MEMBERS = [
  { id: 'tm1', name: 'Sarah Chen', role: 'Lead Analyst', permissions: ['view-all', 'edit-opps', 'manage-team', 'export-reports'], activeTasks: 4, completedThisWeek: 7, status: 'active' },
  { id: 'tm2', name: 'Marcus Johnson', role: 'Senior Researcher', permissions: ['view-all', 'edit-opps', 'create-notes'], activeTasks: 3, completedThisWeek: 5, status: 'active' },
  { id: 'tm3', name: 'David Park', role: 'Field Analyst', permissions: ['view-assigned', 'edit-own', 'create-notes'], activeTasks: 5, completedThisWeek: 4, status: 'active' },
  { id: 'tm4', name: 'Lisa Wong', role: 'Executive Viewer', permissions: ['view-all', 'export-reports'], activeTasks: 1, completedThisWeek: 2, status: 'away' },
  { id: 'tm5', name: 'Team Alpha', role: 'Field Operations', permissions: ['view-assigned', 'edit-own', 'upload-docs'], activeTasks: 6, completedThisWeek: 3, status: 'active' },
];

const ROLE_PERMISSIONS = [
  { role: 'Admin', description: 'Full platform access', permissions: ['View all data', 'Edit everything', 'Manage team', 'Configure alerts', 'Export reports', 'API access', 'Billing management'] },
  { role: 'Lead Analyst', description: 'Full analytical access', permissions: ['View all data', 'Edit opportunities', 'Manage team assignments', 'Create reports', 'Export data', 'Configure personal alerts'] },
  { role: 'Senior Researcher', description: 'Research and analysis', permissions: ['View all data', 'Edit opportunities', 'Create notes', 'Export limited reports'] },
  { role: 'Field Analyst', description: 'Assigned work only', permissions: ['View assigned opportunities', 'Edit own work', 'Create notes', 'Upload documents'] },
  { role: 'Executive Viewer', description: 'Read-only dashboard', permissions: ['View all data', 'Export executive reports', 'View dashboards'] },
];

const SHARED_WORKSPACES = [
  { id: 'ws1', name: 'Highway 287 Corridor', members: 4, tasks: 8, documents: 12, lastActivity: '2 hrs ago', alerts: 3 },
  { id: 'ws2', name: 'Weld County Projects', members: 3, tasks: 5, documents: 7, lastActivity: '4 hrs ago', alerts: 1 },
  { id: 'ws3', name: 'Denver Metro Monitor', members: 5, tasks: 12, documents: 18, lastActivity: '1 hr ago', alerts: 5 },
  { id: 'ws4', name: 'Q3 2026 Pipeline', members: 6, tasks: 15, documents: 9, lastActivity: '30 min ago', alerts: 2 },
];

const PENDING_APPROVALS = [
  { id: 'pa1', type: 'Opportunity Qualification', item: 'Highway 287 — Upgrade to Active', requestedBy: 'Sarah Chen', date: 'Jul 20', priority: 'high' },
  { id: 'pa2', type: 'Budget Allocation', item: 'Site visit budget — $2,400', requestedBy: 'Marcus Johnson', date: 'Jul 19', priority: 'medium' },
  { id: 'pa3', type: 'Team Assignment', item: 'Add David Park to Denver Metro', requestedBy: 'Sarah Chen', date: 'Jul 18', priority: 'low' },
];

const ACTIVITY_HISTORY = [
  { id: 'ah1', user: 'Sarah Chen', action: 'Qualified Highway 287 opportunity', target: 'Highway 287 Corridor', time: '2 hrs ago' },
  { id: 'ah2', user: 'Marcus Johnson', action: 'Verified bonding capacity', target: 'Weld School RFP', time: '4 hrs ago' },
  { id: 'ah3', user: 'David Park', action: 'Uploaded site visit photos', target: 'Xcel Substation', time: '5 hrs ago' },
  { id: 'ah4', user: 'Lisa Wong', action: 'Exported monthly report', target: 'Executive Dashboard', time: '6 hrs ago' },
  { id: 'ah5', user: 'Sarah Chen', action: 'Created shared workspace', target: 'Q3 2026 Pipeline', time: '8 hrs ago' },
  { id: 'ah6', user: 'Marcus Johnson', action: 'Added note to timeline', target: 'Highway 287 Corridor', time: '10 hrs ago' },
  { id: 'ah7', user: 'Team Alpha', action: 'Completed site survey', target: 'Denver I-25', time: '12 hrs ago' },
];

function PriorityBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    high: 'bg-accent-crimson/10 text-accent-crimson',
    medium: 'bg-amber-50 text-amber-700',
    low: 'bg-blue-50 text-blue-700',
  };
  return <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${colors[level] || colors.low}`}>{level.toUpperCase()}</span>;
}

export default function EnterpriseWorkManager() {
  const [tab, setTab] = useState<'team' | 'workspaces' | 'approvals' | 'activity' | 'permissions'>('team');
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const tabs = [
    { id: 'team' as const, label: 'Team', icon: Users },
    { id: 'workspaces' as const, label: 'Workspaces', icon: FolderOpen },
    { id: 'approvals' as const, label: 'Approvals', icon: CheckCircle2 },
    { id: 'activity' as const, label: 'Activity', icon: Activity },
    { id: 'permissions' as const, label: 'Permissions', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-canvas border border-ink-wash rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              tab === t.id ? 'bg-accent-indigo text-white' : 'text-ink-secondary hover:bg-surface'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Team ── */}
      {tab === 'team' && (
        <div className="space-y-3">
          {TEAM_MEMBERS.map((tm) => {
            const expanded = expandedMember === tm.id;
            return (
              <div key={tm.id} className="bg-surface border border-ink-wash rounded-2xl overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${tm.status === 'active' ? 'bg-accent-indigo text-white' : 'bg-ink-wash text-ink-tertiary'}`}>
                        {tm.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <span className="text-[12px] font-semibold text-ink-primary">{tm.name}</span>
                        <span className="text-[9px] text-ink-tertiary ml-2">{tm.role}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${tm.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {tm.status}
                      </span>
                      <button
                        onClick={() => setExpandedMember(expanded ? null : tm.id)}
                        className="text-[10px] text-ink-tertiary hover:text-accent-indigo"
                      >
                        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-ink-tertiary">{tm.activeTasks} active tasks</span>
                    <span className="text-[10px] text-emerald-600">{tm.completedThisWeek} this week</span>
                    <span className="text-[10px] text-ink-tertiary">{tm.permissions.length} permissions</span>
                  </div>
                </div>
                {expanded && (
                  <div className="border-t border-ink-wash px-4 py-3">
                    <p className="text-[10px] font-semibold text-ink-secondary mb-2">Permissions</p>
                    <div className="flex flex-wrap gap-1">
                      {tm.permissions.map((p) => (
                        <span key={p} className="text-[9px] px-2 py-0.5 bg-accent-indigo/10 text-accent-indigo rounded-full">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Workspaces ── */}
      {tab === 'workspaces' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SHARED_WORKSPACES.map((ws) => (
            <div key={ws.id} className="bg-surface border border-ink-wash rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-ink-primary">{ws.name}</h4>
                {ws.alerts > 0 && (
                  <span className="text-[9px] font-bold bg-accent-crimson/10 text-accent-crimson px-1.5 py-0.5 rounded-full">{ws.alerts} alerts</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="p-2 bg-canvas rounded-lg text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="w-3 h-3 text-accent-indigo" />
                    <span className="text-sm font-bold text-ink-primary">{ws.members}</span>
                  </div>
                  <div className="text-[8px] text-ink-tertiary">Members</div>
                </div>
                <div className="p-2 bg-canvas rounded-lg text-center">
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-accent-indigo" />
                    <span className="text-sm font-bold text-ink-primary">{ws.tasks}</span>
                  </div>
                  <div className="text-[8px] text-ink-tertiary">Tasks</div>
                </div>
                <div className="p-2 bg-canvas rounded-lg text-center">
                  <div className="flex items-center justify-center gap-1">
                    <FileText className="w-3 h-3 text-accent-indigo" />
                    <span className="text-sm font-bold text-ink-primary">{ws.documents}</span>
                  </div>
                  <div className="text-[8px] text-ink-tertiary">Docs</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-ink-tertiary">Last activity: {ws.lastActivity}</span>
                <ArrowRight className="w-3.5 h-3.5 text-ink-tertiary" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Approvals ── */}
      {tab === 'approvals' && (
        <div className="space-y-3">
          {PENDING_APPROVALS.map((pa) => (
            <div key={pa.id} className="bg-surface border border-ink-wash rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-accent-indigo px-1.5 py-0.5 rounded-full bg-accent-indigo/10">{pa.type}</span>
                <PriorityBadge level={pa.priority} />
              </div>
              <p className="text-[12px] font-semibold text-ink-primary mb-1">{pa.item}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-ink-tertiary">By: {pa.requestedBy}</span>
                  <span className="text-[9px] text-ink-tertiary">{pa.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-[10px] px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-medium">Approve</button>
                  <button className="text-[10px] px-2 py-1 bg-accent-crimson/10 text-accent-crimson rounded-lg font-medium">Decline</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Activity ── */}
      {tab === 'activity' && (
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <div className="space-y-3">
            {ACTIVITY_HISTORY.map((ah) => (
              <div key={ah.id} className="flex items-start gap-3 p-2.5 bg-canvas rounded-lg">
                <div className="w-7 h-7 rounded-full bg-accent-indigo/10 text-accent-indigo flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                  {ah.user.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-ink-secondary">
                    <span className="font-semibold text-ink-primary">{ah.user}</span> {ah.action}
                  </p>
                  <p className="text-[10px] text-accent-indigo">{ah.target}</p>
                  <span className="text-[9px] text-ink-tertiary">{ah.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Permissions ── */}
      {tab === 'permissions' && (
        <div className="space-y-4">
          {ROLE_PERMISSIONS.map((rp) => (
            <div key={rp.role} className="bg-surface border border-ink-wash rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-accent-indigo" />
                <h4 className="text-sm font-bold text-ink-primary">{rp.role}</h4>
              </div>
              <p className="text-[10px] text-ink-tertiary mb-3">{rp.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {rp.permissions.map((p) => (
                  <span key={p} className="text-[9px] px-2 py-0.5 bg-accent-indigo/10 text-accent-indigo rounded-full">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
