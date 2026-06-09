"use client";

import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { MotionPreloader } from "@/components/motion/MotionPreloader";
import { HomeResponsive } from "@/components/home/HomeResponsive";
import { HomePanelFromUrl } from "@/components/home/HomePanelFromUrl";
import { HomeMotionProvider } from "@/context/HomeMotionContext";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

export function HomeExperience() {
  return (
    <HomeMotionProvider>
      <SmoothScrollProvider>
        <MotionPreloader />
        <Suspense fallback={null}>
          <HomePanelFromUrl />
        </Suspense>
        <PageShell responsiveHome>
          <HomeResponsive />
        </PageShell>
      </SmoothScrollProvider>
    </HomeMotionProvider>
  );
}
