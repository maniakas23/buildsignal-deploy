import { useState } from 'react';
import {
  Users, MessageSquare, FileText, Bookmark, Clock,
  CheckCircle2, Globe, Share2, UserCircle, ArrowRight,
  FolderOpen, Bell, Eye, Send, Heart
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-19: Enterprise Collaboration
// Shared workspaces, team comments, report sharing, activity history.
// ═══════════════════════════════════════════════════════════════

interface Workspace {
  id: string;
  name: string;
  description: string;
  members: number;
  items: number;
  lastActive: string;
  icon: React.ElementType;
}

interface Comment {
  id: string;
  author: string;
  initials: string;
  text: string;
  timestamp: string;
  opportunity: string;
  likes: number;
}

interface SharedItem {
  id: string;
  title: string;
  type: 'report' | 'watchlist' | 'opportunity';
  sharedBy: string;
  sharedWith: string;
  date: string;
  views: number;
}

interface ActivityEntry {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

const WORKSPACES: Workspace[] = [
  { id: 'ws1', name: 'Colorado Front Range', description: 'All opportunities and reports across Colorado Front Range counties', members: 5, items: 34, lastActive: '10 min ago', icon: Globe },
  { id: 'ws2', name: 'Highway Corridor Projects', description: 'Focused tracking of highway expansion and associated development', members: 4, items: 18, lastActive: '1 hour ago', icon: FolderOpen },
  { id: 'ws3', name: 'Public Contracts', description: 'School, municipal, and government construction RFPs', members: 3, items: 12, lastActive: '3 hours ago', icon: FileText },
  { id: 'ws4', name: 'Competitive Intelligence', description: 'Competitor permit tracking and market positioning', members: 3, items: 9, lastActive: '5 hours ago', icon: Eye },
];

const COMMENTS: Comment[] = [
  { id: 'c1', author: 'Sarah Chen', initials: 'SC', text: 'The Highway 287 corridor is heating up faster than expected. I spoke with the county planner yesterday — they are moving the zoning effective date up to August 15.', timestamp: '2 hours ago', opportunity: 'Highway 287 Expansion', likes: 3 },
  { id: 'c2', author: 'Marcus Johnson', initials: 'MJ', text: 'Great intel Sarah. Should we schedule a joint site visit this week? I can pull the parcel maps and ownership records beforehand.', timestamp: '1 hour ago', opportunity: 'Highway 287 Expansion', likes: 2 },
  { id: 'c3', author: 'Priya Patel', initials: 'PP', text: 'Weld County school RFP deadline reminder — pre-qualification closes in 12 days. I have the full requirements doc if anyone needs it.', timestamp: '45 min ago', opportunity: 'Weld County School Campus', likes: 4 },
  { id: 'c4', author: 'Sarah Chen', initials: 'SC', text: 'Please share the requirements doc Priya. Also, should we consider a JV partner for this? Bonding capacity might be tight at $48M.', timestamp: '30 min ago', opportunity: 'Weld County School Campus', likes: 1 },
  { id: 'c5', author: 'Marcus Johnson', initials: 'MJ', text: 'The Greeley hotspot is worth watching closely. I am seeing permit velocity 3x normal in that corridor. Something big is coming.', timestamp: '15 min ago', opportunity: 'Greeley Highway 34 Corridor', likes: 2 },
];

const SHARED_ITEMS: SharedItem[] = [
  { id: 's1', title: 'Q3 Growth Analysis Report', type: 'report', sharedBy: 'Sarah Chen', sharedWith: 'Team (5)', date: 'Jul 18', views: 34 },
  { id: 's2', title: 'Highway 287 Corridor Watchlist', type: 'watchlist', sharedBy: 'Marcus Johnson', sharedWith: 'Team (5)', date: 'Jul 19', views: 12 },
  { id: 's3', title: 'Weld County School RFP Opportunity', type: 'opportunity', sharedBy: 'Priya Patel', sharedWith: 'Analysts (2)', date: 'Jul 17', views: 8 },
  { id: 's4', title: 'Weekly Opportunity Summary', type: 'report', sharedBy: 'Sarah Chen', sharedWith: 'Team (5)', date: 'Jul 20', views: 28 },
];

const ACTIVITY: ActivityEntry[] = [
  { id: 'a1', user: 'Sarah Chen', action: 'shared a report with the team', target: 'Q3 Growth Analysis', time: '10 min ago' },
  { id: 'a2', user: 'Marcus Johnson', action: 'commented on', target: 'Highway 287 Expansion', time: '15 min ago' },
  { id: 'a3', user: 'Priya Patel', action: 'shared an opportunity with', target: 'Analysts', time: '30 min ago' },
  { id: 'a4', user: 'Sarah Chen', action: 'created a workspace', target: 'Colorado Front Range', time: '1 hour ago' },
  { id: 'a5', user: 'Marcus Johnson', action: 'added 3 items to', target: 'Highway Corridor Projects', time: '2 hours ago' },
  { id: 'a6', user: 'David Kim', action: 'joined the team as Analyst', target: '', time: '3 hours ago' },
  { id: 'a7', user: 'Priya Patel', action: 'shared a watchlist with', target: 'Team', time: '4 hours ago' },
  { id: 'a8', user: 'Sarah Chen', action: 'updated alert threshold on', target: 'Permit Monitor', time: '5 hours ago' },
];

const typeIcons: Record<string, React.ElementType> = {
  report: FileText,
  watchlist: Bookmark,
  opportunity: Bell,
};

const typeColors: Record<string, string> = {
  report: 'bg-blue-50 text-blue-700',
  watchlist: 'bg-amber-50 text-amber-700',
  opportunity: 'bg-emerald-50 text-emerald-700',
};

export default function EnterpriseCollaboration() {
  const [tab, setTab] = useState<'workspaces' | 'comments' | 'shared' | 'activity'>('workspaces');

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Workspaces', value: WORKSPACES.length.toString(), icon: FolderOpen },
          { label: 'Team Comments', value: COMMENTS.length.toString(), icon: MessageSquare },
          { label: 'Shared Items', value: SHARED_ITEMS.length.toString(), icon: Share2 },
          { label: 'Activities', value: ACTIVITY.length.toString(), icon: Clock },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-surface border border-ink-wash rounded-xl p-4 text-center">
            <kpi.icon className="w-4 h-4 text-accent-indigo mx-auto mb-1" />
            <div className="text-xl font-bold text-ink-primary">{kpi.value}</div>
            <div className="text-[10px] text-ink-tertiary">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-canvas border border-ink-wash rounded-xl w-fit">
        {([
          { id: 'workspaces' as const, label: 'Workspaces', icon: FolderOpen },
          { id: 'comments' as const, label: 'Comments', icon: MessageSquare },
          { id: 'shared' as const, label: 'Shared', icon: Share2 },
          { id: 'activity' as const, label: 'Activity', icon: Clock },
        ]).map((t) => (
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

      {/* Workspaces */}
      {tab === 'workspaces' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {WORKSPACES.map((ws) => (
            <div key={ws.id} className="bg-surface border border-ink-wash rounded-xl p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center">
                  <ws.icon className="w-4 h-4 text-accent-indigo" />
                </div>
                <div>
                  <h4 className="text-[12px] font-semibold text-ink-primary">{ws.name}</h4>
                  <p className="text-[9px] text-ink-tertiary">{ws.lastActive}</p>
                </div>
              </div>
              <p className="text-[11px] text-ink-secondary leading-relaxed mb-3">{ws.description}</p>
              <div className="flex items-center gap-3 text-[10px] text-ink-tertiary">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {ws.members}</span>
                <span className="flex items-center gap-1"><Bookmark className="w-3 h-3" /> {ws.items} items</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comments */}
      {tab === 'comments' && (
        <div className="space-y-3">
          {COMMENTS.map((c) => (
            <div key={c.id} className="bg-surface border border-ink-wash rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-indigo/10 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-accent-indigo">{c.initials}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-semibold text-ink-primary">{c.author}</span>
                    <span className="text-[9px] text-ink-tertiary">{c.timestamp}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 bg-canvas rounded-full text-ink-tertiary font-medium">
                    on {c.opportunity}
                  </span>
                  <p className="text-[11px] text-ink-secondary leading-relaxed mt-2">{c.text}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button className="flex items-center gap-1 text-[10px] text-ink-tertiary hover:text-accent-crimson transition-colors">
                      <Heart className="w-3 h-3" /> {c.likes}
                    </button>
                    <button className="flex items-center gap-1 text-[10px] text-accent-indigo hover:text-accent-indigo/80 transition-colors">
                      <Send className="w-3 h-3" /> Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shared Items */}
      {tab === 'shared' && (
        <div className="space-y-2">
          {SHARED_ITEMS.map((item) => {
            const Icon = typeIcons[item.type];
            return (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-surface border border-ink-wash rounded-xl">
                <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${typeColors[item.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-ink-primary truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] px-1.5 py-0.5 bg-canvas rounded-full text-ink-tertiary capitalize font-medium">
                      {item.type}
                    </span>
                    <span className="text-[10px] text-ink-tertiary">by {item.sharedBy}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] text-ink-tertiary">{item.sharedWith}</span>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <Eye className="w-2.5 h-2.5 text-ink-tertiary" />
                    <span className="text-[9px] text-ink-tertiary">{item.views}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Activity */}
      {tab === 'activity' && (
        <div className="space-y-1.5">
          {ACTIVITY.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3 p-2.5 bg-canvas rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-indigo/10 flex items-center justify-center">
                <UserCircle className="w-3 h-3 text-accent-indigo" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-ink-secondary">
                  <span className="font-medium text-ink-primary">{entry.user}</span>{' '}
                  {entry.action}
                  {entry.target && <> <span className="font-medium text-accent-indigo">{entry.target}</span></>}
                </span>
              </div>
              <span className="text-[9px] text-ink-tertiary flex-shrink-0">{entry.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
