"use client";

import { createContext, useCallback, useContext, useState } from "react";

const HOME_PANEL_IDS = ["hero", "products", "promo", "local", "close"] as const;
export type HomePanelId = (typeof HOME_PANEL_IDS)[number];

type HomeMotionContextValue = {
  preloaderDone: boolean;
  heroPlay: boolean;
  activePanelId: HomePanelId;
  completePreloader: () => void;
  setScrollProgress: (progress: number) => void;
};

const HomeMotionContext = createContext<HomeMotionContextValue | null>(null);

export function HomeMotionProvider({ children }: { children: React.ReactNode }) {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [heroPlay, setHeroPlay] = useState(false);
  const [activePanelId, setActivePanelId] = useState<HomePanelId>("hero");

  const completePreloader = useCallback(() => {
    setPreloaderDone(true);
    requestAnimationFrame(() => setHeroPlay(true));
  }, []);

  const setScrollProgress = useCallback((progress: number) => {
    const idx = Math.min(
      HOME_PANEL_IDS.length - 1,
      Math.round(progress * (HOME_PANEL_IDS.length - 1))
    );
    setActivePanelId(HOME_PANEL_IDS[idx]);
  }, []);

  return (
    <HomeMotionContext.Provider
      value={{ preloaderDone, heroPlay, activePanelId, completePreloader, setScrollProgress }}
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
      completePreloader: () => {},
      setScrollProgress: () => {},
    };
  }
  return ctx;
}
