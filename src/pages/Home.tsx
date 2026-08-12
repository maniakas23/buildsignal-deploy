import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NewsletterSignup } from "@/components/marketing/NewsletterSignup";
import { Footer } from "@/components/ui-custom/Footer";
import {
  MapPin,
  SlidersHorizontal,
  BarChart3,
  Globe,
  Building2,
  Brain,
  Users,
  TrendingUp,
  FileText,
  Briefcase,
  Target,
  CheckCircle,
  Shield,
  Lock,
  ArrowRight,
  ArrowUpRight,
  Zap,
  Database,
  Mail,
  Phone,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export function Home() {
  const navigate = useNavigate();

  /* ---- How BuildSignal works steps ---- */
  const steps = [
    {
      number: "01",
      title: "Capture",
      description:
        "Select counties, metros, and asset classes. Our system monitors municipal permits, zoning filings, and infrastructure investments across your target markets.",
      icon: MapPin,
    },
    {
      number: "02",
      title: "Filter",
      description:
        "Apply intelligent filters by permit type, project value, timeline, and geography. Set custom alert thresholds to surface only the opportunities that match your strategy.",
      icon: SlidersHorizontal,
    },
    {
      number: "03",
      title: "Present",
      description:
        "Receive actionable reports with confidence scores, trend visualizations, and clear next steps. Export to PDF, share with your team, or integrate via API.",
      icon: BarChart3,
    },
  ];

  /* ---- Platform capabilities ---- */
  const capabilities = [
    {
      title: "County Coverage",
      description:
        "Monitor construction activity across covered US counties with daily data aggregation and automated coverage expansion.",
      icon: Globe,
    },
    {
      title: "Permit Tracking",
      description:
        "Track municipal building permits in real time. Filter by type, value, and geography to find relevant opportunities.",
      icon: Building2,
    },
    {
      title: "AI Predictions",
      description:
        "Machine learning models forecast construction surges with confidence scores. Methodology documented and transparent.",
      icon: Brain,
    },
    {
      title: "User Analytics",
      description:
        "Per-account metrics and reporting dashboards. Track your research activity, saved searches, and team engagement.",
      icon: Users,
    },
    {
      title: "ROI Tools",
      description:
        "Investment analysis and market comparison tools. Evaluate opportunity costs and projected returns across target regions.",
      icon: TrendingUp,
    },
    {
      title: "Reports",
      description:
        "Generate polished PDF and API exports with one click. Custom branding, charts, and narrative summaries included.",
      icon: FileText,
    },
  ];

  /* ---- Use cases ---- */
  const useCases = [
    {
      title: "Commercial Real Estate",
      description:
        "Spot emerging submarkets before land prices surge. Track permit velocity, zoning changes, and infrastructure investments across your target regions to identify development opportunities early.",
      icon: Building2,
    },
    {
      title: "Site Selection",
      description:
        "Deliver data-backed location recommendations with confidence scores. Compare markets on growth trajectory, labor availability, and regulatory climate to make informed decisions.",
      icon: MapPin,
    },
    {
      title: "Land Investors",
      description:
        "Identify counties with accelerating construction activity. Get early signals on where demand is heating up so you can acquire ahead of the curve and maximize returns.",
      icon: Target,
    },
    {
      title: "Commercial Brokers",
      description:
        "Know which markets are primed for leasing activity before your competitors. Use permit data to time your outreach and win more listings in high-growth areas.",
      icon: Briefcase,
    },
  ];

  /* ---- Pricing plans ---- */
  const plans = [
    {
      name: "Scout",
      price: "$99",
      period: "/mo",
      description:
        "Perfect for individual investors and small teams exploring new markets.",
      features: [
        "5 counties",
        "Weekly email reports",
        "Basic predictions",
        "Email support",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
    {
      name: "Professional",
      price: "$249",
      period: "/mo",
      description:
        "For growing teams that need deeper intelligence and more coverage.",
      features: [
        "25 counties",
        "Daily alerts + weekly briefings",
        "Advanced predictions",
        "API access",
        "Priority support",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Business",
      price: "$599",
      period: "/mo",
      description:
        "Built for organizations managing multi-market portfolios at scale.",
      features: [
        "Unlimited counties",
        "Real-time alerts",
        "Custom models",
        "Full API + webhooks",
        "SSO & SAML",
        "Dedicated account manager",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bs-canvas)] font-sans motion-reduce:transition-none">
      {/* ============================================================= */}
      {/*  HERO                                                         */}
      {/* ============================================================= */}
      <section className="bg-[var(--bs-canvas)] py-12 md:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--bs-surface-hover)] px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[var(--bs-action)]" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[var(--bs-text-secondary)]">
                Infrastructure Intelligence Platform
              </span>
            </div>

            <h1 className="text-[32px] font-bold leading-tight tracking-tight text-[var(--bs-text-primary)] md:text-[42px]">
              Predict Construction Surges Before Your Competitors
            </h1>

            <p className="max-w-2xl text-[16px] leading-[1.5] text-[var(--bs-text-secondary)]">
              AI-powered infrastructure intelligence for construction markets.
              Get actionable permit insights, growth forecasts, and market
              opportunities delivered to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
              <Button
                onClick={() => navigate("/signup")}
                className="cursor-pointer rounded-[4px] bg-[var(--bs-action)] px-6 py-3 text-[14px] font-semibold text-white transition-all duration-200 ease-out hover:scale-105 hover:bg-[var(--bs-action)]/90 active:scale-95"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => navigate("/pricing")}
                className="cursor-pointer rounded-[4px] border border-[var(--bs-text-primary)] bg-[var(--bs-surface)] px-6 py-3 text-[14px] font-semibold text-[var(--bs-text-primary)] transition-all duration-200 ease-out hover:bg-[var(--bs-surface-hover)] active:scale-95"
              >
                View Pricing
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-[14px] text-[var(--bs-text-secondary)]">
                <CheckCircle className="h-4 w-4 text-[var(--bs-intelligence)]" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5 text-[14px] text-[var(--bs-text-secondary)]">
                <CheckCircle className="h-4 w-4 text-[var(--bs-intelligence)]" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-1.5 text-[14px] text-[var(--bs-text-secondary)]">
                <CheckCircle className="h-4 w-4 text-[var(--bs-intelligence)]" />
                <span>Cancel anytime</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Shield className="h-4 w-4 text-[var(--bs-intelligence)]" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[var(--bs-text-secondary)]">
                SOC 2 Type II In Progress &middot; 256-bit Encryption
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-[var(--bs-border)]" />

      {/* ============================================================= */}
      {/*  HOW BUILDSIGNAL WORKS                                        */}
      {/* ============================================================= */}
      <section className="bg-[var(--bs-canvas)] py-12 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-10 space-y-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[var(--bs-text-secondary)]">
              How BuildSignal Works
            </span>
            <h2 className="text-[24px] font-semibold text-[var(--bs-text-primary)]">
              From Data to Decision in Three Steps
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative">
                {/* Connector line between steps */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(100%-16px)] w-[calc(100%-32px)] h-[2px] bg-[var(--bs-border)]" />
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[var(--bs-surface-hover)]">
                      <step.icon className="h-5 w-5 text-[var(--bs-text-primary)]" />
                    </div>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bs-action)] text-[12px] font-bold text-white font-mono">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-[18px] font-semibold text-[var(--bs-text-primary)]">
                    {step.title}
                  </h3>
                  <p className="text-[16px] leading-[1.5] text-[var(--bs-text-secondary)]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-[var(--bs-border)]" />

      {/* ============================================================= */}
      {/*  PLATFORM CAPABILITIES                                        */}
      {/* ============================================================= */}
      <section className="bg-[var(--bs-surface)] py-12 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-10 space-y-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[var(--bs-text-secondary)]">
              Platform Capabilities
            </span>
            <h2 className="text-[24px] font-semibold text-[var(--bs-text-primary)]">
              What BuildSignal Delivers
            </h2>
            <p className="max-w-xl text-[16px] leading-[1.5] text-[var(--bs-text-secondary)]">
              Core capabilities of the platform. Actual coverage and performance
              metrics are available to authenticated users.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap) => (
              <Card
                key={cap.title}
                className="cursor-pointer rounded-[8px] border border-[var(--bs-border)] bg-[var(--bs-surface)] p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
              >
                <CardContent className="p-0 space-y-3">
                  <cap.icon className="h-5 w-5 text-[var(--bs-text-primary)]" />
                  <h3 className="text-[18px] font-semibold text-[var(--bs-text-primary)]">
                    {cap.title}
                  </h3>
                  <p className="text-[16px] leading-[1.5] text-[var(--bs-text-secondary)]">
                    {cap.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-[var(--bs-border)]" />

      {/* ============================================================= */}
      {/*  USE CASES                                                    */}
      {/* ============================================================= */}
      <section className="bg-[var(--bs-canvas)] py-12 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-10 space-y-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[var(--bs-text-secondary)]">
              Use Cases
            </span>
            <h2 className="text-[24px] font-semibold text-[var(--bs-text-primary)]">
              Built for Every Player in the Construction Ecosystem
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {useCases.map((uc) => (
              <Card
                key={uc.title}
                className="cursor-pointer rounded-[8px] border border-[var(--bs-border)] bg-[var(--bs-surface)] p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
              >
                <CardContent className="p-0 flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--bs-surface-hover)]">
                    <uc.icon className="h-5 w-5 text-[var(--bs-text-primary)]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[18px] font-semibold text-[var(--bs-text-primary)]">
                      {uc.title}
                    </h3>
                    <p className="text-[16px] leading-[1.5] text-[var(--bs-text-secondary)]">
                      {uc.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-[var(--bs-border)]" />

      {/* ============================================================= */}
      {/*  PLATFORM IN ACTION — Dashboard Mockup                        */}
      {/* ============================================================= */}
      <section className="bg-[var(--bs-surface)] py-12 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-10 space-y-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[var(--bs-text-secondary)]">
              Platform in Action
            </span>
            <h2 className="text-[24px] font-semibold text-[var(--bs-text-primary)]">
              See What BuildSignal Delivers
            </h2>
            <p className="max-w-xl text-[16px] leading-[1.5] text-[var(--bs-text-secondary)]">
              A preview of the intelligence dashboard. All data shown is sample
              data for demonstration purposes.
            </p>
          </div>

          <div className="rounded-[8px] border border-[var(--bs-border)] bg-[var(--bs-surface)] p-4 shadow-sm md:p-6">
            {/* Dashboard header */}
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-[18px] font-semibold text-[var(--bs-text-primary)]">
                  Market Overview
                </h3>
                <p className="text-[14px] text-[var(--bs-text-secondary)]">
                  Sample dashboard preview
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 self-start rounded-[4px] bg-[var(--bs-opportunity)]/15 px-2 py-1">
                <AlertTriangle className="h-3.5 w-3.5 text-[var(--bs-opportunity)]" />
                <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[var(--bs-opportunity)]">
                  Sample
                </span>
              </div>
            </div>

            {/* Stat cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Active Permits",
                  value: "1,247",
                  change: "+12%",
                  up: true,
                },
                {
                  label: "Forecasted Surge",
                  value: "3",
                  change: "Next 90 days",
                  up: true,
                },
                {
                  label: "Counties Monitored",
                  value: "18",
                  change: "Of 25 max",
                  up: null,
                },
                {
                  label: "Confidence Score",
                  value: "87%",
                  change: "Avg. this week",
                  up: null,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[4px] border border-[var(--bs-border)] bg-[var(--bs-canvas)] p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[var(--bs-text-secondary)]">
                      {stat.label}
                    </span>
                    <span className="rounded-[4px] bg-[var(--bs-surface-hover)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-[var(--bs-text-secondary)]">
                      Sample
                    </span>
                  </div>
                  <div className="font-mono text-[24px] font-medium text-[var(--bs-text-primary)]">
                    {stat.value}
                  </div>
                  <div
                    className={`text-[12px] font-semibold ${
                      stat.up === true
                        ? "text-[var(--bs-intelligence)]"
                        : stat.up === false
                          ? "text-[var(--bs-error)]"
                          : "text-[var(--bs-text-secondary)]"
                    }`}
                  >
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart area + alert */}
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Chart mockup */}
              <div className="rounded-[4px] border border-[var(--bs-border)] bg-[var(--bs-canvas)] p-4 lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[var(--bs-text-secondary)]">
                    Permit Volume Trend
                  </span>
                  <span className="rounded-[4px] bg-[var(--bs-surface-hover)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-[var(--bs-text-secondary)]">
                    Sample
                  </span>
                </div>
                <div className="h-[140px] w-full">
                  <svg
                    viewBox="0 0 400 100"
                    className="h-full w-full"
                    preserveAspectRatio="none"
                  >
                    <polyline
                      fill="none"
                      stroke="var(--bs-action)"
                      strokeWidth="2"
                      points="0,80 40,70 80,75 120,60 160,55 200,45 240,50 280,35 320,40 360,25 400,20"
                    />
                    <polyline
                      fill="none"
                      stroke="var(--bs-intelligence)"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      points="0,85 40,78 80,80 120,68 160,62 200,52 240,58 280,42 320,48 360,32 400,28"
                    />
                    <circle cx="360" cy="25" r="4" fill="var(--bs-action)" />
                    <circle cx="400" cy="20" r="4" fill="var(--bs-action)" />
                  </svg>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-[var(--bs-action)]" />
                    <span className="text-[12px] text-[var(--bs-text-secondary)]">Actual</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-[var(--bs-intelligence)]" />
                    <span className="text-[12px] text-[var(--bs-text-secondary)]">
                      Predicted
                    </span>
                  </div>
                </div>
              </div>

              {/* Alert preview */}
              <div className="rounded-[4px] border border-[var(--bs-border)] bg-[var(--bs-canvas)] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[var(--bs-text-secondary)]">
                    Latest Alert
                  </span>
                  <span className="rounded-[4px] bg-[var(--bs-surface-hover)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-[var(--bs-text-secondary)]">
                    Sample
                  </span>
                </div>
                <div className="mb-3 rounded-[4px] bg-[var(--bs-opportunity)]/10 p-3">
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 shrink-0 text-[var(--bs-opportunity)]" />
                    <div>
                      <p className="text-[14px] font-semibold text-[var(--bs-text-primary)]">
                        Surge Detected
                      </p>
                      <p className="text-[12px] text-[var(--bs-text-secondary)]">
                        Dallas County permit filings up 34% month-over-month.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[4px] bg-[var(--bs-intelligence)]/10 p-3">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 shrink-0 text-[var(--bs-intelligence)]" />
                    <div>
                      <p className="text-[14px] font-semibold text-[var(--bs-text-primary)]">
                        Trend Up
                      </p>
                      <p className="text-[12px] text-[var(--bs-text-secondary)]">
                        Travis County commercial permits accelerating.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={() => navigate("/sample-report")}
                className="cursor-pointer rounded-[4px] bg-[var(--bs-action)] px-6 py-3 text-[14px] font-semibold text-white transition-all duration-200 ease-out hover:bg-[var(--bs-action)]/90"
              >
                See Sample Report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-[var(--bs-border)]" />

      {/* ============================================================= */}
      {/*  PRICING TIERS                                                */}
      {/* ============================================================= */}
      <section className="bg-[var(--bs-canvas)] py-12 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-10 space-y-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[var(--bs-text-secondary)]">
              Pricing
            </span>
            <h2 className="text-[24px] font-semibold text-[var(--bs-text-primary)]">
              Simple Pricing, Powerful Results
            </h2>
            <p className="max-w-xl text-[16px] leading-[1.5] text-[var(--bs-text-secondary)]">
              Start with a 14-day free trial. No credit card required. Upgrade
              or cancel anytime.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col cursor-pointer rounded-[8px] border p-4 transition-all duration-200 ease-out ${
                  plan.highlighted
                    ? "border-[var(--bs-action)] shadow-lg shadow-[var(--bs-action)]/10 ring-1 ring-[var(--bs-action)]/20"
                    : "border-[var(--bs-border)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-4">
                    <div className="rounded-[4px] bg-[var(--bs-action)] px-3 py-1 text-[12px] font-semibold text-white">
                      Most Popular
                    </div>
                  </div>
                )}

                <CardContent className="flex flex-1 flex-col space-y-6 p-0">
                  <div className="space-y-2">
                    <h3 className="text-[18px] font-semibold text-[var(--bs-text-primary)]">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-[32px] font-bold text-[var(--bs-text-primary)]">
                        {plan.price}
                      </span>
                      <span className="text-[14px] text-[var(--bs-text-secondary)]">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-[14px] leading-[1.5] text-[var(--bs-text-secondary)]">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-[14px] text-[var(--bs-text-secondary)]"
                      >
                        <CheckCircle className="h-4 w-4 shrink-0 text-[var(--bs-intelligence)]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full cursor-pointer rounded-[4px] px-6 py-3 text-[14px] font-semibold transition-all duration-200 ease-out ${
                      plan.highlighted
                        ? "bg-[var(--bs-action)] text-white hover:scale-105 hover:bg-[var(--bs-action)]/90 active:scale-95"
                        : "border border-[var(--bs-text-primary)] bg-[var(--bs-surface)] text-[var(--bs-text-primary)] hover:bg-[var(--bs-surface-hover)] active:scale-95"
                    }`}
                    onClick={() => navigate("/signup")}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={() => navigate("/pricing")}
              className="inline-flex cursor-pointer items-center gap-1 text-[14px] font-semibold text-[var(--bs-action)] transition-colors duration-200 hover:underline"
            >
              See Full Pricing Details
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <div className="h-px bg-[var(--bs-border)]" />

      {/* ============================================================= */}
      {/*  NEWSLETTER SIGNUP                                            */}
      {/* ============================================================= */}
      <section className="bg-[var(--bs-canvas)] py-12 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <NewsletterSignup />
        </div>
      </section>

      <div className="h-px bg-[var(--bs-border)]" />

      {/* ============================================================= */}
      {/*  TRUST AND CONTACT                                            */}
      {/* ============================================================= */}
      <section className="bg-[var(--bs-surface)] py-12 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-10 space-y-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[var(--bs-text-secondary)]">
              Trust and Contact
            </span>
            <h2 className="text-[24px] font-semibold text-[var(--bs-text-primary)]">
              Enterprise-Grade Security and Support
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="rounded-[8px] border border-[var(--bs-border)] bg-[var(--bs-surface)] p-4">
              <CardContent className="p-0 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--bs-surface-hover)]">
                  <Shield className="h-5 w-5 text-[var(--bs-text-primary)]" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--bs-text-primary)]">
                  SOC 2 Type II (In Progress)
                </h3>
                <p className="text-[16px] leading-[1.5] text-[var(--bs-text-secondary)]">
                  Security controls aligned to SOC 2 Type II. Certification audit
                  not yet completed — not verified.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[8px] border border-[var(--bs-border)] bg-[var(--bs-surface)] p-4">
              <CardContent className="p-0 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--bs-surface-hover)]">
                  <Lock className="h-5 w-5 text-[var(--bs-text-primary)]" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--bs-text-primary)]">
                  256-bit Encryption
                </h3>
                <p className="text-[16px] leading-[1.5] text-[var(--bs-text-secondary)]">
                  AES-256 encryption at rest and in transit. Your data is never
                  sold or shared with third parties.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[8px] border border-[var(--bs-border)] bg-[var(--bs-surface)] p-4">
              <CardContent className="p-0 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--bs-surface-hover)]">
                  <Database className="h-5 w-5 text-[var(--bs-text-primary)]" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--bs-text-primary)]">
                  No Data Selling
                </h3>
                <p className="text-[16px] leading-[1.5] text-[var(--bs-text-secondary)]">
                  We never sell, rent, or share your proprietary data with
                  external parties. Your intelligence stays yours.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[8px] border border-[var(--bs-border)] bg-[var(--bs-surface)] p-4">
              <CardContent className="p-0 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--bs-surface-hover)]">
                  <Mail className="h-5 w-5 text-[var(--bs-text-primary)]" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--bs-text-primary)]">
                  Email Support
                </h3>
                <p className="text-[16px] leading-[1.5] text-[var(--bs-text-secondary)]">
                  Reach our team at{" "}
                  <a
                    href="mailto:support@buildsignal.net"
                    className="font-semibold text-[var(--bs-action)] hover:underline"
                  >
                    support@buildsignal.net
                  </a>
                  . We typically respond within one business day.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[8px] border border-[var(--bs-border)] bg-[var(--bs-surface)] p-4">
              <CardContent className="p-0 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--bs-surface-hover)]">
                  <Phone className="h-5 w-5 text-[var(--bs-text-primary)]" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--bs-text-primary)]">
                  Phone Support
                </h3>
                <p className="text-[16px] leading-[1.5] text-[var(--bs-text-secondary)]">
                  Available for Business plan customers. Contact support to
                  schedule a call with our team.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[8px] border border-[var(--bs-border)] bg-[var(--bs-surface)] p-4">
              <CardContent className="p-0 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--bs-surface-hover)]">
                  <ArrowRight className="h-5 w-5 text-[var(--bs-text-primary)]" />
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--bs-text-primary)]">
                  Contact Page
                </h3>
                <p className="text-[16px] leading-[1.5] text-[var(--bs-text-secondary)]">
                  Visit our contact page for general inquiries, partnership
                  requests, and media relations.
                </p>
                <button
                  onClick={() => navigate("/contact")}
                  className="inline-flex cursor-pointer items-center gap-1 text-[14px] font-semibold text-[var(--bs-action)] transition-colors duration-200 hover:underline"
                >
                  Go to Contact
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
