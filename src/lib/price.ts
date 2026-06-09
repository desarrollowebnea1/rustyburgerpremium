import { Prisma } from "@prisma/client";

/** Convierte "R$ 38", "38,00", "38.00" → Decimal Prisma */
export function parsePrice(raw: string | number): Prisma.Decimal | null {
  if (typeof raw === "number") {
    if (!Number.isFinite(raw) || raw < 0) return null;
    return new Prisma.Decimal(raw.toFixed(2));
  }

  const trimmed = raw.trim();
  if (!trimmed) return null;

  const cleaned = trimmed
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");

  const num = parseFloat(cleaned);
  if (!Number.isFinite(num) || num < 0) return null;
  return new Prisma.Decimal(num.toFixed(2));
}

export function parseOptionalPrice(raw: unknown): Prisma.Decimal | null | undefined {
  if (raw === undefined) return undefined;
  if (raw === null || raw === "") return null;
  if (typeof raw === "number" || typeof raw === "string") {
    return parsePrice(raw);
  }
  return null;
}

export function decimalToNumber(value: Prisma.Decimal | null | undefined): number | null {
  if (value == null) return null;
  const n = parseFloat(value.toString());
  return Number.isFinite(n) ? n : null;
}
