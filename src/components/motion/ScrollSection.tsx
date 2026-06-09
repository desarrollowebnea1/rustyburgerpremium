"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type ScrollSectionProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
};

export function ScrollSection({
  children,
  className = "",
  stagger = 0.1,
  y = 72,
}: ScrollSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    registerGsap();
    const targets = ref.current.querySelectorAll("[data-scroll-item]");
    const els = targets.length ? targets : [ref.current];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        els,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [reduced, stagger, y]);

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
}
