"use client";

import { useEffect, useRef } from "react";
import { MotionHeroCollage } from "@/components/motion/MotionHeroCollage";
import { useHomeMotion } from "@/context/HomeMotionContext";
import { useHorizontalHomeScroll } from "@/hooks/useHorizontalHomeScroll";
import { HOME_PANEL_IDS } from "@/lib/home-panels";
import { HomePanelProducts } from "./panels/HomePanelProducts";
import { HomePanelPromo } from "./panels/HomePanelPromo";
import { HomePanelLocal } from "./panels/HomePanelLocal";
import { HomePanelClose } from "./panels/HomePanelClose";

const LAYOUT = "horizontal" as const;

const PANELS = [
  { id: "hero" as const, content: <MotionHeroCollage layout={LAYOUT} /> },
  { id: "products" as const, content: <HomePanelProducts layout={LAYOUT} /> },
  { id: "promo" as const, content: <HomePanelPromo layout={LAYOUT} /> },
  { id: "local" as const, content: <HomePanelLocal layout={LAYOUT} /> },
  { id: "close" as const, content: <HomePanelClose layout={LAYOUT} /> },
] as const;

export function HorizontalHome() {
  const wrapperRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { setScrollProgress, registerPanelNavigator } = useHomeMotion();

  useHorizontalHomeScroll(wrapperRef, trackRef, {
    onProgress: setScrollProgress,
    onRegisterNavigator: (navigate) => registerPanelNavigator(navigate),
  });

  useEffect(() => {
    return () => registerPanelNavigator(null);
  }, [registerPanelNavigator]);

  return (
    <section ref={wrapperRef} className="horizontal-home relative w-full" aria-label="Rusty Burger canvas">
      <div className="horizontal-home-pin h-[100svh] w-full overflow-hidden">
        <div
          ref={trackRef}
          className="horizontal-track flex h-[100svh] w-max will-change-transform"
        >
          {PANELS.map((panel) => (
            <div
              key={panel.id}
              id={`home-panel-${panel.id}`}
              data-panel-id={panel.id}
              className="horizontal-panel relative h-[100svh] w-screen max-w-[100vw] flex-shrink-0 overflow-hidden"
            >
              {panel.content}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Re-export for consumers that need panel order
export { HOME_PANEL_IDS };
