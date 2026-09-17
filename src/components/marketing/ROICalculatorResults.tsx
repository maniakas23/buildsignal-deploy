// Estimated Impact results panel — extracted from ROICalculator (m1(24C)),
// behavior-identical.
import { trackEvent } from "@/hooks/usePageTracking";
import { useAuth } from "@/hooks/useAuth";
import { acquisitionCtaTarget } from "@/lib/customerJourney";

interface ROIResultsProps {
  state: {
    counties: number;
    hoursPerWeek: number;
    hourlyCost: number;
    teamSize: number;
    efficiencyAssumption: number;
  };
  showFormula: boolean;
  monthlyResearchHours: number;
  monthlyResearchCost: number;
  estimatedRecoveredHours: number;
  estimatedOperationalValue: number;
  weeklyHoursPerCounty: number;
  formatCurrency: (value: number) => string;
  formatHours: (value: number) => string;
}

export function ROICalculatorResults(p: ROIResultsProps) {
  const { isAuthenticated } = useAuth();
  const ctaTarget = acquisitionCtaTarget(isAuthenticated);
  const state = p.state;
  const formatCurrency = p.formatCurrency;
  const formatHours = p.formatHours;
  const monthlyResearchHours = p.monthlyResearchHours;
  const monthlyResearchCost = p.monthlyResearchCost;
  const estimatedRecoveredHours = p.estimatedRecoveredHours;
  const estimatedOperationalValue = p.estimatedOperationalValue;
  const weeklyHoursPerCounty = p.weeklyHoursPerCounty;
  const showFormula = p.showFormula;
  return (
    <div className="space-y-6">

            <div className="bg-surface border border-border rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-ink mb-6">Estimated Impact <span className="text-sm font-normal text-muted">(not guaranteed)</span></h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-canvas rounded-xl p-4 border border-border">
                  <p className="text-sm text-muted mb-1">Monthly research hours</p>
                  <p className="text-2xl font-bold text-ink font-mono">{formatHours(monthlyResearchHours)}</p>
                  <p className="text-xs text-muted mt-1">{state.hoursPerWeek} hrs/wk × {state.teamSize} researcher{state.teamSize > 1 ? "s" : ""}</p>
                </div>
                <div className="bg-canvas rounded-xl p-4 border border-border">
                  <p className="text-sm text-muted mb-1">Monthly research cost (est.)</p>
                  <p className="text-2xl font-bold text-ink font-mono">{formatCurrency(monthlyResearchCost)}</p>
                  <p className="text-xs text-muted mt-1">Based on hourly rate × hours</p>
                </div>
                <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
                  <p className="text-sm text-emerald-400 mb-1">Time potentially recovered</p>
                  <p className="text-2xl font-bold text-emerald-400 font-mono">{formatHours(estimatedRecoveredHours)}</p>
                  <p className="text-xs text-emerald-400/70 mt-1">{state.efficiencyAssumption}% of monthly hours</p>
                </div>
                <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
                  <p className="text-sm text-emerald-400 mb-1">Cost potentially redirected</p>
                  <p className="text-2xl font-bold text-emerald-400 font-mono">{formatCurrency(estimatedOperationalValue)}</p>
                  <p className="text-xs text-emerald-400/70 mt-1">Estimated operational value</p>
                </div>
              </div>
              <div className="mt-4 bg-canvas rounded-xl p-4 border border-border">
                <p className="text-sm text-muted mb-1">Hours per county per week</p>
                <p className="text-xl font-bold text-ink font-mono">{weeklyHoursPerCounty.toFixed(1)} hrs</p>
                <p className="text-xs text-muted mt-1">Spreading {state.hoursPerWeek} hours across {state.counties} counties</p>
              </div>
            </div>

            {showFormula && (
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h4 className="text-sm font-semibold text-ink mb-3">How these estimates work</h4>
                <div className="space-y-2 text-sm text-muted font-mono">
                  <p>weeklyTeamHours = hoursPerWeek × teamSize</p>
                  <p>monthlyResearchHours = weeklyTeamHours × 4.33</p>
                  <p>monthlyResearchCost = monthlyResearchHours × hourlyCost</p>
                  <p>recoveredHours = monthlyResearchHours × (efficiencyRate / 100)</p>
                  <p>operationalValue = recoveredHours × hourlyCost</p>
                </div>
                <p className="text-xs text-muted mt-3">These are simple arithmetic estimates. BuildSignal does not guarantee any specific time savings or cost reduction. Actual results depend on workflow, data coverage, and individual usage patterns.</p>
              </div>
            )}

            <div className="text-center">
              <a href={ctaTarget} className="inline-flex items-center justify-center px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
                onClick={() => trackEvent("signup_clicked", { source: "roi_calculator" })}>
                Get Started
              </a>
              <p className="text-sm text-muted mt-2">14-day free trial · $0 today · No credit card required · Cancel anytime.</p>
            </div>
    </div>
  );
}
