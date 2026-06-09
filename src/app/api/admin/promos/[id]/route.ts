import { ok, fail } from "@/lib/api-response";
import { requireAdminSession } from "@/lib/admin/require-admin";
import {
  parseBooleanField,
  parseDateField,
  parseIntField,
  parseOptionalPrice,
  parseOptionalString,
  parseRequiredString,
  parseSlugField,
} from "@/lib/admin/parse-body";
import { handleAdminWriteError } from "@/lib/admin/write-errors";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";
import { deleteAdminPromo, getAdminPromoById, updateAdminPromo } from "@/lib/services/admin-promos";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) return databaseUnavailableResponse();

  const { id } = await context.params;

  try {
    const promo = await getAdminPromoById(id);
    if (!promo) return fail("Promoción no encontrada.", 404);
    return ok({ promo });
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

  const input: Parameters<typeof updateAdminPromo>[1] = {};

  if (body.title !== undefined) {
    const title = parseRequiredString(body.title, "Título");
    if (typeof title !== "string") return fail(title.error, 400);
    input.title = title;
  }

  if (body.slug !== undefined) {
    const slug = parseSlugField(body.slug);
    if (typeof slug !== "string") return fail(slug.error, 400);
    input.slug = slug;
  }

  if (body.price !== undefined) {
    const price = parseOptionalPrice(body.price);
    if (price === null && body.price != null && body.price !== "") {
      return fail("Precio inválido.", 400);
    }
    input.price = price ?? null;
  }

  if (body.tagline !== undefined) input.tagline = parseOptionalString(body.tagline) ?? null;
  if (body.description !== undefined) input.description = parseOptionalString(body.description) ?? null;
  if (body.imageUrl !== undefined) input.imageUrl = parseOptionalString(body.imageUrl) ?? null;
  if (body.active !== undefined) {
    const active = parseBooleanField(body.active);
    if (active === undefined) return fail("Valor de activa inválido.", 400);
    input.active = active;
  }
  if (body.startsAt !== undefined) input.startsAt = parseDateField(body.startsAt) ?? null;
  if (body.endsAt !== undefined) input.endsAt = parseDateField(body.endsAt) ?? null;
  if (body.sortOrder !== undefined) {
    const sortOrder = parseIntField(body.sortOrder);
    if (sortOrder === undefined) return fail("Orden inválido.", 400);
    input.sortOrder = sortOrder;
  }

  try {
    const promo = await updateAdminPromo(id, input);
    return ok({ promo });
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
    await deleteAdminPromo(id);
    return ok({ deleted: true });
  } catch (error) {
    return handleAdminWriteError(error);
  }
}
