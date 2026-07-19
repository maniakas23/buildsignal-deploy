import { useState } from 'react';
import {
  Activity, TrendingUp, Clock, Database, Server, Bell,
  CheckCircle2, AlertTriangle, XCircle, Users, Zap,
  FileText, Settings, Shield, RefreshCw, BarChart3,
  ChevronDown, ChevronUp, Loader2, Radio, HardDrive
} from 'lucide-react';
import SystemStatus from '@/components/operations/SystemStatus';
import WorkflowValidator from '@/components/operations/WorkflowValidator';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useTelemetry, getTelemetrySummary } from '@/hooks/useTelemetry';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'indigo' | 'teal' | 'amber' | 'crimson';
}

function MetricCard({ title, value, subtitle, icon, color = 'indigo' }: MetricCardProps) {
  const colorMap = {
    indigo: 'bg-accent-indigo/10 text-accent-indigo',
    teal: 'bg-accent-teal/10 text-accent-teal',
    amber: 'bg-accent-amber/10 text-accent-amber',
    crimson: 'bg-accent-crimson/10 text-accent-crimson',
  };

  return (
    <div className="bg-surface rounded-xl p-4 border border-ink-wash">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-ink-tertiary uppercase tracking-wider">{title}</span>
        <span className={`p-1.5 rounded-lg ${colorMap[color]}`}>{icon}</span>
      </div>
      <p className="text-xl font-semibold text-ink-primary font-mono">{value}</p>
      {subtitle && <p className="text-[11px] text-ink-tertiary mt-1">{subtitle}</p>}
    </div>
  );
}

interface PipelineMetric {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency: string;
  throughput: string;
  lastRun: string;
}

const PIPELINE_METRICS: PipelineMetric[] = [
  { name: 'Provider Sync', status: 'healthy', latency: '1.2s', throughput: '2,400/hr', lastRun: '2 min ago' },
  { name: 'Signal Ingestion', status: 'healthy', latency: '340ms', throughput: '18,000/hr', lastRun: '30s ago' },
  { name: 'Scoring Engine', status: 'healthy', latency: '120ms', throughput: '4,200/hr', lastRun: '1 min ago' },
  { name: 'Alert Generator', status: 'healthy', latency: '85ms', throughput: '890/hr', lastRun: '5 min ago' },
  { name: 'Report Builder', status: 'healthy', latency: '2.1s', throughput: '120/hr', lastRun: '12 min ago' },
  { name: 'Pattern Detection', status: 'degraded', latency: '4.8s', throughput: '45/hr', lastRun: '18 min ago' },
  { name: 'Email Digest', status: 'healthy', latency: '890ms', throughput: '2,400/hr', lastRun: '1 hr ago' },
  { name: 'Data Cleanup', status: 'healthy', latency: '12s', throughput: 'N/A', lastRun: '6 hrs ago' },
];

const CUSTOMER_METRICS = {
  activeUsers: '1,247',
  newToday: '23',
  weeklyActive: '892',
  retentionRate: '78%',
  avgSessionDuration: '14m 32s',
  topFeature: 'Dashboard',
  supportTickets: '4',
  avgResponseTime: '< 2 hrs',
};

