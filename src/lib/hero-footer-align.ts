/** Misma geometría que HomeHorizontalNav (max-w-1400 + px-8) */
export const HOME_NAV_MAX_W = 1400;

export function getHomeNavPadding(vw: number): number {
  return vw >= 768 ? 32 : 16;
}

/** Distancia desde el borde derecho del viewport hasta la columna IG/WhatsApp */
export function getHomeFooterRightInset(vw: number): number {
  const pad = getHomeNavPadding(vw);
  const avail = vw - 2 * pad;
  const contentW = Math.min(HOME_NAV_MAX_W, avail);
  const contentLeft = pad + (avail - contentW) / 2;
  return vw - (contentLeft + contentW);
}

/** Altura reservada del footer fijo (iconos + padding) */
export function getHomeFooterNavHeight(vw: number): number {
  return vw >= 768 ? 86 : 74;
}
