"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { WHATSAPP_URL } from "@/lib/constants";
import {
  featuredProductsFallback,
  fetchHomeProducts,
  homeProductToCartInput,
  type HomePanelProduct,
} from "@/lib/public-catalog";
import { MarqueeBand } from "@/components/motion/MarqueeBand";

function ProductCard({ product }: { product: HomePanelProduct }) {
  return (
    <motion.article
      className="group flex flex-col overflow-hidden border-2 border-rusty-gray bg-rusty-carbon shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
      whileHover={{ y: -4 }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[4/5]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {product.badge && (
          <span className="absolute right-3 top-3 z-10 bg-rusty-fire px-2.5 py-1 font-display text-[10px] uppercase text-rusty-cream">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <h3 className="font-display text-xl uppercase leading-tight tracking-wide text-rusty-cream md:text-2xl">
          {product.name}
        </h3>
        <p className="mt-1 font-display text-lg text-rusty-orange md:text-xl">
          {product.priceLabel}
        </p>
        <AddToCartButton
          product={homeProductToCartInput(product)}
          label="Agregar"
          className="mt-4 w-full py-3 text-[11px] tracking-[0.14em] md:text-xs"
        />
      </div>
    </motion.article>
  );
}

export function HomePanelProducts() {
  const [products, setProducts] = useState<HomePanelProduct[]>(featuredProductsFallback);

  useEffect(() => {
    let cancelled = false;
    fetchHomeProducts().then((items) => {
      if (!cancelled) setProducts(items);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative w-full bg-rusty-smoke">
      <MarqueeBand />
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-20">
        <p className="font-display text-xs tracking-[0.4em] text-rusty-orange">COLLECTION</p>
        <h2 className="mt-1 font-display text-[clamp(2.5rem,10vw,5rem)] uppercase leading-[0.85] text-rusty-cream">
          BURGERS
          <br />
          <span className="text-rusty-orange">BRUTALES</span>
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10">
          <MagneticButton href={WHATSAPP_URL}>PEDIR</MagneticButton>
        </div>
      </div>
    </div>
  );
}
