"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FAQ_ITEMS } from "@/lib/data/faqs";
import Link from "next/link";
import { ScrollSection } from "./ScrollSection";

export function MotionFAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  return (
    <ScrollSection className="bg-rusty-smoke px-4 py-20 md:px-8 md:py-32">
      <div className="relative mx-auto max-w-4xl">
        <div data-scroll-item className="mb-12 text-center md:mb-16">
          <p className="font-display text-sm tracking-[0.4em] text-rusty-orange">FAQ</p>
          <h2 className="mt-2 font-display text-[clamp(2.5rem,10vw,5rem)] uppercase leading-[0.9] text-rusty-cream">
            PREGUNTAS BRUTALES
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <motion.div
                key={item.id}
                data-scroll-item
                layout
                className={`overflow-hidden border-[3px] ${
                  isOpen
                    ? "border-rusty-orange bg-rusty-carbon"
                    : "border-rusty-gray bg-rusty-carbon/80"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex min-h-[72px] w-full items-center justify-between gap-4 px-5 py-5 text-left md:min-h-[88px] md:px-8"
                >
                  <span className="font-display text-lg uppercase leading-tight text-rusty-cream md:text-2xl">
                    {item.question}
                  </span>
                  <motion.span
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center border-2 border-rusty-orange bg-rusty-orange font-display text-2xl text-rusty-carbon"
                    animate={{ rotate: isOpen ? 45 : 0, scale: isOpen ? 1.05 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="border-t border-rusty-gray/40 px-5 pb-7 text-base leading-relaxed text-rusty-cream/75 md:px-8 md:text-lg">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <p data-scroll-item className="mt-10 text-center">
          <Link
            href="/faqs"
            className="font-display text-sm uppercase tracking-widest text-rusty-orange hover:underline"
          >
            Ver todas →
          </Link>
        </p>
      </div>
    </ScrollSection>
  );
}

export const FAQAccordion = MotionFAQ;
