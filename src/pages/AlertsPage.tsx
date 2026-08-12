import { useState, useMemo } from "react";
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Inbox,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/providers/trpc";

type NotificationItem = {
  id: number;
  userId: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  read: boolean;
  createdAt: string;
};

type AlertTab = "All" | "Unread" | "Read";

const alertTabs: AlertTab[] = ["All", "Unread", "Read"];

function relativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hr ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

function getTypeBadgeClass(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("surge")) return "bg-accent-indigo/10 text-accent-indigo border-accent-indigo/20";
  if (t.includes("zoning")) return "bg-accent-amber/10 text-accent-amber border-accent-amber/20";
  if (t.includes("utility")) return "bg-accent-teal/10 text-accent-teal border-accent-teal/20";
  if (t.includes("project")) return "bg-[#0B1F33]/10 text-[var(--bs-text-primary)] border-[#0B1F33]/20";
  return "bg-ink-tertiary/10 text-ink-tertiary border-ink-tertiary/20";
}

function getTypeIcon(type: string) {
  const t = type.toLowerCase();
  if (t.includes("surge")) return <AlertTriangle className="w-5 h-5" />;
  if (t.includes("zoning")) return <Eye className="w-5 h-5" />;
  if (t.includes("utility")) return <EyeOff className="w-5 h-5" />;
  if (t.includes("project")) return <CheckCircle2 className="w-5 h-5" />;
  return <Bell className="w-5 h-5" />;
}

