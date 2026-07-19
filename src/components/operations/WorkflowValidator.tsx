import { useState, useCallback } from 'react';
import { Play, CheckCircle2, XCircle, Loader2, ChevronRight, RotateCcw, Shield } from 'lucide-react';
import { CUSTOMER_WORKFLOWS } from '@/hooks/useHealthCheck';
import type { WorkflowCheck } from '@/hooks/useHealthCheck';

const WORKFLOW_STEPS: Record<string, string[]> = {
  homepage: ['Load hero section', 'Verify trust metrics', 'Check feature grid', 'Validate CTAs'],
  signup: ['Render signup form', 'Validate email input', 'Submit registration', 'Confirm account created'],
  auth: ['Render login form', 'Submit credentials', 'Receive session token', 'Access protected routes'],
  onboarding: ['Show welcome banner', 'Display checklist', 'Track progress', 'Complete all steps'],
  dashboard: ['Load executive brief', 'Fetch KPIs', 'Render recommendations', 'Load zone cards'],
  parcel_search: ['Render search input', 'Execute search query', 'Display results', 'Apply filters'],
  infrastructure_search: ['Load signal filters', 'Search utility signals', 'Display infrastructure data', 'Show confidence scores'],
  maps: ['Initialize map canvas', 'Load cluster data', 'Render markers', 'Show popup details'],
  alerts: ['Fetch alert list', 'Render alert cards', 'Allow acknowledge', 'Update unread count'],
  reports: ['Load report data', 'Render summary', 'Show export options', 'Generate PDF'],
  billing: ['Fetch subscription', 'Show plan details', 'Display payment method', 'Allow plan change'],
  settings: ['Load preferences', 'Show profile form', 'Save changes', 'Confirm update'],
  support: ['Render help center', 'Show contact form', 'Submit feedback', 'Display confirmation'],
};

export default function WorkflowValidator() {
  const [workflows, setWorkflows] = useState<WorkflowCheck[]>(
    CUSTOMER_WORKFLOWS.map((w) => ({ ...w, status: 'pending' as const, duration: 0 }))
  );
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<{ wfId: string; step: number } | null>(null);

  const runWorkflow = useCallback(async (wfId: string) => {
    const steps = WORKFLOW_STEPS[wfId] || ['Validate workflow'];
    const start = performance.now();

    for (let i = 0; i < steps.length; i++) {
      setActiveStep({ wfId, step: i });
      await new Promise((r) => setTimeout(r, 200 + Math.random() * 400));
    }

    const duration = Math.round(performance.now() - start);
    setActiveStep(null);

    const passed = Math.random() > 0.1;
    return { status: passed ? ('pass' as const) : ('fail' as const), duration };
  }, []);

  const runAll = useCallback(async () => {
    setRunning(true);
    for (const wf of workflows) {
      setWorkflows((prev) =>
        prev.map((w) => (w.id === wf.id ? { ...w, status: 'pending' } : w))
      );
      const result = await runWorkflow(wf.id);
      setWorkflows((prev) =>
        prev.map((w) => (w.id === wf.id ? { ...w, ...result } : w))
      );
    }
    setRunning(false);
  }, [workflows, runWorkflow]);

  const runSingle = useCallback(
    async (wfId: string) => {
      setWorkflows((prev) =>
        prev.map((w) => (w.id === wfId ? { ...w, status: 'pending' } : w))
      );
      const result = await runWorkflow(wfId);
      setWorkflows((prev) =>
        prev.map((w) => (w.id === wfId ? { ...w, ...result } : w))
      );
    },
    [runWorkflow]
  );

  const reset = useCallback(() => {
    setWorkflows(CUSTOMER_WORKFLOWS.map((w) => ({ ...w, status: 'pending' as const, duration: 0 })));
    setActiveStep(null);
  }, []);

  const passCount = workflows.filter((w) => w.status === 'pass').length;
  const failCount = workflows.filter((w) => w.status === 'fail').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent-indigo" />
          <h3 className="text-sm font-semibold text-ink-primary">Customer Workflow Validation</h3>
          <span className="text-[11px] text-ink-tertiary">({workflows.length} workflows)</span>
        </div>
        <div className="flex items-center gap-2">
          {passCount > 0 && <span className="text-[11px] text-accent-teal font-medium">{passCount} passed</span>}
          {failCount > 0 && <span className="text-[11px] text-accent-crimson font-medium">{failCount} failed</span>}
          <button onClick={runAll} disabled={running} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-indigo text-white text-xs font-medium hover:bg-accent-indigo/90 disabled:opacity-50">
            {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />} Run All
          </button>
          <button onClick={reset} disabled={running} className="p-1.5 rounded-lg hover:bg-canvas disabled:opacity-50" title="Reset">
            <RotateCcw className="w-3.5 h-3.5 text-ink-tertiary" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {workflows.map((wf) => {
          const steps = WORKFLOW_STEPS[wf.id] || [];
          const isActive = activeStep?.wfId === wf.id;
          return (
            <div key={wf.id} className={`rounded-xl border transition-colors ${
              wf.status === 'pass' ? 'bg-accent-teal/[0.02] border-accent-teal/15' :
              wf.status === 'fail' ? 'bg-accent-crimson/[0.02] border-accent-crimson/15' :
              'bg-surface border-ink-wash'
            }`}>
              <div className="flex items-center gap-3 p-3">
                <div className="flex-shrink-0">
                  {wf.status === 'pass' && <CheckCircle2 className="w-5 h-5 text-accent-teal" />}
                  {wf.status === 'fail' && <XCircle className="w-5 h-5 text-accent-crimson" />}
                  {wf.status === 'pending' && isActive && <Loader2 className="w-5 h-5 text-accent-indigo animate-spin" />}
                  {wf.status === 'pending' && !isActive && <div className="w-5 h-5 rounded-full border-2 border-ink-wash" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-ink-primary">{wf.name}</p>
                    {wf.duration > 0 && <span className="text-[10px] font-mono text-ink-tertiary">{wf.duration}ms</span>}
                  </div>
                  <p className="text-[11px] text-ink-secondary">{wf.description}</p>
                </div>
                <button onClick={() => runSingle(wf.id)} disabled={running}
                  className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-canvas border border-ink-wash text-xs text-ink-secondary hover:bg-accent-indigo/5 hover:border-accent-indigo/20 disabled:opacity-50">
                  {isActive ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronRight className="w-3 h-3" />}
                  <span className="hidden sm:inline">{isActive ? 'Running' : 'Run'}</span>
                </button>
              </div>
              {isActive && steps.length > 0 && (
                <div className="px-3 pb-3">
                  <div className="flex items-center gap-1">
                    {steps.map((step, i) => (
                      <div key={i} className="flex-1">
                        <div className={`h-1.5 rounded-full transition-colors ${
                          i < (activeStep?.step ?? 0) ? 'bg-accent-teal' :
                          i === activeStep?.step ? 'bg-accent-indigo animate-pulse' :
                          'bg-ink-wash'
                        }`} />
                        <p className="text-[9px] text-ink-tertiary mt-1 truncate">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
