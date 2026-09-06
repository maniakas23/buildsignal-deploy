/**
 * Evidence Ladder (Gate 2C.2) — customer-facing presentation of certified
 * maturity, confidence, evidence, freshness, verification, and uncertainty.
 * Presentation only. Reads the deterministic view-model from lib/evidenceLadder.
 */
import { useState } from "react";
import {
  Check,
  CircleDashed,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  ChevronDown,
  ExternalLink,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  FileText,
} from "lucide-react";
import type { EvidenceLadderModel } from "@/lib/evidenceLadder";

function StageIcon({ state }: { state: "completed" | "current" | "future" }) {
  if (state === "completed")
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bs-action)] text-white" aria-hidden="true">
        <Check className="h-4 w-4" />
      </span>
    );
  if (state === "current")
    return (
      <span
        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--bs-action)] bg-[var(--bs-action)]/10 text-[var(--bs-action)]"
        aria-hidden="true"
      >
        <MapPin className="h-4 w-4" />
      </span>
    );
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-[var(--bs-border)] text-[var(--bs-text-tertiary)]" aria-hidden="true">
      <CircleDashed className="h-4 w-4" />
    </span>
  );
}

export function EvidenceLadder({ model }: { model: EvidenceLadderModel }) {
  const [showAllFacts, setShowAllFacts] = useState(false);
  const factsShown = showAllFacts ? model.knownFacts : model.knownFacts.slice(0, 3);

  return (
    <section aria-labelledby="ladder-heading" className="rounded-xl border border-[var(--bs-border)] bg-[var(--bs-surface)] p-5 mb-4">
      <h2 id="ladder-heading" className="text-sm font-semibold uppercase tracking-wide text-[var(--bs-text-tertiary)] mb-4">
        Evidence Ladder
      </h2>

      {/* Maturity ladder — structural only; future stages mean "not yet supported", never "likely" */}
      {model.certified ? (
        <ol
          aria-label="Development maturity ladder"
          className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0"
        >
          {model.stages.map((s, i) => (
            <li
              key={s.id}
              aria-current={s.state === "current" ? "step" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 sm:flex-1 sm:flex-col sm:items-center sm:gap-1.5 sm:text-center ${
                s.state === "current"
                  ? "border border-[var(--bs-action)]/40 bg-[var(--bs-action)]/5"
                  : s.state === "completed"
                    ? "border border-[var(--bs-border)] bg-[var(--bs-canvas)]"
                    : "border border-dashed border-[var(--bs-border)]"
              }`}
            >
              <StageIcon state={s.state} />
              <span className="min-w-0">
                <span
                  className={`block text-xs font-medium leading-snug ${
                    s.state === "future" ? "text-[var(--bs-text-tertiary)]" : "text-[var(--bs-text-primary)]"
                  }`}
                >
                  {i + 1}. {s.label}
                </span>
                <span
                  className={`block text-[11px] ${
                    s.state === "current"
                      ? "font-semibold text-[var(--bs-action)]"
                      : s.state === "completed"
                        ? "text-[var(--bs-text-secondary)]"
                        : "text-[var(--bs-text-tertiary)]"
                  }`}
                >
                  {s.stateLabel}
                </span>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <div role="status" className="mb-5 flex gap-3 rounded-lg border border-[var(--bs-border)] bg-[var(--bs-canvas)] p-4">
          <ShieldAlert className="h-5 w-5 shrink-0 text-[var(--bs-text-secondary)]" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-[var(--bs-text-primary)]">Maturity not yet verified</p>
            <p className="mt-1 text-sm text-[var(--bs-text-secondary)] leading-relaxed">{model.uncertifiedNotice}</p>
          </div>
        </div>
      )}

      {/* Confidence + freshness + verification — separate axes, never ladder position */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-[var(--bs-canvas)] p-3">
          <p className="text-xs text-[var(--bs-text-tertiary)] flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Confidence
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--bs-text-primary)]">{model.confidence.text}</p>
          {model.confidence.basis && (
            <p className="mt-1 text-[11px] leading-relaxed text-[var(--bs-text-tertiary)]">{model.confidence.basis}</p>
          )}
        </div>
        <div className="rounded-lg bg-[var(--bs-canvas)] p-3">
          <p className="text-xs text-[var(--bs-text-tertiary)]">Freshness</p>
          <p className="mt-1 text-sm font-semibold text-[var(--bs-text-primary)]">{model.freshness.text}</p>
          {model.freshness.sourceDateText && (
            <p className="mt-1 text-[11px] text-[var(--bs-text-tertiary)]">{model.freshness.sourceDateText}</p>
          )}
        </div>
        <div className="rounded-lg bg-[var(--bs-canvas)] p-3">
          <p className="text-xs text-[var(--bs-text-tertiary)]">Verification</p>
          <p className="mt-1 text-sm font-semibold text-[var(--bs-text-primary)]">
            {model.verification.state === "STALE" ? "Stale" : "Not independently verified"}
          </p>
          {model.verification.label && (
            <p className="mt-1 text-[11px] leading-relaxed text-[var(--bs-text-tertiary)]">{model.verification.label}</p>
          )}
        </div>
      </div>

      {model.freshness.stale && (
        <p role="note" className="mb-5 flex items-start gap-2 rounded-lg border border-[var(--bs-border)] bg-[var(--bs-canvas)] p-3 text-xs text-[var(--bs-text-secondary)]">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Evidence may be stale. This is a freshness concern only — the maturity ladder position is unchanged.
        </p>
      )}

      {/* What we know — KNOWN evidence-backed facts */}
      {model.knownFacts.length > 0 && (
        <div className="mb-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--bs-text-tertiary)]">What we know</h3>
          <ul className="space-y-1.5">
            {factsShown.map((f, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--bs-text-primary)]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--bs-action)]" aria-hidden="true" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          {model.knownFacts.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAllFacts((v) => !v)}
              aria-expanded={showAllFacts}
              className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-[var(--bs-action)] hover:underline"
            >
              {showAllFacts ? "Show fewer records" : `Show all ${model.knownFacts.length} government records`}
              <ChevronDown className={`h-4 w-4 transition-transform ${showAllFacts ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
          )}
        </div>
      )}

      {/* BuildSignal interpretation — visually distinct from KNOWN facts */}
      {model.interpretation.length > 0 && (
        <div className="mb-5 rounded-lg border border-[var(--bs-intelligence)]/25 bg-[var(--bs-intelligence)]/5 p-4">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--bs-text-tertiary)]">
            BuildSignal interpretation
          </h3>
          <p className="mb-2 text-[11px] text-[var(--bs-text-tertiary)]">
            Analysis of how the records connect — interpretation, not part of the source records.
          </p>
          <ul className="space-y-1.5">
            {model.interpretation.map((t, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--bs-text-primary)]">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[var(--bs-intelligence)]" aria-hidden="true" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* What's still unknown — trust feature */}
      {model.unknowns.length > 0 && (
        <div className="mb-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--bs-text-tertiary)]">
            What's still unknown
          </h3>
          <ul className="space-y-1.5">
            {model.unknowns.map((u, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--bs-text-secondary)]">
                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--bs-text-tertiary)]" aria-hidden="true" />
                <span>{u}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strengthen / weaken — explanatory, no prediction */}
      <div className="mb-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {model.strengthen.length > 0 && (
          <div className="rounded-lg border border-[var(--bs-border)] bg-[var(--bs-canvas)] p-3">
            <h3 className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--bs-text-tertiary)]">
              <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" /> What would strengthen this
            </h3>
            {model.strengthen.map((s, i) => (
              <p key={i} className="text-sm leading-relaxed text-[var(--bs-text-secondary)]">{s}</p>
            ))}
          </div>
        )}
        <div className="rounded-lg border border-[var(--bs-border)] bg-[var(--bs-canvas)] p-3">
          <h3 className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--bs-text-tertiary)]">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> What would weaken or refute it
          </h3>
          {model.weaken.map((s, i) => (
            <p key={i} className="text-sm leading-relaxed text-[var(--bs-text-secondary)]">{s}</p>
          ))}
        </div>
      </div>

      {/* Progressive disclosure: provenance */}
      <details className="group rounded-lg border border-[var(--bs-border)] bg-[var(--bs-canvas)]">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 py-2 text-sm font-medium text-[var(--bs-text-secondary)] [&::-webkit-details-marker]:hidden">
          Sources and provenance
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="border-t border-[var(--bs-border)] px-4 py-3">
          <p className="mb-3 text-xs leading-relaxed text-[var(--bs-text-tertiary)]">{model.provenance.stageProvenanceText}</p>
          <ul className="space-y-2">
            {model.provenance.sources.map((s, i) => (
              <li key={i} className="text-xs text-[var(--bs-text-secondary)]">
                <span className="font-medium text-[var(--bs-text-primary)]">{s.organization}</span>
                {s.recordDate ? ` · record dated ${s.recordDate}` : ""}
                {s.status ? ` · source status: ${s.status}` : ""}
                {s.confidenceText ? ` · confidence ${s.confidenceText}` : ""}
                {s.url && (
                  <>
                    {" "}
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-[var(--bs-action)] hover:underline">
                      View record <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      <span className="sr-only">(opens in new tab)</span>
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </details>
    </section>
  );
}
