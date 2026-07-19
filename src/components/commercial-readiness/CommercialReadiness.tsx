import {
  CreditCard, DollarSign, Shield, Users, Calendar, TrendingUp,
  CheckCircle2, AlertTriangle, Clock, BarChart3, Layers, Zap,
  FileText, Globe, Star, Award, ChevronRight
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-25: Commercial Readiness
// Pricing, trial management, billing, licensing, entitlements,
// renewals, support, usage analytics.
// ═══════════════════════════════════════════════════════════════

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: '$199',
    period: '/month',
    description: 'For individual developers and small teams',
    features: ['5 signal sources', '50 opportunities/month', 'Email alerts', 'Basic reports', 'Community support'],
    trial: '14-day free trial',
    cta: 'Start Trial',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '$799',
    period: '/month',
    description: 'For growing construction firms',
    features: ['8 signal sources', 'Unlimited opportunities', 'Real-time alerts', 'Advanced reports', 'Priority support', 'Team collaboration', 'API access'],
    trial: '14-day free trial',
    cta: 'Start Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$1,999',
    period: '/month',
    description: 'For large organizations with custom needs',
    features: ['All 10 signal sources', 'Unlimited everything', 'Custom integrations', 'Dedicated support', 'SSO & SAML', 'Advanced analytics', 'Onboarding specialist', '99.99% SLA'],
    trial: '30-day pilot',
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const BILLING_METRICS = [
  { label: 'MRR', value: '$69,000', trend: '+12%', icon: DollarSign },
  { label: 'Active Customers', value: '135', trend: '+8%', icon: Users },
  { label: 'Trial Conversions', value: '34%', trend: '+5pp', icon: TrendingUp },
  { label: 'Avg Revenue/Customer', value: '$511', trend: '+6%', icon: CreditCard },
];

const LICENSING_ENTITLEMENTS = [
  { feature: 'Signal Sources', starter: '5', professional: '8', enterprise: '10' },
  { feature: 'Opportunities', starter: '50/mo', professional: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Team Members', starter: '3', professional: '10', enterprise: 'Unlimited' },
  { feature: 'API Calls', starter: '1,000/mo', professional: '50,000/mo', enterprise: 'Unlimited' },
  { feature: 'Reports', starter: 'Basic', professional: 'Advanced', enterprise: 'Custom' },
  { feature: 'Alert Types', starter: 'Email', professional: 'Email + SMS', enterprise: 'All channels' },
  { feature: 'Support', starter: 'Community', professional: 'Priority', enterprise: 'Dedicated' },
  { feature: 'SLA', starter: '—', professional: '99.9%', enterprise: '99.99%' },
  { feature: 'Custom Integrations', starter: '—', professional: '—', enterprise: 'Included' },
  { feature: 'SSO / SAML', starter: '—', professional: '—', enterprise: 'Included' },
];

const RENEWALS = [
  { customer: 'Summit Construction', tier: 'Enterprise', renewalDate: 'Aug 15', health: 95, arr: '$23,988', risk: 'low' },
  { customer: 'Front Range Dev', tier: 'Professional', renewalDate: 'Aug 22', health: 88, arr: '$9,588', risk: 'low' },
  { customer: 'Pikes Peak Partners', tier: 'Professional', renewalDate: 'Sep 1', health: 76, arr: '$9,588', risk: 'medium' },
  { customer: 'Mile High Properties', tier: 'Starter', renewalDate: 'Sep 5', health: 62, arr: '$2,388', risk: 'high' },
];

const SUPPORT_TICKETS = [
  { id: 'ST-001', subject: 'API rate limit question', customer: 'Summit Construction', priority: 'medium', status: 'open', time: '2 hrs ago' },
  { id: 'ST-002', subject: 'Missing permit data for Jefferson County', customer: 'Front Range Dev', priority: 'high', status: 'in-progress', time: '4 hrs ago' },
  { id: 'ST-003', subject: 'Team member access issue', customer: 'Pikes Peak Partners', priority: 'low', status: 'resolved', time: '1 day ago' },
  { id: 'ST-004', subject: 'Custom report export format', customer: 'Colorado Builders Co', priority: 'medium', status: 'open', time: '6 hrs ago' },
];

function RiskBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    low: 'bg-emerald-50 text-emerald-700',
    medium: 'bg-amber-50 text-amber-700',
    high: 'bg-accent-crimson/10 text-accent-crimson',
  };
  return <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${colors[level] || colors.low}`}>{level.toUpperCase()}</span>;
}

export default function CommercialReadiness() {
  return (
    <div className="space-y-6">
      {/* Billing Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BILLING_METRICS.map((s) => (
          <div key={s.label} className="bg-surface border border-ink-wash rounded-xl p-4 text-center">
            <s.icon className="w-5 h-5 text-accent-indigo mx-auto mb-1" />
            <div className="text-xl font-bold text-ink-primary">{s.value}</div>
            <div className="text-[10px] text-ink-tertiary">{s.label}</div>
            <span className="text-[9px] text-emerald-600 font-medium">{s.trend}</span>
          </div>
        ))}
      </div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PRICING_TIERS.map((tier) => (
          <div key={tier.name} className={`border rounded-2xl p-5 ${tier.highlighted ? 'border-accent-indigo bg-accent-indigo/[0.03]' : 'border-ink-wash bg-surface'}`}>
            <div className="mb-3">
              <h4 className="text-sm font-bold text-ink-primary">{tier.name}</h4>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-accent-indigo">{tier.price}</span>
                <span className="text-[10px] text-ink-tertiary">{tier.period}</span>
              </div>
              <p className="text-[10px] text-ink-secondary mt-1">{tier.description}</p>
            </div>
            <div className="space-y-1.5 mb-4">
              {tier.features.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                  <span className="text-[10px] text-ink-secondary">{f}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <span className="text-[9px] text-accent-indigo font-medium block">{tier.trial}</span>
              <button className={`w-full py-2 rounded-lg text-[11px] font-bold transition-colors ${
                tier.highlighted ? 'bg-accent-indigo text-white hover:bg-accent-indigo/90' : 'bg-canvas border border-ink-wash text-ink-primary hover:bg-surface'
              }`}>
                {tier.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Licensing & Entitlements */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent-indigo" /> Licensing & Entitlements
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b border-ink-wash">
                <th className="text-left py-2 text-ink-tertiary font-medium">Feature</th>
                <th className="text-center py-2 text-ink-tertiary font-medium">Starter</th>
                <th className="text-center py-2 text-accent-indigo font-medium">Professional</th>
                <th className="text-center py-2 text-emerald-600 font-medium">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {LICENSING_ENTITLEMENTS.map((row) => (
                <tr key={row.feature} className="border-b border-ink-wash/50">
                  <td className="py-2 text-ink-secondary font-medium">{row.feature}</td>
                  <td className="text-center py-2 text-ink-tertiary">{row.starter}</td>
                  <td className="text-center py-2 text-ink-secondary font-medium">{row.professional}</td>
                  <td className="text-center py-2 text-emerald-600 font-medium">{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renewals */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-accent-indigo" /> Upcoming Renewals
        </h4>
        <div className="space-y-2">
          {RENEWALS.map((r) => (
            <div key={r.customer} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
              <div>
                <span className="text-[11px] font-semibold text-ink-primary">{r.customer}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-ink-tertiary">{r.tier}</span>
                  <span className="text-[9px] text-ink-tertiary">Renews: {r.renewalDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-emerald-600">{r.arr}</span>
                <RiskBadge level={r.risk} />
                <div className="w-16">
                  <div className="h-1 bg-ink-wash/30 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${r.health >= 90 ? 'bg-emerald-500' : r.health >= 75 ? 'bg-accent-indigo' : 'bg-amber-500'}`} style={{ width: `${r.health}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support Tickets */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-5">
        <h4 className="text-sm font-bold text-ink-primary mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent-indigo" /> Support Tickets
        </h4>
        <div className="space-y-2">
          {SUPPORT_TICKETS.map((st) => (
            <div key={st.id} className="flex items-center justify-between p-2.5 bg-canvas rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-accent-indigo">{st.id}</span>
                <span className="text-[11px] text-ink-secondary">{st.subject}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-ink-tertiary">{st.customer}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${st.status === 'resolved' ? 'bg-emerald-50 text-emerald-700' : st.status === 'in-progress' ? 'bg-accent-indigo/10 text-accent-indigo' : 'bg-amber-50 text-amber-700'}`}>
                  {st.status}
                </span>
                <span className="text-[9px] text-ink-tertiary">{st.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
