"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useHomeMotion } from "@/context/HomeMotionContext";
import { HOME_PANEL_IDS, type HomePanelId } from "@/lib/home-panels";

/** Abre panel horizontal si la URL trae ?panel=products (u otro id válido). */
export function HomePanelFromUrl() {
  const searchParams = useSearchParams();
  const { scrollToPanel, preloaderDone } = useHomeMotion();

  useEffect(() => {
    const panel = searchParams.get("panel");
    if (!panel || !preloaderDone) return;
    if (!HOME_PANEL_IDS.includes(panel as HomePanelId)) return;

    const timer = window.setTimeout(() => {
      scrollToPanel(panel as HomePanelId);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [searchParams, preloaderDone, scrollToPanel]);

  return null;
}
