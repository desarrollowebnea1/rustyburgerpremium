import type { RustyBrandStickerVariant } from "@/components/motion/RustyBrandStickerArt";

export type LocalImage = {
  src: string;
  alt: string;
};

export const BARRA_SHOT: LocalImage = {
  src: "/rusty/local/barra-local.jpg",
  alt: "Rusty Food House — fachada del local",
};

export type CartelSticker = {
  variant: RustyBrandStickerVariant;
  alt: string;
};

/** 3 stickers SVG — panel experiencia */
export const CARTELES_STICKERS: CartelSticker[] = [
  { variant: "feast-mode", alt: "Sticker Feast Mode On" },
  { variant: "r-fire", alt: "Sticker La R" },
  { variant: "zero-regrets", alt: "Sticker Zero Regrets" },
];
