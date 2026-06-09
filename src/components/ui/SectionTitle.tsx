"use client";

import { motion } from "framer-motion";
import { fadeUp, defaultViewport } from "@/lib/motion";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className = "",
}: SectionTitleProps) {
  return (
    <motion.header
      className={`mb-10 md:mb-14 ${align === "center" ? "text-center" : ""} ${className}`}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
    >
      {eyebrow && (
        <p className="mb-2 font-display text-sm tracking-[0.35em] text-rusty-orange md:text-base">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-4xl uppercase leading-[0.9] tracking-tight text-rusty-cream md:text-6xl lg:text-7xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 max-w-xl text-base text-rusty-cream/70 md:text-lg ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.header>
  );
}
