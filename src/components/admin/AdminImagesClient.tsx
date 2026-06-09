"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminImagePreview } from "@/components/admin/AdminImagePreview";
import { AdminShell } from "@/components/admin/AdminShell";
import { btnPrimary, btnSecondary, inputClass, labelClass } from "@/components/admin/admin-ui";

type ImageItem = {
  id: string;
  url: string;
  pathname: string | null;
  alt: string | null;
  type: string | null;
  createdAt: string;
};

type ImagesResponse =
  | { ok: true; data: { images: ImageItem[]; blobConfigured: boolean } }
  | { ok: false; error: string };

export function AdminImagesClient() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<ImageItem[]>([]);
  const [blobConfigured, setBlobConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ImageItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [editAlt, setEditAlt] = useState<Record<string, string>>({});
  const [editType, setEditType] = useState<Record<string, string>>({});

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/images?limit=100");
      const json = (await res.json()) as ImagesResponse;
      if (!json.ok) {
        setError(json.error);
        setImages([]);
        return;
      }
      setImages(json.data.images);
      setBlobConfigured(json.data.blobConfigured);
      const altMap: Record<string, string> = {};
      const typeMap: Record<string, string> = {};
      for (const img of json.data.images) {
        altMap[img.id] = img.alt ?? "";
        typeMap[img.id] = img.type ?? "";
      }
      setEditAlt(altMap);
      setEditType(typeMap);
    } catch {
      setError("No se pudieron cargar las imágenes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        setError(json.error ?? "Error al subir.");
        return;
      }
      setSuccess("Imagen subida correctamente.");
      await loadImages();
    } catch {
      setError("Error al subir la imagen.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function saveMeta(image: ImageItem) {
    setSavingId(image.id);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/images/${image.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alt: editAlt[image.id] ?? "",
          type: editType[image.id] ?? "",
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        setError(json.error ?? "Error al guardar.");
        return;
      }
      setSuccess("Metadatos actualizados.");
      await loadImages();
    } catch {
      setError("Error al guardar metadatos.");
    } finally {
      setSavingId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setSavingId(deleteTarget.id);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/images/${deleteTarget.id}`, { method: "DELETE" });
      const json = (await res.json()) as { ok: boolean; error?: string; data?: { message?: string } };
      if (!json.ok) {
        setError(json.error ?? "No se pudo eliminar.");
        return;
      }
      setSuccess(json.data?.message ?? "Imagen eliminada.");
      setDeleteTarget(null);
      await loadImages();
    } catch {
      setError("Error al eliminar la imagen.");
    } finally {
      setSavingId(null);
    }
  }

  async function copyUrl(id: string, url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setError("No se pudo copiar la URL.");
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase text-rusty-cream">Imágenes</h1>
          <p className="mt-2 text-sm text-rusty-cream/60">
            Subí y gestioná la biblioteca media del negocio.
          </p>
        </div>
      </div>

      {!blobConfigured && (
        <div className="mt-6">
          <AdminAlert
            type="error"
            message="Upload no disponible: falta BLOB_READ_WRITE_TOKEN. Podés seguir usando URLs manuales en productos, categorías y promos."
          />
        </div>
      )}

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

      <div className="mt-8 border border-rusty-gray/40 p-6">
        <h2 className="font-display text-sm uppercase tracking-wider text-rusty-orange">
          Subir nueva imagen
        </h2>
        <p className="mt-2 text-xs text-rusty-cream/50">JPEG, PNG o WEBP — máximo 5 MB</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={!blobConfigured || uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
          <button
            type="button"
            className={btnPrimary}
            disabled={!blobConfigured || uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? "Subiendo…" : "Elegir archivo"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-rusty-cream/50">Cargando biblioteca…</p>
      ) : images.length === 0 ? (
        <p className="mt-8 text-sm text-rusty-cream/50">No hay imágenes en la biblioteca.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <article
              key={img.id}
              className="flex flex-col border border-rusty-gray/40 bg-rusty-smoke/30 p-4"
            >
              <AdminImagePreview
                src={img.url}
                alt={img.alt ?? "Imagen"}
                className="mb-3 h-40 w-full object-cover border border-rusty-gray/40"
              />

              <p className="truncate text-[10px] text-rusty-cream/40" title={img.url}>
                {img.url}
              </p>
              <p className="mt-1 text-[10px] text-rusty-cream/30">
                {new Date(img.createdAt).toLocaleString("es-AR")}
              </p>

              <div className="mt-3 space-y-2">
                <div>
                  <label className={labelClass}>Alt</label>
                  <input
                    value={editAlt[img.id] ?? ""}
                    onChange={(e) =>
                      setEditAlt((prev) => ({ ...prev, [img.id]: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Tipo</label>
                  <input
                    value={editType[img.id] ?? ""}
                    onChange={(e) =>
                      setEditType((prev) => ({ ...prev, [img.id]: e.target.value }))
                    }
                    className={inputClass}
                    placeholder="product, promo, category…"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className={btnSecondary}
                  disabled={savingId === img.id}
                  onClick={() => saveMeta(img)}
                >
                  {savingId === img.id ? "…" : "Guardar"}
                </button>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => copyUrl(img.id, img.url)}
                >
                  {copiedId === img.id ? "Copiada" : "Copiar URL"}
                </button>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => setDeleteTarget(img)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="Eliminar imagen"
        message={
          deleteTarget
            ? "¿Eliminar esta imagen de la biblioteca? No se puede eliminar si está en uso."
            : ""
        }
        confirmLabel="Eliminar"
        loading={!!savingId && !!deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}
