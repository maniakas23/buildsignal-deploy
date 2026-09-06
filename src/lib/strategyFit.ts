/**
 * Gate 2E — Strategy Fit (deterministic customer-context relevance).
 *
 * Architectural rule (directive §2): OBJECTIVE INTELLIGENCE must remain
 * separate from CUSTOMER-SPECIFIC STRATEGIC RELEVANCE. This module READS the
 * certified EvidenceLadderModel and NEVER mutates it. It answers only:
 * "How relevant is this objectively observed signal to what this customer is
 * trying to accomplish?" — never truth, strength, maturity, verification,
 * prediction, or purchase advice.
 *
 * Deterministic only (§8): transparent rules over existing canonical
 * maturity + confidence + verification + freshness + evidence counts.
 * No LLM call. No numeric score (§4): HIGH / MODERATE / LOW /
 * INSUFFICIENT_INFORMATION only.
 */

import type { EvidenceLadderModel, VerificationState } from "./evidenceLadder";

export type StrategyId =
  | "broker_leasing"
  | "site_selection"
  | "early_market_entry"
  | "land_investment"
  | "portfolio_monitoring"
  | "general_research";

export type FitClass = "HIGH" | "MODERATE" | "LOW" | "INSUFFICIENT_INFORMATION";

export interface StrategyDef {
  id: StrategyId;
  label: string;
  description: string;
}

export const STRATEGIES: StrategyDef[] = [
  { id: "broker_leasing", label: "Broker / Leasing Timing", description: "Signals that may inform leasing, tenant, and market-entry timing conversations." },
  { id: "site_selection", label: "Development Site Selection", description: "Where development activity and infrastructure commitment are forming." },
  { id: "early_market_entry", label: "Early Market Entry", description: "Potentially meaningful activity before the market story is fully mature." },
  { id: "land_investment", label: "Land / Investment Research", description: "Areas where development evidence may warrant deeper research. Not a purchase recommendation." },
  { id: "portfolio_monitoring", label: "Portfolio Monitoring", description: "Signals that may affect assets, markets, or exposures you already track." },
  { id: "general_research", label: "General Research", description: "Broadly meaningful objective intelligence, without a more specific goal." },
];

export const DEFAULT_STRATEGY: StrategyId = "general_research";

export function strategyDef(id: StrategyId): StrategyDef {
  return STRATEGIES.find((s) => s.id === id) ?? STRATEGIES[STRATEGIES.length - 1];
}

export function isStrategyId(v: unknown): v is StrategyId {
  return typeof v === "string" && STRATEGIES.some((s) => s.id === v);
}

export const FIT_LABEL: Record<FitClass, string> = {
  HIGH: "High",
  MODERATE: "Moderate",
  LOW: "Low",
  INSUFFICIENT_INFORMATION: "Insufficient information",
};

export interface StrategyFitResult {
  strategy: StrategyId;
  strategyLabel: string;
  fit: FitClass;
  fitLabel: string;
  /** Why the signal may be relevant — references objective characteristics only. */
  why: string[];
  /** What limits the fit assessment. */
  limits: string[];
  /** What additional evidence could change the fit assessment. */
  couldChange: string[];
  /** Information state of this output: fit is an INFERRED customer-context layer. */
  infoState: "INFERRED";
}

/* ------------------------------------------------------------------ */
/* Objective inputs (read-only extraction from the certified ladder)   */
/* ------------------------------------------------------------------ */

interface ObjectiveInputs {
  certified: boolean;
  rank: number | null; // 1–5 canonical, only when certified
  stageLabel: string | null;
  confidence: number | null; // 0–100
  stale: boolean;
  verification: VerificationState;
  sourceCount: number;
  knownFactCount: number;
}

function inputsOf(ladder: EvidenceLadderModel): ObjectiveInputs {
  const current = ladder.stages.find((s) => s.state === "current");
  return {
    certified: ladder.certified && current != null,
    rank: ladder.certified && current ? current.rank : null,
    stageLabel: ladder.currentStageLabel,
    confidence: ladder.confidence.value,
    stale: ladder.freshness.stale,
    verification: ladder.verification.state,
    sourceCount: ladder.provenance.sources.length,
    knownFactCount: ladder.knownFacts.length,
  };
}

/* ------------------------------------------------------------------ */
/* Base relevance by canonical maturity rank, per strategy             */
/* Documented deterministic matrix (directive §13).                    */
/* ------------------------------------------------------------------ */

