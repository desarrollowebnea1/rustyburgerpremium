"use client";

import { useState } from "react";
import { MARQUEE_TEXT } from "@/lib/constants";

export function MarqueeBand({ text = MARQUEE_TEXT }: { text?: string }) {
  const [paused, setPaused] = useState(false);
  const chunk = `${text} `;
  const repeated = chunk.repeat(6);

  return (
    <section
      className="relative flex min-h-[2.65rem] shrink-0 items-center overflow-x-hidden border-y-2 border-rusty-carbon bg-rusty-orange py-2 md:min-h-[3rem] md:py-2.5"
      aria-label="Banda animada Rusty Burger"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`flex h-full w-max items-center ${paused ? "" : "animate-marquee"}`}
        style={{
          animationPlayState: paused ? "paused" : "running",
          willChange: "transform",
        }}
      >
        <span className="inline-block whitespace-nowrap px-6 font-display text-sm uppercase leading-none tracking-[0.22em] text-rusty-carbon md:text-xl md:tracking-[0.25em]">
          {repeated}
        </span>
        <span
          className="inline-block whitespace-nowrap px-6 font-display text-sm uppercase leading-none tracking-[0.22em] text-rusty-carbon md:text-xl md:tracking-[0.25em]"
          aria-hidden
        >
          {repeated}
        </span>
      </div>
    </section>
  );
}
