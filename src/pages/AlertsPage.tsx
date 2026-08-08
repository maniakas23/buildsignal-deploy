import { useState } from "react";
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Archive,
  MapPin,
  Check,
  Filter,
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

type AlertSeverity = "high" | "medium" | "low";
type AlertType = "Permit Surge" | "Zoning Change" | "Utility Request" | "New Project";
type AlertStatus = "unread" | "read" | "archived";

interface AlertItem {
  id: string;
  severity: AlertSeverity;
  type: AlertType;
  title: string;
  description: string;
  county: string;
  timestamp: string;
  status: AlertStatus;
}

const alertTabs = ["All", "Unread", "High Priority", "Watchlist", "Archived"] as const;
type AlertTab = (typeof alertTabs)[number];

const sampleAlerts: AlertItem[] = [
  {
    id: "1",
    severity: "high",
    type: "Permit Surge",
    title: "King County permit volume surged 340%",
    description:
      "Permit filings in King County have increased dramatically over the past 7 days, driven primarily by residential and commercial construction activity.",
    county: "King County, WA",
    timestamp: "15 min ago",
    status: "unread",
  },
  {
    id: "2",
    severity: "high",
    type: "Zoning Change",
    title: "Major rezoning proposal submitted in Austin",
    description:
      "A proposal to rezone 120 acres from industrial to mixed-use has been filed with the City of Austin Planning Department.",
    county: "Travis County, TX",
    timestamp: "32 min ago",
    status: "unread",
  },
  {
    id: "3",
    severity: "medium",
    type: "New Project",
    title: "New $400M data center project announced",
    description:
      "A major cloud provider has announced plans for a new hyperscale data center campus with expected completion in late 2026.",
    county: "Maricopa County, AZ",
    timestamp: "1 hr ago",
    status: "unread",
  },
  {
    id: "4",
    severity: "medium",
    type: "Utility Request",
    title: "DTE Energy files large-scale utility upgrade",
    description:
      "DTE Energy has submitted permits for substation expansion and grid modernization to support new industrial development.",
    county: "Wayne County, MI",
    timestamp: "2 hr ago",
    status: "read",
  },
  {
    id: "5",
    severity: "low",
    type: "Permit Surge",
    title: "Residential permit uptick in Orange County",
    description:
      "Weekly residential permit filings have increased 18% compared to the 90-day average, indicating renewed housing activity.",
    county: "Orange County, CA",
    timestamp: "3 hr ago",
    status: "read",
  },
  {
    id: "6",
    severity: "high",
    type: "Zoning Change",
    title: "Miami-Dade approves waterfront zoning overhaul",
    description:
      "The Miami-Dade Board of County Commissioners has approved a comprehensive rezoning plan affecting 2,300 parcels along the waterfront corridor.",
    county: "Miami-Dade County, FL",
    timestamp: "5 hr ago",
    status: "read",
  },
  {
    id: "7",
    severity: "medium",
    type: "New Project",
    title: "Light rail extension project enters permitting",
    description:
      "The regional transit authority has submitted environmental and construction permits for the 14-mile light rail extension.",
    county: "Hennepin County, MN",
    timestamp: "8 hr ago",
    status: "archived",
  },
  {
    id: "8",
    severity: "low",
    type: "Utility Request",
    title: "Fiber optic expansion permits filed",
    description:
      "A telecommunications provider has filed permits for aerial and underground fiber optic cable installation across three municipalities.",
    county: "Dallas County, TX",
    timestamp: "12 hr ago",
    status: "archived",
  },
];

const severityConfig: Record<
  AlertSeverity,
  {
    icon: React.ReactNode;
    borderClass: string;
    bgClass: string;
    textClass: string;
    badgeClass: string;
  }
> = {
  high: {
    icon: <AlertTriangle className="w-5 h-5" />,
    borderClass: "border-l-4 border-l-[#DC2626]",
    bgClass: "bg-[#DC2626]/5",
    textClass: "text-[#DC2626]",
    badgeClass: "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20",
  },
  medium: {
    icon: <Bell className="w-5 h-5" />,
    borderClass: "border-l-4 border-l-accent-amber",
    bgClass: "bg-accent-amber/5",
    textClass: "text-accent-amber",
    badgeClass: "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
  },
  low: {
    icon: <CheckCircle2 className="w-5 h-5" />,
    borderClass: "border-l-4 border-l-[#0B1F33]",
    bgClass: "bg-[#0B1F33]/5",
    textClass: "text-[#0B1F33]",
    badgeClass: "bg-[#0B1F33]/10 text-[#0B1F33] border-[#0B1F33]/20",
  },
};

