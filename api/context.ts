import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getDbFromContext } from "./queries/connection";
import { SIMULATION_MODE } from "./lib/simulation-gate";

export interface Context {
  req: Request;
  env: Record<string, unknown>;
  db: ReturnType<typeof getDbFromContext>;
  resHeaders?: Headers;
  simulationMode?: any;
  user?: { id: number; email: string; name: string | null; plan: string; isAdmin: boolean };
  orgId?: number | null;
}

export async function createContext(
  opts: FetchCreateContextFnOptions & { env?: Record<string, unknown> }
): Promise<Context> {
  // Get env from Hono OR fallback to globalThis (set by functions/lib/handler.ts)
  const env = opts.env || (globalThis as any).__CF_ENV__ || {};
  const db = getDbFromContext(env);

  // Normalize env values to strings for the simulation gate
  const stringEnv: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    if (value !== undefined && value !== null) {
      stringEnv[key] = String(value);
    }
  }

  return {
    db,
    env,
    req: opts.req,
    resHeaders: opts.resHeaders,
    simulationMode: SIMULATION_MODE.getState(stringEnv),
  };
}
