// Home Page — Platform Completion Mode
// The first thing a visitor sees. Must answer: What is this? Why do I care? What do I do?
// No user can discover the product from a blank page.

import { useStore } from '@/store/useStore';
import { Signal, ArrowRight, Check, Activity, Map, Bell, FileText } from 'lucide-react';

const FEATURES = [
  {
    icon: Activity,
    title: 'Signal Detection',
    description: 'Monitor permits, zoning changes, and utility requests across your target regions in real time.',
  },
  {
    icon: Map,
    title: 'Intelligence Map',
    description: 'Visualize construction opportunities geographically. Filter by type, score, and confidence.',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description: 'Get notified when projects cross thresholds or match patterns you care about.',
  },
  {
    icon: FileText,
    title: 'Executive Reports',
    description: 'Export professional reports with evidence, sources, and recommended actions.',
  },
];

export default function Home() {
  const { setCurrentPage } = useStore();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="max-w-[720px] mx-auto px-6 pt-12 pb-16 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Signal className="w-6 h-6 text-ink-primary" />
          <span className="text-lg font-semibold text-ink-primary tracking-tight">BuildSignal</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold text-ink-primary tracking-tight mb-4 leading-tight">
          Infrastructure Intelligence
          <br />
          <span className="text-ink-tertiary">Before Ground Breaks</span>
        </h1>

        <p className="text-base text-ink-secondary max-w-[520px] mx-auto mb-8 leading-relaxed">
          BuildSignal monitors 2,400+ public data sources to detect construction
          opportunities 60–90 days before they become public knowledge.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrentPage('signup')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-indigo text-white text-sm font-medium hover:bg-accent-indigo/90 transition-colors"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage('pricing')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-canvas border border-ink-wash text-sm font-medium text-ink-secondary hover:bg-surface transition-colors"
          >
            View Pricing
          </button>
        </div>

        <p className="text-[11px] text-ink-tertiary mt-4">
          14 days free. No credit card required.
        </p>
      </div>

      {/* Features */}
      <div className="max-w-[720px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-surface rounded-2xl p-5 shadow-card border border-ink-wash"
              >
                <div className="w-9 h-9 rounded-lg bg-accent-indigo/10 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-accent-indigo" />
                </div>
                <h3 className="text-sm font-semibold text-ink-primary mb-1">{feature.title}</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Social Proof / Stats */}
      <div className="bg-surface border-y border-ink-wash">
        <div className="max-w-[720px] mx-auto px-6 py-10">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-semibold text-ink-primary font-mono">2,400+</p>
              <p className="text-[11px] text-ink-tertiary mt-1">Data Sources</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink-primary font-mono">60-90</p>
              <p className="text-[11px] text-ink-tertiary mt-1">Day Lead Time</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink-primary font-mono">94%</p>
              <p className="text-[11px] text-ink-tertiary mt-1">Confidence Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="max-w-[720px] mx-auto px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-ink-primary mb-3">
          Start Monitoring Today
        </h2>
        <p className="text-sm text-ink-secondary mb-6 max-w-[440px] mx-auto">
          Join firms that use BuildSignal to find infrastructure opportunities
          before their competitors.
        </p>
        <button
          onClick={() => setCurrentPage('signup')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-indigo text-white text-sm font-medium hover:bg-accent-indigo/90 transition-colors mx-auto"
        >
          Create Your Account
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-4 mt-6 text-[11px] text-ink-tertiary">
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-accent-teal" /> 14-day free trial
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-accent-teal" /> No credit card
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-accent-teal" /> Cancel anytime
          </span>
        </div>
      </div>
    </div>
  );
}
