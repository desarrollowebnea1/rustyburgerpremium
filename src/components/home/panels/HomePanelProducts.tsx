"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCallback, useLayoutEffect, useRef } from "react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { FEATURED_PRODUCTS } from "@/lib/data/products";
import { featuredProductToCartInput } from "@/lib/cart-utils";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { WHATSAPP_URL } from "@/lib/constants";
import { MarqueeBand } from "@/components/motion/MarqueeBand";

const COPIES = 3;

function CarouselArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Burgers anteriores" : "Siguientes burgers"}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rusty-cream/25 bg-rusty-carbon/80 text-rusty-cream transition hover:border-rusty-orange hover:text-rusty-orange md:h-11 md:w-11"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-5 w-5"
        aria-hidden
      >
        {direction === "left" ? (
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

function ProductCard({
  product,
  index,
}: {
  product: (typeof FEATURED_PRODUCTS)[number];
  index: number;
}) {
  return (
    <motion.article
      data-carousel-card
      className="group relative w-[min(58vw,220px)] flex-shrink-0 md:w-[min(24vw,260px)]"
      style={{ rotate: index % 2 === 0 ? -2 : 2 }}
      whileHover={{ y: -8, rotate: 0 }}
    >
      <div className="relative aspect-[4/5] overflow-hidden border-2 border-rusty-gray bg-rusty-carbon shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 58vw, 260px"
        />
        {product.badge && (
          <span className="absolute right-2 top-2 z-10 bg-rusty-fire px-2 py-0.5 font-display text-[10px] uppercase text-rusty-cream">
            {product.badge}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#090909] via-[#090909]/85 to-transparent px-3 pb-3 pt-12">
          <h3 className="font-display text-lg uppercase leading-tight tracking-wide text-rusty-cream md:text-xl">
            {product.name}
          </h3>
          <p className="mt-0.5 font-display text-base text-rusty-orange md:text-lg">
            {product.price}
          </p>
          <AddToCartButton
            product={featuredProductToCartInput(product)}
            label="Agregar"
            className="mt-2 w-full py-2 text-[10px] tracking-[0.14em] md:text-[11px]"
          />
        </div>
      </div>
    </motion.article>
  );
}

export function HomePanelProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const loopingRef = useRef(false);

  const loopedProducts = Array.from({ length: COPIES }, (_, copy) =>
    FEATURED_PRODUCTS.map((p) => ({ ...p, loopKey: `${copy}-${p.id}` }))
  ).flat();

  const getSetWidth = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 0;
    return el.scrollWidth / COPIES;
  }, []);

  const normalizeScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || loopingRef.current) return;
    const setW = getSetWidth();
    if (setW <= 0) return;

    if (el.scrollLeft < setW * 0.35) {
      loopingRef.current = true;
      el.scrollLeft += setW;
      loopingRef.current = false;
    } else if (el.scrollLeft > setW * 1.65) {
      loopingRef.current = true;
      el.scrollLeft -= setW;
      loopingRef.current = false;
    }
  }, [getSetWidth]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const setW = el.scrollWidth / COPIES;
    el.scrollLeft = setW;
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    const gap = window.innerWidth >= 768 ? 24 : 16;
    const step = card ? card.offsetWidth + gap : 280;

    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });

    window.setTimeout(normalizeScroll, 420);
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-x-hidden overflow-y-hidden bg-rusty-smoke">
      <div className="relative z-10 shrink-0">
        <MarqueeBand />
      </div>
      <div className="relative flex flex-1 flex-col justify-center px-4 pb-[5.75rem] pt-6 md:px-10 md:pb-24">
        <p className="font-display text-xs tracking-[0.4em] text-rusty-orange">
          COLLECTION
        </p>
        <h2 className="mt-1 font-display text-[clamp(2.5rem,10vw,6rem)] uppercase leading-[0.85] text-rusty-cream">
          BURGERS
          <br />
          <span className="text-rusty-orange">BRUTALES</span>
        </h2>

        <div className="mt-6 flex items-center gap-3 md:mt-8 md:gap-4">
          <CarouselArrow direction="left" onClick={() => scroll("left")} />
          <div
            ref={scrollRef}
            onScroll={normalizeScroll}
            className="flex min-w-0 flex-1 gap-4 overflow-x-auto pb-1 hide-scrollbar md:gap-6"
          >
            {loopedProducts.map((p, i) => (
              <ProductCard key={p.loopKey} product={p} index={i} />
            ))}
          </div>
          <CarouselArrow direction="right" onClick={() => scroll("right")} />
        </div>

        <div className="mt-5">
          <MagneticButton href={WHATSAPP_URL}>PEDIR</MagneticButton>
        </div>
      </div>
    </div>
  );
}
