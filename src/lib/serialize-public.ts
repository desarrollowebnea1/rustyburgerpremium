import type { Category, Product, Promo } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

type ProductWithCategory = Product & {
  category: Pick<Category, "id" | "name" | "slug"> | null;
};

function decimalToString(value: Decimal | null | undefined): string | null {
  if (value == null) return null;
  return value.toString();
}

export function serializeCategory(category: Category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.imageUrl,
    sortOrder: category.sortOrder,
  };
}

export function serializeProduct(product: ProductWithCategory) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    price: decimalToString(product.price),
    compareAtPrice: decimalToString(product.compareAtPrice),
    imageUrl: product.imageUrl,
    badge: product.badge,
    featured: product.featured,
    sortOrder: product.sortOrder,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        }
      : null,
  };
}

export function serializePromo(promo: Promo) {
  return {
    id: promo.id,
    title: promo.title,
    slug: promo.slug,
    tagline: promo.tagline,
    description: promo.description,
    price: decimalToString(promo.price),
    imageUrl: promo.imageUrl,
    sortOrder: promo.sortOrder,
    startsAt: promo.startsAt?.toISOString() ?? null,
    endsAt: promo.endsAt?.toISOString() ?? null,
  };
}
