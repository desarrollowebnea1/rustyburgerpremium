import type { RustyBrandStickerVariant } from "@/components/motion/RustyBrandStickerArt";

export type BrandStickerPlacement = {
  id: string;
  variant: RustyBrandStickerVariant;
  left: string;
  top: string;
  rotate: number;
  width: number;
};

/** Hero — solo 3 calcomanías SVG limpias */
export const RUSTY_BRAND_STICKER_PLACEMENTS: BrandStickerPlacement[] = [
  {
    id: "feast-mode",
    variant: "feast-mode",
    left: "72vw",
    top: "8vh",
    rotate: -4,
    width: 120,
  },
  {
    id: "r-fire",
    variant: "r-fire",
    left: "54vw",
    top: "42vh",
    rotate: 11,
    width: 108,
  },
  {
    id: "zero-regrets",
    variant: "zero-regrets",
    left: "64vw",
    top: "70vh",
    rotate: -7,
    width: 128,
  },
];

export const RUSTY_BRAND_STICKER_VARIANTS: RustyBrandStickerVariant[] = [
  "feast-mode",
  "r-fire",
  "zero-regrets",
];
