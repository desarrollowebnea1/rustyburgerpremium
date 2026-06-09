"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type KineticBigTextProps = {
  lines: string[];
  className?: string;
  stroke?: boolean;
  delay?: number;
  play?: boolean;
  variant?: "default" | "editorial-dark";
};

function LineReveal({
  line,
  index,
  stroke,
  delay,
  play,
  variant,
}: {
  line: string;
  index: number;
  stroke: boolean;
  delay: number;
  play: boolean;
  variant: "default" | "editorial-dark";
}) {
  const words = line.split(" ");
  const reduced = useReducedMotion();

  return (
    <span
      className={`block overflow-hidden font-display uppercase leading-[0.82] tracking-tighter ${
        stroke
          ? "text-stroke-rusty text-[clamp(2.5rem,12vw,7rem)]"
          : variant === "editorial-dark"
            ? "text-[clamp(2.75rem,14vw,8.5rem)] text-[#050505]"
            : `text-[clamp(2.75rem,14vw,8.5rem)] ${index === 1 ? "text-rusty-orange" : "text-rusty-cream"}`
      }`}
    >
      {words.map((word, wi) => (
        <span key={`${word}-${wi}`} className="mr-[0.12em] inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: reduced ? 0 : "110%", opacity: reduced ? 1 : 0 }}
            animate={play ? { y: 0, opacity: 1 } : {}}
            transition={{
              delay: delay + wi * 0.06 + index * 0.14,
              duration: reduced ? 0.2 : 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function KineticBigText({
  lines,
  className = "",
  stroke = false,
  delay = 0,
  play = true,
  variant = "default",
}: KineticBigTextProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {lines.map((line, i) => (
        <LineReveal
          key={line + i}
          line={line}
          index={i}
          stroke={stroke}
          delay={delay}
          play={play}
          variant={variant}
        />
      ))}
    </div>
  );
}
