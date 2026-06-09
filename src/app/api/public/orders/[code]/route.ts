import { ok, fail } from "@/lib/api-response";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";
import { getPublicOrderByCode } from "@/lib/services/orders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: { code: string };
};

export async function GET(_request: Request, context: RouteContext) {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const code = context.params.code?.trim();
  if (!code) {
    return fail("Código de pedido inválido.", 400);
  }

  try {
    const order = await getPublicOrderByCode(code);
    if (!order) {
      return fail("No encontramos un pedido con ese código.", 404);
    }

    return ok(order);
  } catch (error) {
    return handleRepositoryError(error);
  }
}
