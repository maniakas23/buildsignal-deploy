import { useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  Search, MapPin, Bell, FileText, ArrowRight, ArrowLeft,
  Check, Sparkles, Compass, Target, Settings, Rocket
} from 'lucide-react';

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to BuildSignal',
    description: 'Let\'s get you set up to find construction opportunities before anyone else.',
    icon: Sparkles,
  },
  {
    id: 'search',
    title: 'Choose Your Counties',
    description: 'Select the geographic areas you want to monitor. You can always add more later.',
    icon: Compass,
  },
  {
    id: 'alerts',
    title: 'Set Your Alert Preferences',
    description: 'Tell us what types of projects interest you and how you want to be notified.',
    icon: Bell,
  },
  {
    id: 'interests',
    title: 'Define Your Project Types',
    description: 'Select the construction categories you want to track for maximum relevance.',
    icon: Target,
  },
  {
    id: 'complete',
    title: 'You\'re All Set',
    description: 'Your personalized intelligence dashboard is ready. Start exploring opportunities.',
    icon: Rocket,
  },
];

const SAMPLE_COUNTIES = [
  'Wake County, NC', 'Mecklenburg County, NC', 'Hillsborough County, FL',
  'Dallas County, TX', 'Maricopa County, AZ', 'Orange County, CA',
  'Fairfax County, VA', 'King County, WA', 'Denver County, CO',
];

const PROJECT_TYPES = [
  'Commercial Construction', 'Residential Development', 'Infrastructure',
  'Industrial', 'Healthcare Facilities', 'Education',
  'Transportation', 'Energy & Utilities',
];

export default function OnboardingPage() {
  const { setCurrentPage, addToast } = useStore();
  const [step, setStep] = useState(0);
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);

  const currentStep = STEPS[step];
  const StepIcon = currentStep.icon;
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  const toggleCounty = (c: string) => {
    setSelectedCounties((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const toggleType = (t: string) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const handleFinish = () => {
    addToast('Onboarding complete! Your dashboard is ready.', 'success');
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-[560px]">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-ink-tertiary font-medium">
              Step {step + 1} of {STEPS.length}
            </span>
            <span className="text-[11px] text-ink-tertiary">
              {Math.round(((step + 1) / STEPS.length) * 100)}%
            </span>
          </div>
          <div className="h-1.5 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-indigo rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step card */}
        <div className="bg-surface border border-ink-wash rounded-2xl p-6 md:p-8">
          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-accent-indigo/10 flex items-center justify-center mb-4">
            <StepIcon className="w-6 h-6 text-accent-indigo" />
          </div>

          <h1 className="text-xl font-semibold text-ink-primary mb-2">
            {currentStep.title}
          </h1>
          <p className="text-sm text-ink-secondary mb-6 leading-relaxed">
            {currentStep.description}
          </p>

          {/* Step content */}
          {currentStep.id === 'welcome' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-canvas border border-ink-wash">
                <Search className="w-4 h-4 text-accent-indigo mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-ink-primary">Smart Search</p>
                  <p className="text-[11px] text-ink-secondary">Find projects across 3,100+ counties</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-canvas border border-ink-wash">
                <MapPin className="w-4 h-4 text-accent-indigo mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-ink-primary">Geographic Intelligence</p>
                  <p className="text-[11px] text-ink-secondary">Visualize opportunities on an interactive map</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-canvas border border-ink-wash">
                <Bell className="w-4 h-4 text-accent-indigo mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-ink-primary">Smart Alerts</p>
                  <p className="text-[11px] text-ink-secondary">Get notified when opportunities match your criteria</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-canvas border border-ink-wash">
                <FileText className="w-4 h-4 text-accent-indigo mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-ink-primary">Executive Reports</p>
                  <p className="text-[11px] text-ink-secondary">Generate professional PDF reports with sources</p>
                </div>
              </div>
            </div>
          )}

          {currentStep.id === 'search' && (
            <div>
              <p className="text-xs text-ink-secondary mb-3">
                Select at least one county to get started. Popular choices for your region:
              </p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_COUNTIES.map((c) => {
                  const isSelected = selectedCounties.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleCounty(c)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-accent-indigo/10 border-accent-indigo/30 text-accent-indigo'
                          : 'bg-canvas border-ink-wash text-ink-secondary hover:border-ink-secondary/50'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      {c}
                    </button>
                  );
                })}
              </div>
              {selectedCounties.length > 0 && (
                <p className="text-[11px] text-accent-teal mt-3">
                  {selectedCounties.length} county{selectedCounties.length > 1 ? 'ies' : 'y'} selected
                </p>
              )}
            </div>
          )}

          {currentStep.id === 'alerts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-canvas border border-ink-wash">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-accent-indigo" />
                  <span className="text-xs font-medium text-ink-primary">Email Alerts</span>
                </div>
                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    emailAlerts ? 'bg-accent-indigo' : 'bg-ink-wash'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      emailAlerts ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-canvas border border-ink-wash">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4 text-accent-indigo" />
                  <span className="text-xs font-medium text-ink-primary">Confidence Threshold</span>
                </div>
                <p className="text-[11px] text-ink-secondary mb-2">
                  Only alert me about opportunities with at least {confidenceThreshold}% confidence
                </p>
                <input
                  type="range"
                  min={50}
                  max={95}
                  step={5}
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full accent-accent-indigo"
                />
                <div className="flex justify-between text-[10px] text-ink-tertiary mt-1">
                  <span>50%</span>
                  <span>95%</span>
                </div>
              </div>
            </div>
          )}

          {currentStep.id === 'interests' && (
            <div>
              <p className="text-xs text-ink-secondary mb-3">
                Select the project types you want to track:
              </p>
              <div className="flex flex-wrap gap-2">
                {PROJECT_TYPES.map((t) => {
                  const isSelected = selectedTypes.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleType(t)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-accent-indigo/10 border-accent-indigo/30 text-accent-indigo'
                          : 'bg-canvas border-ink-wash text-ink-secondary hover:border-ink-secondary/50'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      {t}
                    </button>
                  );
                })}
              </div>
              {selectedTypes.length > 0 && (
                <p className="text-[11px] text-accent-teal mt-3">
                  {selectedTypes.length} project type{selectedTypes.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          )}

          {currentStep.id === 'complete' && (
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-accent-teal/10 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-accent-teal" />
              </div>
              <p className="text-sm text-ink-secondary">
                Your personalized intelligence feed is configured and ready. You will start receiving relevant opportunities within 24 hours.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {selectedCounties.length > 0 && (
                  <span className="px-2 py-1 rounded-md bg-accent-indigo/10 text-[11px] text-accent-indigo font-medium">
                    {selectedCounties.length} counties
                  </span>
                )}
                {selectedTypes.length > 0 && (
                  <span className="px-2 py-1 rounded-md bg-accent-indigo/10 text-[11px] text-accent-indigo font-medium">
                    {selectedTypes.length} project types
                  </span>
                )}
                <span className="px-2 py-1 rounded-md bg-accent-teal/10 text-[11px] text-accent-teal font-medium">
                  {confidenceThreshold}% confidence threshold
                </span>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-ink-wash/50">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={isFirst}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isFirst
                  ? 'text-ink-tertiary cursor-not-allowed'
                  : 'text-ink-secondary hover:bg-surface-hover'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {isLast ? (
              <button
                onClick={handleFinish}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-indigo text-white text-sm font-semibold hover:bg-accent-indigo-dim transition-all active:scale-[0.98]"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-indigo text-white text-sm font-semibold hover:bg-accent-indigo-dim transition-all active:scale-[0.98]"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
