"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminImagePicker } from "@/components/admin/AdminImagePicker";
import { AdminImagePreview } from "@/components/admin/AdminImagePreview";
import { AdminBoolBadge } from "@/components/admin/AdminBoolBadge";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminShell } from "@/components/admin/AdminShell";
import { btnPrimary, btnSecondary, inputClass, labelClass } from "@/components/admin/admin-ui";
import { slugify } from "@/lib/slug";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  active: boolean;
  sortOrder: number;
  productCount: number;
};

type CategoryForm = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  active: boolean;
  sortOrder: string;
};

const EMPTY_FORM: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  active: true,
  sortOrder: "0",
};

export function AdminCategoriesClient() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);
  const [slugManual, setSlugManual] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories");
      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
        data?: { categories: CategoryItem[] };
      };
      if (!json.ok) {
        setError(json.error ?? "Error al cargar.");
        setCategories([]);
        return;
      }
      setCategories(json.data?.categories ?? []);
    } catch {
      setError("No se pudieron cargar las categorías.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setSlugManual(false);
    setEditingId(null);
    setShowForm(false);
  }

  function startCreate() {
    resetForm();
    setShowForm(true);
  }

  function startEdit(cat: CategoryItem) {
    setEditingId(cat.id);
    setShowForm(true);
    setSlugManual(true);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? "",
      imageUrl: cat.imageUrl ?? "",
      active: cat.active,
      sortOrder: String(cat.sortOrder),
    });
    setError(null);
    setSuccess(null);
  }

  function updateName(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugManual ? prev.slug : slugify(name),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const body = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      active: form.active,
      sortOrder: parseInt(form.sortOrder, 10) || 0,
    };

    try {
      const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        setError(json.error ?? "No se pudo guardar la categoría.");
        return;
      }
      setSuccess(
        editingId ? "Categoría actualizada correctamente." : "Categoría creada correctamente."
      );
      resetForm();
      await loadCategories();
    } catch {
      setError("No se pudo guardar la categoría.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(cat: CategoryItem) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !cat.active }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        setError(json.error ?? "Error al actualizar.");
        return;
      }
      setSuccess("Categoría actualizada correctamente.");
      await loadCategories();
    } catch {
      setError("Error al actualizar.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, { method: "DELETE" });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        setError(json.error ?? "No se pudo eliminar.");
        return;
      }
      setSuccess("Categoría eliminada correctamente.");
      setDeleteTarget(null);
      await loadCategories();
    } catch {
      setError("Error al eliminar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase text-rusty-cream">Categorías</h1>
          <p className="mt-2 text-sm text-rusty-cream/60">Organizá el menú por secciones.</p>
        </div>
        {!showForm && (
          <button type="button" onClick={startCreate} className={btnPrimary}>
            Nueva categoría
          </button>
        )}
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

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-8 border border-rusty-gray/40 p-6">
          <h2 className="font-display text-lg uppercase text-rusty-cream">
            {editingId ? "Editar categoría" : "Nueva categoría"}
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Nombre *</label>
              <input
                required
                value={form.name}
                onChange={(e) => updateName(e.target.value)}
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
            <div className="md:col-span-2">
              <label className={labelClass}>Descripción</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <AdminImagePicker
                label="Imagen de la categoría"
                value={form.imageUrl}
                onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
                assetType="category"
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
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving ? "Guardando…" : editingId ? "Guardar" : "Crear"}
            </button>
            <button type="button" onClick={resetForm} className={btnSecondary}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-rusty-cream/50">Cargando categorías…</p>
      ) : categories.length === 0 ? (
        <p className="mt-8 text-sm text-rusty-cream/50">No hay categorías.</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-rusty-gray/40">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-rusty-smoke text-xs uppercase tracking-wider text-rusty-cream/50">
              <tr>
                <th className="px-4 py-3">Imagen</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Productos</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Orden</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t border-rusty-gray/30">
                  <td className="px-4 py-3">
                    <AdminImagePreview
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="h-10 w-10 object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 text-rusty-cream">{cat.name}</td>
                  <td className="px-4 py-3 text-rusty-cream/50">{cat.slug}</td>
                  <td className="px-4 py-3 text-rusty-cream/70">{cat.productCount}</td>
                  <td className="px-4 py-3">
                    <AdminBoolBadge value={cat.active} trueLabel="Activa" falseLabel="Inactiva" />
                  </td>
                  <td className="px-4 py-3 text-rusty-cream/50">{cat.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(cat)}
                        className="text-left font-display text-xs uppercase text-rusty-orange hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => toggleActive(cat)}
                        className="text-left font-display text-[10px] uppercase text-rusty-cream/50 hover:text-rusty-orange disabled:opacity-60"
                      >
                        {cat.active ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        type="button"
                        disabled={saving || cat.productCount > 0}
                        onClick={() => setDeleteTarget(cat)}
                        title={
                          cat.productCount > 0
                            ? "Tiene productos vinculados"
                            : "Eliminar categoría"
                        }
                        className="text-left font-display text-[10px] uppercase text-rusty-fire hover:underline disabled:cursor-not-allowed disabled:opacity-40"
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
        title="Eliminar categoría"
        message={
          deleteTarget
            ? `¿Eliminar "${deleteTarget.name}"? Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar"
        loading={saving}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}
