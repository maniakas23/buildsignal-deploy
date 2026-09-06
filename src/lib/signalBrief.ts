/**
 * BuildSignal Decision-Grade Signal Brief — deterministic read/view model (Gate 2D).
 *
 * Composes the certified Gate 2C.2 Evidence Ladder model. Consumes ONLY the
 * canonical v397/v398 fields already served by the production read boundary.
 *
 * HARD RULES encoded here:
 *   - NO new score, NO composite, NO "signal strength" number.
 *   - NO prediction, NO probability, NO likelihood language.
 *   - NO Strategy Fit, NO personalization.
 *   - Axes stay separate: Evidence / Confidence / Maturity / Verification / Freshness.
 *   - KNOWN never contains inferred claims; interpretation is always visibly hedged.
 *   - UNKNOWN is a legitimate result; it is never filled with speculation.
 *   - Negative-evidence semantics (STALE / WEAKENED / REFUTED / REGRESSION) are
 *     PRESENTED only — this module cannot mutate any lifecycle state.
 */

import {
  buildEvidenceLadder,
  eventLabel,
  fmtDate,
  LADDER_STAGES,
  type EvidenceLadderModel,
  type EvidenceItemInput,
  type SequenceInput,
  type TimelineEventInput,
} from "./evidenceLadder";

export type InfoState = "KNOWN" | "INFERRED" | "UNKNOWN";

export interface SupportItem {
  text: string;
  organization: string;
  recordDate: string | null;
  sourceUrl: string | null;
  confidenceText: string | null;
}

export interface SignalBriefModel {
  /** A — factual, KNOWN-grounded description. Null only when there are no records at all. */
  whatHappened: string | null;
  whatHappenedEmpty: string | null;
  /** B — INFERRED interpretation, verbatim from existing evidence analysis. Empty → omit section. */
  whyItMayMatter: string[];
  /** C — existing axes surfaced independently. Never a score. */
  position: {
    maturityText: string; // "Construction Commitment — stage 4 of 5" | "Maturity not yet verified"
    maturityCertified: boolean;
    confidenceText: string; // e.g. "High · 80/100" or "Confidence not available"
    verificationLabel: string | null;
    freshnessText: string;
  };
  /** D — up to 3 strongest supporting items, each traceable to provenance. */
  supports: SupportItem[];
  /** E — decision-relevant unknowns justified by missing evidence only. */
  unknowns: string[];
  /** F — deterministic next-evidence conditions from the lifecycle model. */
  strengthen: string[];
  /** G — weaken/refute explanation with ratified negative-evidence semantics. */
  weaken: string[];
  /** H — conditional watch condition. Never predictive. */
  watchNext: string;
  /** Information-state tags for the rendered sections (MODELED omitted: no modeled data exists). */
  infoState: {
    whatHappened: "KNOWN";
    whyItMayMatter: "INFERRED";
    supports: "KNOWN";
    unknowns: "UNKNOWN";
  };
}

/** Conditional watch conditions keyed by certified canonical rank. Deterministic, non-predictive. */
const WATCH_BY_RANK: Record<number, string> = {
  1: "Watch for site-plan or subdivision application records that would indicate site commitment.",
  2: "Watch for funded or programmed public infrastructure records tied to this site, or for construction permit activity.",
  3: "Watch for issued building, grading, or utility connection permits that would indicate construction commitment.",
  4: "Watch for authoritative records confirming construction progress or project completion.",
  5: "This timeline has reached completion-stage evidence. Watch for any corrected or amended records.",
};

const WATCH_UNCERTIFIED = "Watch for authoritative records that establish this site's current development stage.";

/** Ratified negative-evidence semantics, in customer language. Presentation only. */
const NEGATIVE_EVIDENCE_SEMANTICS: string[] = [
  "Contrary government records — such as a withdrawn application, rescinded funding, a project cancellation, or a corrected source record — would weaken or refute this interpretation. Historical maturity already reached would remain part of the record.",
  "Records becoming older affects freshness and confidence only — the maturity position does not change from the passage of time.",
  "Amended, corrected, or withdrawn source records would reduce confidence in this interpretation.",
  "Only a formal correction of record can change the maturity position, and only with a documented audit trail.",
];

function latestEvent(timeline: TimelineEventInput[]): TimelineEventInput | null {
  if (timeline.length === 0) return null;
  return timeline.find((e) => e.isCurrentStage) ?? timeline[timeline.length - 1];
}

