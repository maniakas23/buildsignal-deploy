import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { acquisitionCtaTarget } from "@/lib/customerJourney";
import {
  ArrowRight, Check, TrendingUp,
  Search, Filter, Presentation,
} from "lucide-react";
import { CredibilityBar } from "@/components/marketing/CredibilityBar";
import { MarketPulseDemo } from "@/components/marketing/MarketPulseDemo";
import { ROICalculator } from "@/components/marketing/ROICalculator";
import { HomeFAQ } from "@/components/marketing/HomeFAQ";
import { HomeCapabilities, HomeUseCases, HomeTrust } from "@/components/marketing/HomeSections";

export default function Home() {
  const { isAuthenticated } = useAuth();
  // m1(24C): authenticated customers go to billing, guests to signup; plan
  // features below mirror the canonical production contract (stripe.plans).
  const ctaTarget = acquisitionCtaTarget(isAuthenticated);

  const steps = [
    { number: "01", title: "Capture", description: "Select counties, metros, and asset classes. Our system monitors municipal permits, zoning filings, and infrastructure investments across your target markets.", icon: Search },
    { number: "02", title: "Filter", description: "Apply intelligent filters by permit type, project value, timeline, and geography. Set custom alert thresholds to surface only the opportunities that match your strategy.", icon: Filter },
    { number: "03", title: "Present", description: "Receive actionable intelligence briefs with confidence scores, trend context, and clear next steps, delivered to your dashboard.", icon: Presentation },
  ];

  const plans = [
    { name: "Scout", price: "$99", period: "/month", description: "Perfect for individual investors and small teams exploring new markets.", features: ["1 county", "3 alerts per day", "Email support"], highlighted: false },
    { name: "Professional", price: "$249", period: "/month", description: "For growing teams that need deeper intelligence and more coverage.", features: ["10 counties", "50 alerts per day", "Watchlists", "Basic analytics", "Priority support"], highlighted: true },
    { name: "Business", price: "$599", period: "/month", description: "Built for organizations managing multi-market portfolios at scale.", features: ["All counties", "Unlimited alerts", "Advanced analytics", "SSO", "Dedicated support"], highlighted: false },
  ];

  return (
    <main className="min-h-screen bg-canvas">
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            <span>Live permit intelligence in covered US markets</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-ink mb-6 tracking-tight">
            Predict Construction Surges<br className="hidden md:block" /> Before Your Competitors
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto mb-8">
            AI-powered infrastructure intelligence for construction markets. Get actionable permit insights, growth forecasts, and market opportunities delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={ctaTarget} className="inline-flex items-center justify-center px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors">
              Get Started<ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link to="/demo" className="inline-flex items-center justify-center px-8 py-3 bg-surface hover:bg-surface-hover text-ink font-semibold rounded-lg border border-border transition-colors">
              Watch Demo
            </Link>
          </div>
          <p className="text-sm text-muted mt-4">14-day free trial · No credit card required · Plans from $99/month after trial · Cancel anytime.</p>
        </div>
      </section>

      <CredibilityBar />

      {/* How BuildSignal Works */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">How BuildSignal Works</h2>
            <p className="text-lg text-muted">From Data to Decision in Three Steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative">
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border -translate-y-1/2" />
                )}
                <div className="text-5xl font-bold text-emerald-500/20 mb-4">{step.number}</div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                  <step.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-2">{step.title}</h3>
                <p className="text-muted leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeCapabilities />

      <MarketPulseDemo />

      <HomeUseCases />

      <ROICalculator />

      {/* Pricing Tiers */}
      <section id="pricing" className="py-20 md:py-28 bg-canvas">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">Pricing</h2>
            <p className="text-lg text-muted">Simple Pricing, Powerful Results</p>
            <p className="text-sm text-muted mt-2">Start with a 14-day free trial — $0 today, no credit card required.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`bg-surface border rounded-2xl p-6 ${plan.highlighted ? "border-emerald-500/50 shadow-lg shadow-emerald-500/5" : "border-border"}`}>
                {plan.highlighted && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-4">Most Popular</div>
                )}
                <h3 className="text-xl font-semibold text-ink mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-ink">{plan.price}</span>
                  <span className="text-muted">{plan.period}</span>
                </div>
                <p className="text-sm text-muted mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />{feature}
                    </li>
                  ))}
                </ul>
                <Link to={ctaTarget} className={`block w-full text-center px-4 py-2 rounded-lg font-semibold transition-colors ${plan.highlighted ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-canvas hover:bg-surface-hover text-ink border border-border"}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeFAQ />

      {/* Newsletter */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-ink mb-4">Stay Ahead of the Market</h2>
          <p className="text-muted mb-8">Get weekly insights on construction market trends and new feature updates.</p>
          <p className="text-sm text-muted mb-6">Email updates are not yet available — reach out and we will keep you posted.</p>
          <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors">Contact Us</Link>
        </div>
      </section>

      <HomeTrust />
    </main>
  );
}
