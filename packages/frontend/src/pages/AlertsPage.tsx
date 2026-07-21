import { useState } from "react";
import { useStore } from "@/store/useStore";
import {
  Bell, Plus, X, Filter, ChevronDown, Target, Clock, Zap, CheckCircle2
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                          */
/* ------------------------------------------------------------------ */

const ALERT_TYPES = [
  { id: "new_opportunity", label: "New Opportunity", icon: Zap },
  { id: "price_change", label: "Price Change", icon: Target },
  { id: "status_change", label: "Status Change", icon: CheckCircle2 },
  { id: "deadline", label: "Deadline", icon: Clock },
];

const DEMO_ALERTS = [
  {
    id: "alert-001",
    name: "High-Value Opportunities in Wake County",
    type: "new_opportunity",
    criteria: { minValue: 10000000, counties: ["Wake"] },
    frequency: "realtime",
    isActive: true,
    lastTriggered: "2 hours ago",
  },
  {
    id: "alert-002",
    name: "Apex Town Center Updates",
    type: "status_change",
    criteria: { projects: ["Apex Town Center"] },
    frequency: "daily",
    isActive: true,
    lastTriggered: "1 day ago",
  },
  {
    id: "alert-003",
    name: "Permit Deadline Reminders",
    type: "deadline",
    criteria: { daysBefore: 30 },
    frequency: "weekly",
    isActive: false,
    lastTriggered: "Never",
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(DEMO_ALERTS);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? alerts
    : alerts.filter((a) => a.type === filter);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-accent-indigo" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-ink-primary">Alerts</h1>
            <p className="text-xs text-ink-tertiary">{alerts.filter((a) => a.isActive).length} active alerts</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-indigo text-white text-xs font-semibold hover:bg-accent-indigo-dim transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          New Alert
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
            filter === "all" ? "bg-accent-indigo/10 border-accent-indigo/30 text-accent-indigo" : "bg-canvas border-ink-wash text-ink-secondary hover:bg-surface-hover"
          }`}
        >
          All
        </button>
        {ALERT_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
              filter === t.id ? "bg-accent-indigo/10 border-accent-indigo/30 text-accent-indigo" : "bg-canvas border-ink-wash text-ink-secondary hover:bg-surface-hover"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const typeConfig = ALERT_TYPES.find((t) => t.id === alert.type);
          const Icon = typeConfig?.icon || Bell;
          return (
            <div
              key={alert.id}
              className={`bg-surface border rounded-xl p-4 transition-all ${
                alert.isActive ? "border-ink-wash" : "border-ink-wash/50 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    alert.isActive ? "bg-accent-indigo/10" : "bg-canvas"
                  }`}>
                    <Icon className={`w-4 h-4 ${alert.isActive ? "text-accent-indigo" : "text-ink-tertiary"}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-ink-primary">{alert.name}</h3>
                    <p className="text-[11px] text-ink-tertiary mt-0.5">
                      {typeConfig?.label} — {alert.frequency} — Last triggered: {alert.lastTriggered}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${alert.isActive ? "bg-accent-teal" : "bg-ink-tertiary"}`} />
                  <button className="w-6 h-6 rounded hover:bg-canvas flex items-center justify-center">
                    <ChevronDown className="w-3.5 h-3.5 text-ink-tertiary" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
