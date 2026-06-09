"use client";

import Link from "next/link";
import { INSTAGRAM_URL, NAV_LINKS, WHATSAPP_URL } from "@/lib/constants";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";

/** Footer flotante — solo links + redes, sin fondo */
export function HomeHorizontalNav() {
  return (
    <nav
      className="pointer-events-none fixed bottom-0 left-0 right-0 z-[110] px-4 py-5 md:px-8 md:py-6"
      aria-label="Navegación"
    >
      <div className="pointer-events-auto mx-auto flex max-w-[1400px] items-center justify-between gap-6">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 md:gap-x-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-condensed text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0A0A0A] transition duration-500 hover:text-rusty-orange [text-shadow:0_0_12px_rgba(241,239,232,0.95),0_1px_2px_rgba(241,239,232,0.7)] md:text-[12px]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="flex shrink-0 items-center gap-4 md:gap-5">
          <li>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Rusty Burger"
              className="inline-flex text-[#0A0A0A] transition duration-500 hover:text-rusty-orange [filter:drop-shadow(0_0_8px_rgba(241,239,232,0.95))]"
            >
              <InstagramIcon className="h-[18px] w-[18px] md:h-[20px] md:w-[20px]" />
            </a>
          </li>
          <li>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Rusty Burger"
              className="inline-flex text-[#0A0A0A]/80 transition duration-500 hover:text-rusty-orange [filter:drop-shadow(0_0_8px_rgba(241,239,232,0.95))]"
            >
              <WhatsAppIcon className="h-[17px] w-[17px] md:h-[18px] md:w-[18px]" />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
