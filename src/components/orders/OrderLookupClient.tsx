"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  getLastOrderCode,
  normalizeOrderCode,
} from "@/lib/order-storage";

type OrderLookupResponse = { ok: true } | { ok: false; error: string };

export function OrderLookupClient() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [lastOrderCode, setLastOrderCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLastOrderCode(getLastOrderCode());
  }, []);

  async function lookupOrder(rawCode: string) {
    const normalized = normalizeOrderCode(rawCode);
    if (!normalized) {
      setError("Ingresá un código de pedido.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/public/orders/${encodeURIComponent(normalized)}`);
      const json = (await res.json()) as OrderLookupResponse;

      if (!json.ok) {
        setError("No encontramos un pedido con ese código.");
        return;
      }

      router.push(`/pedido/${encodeURIComponent(normalized)}`);
    } catch {
      setError("No encontramos un pedido con ese código.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await lookupOrder(code);
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-24 md:px-8 md:py-32">
      <p className="font-display text-xs uppercase tracking-[0.35em] text-rusty-orange">
        Rusty Burger
      </p>
      <h1 className="mt-2 font-display text-4xl uppercase text-rusty-cream md:text-5xl">
        Seguí tu pedido
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-rusty-cream/60">
        Ingresá el código de tu pedido para ver el estado en tiempo real.
      </p>

      {lastOrderCode && (
        <div className="mt-8 border border-rusty-orange/40 bg-rusty-smoke p-5">
          <p className="font-display text-xs uppercase tracking-widest text-rusty-orange">
            Último pedido
          </p>
          <p className="mt-2 font-display text-2xl uppercase text-rusty-cream">
            {lastOrderCode}
          </p>
          <button
            type="button"
            onClick={() => lookupOrder(lastOrderCode)}
            disabled={loading}
            className="mt-4 w-full bg-rusty-orange py-3 font-display text-xs uppercase tracking-wider text-rusty-carbon transition hover:bg-rusty-orangeBright disabled:cursor-not-allowed disabled:opacity-60"
          >
            Ver estado
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="order-code"
            className="mb-2 block font-display text-xs uppercase tracking-widest text-rusty-cream/50"
          >
            Código de pedido
          </label>
          <input
            id="order-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="RB-000001"
            autoComplete="off"
            spellCheck={false}
            className="w-full border border-rusty-gray/50 bg-rusty-carbon px-4 py-4 font-display text-lg uppercase tracking-wider text-rusty-cream outline-none placeholder:text-rusty-cream/25 focus:border-rusty-orange"
          />
        </div>

        {error && (
          <p className="border border-rusty-fire/40 bg-rusty-fire/10 px-4 py-3 text-sm text-rusty-cream">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-rusty-orange py-4 font-display text-sm uppercase tracking-wider text-rusty-carbon transition hover:bg-rusty-orangeBright disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Consultando…" : "Consultar pedido"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-rusty-cream/40">
        El código aparece al confirmar tu pedido, por ejemplo{" "}
        <span className="text-rusty-cream/60">RB-000001</span>.
      </p>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="font-display text-xs uppercase tracking-wider text-rusty-cream/50 hover:text-rusty-orange"
        >
          Volver a la home
        </Link>
      </div>
    </section>
  );
}
