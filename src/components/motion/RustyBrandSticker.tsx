"use client";

import { motion, useMotionValue } from "framer-motion";
import type { BrandStickerPlacement } from "@/lib/data/brand-sticker-placements";
import { RustyBrandStickerArt } from "./RustyBrandStickerArt";

type Props = BrandStickerPlacement & { zIndex?: number };

export function RustyBrandSticker({
  id,
  variant,
  left,
  top,
  rotate,
  width,
  zIndex = 16,
}: Props) {
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  return (
    <motion.div
      data-hero-sticker
      data-sticker-id={id}
      className="pointer-events-auto absolute cursor-grab touch-none active:cursor-grabbing"
      style={{
        left,
        top,
        rotate,
        width,
        x: dragX,
        y: dragY,
        zIndex,
      }}
      drag
      dragElastic={0}
      dragMomentum={false}
      whileDrag={{ zIndex: 40, cursor: "grabbing" }}
      data-lenis-prevent
      data-lenis-prevent-touch
      aria-hidden
    >
      <RustyBrandStickerArt
        variant={variant}
        className="hero-sticker-3d block h-auto w-full select-none"
      />
    </motion.div>
  );
}
