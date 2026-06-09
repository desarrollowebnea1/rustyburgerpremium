"use client";

import { useEffect, useState } from "react";
import { HERO_COLLAGE_ORDER, HERO_COLLAGE_ROTATE } from "@/lib/data/hero-collage-vicio";
import { HERO_COLLAGE_PANELS } from "@/lib/data/hero-collage-panels";
import { computeCollageRowLayout, type CollageRowLayout } from "@/lib/hero-collage-layout";

const PANEL_BY_ID = Object.fromEntries(HERO_COLLAGE_PANELS.map((p) => [p.id, p]));

const FALLBACK: CollageRowLayout = {
  right: 16,
  bottom: 112,
  panelWidth: 408,
  panelHeight: 469,
  gap: 22,
};

type HeroCollageRowFixedProps = {
  scale: number;
};

/**
 * 3 burgers — capa independiente del canvas.
 * Borde derecho foto 3 = margen de página, sin overflow.
 */
export function HeroCollageRowFixed({ scale }: HeroCollageRowFixedProps) {
  const [layout, setLayout] = useState<CollageRowLayout>(FALLBACK);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => setVisible(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);

    const onResize = () => {
      setLayout(computeCollageRowLayout(window.innerWidth, scale));
    };
    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("resize", onResize);
    };
  }, [scale]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute z-[15] flex max-w-full items-stretch"
      style={{
        right: layout.right,
        bottom: layout.bottom,
        gap: layout.gap,
      }}
      aria-hidden={false}
    >
      {HERO_COLLAGE_ORDER.map((panelId) => {
        const panel = PANEL_BY_ID[panelId];
        if (!panel) return null;
        return (
          <div
            key={panelId}
            className="hero-collage-piece group pointer-events-auto shrink-0 cursor-pointer"
            style={
              {
                width: layout.panelWidth,
                height: layout.panelHeight,
                "--collage-rotate": `${HERO_COLLAGE_ROTATE[panelId]}deg`,
              } as React.CSSProperties
            }
          >
            <HeroCollagePanelImg {...panel} />
          </div>
        );
      })}
    </div>
  );
}

function HeroCollagePanelImg({
  defaultSrc,
  hoverSrc,
  defaultSrc2x,
  hoverSrc2x,
  alt,
  hoverAlt,
}: (typeof HERO_COLLAGE_PANELS)[number]) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={defaultSrc}
        srcSet={`${defaultSrc} 1x, ${defaultSrc2x} 2x`}
        alt={alt}
        draggable={false}
        className="h-full w-full object-contain object-center transition-opacity duration-[700ms] ease-out group-hover:opacity-0"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={hoverSrc}
        srcSet={`${hoverSrc} 1x, ${hoverSrc2x} 2x`}
        alt={hoverAlt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-contain object-center opacity-0 transition-opacity duration-[700ms] ease-out group-hover:opacity-100"
      />
    </div>
  );
}
