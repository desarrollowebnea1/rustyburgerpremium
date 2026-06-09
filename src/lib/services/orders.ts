import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateOrderCode } from "@/lib/orders/order-code";
import { serializePublicOrder } from "@/lib/orders/order-serialize";
import type { ValidatedOrderInput } from "@/lib/orders/order-validation";
import { parseCartPrice } from "@/lib/cart-utils";

async function getDeliveryFee(deliveryType: ValidatedOrderInput["deliveryType"]): Promise<number> {
  if (deliveryType !== "DELIVERY") return 0;

  const setting = await prisma.siteSetting.findUnique({
    where: { key: "deliveryFee" },
  });

  if (!setting?.value) return 0;
  return parseCartPrice(setting.value as string | number);
}

async function resolveItemPrice(item: ValidatedOrderInput["items"][number]): Promise<{
  productId?: string;
  name: string;
  unitPrice: Prisma.Decimal;
}> {
  if (item.productId) {
    const product = await prisma.product.findFirst({
      where: {
        id: item.productId,
        active: true,
        available: true,
      },
    });

    if (product) {
      return {
        productId: product.id,
        name: product.name,
        unitPrice: product.price,
      };
    }
  }

  const safePrice = Math.max(0, item.unitPrice);
  return {
    productId: item.productId,
    name: item.name,
    unitPrice: new Prisma.Decimal(safePrice.toFixed(2)),
  };
}

export async function createPublicOrder(input: ValidatedOrderInput) {
  const resolvedItems = await Promise.all(input.items.map(resolveItemPrice));

  let subtotal = new Prisma.Decimal(0);

  const orderItemsData = resolvedItems.map((resolved, index) => {
    const qty = input.items[index].quantity;
    const lineTotal = new Prisma.Decimal(
      (parseFloat(resolved.unitPrice.toString()) * qty).toFixed(2)
    );
    subtotal = new Prisma.Decimal(
      (parseFloat(subtotal.toString()) + parseFloat(lineTotal.toString())).toFixed(2)
    );

    return {
      productId: resolved.productId ?? null,
      productName: resolved.name,
      quantity: qty,
      unitPrice: resolved.unitPrice,
      total: lineTotal,
      notes: input.items[index].notes ?? null,
    };
  });

  const deliveryFeeNum = await getDeliveryFee(input.deliveryType);
  const deliveryFee = new Prisma.Decimal(deliveryFeeNum.toFixed(2));
  const discount = new Prisma.Decimal(0);
  const total = new Prisma.Decimal(
    (
      parseFloat(subtotal.toString()) +
      parseFloat(deliveryFee.toString()) -
      parseFloat(discount.toString())
    ).toFixed(2)
  );

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = await generateOrderCode(prisma);

    try {
      const order = await prisma.order.create({
        data: {
          code,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerEmail: input.customerEmail ?? null,
          deliveryType: input.deliveryType,
          address: input.address ?? null,
          notes: input.notes ?? null,
          paymentMethod: input.paymentMethod,
          status: "RECEIVED",
          source: "WEB",
          subtotal,
          deliveryFee,
          discount,
          total,
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });

      return {
        code: order.code,
        orderId: order.id,
        status: order.status,
        total: parseFloat(order.total.toString()),
        order: serializePublicOrder(order),
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("No se pudo crear el pedido por colisión de código.");
}

export async function getPublicOrderByCode(code: string) {
  const trimmed = code.trim();
  const normalized = trimmed.toUpperCase();

  const order =
    (await prisma.order.findUnique({
      where: { code: normalized },
      include: { items: true },
    })) ??
    (trimmed !== normalized
      ? await prisma.order.findUnique({
          where: { code: trimmed },
          include: { items: true },
        })
      : null);

  if (!order) return null;
  return serializePublicOrder(order);
}
