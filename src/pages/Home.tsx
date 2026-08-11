import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
    <div className="min-h-screen bg-white font-sans motion-reduce:transition-none">
      {/* ============================================================= */}
      {/*  HERO                                                         */}
      {/* ============================================================= */}
      <section className="bg-white py-12 md:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F5F5] px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#1F5EFF]" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#333333]">
                Infrastructure Intelligence Platform
              </span>
            </div>

            <h1 className="text-[32px] font-bold leading-tight tracking-tight text-[#0B1F33] md:text-[42px]">
              Predict Construction Surges Before Your Competitors
            </h1>

            <p className="max-w-2xl text-[16px] leading-[1.5] text-[#333333]">
              AI-powered infrastructure intelligence for construction markets.
              Get actionable permit insights, growth forecasts, and market
              opportunities delivered to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
              <Button
                onClick={() => navigate("/signup")}
                className="cursor-pointer rounded-[4px] bg-[#1F5EFF] px-6 py-3 text-[14px] font-semibold text-white transition-all duration-200 ease-out hover:scale-105 hover:bg-[#1F5EFF]/90 active:scale-95"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => navigate("/pricing")}
                className="cursor-pointer rounded-[4px] border border-[#0B1F33] bg-white px-6 py-3 text-[14px] font-semibold text-[#0B1F33] transition-all duration-200 ease-out hover:bg-[#F5F5F5] active:scale-95"
              >
                View Pricing
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-[14px] text-[#333333]">
                <CheckCircle className="h-4 w-4 text-[#18A999]" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5 text-[14px] text-[#333333]">
                <CheckCircle className="h-4 w-4 text-[#18A999]" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-1.5 text-[14px] text-[#333333]">
                <CheckCircle className="h-4 w-4 text-[#18A999]" />
                <span>Cancel anytime</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Shield className="h-4 w-4 text-[#18A999]" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#333333]">
                SOC 2 Type II In Progress · 256-bit Encryption
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-[#F5F5F5]" />

      {/* ============================================================= */}
      {/*  HOW BUILDSIGNAL WORKS                                        */}
      {/* ============================================================= */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-10 space-y-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#333333]">
              How BuildSignal Works
            </span>
            <h2 className="text-[24px] font-semibold text-[#0B1F33]">
              From Data to Decision in Three Steps
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative">
                {/* Connector line between steps */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(100%-16px)] w-[calc(100%-32px)] h-[2px] bg-[#F5F5F5]" />
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#F5F5F5]">
                      <step.icon className="h-5 w-5 text-[#0B1F33]" />
                    </div>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1F5EFF] text-[12px] font-bold text-white font-mono">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-[18px] font-semibold text-[#0B1F33]">
                    {step.title}
                  </h3>
                  <p className="text-[16px] leading-[1.5] text-[#333333]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-[#F5F5F5]" />

      {/* ============================================================= */}
      {/*  PLATFORM CAPABILITIES                                        */}
      {/* ============================================================= */}
      <section className="bg-[#F5F5F5] py-12 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-10 space-y-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#333333]">
              Platform Capabilities
            </span>
            <h2 className="text-[24px] font-semibold text-[#0B1F33]">
              What BuildSignal Delivers
            </h2>
            <p className="max-w-xl text-[16px] leading-[1.5] text-[#333333]">
              Core capabilities of the platform. Actual coverage and performance
              metrics are available to authenticated users.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap) => (
              <Card
                key={cap.title}
                className="cursor-pointer rounded-[8px] border border-[#E5E5E5] bg-white p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardContent className="p-0 space-y-3">
                  <cap.icon className="h-5 w-5 text-[#0B1F33]" />
                  <h3 className="text-[18px] font-semibold text-[#0B1F33]">
                    {cap.title}
                  </h3>
                  <p className="text-[16px] leading-[1.5] text-[#333333]">
                    {cap.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-[#F5F5F5]" />

      {/* ============================================================= */}
      {/*  USE CASES                                                    */}
      {/* ============================================================= */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-10 space-y-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#333333]">
              Use Cases
            </span>
            <h2 className="text-[24px] font-semibold text-[#0B1F33]">
              Built for Every Player in the Construction Ecosystem
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {useCases.map((uc) => (
              <Card
                key={uc.title}
                className="cursor-pointer rounded-[8px] border border-[#E5E5E5] bg-white p-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardContent className="p-0 flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#F5F5F5]">
                    <uc.icon className="h-5 w-5 text-[#0B1F33]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[18px] font-semibold text-[#0B1F33]">
                      {uc.title}
                    </h3>
                    <p className="text-[16px] leading-[1.5] text-[#333333]">
                      {uc.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-[#F5F5F5]" />

      {/* ============================================================= */}
      {/*  PLATFORM IN ACTION — Dashboard Mockup                        */}
      {/* ============================================================= */}
      <section className="bg-[#F5F5F5] py-12 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-10 space-y-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#333333]">
              Platform in Action
            </span>
            <h2 className="text-[24px] font-semibold text-[#0B1F33]">
              See What BuildSignal Delivers
            </h2>
            <p className="max-w-xl text-[16px] leading-[1.5] text-[#333333]">
              A preview of the intelligence dashboard. All data shown is sample
              data for demonstration purposes.
            </p>
          </div>

          <div className="rounded-[8px] border border-[#E5E5E5] bg-white p-4 shadow-sm md:p-6">
            {/* Dashboard header */}
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-[18px] font-semibold text-[#0B1F33]">
                  Market Overview
                </h3>
                <p className="text-[14px] text-[#333333]">
                  Sample dashboard preview
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 self-start rounded-[4px] bg-[#F4A261]/15 px-2 py-1">
                <AlertTriangle className="h-3.5 w-3.5 text-[#F4A261]" />
                <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#F4A261]">
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
                  className="rounded-[4px] border border-[#E5E5E5] bg-white p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#333333]">
                      {stat.label}
                    </span>
                    <span className="rounded-[4px] bg-[#F5F5F5] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#333333]">
                      Sample
                    </span>
                  </div>
                  <div className="font-mono text-[24px] font-medium text-[#0B1F33]">
                    {stat.value}
                  </div>
                  <div
                    className={`text-[12px] font-semibold ${
                      stat.up === true
                        ? "text-[#18A999]"
                        : stat.up === false
                          ? "text-[#D32F2F]"
                          : "text-[#333333]"
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
              <div className="rounded-[4px] border border-[#E5E5E5] bg-white p-4 lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#333333]">
                    Permit Volume Trend
                  </span>
                  <span className="rounded-[4px] bg-[#F5F5F5] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#333333]">
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
                      stroke="#1F5EFF"
                      strokeWidth="2"
                      points="0,80 40,70 80,75 120,60 160,55 200,45 240,50 280,35 320,40 360,25 400,20"
                    />
                    <polyline
                      fill="none"
                      stroke="#18A999"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      points="0,85 40,78 80,80 120,68 160,62 200,52 240,58 280,42 320,48 360,32 400,28"
                    />
                    <circle cx="360" cy="25" r="4" fill="#1F5EFF" />
                    <circle cx="400" cy="20" r="4" fill="#1F5EFF" />
                  </svg>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-[#1F5EFF]" />
                    <span className="text-[12px] text-[#333333]">Actual</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-[#18A999]" />
                    <span className="text-[12px] text-[#333333]">
                      Predicted
                    </span>
                  </div>
                </div>
              </div>

              {/* Alert preview */}
              <div className="rounded-[4px] border border-[#E5E5E5] bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#333333]">
                    Latest Alert
                  </span>
                  <span className="rounded-[4px] bg-[#F5F5F5] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#333333]">
                    Sample
                  </span>
                </div>
                <div className="mb-3 rounded-[4px] bg-[#F4A261]/10 p-3">
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 shrink-0 text-[#F4A261]" />
                    <div>
                      <p className="text-[14px] font-semibold text-[#0B1F33]">
                        Surge Detected
                      </p>
                      <p className="text-[12px] text-[#333333]">
                        Dallas County permit filings up 34% month-over-month.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[4px] bg-[#18A999]/10 p-3">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 shrink-0 text-[#18A999]" />
                    <div>
                      <p className="text-[14px] font-semibold text-[#0B1F33]">
                        Trend Up
                      </p>
                      <p className="text-[12px] text-[#333333]">
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
                className="cursor-pointer rounded-[4px] bg-[#1F5EFF] px-6 py-3 text-[14px] font-semibold text-white transition-all duration-200 ease-out hover:bg-[#1F5EFF]/90"
              >
                See Sample Report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-[#F5F5F5]" />

      {/* ============================================================= */}
      {/*  PRICING TIERS                                                */}
      {/* ============================================================= */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-10 space-y-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#333333]">
              Pricing
            </span>
            <h2 className="text-[24px] font-semibold text-[#0B1F33]">
              Simple Pricing, Powerful Results
            </h2>
            <p className="max-w-xl text-[16px] leading-[1.5] text-[#333333]">
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
                    ? "border-[#1F5EFF] shadow-lg ring-1 ring-[#1F5EFF]/20"
                    : "border-[#E5E5E5] hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-4">
                    <div className="rounded-[4px] bg-[#1F5EFF] px-3 py-1 text-[12px] font-semibold text-white">
                      Most Popular
                    </div>
                  </div>
                )}

                <CardContent className="flex flex-1 flex-col space-y-6 p-0">
                  <div className="space-y-2">
                    <h3 className="text-[18px] font-semibold text-[#0B1F33]">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-[32px] font-bold text-[#0B1F33]">
                        {plan.price}
                      </span>
                      <span className="text-[14px] text-[#333333]">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-[14px] leading-[1.5] text-[#333333]">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-[14px] text-[#333333]"
                      >
                        <CheckCircle className="h-4 w-4 shrink-0 text-[#18A999]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full cursor-pointer rounded-[4px] px-6 py-3 text-[14px] font-semibold transition-all duration-200 ease-out ${
                      plan.highlighted
                        ? "bg-[#1F5EFF] text-white hover:scale-105 hover:bg-[#1F5EFF]/90 active:scale-95"
                        : "border border-[#0B1F33] bg-white text-[#0B1F33] hover:bg-[#F5F5F5] active:scale-95"
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
              className="inline-flex cursor-pointer items-center gap-1 text-[14px] font-semibold text-[#1F5EFF] transition-colors duration-200 hover:underline"
            >
              See Full Pricing Details
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <div className="h-px bg-[#F5F5F5]" />

      {/* ============================================================= */}
      {/*  NEWSLETTER SIGNUP                                            */}
      {/* ============================================================= */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <NewsletterSignup />
        </div>
      </section>

      <div className="h-px bg-[#F5F5F5]" />

      {/* ============================================================= */}
      {/*  TRUST AND CONTACT                                            */}
      {/* ============================================================= */}
      <section className="bg-[#F5F5F5] py-12 md:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-10 space-y-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#333333]">
              Trust and Contact
            </span>
            <h2 className="text-[24px] font-semibold text-[#0B1F33]">
              Enterprise-Grade Security and Support
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="rounded-[8px] border border-[#E5E5E5] bg-white p-4">
              <CardContent className="p-0 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#F5F5F5]">
                  <Shield className="h-5 w-5 text-[#0B1F33]" />
                </div>
                <h3 className="text-[18px] font-semibold text-[#0B1F33]">
                  SOC 2 Type II (In Progress)
                </h3>
                <p className="text-[16px] leading-[1.5] text-[#333333]">
                  Security controls aligned to SOC 2 Type II. Certification audit
                  not yet completed — not verified.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[8px] border border-[#E5E5E5] bg-white p-4">
              <CardContent className="p-0 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#F5F5F5]">
                  <Lock className="h-5 w-5 text-[#0B1F33]" />
                </div>
                <h3 className="text-[18px] font-semibold text-[#0B1F33]">
                  256-bit Encryption
                </h3>
                <p className="text-[16px] leading-[1.5] text-[#333333]">
                  AES-256 encryption at rest and in transit. Your data is never
                  sold or shared with third parties.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[8px] border border-[#E5E5E5] bg-white p-4">
              <CardContent className="p-0 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#F5F5F5]">
                  <Database className="h-5 w-5 text-[#0B1F33]" />
                </div>
                <h3 className="text-[18px] font-semibold text-[#0B1F33]">
                  No Data Selling
                </h3>
                <p className="text-[16px] leading-[1.5] text-[#333333]">
                  We never sell, rent, or share your proprietary data with
                  external parties. Your intelligence stays yours.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[8px] border border-[#E5E5E5] bg-white p-4">
              <CardContent className="p-0 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#F5F5F5]">
                  <Mail className="h-5 w-5 text-[#0B1F33]" />
                </div>
                <h3 className="text-[18px] font-semibold text-[#0B1F33]">
                  Email Support
                </h3>
                <p className="text-[16px] leading-[1.5] text-[#333333]">
                  Reach our team at{" "}
                  <a
                    href="mailto:support@buildsignal.net"
                    className="font-semibold text-[#1F5EFF] hover:underline"
                  >
                    support@buildsignal.net
                  </a>
                  . We typically respond within one business day.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[8px] border border-[#E5E5E5] bg-white p-4">
              <CardContent className="p-0 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#F5F5F5]">
                  <Phone className="h-5 w-5 text-[#0B1F33]" />
                </div>
                <h3 className="text-[18px] font-semibold text-[#0B1F33]">
                  Phone Support
                </h3>
                <p className="text-[16px] leading-[1.5] text-[#333333]">
                  Available for Business plan customers. Contact support to
                  schedule a call with our team.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[8px] border border-[#E5E5E5] bg-white p-4">
              <CardContent className="p-0 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#F5F5F5]">
                  <ArrowRight className="h-5 w-5 text-[#0B1F33]" />
                </div>
                <h3 className="text-[18px] font-semibold text-[#0B1F33]">
                  Contact Page
                </h3>
                <p className="text-[16px] leading-[1.5] text-[#333333]">
                  Visit our contact page for general inquiries, partnership
                  requests, and media relations.
                </p>
                <button
                  onClick={() => navigate("/contact")}
                  className="inline-flex cursor-pointer items-center gap-1 text-[14px] font-semibold text-[#1F5EFF] transition-colors duration-200 hover:underline"
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
