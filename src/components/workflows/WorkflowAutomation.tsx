import { useState } from 'react';
import {
  Zap, Clock, Calendar, FileText, Bell, Bookmark,
  Download, RotateCcw, CheckCircle2, AlertCircle,
  Play, Pause, Settings, ChevronRight, TrendingUp,
  Mail, MapPin, Layers
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-19: Workflow Automation
// Saved workflows, recurring reports, automated alerts,
// watchlist monitoring, and scheduled exports.
// ═══════════════════════════════════════════════════════════════

interface Workflow {
  id: string;
  name: string;
  description: string;
  type: 'report' | 'alert' | 'monitor' | 'export';
  frequency: string;
  status: 'active' | 'paused';
  lastRun: string;
  nextRun: string;
  runs: number;
  icon: React.ElementType;
}

interface TriggerRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  triggered: number;
  lastTriggered: string;
  active: boolean;
}

const WORKFLOWS: Workflow[] = [
  { id: 'wf1', name: 'Weekly Opportunity Report', description: 'Generate and email report of all new opportunities across monitored counties', type: 'report', frequency: 'Every Monday 6:00 AM', status: 'active', lastRun: 'Jul 14', nextRun: 'Jul 21', runs: 47, icon: FileText },
  { id: 'wf2', name: 'Daily Permit Digest', description: 'Email digest of new building permits in target zip codes', type: 'report', frequency: 'Daily 7:00 AM', status: 'active', lastRun: 'Today', nextRun: 'Tomorrow', runs: 128, icon: FileText },
  { id: 'wf3', name: 'High-Confidence Alert', description: 'Instant alert when opportunity confidence exceeds 90%', type: 'alert', frequency: 'Real-time', status: 'active', lastRun: 'Jul 18', nextRun: 'On trigger', runs: 12, icon: Bell },
  { id: 'wf4', name: 'Watchlist Change Monitor', description: 'Notify when any watchlist item receives new filings or status changes', type: 'monitor', frequency: 'Every 2 hours', status: 'active', lastRun: '2 hours ago', nextRun: 'In 2 hours', runs: 892, icon: Bookmark },
  { id: 'wf5', name: 'County Growth Export', description: 'Export CSV of all growth signals for the week to shared drive', type: 'export', frequency: 'Every Friday 5:00 PM', status: 'active', lastRun: 'Jul 11', nextRun: 'Jul 25', runs: 23, icon: Download },
  { id: 'wf6', name: 'DOT Project Alert', description: 'Alert when new DOT projects exceed $5M in target counties', type: 'alert', frequency: 'Real-time', status: 'paused', lastRun: 'Jul 5', nextRun: '—', runs: 8, icon: Bell },
  { id: 'wf7', name: 'Competitor Permit Tracking', description: 'Weekly report on permits filed by known competitors', type: 'report', frequency: 'Every Wednesday 8:00 AM', status: 'active', lastRun: 'Jul 16', nextRun: 'Jul 23', runs: 34, icon: TrendingUp },
];

const TRIGGER_RULES: TriggerRule[] = [
  { id: 'tr1', name: 'Confidence Threshold', condition: 'Opportunity confidence ≥ 90%', action: 'Send email + push notification', triggered: 12, lastTriggered: 'Jul 18', active: true },
  { id: 'tr2', name: 'Corridor Signal Cluster', condition: '≥ 5 signals within 0.5 miles within 14 days', action: 'Create draft recommendation', triggered: 4, lastTriggered: 'Jul 15', active: true },
  { id: 'tr3', name: 'Permit Velocity Spike', condition: 'Permit filings > 200% of 30-day average', action: 'Flag as emerging hotspot', triggered: 2, lastTriggered: 'Jul 12', active: true },
  { id: 'tr4', name: 'School RFP Detection', condition: 'New school construction RFP > $10M', action: 'Immediate alert to team', triggered: 1, lastTriggered: 'Jul 17', active: true },
  { id: 'tr5', name: 'Large DOT Project', condition: 'DOT project budget > $5M in monitored county', action: 'Add to priority queue', triggered: 3, lastTriggered: 'Jul 8', active: false },
];

