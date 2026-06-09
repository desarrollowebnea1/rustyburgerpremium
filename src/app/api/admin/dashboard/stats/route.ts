import { ok } from "@/lib/api-response";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";
import { getAdminDashboardStats } from "@/lib/services/admin-orders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  try {
    const stats = await getAdminDashboardStats();
    return ok({ stats });
  } catch (error) {
    return handleRepositoryError(error);
  }
}
