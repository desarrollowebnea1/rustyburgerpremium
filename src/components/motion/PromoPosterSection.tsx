"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { WHATSAPP_URL } from "@/lib/constants";
import { ScrollSection } from "./ScrollSection";
import { KineticBigText } from "./KineticBigText";

export function PromoPosterSection() {
  return (
    <ScrollSection className="relative overflow-hidden bg-rusty-orange px-4 py-24 md:px-8 md:py-32">
      <div className="absolute inset-0 bg-checker-rusty bg-checker opacity-25 mix-blend-multiply" />
      <div className="grain-overlay absolute inset-0" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12">
        <div data-scroll-item className="relative lg:col-span-7">
          <motion.div
            className="relative aspect-square max-w-xl rotate-[-2deg] overflow-hidden border-[5px] border-rusty-carbon bg-rusty-carbon shadow-[16px_16px_0_#090909]"
            whileHover={{ scale: 1.02, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <Image
              src="/rusty/promos/promo-1.svg"
              alt="Promo Rusty"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </motion.div>
        </div>

        <div data-scroll-item className="lg:col-span-5">
          <p className="font-display text-sm tracking-[0.45em] text-rusty-carbon">
            PROMO RUSTY
          </p>
          <div className="mt-2 text-rusty-carbon">
            <KineticBigText lines={["PROMO", "#1"]} delay={0} />
          </div>
          <p className="mt-6 max-w-sm text-lg font-medium text-rusty-carbon/90">
            Burger + fritas + bebida — combo brutal para compartir o devorar solo.
          </p>
          <p className="mt-4 font-display text-[clamp(3.5rem,12vw,6rem)] leading-none text-rusty-carbon">
            R$ 49
          </p>
          <div className="mt-10">
            <MagneticButton
              href={WHATSAPP_URL}
              className="!bg-rusty-carbon !text-rusty-orange hover:!bg-rusty-smoke"
            >
              PEDIR AHORA
            </MagneticButton>
          </div>
        </div>
      </div>
    </ScrollSection>
  );
}

export const PromoPoster = PromoPosterSection;
