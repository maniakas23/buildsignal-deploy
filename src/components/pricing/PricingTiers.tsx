import { useState } from 'react';
import { Check, Sparkles, Building2, Users, Zap, ArrowRight, Shield, Clock, CreditCard } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PI-17: Pricing Tiers
// 4-tier pricing with outcome-based feature organization,
// monthly/annual toggle, and trial psychology.
// ═══════════════════════════════════════════════════════════════

const TRUST_SIGNALS = [
  { icon: Clock, label: '14-Day Free Trial' },
  { icon: Shield, label: 'No Contracts' },
  { icon: CreditCard, label: 'Cancel Anytime' },
  { icon: Zap, label: 'Upgrade Anytime' },
];

interface PricingTier {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  primaryMessage: string;
  icon: React.ElementType;
  cta: string;
  ctaPrimary: boolean;
  popular?: boolean;
  enterprise?: boolean;
  outcomes: { label: string; included: boolean }[];
  features: string[];
  notIncluded?: string[];
}

const TIERS: PricingTier[] = [
  {
    id: 'scout',
    name: 'Scout',
    priceMonthly: 99,
    priceAnnual: 990,
    description: 'Individual investors, commercial brokers, site selectors, small developers',
    primaryMessage: 'Know about growth before everyone else.',
    icon: Zap,
    cta: 'Start Free Trial',
    ctaPrimary: false,
    outcomes: [
      { label: 'Discover projects before competitors', included: true },
      { label: 'Monitor your target counties', included: true },
      { label: 'Receive AI-ranked opportunities', included: true },
      { label: 'Infrastructure growth alerts', included: true },
      { label: 'Utilities & CIP intelligence', included: false },
      { label: 'Team collaboration', included: false },
      { label: 'Executive reporting', included: false },
      { label: 'API access', included: false },
    ],
    features: [
      'AI Infrastructure Alerts',
      'Building Permits',
      'Planning Agendas',
      'DOT Projects',
      'Interactive Maps',
      '5 Counties',
      'Saved Watchlists',
      'Email Alerts',
      'AI Opportunity Score',
      'Basic Reports',
    ],
    notIncluded: [
      'Unlimited Counties',
      'Team Sharing',
      'Advanced Reports',
      'CSV/PDF Export',
      'Priority Alerts',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    priceMonthly: 249,
    priceAnnual: 2490,
    description: 'Active developers, land acquisition professionals, brokerage teams, economic development consultants',
    primaryMessage: 'Monitor an entire region automatically.',
    icon: Users,
    cta: 'Start Free Trial',
    ctaPrimary: true,
    popular: true,
    outcomes: [
      { label: 'Discover projects before competitors', included: true },
      { label: 'Monitor multiple counties automatically', included: true },
      { label: 'Receive AI-ranked opportunities', included: true },
      { label: 'Infrastructure growth alerts', included: true },
      { label: 'Utilities & CIP intelligence', included: true },
      { label: 'Team collaboration', included: true },
      { label: 'Executive reporting', included: false },
      { label: 'API access', included: false },
    ],
    features: [
      'Everything in Scout',
      '25 Counties',
      'Unlimited Watchlists',
      'Utilities Intelligence',
      'Capital Improvement Plans',
      'School Construction Data',
      'Government Spending Tracker',
      'AI Opportunity Rankings',
      'Team Sharing',
      'Advanced Reports',
      'CSV/PDF Export',
      'Priority Alerts',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    priceMonthly: 599,
    priceAnnual: 5990,
    description: 'Home builders, regional developers, engineering firms, utility contractors, multi-office brokerages',
    primaryMessage: 'Replace manual research with continuous intelligence.',
    icon: Building2,
    cta: 'Start Free Trial',
    ctaPrimary: false,
    outcomes: [
      { label: 'Discover projects before competitors', included: true },
      { label: 'Monitor unlimited counties', included: true },
      { label: 'Receive AI-ranked opportunities', included: true },
      { label: 'Infrastructure growth alerts', included: true },
      { label: 'Utilities & CIP intelligence', included: true },
      { label: 'Team collaboration & permissions', included: true },
      { label: 'Executive reporting', included: true },
      { label: 'API access', included: true },
    ],
    features: [
      'Everything in Professional',
      'Unlimited Counties',
      'Organization Dashboard',
      'Multiple Team Members',
      'Team Permissions',
      'Workflow Automation',
      'API Access',
      'Historical Trend Analysis',
      'Executive Reporting',
      'CRM Integrations',
      'Custom Alert Rules',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'National developers, REITs, Fortune 500, utilities, state agencies, site selection firms',
    primaryMessage: 'Enterprise infrastructure intelligence at national scale.',
    icon: Sparkles,
    cta: 'Talk to Sales',
    ctaPrimary: false,
    enterprise: true,
    outcomes: [
      { label: 'Discover projects before competitors', included: true },
      { label: 'Nationwide coverage', included: true },
      { label: 'Receive AI-ranked opportunities', included: true },
      { label: 'Infrastructure growth alerts', included: true },
      { label: 'Custom data sources', included: true },
      { label: 'Unlimited team collaboration', included: true },
      { label: 'Executive intelligence briefings', included: true },
      { label: 'Unlimited API access', included: true },
    ],
    features: [
      'Nationwide Coverage',
      'Unlimited Users',
      'SSO Authentication',
      'Dedicated Success Manager',
      'SLA Guarantee',
      'White Label Options',
      'Custom Integrations',
      'Unlimited API',
      'Custom Data Sources',
      'Executive Intelligence Briefings',
      'Dedicated Infrastructure',
    ],
  },
];

function TierCard({ tier, annual }: { tier: PricingTier; annual: boolean }) {
  const price = annual ? tier.priceAnnual : tier.priceMonthly;
  const period = annual ? '/year' : '/month';
  const savings = annual && tier.priceMonthly > 0
    ? Math.round((1 - tier.priceAnnual / (tier.priceMonthly * 12)) * 100)
    : 0;

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-300 ${
        tier.popular
          ? 'border-accent-indigo bg-accent-indigo/[0.03] shadow-card scale-[1.02] lg:scale-[1.03]'
          : tier.enterprise
            ? 'border-amber-200 bg-amber-50/[0.3]'
            : 'border-ink-wash bg-surface shadow-sm hover:shadow-card'
      }`}
    >
      {/* Popular badge */}
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1 px-3 py-1 bg-accent-indigo text-white rounded-full text-[11px] font-semibold shadow-sm">
            <Sparkles className="w-3 h-3" />
            MOST POPULAR
          </div>
        </div>
      )}

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <tier.icon className={`w-5 h-5 ${tier.popular ? 'text-accent-indigo' : tier.enterprise ? 'text-amber-600' : 'text-ink-secondary'}`} />
          <h3 className="text-lg font-bold text-ink-primary">{tier.name}</h3>
        </div>

        <p className="text-[12px] text-ink-tertiary mb-4 leading-relaxed">{tier.description}</p>

        {/* Price */}
        {tier.enterprise ? (
          <div className="mb-4">
            <div className="text-2xl font-bold text-ink-primary">Custom Pricing</div>
            <p className="text-[11px] text-ink-tertiary mt-1">Tailored to your organization</p>
          </div>
        ) : (
          <div className="mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-ink-primary">${price.toLocaleString()}</span>
              <span className="text-sm text-ink-tertiary">{period}</span>
            </div>
            {annual && savings > 0 && (
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                Save {savings}% with annual billing
              </p>
            )}
          </div>
        )}

        {/* Primary Message */}
        <p className={`text-sm font-medium mb-4 ${tier.popular ? 'text-accent-indigo' : 'text-ink-secondary'}`}>
          &ldquo;{tier.primaryMessage}&rdquo;
        </p>

        {/* CTA */}
        <button
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all mb-5 ${
            tier.popular
              ? 'bg-accent-indigo text-white hover:bg-accent-indigo/90 shadow-sm'
              : tier.enterprise
                ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
                : 'bg-canvas border border-ink-wash text-ink-primary hover:bg-surface'
          }`}
        >
          {tier.cta}
          <ArrowRight className="w-3.5 h-3.5 inline ml-1.5" />
        </button>

        {/* Outcome-based features */}
        <div className="space-y-2.5">
          {tier.outcomes.map((outcome) => (
            <div key={outcome.label} className="flex items-start gap-2">
              {outcome.included ? (
                <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.popular ? 'text-accent-indigo' : 'text-emerald-500'}`} />
              ) : (
                <span className="w-4 h-4 mt-0.5 flex-shrink-0 rounded-full border border-ink-wash" />
              )}
              <span className={`text-[12px] leading-relaxed ${outcome.included ? 'text-ink-secondary' : 'text-ink-tertiary'}`}>
                {outcome.label}
              </span>
            </div>
          ))}
        </div>

        {/* Divider + feature list */}
        <div className="border-t border-ink-wash/50 mt-4 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-tertiary mb-2.5">
            {tier.enterprise ? 'Enterprise Includes' : 'Features'}
          </p>
          <ul className="space-y-1.5">
            {tier.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-[11px] text-ink-secondary">
                <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          {tier.notIncluded && tier.notIncluded.length > 0 && (
            <>
              <div className="border-t border-dashed border-ink-wash/40 my-3" />
              <ul className="space-y-1.5">
                {tier.notIncluded.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[11px] text-ink-tertiary line-through">
                    <span className="w-3 h-3 rounded-full border border-ink-wash flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PricingTiers() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="space-y-8">
      {/* Trust signals bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-3">
        {TRUST_SIGNALS.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-[11px] text-ink-tertiary">
            <s.icon className="w-3.5 h-3.5 text-emerald-500" />
            {s.label}
          </div>
        ))}
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm font-medium ${!annual ? 'text-ink-primary' : 'text-ink-tertiary'}`}>Monthly</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-accent-indigo' : 'bg-ink-wash'}`}
          aria-label="Toggle annual billing"
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
              annual ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${annual ? 'text-ink-primary' : 'text-ink-tertiary'}`}>
          Annual
          <span className="ml-1.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
            2 months free
          </span>
        </span>
      </div>

      {/* Tagline */}
      <p className="text-center text-[12px] text-ink-tertiary -mt-4">
        Pays for itself by helping uncover a single valuable opportunity.
      </p>

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
        {TIERS.map((tier) => (
          <TierCard key={tier.id} tier={tier} annual={annual} />
        ))}
      </div>

      {/* Enterprise CTA section */}
      <div className="bg-surface border border-ink-wash rounded-2xl p-6 sm:p-8 text-center">
        <Building2 className="w-8 h-8 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-ink-primary mb-2">
          Need a custom solution for your organization?
        </h3>
        <p className="text-sm text-ink-tertiary mb-4 max-w-lg mx-auto">
          Let&apos;s build a solution tailored to your team. Our enterprise platform serves national developers, REITs, Fortune 500 companies, and state agencies.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button className="px-5 py-2.5 bg-accent-indigo text-white rounded-xl text-sm font-semibold hover:bg-accent-indigo/90 transition-colors">
            Request Demo
          </button>
          <button className="px-5 py-2.5 bg-canvas border border-ink-wash text-ink-primary rounded-xl text-sm font-medium hover:bg-surface transition-colors">
            Talk to Sales
          </button>
          <button className="px-5 py-2.5 bg-canvas border border-ink-wash text-ink-primary rounded-xl text-sm font-medium hover:bg-surface transition-colors">
            Book Strategy Session
          </button>
        </div>
      </div>
    </div>
  );
}
