/**
 * Cryptographic utilities using Web Crypto API only.
 * Compatible with Cloudflare Workers — no Node.js crypto module.
 */

const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;

function bufferToBase64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function base64urlToBuffer(b64: string): ArrayBuffer {
  const normalized = b64.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Hash a password using PBKDF2-SHA256 with a random salt.
 * Returns a string in the format: pbkdf2_sha256$<iterations>$<salt>$<hash>
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);

  // Generate random salt
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

  // Derive key with PBKDF2
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBytes,
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    KEY_LENGTH * 8
  );

  const saltB64 = bufferToBase64url(salt.buffer);
  const hashB64 = bufferToBase64url(derivedBits);

  return `pbkdf2_sha256$${PBKDF2_ITERATIONS}$${saltB64}$${hashB64}`;
}

/**
 * Verify a password against a PBKDF2-SHA256 hash.
 * Uses timing-safe comparison.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const parts = hash.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2_sha256") {
    return false;
  }

  const iterations = parseInt(parts[1], 10);
  const salt = base64urlToBuffer(parts[2]);
  const expectedHash = parts[3];

  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBytes,
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new Uint8Array(salt),
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    KEY_LENGTH * 8
  );

  const actualHash = bufferToBase64url(derivedBits);

  // Timing-safe comparison
  if (actualHash.length !== expectedHash.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < actualHash.length; i++) {
    result |= actualHash.charCodeAt(i) ^ expectedHash.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Sign a JWT with HMAC-SHA256.
 * Default expiration is 7 days.
 */
export async function signJWT(
  payload: { sub: number; email: string; orgId?: number | null },
  secret: string,
  expiresInSeconds: number = 86400 * 7
): Promise<string> {
  const encoder = new TextEncoder();

  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);

  const body = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const headerB64 = bufferToBase64url(encoder.encode(JSON.stringify(header)));
  const payloadB64 = bufferToBase64url(encoder.encode(JSON.stringify(body)));

  const data = encoder.encode(`${headerB64}.${payloadB64}`);

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, data);
  const signatureB64 = bufferToBase64url(signature);

  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

/**
 * Verify a JWT signed with HMAC-SHA256.
 * Returns the payload if valid, null otherwise.
 */
export async function verifyJWT(
  token: string,
  secret: string
): Promise<{ sub: number; email: string; orgId?: number | null; iat?: number; exp?: number } | null> {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split(".");
    if (!headerB64 || !payloadB64 || !signatureB64) return null;

    const payload = JSON.parse(atob(payloadB64));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;

    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, data);
    const expectedSig = btoa(String.fromCharCode(...new Uint8Array(sig)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    if (signatureB64 !== expectedSig) return null;

    return payload;
  } catch {
    return null;
  }
}
