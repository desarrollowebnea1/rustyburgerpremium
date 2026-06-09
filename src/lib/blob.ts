import { del, put } from "@vercel/blob";

export const BLOB_CONFIG = {
  productsPrefix: "products/",
  promosPrefix: "promos/",
  localPrefix: "local/",
  uploadPrefix: "rusty/",
} as const;

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;

export class BlobNotConfiguredError extends Error {
  constructor() {
    super("BLOB_NOT_CONFIGURED");
  }
}

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function getBlobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || undefined;
}

export function validateImageFile(file: File): { ok: true } | { ok: false; error: string; status: number } {
  if (!ALLOWED_TYPES.has(file.type)) {
    return {
      ok: false,
      error: "Tipo de archivo no permitido. Usá JPEG, PNG o WEBP.",
      status: 400,
    };
  }
  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      error: "El archivo supera el máximo de 5 MB.",
      status: 413,
    };
  }
  return { ok: true };
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function uploadImageToBlob(file: File, options?: { prefix?: string }) {
  if (!isBlobConfigured()) {
    throw new BlobNotConfiguredError();
  }

  const validation = validateImageFile(file);
  if (!validation.ok) {
    throw new UploadValidationError(validation.error, validation.status);
  }

  const prefix = options?.prefix ?? BLOB_CONFIG.uploadPrefix;
  const safeName = sanitizeFilename(file.name || "image");
  const pathname = `${prefix}${Date.now()}-${safeName}`;

  const blob = await put(pathname, file, {
    access: "public",
    contentType: file.type,
    token: getBlobToken(),
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
    contentType: file.type,
  };
}

export async function deleteImageFromBlob(url: string): Promise<boolean> {
  if (!isBlobConfigured()) return false;
  try {
    await del(url, { token: getBlobToken() });
    return true;
  } catch {
    return false;
  }
}

export function isVercelBlobUrl(url: string): boolean {
  return url.includes("blob.vercel-storage.com");
}

export class UploadValidationError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
