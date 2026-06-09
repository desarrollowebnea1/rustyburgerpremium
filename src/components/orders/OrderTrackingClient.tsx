"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GoToMenuPanelButton } from "@/components/navigation/GoToMenuPanelButton";
import { formatCurrency } from "@/lib/cart-utils";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { saveLastOrderCode } from "@/lib/order-storage";

type TimelineStep = {
  key: string;
  label: string;
  completed: boolean;
  current: boolean;
};

type OrderData = {
  code: string;
  customerName: string;
  deliveryType: "DELIVERY" | "TAKEAWAY";
  address?: string | null;
  notes?: string | null;
  paymentMethod: string;
  status: string;
  statusLabel: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    notes?: string | null;
  }>;
  timeline: TimelineStep[];
};

type OrderResponse = { ok: true; data: OrderData } | { ok: false; error: string };

const PAYMENT_LABELS: Record<string, string> = {
  CASH: "Efectivo",
  TRANSFER: "Transferencia",
  CARD: "Tarjeta",
  IFOOD: "iFood",
  OTHER: "Otro",
};

export function OrderTrackingClient({ code }: { code: string }) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/public/orders/${encodeURIComponent(code)}`);
        const json = (await res.json()) as OrderResponse;
        if (!json.ok) {
          setError(json.error);
          return;
        }
        setOrder(json.data);
        saveLastOrderCode(json.data.code);
      } catch {
        setError("No se pudo cargar el pedido.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [code]);

  const whatsappUrl = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hola RustyBurger, quiero consultar por mi pedido ${code}.`
      )}`
    : null;

  if (loading) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 md:px-8 md:py-32">
        <p className="text-sm text-rusty-cream/50">Cargando pedido…</p>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 md:px-8 md:py-32">
        <h1 className="font-display text-3xl uppercase text-rusty-cream">Pedido no encontrado</h1>
        <p className="mt-4 text-rusty-cream/60">{error ?? "Código inválido."}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/seguimiento"
            className="inline-block bg-rusty-orange px-6 py-3 text-center font-display text-xs uppercase text-rusty-carbon"
          >
            Consultar otro pedido
          </Link>
          <GoToMenuPanelButton className="inline-block border border-rusty-gray/50 px-6 py-3 text-center font-display text-xs uppercase text-rusty-cream hover:border-rusty-orange hover:text-rusty-orange">
            Volver al menú
          </GoToMenuPanelButton>
        </div>
      </section>
    );
  }

  const isCancelled = order.status === "CANCELLED";
  const isDelivered = order.status === "DELIVERED";

  async function handleCopyCode(orderCode: string) {
    try {
      await navigator.clipboard.writeText(orderCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-24 md:px-8 md:py-32">
      <p className="font-display text-xs uppercase tracking-[0.35em] text-rusty-orange">
        Seguimiento
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-4xl uppercase text-rusty-cream">{order.code}</h1>
        <button
          type="button"
          onClick={() => handleCopyCode(order.code)}
          className="border border-rusty-gray/50 px-3 py-1.5 font-display text-[10px] uppercase tracking-wider text-rusty-cream/70 hover:border-rusty-orange hover:text-rusty-orange"
        >
          {copied ? "Copiado ✓" : "Copiar código"}
        </button>
      </div>
      <p className="mt-2 text-sm text-rusty-cream/60">
        Hola {order.customerName}, este es el estado de tu pedido.
      </p>

      <div
        className={`mt-8 border px-5 py-4 ${
          isCancelled
            ? "border-rusty-fire/40 bg-rusty-fire/10"
            : "border-rusty-orange/40 bg-rusty-smoke"
        }`}
      >
        <p className="font-display text-xs uppercase tracking-widest text-rusty-orange">
          Estado actual
        </p>
        <p className="mt-1 font-display text-2xl uppercase text-rusty-cream">
          {order.statusLabel}
        </p>
        {isCancelled && (
          <p className="mt-2 text-sm text-rusty-cream/70">
            Este pedido fue cancelado. Consultanos por WhatsApp si necesitás ayuda.
          </p>
        )}
        {isDelivered && (
          <p className="mt-2 text-sm text-rusty-cream/70">
            Tu pedido fue completado. Podés consultar este código cuando quieras.
          </p>
        )}
      </div>

      {!isCancelled && (
        <ol className="mt-8 space-y-3">
          {order.timeline.map((step) => (
            <li
              key={step.key}
              className={`flex items-center gap-3 border px-4 py-3 ${
                step.current
                  ? "border-rusty-orange bg-rusty-orange/10"
                  : step.completed
                    ? "border-rusty-gray/40 bg-rusty-smoke/50"
                    : "border-rusty-gray/20 opacity-50"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  step.completed ? "bg-rusty-orange text-rusty-carbon" : "bg-rusty-gray/40 text-rusty-cream/40"
                }`}
              >
                {step.completed ? "✓" : "·"}
              </span>
              <span className="font-display text-sm uppercase text-rusty-cream">{step.label}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-8 space-y-2 border border-rusty-gray/40 bg-rusty-smoke p-5 text-sm text-rusty-cream/75">
        <p>
          <span className="text-rusty-cream/50">Entrega:</span>{" "}
          {order.deliveryType === "DELIVERY" ? "Delivery" : "Retiro en local"}
        </p>
        {order.address && (
          <p>
            <span className="text-rusty-cream/50">Dirección:</span> {order.address}
          </p>
        )}
        <p>
          <span className="text-rusty-cream/50">Pago:</span>{" "}
          {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
        </p>
        {order.notes && (
          <p>
            <span className="text-rusty-cream/50">Notas:</span> {order.notes}
          </p>
        )}
      </div>

      <ul className="mt-6 space-y-3">
        {order.items.map((item, i) => (
          <li
            key={`${item.productName}-${i}`}
            className="flex items-center justify-between border border-rusty-gray/30 bg-rusty-carbon/30 px-4 py-3"
          >
            <div>
              <p className="font-display text-sm uppercase text-rusty-cream">{item.productName}</p>
              <p className="text-xs text-rusty-cream/50">x{item.quantity}</p>
            </div>
            <p className="text-sm text-rusty-orange">{formatCurrency(item.total)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-rusty-gray/30 pt-4">
        <span className="text-sm uppercase tracking-widest text-rusty-cream/60">Total</span>
        <span className="font-display text-2xl text-rusty-orange">{formatCurrency(order.total)}</span>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-rusty-orange py-3 text-center font-display text-xs uppercase tracking-wider text-rusty-carbon hover:bg-rusty-orangeBright"
          >
            Consultar por WhatsApp
          </a>
        )}
        <Link
          href="/seguimiento"
          className="flex-1 border border-rusty-gray/50 py-3 text-center font-display text-xs uppercase tracking-wider text-rusty-cream hover:border-rusty-orange hover:text-rusty-orange"
        >
          Consultar otro pedido
        </Link>
        <GoToMenuPanelButton className="flex-1 border border-rusty-gray/50 py-3 text-center font-display text-xs uppercase tracking-wider text-rusty-cream hover:border-rusty-orange hover:text-rusty-orange">
          Volver al menú
        </GoToMenuPanelButton>
      </div>
    </section>
  );
}
