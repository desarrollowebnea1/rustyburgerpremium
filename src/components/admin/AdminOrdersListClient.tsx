"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { formatCurrency } from "@/lib/cart-utils";

type OrderListItem = {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  deliveryType: string;
  status: string;
  statusLabel: string;
  total: number;
  itemCount: number;
  createdAt: string;
};

type OrdersResponse =
  | { ok: true; data: { orders: OrderListItem[] } }
  | { ok: false; error: string };

const FILTERS = [
  { value: "", label: "Todos" },
  { value: "RECEIVED", label: "Recibidos" },
  { value: "CONFIRMED", label: "Confirmados" },
  { value: "PREPARING", label: "Preparación" },
  { value: "READY", label: "Listos" },
  { value: "OUT_FOR_DELIVERY", label: "En camino" },
  { value: "DELIVERED", label: "Entregados" },
  { value: "CANCELLED", label: "Cancelados" },
];

export function AdminOrdersListClient() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const query = statusFilter ? `?status=${statusFilter}` : "";
        const res = await fetch(`/api/admin/orders${query}`);
        const json = (await res.json()) as OrdersResponse;
        if (!json.ok) {
          setError(json.error);
          setOrders([]);
          return;
        }
        setOrders(json.data.orders);
      } catch {
        setError("No se pudieron cargar los pedidos.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [statusFilter]);

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase text-rusty-cream">Pedidos</h1>
          <p className="mt-2 text-sm text-rusty-cream/60">
            Gestioná estados y seguí cada pedido por código.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.value || "all"}
            type="button"
            onClick={() => setStatusFilter(filter.value)}
            className={`border px-3 py-1.5 font-display text-[10px] uppercase tracking-wider ${
              statusFilter === filter.value
                ? "border-rusty-orange bg-rusty-orange text-rusty-carbon"
                : "border-rusty-gray/40 text-rusty-cream/60 hover:border-rusty-orange"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-6 border border-rusty-fire/30 bg-rusty-fire/10 px-4 py-3 text-sm">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-rusty-cream/50">Cargando pedidos…</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-sm text-rusty-cream/50">No hay pedidos para mostrar.</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-rusty-gray/40">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-rusty-smoke text-xs uppercase tracking-wider text-rusty-cream/50">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-rusty-gray/30">
                  <td className="px-4 py-3 font-display text-rusty-orange">{order.code}</td>
                  <td className="px-4 py-3">
                    <p className="text-rusty-cream">{order.customerName}</p>
                    <p className="text-xs text-rusty-cream/40">{order.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} label={order.statusLabel} />
                  </td>
                  <td className="px-4 py-3 text-rusty-cream">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3 text-xs text-rusty-cream/50">
                    {new Date(order.createdAt).toLocaleString("es-AR")}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="font-display text-xs uppercase text-rusty-orange hover:underline"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
