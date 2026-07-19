import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { trackEvent } from '@/hooks/useTelemetry';
import {
  ArrowRight, ArrowLeft, Check, Eye, Brain, MapPin,
  TrendingUp, Target, Zap, X, Sparkles, FileText
} from 'lucide-react';

interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  highlight?: string;
  demo?: React.ReactNode;
}

function DemoOpportunityCard() {
  return (
    <div className="bg-surface rounded-xl border border-accent-indigo/20 p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-accent-teal/10 text-accent-teal font-mono">92%</span>
        <span className="text-[10px] text-ink-tertiary uppercase tracking-wider">Mixed-Use</span>
      </div>
      <h4 className="text-sm font-semibold text-ink-primary mb-1">Apex Town Center Phase 2</h4>
      <p className="text-[11px] text-ink-secondary mb-2">42-acre development with strong permit velocity</p>
      <div className="flex items-center gap-3 text-[10px] text-ink-tertiary">
        <span>47 signals</span>
        <span>Wake County, NC</span>
        <span>23% ROI</span>
      </div>
    </div>
  );
}

function DemoConfidenceBreakdown() {
  return (
    <div className="bg-surface rounded-xl border border-ink-wash p-4 space-y-2">
      {[
        { label: 'Pattern Match', score: 85, color: 'bg-accent-teal' },
        { label: 'Source Reliability', score: 92, color: 'bg-accent-teal' },
        { label: 'Data Freshness', score: 78, color: 'bg-accent-indigo' },
        { label: 'Geographic Context', score: 88, color: 'bg-accent-teal' },
      ].map((f) => (
        <div key={f.label}>
          <div className="flex items-center justify-between text-[11px] mb-0.5">
            <span className="text-ink-secondary">{f.label}</span>
            <span className="text-ink-tertiary font-mono">{f.score}%</span>
          </div>
          <div className="h-1.5 bg-canvas rounded-full overflow-hidden">
            <div className={`h-full ${f.color} rounded-full`} style={{ width: `${f.score}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function DemoMapPreview() {
  return (
    <div className="bg-canvas rounded-xl border border-ink-wash p-3 relative h-32 overflow-hidden">
      {/* Simulated map dots */}
      {[
        { x: 25, y: 30, color: 'bg-accent-teal' },
        { x: 55, y: 25, color: 'bg-accent-indigo' },
        { x: 70, y: 55, color: 'bg-accent-amber' },
        { x: 40, y: 60, color: 'bg-accent-teal' },
        { x: 80, y: 35, color: 'bg-accent-indigo' },
        { x: 15, y: 50, color: 'bg-accent-amber' },
      ].map((dot, i) => (
        <div
          key={i}
          className={`absolute w-3 h-3 rounded-full ${dot.color} border-2 border-surface shadow`}
          style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
        />
      ))}
      <div className="absolute bottom-2 left-2 text-[10px] text-ink-tertiary bg-surface/80 px-2 py-0.5 rounded">
        6 opportunities in view
      </div>
    </div>
  );
}

function DemoReportPreview() {
  return (
    <div className="bg-surface rounded-xl border border-ink-wash p-4">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-accent-indigo" />
        <span className="text-xs font-semibold text-ink-primary">Weekly Intelligence Brief</span>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-canvas rounded w-full" />
        <div className="h-2 bg-canvas rounded w-3/4" />
        <div className="h-2 bg-canvas rounded w-5/6" />
        <div className="h-2 bg-canvas rounded w-2/3" />
      </div>
      <p className="text-[10px] text-ink-tertiary mt-3">12 pages • Generated Jul 19, 2026</p>
    </div>
  );
}

const STEPS: WalkthroughStep[] = [
  {
    id: 'intro',
    title: 'Your Intelligence Dashboard',
    description: 'This is where construction opportunities surface. Each card represents a detected project with AI-scored confidence, signal count, and ROI projection.',
    icon: Sparkles,
    demo: <DemoOpportunityCard />,
  },
  {
    id: 'confidence',
    title: 'Understanding Confidence Scores',
    description: 'Every opportunity includes a confidence score breakdown. We analyze pattern match, source reliability, data freshness, and geographic context to give you a transparent, actionable score.',
    icon: Brain,
    demo: <DemoConfidenceBreakdown />,
  },
  {
    id: 'map',
    title: 'Explore the Intelligence Map',
    description: 'See all opportunities on an interactive map. Green dots are high confidence, blue are medium, and amber are early signals. Click any marker for full details.',
    icon: MapPin,
    demo: <DemoMapPreview />,
  },
  {
    id: 'alerts',
    title: 'Smart Alerts',
    description: 'Set up alerts for your monitored counties and get notified the moment a new opportunity matches your criteria or crosses a confidence threshold.',
    icon: Zap,
  },
  {
    id: 'reports',
    title: 'Executive Reports',
    description: 'Generate professional PDF intelligence briefs with evidence, data sources, ROI projections, and recommended next steps — ready for your leadership team.',
    icon: FileText,
    demo: <DemoReportPreview />,
  },
  {
    id: 'done',
    title: 'You Are Ready',
    description: 'Your personalized intelligence feed is now active. You will start receiving relevant opportunities within 24 hours. Start exploring!',
    icon: Target,
  },
];

const STORAGE_KEY = 'buildsignal-walkthrough-completed';

interface SampleIntelligenceWalkthroughProps {
  onComplete: () => void;
}

export default function SampleIntelligenceWalkthrough({ onComplete }: SampleIntelligenceWalkthroughProps) {
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const { setCurrentPage } = useStore();

  const completed = localStorage.getItem(STORAGE_KEY) === 'true';
  if (completed || dismissed) {
    return null;
  }

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem(STORAGE_KEY, 'true');
      trackEvent('onboarding_complete', { source: 'sample_walkthrough' });
      onComplete();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleSkip = () => {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-canvas/85 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative w-full max-w-[420px] bg-surface border border-ink-wash rounded-2xl shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-canvas">
          <div
            className="h-full bg-accent-indigo rounded-full transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-ink-wash/50">
          <span className="text-[10px] text-ink-tertiary uppercase tracking-wider font-medium">
            Product Tour {step + 1} of {STEPS.length}
          </span>
          <button
            onClick={handleSkip}
            className="w-7 h-7 rounded-lg hover:bg-canvas flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5 text-ink-tertiary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="w-12 h-12 rounded-2xl bg-accent-indigo/10 flex items-center justify-center mb-4">
            <Icon className="w-6 h-6 text-accent-indigo" />
          </div>

          <h3 className="text-lg font-semibold text-ink-primary mb-2">
            {current.title}
          </h3>
          <p className="text-sm text-ink-secondary leading-relaxed mb-4">
            {current.description}
          </p>

          {/* Demo widget */}
          {current.demo && (
            <div className="mb-4">{current.demo}</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-ink-wash/50 bg-canvas/30">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={isFirst}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              isFirst ? 'text-ink-tertiary cursor-not-allowed' : 'text-ink-secondary hover:bg-surface-hover'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>

          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === step ? 'bg-accent-indigo w-3' : i < step ? 'bg-accent-indigo/50' : 'bg-ink-wash'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-indigo text-white text-xs font-semibold hover:bg-accent-indigo-dim transition-all"
          >
            {isLast ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Start Exploring
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
