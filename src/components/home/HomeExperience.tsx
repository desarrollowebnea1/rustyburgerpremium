"use client";

import { PageShell } from "@/components/layout/PageShell";
import { MotionPreloader } from "@/components/motion/MotionPreloader";
import { HorizontalHome } from "@/components/home/HorizontalHome";
import { HomeMotionProvider } from "@/context/HomeMotionContext";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

export function HomeExperience() {
  return (
    <HomeMotionProvider>
      <SmoothScrollProvider>
        <MotionPreloader />
        <PageShell horizontalHome>
          <HorizontalHome />
        </PageShell>
      </SmoothScrollProvider>
    </HomeMotionProvider>
  );
}
