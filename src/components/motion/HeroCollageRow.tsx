"use client";

import { HERO_COLLAGE_PANELS } from "@/lib/data/hero-collage-panels";
import { HERO_VICIO_SPEC } from "@/lib/data/hero-vicio-spec";
import { HeroCollageHoverPanel } from "./HeroCollageHoverPanel";

/** 3 imágenes Vicio — sandwich editorial */
export function HeroCollageRow() {
  const { collageRow } = HERO_VICIO_SPEC;

  return (
    <div
      className="pointer-events-auto flex items-stretch"
      style={{
        marginTop: collageRow.marginTop,
        marginLeft: collageRow.marginLeft,
        width: collageRow.width,
        height: collageRow.height,
        gap: collageRow.gap,
      }}
    >
      {HERO_COLLAGE_PANELS.map((panel) => (
        <HeroCollageHoverPanel key={panel.id} {...panel} />
      ))}
    </div>
  );
}
