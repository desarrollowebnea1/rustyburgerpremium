import { FEATURED_PRODUCTS, HORIZONTAL_COLLECTION } from "./products";

/** Todas las variedades del menú Rusty */
export const HERO_MENU_VARIETIES = [
  ...FEATURED_PRODUCTS.map((p) => p.name.toUpperCase()),
  ...HORIZONTAL_COLLECTION.map((c) => c.label),
] as const;

/** Tres filas — todas las variedades, llenan el bloque bajo el menú */
export const HERO_MENU_ROWS = [
  HERO_MENU_VARIETIES.slice(0, 4).join(" / "),
  HERO_MENU_VARIETIES.slice(4, 7).join(" / "),
  HERO_MENU_VARIETIES.slice(7).join(" / "),
] as const;
