export type HeroCollagePanel = {
  id: string;
  defaultSrc: string;
  hoverSrc: string;
  defaultSrc2x: string;
  hoverSrc2x: string;
  alt: string;
  hoverAlt: string;
};

const base = "/rusty/hero/collage";

/** 3 paneles iguales + hover (6 burgers) */
export const HERO_COLLAGE_PANELS: HeroCollagePanel[] = [
  {
    id: "collage-1",
    defaultSrc: `${base}/burger-chill-cheese.jpg`,
    hoverSrc: `${base}/burger-classica.jpg`,
    defaultSrc2x: `${base}/burger-chill-cheese@2x.jpg`,
    hoverSrc2x: `${base}/burger-classica@2x.jpg`,
    alt: "Chill Cheese Rusty Burger",
    hoverAlt: "Clássica Rusty Burger",
  },
  {
    id: "collage-2",
    defaultSrc: `${base}/burger-feast-mode.jpg`,
    hoverSrc: `${base}/burger-pao-tostado.jpg`,
    defaultSrc2x: `${base}/burger-feast-mode@2x.jpg`,
    hoverSrc2x: `${base}/burger-pao-tostado@2x.jpg`,
    alt: "Feast Mode Rusty Burger",
    hoverAlt: "Pão Tostado Rusty Burger",
  },
  {
    id: "collage-3",
    defaultSrc: `${base}/burger-onion.jpg`,
    hoverSrc: `${base}/burger-melt.jpg`,
    defaultSrc2x: `${base}/burger-onion@2x.jpg`,
    hoverSrc2x: `${base}/burger-melt@2x.jpg`,
    alt: "Onion Rusty Burger",
    hoverAlt: "Melt Rusty Burger",
  },
];
