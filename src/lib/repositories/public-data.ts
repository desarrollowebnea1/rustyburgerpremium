import type { Category, Prisma, Product, Promo, SiteSetting } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type SiteSettingsMap = Record<string, Prisma.JsonValue>;

export type ProductListFilters = {
  featured?: boolean;
  categorySlug?: string;
  q?: string;
};

export const PUBLIC_SETTING_KEYS = [
  "businessName",
  "phone",
  "whatsappNumber",
  "instagram",
  "address",
  "hours",
  "deliveryActive",
  "takeawayActive",
  "deliveryFee",
  "minimumOrder",
  "topMessage",
  "ifoodUrl",
  "seoTitle",
  "seoDescription",
] as const;

export type PublicSettingKey = (typeof PUBLIC_SETTING_KEYS)[number];

function settingsToMap(rows: SiteSetting[]): SiteSettingsMap {
  return rows.reduce<SiteSettingsMap>((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}

export async function getActiveCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getActiveProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    where: { active: true, available: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getActiveProductsFiltered(filters: ProductListFilters = {}) {
  const where: Prisma.ProductWhereInput = {
    active: true,
    available: true,
  };

  if (filters.featured) {
    where.featured = true;
  }

  if (filters.categorySlug) {
    where.category = {
      slug: filters.categorySlug,
      active: true,
    };
  }

  if (filters.q?.trim()) {
    const q = filters.q.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { shortDescription: { contains: q, mode: "insensitive" } },
    ];
  }

  return prisma.product.findMany({
    where,
    orderBy: { sortOrder: "asc" },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  });
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    where: { active: true, available: true, featured: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getActivePromos(): Promise<Promo[]> {
  const now = new Date();

  return prisma.promo.findMany({
    where: {
      active: true,
      OR: [
        { startsAt: null, endsAt: null },
        { startsAt: { lte: now }, endsAt: null },
        { startsAt: null, endsAt: { gte: now } },
        { startsAt: { lte: now }, endsAt: { gte: now } },
      ],
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  const rows = await prisma.siteSetting.findMany({
    orderBy: { key: "asc" },
  });

  return settingsToMap(rows);
}

export async function getPublicSiteSettings(): Promise<Partial<Record<PublicSettingKey, Prisma.JsonValue>>> {
  const all = await getSiteSettings();
  const result: Partial<Record<PublicSettingKey, Prisma.JsonValue>> = {};

  for (const key of PUBLIC_SETTING_KEYS) {
    if (key in all) {
      result[key] = all[key];
    }
  }

  return result;
}
