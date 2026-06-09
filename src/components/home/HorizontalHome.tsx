"use client";

import { useRef } from "react";
import { MotionHeroCollage } from "@/components/motion/MotionHeroCollage";
import { useHomeMotion } from "@/context/HomeMotionContext";
import { useHorizontalHomeScroll } from "@/hooks/useHorizontalHomeScroll";
import { HomePanelProducts } from "./panels/HomePanelProducts";
import { HomePanelPromo } from "./panels/HomePanelPromo";
import { HomePanelLocal } from "./panels/HomePanelLocal";
import { HomePanelClose } from "./panels/HomePanelClose";

const PANELS = [
  { id: "hero", content: <MotionHeroCollage /> },
  { id: "products", content: <HomePanelProducts /> },
  { id: "promo", content: <HomePanelPromo /> },
  { id: "local", content: <HomePanelLocal /> },
  { id: "close", content: <HomePanelClose /> },
] as const;

export function HorizontalHome() {
  const wrapperRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { setScrollProgress } = useHomeMotion();

  useHorizontalHomeScroll(wrapperRef, trackRef, { onProgress: setScrollProgress });

  return (
    <>
      <section ref={wrapperRef} className="horizontal-home relative w-full" aria-label="Rusty Burger canvas">
        <div className="horizontal-home-pin h-[100svh] w-full overflow-hidden">
          <div
            ref={trackRef}
            className="horizontal-track flex h-[100svh] w-max will-change-transform"
          >
            {PANELS.map((panel) => (
              <div
                key={panel.id}
                className="horizontal-panel relative h-[100svh] w-screen max-w-[100vw] flex-shrink-0 overflow-hidden"
              >
                {panel.content}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
