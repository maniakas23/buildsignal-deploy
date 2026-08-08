/**
 * Reliability patterns: circuit breaker, retry, graceful degradation.
 *
 * All state is in-memory (per-Worker). For multi-Worker deployments
 * each Worker maintains its own circuit breaker state, which is
 * acceptable for edge-resident services.
 */

import { TRPCError } from "@trpc/server";

// ---------------------------------------------------------------------------
// Circuit Breaker
// ---------------------------------------------------------------------------

interface CircuitBreakerState {
  state: "closed" | "open" | "half-open";
  failures: number;
  lastFailure: number;
  successThreshold: number;
  failureThreshold: number;
  timeout: number;
}

const circuitBreakers = new Map<string, CircuitBreakerState>();

export function getCircuitBreaker(
  name: string,
  config?: {
    failureThreshold?: number;
    timeout?: number;
    successThreshold?: number;
  }
): CircuitBreakerState {
  if (!circuitBreakers.has(name)) {
    circuitBreakers.set(name, {
      state: "closed",
      failures: 0,
      lastFailure: 0,
      successThreshold: config?.successThreshold ?? 2,
      failureThreshold: config?.failureThreshold ?? 5,
      timeout: config?.timeout ?? 60_000,
    });
  }
  return circuitBreakers.get(name)!;
}

export function recordSuccess(name: string): void {
  const cb = getCircuitBreaker(name);
  if (cb.state === "half-open") {
    cb.failures = Math.max(0, cb.failures - 1);
    if (cb.failures <= 0) cb.state = "closed";
  } else {
    cb.failures = Math.max(0, cb.failures - 1);
  }
}

export function recordFailure(name: string): void {
  const cb = getCircuitBreaker(name);
  cb.failures++;
  cb.lastFailure = Date.now();
  if (cb.failures >= cb.failureThreshold) {
    cb.state = "open";
  }
}

export function isCircuitOpen(name: string): boolean {
  const cb = getCircuitBreaker(name);
  if (cb.state === "open") {
    if (Date.now() - cb.lastFailure > cb.timeout) {
      cb.state = "half-open";
      return false;
    }
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Retry with exponential backoff + jitter
// ---------------------------------------------------------------------------

/** Compute a jittered delay in milliseconds. */
function jitteredDelay(baseDelay: number, attempt: number, maxDelay: number): number {
  const exp = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  // Uniform jitter: 0.5x – 1.0x of the exponential value
  return Math.floor(exp * (0.5 + Math.random() * 0.5));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1_000, maxDelay = 30_000 } = options;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxRetries) break;

      const delay = jitteredDelay(baseDelay, attempt, maxDelay);
      if (options.onRetry) options.onRetry(attempt + 1, lastError);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// ---------------------------------------------------------------------------
// Circuit-breaker wrapper
// ---------------------------------------------------------------------------

export async function withCircuitBreaker<T>(
  name: string,
  fn: () => Promise<T>,
  fallback?: () => T
): Promise<T> {
  if (isCircuitOpen(name)) {
    if (fallback) return fallback();
    throw new Error(`Circuit breaker is open for: ${name}`);
  }

  try {
    const result = await fn();
    recordSuccess(name);
    return result;
  } catch (error) {
    recordFailure(name);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Graceful degradation
// ---------------------------------------------------------------------------

export async function withDegradation<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T> | T,
  options?: { circuitName?: string; logDegradation?: boolean }
): Promise<T> {
  try {
    if (options?.circuitName && isCircuitOpen(options.circuitName)) {
      throw new Error("Circuit open");
    }
    const result = await primary();
    if (options?.circuitName) recordSuccess(options.circuitName);
    return result;
  } catch (error) {
    if (options?.circuitName) recordFailure(options.circuitName);
    if (options?.logDegradation) {
      console.warn(
        `Degrading to fallback for ${options.circuitName}:`,
        error
      );
    }
    return await fallback();
  }
}

// ---------------------------------------------------------------------------
// Standardized errors
// ---------------------------------------------------------------------------

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public retryable: boolean = false,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function handleError(error: unknown): {
  code: string;
  message: string;
  statusCode: number;
  retryable: boolean;
} {
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      retryable: error.retryable,
    };
  }
  if (error instanceof TRPCError) {
    return {
      code: error.code,
      message: error.message,
      statusCode: 400,
      retryable: false,
    };
  }
  return {
    code: "INTERNAL_ERROR",
    message: "An unexpected error occurred",
    statusCode: 500,
    retryable: true,
  };
}
