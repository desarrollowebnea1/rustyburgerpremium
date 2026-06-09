import { SignJWT, jwtVerify } from "jose";
import type { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE_NAME = "rusty_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

export type AdminSessionPayload = {
  adminId: string;
  email: string;
  role: string;
};

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error("JWT_SECRET no está configurado en las variables de entorno.");
  }
  return new TextEncoder().encode(secret);
}

export function assertJwtSecret(): void {
  getJwtSecretKey();
}

export async function signAdminToken(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({
    adminId: payload.adminId,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_MAX_AGE}s`)
    .sign(getJwtSecretKey());
}

export async function verifyAdminToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const secret = process.env.JWT_SECRET?.trim();
    if (!secret) return null;

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const adminId = payload.adminId;
    const email = payload.email;
    const role = payload.role;

    if (typeof adminId !== "string" || typeof email !== "string" || typeof role !== "string") {
      return null;
    }

    return { adminId, email, role };
  } catch {
    return null;
  }
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  };
}

export function setAdminSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(ADMIN_COOKIE_NAME, token, getAdminCookieOptions());
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    ...getAdminCookieOptions(),
    maxAge: 0,
  });
}

export async function getAdminSessionFromRequest(
  request: NextRequest
): Promise<AdminSessionPayload | null> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
