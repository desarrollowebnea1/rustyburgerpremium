"use client";

import { motion, useMotionValue } from "framer-motion";
import type { BrandStickerPlacement } from "@/lib/data/brand-stickers";

type DraggableBrandStickerProps = BrandStickerPlacement & {
  zIndex?: number;
};

export function DraggableBrandSticker({
  id,
  src,
  src2x,
  src3x,
  alt,
  left,
  right,
  top,
  rotate,
  scale = 1,
  desktopWidth,
  zIndex = 16,
}: DraggableBrandStickerProps) {
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  return (
    <motion.div
      data-hero-sticker
      data-sticker-id={id}
      className="pointer-events-auto absolute cursor-grab touch-none active:cursor-grabbing"
      style={{
        left: right ? undefined : left,
        right,
        top,
        rotate,
        x: dragX,
        y: dragY,
        scale,
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        srcSet={
          src2x
            ? `${src} 1x, ${src2x} 2x${src3x ? `, ${src3x} 3x` : ""}`
            : undefined
        }
        alt={alt}
        draggable={false}
          className="hero-sticker-3d block h-auto select-none object-contain bg-transparent"
          style={{
          width: desktopWidth ? `${desktopWidth}px` : "108px",
        }}
      />
    </motion.div>
  );
}

export const DraggableSticker = DraggableBrandSticker;
