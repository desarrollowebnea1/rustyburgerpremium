"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { HomePanelId } from "@/lib/home-panels";
import {
  HOME_PANEL_IDS,
  indexToProgress,
  panelIdToAnchor,
  panelIdToIndex,
} from "@/lib/home-panels";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type VerticalScrollOptions = {
  onProgress?: (progress: number) => void;
  onRegisterNavigator?: (navigate: (panelId: HomePanelId) => void) => void;
};

const NAVBAR_OFFSET = 72;

function scrollToAnchor(panelId: HomePanelId, behavior: ScrollBehavior) {
  const anchor = panelIdToAnchor(panelId);
  const el = document.getElementById(anchor);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior });
}

export function useVerticalHomeScroll(
  containerRef: RefObject<HTMLElement | null>,
  options?: VerticalScrollOptions
) {
  const reduced = useReducedMotion();
  const onProgressRef = useRef(options?.onProgress);
  const onRegisterNavigatorRef = useRef(options?.onRegisterNavigator);
  onProgressRef.current = options?.onProgress;
  onRegisterNavigatorRef.current = options?.onRegisterNavigator;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>("[data-panel-id]")
    );
    if (sections.length === 0) return;

    const emit = (value: number) => {
      onProgressRef.current?.(Math.min(1, Math.max(0, value)));
    };

    const navigateToPanel = (panelId: HomePanelId) => {
      const index = panelIdToIndex(panelId);
      if (index < 0) return;
      emit(indexToProgress(index));
      scrollToAnchor(panelId, reduced ? "auto" : "smooth");
    };

    onRegisterNavigatorRef.current?.(navigateToPanel);

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute("data-panel-id");
          if (!id) continue;
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let bestId: HomePanelId = HOME_PANEL_IDS[0];
        let bestRatio = -1;
        for (const panelId of HOME_PANEL_IDS) {
          const ratio = ratios.get(panelId) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = panelId;
          }
        }

        const idx = panelIdToIndex(bestId);
        if (idx >= 0) emit(indexToProgress(idx));
      },
      {
        root: null,
        rootMargin: `-${NAVBAR_OFFSET}px 0px -40% 0px`,
        threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
      }
    );

    for (const section of sections) observer.observe(section);

    return () => observer.disconnect();
  }, [containerRef, reduced]);
}
