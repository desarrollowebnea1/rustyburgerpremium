"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminImagePreview } from "@/components/admin/AdminImagePreview";
import { btnPrimary, btnSecondary, inputClass, labelClass } from "@/components/admin/admin-ui";

type ImageItem = {
  id: string;
  url: string;
  alt: string | null;
  type: string | null;
  createdAt: string;
};

type ImagesResponse =
  | { ok: true; data: { images: ImageItem[]; blobConfigured: boolean } }
  | { ok: false; error: string };

type UploadResponse =
  | { ok: true; data: { url: string; id: string; pathname: string | null } }
  | { ok: false; error: string };

type AdminImagePickerProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  assetType?: string;
  placeholder?: string;
};

export function AdminImagePicker({
  value,
  onChange,
  label = "Imagen",
  assetType,
  placeholder = "/rusty/products/classica.svg",
}: AdminImagePickerProps) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [blobConfigured, setBlobConfigured] = useState<boolean | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadLibrary = useCallback(async () => {
    setLibraryLoading(true);
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
    } catch {
      setError("No se pudo cargar la biblioteca de imágenes.");
    } finally {
      setLibraryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    if (assetType) formData.append("type", assetType);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const json = (await res.json()) as UploadResponse;
      if (!json.ok) {
        setError(json.error);
        return;
      }
      onChange(json.data.url);
      await loadLibrary();
    } catch {
      setError("Error al subir la imagen.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }

  function selectFromLibrary(url: string) {
    onChange(url);
    setLibraryOpen(false);
  }

  async function copyUrl() {
    if (!value.trim()) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("No se pudo copiar la URL.");
    }
  }

  return (
    <div className="space-y-3">
      <label className={labelClass}>{label}</label>

      {blobConfigured === false && (
        <AdminAlert
          type="error"
          message="Upload no disponible: falta BLOB_READ_WRITE_TOKEN. Podés usar URL manual."
        />
      )}

      <div className="flex flex-wrap items-start gap-4">
        <AdminImagePreview
          src={value}
          alt="Imagen seleccionada"
          className="h-28 w-28 shrink-0 object-cover border border-rusty-gray/40"
        />

        <div className="min-w-0 flex-1 space-y-3">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
            placeholder={placeholder}
          />

          <div className="flex flex-wrap gap-2">
            <input
              ref={fileRef}
              id={inputId}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={onFileChange}
              disabled={uploading || blobConfigured === false}
            />
            <button
              type="button"
              className={btnSecondary}
              disabled={uploading || blobConfigured === false}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? "Subiendo…" : "Subir imagen"}
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => {
                setLibraryOpen(true);
                loadLibrary();
              }}
            >
              Biblioteca
            </button>
            {value.trim() && (
              <>
                <button type="button" className={btnSecondary} onClick={copyUrl}>
                  {copied ? "Copiada" : "Copiar URL"}
                </button>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => onChange("")}
                >
                  Quitar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {error && <AdminAlert type="error" message={error} />}

      {libraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col border border-rusty-gray/40 bg-rusty-carbon">
            <div className="flex items-center justify-between border-b border-rusty-gray/40 px-4 py-3">
              <h3 className="font-display text-sm uppercase tracking-wider text-rusty-cream">
                Biblioteca de imágenes
              </h3>
              <button
                type="button"
                onClick={() => setLibraryOpen(false)}
                className="font-display text-xs uppercase text-rusty-cream/50 hover:text-rusty-orange"
              >
                Cerrar
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              {libraryLoading ? (
                <p className="text-sm text-rusty-cream/50">Cargando imágenes…</p>
              ) : images.length === 0 ? (
                <p className="text-sm text-rusty-cream/50">
                  No hay imágenes en la biblioteca. Subí una desde el picker o desde Imágenes.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => selectFromLibrary(img.url)}
                      className={`border p-2 text-left transition-colors hover:border-rusty-orange ${
                        value === img.url
                          ? "border-rusty-orange bg-rusty-orange/10"
                          : "border-rusty-gray/40"
                      }`}
                    >
                      <AdminImagePreview
                        src={img.url}
                        alt={img.alt ?? "Imagen"}
                        className="mb-2 h-24 w-full object-cover"
                      />
                      <p className="truncate text-[10px] text-rusty-cream/50">{img.url}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-rusty-gray/40 px-4 py-3">
              <button type="button" onClick={() => setLibraryOpen(false)} className={btnPrimary}>
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
