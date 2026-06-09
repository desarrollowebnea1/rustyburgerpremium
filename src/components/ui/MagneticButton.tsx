"use client";

import { motion } from "framer-motion";
import { useMagnetic } from "@/hooks/useMagnetic";

type MagneticButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
};

export function MagneticButton({
  href,
  children,
  className = "",
  external = true,
}: MagneticButtonProps) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic<HTMLAnchorElement>();

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center justify-center rounded-full bg-rusty-orange px-7 py-3 font-display text-sm uppercase tracking-wider text-rusty-carbon transition-colors will-change-transform hover:bg-rusty-orangeBright ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileTap={{ scale: 0.96 }}
      style={{ transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)" }}
    >
      {children}
    </motion.a>
  );
}
