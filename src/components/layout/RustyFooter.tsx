"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ASSETS,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  NAV_LINKS,
  SITE,
  WHATSAPP_URL,
} from "@/lib/constants";
import { GoToMenuPanelButton } from "@/components/navigation/GoToMenuPanelButton";

export function RustyFooter() {
  return (
    <footer className="relative overflow-hidden border-t-[3px] border-rusty-orange bg-rusty-carbon">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:px-8 lg:grid-cols-4 lg:py-20">
        <div className="lg:col-span-2">
          <Image
            src={ASSETS.logo}
            alt="Rusty Burger"
            width={200}
            height={80}
            className="mb-6 h-auto w-44 md:w-56"
          />
          <p className="max-w-sm text-rusty-cream/60">
            {SITE.tagline} — dark kitchen, smash brutal, calle y naranja.
          </p>
          <div className="mt-8">
            <GoToMenuPanelButton className="inline-flex items-center justify-center border-2 border-rusty-orange bg-transparent px-6 py-3 font-display text-sm uppercase tracking-wider text-rusty-orange transition hover:bg-rusty-orange hover:text-rusty-carbon">
              PEDÍ AHORA
            </GoToMenuPanelButton>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-xs uppercase tracking-[0.35em] text-rusty-orange">
            Navegación
          </h3>
          <ul className="space-y-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group relative font-display text-sm uppercase text-rusty-cream/70 hover:text-rusty-orange"
                >
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-rusty-orange transition-all group-hover:w-full" />
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contacto"
                className="font-display text-sm uppercase text-rusty-cream/70 hover:text-rusty-orange"
              >
                CONTACTO
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-xs uppercase tracking-[0.35em] text-rusty-orange">
            Contacto
          </h3>
          <ul className="space-y-2 text-sm text-rusty-cream/70">
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-rusty-orange">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-rusty-orange">
                Instagram {INSTAGRAM_HANDLE}
              </a>
            </li>
            <li>{SITE.address}</li>
            <li>{SITE.hours}</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-rusty-gray/30 px-4 py-8 md:px-8">
        <p className="text-center font-display text-xs uppercase tracking-[0.3em] text-rusty-cream/30">
          © {new Date().getFullYear()} Rusty Burger
        </p>
      </div>

      <motion.p
        className="pointer-events-none absolute bottom-0 left-1/2 w-full -translate-x-1/2 select-none text-center font-display text-[clamp(4rem,22vw,14rem)] uppercase leading-[0.75] text-rusty-smoke"
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        FEAST MODE ON
      </motion.p>
    </footer>
  );
}
