"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { useHomeMotion } from "@/context/HomeMotionContext";

/** Lleva al panel MENU de la home horizontal (nunca a /menu). */
export function useGoToHomeMenuPanel() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollToPanel } = useHomeMotion();

  return useCallback(() => {
    if (pathname === "/") {
      scrollToPanel("products");
      return;
    }
    router.push("/?panel=products");
  }, [pathname, router, scrollToPanel]);
}
