import { ok } from "@/lib/api-response";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { isBlobConfigured } from "@/lib/blob";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";
import { listAdminImages } from "@/lib/services/admin-images";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : undefined;

  try {
    const images = await listAdminImages(limit);
    return ok({
      images,
      blobConfigured: isBlobConfigured(),
    });
  } catch (error) {
    return handleRepositoryError(error);
  }
}
