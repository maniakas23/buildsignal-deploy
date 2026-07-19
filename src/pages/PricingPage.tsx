import { useStore } from '@/store/useStore';
import { Check, ArrowRight, Shield, Zap, Building2, HelpCircle } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter',
    description: 'For individual professionals exploring the platform',
    price: '$49',
    period: '/month',
    icon: Zap,
    cta: 'Start Free Trial',
    features: [
      '3 county monitoring',
      'Daily data refresh',
      'Email alerts',
      'Basic search & filters',
      '30-day history',
      'Standard support',
    ],
    ctaAction: 'signup' as const,
  },
  {
    name: 'Professional',
    description: 'For teams that need comprehensive intelligence',
    price: '$149',
    period: '/month',
    icon: Building2,
    cta: 'Start Free Trial',
    popular: true,
    features: [
      '25 county monitoring',
      'Hourly data refresh',
      'Email + SMS alerts',
      'Advanced AI scoring',
      'Interactive intelligence map',
      'Executive PDF reports',
      '90-day history',
      'Priority support',
    ],
    ctaAction: 'signup' as const,
  },
  {
    name: 'Enterprise',
    description: 'For organizations requiring full coverage',
    price: 'Custom',
    period: '',
    icon: Shield,
    cta: 'Contact Sales',
    features: [
      'Unlimited county monitoring',
      'Real-time data refresh',
      'All alert channels',
      'Custom AI model training',
      'API access',
      'White-label reports',
      'Full historical archive',
      'Dedicated account manager',
      'SSO & team management',
    ],
    ctaAction: 'contact' as const,
  },
];

const FAQS = [
  {
    q: 'Can I change my plan later?',
    a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.',
  },
  {
    q: 'What happens after my free trial?',
    a: 'After 14 days, you\'ll be prompted to choose a plan. If you don\'t subscribe, your account switches to a limited free tier with basic features.',
  },
  {
    q: 'Is there a setup fee?',
    a: 'No setup fees on any plan. Enterprise customers receive free onboarding and training.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards and ACH bank transfers. Enterprise plans can be billed annually with NET-30 terms.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'You can cancel anytime from your account settings. No cancellation fees, no questions asked.',
  },
];

export default function PricingPage() {
  const { setCurrentPage } = useStore();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-[800px] mx-auto px-6 pt-10 pb-8 text-center">
        <h1 className="text-3xl font-semibold text-ink-primary tracking-tight mb-3">
          Simple, Transparent Pricing
        </h1>
        <p className="text-sm text-ink-secondary max-w-[440px] mx-auto leading-relaxed">
          Start with a 14-day free trial. No credit card required. Cancel anytime.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-[800px] mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-5 flex flex-col ${
                  plan.popular
                    ? 'bg-surface border-accent-indigo/40 shadow-lg shadow-accent-indigo/5'
                    : 'bg-surface border-ink-wash'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-accent-indigo text-white text-[10px] font-semibold uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-accent-indigo" />
                </div>

                <h3 className="text-base font-semibold text-ink-primary mb-1">
                  {plan.name}
                </h3>
                <p className="text-xs text-ink-secondary mb-4 leading-relaxed">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-semibold text-ink-primary font-mono tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-xs text-ink-tertiary">{plan.period}</span>
                </div>

                {/* Single CTA */}
                <button
                  onClick={() =>
                    setCurrentPage(plan.ctaAction === 'contact' ? 'contact' : 'signup')
                  }
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] mb-5 ${
                    plan.popular
                      ? 'bg-accent-indigo text-white hover:bg-accent-indigo-dim'
                      : 'bg-canvas border border-ink-wash text-ink-secondary hover:border-ink-secondary/50 hover:bg-surface-hover'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Features */}
                <div className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-accent-teal mt-0.5 shrink-0" />
                      <span className="text-xs text-ink-secondary">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust bar */}
      <div className="border-y border-ink-wash bg-surface/50">
        <div className="max-w-[800px] mx-auto px-6 py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-tertiary">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-accent-teal" /> 14-day free trial
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-accent-teal" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-accent-teal" /> Cancel anytime
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-accent-teal" /> SOC 2 Compliant
            </span>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-[600px] mx-auto px-6 py-12">
        <h2 className="text-xl font-semibold text-ink-primary mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group bg-surface rounded-xl border border-ink-wash overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none">
                <span className="text-sm font-medium text-ink-primary flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-accent-indigo shrink-0" />
                  {faq.q}
                </span>
                <span className="text-ink-tertiary group-open:rotate-180 transition-transform shrink-0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <div className="px-4 pb-4 pt-0">
                <p className="text-xs text-ink-secondary leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
