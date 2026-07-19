import { useTelemetry } from '@/hooks/useTelemetry';
import {
  Users, TrendingUp, Clock, Target, Zap, Activity,
  BarChart3, ArrowRight, RefreshCw, UserCheck, UserX
} from 'lucide-react';

// ─── Mock data for demonstration ───
const MOCK_METRICS = {
  totalUsers: 342,
  activeToday: 89,
  newThisWeek: 24,
  avgTimeToValue: '4.2 min',
  onboardingCompletion: 78,
  activationRate: 64,
  retentionD7: 58,
  retentionD30: 42,
  npsScore: 52,
  supportTickets: 12,
  avgResponseTime: '2.3h',
};

const FUNNEL_STAGES = [
  { label: 'Homepage Visit', count: 1247, color: 'bg-accent-indigo', width: '100%' },
  { label: 'CTA Click', count: 386, color: 'bg-accent-indigo/80', width: '31%' },
  { label: 'Signup Start', count: 198, color: 'bg-accent-indigo/60', width: '16%' },
  { label: 'Onboarding Complete', count: 154, color: 'bg-accent-teal', width: '12%' },
  { label: 'Dashboard Active', count: 126, color: 'bg-accent-teal/80', width: '10%' },
  { label: 'First Search', count: 98, color: 'bg-accent-teal/60', width: '8%' },
  { label: 'Watchlist Created', count: 67, color: 'bg-accent-violet', width: '5%' },
  { label: 'Alert Created', count: 54, color: 'bg-accent-violet/70', width: '4%' },
];

const FEATURE_ADOPTION = [
  { feature: 'Search', users: 312, pct: 91 },
  { feature: 'Opportunity Cards', users: 298, pct: 87 },
  { feature: 'Map View', users: 245, pct: 72 },
  { feature: 'Watchlists', users: 198, pct: 58 },
  { feature: 'Alerts', users: 176, pct: 51 },
  { feature: 'Reports', users: 134, pct: 39 },
  { feature: 'Daily Brief', users: 112, pct: 33 },
  { feature: 'API Access', users: 34, pct: 10 },
];

const RECENT_ACTIVITY = [
  { action: 'User completed onboarding', time: '2m ago', type: 'success' },
  { action: 'New alert created — Wake County', time: '5m ago', type: 'info' },
  { action: 'Report generated — Q3 Pipeline', time: '12m ago', type: 'info' },
  { action: 'Watchlist saved — Transit Projects', time: '18m ago', type: 'info' },
  { action: 'First search performed', time: '23m ago', type: 'success' },
  { action: 'Feedback submitted — Feature request', time: '31m ago', type: 'warning' },
  { action: 'Signup completed', time: '45m ago', type: 'success' },
  { action: 'Support ticket resolved', time: '1h ago', type: 'success' },
];

