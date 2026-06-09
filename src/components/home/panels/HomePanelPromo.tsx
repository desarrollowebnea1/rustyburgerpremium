"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { GoToMenuPanelButton } from "@/components/navigation/GoToMenuPanelButton";
import { parseCartPrice } from "@/lib/cart-utils";
import {
  fetchHomePromos,
  homePromoToCartInput,
  promosFallback,
  type HomePanelPromo as PromoItem,
} from "@/lib/public-catalog";

type PanelLayout = "horizontal" | "vertical";

function PromoActions({ promo, layout }: { promo: PromoItem; layout: PanelLayout }) {
  const canAdd = parseCartPrice(promo.priceRaw) > 0;

  return (
    <div className={`mt-6 flex flex-wrap gap-3 ${layout === "vertical" ? "mt-5" : "mt-8"}`}>
      {canAdd && (
        <AddToCartButton
          product={homePromoToCartInput(promo)}
          label="AGREGAR PROMO"
          className={
            layout === "vertical"
              ? "min-h-[48px] flex-1 rounded-full py-3 text-[11px] sm:flex-none"
              : "rounded-full px-6 py-3 text-xs"
          }
        />
      )}
      <GoToMenuPanelButton
        className={
          layout === "vertical"
            ? "inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border border-rusty-cream/25 bg-transparent px-5 py-2.5 font-display text-xs uppercase tracking-wider text-rusty-cream transition hover:border-rusty-orange hover:text-rusty-orange sm:flex-none"
            : "inline-flex items-center justify-center rounded-full border border-rusty-carbon/30 bg-transparent px-6 py-3 font-display text-sm uppercase tracking-wider text-rusty-carbon transition hover:border-rusty-carbon hover:bg-rusty-carbon/10"
        }
      >
        Ver menú
      </GoToMenuPanelButton>
    </div>
  );
}

