import { HERO_CANVAS, HERO_LAYOUT_PX } from "@/lib/data/hero-vicio-layout";
import { HERO_COLLAGE_ROW } from "@/lib/data/hero-collage-vicio";
import { getHomeFooterNavHeight } from "@/lib/hero-footer-align";

export type CollageRowLayout = {
  right: number;
  bottom: number;
  panelWidth: number;
  panelHeight: number;
  gap: number;
};

export type HeroTitleLayout = {
  left: number;
  top: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: string;
  scaleY: number;
  targetWidth: number;
};

/** Altura real del cutout hero-burger-cutout.png (1056×1079) */
const BURGER_ASPECT = 1079 / 1056;

export type HeroLeftEditorialLayout = {
  menuLink: { left: number; top: number; fontSize: number };
  menuLine: {
    left: number;
    top: number;
    fontSize: number;
    maxWidth: number;
    rowGap: number;
  };
};

/** Bloque bajo la burger (zona crema): menú → variedades (3 filas) */
export function computeHeroLeftEditorialLayout(
  scale: number,
  vh?: number,
  vw?: number
): HeroLeftEditorialLayout {
  const colLeft = HERO_LAYOUT_PX.collection.left * scale;
  const B = HERO_LAYOUT_PX.burger;
  const burgerTop = B.top * scale;
  const burgerH = B.width * BURGER_ASPECT * B.heightScale * scale;

  const menuLinkFont = 18 * scale;
  const menuLineFont = 12.5 * scale;
  const rowGap = menuLineFont * 1.42;
  const blockHeight = menuLinkFont * 1.32 + 16 + rowGap * 3;

  /**
   * Zona de las líneas rojas: justo bajo la burger visual (~90% altura),
   * no al pie del PNG (tiene padding transparente).
   */
  let menuLinkTop = burgerTop + burgerH * 0.9 + 8 * scale;

  if (vh) {
    const footerReserve = getHomeFooterNavHeight(vw ?? 1280) + 10;
    const maxTop = vh - footerReserve - blockHeight;
    menuLinkTop = Math.min(menuLinkTop, maxTop);
    menuLinkTop = Math.max(menuLinkTop, burgerTop + burgerH * 0.86);
  }

  const menuLineTop = menuLinkTop + menuLinkFont * 1.32 + 16 * scale;

  return {
    menuLink: {
      left: colLeft,
      top: menuLinkTop,
      fontSize: menuLinkFont,
    },
    menuLine: {
      left: colLeft,
      top: menuLineTop,
      fontSize: menuLineFont,
      maxWidth: 820 * scale,
      rowGap,
    },
  };
}

/** Fila anclada al borde derecho — sin overflow */
export function computeCollageRowLayout(vw: number, scale: number): CollageRowLayout {
  const margin = HERO_COLLAGE_ROW.pageMarginRight;
  const gap = HERO_COLLAGE_ROW.gap * scale;
  let panelW = HERO_COLLAGE_ROW.panelWidth * scale;
  let panelH = HERO_COLLAGE_ROW.panelHeight * scale;

  const maxRowW = vw - margin;
  let rowW = panelW * 3 + gap * 2;

  if (rowW > maxRowW) {
    panelW = (maxRowW - gap * 2) / 3;
    panelH = panelW * (HERO_COLLAGE_ROW.panelHeight / HERO_COLLAGE_ROW.panelWidth);
    rowW = panelW * 3 + gap * 2;
  }

  return {
    right: margin,
    bottom: getHomeFooterNavHeight(vw) + HERO_COLLAGE_ROW.shiftUp,
    panelWidth: panelW,
    panelHeight: panelH,
    gap,
  };
}

/** Centro horizontal de la foto 3 (referencia para la R final) */
export function getCollageImage3CenterX(vw: number, collage: CollageRowLayout): number {
  return vw - collage.right - collage.panelWidth / 2;
}

/**
 * RUSTY BURGER — al costado de la burger, encima de las 3 fotos.
 * La R final termina en el centro de la imagen 3.
 */
export function computeHeroTitleLayout(
  vw: number,
  vh: number,
  scale: number,
  collage: CollageRowLayout
): HeroTitleLayout {
  const T = HERO_LAYOUT_PX.title;
  const collageTop = vh - collage.bottom - collage.panelHeight;
  const scaleY = 1.46;
  const fontSize = T.fontSize * scale * 1.14;
  const titleH = fontSize * T.lineHeight * scaleY;
  const gapAboveCollage = 2;
  const titleLayoutFactor = 0.7;
  const titleShiftRight = 22 * scale;
  const titleShiftDown = 14 * scale;
  const titleLeft = T.left * scale + titleShiftRight;
  const image3Center = getCollageImage3CenterX(vw, collage);

  return {
    left: titleLeft,
    top: Math.max(52, collageTop - gapAboveCollage - titleH * titleLayoutFactor + titleShiftDown),
    fontSize,
    lineHeight: T.lineHeight,
    letterSpacing: T.letterSpacing,
    scaleY,
    targetWidth: Math.max(280, image3Center - titleLeft),
  };
}

/** Meta + handle relativos al título (viewport) */
export function computeHeroTitleMeta(scale: number, title: HeroTitleLayout) {
  const meta = HERO_LAYOUT_PX.meta;
  const handle = HERO_LAYOUT_PX.handle;
  const titleH = title.fontSize * title.lineHeight * title.scaleY;

  return {
    meta: {
      left: title.left,
      top: Math.max(40, title.top - 18),
      fontSize: meta.fontSize * scale,
      iconSize: Math.max(14, Math.round(18 * scale)),
    },
    handle: {
      left: title.left,
      top: title.top + titleH + 6,
      fontSize: handle.fontSize * scale,
    },
  };
}

export const HERO_TITLE_CANVAS_REF = HERO_CANVAS;
