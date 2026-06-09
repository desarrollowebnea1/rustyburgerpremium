"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCallback, useRef } from "react";

const MAX_OFFSET = 12;
const RADIUS = 80;

export function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced || !ref.current) return;
      const el = ref.current;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < RADIUS) {
        const pull = 1 - dist / RADIUS;
        const tx = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, dx * pull * 0.35));
        const ty = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, dy * pull * 0.35));
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      }
    },
    [reduced]
  );

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "translate3d(0, 0, 0)";
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
