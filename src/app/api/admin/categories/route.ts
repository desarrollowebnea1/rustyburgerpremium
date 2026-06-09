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
import { createAdminCategory, listAdminCategories } from "@/lib/services/admin-categories";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) return databaseUnavailableResponse();

  try {
    const categories = await listAdminCategories();
    return ok({ categories });
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

  try {
    const category = await createAdminCategory({
      name,
      slug,
      description: parseOptionalString(body.description) ?? null,
      imageUrl: parseOptionalString(body.imageUrl) ?? null,
      active: parseBooleanField(body.active) ?? true,
      sortOrder: parseIntField(body.sortOrder, 0) ?? 0,
    });
    return ok({ category }, { status: 201 });
  } catch (error) {
    return handleAdminWriteError(error);
  }
}