const BASE_BY_RANK: Record<StrategyId, Record<number, FitClass>> = {
  // Later-stage evidence gives timing information; never claims leasing demand.
  broker_leasing: { 1: "LOW", 2: "LOW", 3: "MODERATE", 4: "HIGH", 5: "HIGH" },
  // Site/infrastructure commitment is the core relevance zone.
  site_selection: { 1: "MODERATE", 2: "HIGH", 3: "HIGH", 4: "MODERATE", 5: "LOW" },
  // Earlier credible evidence is more relevant; completed projects are not.
  early_market_entry: { 1: "HIGH", 2: "HIGH", 3: "MODERATE", 4: "LOW", 5: "LOW" },
  // Research relevance; never a purchase recommendation.
  land_investment: { 1: "MODERATE", 2: "HIGH", 3: "HIGH", 4: "MODERATE", 5: "LOW" },
  // Exposure monitoring; broad moderate relevance, upgraded only when fresh,
  // multi-source, and well-supported.
  portfolio_monitoring: { 1: "MODERATE", 2: "MODERATE", 3: "MODERATE", 4: "MODERATE", 5: "MODERATE" },
  // Neutral default; favors broadly meaningful mid-to-late objective signals.
  general_research: { 1: "MODERATE", 2: "MODERATE", 3: "HIGH", 4: "HIGH", 5: "MODERATE" },
};

const RANK_WHY: Record<StrategyId, Record<number, string>> = {
  broker_leasing: {
    1: "Early intent-stage records rarely provide usable leasing or supply timing.",
    2: "Site Commitment-stage evidence is still early for timing conversations.",
    3: "Infrastructure Commitment can begin to inform supply-timing conversations.",
    4: "Construction Commitment evidence can be relevant to leasing and supply timing.",
    5: "Recorded completion can be relevant to near-term supply and tenant conversations.",
  },
  site_selection: {
    1: "Development Intent records mark where activity may be forming.",
    2: "Site Commitment evidence directly marks where development activity is forming.",
    3: "Infrastructure Commitment evidence marks strengthening site-development momentum.",
    4: "Construction Commitment confirms momentum but the site-selection window may be narrowing.",
    5: "Completed projects offer limited site-selection relevance.",
  },
  early_market_entry: {
    1: "Development Intent-stage evidence can be relevant when watching for activity before it is broadly visible.",
    2: "Site Commitment-stage evidence can be relevant before the market story is fully mature.",
    3: "Infrastructure Commitment is visible but no longer early-stage.",
    4: "Construction Commitment is typically already visible to the broader market.",
    5: "Completed projects are generally too mature for an early-entry objective.",
  },
  land_investment: {
    1: "Development Intent records may justify early research attention.",
    2: "Site Commitment evidence may warrant deeper area research.",
    3: "Infrastructure Commitment evidence may warrant deeper area research.",
    4: "Construction-stage evidence may still support research, though much of the move is underway.",
    5: "Completed projects offer limited research upside for this objective.",
  },
  portfolio_monitoring: {
    1: "Early-stage records can be worth noting for markets you monitor.",
    2: "Site Commitment records can be worth noting for markets you monitor.",
    3: "Infrastructure Commitment records may affect monitored markets or exposures.",
    4: "Construction-stage records may affect monitored markets or exposures.",
    5: "Completion records may affect monitored markets or exposures.",
  },
  general_research: {
    1: "Development Intent records are broadly meaningful objective intelligence.",
    2: "Site Commitment records are broadly meaningful objective intelligence.",
    3: "Infrastructure Commitment records are broadly meaningful objective intelligence.",
    4: "Construction Commitment records are broadly meaningful objective intelligence.",
    5: "Completion records are broadly meaningful objective intelligence.",
  },
};

const STRATEGY_INTRINSIC_LIMIT: Record<StrategyId, string> = {
  broker_leasing: "These records do not evidence leasing demand or tenant movement; they inform timing context only.",
  site_selection: "These records do not establish site feasibility, zoning viability, assemblage feasibility, or developer intent.",
  early_market_entry: "Earlier-stage relevance carries more uncertainty; this is relevance, not a prediction of project advancement.",
  land_investment: "Research relevance only — this is not a recommendation to purchase land or securities.",
  portfolio_monitoring: "Relevance depends on whether this geography matches your monitored exposure, which BuildSignal does not verify.",
  general_research: "No specific objective is selected; fit reflects broad relevance rather than a tailored goal.",
};

function cap(fit: FitClass, ceiling: FitClass): FitClass {
  const order: FitClass[] = ["INSUFFICIENT_INFORMATION", "LOW", "MODERATE", "HIGH"];
  return order[Math.min(order.indexOf(fit), order.indexOf(ceiling))];
}

/* ------------------------------------------------------------------ */
/* Classifier                                                          */
/* ------------------------------------------------------------------ */

