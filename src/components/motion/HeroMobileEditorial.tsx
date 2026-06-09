"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GoToMenuPanelButton } from "@/components/navigation/GoToMenuPanelButton";
import { HERO_COLLAGE_PANELS } from "@/lib/data/hero-collage-panels";
import { HERO_COLLAGE_ORDER, HERO_COLLAGE_ROTATE } from "@/lib/data/hero-collage-vicio";
import { HERO_MENU_ROWS } from "@/lib/data/hero-menu-line";
import { INSTAGRAM_HANDLE } from "@/lib/constants";
import { RustyBrandStickerArt } from "./RustyBrandStickerArt";
import { RustyWordmark } from "./RustyWordmark";

const PANEL_BY_ID = Object.fromEntries(HERO_COLLAGE_PANELS.map((p) => [p.id, p]));

const BURGER = {
  src: "/rusty/products/hero-burger-cutout.png",
  src2x: "/rusty/products/hero-burger-cutout@2x.png",
  src3x: "/rusty/products/hero-burger-cutout@3x.png",
} as const;

const MOBILE_STICKERS = [
  { id: "feast-mode", variant: "feast-mode" as const, className: "right-[6%] top-[10%] w-[72px] rotate-[-6deg]" },
  { id: "r-fire", variant: "r-fire" as const, className: "right-[18%] top-[38%] w-[64px] rotate-[10deg]" },
  { id: "zero-regrets", variant: "zero-regrets" as const, className: "left-[4%] top-[48%] w-[76px] rotate-[-8deg]" },
];

type HeroMobileEditorialProps = {
  play?: boolean;
};

export function HeroMobileEditorial({ play = true }: HeroMobileEditorialProps) {
  return (
    <section
      id="rusty-collage-mobile"
      className="hero-mobile-editorial hero-cream-grain relative min-h-[100svh] w-full overflow-hidden bg-[#F1EFE8]"
    >
      <div className="hero-panel-premium pointer-events-none absolute inset-0" aria-hidden />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {MOBILE_STICKERS.map((sticker) => (
          <div
            key={sticker.id}
            data-hero-sticker
            className={`absolute opacity-90 ${sticker.className}`}
          >
            <RustyBrandStickerArt variant={sticker.variant} className="hero-sticker-3d w-full" />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex min-h-[100svh] flex-col px-4 pb-28 pt-[4.75rem]">
        <p className="hero-vicio-meta flex items-center gap-2 text-[9px] tracking-[0.36em] text-[#050505]">
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
          </svg>
          FOR THE FEAST MODE
        </p>

        <Link
          href="/?panel=products"
          aria-label="Ver menú Rusty Burger"
          className="group relative mt-3 w-[min(92vw,400px)] outline-none"
        >
          <motion.div
            id="hero-main-burger"
            initial={play ? { opacity: 0, x: -16 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="hero-burger-stack"
            style={{ transform: "scaleY(1.02)", transformOrigin: "left bottom" }}
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
              className="hero-burger-cutout relative z-[1] block h-auto w-full object-contain"
            />
          </motion.div>
        </Link>

        <motion.div
          id="hero-wordmark"
          className="relative z-20 -mt-2 max-w-full"
          initial={play ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <RustyWordmark
            play={play}
            interactive
            scaleY={1.32}
            targetWidth={320}
            style={{
              fontSize: "clamp(3.25rem, 14vw, 5.5rem)",
              lineHeight: 0.82,
              letterSpacing: "-0.05em",
            }}
          />
        </motion.div>

        <p className="hero-vicio-meta mt-1 text-[8px] tracking-[0.28em] text-[#050505]/32">
          {INSTAGRAM_HANDLE}
        </p>

        <motion.div
          className="mt-5 flex gap-2.5 overflow-x-auto pb-1 hide-scrollbar"
          initial={play ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {HERO_COLLAGE_ORDER.map((panelId) => {
            const panel = PANEL_BY_ID[panelId];
            if (!panel) return null;
            return (
              <div
                key={panelId}
                className="hero-collage-piece shrink-0"
                style={
                  {
                    width: "min(30vw, 118px)",
                    height: "min(36vw, 136px)",
                    "--collage-rotate": `${HERO_COLLAGE_ROTATE[panelId]}deg`,
                  } as React.CSSProperties
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={panel.defaultSrc}
                  srcSet={`${panel.defaultSrc} 1x, ${panel.defaultSrc2x} 2x`}
                  alt={panel.alt}
                  draggable={false}
                  className="h-full w-full object-contain object-center"
                />
              </div>
            );
          })}
        </motion.div>

        <div className="mt-4 space-y-1">
          <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[#050505]/55">
            Aquí tenés nuestro menú →
          </p>
          {HERO_MENU_ROWS.slice(0, 2).map((row) => (
            <p
              key={row}
              className="hero-menu-editorial-line text-[9px] uppercase tracking-[0.16em] text-[#050505]/42"
            >
              {row}
            </p>
          ))}
        </div>

        <motion.div
          className="mt-auto pt-6"
          initial={play ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <GoToMenuPanelButton className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border-2 border-rusty-carbon bg-rusty-carbon px-6 py-3 font-display text-sm uppercase tracking-wider text-rusty-orange transition hover:bg-rusty-smoke">
            PEDÍ AHORA
          </GoToMenuPanelButton>
        </motion.div>
      </div>
    </section>
  );
}
