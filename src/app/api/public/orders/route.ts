import { Prisma } from "@prisma/client";
import { ok, fail } from "@/lib/api-response";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";
import { validateCreateOrderBody, type CreateOrderBody } from "@/lib/orders/order-validation";
import { createPublicOrder } from "@/lib/services/orders";

const ORDER_CREATE_ERROR =
  "No se pudo crear el pedido. Revisá la conexión con la base de datos o intentá nuevamente.";

function logOrderCreateError(error: unknown, stage: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error("[orders:create]", { stage, code: error.code, meta: error.meta });
    return;
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error("[orders:create]", { stage, code: "INIT", message: error.message });
    return;
  }
  console.error(
    "[orders:create]",
    stage,
    error instanceof Error ? error.message : error
  );
}

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
    logOrderCreateError(error, "createPublicOrder");

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return fail(ORDER_CREATE_ERROR, 500, { code: error.code });
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return fail(ORDER_CREATE_ERROR, 503);
    }

    return handleRepositoryError(error);
  }
}
