"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminImagePicker } from "@/components/admin/AdminImagePicker";
import { AdminShell } from "@/components/admin/AdminShell";
import { btnPrimary, btnSecondary, inputClass, labelClass } from "@/components/admin/admin-ui";
import { slugify } from "@/lib/slug";

type CategoryOption = { id: string; name: string };

type ProductForm = {
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  shortDescription: string;
  price: string;
  compareAtPrice: string;
  imageUrl: string;
  badge: string;
  active: boolean;
  available: boolean;
  featured: boolean;
  sortOrder: string;
  ingredients: string;
  allergens: string;
  tags: string;
};

const EMPTY: ProductForm = {
  name: "",
  slug: "",
  categoryId: "",
  description: "",
  shortDescription: "",
  price: "",
  compareAtPrice: "",
  imageUrl: "",
  badge: "",
  active: true,
  available: true,
  featured: false,
  sortOrder: "0",
  ingredients: "",
  allergens: "",
  tags: "",
};

export function AdminProductFormClient({ productId }: { productId?: string }) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const [form, setForm] = useState<ProductForm>(EMPTY);
  const [slugManual, setSlugManual] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      const res = await fetch("/api/admin/categories");
      const json = (await res.json()) as {
        ok: boolean;
        data?: { categories: Array<{ id: string; name: string }> };
      };
      if (json.ok && json.data) {
        setCategories(json.data.categories.map((c) => ({ id: c.id, name: c.name })));
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    if (!productId) return;

    async function loadProduct() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/products/${productId}`);
        const json = (await res.json()) as {
          ok: boolean;
          error?: string;
          data?: {
            product: {
              name: string;
              slug: string;
              categoryId: string | null;
              description: string;
              shortDescription: string | null;
              price: number;
              compareAtPrice: number | null;
              imageUrl: string | null;
              badge: string | null;
              active: boolean;
              available: boolean;
              featured: boolean;
              sortOrder: number;
              ingredients: string | null;
              allergens: string | null;
              tags: string[];
            };
          };
        };
        if (!json.ok || !json.data) {
          setError(json.error ?? "Producto no encontrado.");
          return;
        }
        const p = json.data.product;
        setForm({
          name: p.name,
          slug: p.slug,
          categoryId: p.categoryId ?? "",
          description: p.description,
          shortDescription: p.shortDescription ?? "",
          price: String(p.price),
          compareAtPrice: p.compareAtPrice != null ? String(p.compareAtPrice) : "",
          imageUrl: p.imageUrl ?? "",
          badge: p.badge ?? "",
          active: p.active,
          available: p.available,
          featured: p.featured,
          sortOrder: String(p.sortOrder),
          ingredients: p.ingredients ?? "",
          allergens: p.allergens ?? "",
          tags: p.tags.join(", "),
        });
        setSlugManual(true);
      } catch {
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  function updateField<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && !slugManual) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const body = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      categoryId: form.categoryId || null,
      description: form.description.trim(),
      shortDescription: form.shortDescription.trim() || null,
      price: form.price,
      compareAtPrice: form.compareAtPrice.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      badge: form.badge.trim() || null,
      active: form.active,
      available: form.available,
      featured: form.featured,
      sortOrder: parseInt(form.sortOrder, 10) || 0,
      ingredients: form.ingredients.trim() || null,
      allergens: form.allergens.trim() || null,
      tags: form.tags,
    };

    try {
      const url = isEdit ? `/api/admin/products/${productId}` : "/api/admin/products";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { ok: boolean; error?: string; data?: { product: { id: string } } };
      if (!json.ok) {
        setError(json.error ?? "No se pudo guardar el producto.");
        return;
      }
      setSuccess(isEdit ? "Producto actualizado correctamente." : "Producto creado correctamente.");
      if (!isEdit && json.data?.product.id) {
        router.push(`/admin/productos/${json.data.product.id}`);
      }
    } catch {
      setError("No se pudo guardar el producto.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminShell>
        <p className="text-sm text-rusty-cream/50">Cargando producto…</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase text-rusty-cream">
            {isEdit ? "Editar producto" : "Nuevo producto"}
          </h1>
          <p className="mt-2 text-sm text-rusty-cream/60">
            {isEdit ? "Modificá los datos del producto." : "Completá el formulario para publicar."}
          </p>
        </div>
        <Link href="/admin/productos" className={btnSecondary}>
          Volver al listado
        </Link>
      </div>

      {error && (
        <div className="mt-6">
          <AdminAlert type="error" message={error} onDismiss={() => setError(null)} />
        </div>
      )}
      {success && (
        <div className="mt-6">
          <AdminAlert type="success" message={success} onDismiss={() => setSuccess(null)} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <section className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Nombre *</label>
            <input
              required
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
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
                updateField("slug", e.target.value);
              }}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Categoría</label>
            <select
              value={form.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
              className={inputClass}
            >
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Precio *</label>
            <input
              required
              type="text"
              inputMode="decimal"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              className={inputClass}
              placeholder="38.00"
            />
          </div>
          <div>
            <label className={labelClass}>Precio anterior</label>
            <input
              type="text"
              inputMode="decimal"
              value={form.compareAtPrice}
              onChange={(e) => updateField("compareAtPrice", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Badge</label>
            <input
              value={form.badge}
              onChange={(e) => updateField("badge", e.target.value)}
              className={inputClass}
              placeholder="Nuevo, Hot…"
            />
          </div>
          <div className="md:col-span-2">
            <AdminImagePicker
              label="Imagen del producto"
              value={form.imageUrl}
              onChange={(url) => updateField("imageUrl", url)}
              assetType="product"
              placeholder="/rusty/products/classica.svg"
            />
          </div>
        </section>

        <section className="grid gap-4">
          <div>
            <label className={labelClass}>Descripción corta</label>
            <input
              value={form.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Descripción *</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Ingredientes</label>
            <textarea
              rows={2}
              value={form.ingredients}
              onChange={(e) => updateField("ingredients", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Alérgenos</label>
            <textarea
              rows={2}
              value={form.allergens}
              onChange={(e) => updateField("allergens", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Tags (separados por coma)</label>
            <input
              value={form.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              className={inputClass}
              placeholder="smash, cheddar, picante"
            />
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <label className="flex items-center gap-2 text-sm text-rusty-cream/70">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => updateField("active", e.target.checked)}
            />
            Activo
          </label>
          <label className="flex items-center gap-2 text-sm text-rusty-cream/70">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => updateField("available", e.target.checked)}
            />
            Disponible
          </label>
          <label className="flex items-center gap-2 text-sm text-rusty-cream/70">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => updateField("featured", e.target.checked)}
            />
            Destacado
          </label>
          <div>
            <label className={labelClass}>Orden</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => updateField("sortOrder", e.target.value)}
              className={inputClass}
            />
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear producto"}
          </button>
          <Link href="/admin/productos" className={btnSecondary}>
            Cancelar
          </Link>
        </div>
      </form>
    </AdminShell>
  );
}
