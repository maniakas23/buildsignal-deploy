import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import {
  Bell, BellDot, X, ArrowRight, TrendingUp,
  AlertTriangle, Sparkles, Check, Clock, MapPin
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'opportunity' | 'alert' | 'system' | 'milestone';
  title: string;
  description: string;
  time: string;
  read: boolean;
  action?: string;
  actionPage?: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'opportunity',
    title: 'High-confidence opportunity detected',
    description: 'Apex Town Center Phase 2 — 92% confidence, Wake County',
    time: '2m ago',
    read: false,
    action: 'View',
    actionPage: 'dashboard',
  },
  {
    id: 'n2',
    type: 'alert',
    title: 'Confidence score changed',
    description: 'Morrisville Station District increased to 78% (+8%)',
    time: '15m ago',
    read: false,
    action: 'Check',
    actionPage: 'dashboard',
  },
  {
    id: 'n3',
    type: 'milestone',
    title: 'Weekly digest ready',
    description: 'Your intelligence summary for July 13-19 is available',
    time: '1h ago',
    read: false,
    action: 'Read',
    actionPage: 'daily-brief',
  },
  {
    id: 'n4',
    type: 'system',
    title: 'Data refresh complete',
    description: '2,847 signals updated across 3,100+ counties',
    time: '3h ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'opportunity',
    title: 'New transit project identified',
    description: 'Cary commuter rail station — early signal, 68% confidence',
    time: '5h ago',
    read: true,
    action: 'Explore',
    actionPage: 'map',
  },
];

const TYPE_CONFIG = {
  opportunity: { icon: TrendingUp, color: 'text-accent-teal', bg: 'bg-accent-teal/10' },
  alert: { icon: AlertTriangle, color: 'text-accent-amber', bg: 'bg-accent-amber/10' },
  system: { icon: Sparkles, color: 'text-accent-indigo', bg: 'bg-accent-indigo/10' },
  milestone: { icon: Check, color: 'text-accent-violet', bg: 'bg-accent-violet/10' },
};

export default function InAppNotifications() {
  const { setCurrentPage } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleAction = (n: Notification) => {
    markRead(n.id);
    if (n.actionPage) {
      setCurrentPage(n.actionPage);
    }
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* Bell trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-lg hover:bg-canvas flex items-center justify-center transition-colors"
      >
        {unreadCount > 0 ? (
          <BellDot className="w-5 h-5 text-accent-indigo" />
        ) : (
          <Bell className="w-5 h-5 text-ink-tertiary" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent-crimson text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[360px] bg-surface border border-ink-wash rounded-2xl shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-ink-wash/50">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-ink-primary">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-accent-indigo/10 text-[10px] font-medium text-accent-indigo">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] text-accent-indigo hover:underline"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded hover:bg-canvas flex items-center justify-center"
              >
                <X className="w-3 h-3 text-ink-tertiary" />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map((n) => {
              const config = TYPE_CONFIG[n.type];
              const Icon = config.icon;
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-canvas/50 transition-colors border-b border-ink-wash/20 ${
                    !n.read ? 'bg-accent-indigo/[0.02]' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs ${!n.read ? 'font-semibold text-ink-primary' : 'text-ink-secondary'}`}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-indigo shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-ink-secondary mt-0.5 leading-relaxed">
                      {n.description}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="flex items-center gap-1 text-[10px] text-ink-tertiary">
                        <Clock className="w-2.5 h-2.5" />
                        {n.time}
                      </span>
                      {n.action && n.actionPage && (
                        <button
                          onClick={() => handleAction(n)}
                          className="flex items-center gap-1 text-[10px] text-accent-indigo hover:underline"
                        >
                          {n.action}
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-ink-wash/50 bg-canvas/30">
            <button
              onClick={() => { setCurrentPage('alerts'); setIsOpen(false); }}
              className="w-full flex items-center justify-center gap-1 text-[11px] text-accent-indigo hover:underline"
            >
              View all notifications
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
