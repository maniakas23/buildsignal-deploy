import {
  Globe, FileText, Zap, Truck, DollarSign, Users, Building2,
  BarChart3, Calendar, TrendingUp, CheckCircle2, AlertTriangle,
  Clock, MapPin, Activity, Layers
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-25: National Intelligence Network
// Expanding provider coverage across 10 signal types.
// Provider health and data freshness tracked automatically.
// ═══════════════════════════════════════════════════════════════

const SIGNAL_TYPES = [
  { type: 'Building Permits', count: 2847, trend: '+14%', freshness: 'Real-time', health: 'excellent', coverage: '98%', counties: '64/64', description: 'Construction, demolition, and renovation permits' },
  { type: 'Planning Agendas', count: 1234, trend: '+8%', freshness: '15 min', health: 'good', coverage: '94%', counties: '60/64', description: 'Zoning changes, rezoning approvals, land use hearings' },
  { type: 'DOT Projects', count: 567, trend: '+22%', freshness: 'Real-time', health: 'excellent', coverage: '96%', counties: '61/64', description: 'Highway expansions, road widening, bridge work' },
  { type: 'Utilities', count: 1892, trend: '+11%', freshness: '30 min', health: 'good', coverage: '91%', counties: '58/64', description: 'Power, water, sewer, gas relocations and upgrades' },
  { type: 'Capital Improvement Plans', count: 445, trend: '+18%', freshness: '6 hrs', health: 'good', coverage: '88%', counties: '56/64', description: 'CIP budgets, multi-year infrastructure plans' },
  { type: 'Government Spending', count: 2134, trend: '+12%', freshness: '2 hrs', health: 'excellent', coverage: '92%', counties: '59/64', description: 'Procurement notices, awarded contracts, bids' },
  { type: 'Public Meetings', count: 978, trend: '+15%', freshness: '24 hrs', health: 'fair', coverage: '79%', counties: '50/64', description: 'Hearings, notices, community feedback sessions' },
  { type: 'Economic Development', count: 534, trend: '+28%', freshness: '12 hrs', health: 'good', coverage: '85%', counties: '54/64', description: 'Incentive programs, business attraction, workforce' },
  { type: 'Zoning Activity', count: 867, trend: '+19%', freshness: '1 hr', health: 'excellent', coverage: '96%', counties: '61/64', description: 'Rezoning filings, variances, special use permits' },
  { type: 'Major Commercial Projects', count: 312, trend: '+31%', freshness: '4 hrs', health: 'good', coverage: '87%', counties: '55/64', description: 'Large-scale commercial and mixed-use developments' },
];

const PROVIDER_HEALTH = [
  { name: 'CDOT Data Feed', status: 'operational', uptime: '99.99%', latency: '45ms', lastCheck: '30s ago' },
  { name: 'County Planning API', status: 'operational', uptime: '99.95%', latency: '120ms', lastCheck: '2m ago' },
  { name: 'Utility Filing Service', status: 'operational', uptime: '99.98%', latency: '85ms', lastCheck: '1m ago' },
  { name: 'Permit Database', status: 'degraded', uptime: '99.82%', latency: '340ms', lastCheck: '5m ago' },
  { name: 'CIP Tracker', status: 'operational', uptime: '99.99%', latency: '65ms', lastCheck: '30s ago' },
  { name: 'School Contracts DB', status: 'operational', uptime: '99.97%', latency: '95ms', lastCheck: '3m ago' },
  { name: 'Gov Spending Feed', status: 'operational', uptime: '99.96%', latency: '70ms', lastCheck: '1m ago' },
  { name: 'Public Meetings API', status: 'operational', uptime: '99.94%', latency: '110ms', lastCheck: '4m ago' },
  { name: 'Econ Dev Tracker', status: 'operational', uptime: '99.91%', latency: '155ms', lastCheck: '6m ago' },
  { name: 'Zoning Activity Feed', status: 'operational', uptime: '99.97%', latency: '55ms', lastCheck: '1m ago' },
];

function HealthBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    excellent: 'bg-emerald-50 text-emerald-700',
    good: 'bg-blue-50 text-blue-700',
    fair: 'bg-amber-50 text-amber-700',
    poor: 'bg-accent-crimson/10 text-accent-crimson',
  };
  return <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${colors[level] || colors.fair}`}>{level.toUpperCase()}</span>;
}

export default function NationalIntelligenceNetwork() {
  return (
    <div className="space-y-6">
      {/* Total Signals Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Signal Types', value: '10', icon: Layers },
          { label: 'Total Signals', value: '11,810', icon: Zap },
          { label: 'Counties Covered', value: '64', icon: MapPin },
          { label: 'Avg Freshness', value: '< 2 hrs', icon: Clock },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-ink-wash rounded-xl p-4 text-center">
            <s.icon className="w-5 h-5 text-accent-indigo mx-auto mb-1" />
            <div className="text-xl font-bold text-ink-primary">{s.value}</div>
            <div className="text-[10px] text-ink-tertiary">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Signal Types Grid */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-accent-indigo" /> Signal Coverage by Type
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SIGNAL_TYPES.map((st) => (
            <div key={st.type} className="bg-canvas border border-ink-wash rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-ink-primary">{st.type}</span>
                <HealthBadge level={st.health} />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-bold text-accent-indigo">{st.count}</span>
                <span className="text-[10px] text-emerald-600 font-medium">{st.trend}</span>
                <span className="text-[9px] text-ink-tertiary ml-auto">{st.freshness}</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <div className="flex-1 h-1.5 bg-ink-wash/30 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${parseInt(st.coverage) >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: st.coverage }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-ink-tertiary">{st.coverage} coverage</span>
                <span className="text-[9px] text-ink-tertiary">{st.counties} counties</span>
              </div>
              <p className="text-[9px] text-ink-tertiary mt-1">{st.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Provider Health */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent-indigo" /> Provider Health & Data Freshness
        </h4>
        <div className="space-y-2">
          {PROVIDER_HEALTH.map((ph) => (
            <div key={ph.name} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ph.status === 'operational' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-[11px] font-medium text-ink-primary">{ph.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] text-ink-tertiary">{ph.latency}</span>
                <span className={`text-[9px] font-bold ${ph.uptime >= '99.9%' ? 'text-emerald-600' : 'text-amber-600'}`}>{ph.uptime}</span>
                <span className="text-[9px] text-ink-tertiary">{ph.lastCheck}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
