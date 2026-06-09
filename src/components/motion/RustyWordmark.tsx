"use client";

import { motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { WordmarkFireBurst } from "./WordmarkFireBurst";

type RustyWordmarkProps = {
  play?: boolean;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  scaleY?: number;
  targetWidth?: number;
};

/**
 * RUSTY BURGER — tilt + fuego canvas premium al hover.
 */
export function RustyWordmark({
  play = true,
  interactive = false,
  className = "",
  style,
  scaleY = 1.46,
  targetWidth,
}: RustyWordmarkProps) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
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

  const fireEnabled = interactive && !reduced;
  const fireIntensity = hovered ? 1 : 0.38;

  return (
    <motion.div
      className="relative inline-block"
      onHoverStart={() => fireEnabled && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={
        interactive && !reduced
          ? { rotate: -0.75, transition: { type: "spring", stiffness: 280, damping: 28 } }
          : undefined
      }
      style={{ transformOrigin: "left bottom" }}
    >
      {fireEnabled && box.w > 0 && (
        <div
          className="pointer-events-none absolute z-0"
          style={{ left: -box.w * 0.04, top: -box.h * 0.62, width: box.w * 1.08, height: box.h * 1.55 }}
        >
          <WordmarkFireBurst
            active
            intensity={fireIntensity}
            width={box.w * 1.08}
            height={box.h * 1.55}
          />
        </div>
      )}

      {/* Medición sin transform */}
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
        className={`hero-vicio-wordmark hero-wordmark-interactive relative z-[1] select-none whitespace-nowrap ${fireEnabled ? "hero-wordmark-on-fire" : ""} ${hovered ? "hero-wordmark-fire-hot" : ""} ${className}`}
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
