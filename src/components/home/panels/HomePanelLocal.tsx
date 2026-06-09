"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { BARRA_SHOT, CARTELES_SHOTS } from "@/lib/data/local-shots";

function CartelesHoverCard() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shot = CARTELES_SHOTS[index];

  const stopCycle = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIndex(0);
  }, []);

  const startCycle = useCallback(() => {
    if (CARTELES_SHOTS.length <= 1) return;
    stopCycle();
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % CARTELES_SHOTS.length);
    }, 520);
  }, [stopCycle]);

  useEffect(() => () => stopCycle(), [stopCycle]);

  return (
    <motion.figure
      className="w-[48%] shrink-0 rotate-[3deg] overflow-hidden border-2 border-rusty-gray/40 shadow-2xl"
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative aspect-[4/3] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={shot.src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              className="object-cover"
              sizes="34vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.figure>
  );
}

export function HomePanelLocal() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-rusty-carbon">
      <div className="grain-overlay absolute inset-0" />

      <div className="absolute left-6 top-24 z-10 md:left-10 md:top-28">
        <h2 className="max-w-lg font-display text-[clamp(2rem,8vw,4.5rem)] uppercase leading-[0.9] text-rusty-cream">
          EXPERIENCIA
          <br />
          <span className="text-rusty-orange">RUSTY</span>
        </h2>
      </div>

      <div className="absolute bottom-[18%] right-[5%] flex w-[min(78vw,880px)] items-end gap-3 md:bottom-[20%] md:right-[6%] md:gap-5 max-md:bottom-[12%] max-md:w-[88vw]">
        <motion.figure
          className="w-[52%] shrink-0 rotate-[3deg] overflow-hidden border-2 border-rusty-gray/40 shadow-2xl"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={BARRA_SHOT.src}
              alt={BARRA_SHOT.alt}
              fill
              className="object-cover"
              sizes="36vw"
              priority
            />
          </div>
        </motion.figure>

        <CartelesHoverCard />
      </div>
    </div>
  );
}
