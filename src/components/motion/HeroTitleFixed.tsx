"use client";

import { useEffect, useState } from "react";
import {
  computeCollageRowLayout,
  computeHeroTitleLayout,
  computeHeroTitleMeta,
  type HeroTitleLayout,
} from "@/lib/hero-collage-layout";
import { INSTAGRAM_HANDLE } from "@/lib/constants";
import { RustyWordmark } from "./RustyWordmark";

type HeroTitleFixedProps = {
  scale: number;
  play?: boolean;
};

const FALLBACK_TITLE: HeroTitleLayout = {
  left: 798,
  top: 72,
  fontSize: 198,
  lineHeight: 0.8,
  letterSpacing: "-0.058em",
  scaleY: 1.46,
  targetWidth: 880,
};

export function HeroTitleFixed({ scale, play = true }: HeroTitleFixedProps) {
  const [title, setTitle] = useState<HeroTitleLayout>(FALLBACK_TITLE);
  const [meta, setMeta] = useState({ left: 798, top: 54, fontSize: 7, iconSize: 18 });
  const [handle, setHandle] = useState({ left: 798, top: 218, fontSize: 7 });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => setVisible(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);

    const onResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const collage = computeCollageRowLayout(vw, scale);
      const t = computeHeroTitleLayout(vw, vh, scale, collage);
      const m = computeHeroTitleMeta(scale, t);
      setTitle(t);
      setMeta(m.meta);
      setHandle(m.handle);
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
    <>
      <p
        className="hero-vicio-meta pointer-events-none absolute z-[22] flex items-center gap-2.5 text-[#050505]"
        style={{
          left: meta.left,
          top: meta.top,
          fontSize: meta.fontSize,
          letterSpacing: "0.36em",
        }}
      >
        <svg
          width={meta.iconSize}
          height={meta.iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="shrink-0 text-[#050505]"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
        </svg>
        FOR THE FEAST MODE
      </p>

      <div
        id="hero-wordmark"
        className="absolute z-[24]"
        style={{ left: title.left, top: title.top }}
      >
        <RustyWordmark
          play={play}
          interactive
          scaleY={title.scaleY}
          targetWidth={title.targetWidth}
          style={{
            fontSize: title.fontSize,
            lineHeight: title.lineHeight,
            letterSpacing: title.letterSpacing,
          }}
        />
      </div>

      <p
        className="hero-vicio-meta pointer-events-none absolute z-[22] font-light text-[#050505]/32"
        style={{
          left: handle.left,
          top: handle.top,
          fontSize: handle.fontSize,
          letterSpacing: "0.28em",
        }}
      >
        {INSTAGRAM_HANDLE}
      </p>
    </>
  );
}
