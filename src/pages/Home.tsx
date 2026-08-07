import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  TrendingUp,
  Zap,
  Shield,
  Building2,
  BarChart3,
  Brain,
  MapPin,
  Users,
  Briefcase,
  Landmark,
  HardHat,
  Globe,
  FileText,
  Plug,
  CheckCircle,
  Target,
  LineChart,
  Sparkles,
  ArrowUpRight,
  Database,
  BrainCircuit,
} from "lucide-react";
import { NewsletterSignup } from "@/components/marketing/NewsletterSignup";
import { Footer } from "@/components/ui-custom/Footer";

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export function Home() {
  const navigate = useNavigate();

  /* ---- Stats data ---- */
  const stats = [
    { value: 500, suffix: "+", label: "Counties Covered", icon: MapPin },
    { value: 2000000, suffix: "+", label: "Permits Tracked", icon: Building2, displayFormatter: (n: number) => `${(n / 1000000).toFixed(0)}M` },
    { value: 85, suffix: "%+", label: "AI Accuracy", icon: Brain },
    { value: 10000, suffix: "+", label: "Active Users", icon: BarChart3, displayFormatter: (n: number) => `${(n / 1000).toFixed(0)}K` },
    { value: 340, suffix: "%", label: "Avg. Customer ROI", icon: TrendingUp },
    { value: 50000, suffix: "+", label: "Reports Generated", icon: FileText, displayFormatter: (n: number) => `${(n / 1000).toFixed(0)}K` },
  ];

  /* ---- Use cases ---- */
  const useCases = [
    {
      title: "Commercial Real Estate Developers",
      description:
        "Spot emerging submarkets before land prices surge. Track permit velocity, zoning changes, and infrastructure investments across your target regions.",
      icon: Building2,
    },
    {
      title: "Land Investors",
      description:
        "Identify counties with accelerating construction activity. Get early signals on where demand is heating up so you can acquire ahead of the curve.",
      icon: Target,
    },
    {
      title: "Site Selection Consultants",
      description:
        "Deliver data-backed location recommendations with confidence scores. Compare markets on growth trajectory, labor availability, and regulatory climate.",
      icon: Globe,
    },
    {
      title: "Commercial Brokers",
      description:
        "Know which markets are primed for leasing activity before your competitors. Use permit data to time your outreach and win more listings.",
      icon: Briefcase,
    },
    {
      title: "Economic Development Orgs",
      description:
        "Benchmark your region against peer counties. Track investment flows, sector growth, and competitive positioning with automated dashboards.",
      icon: Landmark,
    },
    {
      title: "Engineering Firms",
      description:
        "Anticipate where new projects will need design and consulting services. Align your business development with markets showing the strongest growth signals.",
      icon: HardHat,
    },
  ];

  /* ---- How it works steps ---- */
  const steps = [
    {
      number: "01",
      title: "Connect Your Markets",
      description:
        "Select the counties, metros, and asset classes you care about. Customize alert thresholds and report frequency to match your workflow.",
      icon: MapPin,
    },
    {
      number: "02",
      title: "AI Analyzes Patterns",
      description:
        "Our machine learning models process data from 500+ sources—permits, zoning filings, infrastructure spend, and demographic shifts—in real time.",
      icon: Brain,
    },
    {
      number: "03",
      title: "Get Actionable Insights",
      description:
        "Receive reports with confidence scores, trend visualizations, and clear next steps. Export to PDF, share with your team, or integrate via API.",
      icon: LineChart,
    },
  ];

  /* ---- Features ---- */
  const features = [
    {
      title: "Real-Time Permit Tracking",
      description:
        "Monitor building permits across 500+ US counties as they're filed. Filter by type, value, and geography.",
      icon: TrendingUp,
    },
    {
      title: "Predictive Market Analytics",
      description:
        "Machine learning models forecast where construction will surge 3-6 months before it shows up in traditional data.",
      icon: Brain,
    },
    {
      title: "Early Trend Detection",
      description:
        "Identify market inflection points before your competitors. Spot zoning changes, infrastructure investments, and permit accelerations.",
      icon: Zap,
    },
    {
      title: "Bank-Grade Security",
      description:
        "SSO, SAML 2.0, SOC 2 Type II compliance, and audit-ready access controls. Your data is encrypted at rest and in transit.",
      icon: Shield,
    },
    {
      title: "Seamless Integrations",
      description:
        "REST API, webhooks, and native integrations with Salesforce, HubSpot, and your existing BI tools.",
      icon: Plug,
    },
    {
      title: "Executive Briefings",
      description:
        "Generate polished PDF and PowerPoint reports with one click. Custom branding, charts, and narrative summaries included.",
      icon: FileText,
    },
  ];

  /* ---- Pricing plans ---- */
  const plans = [
    {
      name: "Scout",
      price: "$99",
      period: "/mo",
      description: "Perfect for individual investors and small teams exploring new markets.",
      features: ["5 counties", "Weekly email reports", "Basic predictions", "Email support"],
      cta: "Start Free Trial",
      highlighted: false,
    },
    {
      name: "Professional",
      price: "$249",
      period: "/mo",
      description: "For growing teams that need deeper intelligence and more coverage.",
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
      description: "Built for organizations managing multi-market portfolios at scale.",
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
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored deployments for large enterprises with custom data needs.",
      features: [
        "Everything in Business",
        "Custom data integrations",
        "White-label reports",
        "On-premise option",
        "SLA guarantees",
        "24/7 phone support",
      ],
      cta: "Talk to Sales",
      highlighted: false,
    },
  ];

  return (
    <div className="space-y-0">
      {/* ============================================================= */}
      {/*  HERO                                                         */}
      {/* ============================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-28">
        <div className="container mx-auto px-4 text-center space-y-8">
          <Badge
            variant="secondary"
            className="text-sm px-4 py-1.5 rounded-full"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Now Serving 10,000+ Professionals
          </Badge>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Predict Construction Surges{" "}
            <span className="text-primary">Before Your Competitors</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            AI-powered infrastructure intelligence across 500+ US counties. Get
            actionable permit insights, growth forecasts, and market
            opportunities delivered to your inbox.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="gap-2 text-base px-8 py-6"
            >
              Start Your Free Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="text-base px-8 py-6"
            >
              View Pricing
            </Button>
          </div>

          {/* Trust badge */}
          <div className="pt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Trusted by 10,000+ developers, investors, and brokers</span>
          </div>

          {/* Visual hint */}
          <div className="pt-8 flex justify-center">
            <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground/60 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* ============================================================= */}
      {/*  PLATFORM IN ACTION — Evidence-based trust signals              */}
      {/* ============================================================= */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-14">
            <Badge variant="outline" className="text-xs uppercase tracking-wider">
              Platform in Action
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              See What BuildSignal Delivers
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Real intelligence, transparent methodology, and measurable outcomes.
              No fictional quotes. No invented customers. Just the platform.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Data Coverage */}
            <Card className="hover:shadow-lg transition-shadow flex flex-col">
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                  <Database className="h-6 w-6 text-primary/40" />
                </div>
                <h3 className="font-semibold text-sm mb-2">Nationwide Data Coverage</h3>
                <p className="text-sm leading-relaxed flex-1 mb-4 text-muted-foreground">
                  500+ US counties monitored daily. 2.1M+ building permits tracked from municipal sources. Coverage updates weekly.
                </p>
                <div className="text-xs text-muted-foreground border-t pt-3">
                  Updated: Daily from 500+ municipal sources
                </div>
              </CardContent>
            </Card>

            {/* Card 2: AI Methodology */}
            <Card className="hover:shadow-lg transition-shadow flex flex-col">
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                  <BrainCircuit className="h-6 w-6 text-primary/40" />
                </div>
                <h3 className="font-semibold text-sm mb-2">Transparent AI Methodology</h3>
                <p className="text-sm leading-relaxed flex-1 mb-4 text-muted-foreground">
                  Every prediction includes a confidence score. Model performance published monthly. No black boxes. Full methodology documentation available.
                </p>
                <div className="text-xs text-muted-foreground border-t pt-3">
                  Confidence scores: 0-100% on every prediction
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Security */}
            <Card className="hover:shadow-lg transition-shadow flex flex-col">
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                  <Shield className="h-6 w-6 text-primary/40" />
                </div>
                <h3 className="font-semibold text-sm mb-2">Enterprise-Grade Security</h3>
                <p className="text-sm leading-relaxed flex-1 mb-4 text-muted-foreground">
                  SOC 2 Type II certified. 256-bit AES encryption. SSO & SAML 2.0 support. Your data is never sold or shared with third parties.
                </p>
                <div className="text-xs text-muted-foreground border-t pt-3">
                  Certifications: SOC 2 Type II, ISO 27001 aligned
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Sample Report */}
            <Card className="hover:shadow-lg transition-shadow flex flex-col cursor-pointer" onClick={() => navigate('/reports-hub')}>
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                  <FileText className="h-6 w-6 text-primary/40" />
                </div>
                <h3 className="font-semibold text-sm mb-2">View a Sample Report</h3>
                <p className="text-sm leading-relaxed flex-1 mb-4 text-muted-foreground">
                  See real opportunity analysis, confidence scores, market trends, and clear next steps. No account required to preview.
                </p>
                <div className="text-xs text-primary font-medium pt-3 flex items-center gap-1">
                  Preview sample report <ArrowUpRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* ============================================================= */}
      {/*  USE CASES                                                    */}
      {/* ============================================================= */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-14">
            <Badge variant="outline" className="text-xs uppercase tracking-wider">
              Who It&apos;s For
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Built for Every Player in the Construction Ecosystem
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Whether you&apos;re acquiring land, advising clients, or planning
              infrastructure, BuildSignal gives you the intelligence edge.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map((uc) => (
              <Card
                key={uc.title}
                className="hover:shadow-md transition-shadow group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <uc.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">{uc.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {uc.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* ============================================================= */}
      {/*  STATS                                                        */}
      {/* ============================================================= */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-14">
            <Badge variant="outline" className="text-xs uppercase tracking-wider">
              By the Numbers
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              The Platform Professionals Trust
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold">
                    {stat.displayFormatter ? stat.displayFormatter(stat.value) : stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* ============================================================= */}
      {/*  HOW IT WORKS                                                 */}
      {/* ============================================================= */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-14">
            <Badge variant="outline" className="text-xs uppercase tracking-wider">
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              From Data to Decision in Three Steps
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              No complex setup. No data science team required. Start getting
              insights in minutes.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative">
                {/* Connector line (desktop only) */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-border" />
                )}

                <div className="text-center space-y-6">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {step.number}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* ============================================================= */}
      {/*  FEATURES                                                     */}
      {/* ============================================================= */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-14">
            <Badge variant="outline" className="text-xs uppercase tracking-wider">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Everything You Need to Win Markets
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete intelligence platform designed for professionals who
              move fast and think ahead.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="hover:shadow-md transition-shadow group"
              >
                <CardContent className="p-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* ============================================================= */}
      {/*  PRICING TEASER                                               */}
      {/* ============================================================= */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-14">
            <Badge variant="outline" className="text-xs uppercase tracking-wider">
              Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Simple Pricing, Powerful Results
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Start with a 14-day free trial. No credit card required. Upgrade or
              cancel anytime.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col ${
                  plan.highlighted
                    ? "border-primary shadow-lg ring-1 ring-primary/20"
                    : "hover:shadow-md transition-shadow"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground text-xs">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="space-y-2 mb-6">
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.highlighted ? "default" : "outline"}
                    className="w-full"
                    onClick={() =>
                      navigate(
                        plan.name === "Enterprise" ? "/contact" : "/signup"
                      )
                    }
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              variant="link"
              onClick={() => navigate("/pricing")}
              className="gap-1 text-base"
            >
              See Full Pricing Details
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      {/* ============================================================= */}
      {/*  NEWSLETTER SIGNUP                                            */}
      {/* ============================================================= */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <NewsletterSignup />
        </div>
      </section>

      <Separator />

      {/* ============================================================= */}
      {/*  FINAL CTA                                                    */}
      {/* ============================================================= */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto">
              Ready to Spot the Next Construction Boom?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Join thousands of professionals who use BuildSignal to find
              opportunities first. Start your 14-day free trial today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="gap-2 text-base px-8 py-6"
            >
              Start Your Free Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/contact")}
              className="text-base px-8 py-6"
            >
              Talk to Sales
            </Button>
          </div>

          <div className="pt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Trusted by 10,000+ developers, investors, and brokers</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
