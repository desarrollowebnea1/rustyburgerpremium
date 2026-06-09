"use client";

import { KineticBigText } from "@/components/motion/KineticBigText";
import { motion } from "framer-motion";

type SubPageHeroProps = {
  title: string;
  subtitle?: string;
};

export function SubPageHero({ title, subtitle }: SubPageHeroProps) {
  const lines = title.split(" ");

  return (
    <section className="relative overflow-hidden border-b border-rusty-gray/40 bg-rusty-smoke px-4 pb-16 pt-32 md:px-8 md:pt-40">
      <div className="absolute inset-0 bg-checker-rusty bg-checker opacity-15" />
      <div className="relative mx-auto max-w-7xl">
        <KineticBigText
          lines={
            lines.length > 2
              ? [lines.slice(0, Math.ceil(lines.length / 2)).join(" "), lines.slice(Math.ceil(lines.length / 2)).join(" ")]
              : [title]
          }
        />
        {subtitle && (
          <motion.p
            className="mt-6 max-w-xl text-rusty-cream/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
