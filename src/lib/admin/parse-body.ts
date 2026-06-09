import { parseOptionalPrice, parsePrice } from "@/lib/price";
import { isValidSlug, slugify } from "@/lib/slug";

export function parseBooleanField(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export function parseIntField(value: unknown, fallback?: number): number | undefined {
  if (value === undefined) return fallback;
  const n = typeof value === "number" ? value : parseInt(String(value), 10);
  if (!Number.isFinite(n)) return undefined;
  return n;
}

export function parseOptionalString(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return String(value).trim();
}

export function parseRequiredString(value: unknown, field: string): string | { error: string } {
  const str = parseOptionalString(value);
  if (!str) return { error: `${field} es obligatorio.` };
  return str;
}

export function parseSlugField(
  value: unknown,
  nameFallback?: string
): string | { error: string } {
  const raw =
    value === undefined || value === null || String(value).trim() === ""
      ? nameFallback
        ? slugify(nameFallback)
        : ""
      : String(value).trim();

  if (!raw) return { error: "El slug es obligatorio." };
  if (!isValidSlug(raw)) {
    return { error: "Slug inválido. Usá solo letras minúsculas, números y guiones." };
  }
  return raw;
}

export function parseTagsField(value: unknown): string[] | undefined {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) {
    return value.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

export function parseDateField(value: unknown): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

export { parsePrice, parseOptionalPrice };
