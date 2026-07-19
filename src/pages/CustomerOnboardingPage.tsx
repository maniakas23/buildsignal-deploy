import { useStore } from '@/store/useStore';
import {
  Check, Clock, ArrowRight, BookOpen, Search, MapPin,
  Bell, Star, FileText, Users, HelpCircle, Zap,
  Target, TrendingUp, Shield, Sparkles
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  time: string;
  action: string;
  page: string;
}

const STEPS: OnboardingStep[] = [
  {
    id: 'account',
    title: 'Create Your Account',
    description: 'Sign up with your work email. No credit card required for the 14-day trial.',
    icon: Shield,
    time: '1 min',
    action: 'Sign Up',
    page: 'signup',
  },
  {
    id: 'counties',
    title: 'Select Counties to Monitor',
    description: 'Choose the geographic areas where you want to track construction activity. You can add or remove counties anytime.',
    icon: MapPin,
    time: '2 min',
    action: 'Select Counties',
    page: 'onboarding',
  },
  {
    id: 'search',
    title: 'Try Your First Search',
    description: 'Search for projects by county, type, or keyword. Try "Wake County mixed-use" to see how it works.',
    icon: Search,
    time: '1 min',
    action: 'Try Search',
    page: 'search',
  },
  {
    id: 'alerts',
    title: 'Set Up Smart Alerts',
    description: 'Configure alerts for your monitored counties. Get notified when new opportunities match your criteria.',
    icon: Bell,
    time: '2 min',
    action: 'Set Up Alerts',
    page: 'alerts',
  },
  {
    id: 'map',
    title: 'Explore the Intelligence Map',
    description: 'Visualize all active opportunities on an interactive map. Filter by type, confidence, and timeline.',
    icon: Target,
    time: '3 min',
    action: 'View Map',
    page: 'map',
  },
  {
    id: 'watchlist',
    title: 'Save Your First Watchlist',
    description: 'Track projects you care about. Organize by type, region, or any criteria that matters to your business.',
    icon: Star,
    time: '1 min',
    action: 'Create Watchlist',
    page: 'watchlists',
  },
  {
    id: 'report',
    title: 'Generate Your First Report',
    description: 'Create an executive intelligence brief with evidence, data sources, and recommended actions.',
    icon: FileText,
    time: '1 min',
    action: 'Generate Report',
    page: 'daily-brief',
  },
  {
    id: 'team',
    title: 'Invite Your Team',
    description: 'Add team members to collaborate on opportunity tracking and share intelligence.',
    icon: Users,
    time: '2 min',
    action: 'Invite Team',
    page: 'settings',
  },
];

const RESOURCES = [
  { icon: BookOpen, title: 'Getting Started Guide', description: 'Learn the basics of BuildSignal in 10 minutes.' },
  { icon: HelpCircle, title: 'Help Center', description: 'Search our knowledge base for answers to common questions.' },
  { icon: TrendingUp, title: 'Best Practices', description: 'Tips from our team on getting the most value from BuildSignal.' },
  { icon: Zap, title: 'API Documentation', description: 'Integrate BuildSignal data into your own systems and workflows.' },
];

export default function CustomerOnboardingPage() {
  const { setCurrentPage } = useStore();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-[720px] mx-auto px-6 pt-10 pb-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent-indigo/10 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7 text-accent-indigo" />
        </div>
        <h1 className="text-3xl font-semibold text-ink-primary tracking-tight mb-3">
          Getting Started with BuildSignal
        </h1>
        <p className="text-sm text-ink-secondary max-w-[440px] mx-auto leading-relaxed">
          Follow these steps to go from signup to your first construction opportunity in under 15 minutes.
        </p>
      </div>

      {/* Timeline */}
      <div className="max-w-[720px] mx-auto px-6 pb-10">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-8 bottom-8 w-px bg-ink-wash hidden sm:block" />

          <div className="space-y-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className="relative flex items-start gap-4 bg-surface rounded-xl border border-ink-wash p-4"
                >
                  {/* Step number */}
                  <div className="relative z-10 w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-accent-indigo" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm font-semibold text-ink-primary">
                            {step.title}
                          </h3>
                          <span className="flex items-center gap-1 text-[10px] text-ink-tertiary">
                            <Clock className="w-2.5 h-2.5" />
                            {step.time}
                          </span>
                        </div>
                        <p className="text-xs text-ink-secondary leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                      <button
                        onClick={() => setCurrentPage(step.page)}
                        className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent-indigo/10 text-[11px] font-medium text-accent-indigo hover:bg-accent-indigo/20 transition-colors"
                      >
                        {step.action}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total time */}
        <div className="mt-4 text-center">
          <p className="text-sm text-ink-secondary">
            Total setup time: <span className="font-semibold text-ink-primary">~13 minutes</span>
          </p>
        </div>
      </div>

      {/* Resources */}
      <div className="border-y border-ink-wash bg-surface/50">
        <div className="max-w-[720px] mx-auto px-6 py-10">
          <h2 className="text-xl font-semibold text-ink-primary mb-6 text-center">
            Helpful Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RESOURCES.map((resource) => {
              const Icon = resource.icon;
              return (
                <button
                  key={resource.title}
                  onClick={() => setCurrentPage('help')}
                  className="flex items-start gap-3 p-4 bg-surface rounded-xl border border-ink-wash hover:border-accent-indigo/30 transition-all text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-accent-indigo/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-accent-indigo" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink-primary mb-0.5">
                      {resource.title}
                    </h3>
                    <p className="text-[11px] text-ink-secondary leading-relaxed">
                      {resource.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Support CTA */}
      <div className="max-w-[720px] mx-auto px-6 py-10 text-center">
        <h2 className="text-lg font-semibold text-ink-primary mb-2">
          Need Help Getting Started?
        </h2>
        <p className="text-sm text-ink-secondary mb-5 max-w-[400px] mx-auto">
          Our team is available to help you get the most out of BuildSignal. Reach out anytime.
        </p>
        <button
          onClick={() => setCurrentPage('contact')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-indigo text-white text-sm font-semibold hover:bg-accent-indigo-dim transition-all"
        >
          Contact Support
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
