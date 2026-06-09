"use client";

import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

export function useMouseParallax(strength = 1) {
  const [multiplier, setMultiplier] = useState(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setMultiplier(mq.matches ? 0.45 : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      x.set(dx * strength * 18 * multiplier);
      y.set(dy * strength * 18 * multiplier);
    },
    [strength, multiplier, x, y]
  );

  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { springX, springY, onMouseMove, onMouseLeave };
}

export function useLayerOffset(
  springX: ReturnType<typeof useSpring>,
  springY: ReturnType<typeof useSpring>,
  factor: number
) {
  return {
    x: useTransform(springX, (v) => v * factor),
    y: useTransform(springY, (v) => v * factor),
    rotate: useTransform(springX, [-18, 18], [-factor * 2, factor * 2]),
  };
}
