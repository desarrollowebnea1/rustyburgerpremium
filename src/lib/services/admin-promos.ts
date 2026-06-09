import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { serializeAdminPromo } from "@/lib/admin/serialize-admin";

export type AdminPromoInput = {
  title: string;
  slug: string;
  tagline?: string | null;
  description?: string | null;
  price?: Prisma.Decimal | null;
  imageUrl?: string | null;
  active?: boolean;
  startsAt?: Date | null;
  endsAt?: Date | null;
  sortOrder?: number;
};

export async function listAdminPromos() {
  const promos = await prisma.promo.findMany({
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
  return promos.map(serializeAdminPromo);
}

export async function getAdminPromoById(id: string) {
  const promo = await prisma.promo.findUnique({ where: { id } });
  if (!promo) return null;
  return serializeAdminPromo(promo);
}

export async function createAdminPromo(input: AdminPromoInput) {
  const promo = await prisma.promo.create({
    data: {
      title: input.title,
      slug: input.slug,
      tagline: input.tagline ?? null,
      description: input.description ?? null,
      price: input.price ?? null,
      imageUrl: input.imageUrl ?? null,
      active: input.active ?? true,
      startsAt: input.startsAt ?? null,
      endsAt: input.endsAt ?? null,
      sortOrder: input.sortOrder ?? 0,
    },
  });
  return serializeAdminPromo(promo);
}

export async function updateAdminPromo(id: string, input: Partial<AdminPromoInput>) {
  const data: Prisma.PromoUpdateInput = {};

  if (input.title !== undefined) data.title = input.title;
  if (input.slug !== undefined) data.slug = input.slug;
  if (input.tagline !== undefined) data.tagline = input.tagline;
  if (input.description !== undefined) data.description = input.description;
  if (input.price !== undefined) data.price = input.price;
  if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl;
  if (input.active !== undefined) data.active = input.active;
  if (input.startsAt !== undefined) data.startsAt = input.startsAt;
  if (input.endsAt !== undefined) data.endsAt = input.endsAt;
  if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;

  const promo = await prisma.promo.update({ where: { id }, data });
  return serializeAdminPromo(promo);
}

export async function deleteAdminPromo(id: string) {
  await prisma.promo.delete({ where: { id } });
}
