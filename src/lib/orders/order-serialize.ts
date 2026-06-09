import type { Order, OrderItem } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { buildOrderTimeline, statusLabel } from "@/lib/orders/order-timeline";

export type OrderWithItems = Order & { items: OrderItem[] };

function decimalToNumber(value: Decimal | null | undefined): number {
  if (value == null) return 0;
  return parseFloat(value.toString());
}

export function serializeAdminOrder(order: OrderWithItems) {
  return {
    id: order.id,
    code: order.code,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerEmail: order.customerEmail,
    deliveryType: order.deliveryType,
    address: order.address,
    notes: order.notes,
    paymentMethod: order.paymentMethod,
    source: order.source,
    status: order.status,
    statusLabel: statusLabel(order.status, order.deliveryType),
    subtotal: decimalToNumber(order.subtotal),
    deliveryFee: decimalToNumber(order.deliveryFee),
    discount: decimalToNumber(order.discount),
    total: decimalToNumber(order.total),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: decimalToNumber(item.unitPrice),
      total: decimalToNumber(item.total),
      notes: item.notes,
    })),
    timeline: buildOrderTimeline(order.status, order.deliveryType),
  };
}

export function serializeAdminOrderListItem(order: OrderWithItems) {
  return {
    id: order.id,
    code: order.code,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    deliveryType: order.deliveryType,
    status: order.status,
    statusLabel: statusLabel(order.status, order.deliveryType),
    total: decimalToNumber(order.total),
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    createdAt: order.createdAt.toISOString(),
  };
}

export function serializePublicOrder(order: OrderWithItems) {
  return {
    code: order.code,
    customerName: order.customerName,
    deliveryType: order.deliveryType,
    address: order.address,
    notes: order.notes,
    paymentMethod: order.paymentMethod,
    status: order.status,
    statusLabel: statusLabel(order.status, order.deliveryType),
    subtotal: decimalToNumber(order.subtotal),
    deliveryFee: decimalToNumber(order.deliveryFee),
    discount: decimalToNumber(order.discount),
    total: decimalToNumber(order.total),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: decimalToNumber(item.unitPrice),
      total: decimalToNumber(item.total),
      notes: item.notes,
    })),
    timeline: buildOrderTimeline(order.status, order.deliveryType),
  };
}
