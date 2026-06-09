import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return fail("Sesión no válida o expirada.", 401);
  }

  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { id: session.adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
      },
    });

    if (!admin || !admin.active) {
      return fail("Sesión no válida o expirada.", 401);
    }

    return ok({ admin });
  } catch (error) {
    return handleRepositoryError(error);
  }
}
