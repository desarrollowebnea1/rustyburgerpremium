"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HERO_MENU_ROWS } from "@/lib/data/hero-menu-line";
import {
  computeHeroLeftEditorialLayout,
  type HeroLeftEditorialLayout,
} from "@/lib/hero-collage-layout";

const FALLBACK: HeroLeftEditorialLayout = {
  menuLink: { left: 98, top: 760, fontSize: 18 },
  menuLine: { left: 98, top: 802, fontSize: 12.5, maxWidth: 820, rowGap: 18 },
};

type HeroLeftEditorialFixedProps = {
  scale: number;
};

/** Menú + variedades — directamente bajo la burger */
export function HeroLeftEditorialFixed({ scale }: HeroLeftEditorialFixedProps) {
  const [layout, setLayout] = useState<HeroLeftEditorialLayout>(FALLBACK);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => setVisible(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);

    const onResize = () =>
      setLayout(
        computeHeroLeftEditorialLayout(scale, window.innerHeight, window.innerWidth)
      );
    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("resize", onResize);
    };
  }, [scale]);

  if (!visible) return null;

  const { menuLink, menuLine } = layout;

  return (
    <>
      <Link
        href="/menu"
        id="hero-menu-editorial"
        className="hero-menu-editorial-link group absolute z-[20]"
        style={{
          left: menuLink.left,
          top: menuLink.top,
          fontSize: menuLink.fontSize,
        }}
      >
        Aquí tenés nuestro menú{" "}
        <span className="hero-menu-editorial-arrow" aria-hidden>
          →
        </span>
      </Link>

      {HERO_MENU_ROWS.map((row, index) => (
        <p
          key={row}
          className="hero-menu-editorial-line pointer-events-none absolute z-[20]"
          style={{
            left: menuLine.left,
            top: menuLine.top + menuLine.rowGap * index,
            fontSize: menuLine.fontSize,
            maxWidth: menuLine.maxWidth,
          }}
        >
          {row}
        </p>
      ))}
    </>
  );
}
