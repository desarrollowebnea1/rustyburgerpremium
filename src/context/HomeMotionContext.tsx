"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import {
  HOME_PANEL_IDS,
  type HomePanelId,
  indexToProgress,
  panelIdToAnchor,
} from "@/lib/home-panels";

type HomeMotionContextValue = {
  preloaderDone: boolean;
  heroPlay: boolean;
  activePanelId: HomePanelId;
  scrollProgress: number;
  completePreloader: () => void;
  setScrollProgress: (progress: number) => void;
  registerPanelNavigator: (fn: ((panelId: HomePanelId) => void) | null) => void;
  scrollToPanel: (panelId: HomePanelId) => void;
};

const HomeMotionContext = createContext<HomeMotionContextValue | null>(null);

export type { HomePanelId };

export function HomeMotionProvider({ children }: { children: React.ReactNode }) {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [heroPlay, setHeroPlay] = useState(false);
  const [activePanelId, setActivePanelId] = useState<HomePanelId>("hero");
  const [scrollProgress, setScrollProgressState] = useState(0);
  const navigatorRef = useRef<((panelId: HomePanelId) => void) | null>(null);

  const completePreloader = useCallback(() => {
    setPreloaderDone(true);
    requestAnimationFrame(() => setHeroPlay(true));
  }, []);

  const setScrollProgress = useCallback((progress: number) => {
    const clamped = Math.min(1, Math.max(0, progress));
    setScrollProgressState(clamped);
    const idx = Math.min(
      HOME_PANEL_IDS.length - 1,
      Math.round(clamped * (HOME_PANEL_IDS.length - 1))
    );
    setActivePanelId(HOME_PANEL_IDS[idx]);
  }, []);

  const registerPanelNavigator = useCallback(
    (fn: ((panelId: HomePanelId) => void) | null) => {
      navigatorRef.current = fn;
    },
    []
  );

  const scrollToPanel = useCallback((panelId: HomePanelId) => {
    const idx = HOME_PANEL_IDS.indexOf(panelId);
    if (idx < 0) return;

    setScrollProgress(indexToProgress(idx));

    if (navigatorRef.current) {
      navigatorRef.current(panelId);
      return;
    }

    // Fallback sin navigator registrado
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop) {
      const track = document.querySelector<HTMLElement>(".horizontal-track");
      if (track) {
        track.scrollTo({ left: idx * track.clientWidth, behavior: "smooth" });
      }
      return;
    }

    const anchor = panelIdToAnchor(panelId);
    const el = document.getElementById(anchor);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  }, [setScrollProgress]);

  return (
    <HomeMotionContext.Provider
      value={{
        preloaderDone,
        heroPlay,
        activePanelId,
        scrollProgress,
        completePreloader,
        setScrollProgress,
        registerPanelNavigator,
        scrollToPanel,
      }}
    >
      {children}
    </HomeMotionContext.Provider>
  );
}

export function useHomeMotion() {
  const ctx = useContext(HomeMotionContext);
  if (!ctx) {
    return {
      preloaderDone: true,
      heroPlay: true,
      activePanelId: "hero" as HomePanelId,
      scrollProgress: 0,
      completePreloader: () => {},
      setScrollProgress: () => {},
      registerPanelNavigator: () => {},
      scrollToPanel: () => {},
    };
  }
  return ctx;
}
