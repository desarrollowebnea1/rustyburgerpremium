"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FEATURED_PRODUCTS } from "@/lib/data/products";
import { mapApiProductToCard, type ApiPublicProduct } from "@/lib/map-api-product";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ScrollSection } from "./ScrollSection";
import type { Product } from "@/lib/data/products";

export function ProductMotionGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [products, setProducts] = useState<Product[]>(FEATURED_PRODUCTS);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const res = await fetch("/api/public/products");
        const json = (await res.json()) as {
          ok: boolean;
          data?: ApiPublicProduct[];
        };

        if (!cancelled && json.ok && Array.isArray(json.data) && json.data.length > 0) {
          setProducts(json.data.map(mapApiProductToCard));
        }
      } catch {
        // Mantiene fallback hardcodeado
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (reduced || !gridRef.current) return;
    registerGsap();

    const left = gridRef.current.querySelectorAll('[data-column="left"]');
    const right = gridRef.current.querySelectorAll('[data-column="right"]');

    const ctx = gsap.context(() => {
      gsap.to(left, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
      gsap.to(right, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, [reduced, products]);

  return (
    <ScrollSection className="relative overflow-hidden bg-rusty-carbon px-4 py-20 md:px-8 md:py-32">
      <div className="pointer-events-none absolute -right-20 top-10 font-display text-[12rem] uppercase leading-none text-rusty-smoke/30">
        MENU
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div data-scroll-item>
          <SectionTitle
            eyebrow="Destacados"
            title="BURGERS BRUTALES"
            subtitle="No es catálogo. Es drop gastronómico."
          />
        </div>

        <div ref={gridRef} className="grid gap-8 sm:grid-cols-2 lg:gap-10">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </ScrollSection>
  );
}