export default function OperationsCenterPage() {
  const { getFunnelMetrics, clearEvents } = useTelemetry();
  const localMetrics = getFunnelMetrics();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-[960px] mx-auto px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink-primary tracking-tight">
              Operations Center
            </h1>
            <p className="text-sm text-ink-secondary mt-1">
              Customer success metrics and product telemetry
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] text-ink-tertiary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-teal opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-teal" />
              </span>
              Live
            </span>
            <button
              onClick={() => window.location.reload()}
              className="w-8 h-8 rounded-lg hover:bg-canvas flex items-center justify-center transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-ink-tertiary" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="max-w-[960px] mx-auto px-6 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KpiCard
            icon={Users}
            label="Total Users"
            value={String(MOCK_METRICS.totalUsers)}
            change="+24 this week"
            positive
          />
          <KpiCard
            icon={Activity}
            label="Active Today"
            value={String(MOCK_METRICS.activeToday)}
            change={`${Math.round((MOCK_METRICS.activeToday / MOCK_METRICS.totalUsers) * 100)}% of base`}
          />
          <KpiCard
            icon={Target}
            label="Activation Rate"
            value={`${MOCK_METRICS.activationRate}%`}
            change="+3% vs last week"
            positive
          />
          <KpiCard
            icon={Clock}
            label="Time to Value"
            value={MOCK_METRICS.avgTimeToValue}
            change="Under 5 min target"
            positive
          />
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="max-w-[960px] mx-auto px-6 pb-6">
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-accent-indigo" />
            <h2 className="text-sm font-semibold text-ink-primary">Conversion Funnel</h2>
            <span className="text-[10px] text-ink-tertiary ml-auto">
              {localMetrics.totalEvents} local events tracked
            </span>
          </div>

          <div className="space-y-2">
            {FUNNEL_STAGES.map((stage, i) => {
              const prevCount = i > 0 ? FUNNEL_STAGES[i - 1].count : stage.count;
              const dropoff = i > 0 ? Math.round(((prevCount - stage.count) / prevCount) * 100) : 0;

              return (
                <div key={stage.label} className="flex items-center gap-3">
                  <div className="w-28 sm:w-32 text-right shrink-0">
                    <span className="text-[11px] text-ink-secondary">{stage.label}</span>
                  </div>
                  <div className="flex-1 h-7 bg-canvas rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full ${stage.color} rounded-lg flex items-center px-2 transition-all`}
                      style={{ width: stage.width }}
                    >
                      <span className="text-[10px] font-medium text-white whitespace-nowrap">
                        {stage.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {dropoff > 0 && (
                    <span className="text-[10px] text-accent-crimson w-10 shrink-0">
                      -{dropoff}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two-column: Feature Adoption + Health */}
      <div className="max-w-[960px] mx-auto px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Feature Adoption */}
          <div className="bg-surface border border-ink-wash rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-accent-indigo" />
              <h2 className="text-sm font-semibold text-ink-primary">Feature Adoption</h2>
            </div>
            <div className="space-y-3">
              {FEATURE_ADOPTION.map((f) => (
                <div key={f.feature}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-ink-secondary">{f.feature}</span>
                    <span className="text-[11px] text-ink-tertiary font-mono">{f.users} ({f.pct}%)</span>
                  </div>
                  <div className="h-2 bg-canvas rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        f.pct >= 70 ? 'bg-accent-teal' : f.pct >= 40 ? 'bg-accent-indigo' : 'bg-accent-amber'
                      }`}
                      style={{ width: `${f.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Health */}
          <div className="bg-surface border border-ink-wash rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className="w-4 h-4 text-accent-teal" />
              <h2 className="text-sm font-semibold text-ink-primary">Customer Health</h2>
            </div>

            <div className="space-y-4">
              <HealthRow
                label="Onboarding Completion"
                value={MOCK_METRICS.onboardingCompletion}
                threshold={75}
              />
              <HealthRow
                label="7-Day Retention"
                value={MOCK_METRICS.retentionD7}
                threshold={50}
              />
              <HealthRow
                label="30-Day Retention"
                value={MOCK_METRICS.retentionD30}
                threshold={35}
              />
              <HealthRow
                label="NPS Score"
                value={MOCK_METRICS.npsScore}
                threshold={40}
                max={100}
              />

              <div className="border-t border-ink-wash/50 pt-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-ink-secondary">Support Health</span>
                  <span className="text-accent-teal font-medium">Good</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-canvas rounded-lg p-3 text-center">
                    <p className="text-lg font-semibold text-ink-primary font-mono">
                      {MOCK_METRICS.supportTickets}
                    </p>
                    <p className="text-[10px] text-ink-tertiary">Open Tickets</p>
                  </div>
                  <div className="bg-canvas rounded-lg p-3 text-center">
                    <p className="text-lg font-semibold text-ink-primary font-mono">
                      {MOCK_METRICS.avgResponseTime}
                    </p>
                    <p className="text-[10px] text-ink-tertiary">Avg Response</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="max-w-[960px] mx-auto px-6 pb-8">
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-accent-indigo" />
            <h2 className="text-sm font-semibold text-ink-primary">Recent Activity</h2>
          </div>
          <div className="space-y-1">
            {RECENT_ACTIVITY.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-canvas transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.type === 'success'
                        ? 'bg-accent-teal'
                        : item.type === 'warning'
                        ? 'bg-accent-amber'
                        : 'bg-accent-indigo'
                    }`}
                  />
                  <span className="text-xs text-ink-secondary">{item.action}</span>
                </div>
                <span className="text-[10px] text-ink-tertiary">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clear data (admin only) */}
      <div className="max-w-[960px] mx-auto px-6 pb-12">
        <button
          onClick={() => {
            if (confirm('Clear all local telemetry data?')) {
              clearEvents();
              window.location.reload();
            }
          }}
          className="text-[11px] text-ink-tertiary hover:text-accent-crimson transition-colors"
        >
          Clear local telemetry data
        </button>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function KpiCard({
  icon: Icon,
  label,
  value,
  change,
  positive,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  positive?: boolean;
}) {
  return (
    <div className="bg-surface border border-ink-wash rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5 text-ink-tertiary" />
        <span className="text-[10px] text-ink-tertiary uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-semibold text-ink-primary font-mono tracking-tight">{value}</p>
      <p className={`text-[10px] mt-1 ${positive ? 'text-accent-teal' : 'text-ink-tertiary'}`}>
        {change}
      </p>
    </div>
  );
}

function HealthRow({
  label,
  value,
  threshold,
  max = 100,
}: {
  label: string;
  value: number;
  threshold: number;
  max?: number;
}) {
  const pct = (value / max) * 100;
  const isGood = value >= threshold;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-ink-secondary">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-medium font-mono ${isGood ? 'text-accent-teal' : 'text-accent-amber'}`}>
            {value}{max === 100 ? '' : '%'}
          </span>
          {isGood ? (
            <UserCheck className="w-3 h-3 text-accent-teal" />
          ) : (
            <UserX className="w-3 h-3 text-accent-amber" />
          )}
        </div>
      </div>
      <div className="h-2 bg-canvas rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${isGood ? 'bg-accent-teal' : 'bg-accent-amber'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
