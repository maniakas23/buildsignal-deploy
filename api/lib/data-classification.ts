/**
 * Data provenance classification system
 *
 * Every piece of data in BuildSignal is classified by its origin:
 * - production:   Live data from verified government sources
 * - verified:     Cross-source confirmed data
 * - simulated:    AI-generated for demonstration
 * - placeholder:  Temporary / missing data
 */

export type DataProvenance = "production" | "verified" | "simulated" | "placeholder";

export interface ClassifiedData {
  provenance: DataProvenance;
  source: string;
  confidence: number; // 0-100
  verifiedAt?: Date;
  verifiedBy?: string;
  simulationNote?: string;
  pipelineVersion?: string;
  ingestTimestamp: Date;
}

export const DATA_CLASSIFICATION = {
  production: {
    label: "Live Data",
    description: "Real-time data from verified government sources",
    color: "#18A999", // Insight Teal
    icon: "check-circle",
  },
  verified: {
    label: "Verified",
    description: "Data verified through cross-source confirmation",
    color: "#1F5EFF", // Signal Blue
    icon: "shield",
  },
  simulated: {
    label: "Simulated",
    description: "AI-generated simulation for demonstration",
    color: "#F4A261", // Opportunity Amber
    icon: "cpu",
  },
  placeholder: {
    label: "Placeholder",
    description: "Temporary placeholder data",
    color: "#D32F2F", // Error Red
    icon: "alert-triangle",
  },
} as const;

/**
 * Determine the provenance of a data item based on source characteristics.
 *
 * Conservative defaults:
 * - If simulated → always "simulated"
 * - If no live source → "placeholder"
 * - Verified + high confidence → "production"
 * - Verified + medium confidence → "verified"
 * - Everything else → "simulated"
 */
export function classifyData(config: {
  hasLiveSource: boolean;
  sourceVerified: boolean;
  isSimulated: boolean;
  confidenceScore: number;
}): DataProvenance {
  if (config.isSimulated) return "simulated";
  if (!config.hasLiveSource) return "placeholder";
  if (config.sourceVerified && config.confidenceScore >= 80) return "production";
  if (config.sourceVerified && config.confidenceScore >= 50) return "verified";
  return "simulated";
}

/**
 * Get badge metadata for a given provenance level.
 */
export function getClassificationBadge(provenance: DataProvenance) {
  return DATA_CLASSIFICATION[provenance];
}

/**
 * Mark a database record with its provenance metadata.
 * In production this would upsert classification fields.
 */
export function markDataProvenance(
  table: string,
  recordId: number,
  provenance: DataProvenance,
  source: string,
  confidence: number
) {
  return {
    table,
    recordId,
    provenance,
    source,
    confidence,
    markedAt: new Date(),
  };
}
