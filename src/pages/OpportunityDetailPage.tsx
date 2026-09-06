import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  ExternalLink,
  FileText,
  Landmark,
  MapPin,
  Shield,
  TrendingUp,
} from "lucide-react";
import { EvidenceLadder } from "@/components/EvidenceLadder";
import { SignalBrief } from "@/components/SignalBrief";
import { StrategyFit } from "@/components/StrategyFit";
import { DecisionControl } from "@/components/DecisionControl";
import { buildEvidenceLadder, LADDER_STAGES } from "@/lib/evidenceLadder";
import { buildSignalBrief } from "@/lib/signalBrief";

interface MaturityInfo {
  rawStage: string | null;
  canonicalStage: string | null;
  canonicalRank: number | null;
  mappingStatus: string;
  maturityCertified: boolean;
}

interface SequenceInfo {
  sequenceId: string;
  opportunityId?: string | null;
  location: string | null;
  county: string | null;
  state: string | null;
  firstDetectedAt: number | null;
  currentLifecycleStage: string;
  latestEventAt: number | null;
  latestActivityAt?: number | null;
  eventCount: number;
  independentSourceCount: number;
  strongestEvidence: string | null;
  earlyWarningDays: number | null;
  maturity?: MaturityInfo;
  freshnessClass?: string | null;
  daysSinceLatestActivity?: number | null;
  latestAuthoritativeStatus?: string | null;
}

interface TimelineEvent {
  canonicalId: string;
  providerId: string | null;
  eventType: string;
  title: string | null;
  address: string | null;
  city: string | null;
  county: string | null;
  state: string | null;
  status: string | null;
  publishedAt: number | null;
  sourceUrl: string | null;
  lifecycleStage: string | null;
  isFirstDetected: boolean;
  isStageAdvancement: boolean;
  isCurrentStage: boolean;
  stageRank?: number;
  canonicalConfidence?: number | null;
  confidenceStatus?: string;
}

interface EvidenceItem {
  relationshipId: string;
  relationshipType: string;
  strength: string | null;
  why: string | null;
  confidenceBasis: string | null;
}

interface WhatChanged {
  type: string;
  message?: string;
  previousStage?: string;
  newStage?: string;
  triggerEventAt?: number;
  firstDetectedAt?: number;
  detectionAdvantageDays?: number | null;
}

interface DetailResponse {
  sequence: SequenceInfo;
  timeline: TimelineEvent[];
  whatChanged: WhatChanged | null;
  evidence: EvidenceItem[];
}

const STAGE_LABEL: Record<string, string> = {
  DEVELOPMENT_INTENT: "Early development intent",
  SITE_COMMITMENT: "Site commitment",
  PRECONSTRUCTION_COMMITMENT: "Pre-construction commitment",
  CONSTRUCTION_COMMITMENT: "Construction commitment",
  PROJECT_COMPLETION: "Project completion",
};

const EVENT_LABEL: Record<string, string> = {
  rezoning_filed: "Rezoning request filed",
  annexation_filed: "Annexation filed",
  development_case: "Development case opened",
  site_plan_submitted: "Site plan submitted",
  subdivision_application: "Subdivision application filed",
  funded_transportation: "Transportation project funded",
  programmed_highway: "Highway project programmed",
  capital_improvement: "Capital improvement project",
  sewer_extension: "Sewer extension project",
  building_permit: "Building permit issued",
  demolition_permit: "Demolition permit issued",
  demolition: "Demolition recorded",
  grading_permit: "Grading permit issued",
  utility_connection_permit: "Utility connection permit issued",
  project_completed: "Project completion recorded",
};

function stageLabel(s: string | null | undefined): string {
  return s ? STAGE_LABEL[s] || s : "Unknown stage";
}

/** Canonical customer-facing stage label from the certified v397 maturity adapter. */
function canonicalStageLabel(m: MaturityInfo | undefined, rawFallback: string): string {
  if (m) {
    if (m.maturityCertified && m.canonicalStage) {
      const st = LADDER_STAGES.find((x) => x.id === m.canonicalStage);
      if (st) return st.label;
    }
    // Certified adapter says this stage is not verified — never show raw enum codes.
    return "Maturity not yet verified";
  }
  return stageLabel(rawFallback);
}

function eventLabel(t: string): string {
  return EVENT_LABEL[t] || t.replace(/_/g, " ");
}

