import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle2, AlertTriangle, TrendingUp, Info } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'trend' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'trend',
    title: 'New High-Confidence Opportunity',
    message: 'Mixed-Use Development in Travis County — 94% confidence',
    timestamp: Date.now() - 3600000,
    read: false,
  },
  {
    id: '2',
    type: 'success',
    title: 'Data Refresh Complete',
    message: 'All counties updated with latest permit filings',
    timestamp: Date.now() - 7200000,
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Weekly Digest Ready',
    message: 'Your weekly intelligence summary is available',
    timestamp: Date.now() - 86400000,
    read: true,
  },
  {
    id: '4',
    type: 'warning',
    title: 'Signal Surge Detected',
    message: 'Harris County showing 40% increase in utility requests',
    timestamp: Date.now() - 172800000,
    read: false,
  },
];

export default function InAppNotifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load from localStorage or use samples
    const stored = localStorage.getItem('buildsignal_notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      setNotifications(SAMPLE_NOTIFICATIONS);
    }
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('buildsignal_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-accent-teal" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-accent-amber" />;
      case 'trend':
        return <TrendingUp className="w-4 h-4 text-accent-indigo" />;
      default:
        return <Info className="w-4 h-4 text-ink-tertiary" />;
    }
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="relative">
      {/* Bell trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-canvas transition-colors"
      >
        <Bell className="w-5 h-5 text-ink-secondary" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent-crimson text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-[70]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-[80] w-80 bg-surface rounded-2xl shadow-xl border border-ink-wash animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-ink-wash">
              <h3 className="text-sm font-semibold text-ink-primary">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-accent-indigo hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[320px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="w-8 h-8 text-ink-wash mx-auto mb-2" />
                  <p className="text-xs text-ink-tertiary">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`w-full flex items-start gap-3 p-3 text-left hover:bg-canvas transition-colors ${
                      !n.read ? 'bg-accent-indigo/[0.02]' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">{getIcon(n.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${!n.read ? 'text-ink-primary' : 'text-ink-secondary'}`}>
                        {n.title}
                      </p>
                      <p className="text-[11px] text-ink-tertiary leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-ink-tertiary mt-1">{formatTime(n.timestamp)}</p>
                    </div>
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-accent-indigo flex-shrink-0 mt-1.5" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
