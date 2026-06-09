"use client";

import { motion, type MotionValue } from "framer-motion";
import { useState } from "react";
import { useHomeMotion } from "@/context/HomeMotionContext";

type FloatingStickerProps = {
  label: string;
  className?: string;
  rotate?: number;
  delay?: number;
  variant?: "orange" | "cream" | "fire" | "outline";
  style?: React.CSSProperties;
  offsetX?: MotionValue<number>;
  offsetY?: MotionValue<number>;
};

const variantStyles = {
  orange:
    "bg-rusty-orange text-rusty-carbon shadow-[4px_4px_0_#090909] border-2 border-rusty-carbon",
  cream:
    "bg-rusty-cream text-rusty-carbon shadow-[4px_4px_0_#C96A00] border-2 border-rusty-carbon",
  fire:
    "bg-rusty-fire text-rusty-cream shadow-[4px_4px_0_#090909] border-2 border-rusty-carbon",
  outline:
    "border-[3px] border-rusty-orange bg-rusty-carbon/90 text-rusty-orange backdrop-blur-sm shadow-brutal",
};

export function FloatingSticker({
  label,
  className = "",
  rotate = -6,
  delay = 0,
  variant = "orange",
  style,
  offsetX,
  offsetY,
}: FloatingStickerProps) {
  const { heroPlay } = useHomeMotion();
  const [dragging, setDragging] = useState(false);

  return (
    <motion.div
      className={`pointer-events-auto z-[75] cursor-grab touch-none select-none px-3 py-2 font-display text-[10px] uppercase tracking-widest active:cursor-grabbing md:px-4 md:py-2.5 md:text-xs ${variantStyles[variant]} ${className}`}
      style={{
        ...style,
        x: offsetX,
        y: offsetY,
        rotate,
      }}
      drag
      dragElastic={0.12}
      dragMomentum={false}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      whileDrag={{ scale: 1.08, zIndex: 200, cursor: "grabbing" }}
      initial={{ opacity: 0, scale: 0.5, rotate: rotate - 24 }}
      animate={
        heroPlay
          ? {
              opacity: 1,
              scale: 1,
              rotate,
              y: dragging ? 0 : [0, -10, 0],
            }
          : { opacity: 0, scale: 0.5 }
      }
      transition={{
        delay,
        type: "spring",
        stiffness: 260,
        damping: 16,
        y: dragging
          ? { duration: 0 }
          : { duration: 3.5 + delay, repeat: Infinity, ease: "easeInOut" },
      }}
      whileHover={
        dragging ? {} : { scale: 1.12, rotate: rotate > 0 ? rotate + 8 : rotate - 8 }
      }
      data-lenis-prevent
      aria-hidden
    >
      <span className="block">{label}</span>
    </motion.div>
  );
}

export function FloatingStickerLayer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-30 ${className}`}>
      {children}
    </div>
  );
}