function TypeIcon({ type }: { type: string }) {
  const icons: Record<string, React.ElementType> = {
    report: FileText,
    alert: Bell,
    monitor: Bookmark,
    export: Download,
  };
  const Icon = icons[type] || Zap;
  return <Icon className="w-3.5 h-3.5" />;
}

function StatusBadge({ status }: { status: string }) {
  return status === 'active' ? (
    <span className="flex items-center gap-1 text-[9px] font-medium text-emerald-600">
      <CheckCircle2 className="w-3 h-3" /> Active
    </span>
  ) : (
    <span className="flex items-center gap-1 text-[9px] font-medium text-ink-tertiary">
      <Pause className="w-3 h-3" /> Paused
    </span>
  );
}

export default function WorkflowAutomation() {
  const [tab, setTab] = useState<'workflows' | 'triggers'>('workflows');
  const activeWorkflows = WORKFLOWS.filter((w) => w.status === 'active').length;
  const totalRuns = WORKFLOWS.reduce((s, w) => s + w.runs, 0);

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Active Workflows', value: activeWorkflows.toString(), icon: Zap },
          { label: 'Total Runs', value: totalRuns.toLocaleString(), icon: RotateCcw },
          { label: 'Trigger Rules', value: TRIGGER_RULES.filter((t) => t.active).length.toString(), icon: AlertCircle },
          { label: 'Trigger Events', value: TRIGGER_RULES.reduce((s, t) => s + t.triggered, 0).toString(), icon: Bell },
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
          { id: 'workflows' as const, label: 'Workflows', icon: Zap },
          { id: 'triggers' as const, label: 'Trigger Rules', icon: AlertCircle },
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

      {/* Workflows */}
      {tab === 'workflows' && (
        <div className="space-y-2">
          {WORKFLOWS.map((wf) => (
            <div key={wf.id} className="flex items-center gap-3 p-3 bg-surface border border-ink-wash rounded-xl">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent-indigo/10 flex items-center justify-center">
                <TypeIcon type={wf.type} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[12px] font-semibold text-ink-primary">{wf.name}</span>
                  <StatusBadge status={wf.status} />
                </div>
                <p className="text-[10px] text-ink-tertiary truncate">{wf.description}</p>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="text-[9px] text-ink-tertiary flex items-center gap-0.5">
                    <Calendar className="w-2.5 h-2.5" /> {wf.frequency}
                  </span>
                  <span className="text-[9px] text-ink-tertiary flex items-center gap-0.5">
                    <RotateCcw className="w-2.5 h-2.5" /> {wf.runs} runs
                  </span>
                  <span className="text-[9px] text-emerald-600 font-medium">
                    Next: {wf.nextRun}
                  </span>
                </div>
              </div>
              <button className="flex-shrink-0 p-1.5 rounded-lg hover:bg-ink-wash transition-colors">
                <Settings className="w-3.5 h-3.5 text-ink-tertiary" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Trigger Rules */}
      {tab === 'triggers' && (
        <div className="space-y-2">
          {TRIGGER_RULES.map((rule) => (
            <div key={rule.id} className={`p-3 border rounded-xl ${rule.active ? 'border-ink-wash bg-surface' : 'border-ink-wash/50 opacity-60'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-ink-primary">{rule.name}</span>
                  {rule.active ? (
                    <span className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-medium">Active</span>
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.5 bg-ink-wash/50 text-ink-tertiary rounded-full font-medium">Disabled</span>
                  )}
                </div>
                <span className="text-[10px] text-ink-tertiary">{rule.triggered}x triggered</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2 bg-canvas rounded-lg">
                  <span className="text-[9px] text-ink-tertiary uppercase tracking-wider">When</span>
                  <p className="text-[11px] text-ink-secondary mt-0.5">{rule.condition}</p>
                </div>
                <div className="p-2 bg-canvas rounded-lg">
                  <span className="text-[9px] text-ink-tertiary uppercase tracking-wider">Then</span>
                  <p className="text-[11px] text-ink-secondary mt-0.5">{rule.action}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-[9px] text-ink-tertiary">
                <Clock className="w-2.5 h-2.5" /> Last triggered: {rule.lastTriggered}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
