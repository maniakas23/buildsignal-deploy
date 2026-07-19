import {
  TrendingUp, TrendingDown, Users, DollarSign, CreditCard,
  Target, RotateCcw, ArrowUpRight, ArrowDownRight, BarChart3,
  Activity, ShoppingCart, UserPlus, CheckCircle
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-17: Revenue Operations Dashboard
// Commercial KPIs: visitors, trials, MRR, ARR, churn,
// conversion funnel, expansion revenue, ARPA, LTV, CAC.
// ═══════════════════════════════════════════════════════════════

interface KPICard {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  accent: string;
}

const KPIS: KPICard[] = [
  { label: 'MRR', value: '$285,113', change: 12.4, changeLabel: 'vs last month', icon: DollarSign, accent: 'text-emerald-600' },
  { label: 'ARR', value: '$3.42M', change: 15.2, changeLabel: 'vs last quarter', icon: CreditCard, accent: 'text-accent-indigo' },
  { label: 'Active Subscribers', value: '1,010', change: 8.2, changeLabel: 'vs last month', icon: Users, accent: 'text-blue-600' },
  { label: 'ARPA', value: '$282', change: 3.8, changeLabel: 'vs last month', icon: Target, accent: 'text-violet-600' },
  { label: 'Churn Rate', value: '4.2%', change: -1.3, changeLabel: 'vs last month', icon: RotateCcw, accent: 'text-amber-600' },
  { label: 'Net Revenue Retention', value: '112%', change: 5.1, changeLabel: 'vs last quarter', icon: TrendingUp, accent: 'text-emerald-600' },
];

const FUNNEL_STAGES = [
  { stage: 'Website Visitors', count: 18420, icon: Users, color: 'bg-blue-500' },
  { stage: 'Trial Starts', count: 2847, icon: UserPlus, color: 'bg-violet-500' },
  { stage: 'Trial Activated', count: 2058, icon: Activity, color: 'bg-accent-indigo' },
  { stage: 'Trial Completed', count: 1632, icon: CheckCircle, color: 'bg-emerald-500' },
  { stage: 'Paid Conversion', count: 1010, icon: ShoppingCart, color: 'bg-amber-500' },
];

const TIER_MRR = [
  { tier: 'Scout', mrr: 33858, subscribers: 342, color: '#64748b' },
  { tier: 'Professional', mrr: 128982, subscribers: 518, color: '#4f46e5' },
  { tier: 'Business', mrr: 76073, subscribers: 127, color: '#0f766e' },
  { tier: 'Enterprise', mrr: 45200, subscribers: 23, color: '#d97706' },
];

const MONTHLY_TREND = [
  { month: 'Jan', mrr: 198000, subscribers: 720 },
  { month: 'Feb', mrr: 215400, subscribers: 778 },
  { month: 'Mar', mrr: 228000, subscribers: 821 },
  { month: 'Apr', mrr: 241200, subscribers: 865 },
  { month: 'May', mrr: 252800, subscribers: 912 },
  { month: 'Jun', mrr: 267500, subscribers: 958 },
  { month: 'Jul', mrr: 285113, subscribers: 1010 },
];

function MiniBarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm transition-all"
            style={{
              height: `${Math.max((d.value / max) * 100, 8)}%`,
              backgroundColor: d.color,
              opacity: 0.8,
            }}
            title={`${d.label}: ${d.value.toLocaleString()}`}
          />
          <span className="text-[8px] text-ink-tertiary">{d.label.slice(0, 3)}</span>
        </div>
      ))}
    </div>
  );
}

