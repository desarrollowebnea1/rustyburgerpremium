import type { Prisma } from "@prisma/client";
import { PUBLIC_SETTING_KEYS, type PublicSettingKey } from "@/lib/repositories/public-data";
import { prisma } from "@/lib/prisma";

export type AdminSettingsMap = Partial<Record<PublicSettingKey, Prisma.JsonValue>>;

export async function getAdminSettings(): Promise<AdminSettingsMap> {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: [...PUBLIC_SETTING_KEYS] } },
  });

  const map: AdminSettingsMap = {};
  for (const row of rows) {
    if (PUBLIC_SETTING_KEYS.includes(row.key as PublicSettingKey)) {
      map[row.key as PublicSettingKey] = row.value;
    }
  }
  return map;
}

export async function updateAdminSettings(
  patch: Partial<Record<PublicSettingKey, Prisma.InputJsonValue>>
): Promise<AdminSettingsMap> {
  const entries = Object.entries(patch).filter(
    ([key, value]) =>
      PUBLIC_SETTING_KEYS.includes(key as PublicSettingKey) && value !== undefined
  ) as [PublicSettingKey, Prisma.InputJsonValue][];

  for (const [key, value] of entries) {
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  return getAdminSettings();
}