export function classifyStrategyFit(ladder: EvidenceLadderModel, strategy: StrategyId): StrategyFitResult {
  const def = strategyDef(strategy);
  const o = inputsOf(ladder);
  const why: string[] = [];
  const limits: string[] = [];
  const couldChange: string[] = [];

  // Gate 1 — anomalous/uncertified maturity: no defensible fit (§14).
  // DEVELOPMENT_APPLICATION must not magically receive strong fit.
  if (!o.certified || o.rank == null) {
    return {
      strategy, strategyLabel: def.label,
      fit: "INSUFFICIENT_INFORMATION", fitLabel: FIT_LABEL.INSUFFICIENT_INFORMATION,
      why: ["The available objective information cannot support a defensible fit classification for this strategy."],
      limits: [
        "Current development stage not verified against the evidence ladder.",
        STRATEGY_INTRINSIC_LIMIT[strategy],
      ],
      couldChange: [
        "Authoritative records that establish the current development stage could allow a fit assessment.",
        ...ladder.strengthen.slice(0, 1),
      ],
      infoState: "INFERRED",
    };
  }

  // Gate 2 — confidence unavailable: cannot defend a classification (§14).
  if (o.confidence == null) {
    return {
      strategy, strategyLabel: def.label,
      fit: "INSUFFICIENT_INFORMATION", fitLabel: FIT_LABEL.INSUFFICIENT_INFORMATION,
      why: ["The available objective information cannot support a defensible fit classification for this strategy."],
      limits: ["Confidence is not available for this signal.", STRATEGY_INTRINSIC_LIMIT[strategy]],
      couldChange: ["Additional corroborating source records could establish a confidence position."],
      infoState: "INFERRED",
    };
  }

  const rank = o.rank;
  let fit: FitClass = BASE_BY_RANK[strategy][rank];
  why.push(RANK_WHY[strategy][rank]);

  // Objective characteristic contributions.
  if (o.sourceCount >= 2) why.push(`${o.sourceCount} independent authoritative sources corroborate this timeline.`);
  if (!o.stale) why.push("The evidence is current, which keeps this assessment timely.");

  // Refuted (§17): closing/contradictory evidence — historical research
  // relevance remains, current-timing relevance collapses. Never rewrites the
  // underlying negative-evidence state.
  if (o.verification === "REFUTED") {
    fit = "LOW";
    limits.push("Contradictory or closing evidence limits current relevance; historical maturity is preserved for research context.");
  }

  // Freshness cap (§13): stale evidence limits any current assessment.
  if (o.stale) {
    fit = cap(fit, "MODERATE");
    limits.push("Evidence may be stale — a freshness limitation only; maturity history is unchanged.");
    couldChange.push("Newer source records would address the freshness limitation.");
  }

  // Confidence caps: confidence is NOT fit (§15) — it limits, never raises.
  if (o.confidence < 60) {
    fit = cap(fit, "MODERATE");
    limits.push(`Confidence is ${ladder.confidence.text} — lower evidentiary support limits the fit assessment.`);
    couldChange.push("Additional corroborating government records could raise the confidence position.");
  }

  // Sparse evidence cap (§14).
  if (o.knownFactCount < 2) {
    fit = cap(fit, "MODERATE");
    limits.push("Sparse linked evidence limits how defensible any fit classification can be.");
    couldChange.push("More linked government records would strengthen the basis for a fit assessment.");
  }

  // Verification limitation is exposed (§16) — never promoted.
  if (o.verification === "UNVERIFIED" || o.verification === null) {
    limits.push("This signal is not independently verified; fit does not change that.");
  } else if (o.verification === "STALE") {
    // already covered by freshness cap; ensure the limitation is visible
    if (!limits.some((l) => l.includes("stale"))) limits.push("Evidence may be stale — a freshness limitation only; maturity history is unchanged.");
  }

  // Strategy-intrinsic limit (transparency, §5/§13).
  limits.push(STRATEGY_INTRINSIC_LIMIT[strategy]);

  // Portfolio monitoring upgrade: fresh + multi-source + well-supported.
  if (strategy === "portfolio_monitoring" && fit === "MODERATE" && !o.stale && o.sourceCount >= 2 && o.confidence >= 75 && o.verification !== "REFUTED") {
    fit = "HIGH";
    why.push("Current, multi-source, well-supported evidence raises monitoring relevance.");
  }

  // What could change the assessment (lifecycle-based, never predictive).
  if (ladder.strengthen.length > 0) couldChange.push(ladder.strengthen[0]);

  return {
    strategy, strategyLabel: def.label,
    fit, fitLabel: FIT_LABEL[fit],
    why, limits, couldChange,
    infoState: "INFERRED",
  };
}
