"use client";

import { motion, type MotionValue } from "framer-motion";

type MouseParallaxLayerProps = {
  children?: React.ReactNode;
  x: MotionValue<number>;
  y: MotionValue<number>;
  rotate?: MotionValue<number>;
  className?: string;
};

export function MouseParallaxLayer({
  children,
  x,
  y,
  rotate,
  className = "",
}: MouseParallaxLayerProps) {
  return (
    <motion.div
      className={`will-change-transform ${className}`}
      style={{ x, y, rotate }}
    >
      {children}
    </motion.div>
  );
}
