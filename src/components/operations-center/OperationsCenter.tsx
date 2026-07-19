import {
  Activity, Server, Zap, TrendingUp, Users, Clock,
  CheckCircle2, AlertTriangle, Shield, Globe, BarChart3,
  Layers, FileText, Brain, DollarSign, Bookmark,
  ArrowUp, ArrowDown, Minus
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-24: Operations Center
// Executive-level monitoring for: provider uptime, pipeline
// throughput, recommendation quality, API health, search latency,
// AI processing, customer engagement, subscription health,
// infrastructure coverage, system reliability.
// ═══════════════════════════════════════════════════════════════

const SYSTEM_HEALTH = {
  overall: 'operational',
  uptime: '99.97%',
  lastIncident: '14 days ago',
  activeAlerts: 2,
  resolvedToday: 5,
};

const PROVIDER_STATUS = [
  { name: 'CDOT Data Feed', status: 'operational', latency: '45ms', uptime: '99.99%' },
  { name: 'County Planning API', status: 'operational', latency: '120ms', uptime: '99.95%' },
  { name: 'Utility Filing Service', status: 'operational', latency: '85ms', uptime: '99.98%' },
  { name: 'Permit Database', status: 'degraded', latency: '340ms', uptime: '99.82%' },
  { name: 'CIP Tracker', status: 'operational', latency: '65ms', uptime: '99.99%' },
  { name: 'School Contracts DB', status: 'operational', latency: '95ms', uptime: '99.97%' },
  { name: 'Gov Spending Feed', status: 'operational', latency: '70ms', uptime: '99.96%' },
  { name: 'Public Meetings API', status: 'operational', latency: '110ms', uptime: '99.94%' },
];

const PIPELINE_METRICS = [
  { label: 'Signals Processed', value: '2.4M', trend: 'up', change: '+18%', detail: 'Daily signal ingestion' },
  { label: 'Opportunities Discovered', value: '1,247', trend: 'up', change: '+24%', detail: 'This month' },
  { label: 'Recommendations Generated', value: '3,891', trend: 'up', change: '+31%', detail: 'This month' },
  { label: 'Avg Processing Time', value: '2.3s', trend: 'down', change: '-15%', detail: 'AI pipeline latency' },
];

const RECOMMENDATION_QUALITY = [
  { metric: 'Accuracy Rate', value: '91%', target: '85%', trend: 'up' },
  { metric: 'Customer Action Rate', value: '67%', target: '60%', trend: 'up' },
  { metric: 'Confidence Calibration', value: '±3.2%', target: '±5%', trend: 'up' },
  { metric: 'False Positive Rate', value: '4.1%', target: '<5%', trend: 'down' },
  { metric: 'Explanation Quality', value: '4.6/5', target: '4.0', trend: 'up' },
];

const API_HEALTH = [
  { endpoint: 'GET /api/opportunities', requests: '45,231', latency: '45ms', errors: '0.02%', status: 'healthy' },
  { endpoint: 'POST /api/search', requests: '23,891', latency: '120ms', errors: '0.08%', status: 'healthy' },
  { endpoint: 'GET /api/signals', requests: '67,432', latency: '35ms', errors: '0.01%', status: 'healthy' },
  { endpoint: 'POST /api/ai/briefing', requests: '12,456', latency: '2.3s', errors: '0.12%', status: 'healthy' },
  { endpoint: 'GET /api/regions', requests: '34,123', latency: '25ms', errors: '0.03%', status: 'healthy' },
];

const CUSTOMER_ENGAGEMENT = [
  { label: 'Daily Active Users', value: '234', trend: 'up', change: '+18%' },
  { label: 'Avg Session Duration', value: '18 min', trend: 'up', change: '+22%' },
  { label: 'Actions Per Session', value: '4.2', trend: 'up', change: '+15%' },
  { label: 'Return Rate (7d)', value: '78%', trend: 'up', change: '+8%' },
  { label: 'Feature Adoption', value: '82%', trend: 'up', change: '+12%' },
];

const SUBSCRIPTION_HEALTH = [
  { tier: 'Enterprise', customers: 12, mrr: '$24,000', churn: '0%', expansion: '+$4,200' },
  { tier: 'Professional', customers: 34, mrr: '$27,200', churn: '2.9%', expansion: '+$3,400' },
  { tier: 'Starter', customers: 89, mrr: '$17,800', churn: '5.6%', expansion: '+$1,200' },
];

const INFRASTRUCTURE_COVERAGE = [
  { source: 'DOT Filings', coverage: '98%', counties: '64/64', lastUpdate: 'Real-time' },
  { source: 'County Planning', coverage: '94%', counties: '60/64', lastUpdate: '15 min' },
  { source: 'Utility Permits', coverage: '91%', counties: '58/64', lastUpdate: '30 min' },
  { source: 'Building Permits', coverage: '96%', counties: '61/64', lastUpdate: '1 hr' },
  { source: 'CIP Budgets', coverage: '88%', counties: '56/64', lastUpdate: '6 hrs' },
  { source: 'School Contracts', coverage: '85%', counties: '54/64', lastUpdate: '12 hrs' },
  { source: 'Gov Spending', coverage: '92%', counties: '59/64', lastUpdate: '2 hrs' },
  { source: 'Public Meetings', coverage: '79%', counties: '50/64', lastUpdate: '24 hrs' },
];

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up') return <ArrowUp className="w-3 h-3 text-emerald-500" />;
  if (trend === 'down') return <ArrowDown className="w-3 h-3 text-accent-crimson" />;
  return <Minus className="w-3 h-3 text-ink-tertiary" />;
}

