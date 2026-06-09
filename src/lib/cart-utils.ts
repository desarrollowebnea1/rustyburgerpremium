export const CART_STORAGE_KEY = "rusty_cart";

export type CartItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  notes?: string;
};

/** Convierte "R$ 38", "38.00", 38 → number seguro */
export function parseCartPrice(raw: string | number | null | undefined): number {
  if (typeof raw === "number") {
    return Number.isFinite(raw) && raw >= 0 ? raw : 0;
  }

  if (!raw) return 0;

  const cleaned = String(raw)
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");

  const num = parseFloat(cleaned);
  return Number.isFinite(num) && num >= 0 ? num : 0;
}

export function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function sanitizeCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];

  const items: CartItem[] = [];

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;

    const row = entry as Partial<CartItem>;
    const price = parseCartPrice(row.price as string | number);
    const quantity = Math.max(1, Math.floor(Number(row.quantity) || 1));

    if (!row.productId || !row.slug || !row.name) continue;

    items.push({
      id: String(row.id ?? row.productId),
      productId: String(row.productId),
      slug: String(row.slug),
      name: String(row.name),
      price,
      imageUrl: String(row.imageUrl ?? ""),
      quantity,
      notes: row.notes ? String(row.notes) : undefined,
    });
  }

  return items;
}

export type CartProductInput = {
  id: string;
  slug: string;
  name: string;
  price: string | number;
  imageUrl?: string;
  image?: string;
};

export function toCartItemFromProduct(product: CartProductInput, quantity = 1): CartItem {
  return {
    id: product.id,
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: parseCartPrice(product.price),
    imageUrl: product.imageUrl ?? product.image ?? "",
    quantity: Math.max(1, quantity),
  };
}
