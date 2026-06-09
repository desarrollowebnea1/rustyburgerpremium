import { ok, fail } from "@/lib/api-response";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { handleAdminWriteError } from "@/lib/admin/write-errors";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";
import {
  ImageInUseError,
  deleteAdminImage,
  getAdminImageById,
  updateImageAsset,
} from "@/lib/services/admin-images";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) return databaseUnavailableResponse();

  const { id } = await context.params;

  try {
    const image = await getAdminImageById(id);
    if (!image) return fail("Imagen no encontrada.", 404);
    return ok({ image });
  } catch (error) {
    return handleRepositoryError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) return databaseUnavailableResponse();

  const { id } = await context.params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return fail("JSON inválido.", 400);
  }

  const input: { alt?: string | null; type?: string | null } = {};

  if ("alt" in body) {
    input.alt =
      body.alt === null || body.alt === undefined
        ? null
        : String(body.alt).trim() || null;
  }
  if ("type" in body) {
    input.type =
      body.type === null || body.type === undefined
        ? null
        : String(body.type).trim() || null;
  }

  if (Object.keys(input).length === 0) {
    return fail("No hay cambios para guardar.", 400);
  }

  try {
    const image = await updateImageAsset(id, input);
    return ok({ image });
  } catch (error) {
    return handleAdminWriteError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) return databaseUnavailableResponse();

  const { id } = await context.params;

  try {
    const result = await deleteAdminImage(id);
    if (!result) return fail("Imagen no encontrada.", 404);

    return ok({
      deleted: true,
      blobDeleted: result.blobDeleted,
      message: result.blobDeleted
        ? "Imagen eliminada de la biblioteca y del almacenamiento."
        : "Imagen eliminada de la biblioteca. No se pudo confirmar eliminación en Blob.",
    });
  } catch (error) {
    if (error instanceof ImageInUseError) {
      return fail("La imagen está en uso por un producto, categoría o promoción.", 409);
    }
    return handleAdminWriteError(error);
  }
}
