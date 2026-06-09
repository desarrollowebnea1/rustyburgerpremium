"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ASSETS, NAV_LINKS, WHATSAPP_URL } from "@/lib/constants";
import { useHomeMotion } from "@/context/HomeMotionContext";
import { NavLink } from "@/components/ui/NavLink";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { MobileMenu } from "./MobileMenu";

export function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { preloaderDone } = useHomeMotion();

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
            {NAV_LINKS.slice(0, 3).map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <Link
            href="/"
            className="relative z-50 flex-shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2"
          >
            <Image
              src={ASSETS.logo}
              alt="Rusty Burger"
              width={120}
              height={48}
              className="h-9 w-auto md:h-11"
              priority
            />
          </Link>

          <div className="hidden flex-1 items-center justify-end gap-6 lg:flex">
            {NAV_LINKS.slice(3).map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
            <MagneticButton href={WHATSAPP_URL} className="!text-xs">
              PEDÍ AHORA
            </MagneticButton>
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
