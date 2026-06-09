import type { OrderStatus } from "@prisma/client";

const STATUS_STYLES: Record<OrderStatus, string> = {
  RECEIVED: "bg-rusty-cream/10 text-rusty-cream border-rusty-cream/20",
  CONFIRMED: "bg-blue-500/10 text-blue-200 border-blue-400/30",
  PREPARING: "bg-rusty-orange/15 text-rusty-orange border-rusty-orange/30",
  READY: "bg-emerald-500/10 text-emerald-200 border-emerald-400/30",
  OUT_FOR_DELIVERY: "bg-violet-500/10 text-violet-200 border-violet-400/30",
  DELIVERED: "bg-emerald-600/15 text-emerald-100 border-emerald-500/30",
  CANCELLED: "bg-rusty-fire/15 text-rusty-fire border-rusty-fire/30",
};

export function OrderStatusBadge({
  status,
  label,
}: {
  status: OrderStatus | string;
  label: string;
}) {
  const style =
    STATUS_STYLES[status as OrderStatus] ?? "bg-rusty-gray/20 text-rusty-cream/70";

  return (
    <span
      className={`inline-block border px-2.5 py-1 font-display text-[10px] uppercase tracking-wider ${style}`}
    >
      {label}
    </span>
  );
}
