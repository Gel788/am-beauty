import { cookies } from "next/headers";
import {
  CUSTOMER_SESSION_COOKIE,
  customerSessionCookieOptions,
  createCustomerSessionToken,
  verifyCustomerSessionToken,
} from "@/lib/customer/auth";
import { getCustomerPublic } from "@/lib/customer/accounts";

export async function getCustomerSession() {
  const jar = await cookies();
  const token = jar.get(CUSTOMER_SESSION_COOKIE)?.value;
  const email = verifyCustomerSessionToken(token);
  if (!email) return null;
  return getCustomerPublic(email);
}

export async function setCustomerSession(email: string) {
  const jar = await cookies();
  jar.set(CUSTOMER_SESSION_COOKIE, createCustomerSessionToken(email), customerSessionCookieOptions());
}

export async function clearCustomerSession() {
  const jar = await cookies();
  jar.set(CUSTOMER_SESSION_COOKIE, "", { ...customerSessionCookieOptions(), maxAge: 0 });
}
