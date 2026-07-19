import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import {
  Signal, ArrowRight, Check, Activity, Map, Bell, FileText,
  Shield, Lock, Eye, Database, Clock, TrendingUp,
  Building2, HardHat, LineChart, Zap, Globe
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
    title: 'Early Signal Detection',
    description: 'Identify construction permits, zoning changes, and utility requests 60-90 days before they become public knowledge.',
  },
  {
    icon: Map,
    title: 'Geographic Intelligence',
    description: 'Visualize opportunities on an interactive map. Filter by county, project type, confidence score, and timeline.',
  },
  {
    icon: Bell,
    title: 'Smart Alert System',
    description: 'Get notified when projects match your criteria or cross confidence thresholds. Never miss an opportunity.',
  },
  {
    icon: FileText,
    title: 'Executive Reports',
    description: 'Generate professional PDF reports with evidence, data sources, and recommended next actions for your team.',
  },
  {
    icon: LineChart,
    title: 'Predictive Analytics',
    description: 'Our AI models analyze historical patterns to predict which signals will convert into active projects.',
  },
  {
    icon: Zap,
    title: 'Real-Time Monitoring',
    description: 'Continuous scanning of government databases, planning boards, and public records across all 50 states.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '1',
    icon: Database,
    title: 'Data Collection',
    description: 'We monitor 2,400+ public data sources including county planning boards, DOT filings, and utility requests.',
  },
  {
    step: '2',
    icon: Eye,
    title: 'AI Analysis',
    description: 'Machine learning models identify early construction signals and score each opportunity by confidence.',
  },
  {
    step: '3',
    icon: Building2,
    title: 'Actionable Insights',
    description: 'You receive ranked opportunities with geographic context, timeline estimates, and source documentation.',
  },
];

const TRUST_SIGNALS = [
  { icon: Shield, text: 'SOC 2 Type II Compliant' },
  { icon: Lock, text: 'Bank-Level Encryption' },
  { icon: Eye, text: 'Transparent AI Decisions' },
  { icon: Database, text: 'Public Data Only' },
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
        {/* Subtle background gradient */}
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

          {/* Headline */}
          <h1
            className={`text-4xl md:text-5xl font-semibold text-ink-primary tracking-tight mb-5 leading-[1.1] transition-all duration-700 delay-100 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Know About Construction Projects
            <br />
            <span className="text-gradient">Before Your Competitors</span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-lg text-ink-secondary max-w-[560px] mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            BuildSignal monitors public records across 3,100+ counties to detect
            early construction signals. Get a 60-90 day head start on your next opportunity.
          </p>

          {/* Single Primary CTA */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 transition-all duration-700 delay-300 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <button
              onClick={() => setCurrentPage('signup')}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-accent-indigo text-white text-base font-semibold hover:bg-accent-indigo-dim transition-all shadow-lg shadow-accent-indigo/20 hover:shadow-xl hover:shadow-accent-indigo/30 active:scale-[0.98]"
            >
              Start Free Trial
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
              14-day free trial
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-accent-teal" />
              No credit card required
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

      {/* ─── FEATURES GRID ─── */}
      <section className="max-w-[800px] mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-ink-primary mb-3">
            Everything You Need to Find Opportunities First
          </h2>
          <p className="text-sm text-ink-secondary max-w-[480px] mx-auto">
            From early signal detection to executive reporting, BuildSignal gives your team the complete intelligence toolkit.
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
              How BuildSignal Works
            </h2>
            <p className="text-sm text-ink-secondary max-w-[440px] mx-auto">
              Three simple steps from raw public data to actionable construction intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative text-center">
                  {/* Step number */}
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

      {/* ─── TRUST & SECURITY ─── */}
      <section className="max-w-[800px] mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-ink-primary mb-3">
            Built for Enterprise Trust
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
                Transparent AI Decision-Making
              </p>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Every recommendation includes its data sources, confidence score, and the reasoning behind the prediction. We believe you should understand how every insight is generated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA FOOTER ─── */}
      <section className="bg-surface border-y border-ink-wash">
        <div className="max-w-[800px] mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold text-ink-primary mb-3">
            Start Finding Opportunities Today
          </h2>
          <p className="text-sm text-ink-secondary mb-8 max-w-[440px] mx-auto leading-relaxed">
            Join construction firms, developers, and suppliers who use BuildSignal to discover projects before they become public knowledge.
          </p>

          {/* Single primary CTA */}
          <button
            onClick={() => setCurrentPage('signup')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent-indigo text-white text-base font-semibold hover:bg-accent-indigo-dim transition-all shadow-lg shadow-accent-indigo/20 hover:shadow-xl active:scale-[0.98]"
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Trust reinforcement */}
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
              Cancel anytime
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-accent-teal" />
              Results in 48 hours
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
