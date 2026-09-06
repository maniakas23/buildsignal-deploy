/**
 * BuildSignal Evidence Ladder — deterministic read/view model (Gate 2C.2).
 *
 * Consumes ONLY the certified canonical fields served by the production read
 * boundary (v397 maturity adapter + v398 confidence/freshness serializer):
 *   - sequence.maturity.{canonicalStage, canonicalRank, mappingStatus, maturityCertified}
 *   - timeline[].canonicalConfidence / confidenceStatus (provenance-certified)
 *   - sequence.freshnessClass / daysSinceLatestActivity (existing freshness contract)
 *
 * This module contains NO scoring, NO normalization, NO prediction.
 * It maps existing data to presentation. Interpretation never manufactures evidence.
 */

export const LADDER_STAGES = [
  { rank: 1, id: "DEVELOPMENT_INTENT", label: "Development Intent" },
  { rank: 2, id: "SITE_COMMITMENT", label: "Site Commitment" },
  { rank: 3, id: "INFRASTRUCTURE_COMMITMENT", label: "Infrastructure Commitment" },
  { rank: 4, id: "CONSTRUCTION_COMMITMENT", label: "Construction Commitment" },
  { rank: 5, id: "PROJECT_COMPLETION", label: "Project Completion" },
] as const;

export type StageState = "completed" | "current" | "future";

export interface LadderStageView {
  rank: number;
  id: string;
  label: string;
  state: StageState;
  stateLabel: string; // "Reached" | "Current stage" | "Not yet supported"
}

/** Deterministic confidence bands (presentation labels only; never alter the value). */
export function confidenceBand(value: number | null | undefined): string | null {
  if (value == null || typeof value !== "number" || Number.isNaN(value)) return null;
  if (value < 0 || value > 100) return null;
  if (value >= 90) return "Very high";
  if (value >= 75) return "High";
  if (value >= 60) return "Moderate";
  return "Low";
}

export interface TimelineEventInput {
  canonicalId: string;
  providerId: string | null; // customer-facing source organization name
  eventType: string;
  title: string | null;
  address: string | null;
  city: string | null;
  status: string | null; // source record status
  publishedAt: number | null;
  sourceUrl: string | null;
  stageRank?: number;
  lifecycleStage?: string | null;
  isFirstDetected?: boolean;
  isStageAdvancement?: boolean;
  isCurrentStage?: boolean;
  canonicalConfidence?: number | null;
  confidenceStatus?: string;
}

export interface EvidenceItemInput {
  relationshipId: string;
  relationshipType: string;
  strength: string | null;
  why: string | null;
  confidenceBasis: string | null;
}

export interface SequenceInput {
  sequenceId: string;
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
  freshnessClass?: string | null;
  daysSinceLatestActivity?: number | null;
  latestAuthoritativeStatus?: string | null;
  maturity?: {
    rawStage: string | null;
    canonicalStage: string | null;
    canonicalRank: number | null;
    mappingStatus: string;
    maturityCertified: boolean;
  };
}

export type VerificationState = "UNVERIFIED" | "CONFIRMED" | "REFUTED" | "STALE" | null;

export interface EvidenceLadderModel {
  certified: boolean;
  stages: LadderStageView[];
  currentStageLabel: string | null;
  /** Present when maturity is not certified (e.g. legacy quarantined stage or unknown stage). */
  uncertifiedNotice: string | null;
  confidence: {
    value: number | null;
    band: string | null;
    text: string; // e.g. "High · 85/100" or "Confidence not available"
    basis: string | null; // evidence-grounded basis sentence, only when evidence supports it
  };
  freshness: {
    text: string; // human summary
    stale: boolean; // freshness concern shown separately — NEVER moves ladder
    sourceDateText: string | null;
  };
  verification: {
    state: VerificationState;
    label: string | null; // null → do not render a verification claim
  };
  knownFacts: string[]; // KNOWN, evidence-backed only
  interpretation: string[]; // INFERRED/analysis — kept visually distinct
  unknowns: string[]; // decision-relevant, determinable-from-data only
  strengthen: string[]; // deterministic, from certified lifecycle rules
  weaken: string[]; // explanatory only
  provenance: {
    sources: { organization: string; recordDate: string | null; status: string | null; url: string | null; confidenceText: string | null }[];
    stageProvenanceText: string; // wording-level provenance, no enum codes
  };
}

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

