import type { DeliveryType, OrderStatus } from "@prisma/client";

export type TimelineStep = {
  key: OrderStatus;
  label: string;
  completed: boolean;
  current: boolean;
};

const STATUS_ORDER: OrderStatus[] = [
  "RECEIVED",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  RECEIVED: "Pedido recibido",
  CONFIRMED: "Confirmado",
  PREPARING: "En preparación",
  READY: "Listo",
  OUT_FOR_DELIVERY: "En camino",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

export function buildOrderTimeline(
  status: OrderStatus,
  deliveryType: DeliveryType
): TimelineStep[] {
  if (status === "CANCELLED") {
    return [
      {
        key: "CANCELLED",
        label: STATUS_LABELS.CANCELLED,
        completed: true,
        current: true,
      },
    ];
  }

  const steps: OrderStatus[] =
    deliveryType === "TAKEAWAY"
      ? ["RECEIVED", "CONFIRMED", "PREPARING", "READY", "DELIVERED"]
      : STATUS_ORDER;

  let currentIndex = steps.indexOf(status);
  if (currentIndex === -1) {
    if (status === "OUT_FOR_DELIVERY" && deliveryType === "TAKEAWAY") {
      currentIndex = steps.indexOf("READY");
    } else {
      currentIndex = Math.max(0, steps.length - 1);
    }
  }

  return steps.map((key, index) => {
    let label = STATUS_LABELS[key];
    if (deliveryType === "TAKEAWAY" && key === "READY") {
      label = "Listo para retirar";
    }
    if (deliveryType === "TAKEAWAY" && key === "DELIVERED") {
      label = "Retirado";
    }

    return {
      key,
      label,
      completed: index <= currentIndex,
      current: index === currentIndex,
    };
  });
}

export function statusLabel(status: OrderStatus, deliveryType: DeliveryType): string {
  if (status === "READY" && deliveryType === "TAKEAWAY") {
    return "Listo para retirar";
  }
  if (status === "OUT_FOR_DELIVERY" && deliveryType === "TAKEAWAY") {
    return "Listo para retirar";
  }
  return STATUS_LABELS[status];
}
