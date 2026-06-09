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
import { createAdminProduct, listAdminProducts } from "@/lib/services/admin-products";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) return databaseUnavailableResponse();

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const categoryId = searchParams.get("categoryId") ?? undefined;

  const activeParam = searchParams.get("active");
  const availableParam = searchParams.get("available");
  const featuredParam = searchParams.get("featured");

  const active =
    activeParam === null ? undefined : activeParam === "true" ? true : activeParam === "false" ? false : undefined;
  const available =
    availableParam === null
      ? undefined
      : availableParam === "true"
        ? true
        : availableParam === "false"
          ? false
          : undefined;
  const featured =
    featuredParam === null
      ? undefined
      : featuredParam === "true"
        ? true
        : featuredParam === "false"
          ? false
          : undefined;

  try {
    const products = await listAdminProducts({ q, categoryId, active, available, featured });
    return ok({ products });
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

  const name = parseRequiredString(body.name, "Nombre");
  if (typeof name !== "string") return fail(name.error, 400);

  const slug = parseSlugField(body.slug, name);
  if (typeof slug !== "string") return fail(slug.error, 400);

  const description = parseRequiredString(body.description, "Descripción");
  if (typeof description !== "string") return fail(description.error, 400);

  const price = parsePrice(body.price as string | number);
  if (!price) return fail("Precio inválido.", 400);

  const compareAtPrice = parseOptionalPrice(body.compareAtPrice);
  if (compareAtPrice === null && body.compareAtPrice != null && body.compareAtPrice !== "") {
    return fail("Precio comparativo inválido.", 400);
  }

  try {
    const product = await createAdminProduct({
      name,
      slug,
      description,
      shortDescription: parseOptionalString(body.shortDescription) ?? null,
      price,
      compareAtPrice: compareAtPrice ?? null,
      imageUrl: parseOptionalString(body.imageUrl) ?? null,
      badge: parseOptionalString(body.badge) ?? null,
      categoryId: parseOptionalString(body.categoryId) ?? null,
      active: parseBooleanField(body.active) ?? true,
      available: parseBooleanField(body.available) ?? true,
      featured: parseBooleanField(body.featured) ?? false,
      sortOrder: parseIntField(body.sortOrder, 0) ?? 0,
      ingredients: parseOptionalString(body.ingredients) ?? null,
      allergens: parseOptionalString(body.allergens) ?? null,
      tags: parseTagsField(body.tags) ?? [],
    });
    return ok({ product }, { status: 201 });
  } catch (error) {
    return handleAdminWriteError(error);
  }
}
