"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HERO_CANVAS, HERO_LAYOUT_PX } from "@/lib/data/hero-vicio-layout";

const BURGER = {
  src: "/rusty/products/hero-burger-cutout.png",
  src2x: "/rusty/products/hero-burger-cutout@2x.png",
  src3x: "/rusty/products/hero-burger-cutout@3x.png",
} as const;

/** Canvas 1920×1080 — burger hero editorial */
export function HeroVicioCanvas() {
  const L = HERO_LAYOUT_PX;

  return (
    <div
      className="relative"
      style={{ width: HERO_CANVAS.w, height: HERO_CANVAS.h, backgroundColor: HERO_CANVAS.bg }}
    >
      <Link
        href="/menu"
        aria-label="Ver menú Rusty Burger"
        className="group absolute outline-none"
        style={{ left: L.burger.left, top: L.burger.top, zIndex: L.burger.zIndex }}
      >
        <motion.div
          id="hero-main-burger"
          whileHover={{ scale: 0.985 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="hero-burger-stack"
          style={{
            transform: `scaleY(${L.burger.heightScale})`,
            transformOrigin: "left bottom",
          }}
        >
          <span className="hero-burger-vicio-shadow-rear" aria-hidden />
          <span className="hero-burger-vicio-shadow-flank" aria-hidden />
          <span className="hero-burger-vicio-shadow-soft" aria-hidden />
          <span className="hero-burger-vicio-shadow-left" aria-hidden />
          <span className="hero-burger-vicio-shadow-deep" aria-hidden />
          <span className="hero-burger-vicio-shadow-core" aria-hidden />
          <span className="hero-burger-light" aria-hidden />
          <span className="hero-burger-sauce-glow" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BURGER.src}
            srcSet={`${BURGER.src} 1x, ${BURGER.src2x} 2x, ${BURGER.src3x} 3x`}
            alt="Burger Rusty"
            draggable={false}
            className="hero-burger-cutout relative z-[1] block h-auto object-contain"
            style={{ width: L.burger.width }}
          />
        </motion.div>
      </Link>
    </div>
  );
}
