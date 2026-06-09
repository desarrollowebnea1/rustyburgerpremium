"use client";

import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { MotionPreloader } from "@/components/motion/MotionPreloader";
import { HorizontalHome } from "@/components/home/HorizontalHome";
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
        <PageShell horizontalHome>
          <HorizontalHome />
        </PageShell>
      </SmoothScrollProvider>
    </HomeMotionProvider>
  );
}
