import type { Category, Product, Promo } from "@prisma/client";
import { decimalToNumber } from "@/lib/price";

type ProductWithCategory = Product & {
  category: Pick<Category, "id" | "name" | "slug"> | null;
};

type CategoryWithCount = Category & {
  _count: { products: number };
};

function parseTags(tags: Product["tags"]): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.filter((t): t is string => typeof t === "string");
  }
  return [];
}

export function serializeAdminProduct(product: ProductWithCategory) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    price: decimalToNumber(product.price) ?? 0,
    compareAtPrice: decimalToNumber(product.compareAtPrice),
    imageUrl: product.imageUrl,
    badge: product.badge,
    active: product.active,
    available: product.available,
    featured: product.featured,
    sortOrder: product.sortOrder,
    ingredients: product.ingredients,
    allergens: product.allergens,
    tags: parseTags(product.tags),
    categoryId: product.categoryId,
    category: product.category
      ? { id: product.category.id, name: product.category.name, slug: product.category.slug }
      : null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function serializeAdminProductListItem(product: ProductWithCategory) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: decimalToNumber(product.price) ?? 0,
    imageUrl: product.imageUrl,
    active: product.active,
    available: product.available,
    featured: product.featured,
    sortOrder: product.sortOrder,
    categoryId: product.categoryId,
    categoryName: product.category?.name ?? null,
  };
}

export function serializeAdminCategory(category: CategoryWithCount) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.imageUrl,
    active: category.active,
    sortOrder: category.sortOrder,
    productCount: category._count.products,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

export function serializeAdminPromo(promo: Promo) {
  return {
    id: promo.id,
    title: promo.title,
    slug: promo.slug,
    tagline: promo.tagline,
    description: promo.description,
    price: decimalToNumber(promo.price),
    imageUrl: promo.imageUrl,
    active: promo.active,
    startsAt: promo.startsAt?.toISOString() ?? null,
    endsAt: promo.endsAt?.toISOString() ?? null,
    sortOrder: promo.sortOrder,
    createdAt: promo.createdAt.toISOString(),
    updatedAt: promo.updatedAt.toISOString(),
  };
}
