"use client";

import { BRAND_STICKERS } from "@/lib/data/brand-stickers";
import { VECTOR_STICKERS } from "@/lib/data/vector-stickers";
import { DraggableBrandSticker } from "./DraggableBrandSticker";
import { HeroVectorSticker } from "./HeroVectorSticker";

/** Stickers PNG + SVG editoriales — sin fondo */
export function BrandStickersLayer() {
  return (
    <>
      {BRAND_STICKERS.map((sticker) => (
        <DraggableBrandSticker key={sticker.id} {...sticker} />
      ))}
      {VECTOR_STICKERS.map((sticker) => (
        <HeroVectorSticker key={sticker.id} {...sticker} />
      ))}
    </>
  );
}
