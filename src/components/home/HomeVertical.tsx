"use client";

import { useEffect, useRef } from "react";
import { MotionHeroCollage } from "@/components/motion/MotionHeroCollage";
import { useHomeMotion } from "@/context/HomeMotionContext";
import { useVerticalHomeScroll } from "@/hooks/useVerticalHomeScroll";
import { HOME_PANEL_IDS, panelIdToAnchor } from "@/lib/home-panels";
import { HomePanelProducts } from "./panels/HomePanelProducts";
import { HomePanelPromo } from "./panels/HomePanelPromo";
import { HomePanelLocal } from "./panels/HomePanelLocal";
import { HomePanelClose } from "./panels/HomePanelClose";

const LAYOUT = "vertical" as const;

const SECTIONS = [
  { id: "hero" as const, content: <MotionHeroCollage layout={LAYOUT} /> },
  { id: "products" as const, content: <HomePanelProducts layout={LAYOUT} /> },
  { id: "promo" as const, content: <HomePanelPromo layout={LAYOUT} /> },
  { id: "local" as const, content: <HomePanelLocal layout={LAYOUT} /> },
  { id: "close" as const, content: <HomePanelClose layout={LAYOUT} /> },
] as const;

export function HomeVertical() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setScrollProgress, registerPanelNavigator } = useHomeMotion();

  useVerticalHomeScroll(containerRef, {
    onProgress: setScrollProgress,
    onRegisterNavigator: (navigate) => registerPanelNavigator(navigate),
  });

  useEffect(() => {
    return () => registerPanelNavigator(null);
  }, [registerPanelNavigator]);

  return (
    <div
      ref={containerRef}
      className="home-vertical relative w-full"
      aria-label="Rusty Burger"
    >
      {SECTIONS.map((section) => (
        <section
          key={section.id}
          id={panelIdToAnchor(section.id)}
          data-panel-id={section.id}
          className={`home-vertical-section relative w-full ${
            section.id === "hero" ? "min-h-[100svh]" : ""
          }`}
        >
          {section.content}
        </section>
      ))}
    </div>
  );
}

export { HOME_PANEL_IDS };
