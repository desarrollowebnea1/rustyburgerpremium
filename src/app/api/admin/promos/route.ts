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
import { createAdminPromo, listAdminPromos } from "@/lib/services/admin-promos";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) return databaseUnavailableResponse();

  try {
    const promos = await listAdminPromos();
    return ok({ promos });
  } catch (error) {
    return handleRepositoryError(error);
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) return databaseUnavailableResponse();

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return fail("JSON inválido.", 400);
  }

  const title = parseRequiredString(body.title, "Título");
  if (typeof title !== "string") return fail(title.error, 400);

  const slug = parseSlugField(body.slug, title);
  if (typeof slug !== "string") return fail(slug.error, 400);

  const price = parseOptionalPrice(body.price);
  if (price === null && body.price != null && body.price !== "") {
    return fail("Precio inválido.", 400);
  }

  try {
    const promo = await createAdminPromo({
      title,
      slug,
      tagline: parseOptionalString(body.tagline) ?? null,
      description: parseOptionalString(body.description) ?? null,
      price: price ?? null,
      imageUrl: parseOptionalString(body.imageUrl) ?? null,
      active: parseBooleanField(body.active) ?? true,
      startsAt: parseDateField(body.startsAt) ?? null,
      endsAt: parseDateField(body.endsAt) ?? null,
      sortOrder: parseIntField(body.sortOrder, 0) ?? 0,
    });
    return ok({ promo }, { status: 201 });
  } catch (error) {
    return handleAdminWriteError(error);
  }
}
