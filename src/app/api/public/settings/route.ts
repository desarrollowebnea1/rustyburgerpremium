import { getPublicSiteSettings } from "@/lib/repositories/public-data";
import { ok } from "@/lib/api-response";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  try {
    const settings = await getPublicSiteSettings();
    return ok(settings);
  } catch (error) {
    return handleRepositoryError(error);
  }
}
