"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ScrollSection } from "./ScrollSection";

const LOCAL_SHOTS = [
  {
    src: "/rusty/local/fachada.svg",
    alt: "Fachada",
    className: "md:col-span-7 md:row-span-2 rotate-[-2deg]",
  },
  {
    src: "/rusty/local/barra.svg",
    alt: "Barra",
    className: "md:col-span-5 rotate-[3deg]",
  },
  {
    src: "/rusty/local/carteles.svg",
    alt: "Carteles",
    className: "md:col-span-5 rotate-[-4deg]",
  },
  {
    src: "/rusty/local/interior.svg",
    alt: "Interior",
    className: "md:col-span-12 rotate-[1deg]",
  },
];

export function LocalAtmosphereSection() {
  return (
    <ScrollSection className="relative bg-rusty-carbon px-4 py-20 md:px-8 md:py-32">
      <div className="grain-overlay absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-7xl">
        <div data-scroll-item className="mb-12 md:mb-16">
          <p className="font-display text-sm tracking-[0.4em] text-rusty-orange">
            EL LOCAL
          </p>
          <h2 className="mt-2 max-w-4xl font-display text-[clamp(2.5rem,8vw,5.5rem)] uppercase leading-[0.9] text-rusty-cream">
            MÁS QUE BURGER,
            <br />
            <span className="text-rusty-orange">EXPERIENCIA RUSTY</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {LOCAL_SHOTS.map((shot) => (
            <motion.figure
              key={shot.src}
              data-scroll-item
              className={`group relative aspect-[4/3] overflow-hidden border-2 border-rusty-gray/50 bg-rusty-smoke transition-transform duration-500 hover:scale-[1.03] ${shot.className}`}
              whileHover={{ rotate: 0 }}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                className="object-cover transition duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rusty-carbon/90 via-rusty-carbon/20 to-transparent" />
            </motion.figure>
          ))}
        </div>
      </div>
    </ScrollSection>
  );
}

export const LocalGallery = LocalAtmosphereSection;
