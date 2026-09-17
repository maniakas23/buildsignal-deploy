import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { acquisitionCtaTarget } from "@/lib/customerJourney";
import {
  ArrowRight, Check, Mail, Phone, Shield, Lock, Eye,
  TrendingUp, MapPin, FileText, BarChart3, Users, Zap,
  Download, Search, Filter, Presentation, Building2,
  LocateFixed, Mountain, Handshake,
} from "lucide-react";
import { CredibilityBar } from "@/components/marketing/CredibilityBar";
import { MarketPulseDemo } from "@/components/marketing/MarketPulseDemo";
import { ROICalculator } from "@/components/marketing/ROICalculator";
import { HomeFAQ } from "@/components/marketing/HomeFAQ";

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

  const capabilities = [
    { icon: MapPin, title: "County Coverage", description: "Monitor construction activity across covered US counties with daily data aggregation and automated coverage expansion." },
    { icon: FileText, title: "Permit Tracking", description: "Track municipal building permits as they are published. Filter by type, value, and geography to find relevant opportunities." },
    { icon: BarChart3, title: "AI Predictions", description: "Machine learning models forecast construction surges with confidence scores. Methodology documented and transparent." },
    { icon: Users, title: "User Analytics", description: "Per-account metrics and reporting dashboards. Track your research activity, saved searches, and team engagement." },
    { icon: Zap, title: "ROI Tools", description: "Investment analysis and market comparison tools. Evaluate opportunity costs and projected returns across target regions." },
    { icon: Download, title: "Reports", description: "Generate intelligence briefs with charts and narrative summaries from your dashboard." },
  ];

  const useCases = [
    { icon: Building2, title: "Commercial Real Estate", description: "Spot emerging submarkets before land prices surge. Track permit velocity, zoning changes, and infrastructure investments across your target regions to identify development opportunities early." },
    { icon: LocateFixed, title: "Site Selection", description: "Deliver data-backed location recommendations with confidence scores. Compare markets on growth trajectory, labor availability, and regulatory climate to make informed decisions." },
    { icon: Mountain, title: "Land Investors", description: "Identify counties with accelerating construction activity. Get early signals on where demand is heating up so you can acquire ahead of the curve and maximize returns." },
    { icon: Handshake, title: "Commercial Brokers", description: "Know which markets are primed for leasing activity before your competitors. Use permit data to time your outreach and win more listings in high-growth areas." },
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

      {/* Platform Capabilities */}
      <section className="py-20 md:py-28 bg-canvas">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
              <Zap className="w-4 h-4" /><span>Platform Capabilities</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">What BuildSignal Delivers</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">Core capabilities of the platform. Actual coverage and performance metrics are available to authenticated users.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap) => (
              <div key={cap.title} className="bg-surface border border-border rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                  <cap.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold 