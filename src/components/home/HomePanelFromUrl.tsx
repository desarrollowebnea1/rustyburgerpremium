"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useHomeMotion } from "@/context/HomeMotionContext";
import {
  HOME_PANEL_IDS,
  anchorToPanelId,
  type HomePanelId,
} from "@/lib/home-panels";

/** Scroll a sección si la URL trae ?panel= o hash #menu, #promos, etc. */
export function HomePanelFromUrl() {
  const searchParams = useSearchParams();
  const { scrollToPanel, preloaderDone } = useHomeMotion();

  useEffect(() => {
    if (!preloaderDone) return;

    function resolveTarget(): HomePanelId | null {
      const panelParam = searchParams.get("panel");
      const hash = window.location.hash.replace("#", "");
      const fromHash = hash ? anchorToPanelId(hash) : null;
      const fromParam =
        panelParam && HOME_PANEL_IDS.includes(panelParam as HomePanelId)
          ? (panelParam as HomePanelId)
          : null;
      return fromHash ?? fromParam;
    }

    function scrollToTarget() {
      const target = resolveTarget();
      if (!target) return;
      scrollToPanel(target);
    }

    const timer = window.setTimeout(scrollToTarget, 500);
    window.addEventListener("hashchange", scrollToTarget);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", scrollToTarget);
    };
  }, [searchParams, preloaderDone, scrollToPanel]);

  return null;
}
