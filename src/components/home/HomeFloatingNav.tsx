"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useHomeMotion, type HomePanelId } from "@/context/HomeMotionContext";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { RustyLogoMark } from "@/components/ui/RustyLogoMark";

type NavTheme = "light" | "dark" | "promo";

function navThemeForPanel(panelId: HomePanelId): NavTheme {
  if (panelId === "hero") return "light";
  if (panelId === "promo") return "promo";
  return "dark";
}

/** Header editorial — logo + CTA con contraste según panel activo */
export function HomeFloatingNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { preloaderDone, activePanelId, scrollToPanel } = useHomeMotion();
  const theme = useMemo(() => navThemeForPanel(activePanelId), [activePanelId]);

  if (activePanelId === "products") return null;

  const logoShell =
    theme === "light"
      ? "rounded-full bg-[#F1EFE8]/78 px-3 py-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.08)] backdrop-blur-sm"
      : "rounded-full bg-rusty-carbon/72 px-3 py-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.45)] ring-1 ring-rusty-cream/12 backdrop-blur-md";

  const ctaClass =
    theme === "light"
      ? "border-[#050505]/18 bg-[#F1EFE8]/88 text-[#0A0A0A] shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-rusty-orange/60 hover:bg-white/92"
      : theme === "promo"
        ? "border-rusty-carbon/35 bg-rusty-carbon/88 text-rusty-cream shadow-[0_10px_28px_rgba(0,0,0,0.35)] hover:border-rusty-carbon hover:bg-rusty-carbon"
        : "border-rusty-cream/28 bg-rusty-smoke/82 text-rusty-cream shadow-[0_10px_28px_rgba(0,0,0,0.42)] hover:border-rusty-orange/55 hover:bg-rusty-carbon/90";

  const menuBarClass = theme === "light" ? "bg-[#0A0A0A]" : "bg-rusty-cream";

  return (
    <>
      <motion.header
        className="pointer-events-none fixed left-0 right-0 top-0 z-[100] flex items-start justify-between px-4 pt-4 md:px-8 md:pt-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{
          y: preloaderDone ? 0 : -20,
          opacity: preloaderDone ? 1 : 0,
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          href="/"
          className={`pointer-events-auto transition-colors duration-500 ${logoShell}`}
          aria-label="Rusty Burger inicio"
        >
          <RustyLogoMark
            size="sm"
            tone={theme === "light" ? "light" : "dark"}
          />
        </Link>

        <div className="pointer-events-auto flex items-center gap-4">
          <button
            type="button"
            onClick={() => scrollToPanel("products")}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-condensed text-[9px] font-semibold uppercase tracking-[0.14em] backdrop-blur-sm transition duration-500 md:px-5 md:py-2.5 md:text-[10px] ${ctaClass}`}
          >
            <span className="text-rusty-orange text-[8px]" aria-hidden>
              ✦
            </span>
            Pedí ahora
          </button>
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-full bg-rusty-carbon/55 ring-1 ring-rusty-cream/15 backdrop-blur-sm lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            <motion.span
              className={`block h-px w-5 ${menuBarClass}`}
              animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className={`block h-px w-5 ${menuBarClass}`}
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            />
            <motion.span
              className={`block h-px w-5 ${menuBarClass}`}
              animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
