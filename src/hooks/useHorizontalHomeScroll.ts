"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { HomePanelId } from "@/lib/home-panels";
import { indexToProgress, panelIdToIndex } from "@/lib/home-panels";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type HorizontalScrollOptions = {
  onProgress?: (progress: number) => void;
  onRegisterNavigator?: (navigate: (panelId: HomePanelId) => void) => void;
};

const SCROLL_TRIGGER_ID = "horizontal-home";

export function useHorizontalHomeScroll(
  wrapperRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
  options?: HorizontalScrollOptions
) {
  const reduced = useReducedMotion();
  const onProgressRef = useRef(options?.onProgress);
  const onRegisterNavigatorRef = useRef(options?.onRegisterNavigator);
  onProgressRef.current = options?.onProgress;
  onRegisterNavigatorRef.current = options?.onRegisterNavigator;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    registerGsap();
    document.documentElement.classList.add("home-horizontal-active");

    const emit = (value: number) => {
      onProgressRef.current?.(Math.min(1, Math.max(0, value)));
    };

    const navigateToPanel = (panelId: HomePanelId) => {
      const index = panelIdToIndex(panelId);
      if (index < 0) return;

      emit(indexToProgress(index));

      if (window.matchMedia("(min-width: 768px)").matches) {
        const st = ScrollTrigger.getById(SCROLL_TRIGGER_ID);
        if (st) {
          const progress = indexToProgress(index);
          const y = st.start + progress * (st.end - st.start);
          window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
        }
        return;
      }

      const left = index * track.clientWidth;
      track.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
    };

    onRegisterNavigatorRef.current?.(navigateToPanel);

    if (reduced) {
      return () => {
        document.documentElement.classList.remove("home-horizontal-active");
      };
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const getScroll = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -getScroll(),
          ease: "none",
          scrollTrigger: {
            id: SCROLL_TRIGGER_ID,
            trigger: wrapper,
            start: "top top",
            end: () => `+=${getScroll()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => emit(self.progress),
          },
        });
      }, wrapper);

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      ScrollTrigger.refresh();

      return () => {
        window.removeEventListener("resize", onResize);
        ctx.revert();
      };
    });

    mm.add("(max-width: 767px)", () => {
      track.classList.add("horizontal-track-snap");

      let rafId = 0;
      const updateFromScroll = () => {
        const max = track.scrollWidth - track.clientWidth;
        emit(max > 0 ? track.scrollLeft / max : 0);
      };

      const onScroll = () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateFromScroll);
      };

      track.addEventListener("scroll", onScroll, { passive: true });
      updateFromScroll();

      return () => {
        cancelAnimationFrame(rafId);
        track.removeEventListener("scroll", onScroll);
        track.classList.remove("horizontal-track-snap");
      };
    });

    return () => {
      mm.revert();
      document.documentElement.classList.remove("home-horizontal-active");
      ScrollTrigger.refresh();
    };
  }, [reduced, wrapperRef, trackRef]);
}
