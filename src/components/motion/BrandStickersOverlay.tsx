"use client";

import { RUSTY_BRAND_STICKER_PLACEMENTS } from "@/lib/data/brand-sticker-placements";
import { VECTOR_STICKERS } from "@/lib/data/vector-stickers";
import { HeroVectorSticker } from "./HeroVectorSticker";
import { RustyBrandSticker } from "./RustyBrandSticker";

export function BrandStickersLayer() {
  return (
    <>
      {RUSTY_BRAND_STICKER_PLACEMENTS.map((sticker) => (
        <RustyBrandSticker key={sticker.id} {...sticker} />
      ))}
      {VECTOR_STICKERS.map((sticker) => (
        <HeroVectorSticker key={sticker.id} {...sticker} />
      ))}
    </>
  );
}
