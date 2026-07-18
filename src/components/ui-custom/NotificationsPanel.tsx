import { useState, useEffect, useCallback } from 'react';
import { Bell, X, Check, Settings } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface Notification {
  id: number;
  type: string;
  message: string;
  status: 'read' | 'unread';
  createdAt: string;
}

export default function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { unreadAlertCount } = useStore();

  useEffect(() => {
    setNotifications([
      { id: 1, type: 'recommendation', message: 'New high-confidence opportunity: Wake County commercial corridor (92%)', status: 'unread', createdAt: new Date().toISOString() },
      { id: 2, type: 'watchlist', message: 'Permit filing in Wake County matches "Triangle Growth" watchlist', status: 'unread', createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: 3, type: 'system', message: 'Welcome to BuildSignal Pro — your plan is now active', status: 'read', createdAt: new Date(Date.now() - 86400000).toISOString() },
    ]);
  }, []);

  const markAsRead = useCallback((id: number) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, status: 'read' as const } : n));
  }, []);

  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full hover:bg-surface transition-colors" aria-label="Notifications">
        <Bell className="w-4 h-4 text-ink-secondary" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-4 h-4 text-[9px] font-bold bg-accent-crimson text-white rounded-full flex items-center justify-center">{unreadCount}</span>
        )}
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-[#243444] rounded-xl shadow-modal z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#243444]">
              <span className="text-[13px] font-medium text-ink-primary">Notifications</span>
              <span className="text-[11px] text-ink-tertiary">{unreadCount} unread</span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-[12px] text-ink-tertiary text-center py-4">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} onClick={() => markAsRead(n.id)} className={`px-4 py-3 border-b border-[#243444]/30 cursor-pointer hover:bg-surface-hover transition-colors ${n.status === 'unread' ? 'bg-canvas/40' : ''}`}>
                    <div className="flex items-start gap-2">
                      {n.status === 'unread' && <span className="w-1.5 h-1.5 rounded-full bg-accent-indigo mt-1.5 flex-shrink-0" />}
                      <div>
                        <p className="text-[12px] text-ink-secondary leading-snug">{n.message}</p>
                        <p className="text-[10px] text-ink-tertiary mt-1">{new Date(n.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
