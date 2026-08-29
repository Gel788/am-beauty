import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const CUSTOMER_SESSION_COOKIE = "am_customer_session";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const RESET_TTL_MS = 1000 * 60 * 60; // 1 hour

function getSecret() {
  return process.env.CUSTOMER_AUTH_SECRET ?? `${process.env.ADMIN_PASSWORD ?? "ambeauty"}-customer`;
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string) {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, salt, 64);
  if (expected.length !== actual.length) return false;
  try {
    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function generateTempPassword() {
  return randomBytes(9).toString("base64url").slice(0, 12);
}

export function hashResetToken(token: string) {
  return createHmac("sha256", getSecret()).update(token).digest("hex");
}

export function createCustomerSessionToken(email: string) {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `customer:${email.toLowerCase()}:${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyCustomerSessionToken(token: string | undefined | null) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length) return null;
  try {
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  const parts = payload.split(":");
  if (parts[0] !== "customer" || parts.length !== 3) return null;
  const email = parts[1];
  const expires = Number(parts[2]);
  if (!email || !Number.isFinite(expires) || Date.now() > expires) return null;
  return email;
}

export function customerSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

export function resetTokenExpiresAt() {
  return new Date(Date.now() + RESET_TTL_MS).toISOString();
}

export { RESET_TTL_MS };
