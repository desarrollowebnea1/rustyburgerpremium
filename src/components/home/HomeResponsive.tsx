"use client";

import { HorizontalHome } from "@/components/home/HorizontalHome";
import { HomeVertical } from "@/components/home/HomeVertical";
import { useDesktopHome } from "@/hooks/useDesktopHome";

export function HomeResponsive() {
  const isDesktop = useDesktopHome();

  if (isDesktop === null) {
    return <div className="min-h-[100svh] bg-rusty-carbon" aria-hidden />;
  }

  return isDesktop ? <HorizontalHome /> : <HomeVertical />;
}
