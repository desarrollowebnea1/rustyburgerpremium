import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  type AdminSessionPayload,
  verifyAdminToken,
} from "@/lib/auth-core";

export {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
  type AdminSessionPayload,
  assertJwtSecret,
  clearAdminSessionCookie,
  getAdminCookieOptions,
  getAdminSessionFromRequest,
  setAdminSessionCookie,
  signAdminToken,
  verifyAdminToken,
} from "@/lib/auth-core";

export async function getAdminSessionFromCookies(): Promise<AdminSessionPayload | null> {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
