import { ok, fail } from "@/lib/api-response";
import { requireAdminSession } from "@/lib/admin/require-admin";
import {
  parseBooleanField,
  parseIntField,
  parseOptionalPrice,
  parseOptionalString,
  parsePrice,
  parseRequiredString,
  parseSlugField,
  parseTagsField,
} from "@/lib/admin/parse-body";
import { handleAdminWriteError } from "@/lib/admin/write-errors";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";
import {
  deleteAdminProduct,
  getAdminProductById,
  updateAdminProduct,
} from "@/lib/services/admin-products";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) return databaseUnavailableResponse();

  const { id } = await context.params;

  try {
    const product = await getAdminProductById(id);
    if (!product) return fail("Producto no encontrado.", 404);
    return ok({ product });
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

  const input: Parameters<typeof updateAdminProduct>[1] = {};

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

  if (body.description !== undefined) {
    const description = parseRequiredString(body.description, "Descripción");
    if (typeof description !== "string") return fail(description.error, 400);
    input.description = description;
  }

  if (body.price !== undefined) {
    const price = parsePrice(body.price as string | number);
    if (!price) return fail("Precio inválido.", 400);
    input.price = price;
  }

  if (body.compareAtPrice !== undefined) {
    const compareAtPrice = parseOptionalPrice(body.compareAtPrice);
    if (compareAtPrice === null && body.compareAtPrice != null && body.compareAtPrice !== "") {
      return fail("Precio comparativo inválido.", 400);
    }
    input.compareAtPrice = compareAtPrice ?? null;
  }

  if (body.shortDescription !== undefined) input.shortDescription = parseOptionalString(body.shortDescription) ?? null;
  if (body.imageUrl !== undefined) input.imageUrl = parseOptionalString(body.imageUrl) ?? null;
  if (body.badge !== undefined) input.badge = parseOptionalString(body.badge) ?? null;
  if (body.categoryId !== undefined) input.categoryId = parseOptionalString(body.categoryId) ?? null;
  if (body.active !== undefined) {
    const active = parseBooleanField(body.active);
    if (active === undefined) return fail("Valor de activo inválido.", 400);
    input.active = active;
  }
  if (body.available !== undefined) {
    const available = parseBooleanField(body.available);
    if (available === undefined) return fail("Valor de disponible inválido.", 400);
    input.available = available;
  }
  if (body.featured !== undefined) {
    const featured = parseBooleanField(body.featured);
    if (featured === undefined) return fail("Valor de destacado inválido.", 400);
    input.featured = featured;
  }
  if (body.sortOrder !== undefined) {
    const sortOrder = parseIntField(body.sortOrder);
    if (sortOrder === undefined) return fail("Orden inválido.", 400);
    input.sortOrder = sortOrder;
  }
  if (body.ingredients !== undefined) input.ingredients = parseOptionalString(body.ingredients) ?? null;
  if (body.allergens !== undefined) input.allergens = parseOptionalString(body.allergens) ?? null;
  if (body.tags !== undefined) input.tags = parseTagsField(body.tags) ?? [];

  try {
    const product = await updateAdminProduct(id, input);
    return ok({ product });
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
    await deleteAdminProduct(id);
    return ok({ deleted: true });
  } catch (error) {
    return handleAdminWriteError(error);
  }
}
