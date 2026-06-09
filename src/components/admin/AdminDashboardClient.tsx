"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatCurrency } from "@/lib/cart-utils";

type Stats = {
  totalOrders: number;
  todayOrders: number;
  activeOrders: number;
  revenueToday: number;
  byStatus: Record<string, number>;
};

type StatsResponse = { ok: true; data: { stats: Stats } } | { ok: false; error: string };

const STATUS_LABELS: Record<string, string> = {
  RECEIVED: "Recibidos",
  CONFIRMED: "Confirmados",
  PREPARING: "En preparación",
  READY: "Listos",
  OUT_FOR_DELIVERY: "En camino",
  DELIVERED: "Entregados",
  CANCELLED: "Cancelados",
};

export function AdminDashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/dashboard/stats");
        const json = (await res.json()) as StatsResponse;
        if (!json.ok) {
          setError(json.error);
          return;
        }
        setStats(json.data.stats);
      } catch {
        setError("No se pudieron cargar las métricas.");
      }
    }
    load();
  }, []);

  return (
    <AdminShell>
      <div>
        <h1 className="font-display text-3xl uppercase text-rusty-cream md:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-rusty-cream/60">
          Resumen operativo de pedidos en tiempo real.
        </p>
      </div>

      {error && (
        <p className="mt-6 border border-rusty-fire/30 bg-rusty-fire/10 px-4 py-3 text-sm text-rusty-cream">
          {error}
        </p>
      )}

      {stats && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Pedidos hoy" value={String(stats.todayOrders)} />
            <MetricCard title="Activos" value={String(stats.activeOrders)} />
            <MetricCard title="Total histórico" value={String(stats.totalOrders)} />
            <MetricCard title="Facturación hoy" value={formatCurrency(stats.revenueToday)} />
          </div>

          <div className="mt-8 border border-rusty-gray/40 bg-rusty-smoke p-5">
            <h2 className="font-display text-sm uppercase tracking-widest text-rusty-orange">
              Por estado
            </h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <div
                  key={key}
                  className="flex items-center justify-between border border-rusty-gray/30 px-3 py-2 text-sm"
                >
                  <span className="text-rusty-cream/70">{label}</span>
                  <span className="font-display text-rusty-cream">
                    {stats.byStatus[key] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/pedidos"
          className="bg-rusty-orange px-5 py-3 font-display text-xs uppercase tracking-wider text-rusty-carbon hover:bg-rusty-orangeBright"
        >
          Ver pedidos
        </Link>
        <span className="self-center text-xs text-rusty-cream/40">
          Productos, promos y settings — Fase 14F
        </span>
      </div>
    </AdminShell>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="border border-rusty-gray/40 bg-rusty-smoke p-5">
      <p className="text-xs uppercase tracking-widest text-rusty-cream/50">{title}</p>
      <p className="mt-2 font-display text-2xl text-rusty-cream">{value}</p>
    </div>
  );
}
