import { getAdminSessionFromCookies } from "@/lib/auth";
import { fail } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function requireAdminSession() {
  const session = await getAdminSessionFromCookies();

  if (!session) {
    return {
      ok: false as const,
      response: fail("Sesión no válida o expirada.", 401),
    };
  }

  const admin = await prisma.adminUser.findUnique({
    where: { id: session.adminId },
    select: { id: true, email: true, name: true, role: true, active: true },
  });

  if (!admin || !admin.active) {
    return {
      ok: false as const,
      response: fail("Sesión no válida o expirada.", 401),
    };
  }

  return { ok: true as const, session, admin };
}