function getTypeBgClass(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("surge")) return "bg-accent-indigo/5 text-accent-indigo";
  if (t.includes("zoning")) return "bg-accent-amber/5 text-accent-amber";
  if (t.includes("utility")) return "bg-accent-teal/5 text-accent-teal";
  if (t.includes("project")) return "bg-[#0B1F33]/5 text-[var(--bs-text-primary)]";
  return "bg-ink-tertiary/5 text-ink-tertiary";
}

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState<AlertTab>("All");
  const utils = trpc.useUtils();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = trpc.notification.history.useQuery({ limit: 50, offset: 0 });

  const markReadMutation = trpc.notification.markRead.useMutation({
    onSuccess: () => {
      utils.notification.history.invalidate();
    },
  });

  const markAllReadMutation = trpc.stripe.markAllRead.useMutation({
    onSuccess: () => {
      utils.notification.history.invalidate();
    },
  });

  const items: NotificationItem[] = data?.items ?? [];
  const unreadCount = data?.unreadCount ?? 0;
  const total = data?.total ?? 0;

  const filteredItems = useMemo(() => {
    if (activeTab === "All") return items;
    if (activeTab === "Unread") return items.filter((n) => !n.read);
    if (activeTab === "Read") return items.filter((n) => n.read);
    return items;
  }, [items, activeTab]);

  const unreadFilteredCount = filteredItems.filter((n) => !n.read).length;

  const handleMarkRead = (id: number) => {
    markReadMutation.mutate({ id });
  };

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  const isMarkingAll = markAllReadMutation.isPending;

  return (
    <div className="bg-canvas min-h-screen">
      <div className="max-w-content mx-auto px-6 py-8">
        {/* Sample Data Banner */}
        <div className="mb-6 p-3 rounded-lg bg-accent-amber/10 border border-accent-amber/20 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-accent-amber shrink-0" />
          <p className="text-sm text-accent-amber font-medium">
            Sample Data — Illustrative Example
          </p>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="section-title text-ink-primary mb-2">Alerts</h1>
          <p className="text-body text-ink-secondary">
            Real-time notifications for your monitored counties and watchlist
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-surface border-border">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                Unread Alerts
              </p>
              <p className="text-2xl font-bold text-accent-indigo">
                {isLoading ? (
                  <Skeleton className="h-8 w-12 bg-ink-tertiary/10" />
                ) : (
                  unreadCount
                )}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-surface border-border">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                Total
              </p>
              <p className="text-2xl font-bold text-ink-primary">
                {isLoading ? (
                  <Skeleton className="h-8 w-12 bg-ink-tertiary/10" />
                ) : (
                  total
                )}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-surface border-border">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                In This View
              </p>
              <p className="text-2xl font-bold text-accent-teal">
                {isLoading ? (
                  <Skeleton className="h-8 w-12 bg-ink-tertiary/10" />
                ) : (
                  filteredItems.length
                )}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-surface border-border">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                Unread Here
              </p>
              <p className="text-2xl font-bold text-accent-amber">
                {isLoading ? (
                  <Skeleton className="h-8 w-12 bg-ink-tertiary/10" />
                ) : (
                  unreadFilteredCount
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs + Bulk Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as AlertTab)}
          >
            <TabsList className="bg-surface border border-border">
              {alertTabs.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="data-[state=active]:bg-accent-indigo data-[state=active]:text-white text-ink-secondary text-xs"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={isMarkingAll || unreadCount === 0}
            className="border-border text-ink-secondary hover:text-accent-indigo hover:border-accent-indigo/40 disabled:opacity-40"
          >
            {isMarkingAll ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
            )}
            Mark All Read
          </Button>
        </div>

        <Separator className="mb-6 bg-border" />

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="bg-surface border-border">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-10 h-10 rounded-full shrink-0 bg-ink-tertiary/10" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-20 bg-ink-tertiary/10" />
                        <Skeleton className="h-5 w-24 bg-ink-tertiary/10" />
                      </div>
                      <Skeleton className="h-4 w-3/4 bg-ink-tertiary/10" />
                      <Skeleton className="h-4 w-1/2 bg-ink-tertiary/10" />
                      <div className="flex items-center gap-4 pt-1">
                        <Skeleton className="h-3 w-24 bg-ink-tertiary/10" />
                        <Skeleton className="h-3 w-20 bg-ink-tertiary/10" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-canvas flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-accent-amber" />
            </div>
            <p className="text-lg font-medium text-ink-primary mb-2">
              Failed to load alerts
            </p>
            <p className="text-sm text-ink-tertiary mb-4 max-w-md mx-auto">
              {error.message || "An unexpected error occurred"}
            </p>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="border-border text-ink-secondary hover:text-accent-indigo hover:border-accent-indigo/40"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-canvas flex items-center justify-center">
              <Inbox className="w-7 h-7 text-ink-tertiary" />
            </div>
            <p className="text-lg font-medium text-ink-primary mb-2">
              {activeTab === "Unread"
                ? "No unread alerts"
                : activeTab === "Read"
                  ? "No read alerts"
                  : "No alerts yet"}
            </p>
            <p className="text-sm text-ink-tertiary max-w-md mx-auto">
              {activeTab === "Unread"
                ? "You're all caught up! We'll notify you when new activity is detected."
                : activeTab === "Read"
                  ? "Read alerts will appear here once you've marked them."
                  : "You'll be notified when activity is detected in your monitored counties and watchlists."}
            </p>
          </div>
        )}

        {/* Alert List */}
        {!isLoading && !error && filteredItems.length > 0 && (
          <div className="space-y-4">
            {filteredItems.map((alert) => (
              <Card
                key={alert.id}
                className={`bg-surface border-border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
                  !alert.read
                    ? "border-l-4 border-l-accent-indigo"
                    : ""
                }`}
                onClick={() => !alert.read && handleMarkRead(alert.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getTypeBgClass(
                        alert.type
                      )}`}
                    >
                      {getTypeIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${getTypeBadgeClass(alert.type)}`}
                        >
                          {alert.type}
                        </Badge>
                        {!alert.read && (
                          <span className="w-2 h-2 rounded-full bg-accent-indigo" />
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-ink-primary mb-1">
                        {alert.title}
                      </h3>
                      <p className="text-sm text-ink-secondary leading-relaxed mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-ink-tertiary">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {relativeTime(alert.createdAt)}
                        </span>
                        {alert.link && (
                          <a
                            href={alert.link}
                            className="text-accent-indigo hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Details
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}