export function buildSignalBrief(
  sequence: SequenceInput,
  timeline: TimelineEventInput[],
  evidence: EvidenceItemInput[],
): SignalBriefModel {
  const ladder: EvidenceLadderModel = buildEvidenceLadder(sequence, timeline, evidence);
  const certified = ladder.certified;
  const rank = certified && sequence.maturity ? sequence.maturity.canonicalRank : null;

  // --- A. WHAT HAPPENED (KNOWN only — facts from records, no inference) ---
  let whatHappened: string | null = null;
  let whatHappenedEmpty: string | null = null;
  const latest = latestEvent(timeline);
  if (!latest) {
    whatHappenedEmpty = "No government records are currently linked to this development timeline.";
  } else {
    const county = sequence.county ? `${sequence.county} County` : "County";
    const recWord = sequence.eventCount === 1 ? "record" : "records";
    const srcWord = sequence.independentSourceCount === 1 ? "source" : "sources";
    const latestDate = fmtDate(latest.publishedAt);
    const latestPhrase = `Most recently: ${eventLabel(latest.eventType)}${latest.title ? ` — ${latest.title}` : ""}${latestDate ? ` (${latestDate})` : ""}.`;
    if (certified && rank != null) {
      const stageName = LADDER_STAGES[rank - 1].label;
      whatHappened =
        `${county} records show ${sequence.eventCount} government ${recWord} linked to this development timeline across ${sequence.independentSourceCount} authoritative ${srcWord}. ` +
        latestPhrase +
        ` Together, these records support the stage: ${stageName} (stage ${rank} of 5).`;
    } else {
      whatHappened =
        `${county} records show ${sequence.eventCount} government ${recWord} linked to this development timeline across ${sequence.independentSourceCount} authoritative ${srcWord}. ` +
        latestPhrase +
        " The current development stage has not been verified against BuildSignal's evidence ladder.";
    }
  }

  // --- B. WHY IT MAY MATTER (INFERRED — existing interpretation, visibly hedged) ---
  const whyItMayMatter = ladder.interpretation.slice(0, 3);

  // --- C. CURRENT EVIDENCE POSITION (existing axes, independent, no score) ---
  const position = {
    maturityText:
      certified && rank != null
        ? `${LADDER_STAGES[rank - 1].label} — stage ${rank} of 5`
        : "Maturity not yet verified",
    maturityCertified: certified,
    confidenceText: ladder.confidence.text,
    verificationLabel: ladder.verification.label ? (ladder.verification.state === "STALE" ? "Stale" : "Not independently verified") : null,
    freshnessText: ladder.freshness.text,
  };

  // --- D. WHAT SUPPORTS THIS (strongest first; each traceable) ---
  const ordered = [...timeline].sort((a, b) => {
    const score = (e: TimelineEventInput) =>
      (e.isCurrentStage ? 4 : 0) + (e.isStageAdvancement ? 2 : 0) + (e.stageRank ?? 0) / 10;
    return score(b) - score(a);
  });
  const supports: SupportItem[] = ordered.slice(0, 3).map((e) => {
    const date = fmtDate(e.publishedAt);
    const where = [e.address, e.city].filter(Boolean).join(", ");
    return {
      text: `${eventLabel(e.eventType)}${e.title ? ` — ${e.title}` : ""}${where ? ` (${where})` : ""}${date ? ` · ${date}` : ""}`,
      organization: e.providerId || "Local government records",
      recordDate: date,
      sourceUrl: e.sourceUrl || null,
      confidenceText:
        typeof e.canonicalConfidence === "number" ? `${e.canonicalConfidence}/100` : null,
    };
  });

  // --- E. WHAT WE DON'T KNOW YET (only data-justified unknowns) ---
  const unknowns = ladder.unknowns;

  // --- F. WHAT WOULD STRENGTHEN (from certified lifecycle rules; never predicts occurrence) ---
  const strengthen = ladder.strengthen;

  // --- G. WHAT WOULD WEAKEN OR REFUTE (ratified semantics, presentation only) ---
  const weaken = NEGATIVE_EVIDENCE_SEMANTICS;

  // --- H. WHAT TO WATCH NEXT (conditional; never predictive) ---
  const watchNext = certified && rank != null ? WATCH_BY_RANK[rank] : WATCH_UNCERTIFIED;

  return {
    whatHappened,
    whatHappenedEmpty,
    whyItMayMatter,
    position,
    supports,
    unknowns,
    strengthen,
    weaken,
    watchNext,
    infoState: {
      whatHappened: "KNOWN",
      whyItMayMatter: "INFERRED",
      supports: "KNOWN",
      unknowns: "UNKNOWN",
    },
  };
}
