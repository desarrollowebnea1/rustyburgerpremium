export const LAST_ORDER_CODE_KEY = "rusty_last_order_code";

/** Normaliza input: trim, uppercase, `000001` → `RB-000001`, `rb-000001` → `RB-000001`. */
export function normalizeOrderCode(raw: string): string {
  const trimmed = raw.trim().toUpperCase();
  if (!trimmed) return "";

  const rbMatch = trimmed.match(/^RB-?(\d+)$/);
  if (rbMatch) {
    return `RB-${rbMatch[1].padStart(6, "0")}`;
  }

  if (/^\d+$/.test(trimmed)) {
    return `RB-${trimmed.padStart(6, "0")}`;
  }

  return trimmed;
}

export function saveLastOrderCode(code: string): void {
  const normalized = normalizeOrderCode(code);
  if (!normalized) return;

  try {
    localStorage.setItem(LAST_ORDER_CODE_KEY, normalized);
  } catch {
    // ignore quota / private mode
  }
}

export function getLastOrderCode(): string | null {
  try {
    const raw = localStorage.getItem(LAST_ORDER_CODE_KEY);
    if (!raw) return null;
    const normalized = normalizeOrderCode(raw);
    return normalized || null;
  } catch {
    return null;
  }
}
