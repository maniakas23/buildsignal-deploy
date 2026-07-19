import { useState } from 'react';
import {
  DollarSign, ToggleLeft, Layers, Timer, TicketPercent,
  Briefcase, BarChart3, TrendingUp, Users, CheckCircle2,
  XCircle, AlertTriangle, ChevronDown
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-17: Pricing Admin Panel
// Admin tools for pricing management, feature flags, tier
// management, usage limits, trial management, coupons,
// enterprise licensing, and usage analytics.
// ═══════════════════════════════════════════════════════════════

interface PricingTier {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  active: boolean;
  trialDays: number;
  subscribers: number;
  mrr: number;
}

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  tier: string;
}

interface Coupon {
  id: string;
  code: string;
  discount: string;
  type: 'percentage' | 'fixed';
  used: number;
  limit: number;
  active: boolean;
  expires: string;
}

const PRICING_TIERS: PricingTier[] = [
  { id: 'scout', name: 'Scout', monthlyPrice: 99, annualPrice: 990, active: true, trialDays: 14, subscribers: 342, mrr: 33858 },
  { id: 'professional', name: 'Professional', monthlyPrice: 249, annualPrice: 2490, active: true, trialDays: 14, subscribers: 518, mrr: 128982 },
  { id: 'business', name: 'Business', monthlyPrice: 599, annualPrice: 5990, active: true, trialDays: 14, subscribers: 127, mrr: 76073 },
  { id: 'enterprise', name: 'Enterprise', monthlyPrice: 0, annualPrice: 0, active: true, trialDays: 30, subscribers: 23, mrr: 45200 },
];

const FEATURE_FLAGS: FeatureFlag[] = [
  { id: 'f1', name: 'AI Opportunity Score', description: 'Score-weighted opportunity ranking', enabled: true, tier: 'All' },
  { id: 'f2', name: 'Advanced Reports', description: 'Executive-level PDF reporting', enabled: true, tier: 'Professional+' },
  { id: 'f3', name: 'Team Sharing', description: 'Collaborative watchlists and alerts', enabled: true, tier: 'Professional+' },
  { id: 'f4', name: 'API Access', description: 'RESTful API for integrations', enabled: true, tier: 'Business+' },
  { id: 'f5', name: 'Workflow Automation', description: 'Trigger-based alert workflows', enabled: true, tier: 'Business+' },
  { id: 'f6', name: 'CRM Integration', description: 'Salesforce/HubSpot sync', enabled: false, tier: 'Business+' },
  { id: 'f7', name: 'White Label', description: 'Custom branding for Enterprise', enabled: false, tier: 'Enterprise' },
  { id: 'f8', name: 'SSO Auth', description: 'SAML/OIDC single sign-on', enabled: true, tier: 'Enterprise' },
  { id: 'f9', name: 'Historical Trends', description: 'Multi-year trend analysis', enabled: true, tier: 'Business+' },
  { id: 'f10', name: 'Custom Data Sources', description: 'Enterprise proprietary feeds', enabled: false, tier: 'Enterprise' },
];

const COUPONS: Coupon[] = [
  { id: 'c1', code: 'LAUNCH25', discount: '25%', type: 'percentage', used: 48, limit: 100, active: true, expires: '2026-08-31' },
  { id: 'c2', code: 'EARLY50', discount: '$50', type: 'fixed', used: 23, limit: 50, active: true, expires: '2026-07-31' },
  { id: 'c3', code: 'TEAM20', discount: '20%', type: 'percentage', used: 12, limit: 200, active: true, expires: '2026-09-15' },
  { id: 'c4', code: 'BETAFREE', discount: '100%', type: 'percentage', used: 89, limit: 100, active: false, expires: '2026-06-30' },
];

