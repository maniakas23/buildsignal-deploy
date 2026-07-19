import { useState } from 'react';
import { CheckCircle2, Circle, ArrowRight, MapPin, Search, Bell, FileText, Users, Settings, Rocket, BookOpen } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  estimatedTime: string;
  action: string;
  page: string;
}

const STEPS: OnboardingStep[] = [
  {
    id: 'profile',
    title: 'Complete Your Profile',
    description: 'Add your company info, role, and project preferences.',
    icon: <Users className="w-5 h-5 text-accent-indigo" />,
    estimatedTime: '2 min',
    action: 'Go to Settings',
    page: 'settings',
  },
  {
    id: 'counties',
    title: 'Select Your Counties',
    description: 'Choose the geographic areas you want to monitor for opportunities.',
    icon: <MapPin className="w-5 h-5 text-accent-teal" />,
    estimatedTime: '3 min',
    action: 'Explore Map',
    page: 'map',
  },
  {
    id: 'search',
    title: 'Try a Search',
    description: 'Search for opportunities by keyword, county, or signal type.',
    icon: <Search className="w-5 h-5 text-accent-amber" />,
    estimatedTime: '2 min',
    action: 'Start Searching',
    page: 'search',
  },
  {
    id: 'alerts',
    title: 'Set Up Alerts',
    description: 'Configure notifications for new opportunities in your areas.',
    icon: <Bell className="w-5 h-5 text-accent-crimson" />,
    estimatedTime: '3 min',
    action: 'Configure Alerts',
    page: 'alerts',
  },
  {
    id: 'report',
    title: 'Generate a Report',
    description: 'Create your first intelligence report with market context.',
    icon: <FileText className="w-5 h-5 text-accent-indigo" />,
    estimatedTime: '2 min',
    action: 'Create Report',
    page: 'summary',
  },
  {
    id: 'team',
    title: 'Invite Your Team',
    description: 'Add team members to collaborate on opportunities.',
    icon: <Users className="w-5 h-5 text-accent-teal" />,
    estimatedTime: '2 min',
    action: 'Manage Team',
    page: 'organization',
  },
  {
    id: 'customize',
    title: 'Customize Dashboard',
    description: 'Arrange widgets and set your preferred view.',
    icon: <Settings className="w-5 h-5 text-accent-amber" />,
    estimatedTime: '2 min',
    action: 'Customize',
    page: 'settings',
  },
  {
    id: 'done',
    title: 'You\'re All Set',
    description: 'Start discovering and winning more opportunities.',
    icon: <Rocket className="w-5 h-5 text-accent-teal" />,
    estimatedTime: '0 min',
    action: 'Go to Dashboard',
    page: 'dashboard',
  },
];

export default function CustomerOnboardingPage() {
  const { setCurrentPage } = useStore();
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(
    new Set(JSON.parse(localStorage.getItem('buildsignal_onboarding_steps') || '[]'))
  );

  const toggleStep = (id: string) => {
    const updated = new Set(completedSteps);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setCompletedSteps(updated);
    localStorage.setItem('buildsignal_onboarding_steps', JSON.stringify([...updated]));
  };

  const progress = Math.round((completedSteps.size / (STEPS.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero */}
      <section className="bg-surface border-b border-ink-wash">
        <div className="max-w-content mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-accent-indigo" />
            </div>
            <span className="text-xs text-ink-tertiary uppercase tracking-wider">Getting Started</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary mb-3">
            Welcome to BuildSignal
          </h1>
          <p className="text-sm text-ink-secondary leading-relaxed max-w-xl">
            Complete these steps to get the most out of BuildSignal. Estimated total time: ~16 minutes.
          </p>

          {/* Progress */}
          <div className="mt-6 max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-ink-tertiary">Your progress</span>
              <span className="text-xs font-medium text-accent-indigo">{progress}%</span>
            </div>
            <div className="h-2 bg-canvas rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-indigo rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-content mx-auto px-6 py-10">
        <div className="space-y-3">
          {STEPS.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            const isLast = index === STEPS.length - 1;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                  isCompleted
                    ? 'bg-accent-teal/[0.02] border-accent-teal/20'
                    : 'bg-surface border-ink-wash hover:border-accent-indigo/20'
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => !isLast && toggleStep(step.id)}
                  className={`mt-0.5 flex-shrink-0 ${isLast ? 'pointer-events-none' : ''}`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-accent-teal" />
                  ) : (
                    <Circle className="w-5 h-5 text-ink-wash" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={isCompleted ? 'text-accent-teal' : 'text-accent-indigo'}>
                      {step.icon}
                    </span>
                    <h3 className={`text-sm font-semibold ${isCompleted ? 'text-ink-tertiary line-through' : 'text-ink-primary'}`}>
                      {step.title}
                    </h3>
                    <span className="text-[10px] text-ink-tertiary ml-auto">{step.estimatedTime}</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isCompleted ? 'text-ink-tertiary' : 'text-ink-secondary'}`}>
                    {step.description}
                  </p>
                </div>

                {/* Action */}
                <button
                  onClick={() => setCurrentPage(step.page)}
                  className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent-indigo text-white text-xs font-medium hover:bg-accent-indigo/90 transition-colors"
                >
                  {step.action} <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Resources */}
      <section className="bg-surface border-y border-ink-wash">
        <div className="max-w-content mx-auto px-6 py-10">
          <h2 className="text-lg font-semibold text-ink-primary mb-4">Helpful Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setCurrentPage('help')}
              className="p-4 rounded-xl bg-canvas border border-ink-wash text-left hover:border-accent-indigo/20 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-accent-indigo mb-2" />
              <h3 className="text-sm font-medium text-ink-primary">Help Center</h3>
              <p className="text-xs text-ink-secondary mt-1">Searchable guides and FAQs</p>
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className="p-4 rounded-xl bg-canvas border border-ink-wash text-left hover:border-accent-indigo/20 transition-colors"
            >
              <Users className="w-5 h-5 text-accent-teal mb-2" />
              <h3 className="text-sm font-medium text-ink-primary">Contact Support</h3>
              <p className="text-xs text-ink-secondary mt-1">Get help from our team</p>
            </button>
            <button
              onClick={() => setCurrentPage('pricing')}
              className="p-4 rounded-xl bg-canvas border border-ink-wash text-left hover:border-accent-indigo/20 transition-colors"
            >
              <Rocket className="w-5 h-5 text-accent-amber mb-2" />
              <h3 className="text-sm font-medium text-ink-primary">Pricing Plans</h3>
              <p className="text-xs text-ink-secondary mt-1">Find the right plan for you</p>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
