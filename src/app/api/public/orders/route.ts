import { ok, fail } from "@/lib/api-response";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";
import { validateCreateOrderBody, type CreateOrderBody } from "@/lib/orders/order-validation";
import { createPublicOrder } from "@/lib/services/orders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  let body: CreateOrderBody;
  try {
    body = (await request.json()) as CreateOrderBody;
  } catch {
    return fail("El cuerpo de la solicitud debe ser JSON válido.", 400);
  }

  const validation = validateCreateOrderBody(body);
  if (!validation.ok) {
    return fail(validation.error, 400);
  }

  try {
    const result = await createPublicOrder(validation.data);
    return ok({
      code: result.code,
      orderId: result.orderId,
      status: result.status,
      total: result.total,
    });
  } catch (error) {
    return handleRepositoryError(error);
  }
}
