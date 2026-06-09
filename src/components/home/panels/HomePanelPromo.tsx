"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { GoToMenuPanelButton } from "@/components/navigation/GoToMenuPanelButton";
import {
  fetchHomePromos,
  promosFallback,
  type HomePanelPromo as PromoItem,
} from "@/lib/public-catalog";

function PromoCard({ promo }: { promo: PromoItem }) {
  return (
    <article className="overflow-hidden border-[4px] border-rusty-carbon bg-rusty-carbon shadow-[8px_8px_0_#090909]">
      <div className="relative aspect-[16/10] w-full sm:aspect-[2/1]">
        <Image
          src={promo.image}
          alt={`Promo ${promo.number} — ${promo.name}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/90 via-[#090909]/20 to-transparent" />
        <span className="absolute left-4 top-4 bg-rusty-fire px-3 py-1 font-display text-xs uppercase tracking-wide text-rusty-cream md:text-sm">
          PROMO #{promo.number}
        </span>
      </div>
      <div className="bg-rusty-carbon px-5 py-5 md:px-6 md:py-6">
        <h3 className="font-display text-2xl uppercase leading-[0.9] text-rusty-cream md:text-3xl">
          {promo.name}
        </h3>
        {promo.tagline && (
          <p className="mt-1 text-sm text-rusty-cream/70 md:text-base">{promo.tagline}</p>
        )}
        {promo.description && (
          <p className="mt-3 text-sm text-rusty-cream/80 md:text-base">{promo.description}</p>
        )}
        {promo.price && (
          <p className="mt-3 font-display text-3xl text-rusty-orange md:text-4xl">{promo.price}</p>
        )}
        <div className="mt-5">
          <GoToMenuPanelButton className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-rusty-orange px-7 py-3 font-display text-sm uppercase tracking-wider text-rusty-carbon transition hover:bg-rusty-orangeBright sm:w-auto">
            PEDIR AHORA
          </GoToMenuPanelButton>
        </div>
      </div>
    </article>
  );
}

export function HomePanelPromo() {
  const [promos, setPromos] = useState<PromoItem[]>(promosFallback);

  useEffect(() => {
    let cancelled = false;
    fetchHomePromos().then((items) => {
      if (!cancelled) setPromos(items);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-rusty-orange">
      <div className="absolute inset-0 bg-checker-rusty bg-checker opacity-20" />
      <div className="grain-overlay absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-20">
        <p className="font-display text-xs tracking-[0.45em] text-rusty-carbon/70">PROMO RUSTY</p>
        <h2 className="mt-1 font-display text-[clamp(2.5rem,12vw,5.5rem)] uppercase leading-[0.85] text-rusty-carbon">
          PROMOS
          <br />
          <span className="text-rusty-carbon/80">BRUTALES</span>
        </h2>

        <div className="mt-8 space-y-6 md:mt-10 md:space-y-8">
          {promos.map((promo) => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </div>
      </div>
    </div>
  );
}