export default function OperationsCenterPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'pipelines' | 'customers' | 'api' | 'workflows'>('overview');
  const [expandedPipeline, setExpandedPipeline] = useState<string | null>(null);

  const { vitals, apiStats } = usePerformanceMonitor();
  const telemetry = getTelemetrySummary();

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'pipelines' as const, label: 'Pipelines', icon: <Server className="w-3.5 h-3.5" /> },
    { id: 'customers' as const, label: 'Customers', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'api' as const, label: 'API Health', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'workflows' as const, label: 'Workflows', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-canvas">
      <section className="bg-surface border-b border-ink-wash">
        <div className="max-w-content mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-accent-indigo/10 flex items-center justify-center">
              <Activity className="w-4.5 h-4.5 text-accent-indigo" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-ink-primary">Operations Center</h1>
              <p className="text-[11px] text-ink-tertiary">Platform health, pipeline status, and customer metrics</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-content mx-auto px-6 pt-4">
        <div className="flex items-center gap-1 border-b border-ink-wash mb-6">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id ? 'border-accent-indigo text-accent-indigo' : 'border-transparent text-ink-tertiary hover:text-ink-secondary'
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 pb-16">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <section>
              <h2 className="text-sm font-semibold text-ink-primary mb-3 flex items-center gap-2">
                <Radio className="w-4 h-4 text-accent-teal" /> System Status
              </h2>
              <SystemStatus autoCheck />
            </section>

            <section>
              <h2 className="text-sm font-semibold text-ink-primary mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-accent-indigo" /> Key Metrics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard title="Active Signals" value="156,240" subtitle="Processing now" icon={<Zap className="w-4 h-4" />} color="indigo" />
                <MetricCard title="API Avg Latency" value={`${apiStats.avgLatency || 42}ms`} subtitle={`P95: ${apiStats.p95Latency || 120}ms`} icon={<Clock className="w-4 h-4" />} color="teal" />
                <MetricCard title="Active Users" value={CUSTOMER_METRICS.activeUsers} subtitle={`+${CUSTOMER_METRICS.newToday} today`} icon={<Users className="w-4 h-4" />} color="amber" />
                <MetricCard title="Error Rate" value={`${apiStats.errorRate || 0.3}%`} subtitle={`${apiStats.totalCalls || 0} total calls`} icon={<AlertTriangle className="w-4 h-4" />} color="crimson" />
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-ink-primary mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent-indigo" /> Core Web Vitals
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {([
                  { label: 'LCP', value: vitals.lcp ? `${vitals.lcp}ms` : '—', target: '< 2.5s', good: (vitals.lcp || 0) < 2500 },
                  { label: 'FID', value: vitals.fid ? `${vitals.fid}ms` : '—', target: '< 100ms', good: (vitals.fid || 0) < 100 },
                  { label: 'CLS', value: vitals.cls !== null ? `${vitals.cls}` : '—', target: '< 0.1', good: (vitals.cls || 0) < 0.1 },
                  { label: 'FCP', value: vitals.fcp ? `${vitals.fcp}ms` : '—', target: '< 1.8s', good: (vitals.fcp || 0) < 1800 },
                  { label: 'TTFB', value: vitals.ttfb ? `${vitals.ttfb}ms` : '—', target: '< 600ms', good: (vitals.ttfb || 0) < 600 },
                ]).map((vital) => (
                  <div key={vital.label} className="bg-surface rounded-xl p-4 border border-ink-wash">
                    <p className="text-[10px] text-ink-tertiary uppercase tracking-wider">{vital.label}</p>
                    <p className={`text-lg font-semibold font-mono mt-1 ${vital.good ? 'text-accent-teal' : 'text-accent-amber'}`}>{vital.value}</p>
                    <p className="text-[10px] text-ink-tertiary mt-0.5">Target: {vital.target}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-ink-primary mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent-indigo" /> Telemetry Summary
              </h2>
              <div className="bg-surface rounded-xl p-5 border border-ink-wash">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><p className="text-[10px] text-ink-tertiary uppercase tracking-wider">Total Events</p><p className="text-lg font-semibold text-ink-primary font-mono">{telemetry.totalEvents}</p></div>
                  <div><p className="text-[10px] text-ink-tertiary uppercase tracking-wider">Today</p><p className="text-lg font-semibold text-ink-primary font-mono">{telemetry.today}</p></div>
                  <div><p className="text-[10px] text-ink-tertiary uppercase tracking-wider">This Week</p><p className="text-lg font-semibold text-ink-primary font-mono">{telemetry.thisWeek}</p></div>
                  <div><p className="text-[10px] text-ink-tertiary uppercase tracking-wider">Top Event</p><p className="text-sm font-medium text-ink-primary">{Object.entries(telemetry.byType).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || '—'}</p></div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'pipelines' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink-primary flex items-center gap-2">
                <Server className="w-4 h-4 text-accent-indigo" /> Background Pipelines
              </h2>
              <span className="text-[11px] text-ink-tertiary">{PIPELINE_METRICS.filter((p) => p.status === 'healthy').length}/{PIPELINE_METRICS.length} healthy</span>
            </div>
            <div className="space-y-2">
              {PIPELINE_METRICS.map((pipe) => (
                <div key={pipe.name} className={`rounded-xl border transition-colors ${
                  pipe.status === 'healthy' ? 'bg-surface border-ink-wash' : 'bg-accent-amber/[0.02] border-accent-amber/20'
                }`}>
                  <button onClick={() => setExpandedPipeline(expandedPipeline === pipe.name ? null : pipe.name)}
                    className="w-full flex items-center gap-3 p-3 text-left">
                    {pipe.status === 'healthy' ? <CheckCircle2 className="w-4 h-4 text-accent-teal flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 text-accent-amber flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-ink-primary">{pipe.name}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${pipe.status === 'healthy' ? 'bg-accent-teal/10 text-accent-teal' : 'bg-accent-amber/10 text-accent-amber'}`}>{pipe.status}</span>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-[11px] text-ink-tertiary">
                      <span>Latency: <strong className="text-ink-primary font-mono">{pipe.latency}</strong></span>
                      <span>Throughput: <strong className="text-ink-primary font-mono">{pipe.throughput}</strong></span>
                    </div>
                    {expandedPipeline === pipe.name ? <ChevronUp className="w-4 h-4 text-ink-tertiary" /> : <ChevronDown className="w-4 h-4 text-ink-tertiary" />}
                  </button>
                  {expandedPipeline === pipe.name && (
                    <div className="px-3 pb-3 pt-1 border-t border-ink-wash">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                        <div><p className="text-[10px] text-ink-tertiary">Status</p><p className="text-xs font-medium text-ink-primary capitalize">{pipe.status}</p></div>
                        <div><p className="text-[10px] text-ink-tertiary">Latency</p><p className="text-xs font-mono text-ink-primary">{pipe.latency}</p></div>
                        <div><p className="text-[10px] text-ink-tertiary">Throughput</p><p className="text-xs font-mono text-ink-primary">{pipe.throughput}</p></div>
                        <div><p className="text-[10px] text-ink-tertiary">Last Run</p><p className="text-xs text-ink-primary">{pipe.lastRun}</p></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard title="Active Users" value={CUSTOMER_METRICS.activeUsers} subtitle={`+${CUSTOMER_METRICS.newToday} today`} icon={<Users className="w-4 h-4" />} color="indigo" />
              <MetricCard title="Weekly Active" value={CUSTOMER_METRICS.weeklyActive} subtitle="72% of total" icon={<Activity className="w-4 h-4" />} color="teal" />
              <MetricCard title="Retention" value={CUSTOMER_METRICS.retentionRate} subtitle="30-day retention" icon={<TrendingUp className="w-4 h-4" />} color="amber" />
              <MetricCard title="Avg Session" value={CUSTOMER_METRICS.avgSessionDuration} subtitle="Last 7 days" icon={<Clock className="w-4 h-4" />} color="indigo" />
            </div>

            <div className="bg-surface rounded-xl p-5 border border-ink-wash">
              <h3 className="text-sm font-semibold text-ink-primary mb-4">Customer Activity</h3>
              <div className="space-y-3">
                {[
                  { feature: 'Dashboard Views', count: '4,231', pct: 92 },
                  { feature: 'Map Explorations', count: '2,104', pct: 68 },
                  { feature: 'Searches Performed', count: '1,892', pct: 54 },
                  { feature: 'Reports Generated', count: '678', pct: 32 },
                  { feature: 'Alerts Configured', count: '445', pct: 21 },
                ].map((item) => (
                  <div key={item.feature}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-ink-secondary">{item.feature}</span>
                      <span className="text-xs font-mono text-ink-primary">{item.count}</span>
                    </div>
                    <div className="h-2 bg-canvas rounded-full overflow-hidden">
                      <div className="h-full bg-accent-indigo rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-surface rounded-xl p-4 border border-ink-wash">
                <p className="text-[10px] text-ink-tertiary uppercase tracking-wider mb-1">Support Tickets</p>
                <p className="text-2xl font-semibold text-ink-primary font-mono">{CUSTOMER_METRICS.supportTickets}</p>
                <p className="text-[11px] text-accent-teal">Avg response: {CUSTOMER_METRICS.avgResponseTime}</p>
              </div>
              <div className="bg-surface rounded-xl p-4 border border-ink-wash">
                <p className="text-[10px] text-ink-tertiary uppercase tracking-wider mb-1">Top Feature</p>
                <p className="text-2xl font-semibold text-ink-primary font-mono">{CUSTOMER_METRICS.topFeature}</p>
                <p className="text-[11px] text-ink-tertiary">Most used this week</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && <div className="space-y-4"><SystemStatus autoCheck /></div>}
        {activeTab === 'workflows' && <WorkflowValidator />}
      </div>
    </div>
  );
}
