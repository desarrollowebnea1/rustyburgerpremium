export const HOME_PANEL_IDS = ["hero", "products", "promo", "local", "close"] as const;
export type HomePanelId = (typeof HOME_PANEL_IDS)[number];

export const HOME_PANEL_COUNT = HOME_PANEL_IDS.length;

/** Labels para barra de progreso / navegación */
export const HOME_PROGRESS_PANELS = [
  { label: "Inicio" },
  { label: "Menu" },
  { label: "Promos" },
  { label: "Experiencia" },
  { label: "FAQs" },
] as const;

/** Navegación interna de la home horizontal (panel + fallback href SEO) */
export const HOME_NAV_LINKS = [
  { panelId: "products" as HomePanelId, label: "MENU", href: "/menu" },
  { panelId: "promo" as HomePanelId, label: "PROMOS", href: "/promos" },
  { panelId: "local" as HomePanelId, label: "EXPERIENCIA", href: "/nosotros" },
  { panelId: "close" as HomePanelId, label: "FAQS", href: "/faqs" },
] as const;

export function panelIdToIndex(panelId: HomePanelId): number {
  return HOME_PANEL_IDS.indexOf(panelId);
}

export function indexToProgress(index: number): number {
  if (HOME_PANEL_COUNT <= 1) return 0;
  const clamped = Math.min(HOME_PANEL_COUNT - 1, Math.max(0, index));
  return clamped / (HOME_PANEL_COUNT - 1);
}
