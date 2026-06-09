import { getActivePromos } from "@/lib/repositories/public-data";
import { ok } from "@/lib/api-response";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";
import { serializePromo } from "@/lib/serialize-public";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  try {
    const promos = await getActivePromos();
    return ok(promos.map(serializePromo));
  } catch (error) {
    return handleRepositoryError(error);
  }
}
