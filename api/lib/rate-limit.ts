// Distributed rate limiting for Cloudflare Workers
// Uses in-memory store (per-worker). For production with multiple workers,
// consider using Cloudflare KV or Durable Objects.

interface RateLimitEntry { count: number; resetAt: number; }
const rateLimitStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(identifier: string, maxRequests: number, windowMs: number): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const windowKey = Math.floor(now / windowMs);
  const key = `${identifier}:${windowKey}`;
  const entry = rateLimitStore.get(key);
  if (!entry) {
    const resetAt = (windowKey + 1) * windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }
  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }
  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

// Cleanup old entries periodically
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt < now) rateLimitStore.delete(key);
  }
}
setInterval(cleanupRateLimitStore, 60000);

// Rate limit by user + endpoint
export function rateLimitUser(userId: number, endpoint: string, maxRequests: number, windowMs: number) {
  return checkRateLimit(`user:${userId}:${endpoint}`, maxRequests, windowMs);
}

// Rate limit by IP (for public endpoints)
export function rateLimitIP(ip: string, endpoint: string, maxRequests: number, windowMs: number) {
  return checkRateLimit(`ip:${ip}:${endpoint}`, maxRequests, windowMs);
}
