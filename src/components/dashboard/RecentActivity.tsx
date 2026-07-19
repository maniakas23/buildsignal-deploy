import { useState } from 'react';
import {
  Search, Bell, FileText, MapPin, Star, TrendingUp,
  Clock, Check, AlertTriangle, Zap, ChevronRight
} from 'lucide-react';

interface ActivityItem {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  type: 'search' | 'alert' | 'report' | 'opportunity' | 'system' | 'milestone';
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    icon: TrendingUp,
    iconColor: 'text-accent-teal',
    title: 'Apex Town Center Phase 2',
    description: 'Confidence increased to 92% — 3 new signals detected',
    time: '2m ago',
    type: 'opportunity',
  },
  {
    id: '2',
    icon: Search,
    iconColor: 'text-accent-indigo',
    title: 'Search performed',
    description: 'Query: "Wake County mixed-use development"',
    time: '15m ago',
    type: 'search',
  },
  {
    id: '3',
    icon: Bell,
    iconColor: 'text-accent-amber',
    title: 'Alert triggered',
    description: 'New high-confidence opportunity in Morrisville',
    time: '32m ago',
    type: 'alert',
  },
  {
    id: '4',
    icon: FileText,
    iconColor: 'text-accent-violet',
    title: 'Report generated',
    description: 'Weekly Intelligence Brief — 12 pages',
    time: '1h ago',
    type: 'report',
  },
  {
    id: '5',
    icon: MapPin,
    iconColor: 'text-accent-indigo',
    title: 'County added',
    description: 'Orange County, NC added to monitoring',
    time: '2h ago',
    type: 'milestone',
  },
  {
    id: '6',
    icon: Zap,
    iconColor: 'text-accent-teal',
    title: 'Data refresh complete',
    description: '2,847 signals updated across 3,100+ counties',
    time: '3h ago',
    type: 'system',
  },
  {
    id: '7',
    icon: Star,
    iconColor: 'text-accent-amber',
    title: 'Watchlist updated',
    description: 'Added Duke Energy Substation to "Utility Projects"',
    time: '4h ago',
    type: 'milestone',
  },
  {
    id: '8',
    icon: AlertTriangle,
    iconColor: 'text-accent-amber',
    title: 'Signal decay detected',
    description: 'Cary Medical Center — confidence dropped to 62%',
    time: '5h ago',
    type: 'opportunity',
  },
];

const TYPE_FILTERS: { label: string; value: ActivityItem['type'] | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Opportunities', value: 'opportunity' },
  { label: 'Alerts', value: 'alert' },
  { label: 'System', value: 'system' },
];

export default function RecentActivity() {
  const [filter, setFilter] = useState<ActivityItem['type'] | 'all'>('all');
  const [expanded, setExpanded] = useState(false);

  const filtered = filter === 'all' ? ACTIVITIES : ACTIVITIES.filter((a) => a.type === filter);
  const displayItems = expanded ? filtered : filtered.slice(0, 5);

  return (
    <div className="bg-surface border border-ink-wash rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ink-wash/50">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent-indigo" />
          <h3 className="text-sm font-semibold text-ink-primary">Recent Activity</h3>
        </div>
        <span className="text-[10px] text-ink-tertiary">Live</span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-ink-wash/30 overflow-x-auto">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-all ${
              filter === f.value
                ? 'bg-accent-indigo/10 text-accent-indigo'
                : 'text-ink-tertiary hover:text-ink-secondary hover:bg-canvas'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activity list */}
      <div className="divide-y divide-ink-wash/30">
        {displayItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 px-4 py-3 hover:bg-canvas/50 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-canvas flex items-center justify-center shrink-0 mt-0.5">
                <Icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-ink-primary truncate">
                  {item.title}
                </p>
                <p className="text-[11px] text-ink-secondary mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <span className="text-[10px] text-ink-tertiary shrink-0">{item.time}</span>
            </div>
          );
        })}
      </div>

      {/* Expand/collapse */}
      {filtered.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 py-2.5 text-[11px] text-accent-indigo hover:bg-canvas/50 transition-colors"
        >
          {expanded ? 'Show less' : `Show ${filtered.length - 5} more`}
          <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
      )}
    </div>
  );
}
