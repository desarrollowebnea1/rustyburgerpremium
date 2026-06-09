"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminImagePreview } from "@/components/admin/AdminImagePreview";
import { AdminBoolBadge } from "@/components/admin/AdminBoolBadge";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminShell } from "@/components/admin/AdminShell";
import { btnPrimary, inputClass } from "@/components/admin/admin-ui";
import { formatCurrency } from "@/lib/cart-utils";

type ProductItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  active: boolean;
  available: boolean;
  featured: boolean;
  sortOrder: number;
  categoryId: string | null;
  categoryName: string | null;
};

type CategoryOption = { id: string; name: string };

type ProductsResponse =
  | { ok: true; data: { products: ProductItem[] } }
  | { ok: false; error: string };

export function AdminProductsListClient() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [availableFilter, setAvailableFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<ProductItem | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("q", search.trim());
      if (categoryFilter) params.set("categoryId", categoryFilter);
      if (activeFilter) params.set("active", activeFilter);
      if (availableFilter) params.set("available", availableFilter);
      if (featuredFilter) params.set("featured", featuredFilter);

      const query = params.toString() ? `?${params}` : "";
      const res = await fetch(`/api/admin/products${query}`);
      const json = (await res.json()) as ProductsResponse;
      if (!json.ok) {
        setError(json.error);
        setProducts([]);
        return;
      }
      setProducts(json.data.products);
    } catch {
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, activeFilter, availableFilter, featuredFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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

  async function patchProduct(id: string, patch: Record<string, boolean>) {
    setActionLoading(id);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        setError(json.error ?? "Error al actualizar.");
        return;
      }
      setSuccess("Producto actualizado.");
      await loadProducts();
    } catch {
      setError("Error al actualizar el producto.");
    } finally {
      setActionLoading(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, { method: "DELETE" });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        setError(json.error ?? "No se pudo eliminar.");
        return;
      }
      setSuccess(`"${deleteTarget.name}" eliminado.`);
      setDeleteTarget(null);
      await loadProducts();
    } catch {
      setError("Error al eliminar el producto.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase text-rusty-cream">Productos</h1>
          <p className="mt-2 text-sm text-rusty-cream/60">
            Gestioná el menú, precios y disponibilidad.
          </p>
        </div>
        <Link href="/admin/productos/nuevo" className={btnPrimary}>
          Nuevo producto
        </Link>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <input
          type="search"
          placeholder="Buscar por nombre…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={inputClass}
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)} className={inputClass}>
          <option value="">Activo: todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
        <select
          value={availableFilter}
          onChange={(e) => setAvailableFilter(e.target.value)}
          className={inputClass}
        >
          <option value="">Disponible: todos</option>
          <option value="true">Disponibles</option>
          <option value="false">No disponibles</option>
        </select>
        <select
          value={featuredFilter}
          onChange={(e) => setFeaturedFilter(e.target.value)}
          className={inputClass}
        >
          <option value="">Destacado: todos</option>
          <option value="true">Destacados</option>
          <option value="false">No destacados</option>
        </select>
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
        <p className="mt-8 text-sm text-rusty-cream/50">Cargando productos…</p>
      ) : products.length === 0 ? (
        <p className="mt-8 text-sm text-rusty-cream/50">No hay productos para mostrar.</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-rusty-gray/40">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-rusty-smoke text-xs uppercase tracking-wider text-rusty-cream/50">
              <tr>
                <th className="px-4 py-3">Imagen</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Orden</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-rusty-gray/30">
                  <td className="px-4 py-3">
                    <AdminImagePreview
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-12 w-12 object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-rusty-cream">{product.name}</p>
                    <p className="text-xs text-rusty-cream/40">{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-rusty-cream/70">{product.categoryName ?? "—"}</td>
                  <td className="px-4 py-3 text-rusty-cream">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <AdminBoolBadge value={product.active} trueLabel="Activo" falseLabel="Inactivo" />
                      <AdminBoolBadge
                        value={product.available}
                        trueLabel="Disponible"
                        falseLabel="No disp."
                      />
                      {product.featured && (
                        <span className="text-[10px] uppercase text-rusty-orange">Destacado</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-rusty-cream/50">{product.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/admin/productos/${product.id}`}
                        className="font-display text-xs uppercase text-rusty-orange hover:underline"
                      >
                        Editar
                      </Link>
                      <a
                        href="/menu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-display text-xs uppercase text-rusty-cream/50 hover:text-rusty-orange"
                      >
                        Ver en web
                      </a>
                      <button
                        type="button"
                        disabled={actionLoading === product.id}
                        onClick={() => patchProduct(product.id, { active: !product.active })}
                        className="text-left font-display text-[10px] uppercase text-rusty-cream/50 hover:text-rusty-orange disabled:opacity-60"
                      >
                        {product.active ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === product.id}
                        onClick={() => patchProduct(product.id, { available: !product.available })}
                        className="text-left font-display text-[10px] uppercase text-rusty-cream/50 hover:text-rusty-orange disabled:opacity-60"
                      >
                        {product.available ? "No disponible" : "Disponible"}
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === product.id}
                        onClick={() => patchProduct(product.id, { featured: !product.featured })}
                        className="text-left font-display text-[10px] uppercase text-rusty-cream/50 hover:text-rusty-orange disabled:opacity-60"
                      >
                        {product.featured ? "Quitar destacado" : "Destacar"}
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading === product.id}
                        onClick={() => setDeleteTarget(product)}
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
        title="Eliminar producto"
        message={
          deleteTarget
            ? `¿Eliminar "${deleteTarget.name}"? Esta acción no se puede deshacer.`
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
