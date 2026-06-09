import { ok, fail } from "@/lib/api-response";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";
import { getAdminOrderById } from "@/lib/services/admin-orders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const id = context.params.id?.trim();
  if (!id) {
    return fail("ID de pedido inválido.", 400);
  }

  try {
    const order = await getAdminOrderById(id);
    if (!order) {
      return fail("Pedido no encontrado.", 404);
    }
    return ok({ order });
  } catch (error) {
    return handleRepositoryError(error);
  }
}
