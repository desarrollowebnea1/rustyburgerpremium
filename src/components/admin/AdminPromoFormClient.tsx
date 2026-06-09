"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminImagePicker } from "@/components/admin/AdminImagePicker";
import { AdminShell } from "@/components/admin/AdminShell";
import { btnPrimary, btnSecondary, inputClass, labelClass } from "@/components/admin/admin-ui";
import { slugify } from "@/lib/slug";

type PromoForm = {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  price: string;
  imageUrl: string;
  active: boolean;
  startsAt: string;
  endsAt: string;
  sortOrder: string;
};

const EMPTY: PromoForm = {
  title: "",
  slug: "",
  tagline: "",
  description: "",
  price: "",
  imageUrl: "",
  active: true,
  startsAt: "",
  endsAt: "",
  sortOrder: "0",
};

function toDateInput(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function AdminPromoFormClient({ promoId }: { promoId?: string }) {
  const router = useRouter();
  const isEdit = Boolean(promoId);

  const [form, setForm] = useState<PromoForm>(EMPTY);
  const [slugManual, setSlugManual] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!promoId) return;

    async function loadPromo() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/promos/${promoId}`);
        const json = (await res.json()) as {
          ok: boolean;
          error?: string;
          data?: {
            promo: {
              title: string;
              slug: string;
              tagline: string | null;
              description: string | null;
              price: number | null;
              imageUrl: string | null;
              active: boolean;
              startsAt: string | null;
              endsAt: string | null;
              sortOrder: number;
            };
          };
        };
        if (!json.ok || !json.data) {
          setError(json.error ?? "Promo no encontrada.");
          return;
        }
        const p = json.data.promo;
        setForm({
          title: p.title,
          slug: p.slug,
          tagline: p.tagline ?? "",
          description: p.description ?? "",
          price: p.price != null ? String(p.price) : "",
          imageUrl: p.imageUrl ?? "",
          active: p.active,
          startsAt: toDateInput(p.startsAt),
          endsAt: toDateInput(p.endsAt),
          sortOrder: String(p.sortOrder),
        });
        setSlugManual(true);
      } catch {
        setError("No se pudo cargar la promoción.");
      } finally {
        setLoading(false);
      }
    }
    loadPromo();
  }, [promoId]);

  function updateTitle(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugManual ? prev.slug : slugify(title),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const body = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      tagline: form.tagline.trim() || null,
      description: form.description.trim() || null,
      price: form.price.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      active: form.active,
      startsAt: form.startsAt || null,
      endsAt: form.endsAt || null,
      sortOrder: parseInt(form.sortOrder, 10) || 0,
    };

    try {
      const url = isEdit ? `/api/admin/promos/${promoId}` : "/api/admin/promos";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { ok: boolean; error?: string; data?: { promo: { id: string } } };
      if (!json.ok) {
        setError(json.error ?? "Error al guardar.");
        return;
      }
      setSuccess(isEdit ? "Promoción actualizada." : "Promoción creada.");
      if (!isEdit && json.data?.promo.id) {
        router.push(`/admin/promos/${json.data.promo.id}`);
      }
    } catch {
      setError("Error al guardar la promoción.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminShell>
        <p className="text-sm text-rusty-cream/50">Cargando promoción…</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase text-rusty-cream">
            {isEdit ? "Editar promoción" : "Nueva promoción"}
          </h1>
        </div>
        <Link href="/admin/promos" className={btnSecondary}>
          Volver al listado
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

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Título *</label>
            <input
              required
              value={form.title}
              onChange={(e) => updateTitle(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input
              required
              value={form.slug}
              onChange={(e) => {
                setSlugManual(true);
                setForm((p) => ({ ...p, slug: e.target.value }));
              }}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input
              value={form.tagline}
              onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Precio (opcional)</label>
            <input
              type="text"
              inputMode="decimal"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <AdminImagePicker
              label="Imagen de la promoción"
              value={form.imageUrl}
              onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
              assetType="promo"
              placeholder="/rusty/promos/promo-1.svg"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Descripción</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Fecha inicio (opcional)</label>
            <input
              type="date"
              value={form.startsAt}
              onChange={(e) => setForm((p) => ({ ...p, startsAt: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Fecha fin (opcional)</label>
            <input
              type="date"
              value={form.endsAt}
              onChange={(e) => setForm((p) => ({ ...p, endsAt: e.target.value }))}
              className={inputClass}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-rusty-cream/70">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
            />
            Activa
          </label>
          <div>
            <label className={labelClass}>Orden</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm((p) => ({ ...p, sortOrder: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear promo"}
          </button>
          <Link href="/admin/promos" className={btnSecondary}>
            Cancelar
          </Link>
        </div>
      </form>
    </AdminShell>
  );
}
