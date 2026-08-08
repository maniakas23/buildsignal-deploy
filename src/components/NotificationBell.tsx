import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Check, Trash2, Loader2, Settings, X } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, refetch } = trpc.notification.history.useQuery(
    { limit: 10, offset: 0 },
    { enabled: open }
  );

  const markRead = trpc.notification.markRead.useMutation({
    onSuccess: () => refetch(),
  });

  const markAllRead = trpc.notification.markAllRead.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteNotification = trpc.notification.delete.useMutation({
    onSuccess: () => refetch(),
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = data?.unreadCount ?? 0;

  const handleMarkRead = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    markRead.mutate({ id });
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    deleteNotification.mutate({ id });
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  const formatTime = (date: string | Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "relative p-2 rounded-lg transition-colors",
          open
            ? "bg-[rgba(31,94,255,0.08)] text-[#1F5EFF]"
            : "text-[#6B7B8F] hover:text-[#0B1F33] hover:bg-[#F5F5F5]"
        )}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4.5 min-w-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[360px] bg-white rounded-xl shadow-lg border border-[#F5F5F5] z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#F5F5F5]">
            <h3 className="font-semibold text-sm text-[#0B1F33]">Notifications</h3>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={markAllRead.isPending}
                  className="text-xs text-[#1F5EFF] hover:underline font-medium px-2 py-1 rounded hover:bg-[rgba(31,94,255,0.04)] transition-colors"
                  title="Mark all as read"
                >
                  {markAllRead.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    "Mark all read"
                  )}
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-[#F5F5F5] text-[#6B7B8F] transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-[#1F5EFF]" />
              </div>
            ) : data?.items && data.items.length > 0 ? (
              <div className="divide-y divide-[#F5F5F5]">
                {data.items.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "px-4 py-3 flex gap-3 group transition-colors",
                      !item.read ? "bg-[rgba(31,94,255,0.02)]" : "bg-white",
                      "hover:bg-[#F7F9FC]"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 h-2 w-2 rounded-full shrink-0",
                        !item.read ? "bg-[#1F5EFF]" : "bg-transparent"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm", !item.read ? "font-medium text-[#0B1F33]" : "text-[#0B1F33]")}>
                        {item.title}
                      </p>
                      <p className="text-xs text-[#6B7B8F] mt-0.5 line-clamp-2">
                        {item.message}
                      </p>
                      <p className="text-[10px] text-[#6B7B8F] mt-1">
                        {formatTime(item.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!item.read && (
                        <button
                          onClick={(e) => handleMarkRead(e, item.id)}
                          className="p-1 rounded hover:bg-[#F5F5F5] text-[#6B7B8F] hover:text-[#1F5EFF] transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="p-1 rounded hover:bg-red-50 text-[#6B7B8F] hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#6B7B8F]">
                <Bell className="h-8 w-8 mx-auto mb-2 text-[#E5E5E5]" />
                <p className="text-sm">No notifications yet</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[#F5F5F5] px-4 py-2.5 bg-[#F7F9FC]">
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-xs text-[#1F5EFF] hover:underline font-medium"
            >
              <Settings className="h-3.5 w-3.5" />
              Notification Settings
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
