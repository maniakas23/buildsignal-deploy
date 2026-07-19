import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle2, TrendingUp, MapPin, FileText, BarChart3, Zap } from 'lucide-react';

interface Props {
  onComplete: () => void;
  onSkip: () => void;
}

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to BuildSignal',
    description: 'Get a 60-90 day head start on construction projects before they hit the market.',
    icon: <Zap className="w-6 h-6 text-accent-indigo" />,
  },
  {
    id: 'opportunities',
    title: 'AI-Ranked Opportunities',
    description: 'Each recommendation includes confidence scores, ROI projections, and market context.',
    icon: <TrendingUp className="w-6 h-6 text-accent-teal" />,
    demo: 'opportunity',
  },
  {
    id: 'confidence',
    title: 'Confidence Breakdown',
    description: 'See exactly how BuildSignal calculates confidence — signal counts, source diversity, and historical accuracy.',
    icon: <BarChart3 className="w-6 h-6 text-accent-amber" />,
    demo: 'confidence',
  },
  {
    id: 'map',
    title: 'Interactive Map',
    description: 'Explore opportunities geographically. Filter by county, signal type, and confidence level.',
    icon: <MapPin className="w-6 h-6 text-accent-indigo" />,
    demo: 'map',
  },
  {
    id: 'reports',
    title: 'Intelligence Reports',
    description: 'Generate detailed reports with market context, infrastructure signals, and risk factors.',
    icon: <FileText className="w-6 h-6 text-accent-teal" />,
    demo: 'report',
  },
  {
    id: 'done',
    title: 'You\'re All Set',
    description: 'Start exploring opportunities. The dashboard shows your personalized recommendations.',
    icon: <CheckCircle2 className="w-6 h-6 text-accent-teal" />,
  },
];

export default function SampleIntelligenceWalkthrough({ onComplete, onSkip }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem('buildsignal_walkthrough_done', 'true');
      onComplete();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleSkip = () => {
    localStorage.setItem('buildsignal_walkthrough_done', 'true');
    onSkip();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl shadow-xl border border-ink-wash max-w-lg w-full mx-4 overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-ink-wash">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-ink-tertiary">
              Step {currentStep + 1} of {STEPS.length}
            </span>
          </div>
          <button onClick={handleSkip} className="p-1.5 rounded-lg hover:bg-canvas transition-colors">
            <X className="w-4 h-4 text-ink-tertiary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-canvas flex items-center justify-center">
              {step.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ink-primary">{step.title}</h3>
            </div>
          </div>

          <p className="text-sm text-ink-secondary leading-relaxed mb-5">
            {step.description}
          </p>

          {/* Demo widgets */}
          {step.demo === 'opportunity' && <DemoOpportunityCard />}
          {step.demo === 'confidence' && <DemoConfidenceBreakdown />}
          {step.demo === 'map' && <DemoMapPreview />}
          {step.demo === 'report' && <DemoReportPreview />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-ink-wash bg-canvas/50">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-ink-secondary hover:bg-canvas transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentStep ? 'bg-accent-indigo' : i < currentStep ? 'bg-accent-indigo/40' : 'bg-ink-wash'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-accent-indigo text-white text-sm font-medium hover:bg-accent-indigo/90 transition-colors"
          >
            {isLast ? 'Get Started' : 'Next'} {!isLast && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function DemoOpportunityCard() {
  return (
    <div className="bg-canvas rounded-xl p-4 border border-ink-wash">
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-0.5 rounded-full bg-accent-teal/10 text-accent-teal text-[10px] font-medium">92% Confidence</span>
        <span className="px-2 py-0.5 rounded-full bg-accent-indigo/10 text-accent-indigo text-[10px] font-medium">Commercial</span>
      </div>
      <h4 className="text-sm font-medium text-ink-primary mb-1">Mixed-Use Development — Downtown Corridor</h4>
      <p className="text-xs text-ink-secondary mb-3">Permit filings, utility expansion, and zoning changes detected.</p>
      <div className="flex items-center gap-3 text-[10px] text-ink-tertiary">
        <span><strong className="text-ink-primary">12</strong> signals</span>
        <span><strong className="text-ink-primary">8</strong> sources</span>
        <span className="text-accent-indigo font-medium">34% ROI</span>
      </div>
    </div>
  );
}

function DemoConfidenceBreakdown() {
  const bars = [
    { label: 'Signal Count', value: 85, color: 'bg-accent-indigo' },
    { label: 'Source Diversity', value: 72, color: 'bg-accent-teal' },
    { label: 'Historical Accuracy', value: 94, color: 'bg-accent-amber' },
    { label: 'Data Freshness', value: 90, color: 'bg-accent-crimson' },
  ];

  return (
    <div className="bg-canvas rounded-xl p-4 border border-ink-wash space-y-3">
      {bars.map((bar) => (
        <div key={bar.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-ink-secondary">{bar.label}</span>
            <span className="text-[11px] font-mono text-ink-primary">{bar.value}%</span>
          </div>
          <div className="h-2 bg-ink-wash rounded-full overflow-hidden">
            <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${bar.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function DemoMapPreview() {
  return (
    <div className="bg-canvas rounded-xl border border-ink-wash overflow-hidden">
      <div className="h-32 bg-accent-indigo/5 relative flex items-center justify-center">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #595950 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.2,
        }} />
        <div className="relative flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-accent-indigo shadow-lg shadow-accent-indigo/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-accent-teal" />
          <div className="w-2 h-2 rounded-full bg-accent-amber" />
          <div className="w-3 h-3 rounded-full bg-accent-crimson shadow-lg shadow-accent-crimson/20" />
        </div>
      </div>
      <div className="p-3 flex items-center gap-3">
        <span className="flex items-center gap-1 text-[10px] text-ink-tertiary">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-indigo" /> High confidence
        </span>
        <span className="flex items-center gap-1 text-[10px] text-ink-tertiary">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-teal" /> Medium
        </span>
        <span className="flex items-center gap-1 text-[10px] text-ink-tertiary">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-amber" /> Emerging
        </span>
      </div>
    </div>
  );
}

function DemoReportPreview() {
  return (
    <div className="bg-canvas rounded-xl p-4 border border-ink-wash">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-accent-indigo" />
        <span className="text-xs font-medium text-ink-primary">Intelligence Report</span>
        <span className="text-[10px] text-ink-tertiary ml-auto">Generated just now</span>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-ink-wash rounded-full w-full" />
        <div className="h-2 bg-ink-wash rounded-full w-4/5" />
        <div className="h-2 bg-ink-wash rounded-full w-3/4" />
        <div className="h-2 bg-ink-wash rounded-full w-5/6" />
      </div>
      <div className="mt-3 pt-3 border-t border-ink-wash flex items-center gap-2">
        <span className="px-2 py-0.5 rounded bg-accent-indigo/10 text-accent-indigo text-[10px]">PDF</span>
        <span className="px-2 py-0.5 rounded bg-accent-teal/10 text-accent-teal text-[10px]">CSV</span>
      </div>
    </div>
  );
}
