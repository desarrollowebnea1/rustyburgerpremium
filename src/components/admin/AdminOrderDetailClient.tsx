"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { formatCurrency } from "@/lib/cart-utils";

type OrderDetail = {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryType: string;
  address?: string | null;
  notes?: string | null;
  paymentMethod: string;
  source: string;
  status: string;
  statusLabel: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    notes?: string | null;
  }>;
};

type OrderResponse = { ok: true; data: { order: OrderDetail } } | { ok: false; error: string };

const STATUS_OPTIONS = [
  { value: "RECEIVED", label: "Recibido" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "PREPARING", label: "En preparación" },
  { value: "READY", label: "Listo" },
  { value: "OUT_FOR_DELIVERY", label: "En camino" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "CANCELLED", label: "Cancelado" },
];

const PAYMENT_LABELS: Record<string, string> = {
  CASH: "Efectivo",
  TRANSFER: "Transferencia",
  CARD: "Tarjeta",
  IFOOD: "iFood",
  OTHER: "Otro",
};

export function AdminOrderDetailClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  async function loadOrder() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      const json = (await res.json()) as OrderResponse;
      if (!json.ok) {
        setError(json.error);
        setOrder(null);
        return;
      }
      setOrder(json.data.order);
      setSelectedStatus(json.data.order.status);
    } catch {
      setError("No se pudo cargar el pedido.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function handleStatusUpdate() {
    if (!order || selectedStatus === order.status) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });

      const json = (await res.json()) as OrderResponse;
      if (!json.ok) {
        setError(json.error);
        return;
      }

      setOrder(json.data.order);
      setSelectedStatus(json.data.order.status);
      setSuccess("Estado actualizado. El cliente lo verá en /pedido/" + json.data.order.code);
    } catch {
      setError("No se pudo actualizar el estado.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <Link
        href="/admin/pedidos"
        className="font-display text-xs uppercase tracking-wider text-rusty-cream/50 hover:text-rusty-orange"
      >
        ← Volver a pedidos
      </Link>

      {loading && <p className="mt-8 text-sm text-rusty-cream/50">Cargando pedido…</p>}

      {error && !loading && (
        <p className="mt-8 border border-rusty-fire/30 bg-rusty-fire/10 px-4 py-3 text-sm">
          {error}
        </p>
      )}

      {order && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl uppercase text-rusty-cream">{order.code}</h1>
              <p className="mt-2 text-sm text-rusty-cream/60">
                Creado {new Date(order.createdAt).toLocaleString("es-AR")}
              </p>
            </div>
            <OrderStatusBadge status={order.status} label={order.statusLabel} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoBlock title="Cliente">
              <p>{order.customerName}</p>
              <p className="text-rusty-cream/60">{order.customerPhone}</p>
              {order.customerEmail && (
                <p className="text-rusty-cream/60">{order.customerEmail}</p>
              )}
            </InfoBlock>
            <InfoBlock title="Entrega">
              <p>{order.deliveryType === "DELIVERY" ? "Delivery" : "Retiro en local"}</p>
              {order.address && <p className="text-rusty-cream/60">{order.address}</p>}
              <p className="text-rusty-cream/60">
                Pago: {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
              </p>
            </InfoBlock>
          </div>

          {order.notes && (
            <InfoBlock title="Notas del cliente">
              <p className="text-rusty-cream/70">{order.notes}</p>
            </InfoBlock>
          )}

          <InfoBlock title="Productos">
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between border-b border-rusty-gray/20 pb-2"
                >
                  <div>
                    <p className="font-display text-sm uppercase">{item.productName}</p>
                    <p className="text-xs text-rusty-cream/50">
                      x{item.quantity} · {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <p className="text-rusty-orange">{formatCurrency(item.total)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between text-rusty-cream/60">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-rusty-cream/60">
                  <span>Envío</span>
                  <span>{formatCurrency(order.deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between font-display text-lg text-rusty-orange">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </InfoBlock>

          <InfoBlock title="Cambiar estado">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-rusty-gray/50 bg-rusty-carbon px-4 py-2 text-sm text-rusty-cream outline-none focus:border-rusty-orange"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={saving || selectedStatus === order.status}
                className="bg-rusty-orange px-5 py-2 font-display text-xs uppercase tracking-wider text-rusty-carbon disabled:opacity-50"
              >
                {saving ? "Guardando…" : "Actualizar estado"}
              </button>
            </div>
            {success && <p className="mt-3 text-sm text-emerald-300">{success}</p>}
            <p className="mt-3 text-xs text-rusty-cream/40">
              El cliente ve el cambio al recargar{" "}
              <Link href={`/pedido/${order.code}`} className="text-rusty-orange hover:underline">
                /pedido/{order.code}
              </Link>
            </p>
          </InfoBlock>
        </div>
      )}
    </AdminShell>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-rusty-gray/40 bg-rusty-smoke p-5">
      <h2 className="font-display text-xs uppercase tracking-widest text-rusty-orange">{title}</h2>
      <div className="mt-3 text-sm text-rusty-cream">{children}</div>
    </div>
  );
}
