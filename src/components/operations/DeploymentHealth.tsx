import { Rocket, CheckCircle2, AlertTriangle, XCircle, Server, Database, Globe, Shield, Activity, TrendingUp, Clock } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-12: Deployment Health Indicator
// Shows deployment status with clear pass/fail indicators.
// ═══════════════════════════════════════════════════════════════

interface DeploymentCheck {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'warning';
  detail: string;
  icon: React.ReactNode;
}

const DEPLOYMENT_CHECKS: DeploymentCheck[] = [
  { id: 'd1', name: 'Frontend Deploy', status: 'pass', detail: 'Build v2.1.0 live on Cloudflare Pages', icon: <Globe className="w-4 h-4" /> },
  { id: 'd2', name: 'API Functions', status: 'pass', detail: '31 tRPC routers responding', icon: <Server className="w-4 h-4" /> },
  { id: 'd3', name: 'D1 Database', status: 'pass', detail: '30 tables, all migrations current', icon: <Database className="w-4 h-4" /> },
  { id: 'd4', name: 'KV Cache', status: 'pass', detail: 'Session and config KV active', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'd5', name: 'SSL Certificate', status: 'pass', detail: 'Valid until 2026-12-15', icon: <Shield className="w-4 h-4" /> },
  { id: 'd6', name: 'Health Endpoint', status: 'pass', detail: '/api/health returns 200ms', icon: <Activity className="w-4 h-4" /> },
  { id: 'd7', name: 'Queue Depth', status: 'warning', detail: 'Signal queue: 234 items (elevated)', icon: <Clock className="w-4 h-4" /> },
  { id: 'd8', name: 'Error Rate', status: 'pass', detail: '0.08% over last 24 hours', icon: <AlertTriangle className="w-4 h-4" /> },
];

interface Props {
  compact?: boolean;
}

export default function DeploymentHealth({ compact = false }: Props) {
  const passCount = DEPLOYMENT_CHECKS.filter((d) => d.status === 'pass').length;
  const failCount = DEPLOYMENT_CHECKS.filter((d) => d.status === 'fail').length;
  const warnCount = DEPLOYMENT_CHECKS.filter((d) => d.status === 'warning').length;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Rocket className="w-4 h-4 text-accent-indigo" />
        <span className="text-sm font-medium text-ink-primary">{passCount}/{DEPLOYMENT_CHECKS.length}</span>
        <span className="text-[11px] text-ink-tertiary">checks passing</span>
        {warnCount > 0 && (
          <span className="flex items-center gap-1 text-[11px] text-accent-amber">
            <AlertTriangle className="w-3 h-3" /> {warnCount} warning{warnCount > 1 ? 's' : ''}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Rocket className="w-4 h-4 text-accent-indigo" />
          <span className="text-sm font-semibold text-ink-primary">Deployment Status</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-accent-teal" />
          <span className="text-sm font-medium text-accent-teal">{passCount}</span>
          <span className="text-xs text-ink-tertiary">pass</span>
        </div>
        {warnCount > 0 && (
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-accent-amber" />
            <span className="text-sm font-medium text-accent-amber">{warnCount}</span>
            <span className="text-xs text-ink-tertiary">warn</span>
          </div>
        )}
        {failCount > 0 && (
          <div className="flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-accent-crimson" />
            <span className="text-sm font-medium text-accent-crimson">{failCount}</span>
            <span className="text-xs text-ink-tertiary">fail</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {DEPLOYMENT_CHECKS.map((check) => (
          <div
            key={check.id}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              check.status === 'pass' ? 'bg-accent-teal/[0.02] border-accent-teal/10' :
              check.status === 'warning' ? 'bg-accent-amber/[0.02] border-accent-amber/10' :
              'bg-accent-crimson/[0.02] border-accent-crimson/10'
            }`}
          >
            <span className={
              check.status === 'pass' ? 'text-accent-teal' :
              check.status === 'warning' ? 'text-accent-amber' :
              'text-accent-crimson'
            }>
              {check.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-ink-primary">{check.name}</p>
              <p className="text-[10px] text-ink-secondary">{check.detail}</p>
            </div>
            {check.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-accent-teal flex-shrink-0" />}
            {check.status === 'warning' && <AlertTriangle className="w-4 h-4 text-accent-amber flex-shrink-0" />}
            {check.status === 'fail' && <XCircle className="w-4 h-4 text-accent-crimson flex-shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}