const typeConfig: Record<AlertType, { label: string; badgeClass: string }> = {
  "Permit Surge": {
    label: "Permit Surge",
    badgeClass: "bg-accent-indigo/10 text-accent-indigo border-accent-indigo/20",
  },
  "Zoning Change": {
    label: "Zoning Change",
    badgeClass: "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
  },
  "Utility Request": {
    label: "Utility Request",
    badgeClass: "bg-accent-teal/10 text-accent-teal border-accent-teal/20",
  },
  "New Project": {
    label: "New Project",
    badgeClass: "bg-[#0B1F33]/10 text-[#0B1F33] border-[#0B1F33]/20",
  },
};

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState<AlertTab>("All");
  const [alerts, setAlerts] = useState<AlertItem[]>(sampleAlerts);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === "All") return true;
    if (activeTab === "Unread") return a.status === "unread";
    if (activeTab === "High Priority") return a.severity === "high";
    if (activeTab === "Watchlist") return a.severity !== "low";
    if (activeTab === "Archived") return a.status === "archived";
    return true;
  });

  const unreadCount = alerts.filter((a) => a.status === "unread").length;
  const totalToday = alerts.length;
  const highPriorityCount = alerts.filter((a) => a.severity === "high").length;
  const watchlistCount = alerts.filter((a) => a.severity !== "low").length;

  const markRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "read" as AlertStatus } : a))
    );
  };

  const markAllRead = () => {
    setAlerts((prev) =>
      prev.map((a) => ({ ...a, status: "read" as AlertStatus }))
    );
    setSelectedIds(new Set());
  };

  const archiveSelected = () => {
    setAlerts((prev) =>
      prev.map((a) =>
        selectedIds.has(a.id) ? { ...a, status: "archived" as AlertStatus } : a
      )
    );
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hasSelection = selectedIds.size > 0;

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
              <p className="text-2xl font-bold text-accent-indigo">{unreadCount}</p>
            </CardContent>
          </Card>
          <Card className="bg-surface border-border">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                Total Today
              </p>
              <p className="text-2xl font-bold text-ink-primary">{totalToday}</p>
            </CardContent>
          </Card>
          <Card className="bg-surface border-border">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                High Priority
              </p>
              <p className="text-2xl font-bold text-[#DC2626]">{highPriorityCount}</p>
            </CardContent>
          </Card>
          <Card className="bg-surface border-border">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide mb-1">
                Watchlist Alerts
              </p>
              <p className="text-2xl font-bold text-accent-amber">{watchlistCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs + Bulk Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AlertTab)}>
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

          {/* Bulk Actions */}
          <div className="flex items-center gap-2">
            {hasSelection && (
              <span className="text-xs text-ink-tertiary mr-1">
                {selectedIds.size} selected
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={markAllRead}
              className="border-border text-ink-secondary hover:text-accent-indigo hover:border-accent-indigo/40"
            >
              <Check className="w-4 h-4 mr-1.5" />
              Mark All Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={archiveSelected}
              disabled={!hasSelection}
              className="border-border text-ink-secondary hover:text-ink-primary hover:border-ink-tertiary disabled:opacity-40"
            >
              <Archive className="w-4 h-4 mr-1.5" />
              Archive Selected
            </Button>
          </div>
        </div>

        <Separator className="mb-6 bg-border" />

        {/* Alert Feed */}
        {filteredAlerts.length > 0 ? (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => {
              const sev = severityConfig[alert.severity];
              const typ = typeConfig[alert.type];
              const isUnread = alert.status === "unread";
              const isSelected = selectedIds.has(alert.id);

              return (
                <Card
                  key={alert.id}
                  className={`bg-surface border-border transition-all hover:shadow-sm ${
                    isUnread ? "border-l-4 border-l-accent-indigo" : ""
                  } ${isSelected ? "ring-1 ring-accent-indigo/30" : ""}`}
                >
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4 p-5">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleSelect(alert.id)}
                        className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-accent-indigo border-accent-indigo"
                            : "border-border bg-surface hover:border-accent-indigo/50"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>

                      {/* Severity Icon */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${sev.bgClass} ${sev.textClass}`}
                      >
                        {sev.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`text-xs font-medium px-2 py-0.5 ${sev.badgeClass}`}
                          >
                            {alert.severity.charAt(0).toUpperCase() +
                              alert.severity.slice(1)}{" "}
                            Priority
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs font-medium px-2 py-0.5 ${typ.badgeClass}`}
                          >
                            {typ.label}
                          </Badge>
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-accent-indigo" />
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-ink-primary mb-1">
                          {alert.title}
                        </h3>
                        <p className="text-sm text-ink-secondary leading-relaxed">
                          {alert.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-ink-tertiary">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alert.county}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {alert.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 shrink-0">
                        {isUnread && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markRead(alert.id)}
                            className="text-accent-indigo hover:bg-accent-indigo/10 h-8 px-2"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-canvas flex items-center justify-center">
              <Bell className="w-7 h-7 text-ink-tertiary" />
            </div>
            <p className="text-ink-secondary font-medium mb-1">
              No alerts right now
            </p>
            <p className="text-sm text-ink-tertiary max-w-sm mx-auto">
              We&apos;ll notify you when new activity is detected in your monitored
              areas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
