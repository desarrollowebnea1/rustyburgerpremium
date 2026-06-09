"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import type { Product } from "@/lib/data/products";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { MagneticButton } from "./MagneticButton";
import { WHATSAPP_URL } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type ProductCardProps = {
  product: Product;
  index?: number;
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 280,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 280,
    damping: 28,
  });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const skew = index % 2 === 0 ? "md:-rotate-1" : "md:rotate-1";

  return (
    <article
      data-scroll-item
      data-product-card
      data-column={index % 2 === 0 ? "left" : "right"}
      className={`group relative ${skew}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <motion.div
        className="relative overflow-hidden border-2 border-rusty-gray/60 bg-gradient-to-br from-rusty-smoke to-rusty-carbon p-1 shadow-[0_24px_48px_rgba(0,0,0,0.55)] transition-[border-color] duration-300 group-hover:border-rusty-orange"
        style={{
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {product.badge && (
          <span className="absolute right-4 top-4 z-20 rotate-6 bg-rusty-fire px-3 py-1 font-display text-xs uppercase text-rusty-cream shadow-brutal">
            {product.badge}
          </span>
        )}

        <div className="relative aspect-[4/5] overflow-hidden bg-rusty-carbon">
          <motion.div
            className="relative h-[115%] w-full -translate-y-[8%]"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-rusty-carbon via-transparent to-transparent opacity-80" />
          <motion.span
            className="absolute bottom-6 left-4 rotate-[-8deg] bg-rusty-orange px-2 py-1 font-display text-[10px] uppercase text-rusty-carbon"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2.8 }}
          >
            Smash
          </motion.span>
        </div>

        <div className="relative z-10 -mt-8 px-5 pb-6 pt-0 md:px-6 md:pb-7">
          <h3 className="font-display text-3xl uppercase leading-none text-rusty-cream md:text-4xl">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-rusty-cream/60">
            {product.description}
          </p>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
            <span className="font-display text-3xl text-rusty-orange">{product.price}</span>
            <div className="flex flex-wrap items-center gap-2">
              <AddToCartButton
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                }}
                label="Agregar"
                openOnAdd
              />
              <MagneticButton
                href={WHATSAPP_URL}
                className="!rounded-none !border !border-rusty-gray/50 !bg-transparent !px-4 !py-2.5 text-xs !text-rusty-cream hover:!border-rusty-orange hover:!text-rusty-orange"
              >
                WhatsApp
              </MagneticButton>
            </div>
          </div>
        </div>
      </motion.div>
    </article>
  );
}