function PromoArrow({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Promo anterior" : "Siguiente promo"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-rusty-cream/30 bg-rusty-carbon/75 text-rusty-cream backdrop-blur-sm transition hover:border-rusty-orange hover:text-rusty-orange md:h-10 md:w-10"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 md:h-5 md:w-5" aria-hidden>
        {direction === "left" ? (
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

function PromoPosterFace({ promo }: { promo: PromoItem }) {
  return (
    <>
      <Image
        src={promo.image}
        alt={`Promo ${promo.number} — ${promo.name}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 90vw, 420px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/95 via-[#090909]/25 to-[#090909]/40" />
      <span className="absolute left-3 top-3 bg-rusty-fire px-2.5 py-1 font-display text-xs uppercase tracking-wide text-rusty-cream md:left-4 md:top-4 md:text-sm">
        PROMO #{promo.number}
      </span>
      <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-16 md:px-5 md:pb-5">
        <p className="font-display text-[clamp(1.5rem,5vw,2.25rem)] uppercase leading-[0.9] text-rusty-cream">
          {promo.name}
        </p>
        <p className="mt-1 text-sm text-rusty-cream/75 md:text-base">{promo.tagline}</p>
      </div>
    </>
  );
}

function PromosHorizontal({ promos }: { promos: PromoItem[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const count = promos.length;
  const promo = count > 0 ? promos[index] : null;
  const nextPromo = count > 0 ? promos[(index + 1) % count] : null;

  const go = useCallback(
    (dir: -1 | 1) => {
      if (count === 0) return;
      setDirection(dir);
      setIndex((i) => (i + dir + count) % count);
    },
    [count]
  );

  if (!promo || !nextPromo) return null;

  return (
    <div className="relative flex h-full w-full items-center overflow-hidden bg-rusty-orange">
      <div className="absolute inset-0 bg-checker-rusty bg-checker opacity-20" />
      <div className="grain-overlay absolute inset-0" />
      <div className="relative grid w-full flex-1 grid-cols-1 items-center gap-8 px-6 pb-[5.75rem] pt-16 md:grid-cols-2 md:gap-12 md:px-12 md:pb-24">
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div
            className="absolute inset-0 translate-x-3 translate-y-3 rotate-[-3deg] overflow-hidden border-[5px] border-rusty-carbon shadow-[8px_8px_0_#090909] md:translate-x-4 md:translate-y-4"
            aria-hidden
          >
            <div className="relative h-full w-full">
              <PromoPosterFace promo={nextPromo} />
            </div>
          </div>
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={promo.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 48 }}
              animate={{ opacity: 1, x: 0, rotate: -3 }}
              exit={{ opacity: 0, x: direction * -48 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 aspect-square w-full overflow-hidden border-[5px] border-rusty-carbon shadow-[12px_12px_0_#090909]"
              whileHover={{ scale: 1.02, rotate: 0 }}
            >
              <PromoPosterFace promo={promo} />
              {count > 1 && (
                <>
                  <div className="absolute inset-y-0 left-2 z-20 flex items-center md:left-3">
                    <PromoArrow direction="left" onClick={() => go(-1)} />
                  </div>
                  <div className="absolute inset-y-0 right-2 z-20 flex items-center md:right-3">
                    <PromoArrow direction="right" onClick={() => go(1)} />
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="text-rusty-carbon">
          <p className="font-display text-xs tracking-[0.45em]">PROMO RUSTY</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-display text-[clamp(3rem,12vw,7rem)] uppercase leading-[0.85]">
                PROMO
                <br />#{promo.number}
              </h2>
              <p className="mt-4 text-lg">{promo.description}</p>
              {promo.price && (
                <p className="mt-2 font-display text-5xl md:text-6xl">{promo.price}</p>
              )}
            </motion.div>
          </AnimatePresence>
          <PromoActions promo={promo} layout="horizontal" />
        </div>
      </div>
    </div>
  );
}

function PromosVertical({ promos }: { promos: PromoItem[] }) {
  return (
    <div className="relative w-full overflow-hidden bg-rusty-orange">
      <div className="absolute inset-0 bg-checker-rusty bg-checker opacity-20" />
      <div className="grain-overlay absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-12">
        <p className="font-display text-xs tracking-[0.45em] text-rusty-carbon/70">PROMO RUSTY</p>
        <h2 className="mt-1 font-display text-[clamp(2.5rem,12vw,5.5rem)] uppercase leading-[0.85] text-rusty-carbon">
          PROMOS
          <br />
          <span className="text-rusty-carbon/80">BRUTALES</span>
        </h2>
        <div className="mt-8 space-y-6">
          {promos.map((promo) => (
            <article
              key={promo.id}
              className="overflow-hidden border-[4px] border-rusty-carbon bg-rusty-carbon shadow-[8px_8px_0_#090909]"
            >
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={promo.image}
                  alt={`Promo ${promo.number} — ${promo.name}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/90 via-[#090909]/20 to-transparent" />
                <span className="absolute left-4 top-4 bg-rusty-fire px-3 py-1 font-display text-xs uppercase tracking-wide text-rusty-cream">
                  PROMO #{promo.number}
                </span>
              </div>
              <div className="px-5 py-5">
                <h3 className="font-display text-2xl uppercase leading-[0.9] text-rusty-cream">{promo.name}</h3>
                {promo.tagline && <p className="mt-1 text-sm text-rusty-cream/70">{promo.tagline}</p>}
                {promo.description && <p className="mt-3 text-sm text-rusty-cream/80">{promo.description}</p>}
                {promo.price && (
                  <p className="mt-3 font-display text-3xl text-rusty-orange">{promo.price}</p>
                )}
                <PromoActions promo={promo} layout="vertical" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomePanelPromo({ layout = "vertical" }: { layout?: PanelLayout }) {
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

  return layout === "horizontal" ? (
    <PromosHorizontal promos={promos} />
  ) : (
    <PromosVertical promos={promos} />
  );
}
