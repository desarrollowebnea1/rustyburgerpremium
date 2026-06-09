export type BrandStickerPlacement = {
  id: string;
  src: string;
  src2x?: string;
  src3x?: string;
  alt: string;
  top: string;
  rotate: number;
  delay: number;
  left?: string;
  right?: string;
  scale?: number;
  desktopWidth?: number;
};

/** Hero Panel 1 — calcomanías PNG (sin fondo) */
export const BRAND_STICKERS: BrandStickerPlacement[] = [
  {
    id: "feast-mode",
    src: "/rusty/stickers/sticker-feast-mode.png?v=8",
    src2x: "/rusty/stickers/sticker-feast-mode@2x.png?v=8",
    src3x: "/rusty/stickers/sticker-feast-mode@3x.png?v=8",
    alt: "Sticker Feast Mode On",
    left: "72vw",
    top: "8vh",
    rotate: -4,
    delay: 0.55,
    desktopWidth: 120,
  },
  {
    id: "r-fire",
    src: "/rusty/stickers/sticker-r-fire.png?v=8",
    src2x: "/rusty/stickers/sticker-r-fire@2x.png?v=8",
    src3x: "/rusty/stickers/sticker-r-fire@3x.png?v=8",
    alt: "Sticker R fuego",
    left: "54vw",
    top: "42vh",
    rotate: 11,
    delay: 0.7,
    desktopWidth: 108,
  },
  {
    id: "zero-regrets",
    src: "/rusty/stickers/sticker-zero-regrets.png?v=8",
    src2x: "/rusty/stickers/sticker-zero-regrets@2x.png?v=8",
    src3x: "/rusty/stickers/sticker-zero-regrets@3x.png?v=8",
    alt: "Sticker Zero Regrets",
    left: "64vw",
    top: "70vh",
    rotate: -7,
    delay: 0.78,
    desktopWidth: 112,
  },
];