export default function OperationsCenter() {
  return (
    <div className="space-y-6">
      {/* System Health Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-emerald-800">System Health</h3>
            <span className="text-[10px] font-bold bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">
              {SYSTEM_HEALTH.overall.toUpperCase()}
            </span>
          </div>
          <span className="text-[10px] text-emerald-600">{SYSTEM_HEALTH.uptime} uptime</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-white border border-emerald-200 rounded-lg p-2.5 text-center">
            <div className="text-lg font-bold text-emerald-700">{SYSTEM_HEALTH.uptime}</div>
            <div className="text-[8px] text-emerald-600">Uptime</div>
          </div>
          <div className="bg-white border border-emerald-200 rounded-lg p-2.5 text-center">
            <div className="text-lg font-bold text-emerald-700">{SYSTEM_HEALTH.activeAlerts}</div>
            <div className="text-[8px] text-emerald-600">Active Alerts</div>
          </div>
          <div className="bg-white border border-emerald-200 rounded-lg p-2.5 text-center">
            <div className="text-lg font-bold text-emerald-700">{SYSTEM_HEALTH.resolvedToday}</div>
            <div className="text-[8px] text-emerald-600">Resolved Today</div>
          </div>
          <div className="bg-white border border-emerald-200 rounded-lg p-2.5 text-center">
            <div className="text-[11px] font-bold text-emerald-700">{SYSTEM_HEALTH.lastIncident}</div>
            <div className="text-[8px] text-emerald-600">Last Incident</div>
          </div>
        </div>
      </div>

      {/* Pipeline Throughput */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent-indigo" /> Pipeline Throughput
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PIPELINE_METRICS.map((m) => (
            <div key={m.label} className="bg-canvas border border-ink-wash rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] text-ink-tertiary">{m.label}</span>
                <div className="flex items-center gap-0.5">
                  <TrendIcon trend={m.trend} />
                  <span className={`text-[9px] font-medium ${m.trend === 'up' ? 'text-emerald-600' : m.trend === 'down' ? 'text-accent-crimson' : 'text-ink-tertiary'}`}>
                    {m.change}
                  </span>
                </div>
              </div>
              <div className="text-xl font-bold text-ink-primary">{m.value}</div>
              <div className="text-[8px] text-ink-tertiary">{m.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Provider Uptime */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-accent-indigo" /> Provider Status
          </h4>
          <div className="space-y-2">
            {PROVIDER_STATUS.map((ps) => (
              <div key={ps.name} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ps.status === 'operational' ? 'bg-emerald-500' : ps.status === 'degraded' ? 'bg-amber-500' : 'bg-accent-crimson'}`} />
                  <span className="text-[11px] font-medium text-ink-primary">{ps.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] text-ink-tertiary">{ps.latency}</span>
                  <span className={`text-[9px] font-bold ${ps.uptime >= '99.9%' ? 'text-emerald-600' : 'text-amber-600'}`}>{ps.uptime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation Quality */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4 text-accent-indigo" /> Recommendation Quality
          </h4>
          <div className="space-y-2">
            {RECOMMENDATION_QUALITY.map((rq) => (
              <div key={rq.metric} className="p-2.5 bg-canvas rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-ink-primary">{rq.metric}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-accent-indigo">{rq.value}</span>
                    <span className="text-[9px] text-ink-tertiary">/ {rq.target}</span>
                    <TrendIcon trend={rq.trend} />
                  </div>
                </div>
                <div className="h-1.5 bg-ink-wash/30 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-indigo rounded-full" style={{ width: `${Math.min(parseInt(rq.value) * 1.1, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API Health */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent-indigo" /> API Health
        </h4>
        <div className="space-y-2">
          {API_HEALTH.map((api) => (
            <div key={api.endpoint} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono text-accent-indigo">{api.endpoint}</span>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[9px] text-ink-tertiary">{api.requests} req</span>
                  <span className="text-[9px] text-ink-tertiary">{api.latency}</span>
                  <span className="text-[9px] text-ink-tertiary">{api.errors} errors</span>
                </div>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${api.status === 'healthy' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {api.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Engagement */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-accent-indigo" /> Customer Engagement
          </h4>
          <div className="space-y-2">
            {CUSTOMER_ENGAGEMENT.map((ce) => (
              <div key={ce.label} className="p-2.5 bg-canvas rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-ink-primary">{ce.label}</span>
                  <div className="flex items-center gap-1">
                    <TrendIcon trend={ce.trend} />
                    <span className="text-[10px] font-bold text-accent-indigo">{ce.value}</span>
                  </div>
                </div>
                <span className={`text-[9px] font-medium ${ce.trend === 'up' ? 'text-emerald-600' : 'text-accent-crimson'}`}>{ce.change}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Health */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-5">
          <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-accent-indigo" /> Subscription Health
          </h4>
          <div className="space-y-3">
            {SUBSCRIPTION_HEALTH.map((sh) => (
              <div key={sh.tier} className="p-3 bg-canvas rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-ink-primary">{sh.tier}</span>
                  <span className="text-[10px] font-bold text-emerald-600">{sh.mrr}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] text-ink-tertiary">{sh.customers} customers</span>
                  <span className="text-[9px] text-emerald-600">Churn: {sh.churn}</span>
                  <span className="text-[9px] text-emerald-600">+{sh.expansion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Infrastructure Coverage */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-accent-indigo" /> Infrastructure Coverage
        </h4>
        <div className="space-y-2">
          {INFRASTRUCTURE_COVERAGE.map((ic) => (
            <div key={ic.source} className="p-2.5 bg-canvas rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-ink-primary">{ic.source}</span>
                <span className={`text-[10px] font-bold ${parseInt(ic.coverage) >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>{ic.coverage}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-1.5 bg-ink-wash/30 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${parseInt(ic.coverage) >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: ic.coverage }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-ink-tertiary">{ic.counties} counties</span>
                <span className="text-[9px] text-ink-tertiary">Updated: {ic.lastUpdate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
