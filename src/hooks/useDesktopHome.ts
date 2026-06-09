"use client";

import { useEffect, useState } from "react";

export const DESKTOP_HOME_MQ = "(min-width: 1024px)";

/** true en lg+ (desktop horizontal), false en mobile vertical */
export function useDesktopHome() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_HOME_MQ);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop;
}
