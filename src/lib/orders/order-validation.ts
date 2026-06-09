import type { DeliveryType, PaymentMethod } from "@prisma/client";

export type CheckoutItemInput = {
  productId?: string;
  slug?: string;
  name?: string;
  quantity?: number;
  unitPrice?: number;
  notes?: string;
};

export type CreateOrderBody = {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  deliveryType?: string;
  address?: string;
  paymentMethod?: string;
  notes?: string;
  items?: CheckoutItemInput[];
};

const DELIVERY_TYPES = new Set<DeliveryType>(["DELIVERY", "TAKEAWAY"]);
const PAYMENT_METHODS = new Set<PaymentMethod>([
  "CASH",
  "TRANSFER",
  "CARD",
  "IFOOD",
  "OTHER",
]);

export type ValidatedOrderInput = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryType: DeliveryType;
  address?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  items: Array<{
    productId?: string;
    slug?: string;
    name: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
  }>;
};

export function validateCreateOrderBody(
  body: CreateOrderBody
): { ok: true; data: ValidatedOrderInput } | { ok: false; error: string } {
  const customerName = body.customerName?.trim();
  const customerPhone = body.customerPhone?.trim();

  if (!customerName) {
    return { ok: false, error: "El nombre es obligatorio." };
  }

  if (!customerPhone) {
    return { ok: false, error: "El teléfono / WhatsApp es obligatorio." };
  }

  const deliveryType = body.deliveryType as DeliveryType;
  if (!deliveryType || !DELIVERY_TYPES.has(deliveryType)) {
    return { ok: false, error: "Seleccioná un tipo de entrega válido." };
  }

  const address = body.address?.trim();
  if (deliveryType === "DELIVERY" && !address) {
    return { ok: false, error: "La dirección es obligatoria para delivery." };
  }

  const paymentMethod = body.paymentMethod as PaymentMethod;
  if (!paymentMethod || !PAYMENT_METHODS.has(paymentMethod)) {
    return { ok: false, error: "Seleccioná un método de pago válido." };
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return { ok: false, error: "El pedido debe incluir al menos un producto." };
  }

  const items: ValidatedOrderInput["items"] = [];

  for (const raw of body.items) {
    const name = raw.name?.trim();
    const quantity = Math.floor(Number(raw.quantity));
    const unitPrice = Number(raw.unitPrice);

    if (!name) {
      return { ok: false, error: "Cada ítem debe tener nombre." };
    }

    if (!Number.isFinite(quantity) || quantity < 1) {
      return { ok: false, error: "La cantidad debe ser mayor a 0." };
    }

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      return { ok: false, error: "Precio de ítem inválido." };
    }

    items.push({
      productId: raw.productId?.trim() || undefined,
      slug: raw.slug?.trim() || undefined,
      name,
      quantity,
      unitPrice,
      notes: raw.notes?.trim() || undefined,
    });
  }

  return {
    ok: true,
    data: {
      customerName,
      customerPhone,
      customerEmail: body.customerEmail?.trim() || undefined,
      deliveryType,
      address: deliveryType === "DELIVERY" ? address : undefined,
      paymentMethod,
      notes: body.notes?.trim() || undefined,
      items,
    },
  };
}
