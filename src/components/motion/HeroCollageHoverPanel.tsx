"use client";

import type { HeroCollagePanel } from "@/lib/data/hero-collage-panels";

export function HeroCollageHoverPanel({
  defaultSrc,
  hoverSrc,
  defaultSrc2x,
  hoverSrc2x,
  alt,
  hoverAlt,
}: HeroCollagePanel) {
  const defaultSet = `${defaultSrc} 1x, ${defaultSrc2x} 2x`;
  const hoverSet = `${hoverSrc} 1x, ${hoverSrc2x} 2x`;

  return (
    <div className="cutout-right relative h-full min-h-0 flex-1">
      <div className="group relative flex h-full w-full cursor-pointer items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={defaultSrc}
          srcSet={defaultSet}
          alt={alt}
          draggable={false}
          decoding="async"
          className="h-full w-full object-contain object-center transition-opacity duration-[400ms] ease-out group-hover:opacity-0"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hoverSrc}
          srcSet={hoverSet}
          alt={hoverAlt}
          draggable={false}
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain object-center opacity-0 transition-opacity duration-[400ms] ease-out group-hover:opacity-100"
        />
      </div>
    </div>
  );
}
