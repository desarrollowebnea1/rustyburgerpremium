import type { Prisma } from "@prisma/client";
import { ok, fail } from "@/lib/api-response";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { handleAdminWriteError } from "@/lib/admin/write-errors";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";
import { PUBLIC_SETTING_KEYS, type PublicSettingKey } from "@/lib/repositories/public-data";
import { getAdminSettings, updateAdminSettings } from "@/lib/services/admin-settings";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function parseNumberField(value: unknown, field: string): number | { error: string } | undefined {
  if (value === undefined) return undefined;
  const n = typeof value === "number" ? value : parseFloat(String(value));
  if (!Number.isFinite(n) || n < 0) return { error: `${field} inválido.` };
  return n;
}

function parseBooleanSetting(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function parseStringSetting(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  return String(value);
}

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) return databaseUnavailableResponse();

  try {
    const settings = await getAdminSettings();
    return ok({ settings });
  } catch (error) {
    return handleRepositoryError(error);
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) return databaseUnavailableResponse();

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return fail("JSON inválido.", 400);
  }

  const patch: Partial<Record<PublicSettingKey, Prisma.InputJsonValue>> = {};

  const stringKeys: PublicSettingKey[] = [
    "businessName",
    "phone",
    "whatsappNumber",
    "instagram",
    "address",
    "hours",
    "topMessage",
    "ifoodUrl",
    "seoTitle",
    "seoDescription",
  ];

  for (const key of stringKeys) {
    if (key in body) {
      const val = parseStringSetting(body[key]);
      if (val !== undefined) patch[key] = val;
    }
  }

  if ("deliveryActive" in body) {
    const v = parseBooleanSetting(body.deliveryActive);
    if (v === undefined) return fail("deliveryActive inválido.", 400);
    patch.deliveryActive = v;
  }

  if ("takeawayActive" in body) {
    const v = parseBooleanSetting(body.takeawayActive);
    if (v === undefined) return fail("takeawayActive inválido.", 400);
    patch.takeawayActive = v;
  }

  if ("deliveryFee" in body) {
    const v = parseNumberField(body.deliveryFee, "Costo de delivery");
    if (v && typeof v === "object") return fail(v.error, 400);
    if (v !== undefined) patch.deliveryFee = v;
  }

  if ("minimumOrder" in body) {
    const v = parseNumberField(body.minimumOrder, "Pedido mínimo");
    if (v && typeof v === "object") return fail(v.error, 400);
    if (v !== undefined) patch.minimumOrder = v;
  }

  const unknownKeys = Object.keys(body).filter(
    (k) => !PUBLIC_SETTING_KEYS.includes(k as PublicSettingKey)
  );
  if (unknownKeys.length > 0) {
    return fail(`Campos no reconocidos: ${unknownKeys.join(", ")}`, 400);
  }

  if (Object.keys(patch).length === 0) {
    return fail("No hay cambios para guardar.", 400);
  }

  try {
    const settings = await updateAdminSettings(patch);
    return ok({ settings });
  } catch (error) {
    return handleAdminWriteError(error);
  }
}
