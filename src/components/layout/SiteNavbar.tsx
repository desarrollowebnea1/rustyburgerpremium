"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/constants";
import { RustyLogoMark } from "@/components/ui/RustyLogoMark";
import { useHomeMotion } from "@/context/HomeMotionContext";
import { HOME_NAV_LINKS } from "@/lib/home-panels";
import { GoToMenuPanelButton } from "@/components/navigation/GoToMenuPanelButton";
import { NavLink } from "@/components/ui/NavLink";
import { MobileMenu } from "./MobileMenu";

export function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { preloaderDone, scrollToPanel } = useHomeMotion();

  return (
    <>
      <motion.header
        className="fixed left-0 right-0 top-0 z-[100] border-b border-rusty-gray/20 bg-rusty-carbon/85 backdrop-blur-lg"
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: preloaderDone ? 0 : -100,
          opacity: preloaderDone ? 1 : 0,
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8 md:py-4">
          <nav
            className="hidden flex-1 items-center gap-6 lg:flex"
            aria-label="Principal izquierda"
          >
            {isHome
              ? HOME_NAV_LINKS.slice(0, 3).map((link) => (
                  <button
                    key={link.panelId}
                    type="button"
                    onClick={() => scrollToPanel(link.panelId)}
                    className="group relative font-display text-sm uppercase tracking-wider text-rusty-cream/90"
                  >
                    {link.label}
                    <span
                      className="absolute -bottom-1 left-0 h-0.5 w-full origin-right scale-x-0 bg-rusty-orange transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:origin-left group-hover:scale-x-100"
                      aria-hidden
                    />
                  </button>
                ))
              : NAV_LINKS.slice(0, 3).map((link) => (
                  <NavLink key={link.href} href={link.href}>
                    {link.label}
                  </NavLink>
                ))}
          </nav>

          <div className="relative z-50 flex-shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            <RustyLogoMark size="sm" href="/" />
          </div>

          <div className="hidden flex-1 items-center justify-end gap-6 lg:flex">
            {isHome
              ? HOME_NAV_LINKS.slice(3).map((link) => (
                  <button
                    key={link.panelId}
                    type="button"
                    onClick={() => scrollToPanel(link.panelId)}
                    className="group relative font-display text-sm uppercase tracking-wider text-rusty-cream/90"
                  >
                    {link.label}
                    <span
                      className="absolute -bottom-1 left-0 h-0.5 w-full origin-right scale-x-0 bg-rusty-orange transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:origin-left group-hover:scale-x-100"
                      aria-hidden
                    />
                  </button>
                ))
              : NAV_LINKS.slice(3).map((link) => (
                  <NavLink key={link.href} href={link.href}>
                    {link.label}
                  </NavLink>
                ))}
            <GoToMenuPanelButton className="inline-flex items-center justify-center border-2 border-rusty-orange bg-rusty-orange px-5 py-2 font-display text-xs uppercase tracking-wider text-rusty-carbon transition hover:bg-rusty-orangeBright">
              PEDÍ AHORA
            </GoToMenuPanelButton>
          </div>

          <button
            type="button"
            className="relative z-50 ml-auto flex h-12 w-12 flex-col items-center justify-center gap-1.5 border-2 border-rusty-orange lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            <motion.span
              className="block h-0.5 w-6 bg-rusty-orange"
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className="block h-0.5 w-6 bg-rusty-orange"
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            />
            <motion.span
              className="block h-0.5 w-6 bg-rusty-orange"
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
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
