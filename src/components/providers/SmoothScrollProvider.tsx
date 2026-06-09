"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    registerGsap();
    const lenis = new Lenis({
      lerp: 0.06,
      smoothWheel: true,
      touchMultiplier: 1.15,
    });

    document.documentElement.classList.add("lenis", "lenis-smooth");

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