const TRIAL_STATS = {
  started: 847,
  completed: 612,
  converted: 487,
  activationRate: 72.3,
  conversionRate: 57.5,
  avgDaysToConvert: 8.4,
};

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-ink-wash rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-wash bg-canvas/50">
        <Icon className="w-4 h-4 text-accent-indigo" />
        <h4 className="text-sm font-semibold text-ink-primary">{title}</h4>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function PricingAdminPanel() {
  const [tierTab, setTierTab] = useState<'pricing' | 'features' | 'trials' | 'coupons'>('pricing');

  const totalMRR = PRICING_TIERS.reduce((s, t) => s + t.mrr, 0);
  const totalSubscribers = PRICING_TIERS.reduce((s, t) => s + t.subscribers, 0);

  return (
    <div className="space-y-6">
      {/* KPI summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total MRR', value: `$${totalMRR.toLocaleString()}`, icon: DollarSign, change: '+12.4%' },
          { label: 'Subscribers', value: totalSubscribers.toLocaleString(), icon: Users, change: '+8.2%' },
          { label: 'Trial → Paid', value: `${TRIAL_STATS.conversionRate}%`, icon: TrendingUp, change: '+3.1%' },
          { label: 'Active Coupons', value: '3', icon: TicketPercent, change: 'Running' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-surface border border-ink-wash rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-ink-tertiary">{kpi.label}</span>
              <kpi.icon className="w-4 h-4 text-ink-tertiary" />
            </div>
            <div className="text-xl font-bold text-ink-primary">{kpi.value}</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">{kpi.change}</div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 p-1 bg-canvas border border-ink-wash rounded-xl w-fit">
        {([
          { id: 'pricing' as const, label: 'Pricing', icon: DollarSign },
          { id: 'features' as const, label: 'Feature Flags', icon: ToggleLeft },
          { id: 'trials' as const, label: 'Trials', icon: Timer },
          { id: 'coupons' as const, label: 'Coupons', icon: TicketPercent },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTierTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
              tierTab === t.id
                ? 'bg-accent-indigo text-white'
                : 'text-ink-secondary hover:bg-surface'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Pricing tiers management */}
      {tierTab === 'pricing' && (
        <div className="space-y-4">
          <Section title="Tier Pricing & Configuration" icon={Layers}>
            <div className="space-y-3">
              {PRICING_TIERS.map((tier) => (
                <div key={tier.id} className="flex flex-wrap items-center gap-3 p-3 border border-ink-wash rounded-lg">
                  <div className="flex-1 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-ink-primary">{tier.name}</span>
                      {tier.active ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-ink-tertiary" />
                      )}
                    </div>
                    <div className="text-[10px] text-ink-tertiary mt-0.5">
                      {tier.subscribers} subscribers · ${tier.mrr.toLocaleString()} MRR
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-[11px] text-ink-secondary">
                        ${tier.monthlyPrice > 0 ? tier.monthlyPrice : 'Custom'}/mo
                      </div>
                      <div className="text-[10px] text-ink-tertiary">
                        {tier.annualPrice > 0 ? `$${tier.annualPrice.toLocaleString()}/yr` : 'Custom'}
                      </div>
                    </div>
                    <div className="text-right min-w-[60px]">
                      <div className="text-[10px] text-ink-tertiary">Trial</div>
                      <div className="text-[11px] font-medium text-ink-secondary">{tier.trialDays}d</div>
                    </div>
                    <button
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                        tier.active
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-ink-wash/50 text-ink-tertiary hover:bg-ink-wash'
                      }`}
                    >
                      {tier.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Revenue Breakdown by Tier" icon={BarChart3}>
            <div className="space-y-3">
              {PRICING_TIERS.map((tier) => {
                const pct = Math.round((tier.mrr / totalMRR) * 100);
                return (
                  <div key={tier.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium text-ink-secondary">{tier.name}</span>
                      <span className="text-[11px] text-ink-tertiary">${tier.mrr.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-ink-wash/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-indigo rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="border-t border-ink-wash pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-ink-primary">Total MRR</span>
                  <span className="text-sm font-bold text-ink-primary">${totalMRR.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* Feature flags */}
      {tierTab === 'features' && (
        <Section title="Feature Flags by Tier" icon={ToggleLeft}>
          <div className="space-y-2">
            {FEATURE_FLAGS.map((flag) => (
              <div key={flag.id} className="flex items-center justify-between p-3 border border-ink-wash rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-ink-primary">{flag.name}</span>
                    {flag.enabled ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-ink-tertiary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-ink-tertiary mt-0.5">{flag.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <span className="text-[10px] px-2 py-0.5 bg-canvas rounded-full text-ink-tertiary font-medium">
                    {flag.tier}
                  </span>
                  <button
                    className={`relative w-9 h-5 rounded-full transition-colors ${flag.enabled ? 'bg-accent-indigo' : 'bg-ink-wash'}`}
                    aria-label={`Toggle ${flag.name}`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                        flag.enabled ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Trial management */}
      {tierTab === 'trials' && (
        <div className="space-y-4">
          <Section title="Trial Performance" icon={Timer}>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Trials Started', value: TRIAL_STATS.started },
                { label: 'Trials Completed', value: TRIAL_STATS.completed },
                { label: 'Converted to Paid', value: TRIAL_STATS.converted },
                { label: 'Activation Rate', value: `${TRIAL_STATS.activationRate}%` },
                { label: 'Conversion Rate', value: `${TRIAL_STATS.conversionRate}%` },
                { label: 'Avg Days to Convert', value: `${TRIAL_STATS.avgDaysToConvert}d` },
              ].map((stat) => (
                <div key={stat.label} className="bg-canvas border border-ink-wash rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-ink-primary">{stat.value}</div>
                  <div className="text-[10px] text-ink-tertiary mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="h-3 bg-ink-wash/30 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-emerald-500 rounded-l-full"
                style={{ width: `${TRIAL_STATS.conversionRate}%` }}
                title={`Converted: ${TRIAL_STATS.conversionRate}%`}
              />
              <div
                className="h-full bg-amber-400"
                style={{ width: `${TRIAL_STATS.activationRate - TRIAL_STATS.conversionRate}%` }}
                title={`Active but not converted: ${(TRIAL_STATS.activationRate - TRIAL_STATS.conversionRate).toFixed(1)}%`}
              />
              <div
                className="h-full bg-ink-wash rounded-r-full"
                style={{ width: `${100 - TRIAL_STATS.activationRate}%` }}
                title={`Inactive: ${(100 - TRIAL_STATS.activationRate).toFixed(1)}%`}
              />
            </div>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-[10px] text-ink-tertiary">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Converted
              </div>
              <div className="flex items-center gap-1 text-[10px] text-ink-tertiary">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Active
              </div>
              <div className="flex items-center gap-1 text-[10px] text-ink-tertiary">
                <span className="w-2 h-2 rounded-full bg-ink-wash" /> Inactive
              </div>
            </div>
          </Section>

          <Section title="Trial Configuration" icon={Layers}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRICING_TIERS.map((tier) => (
                <div key={tier.id} className="flex items-center justify-between p-3 border border-ink-wash rounded-lg">
                  <span className="text-[12px] font-medium text-ink-primary">{tier.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-ink-tertiary">{tier.trialDays}-day trial</span>
                    <button className="p-1 rounded hover:bg-ink-wash transition-colors">
                      <ChevronDown className="w-3 h-3 text-ink-tertiary" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Coupons */}
      {tierTab === 'coupons' && (
        <Section title="Active Coupon Codes" icon={TicketPercent}>
          <div className="space-y-2">
            {COUPONS.map((coupon) => (
              <div
                key={coupon.id}
                className={`flex flex-wrap items-center justify-between p-3 border rounded-lg ${
                  coupon.active ? 'border-ink-wash' : 'border-ink-wash/50 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-accent-indigo/10 text-accent-indigo rounded-lg text-xs font-mono font-bold">
                    {coupon.code}
                  </span>
                  <span className="text-sm font-semibold text-ink-primary">{coupon.discount} off</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-canvas rounded-full text-ink-tertiary capitalize">
                    {coupon.type}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                  <div className="text-right">
                    <div className="text-[11px] text-ink-secondary">
                      {coupon.used} / {coupon.limit} used
                    </div>
                    <div className="text-[10px] text-ink-tertiary">
                      Expires {coupon.expires}
                    </div>
                  </div>
                  {coupon.active ? (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-medium">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-ink-wash/50 text-ink-tertiary rounded-full text-[10px] font-medium">
                      Expired
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Coupon BETAFREE has reached its usage limit. Consider creating a new onboarding promotion
              to maintain trial momentum post-launch.
            </p>
          </div>
        </Section>
      )}
    </div>
  );
}
