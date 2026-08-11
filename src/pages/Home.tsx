import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  Building2,
  Check,
  Filter,
  Globe,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  /* ---- Social proof stats ---- */
  const stats = [
    { value: "2,400+", label: "Active Beta Users" },
    { value: "1.2M+", label: "Permits Tracked" },
    { value: "98.2%", label: "Signal Accuracy" },
    { value: "<15 min", label: "Alert Latency" },
  ];

  /* ---- How it works ---- */
  const steps = [
    {
      title: "Define Your Markets",
      description:
        "Select counties, metros, and asset classes. Our system monitors municipal permits, zoning filings, and infrastructure investments across your target markets.",
      icon: Filter,
    },
    {
      title: "AI Detects Signals",
      description:
        "Machine learning models surface high-intent construction and land-development signals before they hit the open market.",
      icon: Zap,
    },
    {
      title: "Act First",
      description:
        "Get real-time alerts and actionable briefs so you can engage owners, contractors, and municipalities ahead of competitors.",
      icon: Bell,
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
        "Track new permits, status changes, and completions with full provenance back to the issuing authority.",
      icon: Building2,
    },
    {
      title: "Demand Signals",
      description:
        "Identify counties with accelerating construction activity. Get early signals on where demand is heating up so you can acquire ahead of the curve and maximize returns.",
      icon: TrendingUp,
    },
    {
      title: "Evidence-Backed Alerts",
      description:
        "Every alert links to source documents, so your team can validate opportunities in seconds.",
      icon: Shield,
    },
  ];

  /* ---- Pricing preview ---- */
  const tiers = [
    {
      name: "Starter",
      price: "$49",
      period: "/mo",
      features: ["5 counties", "Daily digest", "Email alerts"],
    },
    {
      name: "Pro",
      price: "$149",
      period: "/mo",
      features: ["25 counties", "Real-time alerts", "API access"],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: ["Unlimited counties", "Dedicated support", "SSO & SLA"],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0B1F33]">
      {/* ================= HERO ================= */}
      <section className="mx-auto max-w-[1200px] px-4 pb-16 pt-20 text-center sm:px-6">
        <h1 className="mx-auto max-w-3xl text-[40px] font-bold leading-[1.1] tracking-tight sm:text-[56px]">
          Construction Intelligence,
          <span className="text-[#18A999]"> Before It Happens</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-[1.6] text-[#333333]">
          BuildSignal monitors municipal permits, zoning filings, and
          infrastructure investments — surfacing high-intent signals so your
          team can act before the market catches on.
        </p>

        {/* Email capture */}
        {submitted ? (
          <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-[8px] border border-[#18A999] bg-[#F0FAF8] p-4">
            <Check className="h-5 w-5 text-[#18A999]" />
            <span className="text-[14px] font-medium text-[#0B1F33]">
              You're on the list! We'll be in touch shortly.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Work email"
              className="h-12 flex-1 rounded-[8px] border border-[#E5E5E5] px-4 text-[14px] outline-none focus:border-[#18A999]"
              aria-label="Work email"
            />
            <Button
              type="submit"
              className="h-12 rounded-[8px] bg-[#0B1F33] px-6 text-[14px] font-semibold text-white hover:bg-[#16324F]"
            >
              Get Early Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        )}
        {error && (
          <p className="mt-2 text-[13px] text-red-600" role="alert">
            {error}
          </p>
        )}
      </section>

      {/* ================= SOCIAL PROOF ================= */}
      <section className="border-y border-[#E5E5E5] bg-[#F5F5F5]">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-[28px] font-bold text-[#0B1F33]">
                {s.value}
              </div>
              <div className="mt-1 text-[13px] text-[#333333]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
        <h2 className="text-center text-[32px] font-bold tracking-tight">
          How It Works
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <Card
              key={step.title}
              className="rounded-[8px] border border-[#E5E5E5] bg-white"
            >
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#F0FAF8]">
                  <step.icon className="h-6 w-6 text-[#18A999]" />
                </div>
                <div className="mt-4 text-[13px] font-semibold uppercase tracking-wide text-[#18A999]">
                  Step {i + 1}
                </div>
                <h3 className="mt-2 text-[20px] font-semibold">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-[#333333]">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ================= CAPABILITIES ================= */}
      <section className="bg-[#F5F5F5]">
        <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
          <h2 className="text-center text-[32px] font-bold tracking-tight">
            Platform Capabilities
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((cap) => (
              <div
                key={cap.title}
                className="rounded-[8px] border border-[#E5E5E5] bg-white p-6"
              >
                <cap.icon className="h-6 w-6 text-[#18A999]" />
                <h3 className="mt-4 text-[18px] font-semibold">{cap.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-[#333333]">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#18A999] px-8 py-3 text-[15px] font-semibold text-white hover:bg-[#148F82]"
            >
              Start Monitoring
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="flex items-center gap-2 pt-2">
              <Shield className="h-4 w-4 text-[#18A999]" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#333333]">
                SOC 2 Type II In Progress · 256-bit Encryption
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRICING PREVIEW ================= */}
      <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
        <h2 className="text-center text-[32px] font-bold tracking-tight">
          Simple, Transparent Pricing
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`rounded-[8px] border ${
                tier.highlighted
                  ? "border-[#18A999] shadow-lg"
                  : "border-[#E5E5E5]"
              } bg-white`}
            >
              <CardContent className="p-6 text-center">
                <h3 className="text-[18px] font-semibold">{tier.name}</h3>
                <div className="mt-4">
                  <span className="text-[36px] font-bold">{tier.price}</span>
                  <span className="text-[15px] text-[#333333]">
                    {tier.period}
                  </span>
                </div>
                <ul className="mt-6 space-y-2 text-[14px] text-[#333333]">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#18A999]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-6 w-full rounded-[8px] ${
                    tier.highlighted
                      ? "bg-[#18A999] text-white hover:bg-[#148F82]"
                      : "border border-[#E5E5E5] bg-white text-[#0B1F33] hover:bg-[#F5F5F5]"
                  }`}
                >
                  {tier.name === "Enterprise" ? "Contact Sales" : "Choose Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-[#0B1F33]">
        <div className="mx-auto max-w-[1200px] px-4 py-20 text-center sm:px-6">
          <h2 className="text-[32px] font-bold tracking-tight text-white">
            Ready to See What the Market Misses?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-[1.6] text-[#B8C7D9]">
            Join the beta and start receiving evidence-backed construction
            intelligence for your markets.
          </p>
          <Link
            to="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-[8px] bg-[#18A999] px-8 py-3 text-[15px] font-semibold text-white hover:bg-[#148F82]"
          >
            Request Beta Access
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
