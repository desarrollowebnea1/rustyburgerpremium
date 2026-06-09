export const HOME_PANEL_IDS = ["hero", "products", "promo", "local", "close"] as const;
export type HomePanelId = (typeof HOME_PANEL_IDS)[number];

export const HOME_PANEL_COUNT = HOME_PANEL_IDS.length;

/** Anchors verticales en la home */
export const HOME_SECTION_ANCHORS: Record<HomePanelId, string> = {
  hero: "inicio",
  products: "menu",
  promo: "promos",
  local: "experiencia",
  close: "faqs",
};

const ANCHOR_TO_PANEL: Record<string, HomePanelId> = {
  inicio: "hero",
  menu: "products",
  promos: "promo",
  experiencia: "local",
  faqs: "close",
};

export function panelIdToAnchor(panelId: HomePanelId): string {
  return HOME_SECTION_ANCHORS[panelId];
}

export function anchorToPanelId(anchor: string): HomePanelId | null {
  return ANCHOR_TO_PANEL[anchor] ?? null;
}

/** Labels para barra de progreso / navegación */
export const HOME_PROGRESS_PANELS = [
  { label: "Inicio" },
  { label: "Menu" },
  { label: "Promos" },
  { label: "Experiencia" },
  { label: "FAQs" },
] as const;

/** URL universal: ?panel= en desktop, hash en mobile — ambos resueltos en HomePanelFromUrl */
export function homePanelHref(panelId: HomePanelId): string {
  if (panelId === "hero") return "/";
  return `/?panel=${panelId}`;
}

/** Navegación interna de la home vertical */
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
