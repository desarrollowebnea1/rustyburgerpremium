"use client";

import { SITE, WHATSAPP_URL } from "@/lib/constants";
import { FAQ_ITEMS } from "@/lib/data/faqs";
import { useState } from "react";

export function HomePanelClose() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  return (
    <div className="relative w-full bg-rusty-smoke">
      <div className="grain-overlay absolute inset-0" />
      <div className="relative mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-20">
        <h2 className="font-display text-[clamp(2rem,8vw,3.5rem)] uppercase text-rusty-cream">
          FAQS
        </h2>
        <p className="mt-2 text-sm text-rusty-cream/60">Todo lo que necesitás saber antes de pedir.</p>

        <div className="mt-8 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              className="w-full border border-rusty-gray/50 bg-rusty-carbon/80 px-4 py-4 text-left transition hover:border-rusty-orange/40 md:px-5"
            >
              <span className="font-display text-sm uppercase text-rusty-cream md:text-base">
                {item.question}
              </span>
              {openId === item.id && (
                <p className="mt-3 text-sm leading-relaxed text-rusty-cream/70">{item.answer}</p>
              )}
            </button>
          ))}
        </div>

        <div className="mt-12 border-t border-rusty-gray/40 pt-8">
          <p className="font-display text-xs uppercase tracking-widest text-rusty-orange">Contacto</p>
          <p className="mt-3 text-sm text-rusty-cream/70">{SITE.address}</p>
          <p className="text-sm text-rusty-cream/70">{SITE.hours}</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-rusty-cream/70 hover:text-rusty-orange"
          >
            {SITE.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
