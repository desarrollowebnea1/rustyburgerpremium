/**
 * Fila urbana — 3 burgers @ 1920×1080.
 * Anclada al borde derecho (foto 3 = encima IG/WhatsApp).
 */
export type HeroCollagePanelId = "collage-1" | "collage-2" | "collage-3";

/** Proporción JPG recortados (378×434) — evita bandas con contain */
const PANEL_ASPECT = 434 / 378;

export const HERO_COLLAGE_ROW = {
  panelWidth: 408,
  /** Misma proporción que los JPG (378×434) — sin bandas */
  panelHeight: Math.round(408 * PANEL_ASPECT),
  gap: 22,
  /** Margen derecho = borde de página (px) — foto 3 anclada acá */
  pageMarginRight: 16,
  /** Mayor = fila más arriba */
  shiftUp: 26,
  zIndex: 14,
} as const;

/** Orden izquierda → derecha: 1, 2, 3 */
export const HERO_COLLAGE_ORDER: HeroCollagePanelId[] = [
  "collage-1",
  "collage-2",
  "collage-3",
];

export const HERO_COLLAGE_ROTATE: Record<HeroCollagePanelId, number> = {
  "collage-1": -0.35,
  "collage-2": 0,
  "collage-3": 0.35,
};
