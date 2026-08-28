export const ADMIN_SESSION_COOKIE = "am_admin_session";

/** Edge-safe session check (expiry only). Full HMAC verify in auth.ts for API routes. */
export function isAdminSessionActive(token: string | undefined | null) {
  if (!token) return false;
  const [payload] = token.split(".");
  if (!payload?.startsWith("admin:")) return false;
  const expires = Number(payload.split(":")[1]);
  return Number.isFinite(expires) && Date.now() < expires;
}