export default function RevenueOperationsDashboard() {
  const totalMRR = TIER_MRR.reduce((s, t) => s + t.mrr, 0);
  const maxFunnel = FUNNEL_STAGES[0].count;

  // Compute funnel conversion rates
  const funnelRates = FUNNEL_STAGES.map((stage, i) => {
    if (i === 0) return 100;
    return Math.round((stage.count / FUNNEL_STAGES[i - 1].count) * 100);
  });

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="bg-surface border border-ink-wash rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-ink-tertiary">{kpi.label}</span>
              <kpi.icon className={`w-4 h-4 ${kpi.accent}`} />
            </div>
            <div className="text-xl font-bold text-ink-primary">{kpi.value}</div>
            <div className="flex items-center gap-1 mt-1">
              {kpi.change >= 0 ? (
                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-amber-500" />
              )}
              <span className={`text-[10px] font-medium ${kpi.change >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {kpi.change >= 0 ? '+' : ''}{kpi.change}%
              </span>
              <span className="text-[10px] text-ink-tertiary">{kpi.changeLabel}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column layout: Funnel + MRR Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Conversion Funnel */}
        <div className="bg-surface border border-ink-wash rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-accent-indigo" />
            <h4 className="text-sm font-semibold text-ink-primary">Conversion Funnel</h4>
          </div>
          <div className="space-y-3">
            {FUNNEL_STAGES.map((stage, i) => {
              const pct = Math.round((stage.count / maxFunnel) * 100);
              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <stage.icon className={`w-3.5 h-3.5 ${i === FUNNEL_STAGES.length - 1 ? 'text-emerald-500' : 'text-ink-secondary'}`} />
                      <span className="text-[11px] font-medium text-ink-secondary">{stage.stage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-ink-primary">{stage.count.toLocaleString()}</span>
                      {i > 0 && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-canvas rounded-full text-ink-tertiary">
                          {funnelRates[i]}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-2.5 bg-ink-wash/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stage.color} rounded-full transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-ink-wash/50 flex items-center justify-between">
            <span className="text-[11px] text-ink-tertiary">Overall conversion</span>
            <span className="text-sm font-bold text-emerald-600">
              {((FUNNEL_STAGES[FUNNEL_STAGES.length - 1].count / FUNNEL_STAGES[0].count) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* MRR by Tier */}
        <div className="bg-surface border border-ink-wash rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-accent-indigo" />
              <h4 className="text-sm font-semibold text-ink-primary">MRR by Tier</h4>
            </div>
            <span className="text-sm font-bold text-ink-primary">${totalMRR.toLocaleString()}</span>
          </div>

          <MiniBarChart
            data={TIER_MRR.map((t) => ({ label: t.tier, value: t.mrr, color: t.color }))}
          />

          <div className="space-y-2.5 mt-4">
            {TIER_MRR.map((tier) => {
              const pct = Math.round((tier.mrr / totalMRR) * 100);
              return (
                <div key={tier.tier} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                    <span className="text-[11px] font-medium text-ink-secondary">{tier.tier}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-ink-tertiary">{tier.subscribers} subs</span>
                    <span className="text-[11px] font-semibold text-ink-primary min-w-[60px] text-right">
                      ${tier.mrr.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-ink-tertiary min-w-[32px] text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-surface border border-ink-wash rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-accent-indigo" />
          <h4 className="text-sm font-semibold text-ink-primary">MRR Growth Trend</h4>
        </div>
        <div className="flex items-end gap-2 h-24 px-2">
          {MONTHLY_TREND.map((m, i) => {
            const maxMRR = Math.max(...MONTHLY_TREND.map((d) => d.mrr));
            const barHeight = Math.max((m.mrr / maxMRR) * 100, 10);
            const prevMRR = i > 0 ? MONTHLY_TREND[i - 1].mrr : m.mrr;
            const growth = i > 0 ? (((m.mrr - prevMRR) / prevMRR) * 100).toFixed(1) : '0.0';
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[8px] text-emerald-600 font-medium">
                  {i > 0 ? `+${growth}%` : ''}
                </span>
                <div
                  className="w-full bg-accent-indigo/80 rounded-t-sm transition-all min-h-[4px]"
                  style={{ height: `${barHeight}%` }}
                  title={`${m.month}: $${m.mrr.toLocaleString()} · ${m.subscribers} subs`}
                />
                <span className="text-[9px] text-ink-tertiary">{m.month}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink-wash/50">
          <span className="text-[11px] text-ink-tertiary">
            {MONTHLY_TREND[0].month} – {MONTHLY_TREND[MONTHLY_TREND.length - 1].month} 2026
          </span>
          <span className="text-[11px] font-semibold text-emerald-600">
            +{((MONTHLY_TREND[MONTHLY_TREND.length - 1].mrr / MONTHLY_TREND[0].mrr - 1) * 100).toFixed(0)}% growth
          </span>
        </div>
      </div>

      {/* Expansion & LTV/CAC */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-surface border border-ink-wash rounded-xl p-4 text-center">
          <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-ink-primary">$28,400</div>
          <div className="text-[11px] text-ink-tertiary mt-0.5">Expansion Revenue (MTD)</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">+18.3% from upsells</div>
        </div>
        <div className="bg-surface border border-ink-wash rounded-xl p-4 text-center">
          <CreditCard className="w-5 h-5 text-accent-indigo mx-auto mb-2" />
          <div className="text-2xl font-bold text-ink-primary">$4,240</div>
          <div className="text-[11px] text-ink-tertiary mt-0.5">Lifetime Value (LTV)</div>
          <div className="text-[10px] text-ink-tertiary mt-1">15 month avg lifetime</div>
        </div>
        <div className="bg-surface border border-ink-wash rounded-xl p-4 text-center">
          <Target className="w-5 h-5 text-violet-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-ink-primary">$142</div>
          <div className="text-[11px] text-ink-tertiary mt-0.5">Customer Acquisition Cost</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">LTV:CAC ratio 29.9x</div>
        </div>
      </div>
    </div>
  );
}
