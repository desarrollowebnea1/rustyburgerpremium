"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminImagePreview } from "@/components/admin/AdminImagePreview";
import { AdminBoolBadge } from "@/components/admin/AdminBoolBadge";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminShell } from "@/components/admin/AdminShell";
import { btnPrimary } from "@/components/admin/admin-ui";
import { formatCurrency } from "@/lib/cart-utils";

type PromoItem = {
  id: string;
  title: string;
  slug: string;
  tagline: string | null;
  price: number | null;
  imageUrl: string | null;
  active: boolean;
  startsAt: string | null;
  endsAt: string | null;
  sortOrder: number;
};

export function AdminPromosListClient() {
  const [promos, setPromos] = useState<PromoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PromoItem | null>(null);

  const loadPromos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/promos");
      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
        data?: { promos: PromoItem[] };
      };
      if (!json.ok) {
        setError(json.error ?? "Error al cargar.");
        setPromos([]);
        return;
      }
      setPromos(json.data?.promos ?? []);
    } catch {
      setError("No se pudieron cargar las promociones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPromos();
  }, [loadPromos]);

  async function toggleActive(promo: PromoItem) {
    setActionLoading(promo.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/promos/${promo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !promo.active }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        setError(json.error ?? "Error al actualizar.");
        return;
      }
      setSuccess("Estado actualizado.");
      await loadPromos();
    } catch {
      setError("Error al actualizar.");
    } finally {
      setActionLoading(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/promos/${deleteTarget.id}`, { method: "DELETE" });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        setError(json.error ?? "No se pudo eliminar.");
        return;
      }
      setSuccess(`"${deleteTarget.title}" eliminada.`);
      setDeleteTarget(null);
      await loadPromos();
    } catch {
      setError("Error al eliminar.");
    } finally {
      setActionLoading(null);
    }
  }

  function formatVigencia(promo: PromoItem) {
    if (!promo.startsAt && !promo.endsAt) return "Sin límite";
    const start = promo.startsAt ? new Date(promo.startsAt).toLocaleDateString("es-AR") : "—";
    const end = promo.endsAt ? new Date(promo.endsAt).toLocaleDateString("es-AR") : "—";
    return `${start} → ${end}`;
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase text-rusty-cream">Promociones</h1>
          <p className="mt-2 text-sm text-rusty-cream/60">Gestioná ofertas y combos destacados.</p>
        </div>
        <Link href="/admin/promos/nueva" className={btnPrimary}>
          Nueva promo
        </Link>
      </div>

      {error && (
        <div className="mt-6">
          <AdminAlert type="error" message={error} />
        </div>
      )}
      {success && (
        <div className="mt-6">
          <AdminAlert type="success" message={success} />
        </div>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-rusty-cream/50">Cargando promos…</p>
      ) : promos.length === 0 ? (
        <p className="mt-8 text-sm text-rusty-cream/50">No hay promociones.</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-rusty-gray/40">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-rusty-smoke text-xs uppercase tracking-wider text-rusty-cream/50">
              <tr>
                <th className="px-4 py-3">Imagen</th>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Tagline</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Vigencia</th>
                <th className="px-4 py-3">Orden</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((promo) => (
                <tr key={promo.id} className="border-t border-rusty-gray/30">
                  <td className="px-4 py-3">
                    <AdminImagePreview
                      src={promo.imageUrl}
                      alt={promo.title}
                      className="h-12 w-12 object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-rusty-cream">{promo.title}</p>
                    <p className="text-xs text-rusty-cream/40">{promo.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-rusty-cream/70">{promo.tagline ?? "—"}</td>
                  <td className="px-4 py-3 text-rusty-cream">
                    {promo.price != null ? formatCurrency(promo.price) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <AdminBoolBadge value={promo.active} trueLabel="Activa" falseLabel="Inactiva" />
                  </td>
                  <td className="px-4 py-3 text-xs text-rusty-cream/50">{formatVigencia(promo)}</td>
                  <td className="px-4 py-3 text-rusty-cream/50">{promo.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/admin/promos/${promo.id}`}
                        className="font-display text-xs uppercase text-rusty-orange hover:underline"
                      >
                        Editar
                      </Link>
                      <a
                        href="/promos"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-display text-xs uppercase text-rusty-cream/50 hover:text-rusty-orange"
                      >
                        Ver en web
                      </a>
                      <button
                        type="button"
                        disabled={actionLoading === promo.id}
                        onClick={() => toggleActive(promo)}
                        className="text-left font-display text-[10px] uppercase text-rusty-cream/50 hover:text-rusty-orange disabled:opacity-60"
                      >
                        {promo.active ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === promo.id}
                        onClick={() => setDeleteTarget(promo)}
                        className="text-left font-display text-[10px] uppercase text-rusty-fire hover:underline disabled:opacity-60"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Eliminar promoción"
        message={
          deleteTarget
            ? `¿Eliminar "${deleteTarget.title}"? Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar"
        loading={!!actionLoading && !!deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}
