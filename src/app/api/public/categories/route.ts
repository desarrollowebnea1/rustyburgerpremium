import { getActiveCategories } from "@/lib/repositories/public-data";
import { ok } from "@/lib/api-response";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";
import { serializeCategory } from "@/lib/serialize-public";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  try {
    const categories = await getActiveCategories();
    return ok(categories.map(serializeCategory));
  } catch (error) {
    return handleRepositoryError(error);
  }
}
