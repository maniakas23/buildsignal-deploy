/**
 * Decision-Grade Signal Brief (Gate 2D) — customer-facing decision support.
 * Complements the Evidence Ladder; never replaces it. Presentation only.
 * Reads the deterministic view-model from lib/signalBrief.
 *
 * Contains NO score, NO prediction, NO Strategy Fit, NO personalization.
 */
import {
  FileText,
  Lightbulb,
  ShieldCheck,
  Eye,
  HelpCircle,
  TrendingUp,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";
import type { SignalBriefModel } from "@/lib/signalBrief";

function InfoStateTag({ state, label }: { state: "KNOWN" | "INFERRED" | "UNKNOWN"; label?: string }) {
  const text = label ?? (state === "KNOWN" ? "From records" : state === "INFERRED" ? "Interpretation" : "Unknown");
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--bs-border)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--bs-text-tertiary)]">
      {text}
    </span>
  );
}

export function SignalBrief({ model }: { model: SignalBriefModel }) {
  return (
    <section aria-labelledby="brief-heading" className="rounded-xl border border-[var(--bs-border)] bg-[var(--bs-surface)] p-5 mb-4">
      <h2 id="brief-heading" className="text-sm font-semibold uppercase tracking-wide text-[var(--bs-text-tertiary)] mb-4">
        Signal Brief
      </h2>

      {/* A. WHAT HAPPENED — KNOWN facts only */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <FileText className="h-4 w-4 text-[var(--bs-text-tertiary)]" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-[var(--bs-text-primary)]">What happened</h3>
          <InfoStateTag state="KNOWN" />
        </div>
        <p className="text-[var(--bs-text-primary)] leading-relaxed">
          {model.whatHappened ?? model.whatHappenedEmpty}
        </p>
      </div>

      {/* C. CURRENT EVIDENCE POSITION — existing axes, independent, no score */}
      <dl className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm" aria-label="Current evidence position">
        <div className="rounded-lg bg-[var(--bs-canvas)] p-3">
          <dt className="text-xs text-[var(--bs-text-tertiary)]">Maturity</dt>
          <dd className="mt-1 font-semibold text-[var(--bs-text-primary)] leading-snug">{model.position.maturityText}</dd>
        </div>
        <div className="rounded-lg bg-[var(--bs-canvas)] p-3">
          <dt className="text-xs text-[var(--bs-text-tertiary)]">Confidence</dt>
          <dd className="mt-1 font-semibold text-[var(--bs-text-primary)]">{model.position.confidenceText}</dd>
        </div>
        <div className="rounded-lg bg-[var(--bs-canvas)] p-3">
          <dt className="text-xs text-[var(--bs-text-tertiary)]">Verification</dt>
          <dd className="mt-1 font-semibold text-[var(--bs-text-primary)]">{model.position.verificationLabel ?? "Unknown"}</dd>
        </div>
        <div className="rounded-lg bg-[var(--bs-canvas)] p-3">
          <dt className="text-xs text-[var(--bs-text-tertiary)]">Freshness</dt>
          <dd className="mt-1 font-semibold text-[var(--bs-text-primary)] leading-snug">{model.position.freshnessText}</dd>
        </div>
      </dl>

      {/* B. WHY IT MAY MATTER — INFERRED, visibly hedged; omitted when no interpretation exists */}
      {model.whyItMayMatter.length > 0 && (
        <div className="mb-5 rounded-lg border border-[var(--bs-intelligence)]/25 bg-[var(--bs-intelligence)]/5 p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Lightbulb className="h-4 w-4 text-[var(--bs-text-tertiary)]" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-[var(--bs-text-primary)]">Why it may matter</h3>
            <InfoStateTag state="INFERRED" />
          </div>
          <p className="text-xs text-[var(--bs-text-tertiary)] mb-2">
            BuildSignal interpretation — this may indicate, not establish. It is analysis of the records, not itself a record.
          </p>
          <ul className="space-y-1.5">
            {model.whyItMayMatter.map((t, i) => (
              <li key={i} className="text-sm text-[var(--bs-text-primary)] leading-relaxed flex gap-2">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--bs-intelligence)]" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* D. WHAT SUPPORTS THIS — strongest few, traceable */}
      {model.supports.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck className="h-4 w-4 text-[var(--bs-text-tertiary)]" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-[var(--bs-text-primary)]">What supports this</h3>
            <InfoStateTag state="KNOWN" />
          </div>
          <ul className="space-y-2">
            {model.supports.map((s, i) => (
              <li key={i} className="rounded-lg bg-[var(--bs-canvas)] p-3">
                <p className="text-sm text-[var(--bs-text-primary)] leading-relaxed">{s.text}</p>
                <p className="mt-1 text-[11px] text-[var(--bs-text-tertiary)] flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span>{s.organization}</span>
                  {s.confidenceText && <span aria-label={`Record confidence ${s.confidenceText}`}>· confidence {s.confidenceText}</span>}
                  {s.sourceUrl && (
                    <a
                      href={s.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 text-[var(--bs-action)] hover:underline"
                    >
                      Source record <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      <span className="sr-only">(opens in new tab)</span>
                    </a>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* E. WHAT WE DON'T KNOW YET — UNKNOWN is a legitimate result */}
      {model.unknowns.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <HelpCircle className="h-4 w-4 text-[var(--bs-text-tertiary)]" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-[var(--bs-text-primary)]">What we don't know yet</h3>
            <InfoStateTag state="UNKNOWN" />
          </div>
          <ul className="space-y-1.5">
            {model.unknowns.map((u, i) => (
              <li key={i} className="text-sm text-[var(--bs-text-secondary)] leading-relaxed flex gap-2">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--bs-text-tertiary)]" />
                {u}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* F + G — strengthen / weaken, deterministic and non-predictive */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {model.strengthen.length > 0 && (
          <div className="rounded-lg bg-[var(--bs-canvas)] p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingUp className="h-4 w-4 text-[var(--bs-text-tertiary)]" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-[var(--bs-text-primary)]">What would strengthen this signal</h3>
            </div>
            <ul className="space-y-1.5">
              {model.strengthen.map((t, i) => (
                <li key={i} className="text-sm text-[var(--bs-text-secondary)] leading-relaxed">{t}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="rounded-lg bg-[var(--bs-canvas)] p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldAlert className="h-4 w-4 text-[var(--bs-text-tertiary)]" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-[var(--bs-text-primary)]">What would weaken or refute it</h3>
          </div>
          <ul className="space-y-1.5">
            {model.weaken.map((t, i) => (
              <li key={i} className="text-sm text-[var(--bs-text-secondary)] leading-relaxed">{t}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* H. WHAT TO WATCH NEXT — conditional, never predictive */}
      <div className="rounded-lg border border-[var(--bs-intelligence)]/25 bg-[var(--bs-intelligence)]/5 p-4">
        <div className="flex items-center gap-2 mb-1">
          <Eye className="h-4 w-4 text-[var(--bs-text-tertiary)]" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-[var(--bs-text-primary)]">What to watch next</h3>
        </div>
        <p className="text-sm text-[var(--bs-text-primary)] leading-relaxed">{model.watchNext}</p>
      </div>
    </section>
  );
}