export function eventLabel(t: string): string {
  return EVENT_LABEL[t] || t.replace(/_/g, " ");
}

export function fmtDate(ms: number | null | undefined): string | null {
  if (!ms) return null;
  return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** What evidence would strengthen maturity — derived from the certified lifecycle stage order. */
const STRENGTHEN_BY_RANK: Record<number, string> = {
  1: "A submitted site plan or subdivision application for this site would provide stronger evidence of site commitment.",
  2: "Funded or programmed public infrastructure tied to this site (transportation, sewer, or capital improvement) would indicate infrastructure commitment.",
  3: "An issued building, grading, or utility connection permit would provide stronger evidence of construction commitment.",
  4: "A recorded project completion in government sources would confirm completion.",
  5: "This timeline has reached the final maturity stage supported by BuildSignal's evidence ladder.",
};

const WEAKEN_TEXT =
  "Contrary government records — such as a withdrawn application, rescinded funding, a project cancellation, or a corrected source record — would weaken or refute this interpretation. Historical maturity already reached would remain part of the record.";

export function buildEvidenceLadder(
  sequence: SequenceInput,
  timeline: TimelineEventInput[],
  evidence: EvidenceItemInput[],
): EvidenceLadderModel {
  const maturity = sequence.maturity ?? null;
  const certified = Boolean(maturity && maturity.maturityCertified && maturity.canonicalRank != null);
  const currentRank = certified && maturity ? (maturity.canonicalRank as number) : null;

  // --- Ladder stages (purely structural; future = not yet supported, never "likely") ---
  const stages: LadderStageView[] = LADDER_STAGES.map((s) => {
    let state: StageState = "future";
    if (certified && currentRank != null) {
      if (s.rank < currentRank) state = "completed";
      else if (s.rank === currentRank) state = "current";
    }
    return {
      rank: s.rank,
      id: s.id,
      label: s.label,
      state,
      stateLabel: state === "completed" ? "Reached" : state === "current" ? "Current stage" : "Not yet supported",
    };
  });

  const currentStageLabel = certified && currentRank != null ? LADDER_STAGES[currentRank - 1].label : null;

  const uncertifiedNotice = certified
    ? null
    : "We have source information for this opportunity, but its current development stage has not been verified against BuildSignal's evidence ladder.";

  // --- Confidence: canonical confidence of the current-stage supporting record ---
  const currentEvidence = timeline.find((e) => e.isCurrentStage) ?? timeline[timeline.length - 1] ?? null;
  const confValue = currentEvidence && typeof currentEvidence.canonicalConfidence === "number" ? currentEvidence.canonicalConfidence : null;
  const confBand = confidenceBand(confValue);
  const confText = confValue == null ? "Confidence not available" : `${confBand} · ${confValue}/100`;
  const strongestBasis = evidence.find((e) => e.confidenceBasis)?.confidenceBasis ?? evidence.find((e) => e.why)?.why ?? null;
  const confBasis =
    confValue != null && strongestBasis
      ? `Supported by ${sequence.independentSourceCount} authoritative ${sequence.independentSourceCount === 1 ? "source" : "sources"}. ${strongestBasis}`
      : confValue != null
        ? `Supported by ${sequence.independentSourceCount} authoritative ${sequence.independentSourceCount === 1 ? "source" : "sources"}.`
        : null;

  // --- Freshness (existing freshness contract; never moves the ladder) ---
  const fc = (sequence.freshnessClass || "").toUpperCase();
  const days = sequence.daysSinceLatestActivity ?? null;
  const latestMs = sequence.latestActivityAt ?? sequence.latestEventAt ?? null;
  const sourceDateText = latestMs ? `Source record: ${fmtDate(latestMs)}` : null;
  let freshnessText = "Freshness unknown";
  if (fc === "CURRENT") freshnessText = "Current";
  else if (fc === "RECENT") freshnessText = "Recent";
  else if (fc === "HISTORICAL") freshnessText = "Historical validation example";
  if (days != null && Number.isFinite(days)) {
    const d = Math.floor(days);
    freshnessText += ` · latest activity ${d === 0 ? "today" : d === 1 ? "1 day ago" : `${d.toLocaleString()} days ago`}`;
  }
  const stale = fc !== "" && fc !== "CURRENT" && fc !== "RECENT";

  // --- Verification: only where underlying data supports a state ---
  const verificationState: VerificationState = stale ? "STALE" : "UNVERIFIED";
  const verificationLabel = stale
    ? "Evidence may be stale — freshness concern only; maturity history is unchanged."
    : "Not independently verified — sourced directly from government records; BuildSignal has not separately confirmed current status.";

  // --- What we know (KNOWN, evidence-backed facts only) ---
  const knownFacts = timeline.map((e) => {
    const date = fmtDate(e.publishedAt);
    const where = [e.address, e.city].filter(Boolean).join(", ");
    return `${eventLabel(e.eventType)}${e.title ? ` — ${e.title}` : ""}${where ? ` (${where})` : ""}${date ? ` · ${date}` : ""}`;
  });

  // --- Interpretation (INFERRED/analysis — kept distinct from known facts) ---
  const interpretation = evidence
    .map((e) => e.confidenceBasis || e.why)
    .filter((x): x is string => Boolean(x));

  // --- What's still unknown (decision-relevant, determinable only) ---
  const unknowns: string[] = [];
  const maxEvidenceRank = timeline.reduce((m, e) => Math.max(m, e.stageRank ?? 0), 0);
  if (certified && currentRank != null) {
    if (currentRank < 4 && maxEvidenceRank < 4) unknowns.push("Construction start not independently confirmed in available records.");
    if (currentRank >= 4 && maxEvidenceRank < 5) unknowns.push("Project completion not recorded in available sources.");
  }
  if (!certified) unknowns.push("Current development stage not verified against the evidence ladder.");
  if (timeline.length > 0 && timeline.every((e) => !e.address)) unknowns.push("Exact site address not confirmed in available records.");
  if (sequence.independentSourceCount <= 1) unknowns.push("Only one independent authoritative source observed so far.");
  if (stale) unknowns.push("Current official status beyond the last observed source update is unknown.");

  // --- Strengthen / weaken (deterministic, explanatory; no prediction) ---
  const strengthen = certified && currentRank != null ? [STRENGTHEN_BY_RANK[currentRank]] : [];
  const weaken = [WEAKEN_TEXT];

  // --- Provenance summary (expandable; plain wording, no enum codes) ---
  const sources = timeline.map((e) => ({
    organization: e.providerId || "Local government records",
    recordDate: fmtDate(e.publishedAt),
    status: e.status || null,
    url: e.sourceUrl || null,
    confidenceText:
      typeof e.canonicalConfidence === "number"
        ? `${confidenceBand(e.canonicalConfidence)} · ${e.canonicalConfidence}/100`
        : null,
  }));
  const stageProvenanceText = certified
    ? "Current stage verified against BuildSignal's five-stage evidence ladder from authoritative government records."
    : "Stage mapping preserved from source records; not certified against the evidence ladder.";

  return {
    certified,
    stages,
    currentStageLabel,
    uncertifiedNotice,
    confidence: { value: confValue, band: confBand, text: confText, basis: confBasis },
    freshness: { text: freshnessText, stale, sourceDateText },
    verification: { state: verificationState, label: verificationLabel },
    knownFacts,
    interpretation,
    unknowns,
    strengthen,
    weaken,
    provenance: { sources, stageProvenanceText },
  };
}
