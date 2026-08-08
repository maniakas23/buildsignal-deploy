/**
 * LLM Simulation Gate
 *
 * Prevents simulated / placeholder data from reaching customers in production.
 * Controlled via the SIMULATION_MODE environment variable.
 */

import { TRPCError } from "@trpc/server";
import { DataProvenance } from "./data-classification";

export const SIMULATION_MODE = {
  /**
   * Read the simulation mode from environment variables.
   *
   *   "allowed" = simulated data visible (demos / internal)
   *   "blocked" = simulated data hidden from customers (production default)
   *   "warn"    = simulated data visible with warnings (testing)
   */
  getState(env: Record<string, string>): "allowed" | "blocked" | "warn" {
    const mode = env.SIMULATION_MODE?.toLowerCase();
    if (mode === "allowed") return "allowed";
    if (mode === "warn") return "warn";
    return "blocked"; // Default to blocked for safety
  },
};

/**
 * Throw if the current environment blocks simulated data.
 * Use this in tRPC queries that must only serve real data.
 */
export function requireRealData(env: Record<string, string>): void {
  const mode = SIMULATION_MODE.getState(env);
  if (mode === "blocked") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message:
        "Simulated data is not available in production. This feature requires real data sources.",
    });
  }
}

/**
 * Filter an array of items, removing simulated / placeholder data
 * when the environment is set to "blocked" and the caller is not admin.
 */
export function filterSimulatedData<T extends { provenance?: DataProvenance }>(
  data: T[],
  env: Record<string, string>,
  userIsAdmin: boolean = false
): T[] {
  const mode = SIMULATION_MODE.getState(env);
  if (mode === "allowed" || userIsAdmin) return data;
  return data.filter(
    (item) => item.provenance !== "simulated" && item.provenance !== "placeholder"
  );
}

/**
 * Decide whether a single data item should be shown.
 */
export function shouldShowData(
  provenance: DataProvenance,
  env: Record<string, string>,
  userIsAdmin: boolean = false
): boolean {
  const mode = SIMULATION_MODE.getState(env);
  if (mode === "allowed" || userIsAdmin) return true;
  return provenance !== "simulated" && provenance !== "placeholder";
}

/**
 * Attach a simulation warning to a data object when in "warn" mode.
 */
export function addSimulationWarning<T>(
  data: T,
  provenance: DataProvenance,
  env: Record<string, string>
): T & { _simulationWarning?: string } {
  const mode = SIMULATION_MODE.getState(env);
  if (
    mode === "warn" &&
    (provenance === "simulated" || provenance === "placeholder")
  ) {
    return {
      ...data,
      _simulationWarning: `This data is ${provenance}. Not for commercial decisions.`,
    };
  }
  return data;
}
