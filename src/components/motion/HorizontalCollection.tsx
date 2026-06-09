"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { HORIZONTAL_COLLECTION } from "@/lib/data/products";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ScrollSection } from "./ScrollSection";

export function HorizontalCollection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !trackRef.current || !sectionRef.current) return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    registerGsap();
    const track = trackRef.current;
    const getScroll = () => Math.max(0, track.scrollWidth - window.innerWidth + 48);

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -getScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getScroll()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-rusty-smoke"
    >
      <ScrollSection className="px-4 py-20 md:px-8 md:py-28">
        <div data-scroll-item>
          <SectionTitle
            eyebrow="Drop collection"
            title="BORA PRO RUSTY"
            subtitle="Combos como colección street — deslizá o scrolleá."
            align="center"
          />
        </div>
      </ScrollSection>

      <div
        ref={trackRef}
        className="hide-scrollbar flex w-max gap-6 overflow-x-auto px-4 pb-16 will-change-transform max-md:snap-x max-md:snap-mandatory md:gap-10 md:overflow-visible md:px-8 md:pb-20"
      >
        {HORIZONTAL_COLLECTION.map((item, i) => (
          <article
            key={item.slug}
            data-scroll-item
            className={`group relative w-[min(85vw,340px)] flex-shrink-0 border-[3px] border-rusty-carbon bg-rusty-carbon shadow-brutal transition-transform duration-300 hover:-translate-y-2 md:w-[380px] ${i % 2 === 0 ? "-rotate-2" : "rotate-2"}`}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={`/rusty/products/${item.slug}.svg`}
                alt={item.label}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="380px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rusty-carbon via-rusty-carbon/20 to-transparent" />
            </div>
            <div className="border-t-2 border-rusty-orange p-6">
              <p className="font-display text-xs tracking-[0.35em] text-rusty-orange">
                DROP 0{i + 1}
              </p>
              <h3 className="mt-1 font-display text-4xl uppercase text-rusty-cream">
                {item.label}
              </h3>
              <p className="mt-2 font-display text-3xl text-rusty-orange">{item.price}</p>
              <Link
                href="/promos"
                className="mt-4 inline-block font-display text-sm uppercase text-rusty-cream hover:text-rusty-orange"
              >
                Ver promo →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
