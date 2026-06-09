"use client";

import { INSTAGRAM_HANDLE } from "@/lib/constants";
import { HERO_VICIO_SPEC } from "@/lib/data/hero-vicio-spec";

/** Micro-copy y adornos — referencia Vicio */
export function HeroMicroDecor() {
  const { micro } = HERO_VICIO_SPEC;

  return (
    <>
      <p
        className="hero-vicio-meta pointer-events-none absolute z-[16] hidden items-center gap-2 text-[#050505]/45 md:flex"
        style={{ left: micro.metaGlobeLeft, top: micro.metaGlobeTop }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
        </svg>
        FOR THE FEAST MODE
      </p>

      <p
        className="hero-vicio-meta pointer-events-none absolute z-[16] hidden text-[#050505]/45 md:block"
        style={{ left: micro.handleLeft, top: micro.handleTop }}
      >
        TE DAMOS LO TUYO
        <span className="ml-2 text-[#050505]/70">{INSTAGRAM_HANDLE}</span>
      </p>

      <span
        className="pointer-events-none absolute z-[16] hidden text-[#050505]/30 md:block"
        style={{ left: "37vw", top: "52vh" }}
        aria-hidden
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </>
  );
}
