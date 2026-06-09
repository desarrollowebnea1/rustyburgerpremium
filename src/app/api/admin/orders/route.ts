import type { OrderStatus } from "@prisma/client";
import { ok, fail } from "@/lib/api-response";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";
import { listAdminOrders } from "@/lib/services/admin-orders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_STATUSES = new Set<OrderStatus>([
  "RECEIVED",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
]);

export async function GET(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const limitParam = searchParams.get("limit");

  let status: OrderStatus | undefined;
  if (statusParam) {
    if (!VALID_STATUSES.has(statusParam as OrderStatus)) {
      return fail("Estado de pedido inválido.", 400);
    }
    status = statusParam as OrderStatus;
  }

  const limit = limitParam ? Number(limitParam) : undefined;

  try {
    const orders = await listAdminOrders({ status, limit });
    return ok({ orders });
  } catch (error) {
    return handleRepositoryError(error);
  }
}
