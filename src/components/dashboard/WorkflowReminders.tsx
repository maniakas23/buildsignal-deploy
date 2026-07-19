import { useStore } from '@/store/useStore';
import { trackEvent } from '@/hooks/useTelemetry';
import {
  MapPin, Bell, Search, Star, FileText, Check,
  ArrowRight, AlertCircle, Zap
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  page: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'counties',
    label: 'Select Counties',
    description: 'Choose geographic areas to monitor',
    icon: MapPin,
    page: 'onboarding',
    completed: true,
    priority: 'high',
  },
  {
    id: 'search',
    label: 'Try a Search',
    description: 'Search for projects in your area',
    icon: Search,
    page: 'search',
    completed: true,
    priority: 'high',
  },
  {
    id: 'alerts',
    label: 'Set Up Alerts',
    description: 'Get notified about new opportunities',
    icon: Bell,
    page: 'alerts',
    completed: false,
    priority: 'high',
  },
  {
    id: 'watchlist',
    label: 'Save a Watchlist',
    description: 'Track projects you care about',
    icon: Star,
    page: 'watchlists',
    completed: false,
    priority: 'medium',
  },
  {
    id: 'report',
    label: 'Generate a Report',
    description: 'Create your first intelligence brief',
    icon: FileText,
    page: 'daily-brief',
    completed: false,
    priority: 'medium',
  },
];

export default function WorkflowReminders() {
  const { setCurrentPage } = useStore();

  const completed = WORKFLOW_STEPS.filter((s) => s.completed).length;
  const total = WORKFLOW_STEPS.length;
  const pct = Math.round((completed / total) * 100);
  const incompleteHigh = WORKFLOW_STEPS.filter((s) => !s.completed && s.priority === 'high');

  const handleClick = (step: WorkflowStep) => {
    trackEvent(step.completed ? 'feature_use' : 'onboarding_step', {
      stepId: step.id,
      stepLabel: step.label,
    });
    setCurrentPage(step.page);
  };

  // If all done, show completion state
  if (completed === total) {
    return (
      <div className="bg-surface border border-accent-teal/20 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center">
            <Check className="w-5 h-5 text-accent-teal" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-primary">Setup Complete</p>
            <p className="text-[11px] text-ink-secondary">
              You have completed all setup steps. Your dashboard is fully configured.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-ink-wash rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-ink-wash/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent-amber" />
            <h3 className="text-sm font-semibold text-ink-primary">
              {incompleteHigh.length > 0 ? 'Recommended Next Steps' : 'Complete Your Setup'}
            </h3>
          </div>
          <span className="text-[10px] text-ink-tertiary font-mono">
            {completed}/{total}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-canvas rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-indigo rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="divide-y divide-ink-wash/30">
        {WORKFLOW_STEPS.filter((s) => !s.completed).map((step) => {
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              onClick={() => handleClick(step)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-canvas/50 transition-colors text-left group"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                step.priority === 'high'
                  ? 'bg-accent-amber/10'
                  : 'bg-canvas'
              }`}>
                <Icon className={`w-4 h-4 ${
                  step.priority === 'high' ? 'text-accent-amber' : 'text-ink-tertiary'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-ink-primary">{step.label}</p>
                  {step.priority === 'high' && (
                    <span className="flex items-center gap-0.5 text-[9px] text-accent-amber font-medium">
                      <AlertCircle className="w-2.5 h-2.5" />
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-ink-secondary">{step.description}</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-ink-tertiary group-hover:text-accent-indigo transition-colors shrink-0" />
            </button>
          );
        })}

        {/* Completed steps (collapsible hint) */}
        {WORKFLOW_STEPS.filter((s) => s.completed).length > 0 && (
          <div className="px-4 py-2 bg-canvas/30">
            <p className="text-[10px] text-ink-tertiary">
              {WORKFLOW_STEPS.filter((s) => s.completed).length} step{WORKFLOW_STEPS.filter((s) => s.completed).length > 1 ? 's' : ''} completed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
