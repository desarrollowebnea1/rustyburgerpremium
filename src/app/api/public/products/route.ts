import { getActiveProductsFiltered } from "@/lib/repositories/public-data";
import { ok } from "@/lib/api-response";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";
import { serializeProduct } from "@/lib/serialize-public";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured") === "true";
  const category = searchParams.get("category") ?? undefined;
  const q = searchParams.get("q") ?? undefined;

  try {
    const products = await getActiveProductsFiltered({
      featured: featured || undefined,
      categorySlug: category,
      q,
    });

    return ok(products.map(serializeProduct));
  } catch (error) {
    return handleRepositoryError(error);
  }
}
