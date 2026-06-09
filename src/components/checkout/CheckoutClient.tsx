"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { GoToMenuPanelButton } from "@/components/navigation/GoToMenuPanelButton";
import { formatCurrency } from "@/lib/cart-utils";

type DeliveryType = "DELIVERY" | "TAKEAWAY";
type PaymentMethod = "CASH" | "TRANSFER" | "CARD" | "IFOOD" | "OTHER";

type CreateOrderResponse =
  | { ok: true; data: { code: string; orderId: string; status: string; total: number } }
  | { ok: false; error: string };

export function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, isHydrated, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("DELIVERY");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [notes, setNotes] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/public/settings");
        const json = (await res.json()) as { ok: boolean; data?: { deliveryFee?: number } };
        if (json.ok && json.data?.deliveryFee != null) {
          setDeliveryFee(Number(json.data.deliveryFee) || 0);
        }
      } catch {
        // mantiene 0
      }
    }
    loadSettings();
  }, []);

  const appliedDeliveryFee = deliveryType === "DELIVERY" ? deliveryFee : 0;
  const total = useMemo(
    () => subtotal + appliedDeliveryFee,
    [subtotal, appliedDeliveryFee]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Tu carrito está vacío.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/public/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail: customerEmail || undefined,
          deliveryType,
          address: deliveryType === "DELIVERY" ? address : undefined,
          paymentMethod,
          notes: notes || undefined,
          items: items.map((item) => ({
            productId: item.productId,
            slug: item.slug,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            notes: item.notes,
          })),
        }),
      });

      const json = (await res.json()) as CreateOrderResponse;

      if (!json.ok) {
        setError(json.error);
        return;
      }

      clearCart();
      router.push(`/pedido/${encodeURIComponent(json.data.code)}`);
      router.refresh();
    } catch {
      setError("No se pudo confirmar el pedido. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (!isHydrated) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 md:px-8 md:py-32">
        <p className="text-sm text-rusty-cream/50">Cargando checkout…</p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 md:px-8 md:py-32">
        <h1 className="font-display text-4xl uppercase text-rusty-cream">Finalizar pedido</h1>
        <p className="mt-6 text-rusty-cream/60">Tu carrito está vacío.</p>
        <GoToMenuPanelButton className="mt-6 inline-block bg-rusty-orange px-8 py-3 font-display text-sm uppercase text-rusty-carbon">
          Ir al menú
        </GoToMenuPanelButton>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-24 md:px-8 md:py-32">
      <p className="font-display text-xs uppercase tracking-[0.35em] text-rusty-orange">
        Rusty Burger
      </p>
      <h1 className="mt-2 font-display text-4xl uppercase text-rusty-cream md:text-5xl">
        Finalizar pedido
      </h1>

      <form onSubmit={handleSubmit} className="mt-10 space-y-8">
        <div className="space-y-4 border border-rusty-gray/40 bg-rusty-smoke p-5">
          <h2 className="font-display text-sm uppercase tracking-widest text-rusty-orange">
            Tus datos
          </h2>
          <input
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nombre completo"
            className="w-full border border-rusty-gray/50 bg-rusty-carbon px-4 py-3 text-sm text-rusty-cream outline-none focus:border-rusty-orange"
          />
          <input
            required
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="WhatsApp / teléfono"
            className="w-full border border-rusty-gray/50 bg-rusty-carbon px-4 py-3 text-sm text-rusty-cream outline-none focus:border-rusty-orange"
          />
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="Email (opcional)"
            className="w-full border border-rusty-gray/50 bg-rusty-carbon px-4 py-3 text-sm text-rusty-cream outline-none focus:border-rusty-orange"
          />
        </div>

        <div className="space-y-4 border border-rusty-gray/40 bg-rusty-smoke p-5">
          <h2 className="font-display text-sm uppercase tracking-widest text-rusty-orange">
            Entrega
          </h2>
          <div className="flex flex-wrap gap-3">
            {(["DELIVERY", "TAKEAWAY"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setDeliveryType(type)}
                className={`border px-4 py-2 font-display text-xs uppercase tracking-wider ${
                  deliveryType === type
                    ? "border-rusty-orange bg-rusty-orange text-rusty-carbon"
                    : "border-rusty-gray/50 text-rusty-cream hover:border-rusty-orange"
                }`}
              >
                {type === "DELIVERY" ? "Delivery" : "Retiro en local"}
              </button>
            ))}
          </div>
          {deliveryType === "DELIVERY" && (
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Dirección de entrega"
              rows={3}
              className="w-full border border-rusty-gray/50 bg-rusty-carbon px-4 py-3 text-sm text-rusty-cream outline-none focus:border-rusty-orange"
            />
          )}
        </div>

        <div className="space-y-4 border border-rusty-gray/40 bg-rusty-smoke p-5">
          <h2 className="font-display text-sm uppercase tracking-widest text-rusty-orange">
            Pago
          </h2>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            className="w-full border border-rusty-gray/50 bg-rusty-carbon px-4 py-3 text-sm text-rusty-cream outline-none focus:border-rusty-orange"
          >
            <option value="CASH">Efectivo</option>
            <option value="TRANSFER">Transferencia</option>
            <option value="CARD">Tarjeta</option>
            <option value="IFOOD">iFood</option>
            <option value="OTHER">Otro</option>
          </select>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notas para el pedido (opcional)"
            rows={2}
            className="w-full border border-rusty-gray/50 bg-rusty-carbon px-4 py-3 text-sm text-rusty-cream outline-none focus:border-rusty-orange"
          />
        </div>

        <div className="space-y-3 border border-rusty-gray/40 bg-rusty-carbon/40 p-5">
          <h2 className="font-display text-sm uppercase tracking-widest text-rusty-orange">
            Resumen
          </h2>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-rusty-carbon">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-xs uppercase text-rusty-cream">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-rusty-cream/50">x{item.quantity}</p>
                </div>
                <p className="text-sm text-rusty-orange">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t border-rusty-gray/30 pt-3 text-sm">
            <div className="flex justify-between text-rusty-cream/70">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {deliveryType === "DELIVERY" && (
              <div className="flex justify-between text-rusty-cream/70">
                <span>Envío</span>
                <span>{formatCurrency(appliedDeliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between font-display text-xl text-rusty-orange">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {error && (
          <p className="border border-rusty-fire/40 bg-rusty-fire/10 px-4 py-3 text-sm text-rusty-cream">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-rusty-orange py-4 font-display text-sm uppercase tracking-wider text-rusty-carbon transition hover:bg-rusty-orangeBright disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Confirmando…" : "Confirmar pedido"}
          </button>
          <GoToMenuPanelButton className="flex-1 border border-rusty-gray/50 py-4 text-center font-display text-sm uppercase tracking-wider text-rusty-cream hover:border-rusty-orange hover:text-rusty-orange">
            Volver al menú
          </GoToMenuPanelButton>
        </div>
      </form>
    </section>
  );
}
