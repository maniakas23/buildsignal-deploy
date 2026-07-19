import {
  TrendingUp, AlertCircle, CheckCircle2, BarChart3, Users,
  MapPin, Activity, Zap, Globe, Radio, Clock, ArrowUpRight,
  ArrowDownRight, Shield, FileText, Lightbulb, Building2
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-18: Executive Dashboard
// Executive summary with highest-priority opportunities,
// system health, regional trends, and engagement metrics.
// ═══════════════════════════════════════════════════════════════

const EXECUTIVE_KPIS = [
  { label: 'Active Opportunities', value: '127', change: '+12', changeType: 'up' as const, icon: Lightbulb },
  { label: 'High-Confidence Signals', value: '34', change: '+5', changeType: 'up' as const, icon: Zap },
  { label: 'New This Week', value: '18', change: '-3', changeType: 'down' as const, icon: FileText },
  { label: 'System Uptime', value: '99.97%', change: '', changeType: 'neutral' as const, icon: Shield },
];

const TOP_OPPORTUNITIES = [
  {
    title: 'Highway 287 Expansion — New Commercial Corridor',
    county: 'Larimer County, CO',
    confidence: 94,
    impact: 'high' as const,
    type: 'DOT Project',
    estimatedValue: '$30-45M',
  },
  {
    title: 'Weld County School District — New Campus',
    county: 'Weld County, CO',
    confidence: 91,
    impact: 'high' as const,
    type: 'School Construction',
    estimatedValue: '$48M',
  },
  {
    title: 'Downtown Fort Collins — Mixed-Use Development',
    county: 'Larimer County, CO',
    confidence: 87,
    impact: 'medium' as const,
    type: 'Urban Development',
    estimatedValue: '$8-12M',
  },
  {
    title: 'Xcel Energy — Substation Upgrade Program',
    county: 'Adams County, CO',
    confidence: 89,
    impact: 'high' as const,
    type: 'Utilities',
    estimatedValue: '$22M',
  },
];

const REGIONAL_TRENDS = [
  { region: 'Front Range North', projects: 42, trend: '+18%', permits: 128, alerts: 23 },
  { region: 'Denver Metro', projects: 67, trend: '+24%', permits: 215, alerts: 41 },
  { region: 'Front Range South', projects: 31, trend: '+12%', permits: 94, alerts: 18 },
  { region: 'Eastern Plains', projects: 14, trend: '+8%', permits: 37, alerts: 9 },
  { region: 'Western Slope', projects: 22, trend: '+15%', permits: 61, alerts: 14 },
];

const PROVIDER_HEALTH = [
  { name: 'Permit Database', status: 'healthy' as const, latency: '120ms', lastSync: '2m ago' },
  { name: 'Planning Agendas', status: 'healthy' as const, latency: '85ms', lastSync: '5m ago' },
  { name: 'DOT Projects', status: 'healthy' as const, latency: '150ms', lastSync: '3m ago' },
  { name: 'Utility Filings', status: 'warning' as const, latency: '420ms', lastSync: '18m ago' },
  { name: 'School Construction', status: 'healthy' as const, latency: '95ms', lastSync: '8m ago' },
  { name: 'Capital Improvement', status: 'healthy' as const, latency: '110ms', lastSync: '4m ago' },
];

const ENGAGEMENT_METRICS = [
  { label: 'Active Users', value: '342', change: '+24 this week' },
  { label: 'Searches Today', value: '1,847', change: '+12% vs avg' },
  { label: 'Watchlist Updates', value: '89', change: '+15 today' },
  { label: 'Reports Generated', value: '56', change: '+8 this week' },
];

function StatusDot({ status }: { status: 'healthy' | 'warning' | 'critical' }) {
  const colors = { healthy: 'bg-emerald-500', warning: 'bg-amber-500', critical: 'bg-accent-crimson' };
  return <span className={`w-2 h-2 rounded-full ${colors[status]}`} />;
}

function ImpactDot({ impact }: { impact: 'high' | 'medium' | 'low' }) {
  const colors = { high: 'bg-accent-crimson', medium: 'bg-amber-500', low: 'bg-blue-500' };
  return <span className={`w-2 h-2 rounded-full ${colors[impact]}`} />;
}

export default function ExecutiveDashboard() {
  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {EXECUTIVE_KPIS.map((kpi) => (
          <div key={kpi.label} className="bg-surface border border-ink-wash rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className="w-4 h-4 text-accent-indigo" />
              {kpi.change && (
                <span className={`flex items-center text-[10px] font-medium ${
                  kpi.changeType === 'up' ? 'text-emerald-600' : kpi.changeType === 'down' ? 'text-amber-600' : 'text-ink-tertiary'
                }`}>
                  {kpi.changeType === 'up' && <ArrowUpRight className="w-3 h-3" />}
                  {kpi.changeType === 'down' && <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
                </span>
              )}
            </div>
            <div className="text-xl font-bold text-ink-primary">{kpi.value}</div>
            <div className="text-[10px] text-ink-tertiary mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Two-column: Top Opportunities + Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top opportunities */}
        <div className="lg:col-span-2 bg-surface border border-ink-wash rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-accent-indigo" />
            <h4 className="text-sm font-semibold text-ink-primary">Highest Priority Opportunities</h4>
          </div>
          <div className="space-y-2.5">
            {TOP_OPPORTUNITIES.map((opp, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-canvas rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  <ImpactDot impact={opp.impact} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold bg-accent-indigo/10 text-accent-indigo px-1.5 py-0.5 rounded-full">
                      {opp.type}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      opp.confidence >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {opp.confidence}%
                    </span>
                  </div>
                  <p className="text-[12px] font-medium text-ink-primary truncate">{opp.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-ink-tertiary flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" /> {opp.county}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      {opp.estimatedValue}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement metrics */}
        <div className="bg-surface border border-ink-wash rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-accent-indigo" />
            <h4 className="text-sm font-semibold text-ink-primary">Engagement</h4>
          </div>
          <div className="space-y-3">
            {ENGAGEMENT_METRICS.map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] text-ink-secondary">{m.label}</span>
                  <span className="text-[11px] font-semibold text-ink-primary">{m.value}</span>
                </div>
                <span className="text-[9px] text-emerald-600 font-medium">{m.change}</span>
              </div>
            ))}
          </div>

          {/* Quick system status */}
          <div className="mt-4 pt-3 border-t border-ink-wash/50">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-3.5 h-3.5 text-ink-tertiary" />
              <span className="text-[10px] font-medium text-ink-secondary">System Status</span>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusDot status="healthy" />
              <span className="text-[10px] text-emerald-600 font-medium">All systems operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Regional trends */}
      <div className="bg-surface border border-ink-wash rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-accent-indigo" />
          <h4 className="text-sm font-semibold text-ink-primary">Regional Growth Trends</h4>
        </div>
        <div className="space-y-2.5">
          {REGIONAL_TRENDS.map((region) => (
            <div key={region.region} className="flex items-center gap-3">
              <span className="text-[11px] font-medium text-ink-secondary w-[140px] sm:w-[160px] flex-shrink-0 truncate">
                {region.region}
              </span>
              <div className="flex-1 flex items-center gap-3">
                <div className="flex-1 h-2 bg-ink-wash/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-indigo rounded-full"
                    style={{ width: `${Math.min((region.projects / 80) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-ink-primary w-6 text-right">{region.projects}</span>
              </div>
              <span className="text-[10px] font-medium text-emerald-600 w-10 text-right">{region.trend}</span>
              <span className="text-[9px] text-ink-tertiary w-8 text-right hidden sm:inline">{region.permits}p</span>
              <span className="text-[9px] text-amber-600 w-8 text-right hidden sm:inline">{region.alerts}a</span>
            </div>
          ))}
        </div>
      </div>

      {/* Provider health */}
      <div className="bg-surface border border-ink-wash rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-accent-indigo" />
            <h4 className="text-sm font-semibold text-ink-primary">Provider Pipeline Health</h4>
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">5/6 healthy</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {PROVIDER_HEALTH.map((p) => (
            <div key={p.name} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
              <div className="flex items-center gap-2">
                <StatusDot status={p.status} />
                <span className="text-[11px] font-medium text-ink-secondary">{p.name}</span>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-medium ${p.status === 'healthy' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {p.latency}
                </span>
                <span className="text-[9px] text-ink-tertiary ml-1.5">{p.lastSync}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
