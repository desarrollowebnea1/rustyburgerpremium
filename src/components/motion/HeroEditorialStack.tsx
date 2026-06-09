"use client";

import { HERO_VICIO_SPEC } from "@/lib/data/hero-vicio-spec";
import { HeroCollageRow } from "./HeroCollageRow";
import { RustyWordmark } from "./RustyWordmark";

type HeroEditorialStackProps = {
  play?: boolean;
};

/** Bloque superior derecho Vicio: meta + título + fotos */
export function HeroEditorialStack({ play = true }: HeroEditorialStackProps) {
  const { editorial } = HERO_VICIO_SPEC;

  return (
    <div
      className="absolute z-[17]"
      style={{
        top: editorial.top,
        right: editorial.right,
        width: editorial.width,
      }}
    >
      <div id="hero-wordmark" style={{ paddingLeft: editorial.titlePaddingLeft }}>
        <RustyWordmark play={play} className="hero-vicio-title" />
      </div>

      <HeroCollageRow />
    </div>
  );
}
