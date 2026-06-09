"use client";

import Image from "next/image";
import { BARRA_SHOT, CARTELES_SHOTS } from "@/lib/data/local-shots";

export function HomePanelLocal() {
  return (
    <div className="relative w-full overflow-hidden bg-rusty-carbon">
      <div className="grain-overlay absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-20">
        <h2 className="font-display text-[clamp(2rem,8vw,4rem)] uppercase leading-[0.9] text-rusty-cream">
          EXPERIENCIA
          <br />
          <span className="text-rusty-orange">RUSTY</span>
        </h2>
        <p className="mt-4 max-w-xl text-sm text-rusty-cream/65 md:text-base">
          Dark kitchen, calle y naranja. El local que se siente en cada mordida.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
          <figure className="overflow-hidden border-2 border-rusty-gray/40 shadow-2xl">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={BARRA_SHOT.src}
                alt={BARRA_SHOT.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
                priority
              />
            </div>
          </figure>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {CARTELES_SHOTS.map((shot) => (
              <figure
                key={shot.src}
                className="overflow-hidden border-2 border-rusty-gray/40 shadow-xl"
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 45vw, 25vw"
                  />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
