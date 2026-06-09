import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  serializeAdminOrder,
  serializeAdminOrderListItem,
} from "@/lib/orders/order-serialize";

const ACTIVE_STATUSES: OrderStatus[] = ["RECEIVED", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY"];

export async function listAdminOrders(options?: {
  status?: OrderStatus;
  limit?: number;
}) {
  const limit = Math.min(Math.max(options?.limit ?? 50, 1), 100);

  const orders = await prisma.order.findMany({
    where: options?.status ? { status: options.status } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { items: true },
  });

  return orders.map(serializeAdminOrderListItem);
}

export async function getAdminOrderById(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) return null;
  return serializeAdminOrder(order);
}

export async function updateAdminOrderStatus(id: string, status: OrderStatus) {
  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: true },
  });

  return serializeAdminOrder(order);
}

export async function getAdminDashboardStats() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalOrders, todayOrders, activeOrders, todayRevenueAgg, statusCounts] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      prisma.order.count({
        where: { status: { in: ACTIVE_STATUSES } },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfToday } },
        _sum: { total: true },
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
    ]);

  const revenueToday = todayRevenueAgg._sum.total
    ? parseFloat(todayRevenueAgg._sum.total.toString())
    : 0;

  const byStatus = statusCounts.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = row._count._all;
    return acc;
  }, {});

  return {
    totalOrders,
    todayOrders,
    activeOrders,
    revenueToday,
    byStatus,
  };
}
