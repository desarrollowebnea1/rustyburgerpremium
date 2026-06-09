"use client";

import { useEffect, useRef } from "react";
import { useHomeMotion } from "@/context/HomeMotionContext";
import { useHeroCanvasScale } from "@/hooks/useHeroCanvasScale";
import { HERO_CANVAS } from "@/lib/data/hero-vicio-layout";
import { gsap, registerGsap } from "@/lib/gsap";
import { BrandStickersLayer } from "./BrandStickersOverlay";
import { HeroCollageRowFixed } from "./HeroCollageRowFixed";
import { HeroLeftEditorialFixed } from "./HeroLeftEditorialFixed";
import { HeroTitleFixed } from "./HeroTitleFixed";
import { HeroVicioCanvas } from "./HeroVicioCanvas";

export function MotionHeroCollage() {
  const { heroPlay } = useHomeMotion();
  const heroRef = useRef<HTMLElement>(null);
  const scale = useHeroCanvasScale();

  useEffect(() => {
    if (!heroPlay || !heroRef.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.from("#hero-main-burger", {
        x: -20,
        opacity: 0,
        duration: 1.15,
        ease: "power4.out",
        delay: 0.08,
      });
      gsap.from("#hero-wordmark", {
        y: 32,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.22,
      });
      gsap.from(".hero-collage-piece", {
        y: 24,
        opacity: 0,
        stagger: 0.1,
        duration: 0.95,
        ease: "power4.out",
        delay: 0.42,
      });
      gsap.from("#hero-menu-editorial, .hero-menu-editorial-line", {
        y: 14,
        opacity: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.08,
        delay: 0.52,
      });
      gsap.from("[data-hero-sticker]", {
        scale: 0.82,
        opacity: 0,
        duration: 0.85,
        ease: "power4.out",
        stagger: 0.1,
        delay: 0.58,
      });
    }, heroRef);
    return () => ctx.revert();
  }, [heroPlay]);

  const scaledW = HERO_CANVAS.w * scale;
  const scaledH = HERO_CANVAS.h * scale;

  return (
    <section
      ref={heroRef}
      id="rusty-collage"
      className="hero-panel-premium relative flex h-full min-h-0 w-full items-start justify-start overflow-hidden"
      style={{ backgroundColor: HERO_CANVAS.bg }}
    >
      <div style={{ width: scaledW, height: scaledH, flexShrink: 0 }}>
        <div
          style={{
            width: HERO_CANVAS.w,
            height: HERO_CANVAS.h,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <HeroVicioCanvas />
        </div>
      </div>

      {/* Capas viewport independientes — no se mueven con el canvas */}
      <HeroLeftEditorialFixed scale={scale} />
      <HeroTitleFixed scale={scale} play={heroPlay} />
      <HeroCollageRowFixed scale={scale} />
      <BrandStickersLayer />
    </section>
  );
}

export const HeroCollage = MotionHeroCollage;
