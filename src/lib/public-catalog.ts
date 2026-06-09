import {
  formatCurrency,
  parseCartPrice,
  type CartProductInput,
  featuredProductToCartInput,
} from "@/lib/cart-utils";
import { ASSETS } from "@/lib/constants";
import { FEATURED_PRODUCTS } from "@/lib/data/products";
import { RUSTY_PROMOS } from "@/lib/data/promos";

export type HomePanelProduct = {
  id: string;
  slug: string;
  name: string;
  price: string | number;
  priceLabel: string;
  image: string;
  badge?: string;
};

export type HomePanelPromo = {
  id: string;
  slug: string;
  number: number;
  name: string;
  tagline: string;
  description: string;
  price: string;
  priceRaw: string | number;
  image: string;
};

type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  price: string | null;
  imageUrl: string | null;
  badge: string | null;
};

type ApiPromo = {
  id: string;
  title: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  price: string | null;
  imageUrl: string | null;
};

function productImage(imageUrl: string | null, slug: string): string {
  if (imageUrl?.trim()) return imageUrl;
  return ASSETS.products(slug);
}

function promoImage(imageUrl: string | null): string {
  if (imageUrl?.trim()) return imageUrl;
  return "/rusty/promos/promo-1.svg";
}

export function mapApiProduct(product: ApiProduct): HomePanelProduct {
  const price = product.price ?? "0";
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price,
    priceLabel: formatCurrency(parseCartPrice(price)),
    image: productImage(product.imageUrl, product.slug),
    badge: product.badge ?? undefined,
  };
}

export function mapApiPromos(promos: ApiPromo[]): HomePanelPromo[] {
  return promos.map((promo, index) => {
    const priceRaw = promo.price ?? "0";
    return {
      id: promo.id,
      slug: promo.slug,
      number: index + 1,
      name: promo.title,
      tagline: promo.tagline ?? "",
      description: promo.description ?? promo.tagline ?? "",
      price: promo.price ? formatCurrency(parseCartPrice(promo.price)) : "",
      priceRaw,
      image: promoImage(promo.imageUrl),
    };
  });
}

export function featuredProductsFallback(): HomePanelProduct[] {
  return FEATURED_PRODUCTS.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    priceLabel: p.price,
    image: p.image,
    badge: p.badge,
  }));
}

export function promosFallback(): HomePanelPromo[] {
  return RUSTY_PROMOS.map((promo) => ({
    ...promo,
    slug: promo.id,
    priceRaw: promo.price,
  }));
}

export function homePromoToCartInput(promo: HomePanelPromo): CartProductInput {
  return {
    id: promo.id,
    slug: promo.slug,
    name: `PROMO #${promo.number} — ${promo.name}`,
    price: promo.priceRaw,
    imageUrl: promo.image,
  };
}

export function homeProductToCartInput(product: HomePanelProduct): CartProductInput {
  if (/^\d+$/.test(product.id)) {
    return featuredProductToCartInput({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: String(product.price),
      image: product.image,
    });
  }

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    imageUrl: product.image,
  };
}

export async function fetchHomeProducts(): Promise<HomePanelProduct[]> {
  try {
    const res = await fetch("/api/public/products", { cache: "no-store" });
    const json = (await res.json()) as { ok: boolean; data?: ApiProduct[] };
    if (!json.ok || !Array.isArray(json.data) || json.data.length === 0) {
      return featuredProductsFallback();
    }
    return json.data.map(mapApiProduct);
  } catch {
    return featuredProductsFallback();
  }
}

export async function fetchHomePromos(): Promise<HomePanelPromo[]> {
  try {
    const res = await fetch("/api/public/promos", { cache: "no-store" });
    const json = (await res.json()) as { ok: boolean; data?: ApiPromo[] };
    if (!json.ok || !Array.isArray(json.data) || json.data.length === 0) {
      return promosFallback();
    }
    return mapApiPromos(json.data);
  } catch {
    return promosFallback();
  }
}
