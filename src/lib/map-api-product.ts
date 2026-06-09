import type { Product } from "@/lib/data/products";
import { formatCurrency, parseCartPrice } from "@/lib/cart-utils";

export type ApiPublicProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string | null;
  price: string | null;
  imageUrl?: string | null;
  badge?: string | null;
  featured?: boolean;
};

export function mapApiProductToCard(product: ApiPublicProduct): Product {
  const priceNum = parseCartPrice(product.price);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description || product.shortDescription || "",
    price: formatCurrency(priceNum),
    image: product.imageUrl || `/rusty/products/${product.slug}.svg`,
    badge: product.badge === "TOP" || product.badge === "PROMO" ? product.badge : undefined,
  };
}
