"use client";

import { RUSTY_BRAND_STICKER_PLACEMENTS } from "@/lib/data/brand-sticker-placements";
import { RustyBrandSticker } from "./RustyBrandSticker";

/** Solo 3 calcomanías SVG — sin PNG ni fondos sucios */
export function BrandStickersLayer() {
  return (
    <>
      {RUSTY_BRAND_STICKER_PLACEMENTS.map((sticker) => (
        <RustyBrandSticker key={sticker.id} {...sticker} />
      ))}
    </>
  );
}
