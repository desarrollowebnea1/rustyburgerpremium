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

/** URL de la home con panel horizontal (fallback fuera de `/`) */
export function homePanelHref(panelId: HomePanelId): string {
  return `/?panel=${panelId}`;
}

/** Navegación interna de la home horizontal */
export const HOME_NAV_LINKS = [
  { panelId: "products" as HomePanelId, label: "MENU", href: homePanelHref("products") },
  { panelId: "promo" as HomePanelId, label: "PROMOS", href: homePanelHref("promo") },
  { panelId: "local" as HomePanelId, label: "EXPERIENCIA", href: homePanelHref("local") },
  { panelId: "close" as HomePanelId, label: "FAQS", href: homePanelHref("close") },
] as const;

export function panelIdToIndex(panelId: HomePanelId): number {
  return HOME_PANEL_IDS.indexOf(panelId);
}

export function indexToProgress(index: number): number {
  if (HOME_PANEL_COUNT <= 1) return 0;
  const clamped = Math.min(HOME_PANEL_COUNT - 1, Math.max(0, index));
  return clamped / (HOME_PANEL_COUNT - 1);
}
