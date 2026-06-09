"use client";

import { motion } from "framer-motion";
import { WHATSAPP_URL } from "@/lib/constants";

type WhatsAppButtonProps = {
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary:
    "bg-rusty-orange text-rusty-carbon hover:bg-rusty-orangeBright shadow-brutal",
  outline:
    "border-2 border-rusty-orange text-rusty-orange hover:bg-rusty-orange hover:text-rusty-carbon",
  ghost: "text-rusty-cream hover:text-rusty-orange underline-offset-4 hover:underline",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base md:text-lg",
};

export function WhatsAppButton({
  children = "PEDÍ AHORA",
  className = "",
  variant = "primary",
  size = "md",
}: WhatsAppButtonProps) {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center font-display uppercase tracking-wider transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.a>
  );
}
