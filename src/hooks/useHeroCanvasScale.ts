"use client";

import { useEffect, useState } from "react";
import { HERO_CANVAS } from "@/lib/data/hero-vicio-layout";

/** Escala el canvas 1920×1080 al viewport del panel */
export function useHeroCanvasScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const sx = window.innerWidth / HERO_CANVAS.w;
      const sy = window.innerHeight / HERO_CANVAS.h;
      setScale(Math.min(sx, sy));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return scale;
}
