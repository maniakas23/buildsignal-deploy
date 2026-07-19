import { useState } from 'react';
import { Server, CheckCircle2, AlertTriangle, XCircle, Clock, TrendingUp, Database, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-11: Provider Health Monitor
// Real-time status of all data provider pipelines.
// ═══════════════════════════════════════════════════════════════

interface Provider {
  id: string;
  name: string;
  type: string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'paused';
  lastImport: string;
  nextImport: string;
  recordsToday: number;
  recordsTotal: number;
  avgLatency: string;
  errorRate: string;
  coverage: string;
  schedule: string;
}

const PROVIDERS: Provider[] = [
  { id: 'p1', name: 'Permit Database', type: 'Permits', status: 'healthy', lastImport: '3 min ago', nextImport: 'in 57 min', recordsToday: 1240, recordsTotal: 482000, avgLatency: '120ms', errorRate: '0.01%', coverage: '98%', schedule: 'Every hour' },
  { id: 'p2', name: 'Zoning Board Feed', type: 'Zoning', status: 'healthy', lastImport: '12 min ago', nextImport: 'in 48 min', recordsToday: 89, recordsTotal: 45200, avgLatency: '230ms', errorRate: '0.03%', coverage: '95%', schedule: 'Every hour' },
  { id: 'p3', name: 'Utility API', type: 'Utilities', status: 'healthy', lastImport: '7 min ago', nextImport: 'in 23 min', recordsToday: 2100, recordsTotal: 891000, avgLatency: '340ms', errorRate: '0.05%', coverage: '92%', schedule: 'Every 30 min' },
  { id: 'p4', name: 'Planning Documents', type: 'Planning', status: 'degraded', lastImport: '45 min ago', nextImport: 'in 15 min', recordsToday: 34, recordsTotal: 12800, avgLatency: '2.1s', errorRate: '1.2%', coverage: '88%', schedule: 'Every hour' },
  { id: 'p5', name: 'Public Notices', type: 'Notices', status: 'healthy', lastImport: '18 min ago', nextImport: 'in 42 min', recordsToday: 156, recordsTotal: 67800, avgLatency: '180ms', errorRate: '0.02%', coverage: '90%', schedule: 'Every hour' },
  { id: 'p6', name: 'Transportation Dept', type: 'Transport', status: 'healthy', lastImport: '22 min ago', nextImport: 'in 38 min', recordsToday: 67, recordsTotal: 23400, avgLatency: '450ms', errorRate: '0.08%', coverage: '85%', schedule: 'Every hour' },
  { id: 'p7', name: 'County Records', type: 'Records', status: 'healthy', lastImport: '5 min ago', nextImport: 'in 55 min', recordsToday: 3400, recordsTotal: 1200000, avgLatency: '890ms', errorRate: '0.01%', coverage: '96%', schedule: 'Every hour' },
  { id: 'p8', name: 'Federal Registry', type: 'Federal', status: 'paused', lastImport: '6 hrs ago', nextImport: 'in 18 hrs', recordsToday: 0, recordsTotal: 5400, avgLatency: '4.2s', errorRate: '2.1%', coverage: '72%', schedule: 'Daily' },
];

const StatusIcon = ({ status }: { status: Provider['status'] }) => {
  switch (status) {
    case 'healthy': return <CheckCircle2 className="w-4 h-4 text-accent-teal" />;
    case 'degraded': return <AlertTriangle className="w-4 h-4 text-accent-amber" />;
    case 'unhealthy': return <XCircle className="w-4 h-4 text-accent-crimson" />;
    case 'paused': return <Clock className="w-4 h-4 text-ink-tertiary" />;
  }
};

const StatusBadge = ({ status }: { status: Provider['status'] }) => {
  const styles = {
    healthy: 'bg-accent-teal/10 text-accent-teal',
    degraded: 'bg-accent-amber/10 text-accent-amber',
    unhealthy: 'bg-accent-crimson/10 text-accent-crimson',
    paused: 'bg-ink-wash text-ink-tertiary',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  );
};

interface Props {
  compact?: boolean;
}

export default function ProviderHealthMonitor({ compact = false }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const healthy = PROVIDERS.filter((p) => p.status === 'healthy').length;
  const degraded = PROVIDERS.filter((p) => p.status === 'degraded').length;
  const unhealthy = PROVIDERS.filter((p) => p.status === 'unhealthy').length;
  const paused = PROVIDERS.filter((p) => p.status === 'paused').length;
  const totalRecords = PROVIDERS.reduce((s, p) => s + p.recordsToday, 0);

  if (compact) {
    return (
      <div className="flex items-center gap-3 text-[11px]">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-accent-teal" />
          <span className="text-ink-primary font-medium">{healthy}</span>
          <span className="text-ink-tertiary">healthy</span>
        </div>
        {degraded > 0 && (
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-accent-amber" />
            <span className="text-accent-amber font-medium">{degraded}</span>
            <span className="text-ink-tertiary">degraded</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-accent-indigo" />
          <span className="text-ink-primary font-medium">{totalRecords.toLocaleString()}</span>
          <span className="text-ink-tertiary">records today</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-accent-teal" />
          <span className="text-sm font-medium text-ink-primary">{healthy}</span>
          <span className="text-xs text-ink-tertiary">healthy</span>
        </div>
        {degraded > 0 && (
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-accent-amber" />
            <span className="text-sm font-medium text-accent-amber">{degraded}</span>
            <span className="text-xs text-ink-tertiary">degraded</span>
          </div>
        )}
        {unhealthy > 0 && (
          <div className="flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-accent-crimson" />
            <span className="text-sm font-medium text-accent-crimson">{unhealthy}</span>
            <span className="text-xs text-ink-tertiary">unhealthy</span>
          </div>
        )}
        {paused > 0 && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-ink-tertiary" />
            <span className="text-sm font-medium text-ink-tertiary">{paused}</span>
            <span className="text-xs text-ink-tertiary">paused</span>
          </div>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <Database className="w-4 h-4 text-accent-indigo" />
          <span className="text-sm font-mono text-ink-primary">{totalRecords.toLocaleString()}</span>
          <span className="text-xs text-ink-tertiary">records imported today</span>
        </div>
      </div>

      {/* Provider list */}
      <div className="space-y-2">
        {PROVIDERS.map((provider) => {
          const isExpanded = expandedId === provider.id;
          return (
            <div
              key={provider.id}
              className={`rounded-xl border transition-colors ${
                provider.status === 'healthy' ? 'bg-surface border-ink-wash' :
                provider.status === 'degraded' ? 'bg-accent-amber/[0.02] border-accent-amber/15' :
                provider.status === 'unhealthy' ? 'bg-accent-crimson/[0.02] border-accent-crimson/15' :
                'bg-canvas border-ink-wash opacity-60'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : provider.id)}
                className="w-full flex items-center gap-3 p-3 text-left"
              >
                <StatusIcon status={provider.status} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink-primary">{provider.name}</span>
                    <StatusBadge status={provider.status} />
                  </div>
                  <p className="text-[11px] text-ink-secondary">{provider.type} · {provider.schedule}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-[11px] text-ink-tertiary">
                  <span>Latency: <strong className="text-ink-primary font-mono">{provider.avgLatency}</strong></span>
                  <span>Coverage: <strong className="text-accent-teal font-mono">{provider.coverage}</strong></span>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-ink-tertiary" /> : <ChevronDown className="w-4 h-4 text-ink-tertiary" />}
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-ink-wash">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                    <div><p className="text-[10px] text-ink-tertiary">Last Import</p><p className="text-xs text-ink-primary">{provider.lastImport}</p></div>
                    <div><p className="text-[10px] text-ink-tertiary">Next Import</p><p className="text-xs text-ink-primary">{provider.nextImport}</p></div>
                    <div><p className="text-[10px] text-ink-tertiary">Records Today</p><p className="text-xs font-mono text-ink-primary">{provider.recordsToday.toLocaleString()}</p></div>
                    <div><p className="text-[10px] text-ink-tertiary">Total Records</p><p className="text-xs font-mono text-ink-primary">{provider.recordsTotal.toLocaleString()}</p></div>
                    <div><p className="text-[10px] text-ink-tertiary">Avg Latency</p><p className="text-xs font-mono text-ink-primary">{provider.avgLatency}</p></div>
                    <div><p className="text-[10px] text-ink-tertiary">Error Rate</p><p className={`text-xs font-mono ${parseFloat(provider.errorRate) > 1 ? 'text-accent-crimson' : 'text-accent-teal'}`}>{provider.errorRate}</p></div>
                    <div><p className="text-[10px] text-ink-tertiary">Coverage</p><p className="text-xs font-mono text-accent-teal">{provider.coverage}</p></div>
                    <div><p className="text-[10px] text-ink-tertiary">Schedule</p><p className="text-xs text-ink-primary">{provider.schedule}</p></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
