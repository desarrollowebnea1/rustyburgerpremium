import Link from "next/link";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  NAV_LINKS,
  SITE,
  WHATSAPP_URL,
} from "@/lib/constants";
import { homePanelHref } from "@/lib/home-panels";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-rusty-orange bg-rusty-smoke">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:px-8 lg:grid-cols-4">
        <div>
          <Link
            href="/"
            className="inline-block font-condensed text-2xl font-bold uppercase tracking-[-0.04em] md:text-3xl"
            aria-label="Rusty Burger inicio"
          >
            <span className="text-rusty-orange [text-shadow:0_2px_14px_rgba(241,135,0,0.35)]">
              RUSTY
            </span>
            <span className="text-rusty-cream"> BURGER</span>
          </Link>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm uppercase tracking-widest text-rusty-orange">
            Links
          </h3>
          <ul className="space-y-2">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-rusty-cream/70 hover:text-rusty-orange"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contacto"
                className="text-sm text-rusty-cream/70 hover:text-rusty-orange"
              >
                CONTACTO
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm uppercase tracking-widest text-rusty-orange">
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

        <div>
          <h3 className="mb-4 font-display text-sm uppercase tracking-widest text-rusty-orange">
            Pedí
          </h3>
          <p className="text-sm text-rusty-cream/70">
            WhatsApp · iFood · Mostrador
          </p>
          <Link
            href={homePanelHref("products")}
            className="mt-4 inline-block border-2 border-rusty-orange px-6 py-3 font-display text-sm uppercase text-rusty-orange transition hover:bg-rusty-orange hover:text-rusty-carbon"
          >
            PEDÍ AHORA
          </Link>
        </div>
      </div>

      <div className="border-t border-rusty-gray/40 px-4 py-6 text-center text-xs text-rusty-cream/40 md:px-8">
        © {new Date().getFullYear()} Rusty Burger · FEAST MODE ON
      </div>
    </footer>
  );
}
