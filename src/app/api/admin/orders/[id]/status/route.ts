import { Prisma, type OrderStatus } from "@prisma/client";
import { ok, fail } from "@/lib/api-response";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";
import { updateAdminOrderStatus } from "@/lib/services/admin-orders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: { id: string } };

const VALID_STATUSES = new Set<OrderStatus>([
  "RECEIVED",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
]);

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const id = context.params.id?.trim();
  if (!id) {
    return fail("ID de pedido inválido.", 400);
  }

  let body: { status?: string };
  try {
    body = (await request.json()) as { status?: string };
  } catch {
    return fail("El cuerpo de la solicitud debe ser JSON válido.", 400);
  }

  const status = body.status as OrderStatus;
  if (!status || !VALID_STATUSES.has(status)) {
    return fail("Estado de pedido inválido.", 400);
  }

  try {
    const order = await updateAdminOrderStatus(id, status);
    return ok({ order });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return fail("Pedido no encontrado.", 404);
    }
    return handleRepositoryError(error);
  }
}
