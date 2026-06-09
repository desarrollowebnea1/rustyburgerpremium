import { ok, fail } from "@/lib/api-response";
import { requireAdminSession } from "@/lib/admin/require-admin";
import {
  parseBooleanField,
  parseIntField,
  parseOptionalString,
  parseRequiredString,
  parseSlugField,
} from "@/lib/admin/parse-body";
import { handleAdminWriteError } from "@/lib/admin/write-errors";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";
import {
  CategoryHasProductsError,
  deleteAdminCategory,
  getAdminCategoryById,
  updateAdminCategory,
} from "@/lib/services/admin-categories";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) return databaseUnavailableResponse();

  const { id } = await context.params;

  try {
    const category = await getAdminCategoryById(id);
    if (!category) return fail("Categoría no encontrada.", 404);
    return ok({ category });
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

  const input: Parameters<typeof updateAdminCategory>[1] = {};

  if (body.name !== undefined) {
    const name = parseRequiredString(body.name, "Nombre");
    if (typeof name !== "string") return fail(name.error, 400);
    input.name = name;
  }

  if (body.slug !== undefined) {
    const slug = parseSlugField(body.slug);
    if (typeof slug !== "string") return fail(slug.error, 400);
    input.slug = slug;
  }

  if (body.description !== undefined) input.description = parseOptionalString(body.description) ?? null;
  if (body.imageUrl !== undefined) input.imageUrl = parseOptionalString(body.imageUrl) ?? null;
  if (body.active !== undefined) {
    const active = parseBooleanField(body.active);
    if (active === undefined) return fail("Valor de activa inválido.", 400);
    input.active = active;
  }
  if (body.sortOrder !== undefined) {
    const sortOrder = parseIntField(body.sortOrder);
    if (sortOrder === undefined) return fail("Orden inválido.", 400);
    input.sortOrder = sortOrder;
  }

  try {
    const category = await updateAdminCategory(id, input);
    return ok({ category });
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
    await deleteAdminCategory(id);
    return ok({ deleted: true });
  } catch (error) {
    if (error instanceof CategoryHasProductsError) {
      return fail(
        `No se puede eliminar: tiene ${error.productCount} producto(s) vinculado(s). Desactivá la categoría o reasigná los productos.`,
        409
      );
    }
    return handleAdminWriteError(error);
  }
}
