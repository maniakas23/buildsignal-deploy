/**
 * Gate 2E — Strategy Fit presentation layer.
 *
 * Visually and semantically DISTINCT from the objective Signal Brief (§7, §21):
 * this is the customer-context layer ("how relevant this signal may be to what
 * you care about"), never an evidence axis. It never mutates objective
 * intelligence — it only reads the certified ladder model via the view-model.
 */
import { useEffect, useMemo, useState } from "react";
import { Compass, Info, ShieldAlert, Telescope } from "lucide-react";
import type { EvidenceLadderModel } from "../lib/evidenceLadder";
import {
  classifyStrategyFit, STRATEGIES, DEFAULT_STRATEGY, isStrategyId,
  type StrategyId,
} from "../lib/strategyFit";

const STORAGE_KEY = "buildsignal_strategy";

function readStrategy(): StrategyId {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return isStrategyId(v) ? v : DEFAULT_STRATEGY;
  } catch {
    return DEFAULT_STRATEGY;
  }
}

const FIT_STYLES: Record<string, string> = {
  High: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  Moderate: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  Low: "border-slate-500/40 bg-slate-500/10 text-slate-300",
  "Insufficient information": "border-slate-600/40 bg-slate-600/10 text-slate-400",
};

export function StrategyFit({ ladder }: { ladder: EvidenceLadderModel }) {
  const [strategy, setStrategy] = useState<StrategyId>(readStrategy);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, strategy);
    } catch {
      /* storage unavailable — session-only selection */
    }
  }, [strategy]);

  const result = useMemo(() => classifyStrategyFit(ladder, strategy), [ladder, strategy]);

  return (
    <section aria-labelledby="strategy-fit-heading" className="rounded-xl border border-[var(--bs-border)] bg-[var(--bs-surface)] p-5 sm:p-6">
      <div className="mb-1 flex items-center gap-2">
        <Compass className="h-4 w-4 text-[var(--bs-text-tertiary)]" aria-hidden="true" />
        <h2 id="strategy-fit-heading" className="text-xs font-semibold uppercase tracking-wider text-[var(--bs-text-tertiary)]">
          Your Strategy
        </h2>
        <span className="rounded border border-[var(--bs-border)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--bs-text-tertiary)]">
          Personalized relevance
        </span>
      </div>
      <p className="mb-4 text-xs text-[var(--bs-text-tertiary)]">
        This is how relevant the objective signal above may be to what you are watching for. It does not change the evidence, confidence, maturity, or verification.
      </p>

      <fieldset className="mb-5">
        <legend className="mb-2 text-sm font-medium text-[var(--bs-text-primary)]">What are you watching for?</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup" aria-label="Strategy context">
          {STRATEGIES.map((s) => {
            const selected = s.id === strategy;
            return (
              <label
                key={s.id}
                className={`flex cursor-pointer items-start gap-2 rounded-lg border p-3 transition-colors focus-within:ring-2 focus-within:ring-[var(--bs-action)] ${
                  selected ? "border-[var(--bs-action)] bg-[var(--bs-canvas)]" : "border-[var(--bs-border)] hover:border-[var(--bs-text-tertiary)]"
                }`}
              >
                <input
                  type="radio"
                  name="strategy-context"
                  value={s.id}
                  checked={selected}
                  onChange={() => setStrategy(s.id)}
                  className="mt-0.5"
                  aria-describedby={`strategy-desc-${s.id}`}
                />
                <span>
                  <span className="block text-sm font-medium text-[var(--bs-text-primary)]">{s.label}</span>
                  <span id={`strategy-desc-${s.id}`} className="mt-0.5 block text-xs text-[var(--bs-text-tertiary)]">
                    {s.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div aria-live="polite" className="rounded-lg border border-[var(--bs-border)] bg-[var(--bs-canvas)] p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Telescope className="h-4 w-4 text-[var(--bs-text-tertiary)]" aria-hidden="true" />
          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${FIT_STYLES[result.fitLabel]}`}>
            {result.fitLabel} fit
          </span>
          <span className="text-sm text-[var(--bs-text-primary)]">
            for <span className="font-medium">{result.strategyLabel}</span>
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--bs-text-tertiary)]">Why this may be relevant</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--bs-text-primary)]">
              {result.why.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--bs-text-tertiary)]">
              <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" /> Fit is limited by
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--bs-text-primary)]">
              {result.limits.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </div>

          {result.couldChange.length > 0 && (
            <div>
              <h3 className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--bs-text-tertiary)]">
                <Info className="h-3.5 w-3.5" aria-hidden="true" /> Additional evidence that could change this assessment
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--bs-text-primary)]">
                {result.couldChange.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
