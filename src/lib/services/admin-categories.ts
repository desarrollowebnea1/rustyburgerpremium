import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { serializeAdminCategory } from "@/lib/admin/serialize-admin";

export type AdminCategoryInput = {
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  active?: boolean;
  sortOrder?: number;
};

export class CategoryHasProductsError extends Error {
  productCount: number;
  constructor(count: number) {
    super("CATEGORY_HAS_PRODUCTS");
    this.productCount = count;
  }
}

export async function listAdminCategories() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return categories.map(serializeAdminCategory);
}

export async function getAdminCategoryById(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
  if (!category) return null;
  return serializeAdminCategory(category);
}

export async function createAdminCategory(input: AdminCategoryInput) {
  const category = await prisma.category.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      imageUrl: input.imageUrl ?? null,
      active: input.active ?? true,
      sortOrder: input.sortOrder ?? 0,
    },
    include: { _count: { select: { products: true } } },
  });

  return serializeAdminCategory(category);
}

export async function updateAdminCategory(id: string, input: Partial<AdminCategoryInput>) {
  const data: Prisma.CategoryUpdateInput = {};

  if (input.name !== undefined) data.name = input.name;
  if (input.slug !== undefined) data.slug = input.slug;
  if (input.description !== undefined) data.description = input.description;
  if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl;
  if (input.active !== undefined) data.active = input.active;
  if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;

  const category = await prisma.category.update({
    where: { id },
    data,
    include: { _count: { select: { products: true } } },
  });

  return serializeAdminCategory(category);
}

export async function deleteAdminCategory(id: string) {
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    throw new CategoryHasProductsError(count);
  }
  await prisma.category.delete({ where: { id } });
}
