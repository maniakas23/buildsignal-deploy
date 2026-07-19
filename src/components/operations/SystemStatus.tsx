import { Activity, CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { useHealthCheck } from '@/hooks/useHealthCheck';

interface Props {
  compact?: boolean;
  autoCheck?: boolean;
}

export default function SystemStatus({ compact = false, autoCheck = true }: Props) {
  const { overall, healthyCount, degradedCount, unhealthyCount, endpoints, lastRun, runCheck, running } =
    useHealthCheck(autoCheck, 30000);

  const iconMap = {
    healthy: <CheckCircle2 className="w-4 h-4 text-accent-teal" />,
    degraded: <AlertTriangle className="w-4 h-4 text-accent-amber" />,
    unhealthy: <XCircle className="w-4 h-4 text-accent-crimson" />,
    checking: <Loader2 className="w-4 h-4 text-ink-tertiary animate-spin" />,
  };

  const labelMap = {
    healthy: 'All Systems Operational',
    degraded: 'Some Services Degraded',
    unhealthy: 'Service Disruption',
    checking: 'Checking...',
  };

  const badgeColor = {
    healthy: 'bg-accent-teal/10 text-accent-teal border-accent-teal/20',
    degraded: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
    unhealthy: 'bg-accent-crimson/10 text-accent-crimson border-accent-crimson/20',
    checking: 'bg-ink-wash/50 text-ink-tertiary border-ink-wash',
  };

  if (compact) {
    return (
      <button
        onClick={runCheck}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${badgeColor[overall]}`}
        title={labelMap[overall]}
      >
        {running ? <Loader2 className="w-3 h-3 animate-spin" /> : iconMap[overall]}
        <span className="hidden sm:inline">{labelMap[overall]}</span>
        {overall === 'healthy' && (
          <span className="text-[10px] opacity-60">{healthyCount}/{endpoints.length}</span>
        )}
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall status */}
      <div className={`flex items-center justify-between p-4 rounded-xl border ${badgeColor[overall]}`}>
        <div className="flex items-center gap-3">
          {iconMap[overall]}
          <div>
            <p className="text-sm font-medium">{labelMap[overall]}</p>
            <p className="text-[11px] opacity-70">
              {healthyCount} healthy{degradedCount > 0 ? ` · ${degradedCount} degraded` : ''}
              {unhealthyCount > 0 ? ` · ${unhealthyCount} down` : ''}
            </p>
          </div>
        </div>
        <button
          onClick={runCheck}
          disabled={running}
          className="p-2 rounded-lg hover:bg-black/5 transition-colors disabled:opacity-50"
          title="Refresh check"
        >
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
        </button>
      </div>

      {/* Endpoint breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {endpoints.map((ep) => (
          <div
            key={ep.name}
            className={`flex items-center justify-between p-2.5 rounded-lg border ${
              ep.status === 'healthy'
                ? 'bg-accent-teal/[0.02] border-accent-teal/10'
                : ep.status === 'degraded'
                  ? 'bg-accent-amber/[0.02] border-accent-amber/10'
                  : ep.status === 'unhealthy'
                    ? 'bg-accent-crimson/[0.02] border-accent-crimson/10'
                    : 'bg-canvas border-ink-wash'
            }`}
          >
            <div className="flex items-center gap-2">
              {ep.status === 'healthy' && <CheckCircle2 className="w-3.5 h-3.5 text-accent-teal flex-shrink-0" />}
              {ep.status === 'degraded' && <AlertTriangle className="w-3.5 h-3.5 text-accent-amber flex-shrink-0" />}
              {ep.status === 'unhealthy' && <XCircle className="w-3.5 h-3.5 text-accent-crimson flex-shrink-0" />}
              {ep.status === 'checking' && <Loader2 className="w-3.5 h-3.5 text-ink-tertiary animate-spin flex-shrink-0" />}
              <span className="text-xs text-ink-primary">{ep.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {ep.message && <span className="text-[10px] text-accent-crimson">{ep.message}</span>}
              {ep.latency > 0 && <span className="text-[10px] font-mono text-ink-tertiary">{ep.latency}ms</span>}
            </div>
          </div>
        ))}
      </div>

      {lastRun > 0 && (
        <p className="text-[10px] text-ink-tertiary text-center">
          Last checked: {new Date(lastRun).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
