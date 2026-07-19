import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import {
  Signal, ArrowRight, Check, Activity, Map, Bell, FileText,
  Shield, Lock, Eye, Database, Clock, TrendingUp,
  Building2, HardHat, LineChart, Zap, Globe,
  Quote, Users, Briefcase
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const TRUST_METRICS = [
  { value: '2,400+', label: 'Public Data Sources', icon: Database },
  { value: '60-90', label: 'Day Lead Time', icon: Clock },
  { value: '99.7%', label: 'Platform Uptime', icon: Shield },
  { value: '3,100+', label: 'US Counties Covered', icon: Globe },
];

const FEATURES = [
  {
    icon: Activity,
    title: 'Detect Projects 60-90 Days Earlier',
    description: 'Catch permits, zoning changes, and utility filings before they hit public awareness. Be first to every conversation.',
  },
  {
    icon: Map,
    title: 'Map Every Opportunity',
    description: 'See all active projects on an interactive map. Filter by county, project type, confidence score, and timeline at a glance.',
  },
  {
    icon: Bell,
    title: 'Never Miss a Signal',
    description: 'Smart alerts notify you the moment a project matches your criteria or crosses a confidence threshold.',
  },
  {
    icon: FileText,
    title: 'Executive-Ready Reports',
    description: 'Generate professional PDF briefs with evidence, data sources, ROI projections, and recommended next steps.',
  },
  {
    icon: LineChart,
    title: 'Predict Which Projects Will Happen',
    description: 'AI models analyze historical patterns to rank opportunities by likelihood of conversion. Focus on what matters.',
  },
  {
    icon: Zap,
    title: 'Always-On Intelligence',
    description: 'Continuous monitoring of 2,400+ government databases, planning boards, and public records — so you do not have to.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '1',
    icon: Database,
    title: 'We Monitor Everything',
    description: 'BuildSignal watches 2,400+ public data sources including county planning boards, DOT filings, utility requests, and zoning records.',
  },
  {
    step: '2',
    icon: Eye,
    title: 'AI Ranks the Signals',
    description: 'Machine learning models score every opportunity by confidence, cross-referencing multiple sources to validate each signal.',
  },
  {
    step: '3',
    icon: Building2,
    title: 'You Act First',
    description: 'Receive ranked opportunities with full context, timeline estimates, and source documentation — 60-90 days ahead of competitors.',
  },
];

const TRUST_SIGNALS = [
  { icon: Shield, text: 'SOC 2 Type II' },
  { icon: Lock, text: 'AES-256 Encryption' },
  { icon: Eye, text: 'Transparent AI' },
  { icon: Database, text: 'Public Data Only' },
];

const SOCIAL_PROOF = [
  {
    quote: 'BuildSignal helped us identify three major projects in our region before they were publicly announced. That early access translated directly into new contracts.',
    role: 'Business Development Director',
    company: 'Regional Construction Firm',
    icon: Briefcase,
  },
  {
    quote: 'The confidence scoring is what sets this apart. We know which signals to prioritize, and the ROI projections help us allocate resources efficiently.',
    role: 'VP of Strategy',
    company: 'Commercial Real Estate Developer',
    icon: Building2,
  },
  {
    quote: 'Our team went from spending hours manually searching county records to getting curated intelligence delivered daily. The time savings alone justified the investment.',
    role: 'Operations Manager',
    company: 'Infrastructure Supplier',
    icon: Users,
  },
];

const USE_CASES = [
  { icon: HardHat, title: 'General Contractors', description: 'Find projects before RFPs are issued' },
  { icon: Building2, title: 'Developers', description: 'Identify land and zoning opportunities early' },
  { icon: Zap, title: 'Suppliers', description: 'Track utility and infrastructure expansions' },
  { icon: Briefcase, title: 'Consultants', description: 'Advise clients with verified market intelligence' },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function Home() {
  const { setCurrentPage } = useStore();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-indigo/[0.03] to-transparent pointer-events-none" />

        <div className="relative max-w-[800px] mx-auto px-6 pt-16 pb-12 text-center">
          {/* Brand pill */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 mb-8 transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <Signal className="w-4 h-4 text-accent-indigo" />
            <span className="text-sm font-medium text-accent-indigo">
              Infrastructure Intelligence Platform
            </span>
          </div>

          {/* Headline — benefit-focused */}
          <h1
            className={`text-4xl md:text-5xl font-semibold text-ink-primary tracking-tight mb-5 leading-[1.1] transition-all duration-700 delay-100 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Win More Construction Projects
            <br />
            <span className="text-gradient">With a 60-90 Day Head Start</span>
          </h1>

          {/* Subheadline — outcome-focused */}
          <p
            className={`text-lg text-ink-secondary max-w-[560px] mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            BuildSignal monitors 2,400+ public data sources across 3,100+ counties to detect
            construction opportunities before your competitors even know they exist.
          </p>

          {/* Single Primary CTA */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 transition-all duration-700 delay-300 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <button
              onClick={() => setCurrentPage('signup')}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-accent-indigo text-white text-base font-semibold hover:bg-accent-indigo-dim transition-all shadow-lg shadow-accent-indigo/20 hover:shadow-xl hover:shadow-accent-indigo/30 active:scale-[0.98]"
            >
              Start Free Trial — 14 Days
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-surface border border-ink-wash text-sm font-medium text-ink-secondary hover:bg-surface-hover hover:border-ink-secondary/30 transition-all active:scale-[0.98]"
            >
              <HardHat className="w-4 h-4" />
              See Live Opportunities
            </button>
          </div>

          {/* Trust microcopy */}
          <div
            className={`flex flex-wrap items-center justify-center gap-4 text-xs text-ink-tertiary transition-all duration-700 delay-400 ${animate ? 'opacity-100' : 'opacity-0'}`}
          >
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-accent-teal" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-accent-teal" />
              Setup in under 5 minutes
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-accent-teal" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* ─── TRUST METRICS BAR ─── */}
      <section className="border-y border-ink-wash bg-surface/50">
        <div className="max-w-[800px] mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_METRICS.map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-2xl md:text-3xl font-semibold text-ink-primary font-mono tracking-tight">
                  {m.value}
                </p>
                <p className="text-xs text-ink-tertiary mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO IT SERVES ─── */}
      <section className="max-w-[800px] mx-auto px-6 py-12">
        <p className="text-center text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-6">
          Trusted by professionals across the construction industry
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {USE_CASES.map((u) => {
            const Icon = u.icon;
            return (
              <div
                key={u.title}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface border border-ink-wash text-center"
              >
                <Icon className="w-5 h-5 text-accent-indigo" />
                <p className="text-xs font-semibold text-ink-primary">{u.title}</p>
                <p className="text-[10px] text-ink-secondary">{u.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section className="max-w-[800px] mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-ink-primary mb-3">
            Find Opportunities Before Anyone Else
          </h2>
          <p className="text-sm text-ink-secondary max-w-[480px] mx-auto">
            From early signal detection to executive reporting, BuildSignal gives your team everything needed to act first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group bg-surface rounded-2xl p-5 border border-ink-wash hover:border-accent-indigo/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent-indigo/5"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center mb-3 group-hover:bg-accent-indigo/20 transition-colors">
                  <Icon className="w-5 h-5 text-accent-indigo" />
                </div>
                <h3 className="text-sm font-semibold text-ink-primary mb-1.5">
                  {f.title}
                </h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="bg-surface/50 border-y border-ink-wash">
        <div className="max-w-[800px] mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-ink-primary mb-3">
              Three Steps to Your First Opportunity
            </h2>
            <p className="text-sm text-ink-secondary max-w-[440px] mx-auto">
              From raw public data to actionable intelligence in minutes, not weeks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative text-center">
                  <div className="w-12 h-12 rounded-2xl bg-accent-indigo/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-5 h-5 text-accent-indigo" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-accent-indigo uppercase tracking-wider">
                    Step {step.step}
                  </span>
                  <h3 className="text-sm font-semibold text-ink-primary mt-2 mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="max-w-[800px] mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <Quote className="w-8 h-8 text-accent-indigo/30 mx-auto mb-3" />
          <h2 className="text-2xl font-semibold text-ink-primary mb-3">
            What Our Customers Say
          </h2>
          <p className="text-sm text-ink-secondary max-w-[400px] mx-auto">
            Construction professionals rely on BuildSignal to find projects first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SOCIAL_PROOF.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="bg-surface rounded-2xl p-5 border border-ink-wash"
              >
                <Quote className="w-5 h-5 text-accent-indigo/20 mb-3" />
                <p className="text-xs text-ink-secondary leading-relaxed mb-4">
                  &ldquo;{s.quote}&rdquo;
                </p>
                <div className="flex items-center gap-2 pt-3 border-t border-ink-wash/50">
                  <div className="w-7 h-7 rounded-full bg-accent-indigo/10 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-accent-indigo" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-ink-primary">{s.role}</p>
                    <p className="text-[10px] text-ink-tertiary">{s.company}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── TRUST & SECURITY ─── */}
      <section className="bg-surface/50 border-y border-ink-wash">
        <div className="max-w-[800px] mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-ink-primary mb-3">
            Enterprise-Grade Security & Transparency
            </h2>
            <p className="text-sm text-ink-secondary max-w-[440px] mx-auto">
              Your data security and transparency are our highest priorities.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_SIGNALS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.text}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-surface border border-ink-wash"
                >
                  <Icon className="w-5 h-5 text-accent-teal" />
                  <span className="text-xs text-ink-secondary text-center font-medium">
                    {s.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Data transparency note */}
          <div className="mt-8 p-4 rounded-xl bg-accent-indigo/5 border border-accent-indigo/10">
            <div className="flex items-start gap-3">
              <Eye className="w-4 h-4 text-accent-indigo mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-ink-primary mb-1">
                  Every AI Decision Is Explained
                </p>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Every recommendation includes its data sources, confidence score, and the reasoning behind the prediction. No black boxes. No unexplained rankings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA FOOTER ─── */}
      <section className="bg-surface border-y border-ink-wash">
        <div className="max-w-[800px] mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold text-ink-primary mb-3">
            Start Finding Projects First
          </h2>
          <p className="text-sm text-ink-secondary mb-8 max-w-[440px] mx-auto leading-relaxed">
            Join construction firms, developers, and suppliers who use BuildSignal to discover opportunities before they become public knowledge.
          </p>

          <button
            onClick={() => setCurrentPage('signup')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent-indigo text-white text-base font-semibold hover:bg-accent-indigo-dim transition-all shadow-lg shadow-accent-indigo/20 hover:shadow-xl active:scale-[0.98]"
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center justify-center gap-5 mt-8 text-xs text-ink-tertiary">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-accent-teal" />
              14-day free trial
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-accent-teal" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-accent-teal" />
              Setup in under 5 minutes
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-accent-teal" />
              First insight in 48 hours
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
