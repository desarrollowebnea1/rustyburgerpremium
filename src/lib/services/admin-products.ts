import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  serializeAdminProduct,
  serializeAdminProductListItem,
} from "@/lib/admin/serialize-admin";

export type AdminProductFilters = {
  q?: string;
  categoryId?: string;
  active?: boolean;
  available?: boolean;
  featured?: boolean;
};

export type AdminProductInput = {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  price: Prisma.Decimal;
  compareAtPrice?: Prisma.Decimal | null;
  imageUrl?: string | null;
  badge?: string | null;
  categoryId?: string | null;
  active?: boolean;
  available?: boolean;
  featured?: boolean;
  sortOrder?: number;
  ingredients?: string | null;
  allergens?: string | null;
  tags?: string[];
};

const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
} as const;

export async function listAdminProducts(filters: AdminProductFilters = {}) {
  const where: Prisma.ProductWhereInput = {};

  if (filters.q?.trim()) {
    const q = filters.q.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ];
  }

  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.active !== undefined) where.active = filters.active;
  if (filters.available !== undefined) where.available = filters.available;
  if (filters.featured !== undefined) where.featured = filters.featured;

  const products = await prisma.product.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: productInclude,
  });

  return products.map(serializeAdminProductListItem);
}

export async function getAdminProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
  if (!product) return null;
  return serializeAdminProduct(product);
}

export async function createAdminProduct(input: AdminProductInput) {
  const product = await prisma.product.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description,
      shortDescription: input.shortDescription ?? null,
      price: input.price,
      compareAtPrice: input.compareAtPrice ?? null,
      imageUrl: input.imageUrl ?? null,
      badge: input.badge ?? null,
      categoryId: input.categoryId ?? null,
      active: input.active ?? true,
      available: input.available ?? true,
      featured: input.featured ?? false,
      sortOrder: input.sortOrder ?? 0,
      ingredients: input.ingredients ?? null,
      allergens: input.allergens ?? null,
      tags: input.tags?.length ? input.tags : undefined,
    },
    include: productInclude,
  });

  return serializeAdminProduct(product);
}

export async function updateAdminProduct(id: string, input: Partial<AdminProductInput>) {
  const data: Prisma.ProductUpdateInput = {};

  if (input.name !== undefined) data.name = input.name;
  if (input.slug !== undefined) data.slug = input.slug;
  if (input.description !== undefined) data.description = input.description;
  if (input.shortDescription !== undefined) data.shortDescription = input.shortDescription;
  if (input.price !== undefined) data.price = input.price;
  if (input.compareAtPrice !== undefined) data.compareAtPrice = input.compareAtPrice;
  if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl;
  if (input.badge !== undefined) data.badge = input.badge;
  if (input.categoryId !== undefined) {
    data.category = input.categoryId
      ? { connect: { id: input.categoryId } }
      : { disconnect: true };
  }
  if (input.active !== undefined) data.active = input.active;
  if (input.available !== undefined) data.available = input.available;
  if (input.featured !== undefined) data.featured = input.featured;
  if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;
  if (input.ingredients !== undefined) data.ingredients = input.ingredients;
  if (input.allergens !== undefined) data.allergens = input.allergens;
  if (input.tags !== undefined) data.tags = input.tags;

  const product = await prisma.product.update({
    where: { id },
    data,
    include: productInclude,
  });

  return serializeAdminProduct(product);
}

export async function deleteAdminProduct(id: string) {
  await prisma.product.delete({ where: { id } });
}
