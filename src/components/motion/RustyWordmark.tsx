"use client";

import { motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { WordmarkFireBurst } from "./WordmarkFireBurst";

type RustyWordmarkProps = {
  play?: boolean;
  interactive?: boolean;
  /** Fuego táctil + ráfagas sutiles (solo hero mobile) */
  mobileFire?: boolean;
  className?: string;
  style?: React.CSSProperties;
  scaleY?: number;
  targetWidth?: number;
};

const MOBILE_TOUCH_MS = 2600;
const MOBILE_PULSE_MS = 1400;
const MOBILE_PULSE_INTERVAL_MS = 9000;

/**
 * RUSTY BURGER — tilt + fuego canvas premium al hover (desktop).
 * Mobile: fuego al tocar + ráfagas sutiles automáticas.
 */
export function RustyWordmark({
  play = true,
  interactive = false,
  mobileFire = false,
  className = "",
  style,
  scaleY = 1.46,
  targetWidth,
}: RustyWordmarkProps) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [touchFire, setTouchFire] = useState(false);
  const [pulseFire, setPulseFire] = useState(false);
  const [inView, setInView] = useState(!mobileFire);
  const rootRef = useRef<HTMLDivElement>(null);
  const touchTimerRef = useRef<number | null>(null);
  const pulseTimerRef = useRef<number | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [scaleX, setScaleX] = useState(1);
  const [box, setBox] = useState({ w: 0, h: 0 });

  const typoStyle: React.CSSProperties = {
    fontSize: style?.fontSize,
    lineHeight: style?.lineHeight,
    letterSpacing: style?.letterSpacing,
  };

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el || !targetWidth) return;
    const natural = el.offsetWidth;
    if (natural > 0) {
      setScaleX(Math.min(Math.max(targetWidth / natural, 1), 1.1));
    }
  }, [targetWidth, typoStyle.fontSize, typoStyle.letterSpacing]);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setBox({ w: el.offsetWidth, h: el.offsetHeight });
    });
    ro.observe(el);
    setBox({ w: el.offsetWidth, h: el.offsetHeight });
    return () => ro.disconnect();
  }, [scaleX, scaleY, typoStyle.fontSize]);

  useEffect(() => {
    if (!mobileFire || reduced) return;
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mobileFire, reduced]);

  useEffect(() => {
    if (!mobileFire || reduced || !inView) return;

    const entryTimer = window.setTimeout(() => {
      setPulseFire(true);
      pulseTimerRef.current = window.setTimeout(() => setPulseFire(false), MOBILE_PULSE_MS);
    }, 900);

    const interval = window.setInterval(() => {
      setPulseFire(true);
      pulseTimerRef.current = window.setTimeout(() => setPulseFire(false), MOBILE_PULSE_MS);
    }, MOBILE_PULSE_INTERVAL_MS);

    return () => {
      window.clearTimeout(entryTimer);
      window.clearInterval(interval);
      if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
    };
  }, [mobileFire, reduced, inView]);

  useEffect(() => {
    return () => {
      if (touchTimerRef.current) window.clearTimeout(touchTimerRef.current);
      if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
    };
  }, []);

  function handleMobileTap() {
    if (!mobileFire || reduced) return;
    setTouchFire(true);
    if (touchTimerRef.current) window.clearTimeout(touchTimerRef.current);
    touchTimerRef.current = window.setTimeout(() => setTouchFire(false), MOBILE_TOUCH_MS);
  }

  const desktopFire = interactive && !reduced && !mobileFire && hovered;
  const mobileFireActive = mobileFire && !reduced && inView && (touchFire || pulseFire);
  const fireIntensity = touchFire ? 1 : pulseFire ? 0.32 : 0;
  const fireActive = desktopFire || (mobileFireActive && fireIntensity > 0);

  return (
    <motion.div
      ref={rootRef}
      className="relative inline-block"
      onHoverStart={() => interactive && !reduced && !mobileFire && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={mobileFire ? handleMobileTap : undefined}
      onKeyDown={
        mobileFire
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleMobileTap();
              }
            }
          : undefined
      }
      role={mobileFire ? "button" : undefined}
      tabIndex={mobileFire ? 0 : undefined}
      aria-label={mobileFire ? "RUSTY BURGER — tocar para fuego" : undefined}
      whileHover={
        interactive && !reduced && !mobileFire
          ? { rotate: -0.75, transition: { type: "spring", stiffness: 280, damping: 28 } }
          : undefined
      }
      whileTap={mobileFire && !reduced ? { scale: 0.985 } : undefined}
      style={{ transformOrigin: "left bottom" }}
    >
      {fireActive && box.w > 0 && (
        <div
          className="pointer-events-none absolute z-0"
          style={{ left: -box.w * 0.04, top: -box.h * 0.62, width: box.w * 1.08, height: box.h * 1.55 }}
        >
          <WordmarkFireBurst
            active
            width={box.w * 1.08}
            height={box.h * 1.55}
            intensity={mobileFire ? fireIntensity : 1}
          />
        </div>
      )}

      <span
        ref={measureRef}
        aria-hidden
        className="hero-vicio-wordmark pointer-events-none absolute whitespace-nowrap opacity-0"
        style={typoStyle}
      >
        RUSTY BURGER
      </span>

      <motion.h1
        ref={textRef}
        className={`hero-vicio-wordmark hero-wordmark-interactive relative z-[1] select-none whitespace-nowrap ${fireActive ? "hero-wordmark-on-fire" : ""} ${className}`}
        style={{
          ...typoStyle,
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "left bottom",
        }}
        initial={{ opacity: 0, y: reduced ? 0 : 48 }}
        animate={play ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: reduced ? 0.2 : 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
      >
        <span className="hero-wordmark-rusty text-rusty-orange">RUSTY</span>
        <span className="text-[#000000]"> BURGER</span>
      </motion.h1>
    </motion.div>
  );
}