function fmtDate(ms: number | null | undefined): string {
  if (!ms) return "Date not recorded";
  return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function strengthLabel(s: string | null): string {
  if (s === "VERY_STRONG") return "Very strong";
  if (s === "STRONG") return "Strong";
  if (s === "MODERATE") return "Moderate";
  return s ? s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ") : "Recorded";
}

export function OpportunityDetailPage() {
  const { sequenceId } = useParams<{ sequenceId: string }>();
  const [data, setData] = useState<DetailResponse | null>(null);
  const [state, setState] = useState<"loading" | "error" | "notfound" | "ready">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setState("loading");
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(`/api/v1/sequences/${sequenceId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.status === 404) {
          if (!cancelled) setState("notfound");
          return;
        }
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const json = (await res.json()) as DetailResponse;
        if (!cancelled) {
          setData(json);
          setState("ready");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sequenceId]);

  return (
    <div className="min-h-screen bg-[var(--bs-canvas)]">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <nav className="mb-5" aria-label="Back">
          <Link
            to="/changes"
            className="inline-flex items-center gap-1.5 min-h-11 text-sm text-[var(--bs-text-secondary)] hover:text-[var(--bs-text-primary)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to What Changed
          </Link>
        </nav>

        {state === "loading" && (
          <div className="space-y-4" aria-busy="true" aria-label="Loading opportunity">
            <div className="h-8 w-2/3 rounded bg-[var(--bs-surface-hover)] animate-pulse" />
            <div className="h-40 rounded-xl bg-[var(--bs-surface-hover)] animate-pulse" />
            <div className="h-64 rounded-xl bg-[var(--bs-surface-hover)] animate-pulse" />
          </div>
        )}

        {state === "notfound" && (
          <div className="rounded-xl border border-[var(--bs-border)] bg-[var(--bs-surface)] p-8 text-center">
            <h1 className="text-xl font-semibold text-[var(--bs-text-primary)]">Opportunity not available</h1>
            <p className="mt-2 text-sm text-[var(--bs-text-secondary)]">
              This development timeline is not currently available. It may no longer meet BuildSignal's evidence requirements.
            </p>
          </div>
        )}

        {state === "error" && (
          <div className="rounded-xl border border-[var(--bs-border)] bg-[var(--bs-surface)] p-8 text-center">
            <h1 className="text-xl font-semibold text-[var(--bs-text-primary)]">Temporarily unavailable</h1>
            <p className="mt-2 text-sm text-[var(--bs-text-secondary)]">
              This opportunity could not be loaded right now. This does not mean the opportunity was removed — please try again.
            </p>
          </div>
        )}

        {state === "ready" && data && (
          (() => {
            const ladderModel = buildEvidenceLadder(data.sequence, data.timeline, data.evidence || []);
            return (
          <>
            <header className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--bs-action)]/30 bg-[var(--bs-action)]/10 px-3 py-1 text-xs font-medium text-[var(--bs-action)]">
                  <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                  {canonicalStageLabel(data.sequence.maturity, data.sequence.currentLifecycleStage)}
                </span>
                {data.sequence.strongestEvidence && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--bs-border)] px-3 py-1 text-xs font-medium text-[var(--bs-text-secondary)]">
                    <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                    {strengthLabel(data.sequence.strongestEvidence)} evidence
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--bs-text-primary)]">
                {data.sequence.location || "Development timeline"}
              </h1>
              <p className="mt-1 text-sm text-[var(--bs-text-secondary)] flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {[data.sequence.county && `${data.sequence.county} County`, data.sequence.state].filter(Boolean).join(" · ")}
              </p>
            </header>

            {data.sequence.opportunityId && <DecisionControl opportunityId={data.sequence.opportunityId} />}

            <SignalBrief model={buildSignalBrief(data.sequence, data.timeline, data.evidence || [])} />

            <EvidenceLadder model={ladderModel} />

            <StrategyFit ladder={ladderModel} />

            <section aria-labelledby="why-heading" className="rounded-xl border border-[var(--bs-border)] bg-[var(--bs-surface)] p-5 mb-4">
              <h2 id="why-heading" className="text-sm font-semibold uppercase tracking-wide text-[var(--bs-text-tertiary)] mb-3">
                Why BuildSignal is tracking this
              </h2>
              <p className="text-[var(--bs-text-primary)] leading-relaxed">
                {data.whatChanged?.type === "STAGE_ADVANCEMENT"
                  ? `This development advanced from ${stageLabel(data.whatChanged.previousStage).toLowerCase()} to ${stageLabel(data.whatChanged.newStage).toLowerCase()}, based on newly observed government records.`
                  : `BuildSignal linked ${data.sequence.eventCount} government records from ${data.sequence.independentSourceCount} authoritative ${data.sequence.independentSourceCount === 1 ? "source" : "sources"} into a single development timeline for this location.`}
              </p>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div className="rounded-lg bg-[var(--bs-canvas)] p-3">
                  <p className="text-xs text-[var(--bs-text-tertiary)]">Government records</p>
                  <p className="text-lg font-semibold text-[var(--bs-text-primary)]">{data.sequence.eventCount}</p>
                </div>
                <div className="rounded-lg bg-[var(--bs-canvas)] p-3">
                  <p className="text-xs text-[var(--bs-text-tertiary)]">Authoritative sources</p>
                  <p className="text-lg font-semibold text-[var(--bs-text-primary)]">{data.sequence.independentSourceCount}</p>
                </div>
                <div className="rounded-lg bg-[var(--bs-canvas)] p-3 col-span-2 sm:col-span-1">
                  <p className="text-xs text-[var(--bs-text-tertiary)]">Latest source record</p>
                  <p className="text-lg font-semibold text-[var(--bs-text-primary)]">{fmtDate(data.sequence.latestEventAt)}</p>
                </div>
              </div>
              {data.sequence.earlyWarningDays != null && data.sequence.earlyWarningDays > 0 && (
                <p className="mt-4 text-sm text-[var(--bs-text-secondary)] leading-relaxed">
                  <Calendar className="inline h-4 w-4 mr-1 -mt-0.5" aria-hidden="true" />
                  BuildSignal observed earlier authoritative evidence for this site{" "}
                  <strong className="text-[var(--bs-text-primary)]">{Math.round(data.sequence.earlyWarningDays).toLocaleString()} days</strong>{" "}
                  before the most recent known stage change — an observed historical lead time, not a prediction.
                </p>
              )}
            </section>

            <section aria-labelledby="timeline-heading" className="rounded-xl border border-[var(--bs-border)] bg-[var(--bs-surface)] p-5 mb-4">
              <h2 id="timeline-heading" className="text-sm font-semibold uppercase tracking-wide text-[var(--bs-text-tertiary)] mb-1">
                Government record timeline
              </h2>
              <p className="text-xs text-[var(--bs-text-tertiary)] mb-4">
                Source facts from public government records, oldest first. Dates shown are the source record dates.
              </p>
              <ol className="space-y-3">
                {data.timeline.map((e) => (
                  <li
                    key={e.canonicalId}
                    className={`rounded-lg border p-4 ${e.isCurrentStage ? "border-[var(--bs-action)]/40 bg-[var(--bs-action)]/5" : "border-[var(--bs-border)] bg-[var(--bs-canvas)]"}`}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[var(--bs-text-primary)]">{eventLabel(e.eventType)}</span>
                      {e.isCurrentStage && (
                        <span className="rounded-full bg-[var(--bs-action)]/15 px-2 py-0.5 text-[11px] font-medium text-[var(--bs-action)]">
                          Current stage
                        </span>
                      )}
                      {e.isStageAdvancement && !e.isCurrentStage && (
                        <span className="rounded-full bg-[var(--bs-surface-hover)] px-2 py-0.5 text-[11px] font-medium text-[var(--bs-text-secondary)]">
                          Advanced the timeline
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--bs-text-secondary)]">
                      {e.title || "Government record"}
                      {e.address ? ` — ${e.address}` : ""}
                      {e.city ? `, ${e.city}` : ""}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--bs-text-tertiary)]">
                      <span className="inline-flex items-center gap-1">
                        <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
                        {e.providerId || "Local government records"}
                      </span>
                      <span>Source record dated {fmtDate(e.publishedAt)}</span>
                      {e.sourceUrl && (
                        <a
                          href={e.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 min-h-11 text-[var(--bs-action)] hover:underline font-medium"
                        >
                          View original record <ExternalLink className="h-3 w-3" aria-hidden="true" />
                          <span className="sr-only">(opens in new tab)</span>
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {data.evidence && data.evidence.length > 0 && (
              <section aria-labelledby="evidence-heading" className="rounded-xl border border-[var(--bs-border)] bg-[var(--bs-surface)] p-5 mb-4">
                <h2 id="evidence-heading" className="text-sm font-semibold uppercase tracking-wide text-[var(--bs-text-tertiary)] mb-1">
                  How these records connect
                </h2>
                <p className="text-xs text-[var(--bs-text-tertiary)] mb-4">
                  BuildSignal's interpretation of how the government records above relate to each other. This is analysis, not part of the source records.
                </p>
                <ul className="space-y-3">
                  {data.evidence.map((ev) => (
                    <li key={ev.relationshipId} className="flex gap-3 rounded-lg border border-[var(--bs-border)] bg-[var(--bs-canvas)] p-4">
                      <FileText className="h-4 w-4 mt-0.5 shrink-0 text-[var(--bs-intelligence)]" aria-hidden="true" />
                      <div>
                        <p className="text-sm text-[var(--bs-text-primary)] leading-relaxed">{ev.confidenceBasis || ev.why}</p>
                        {ev.strength && (
                          <p className="mt-1 text-xs text-[var(--bs-text-tertiary)]">Connection strength: {strengthLabel(ev.strength)}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                to="/changes"
                className="inline-flex items-center gap-1.5 min-h-11 px-5 rounded-lg bg-[var(--bs-action)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                See what else changed <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/watchlist"
                className="inline-flex items-center gap-1.5 min-h-11 px-5 rounded-lg border border-[var(--bs-border)] bg-[var(--bs-surface)] text-sm font-medium text-[var(--bs-text-primary)] hover:bg-[var(--bs-surface-hover)] transition-colors"
              >
                <Building2 className="h-4 w-4" aria-hidden="true" /> Manage watchlist
              </Link>
            </div>
          </>
            );
          })()
        )}
      </main>
    </div>
  );
}
