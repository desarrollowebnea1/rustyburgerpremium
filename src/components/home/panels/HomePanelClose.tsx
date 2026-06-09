"use client";

import { SITE, WHATSAPP_URL } from "@/lib/constants";
import { FAQ_ITEMS } from "@/lib/data/faqs";
import { useState } from "react";

type PanelLayout = "horizontal" | "vertical";

function CloseHorizontal() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-rusty-smoke">
      <div className="grain-overlay absolute inset-0" />
      <div className="absolute inset-x-4 top-24 bottom-[38%] z-10 flex flex-col justify-center md:inset-x-10 md:bottom-[36%]">
        <h2 className="font-display text-3xl uppercase text-rusty-cream md:text-4xl">FAQS</h2>
        <div className="mt-4 max-h-[38vh] space-y-2 overflow-y-auto hide-scrollbar">
          {FAQ_ITEMS.slice(0, 4).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              className="w-full border border-rusty-gray/50 bg-rusty-carbon/80 px-4 py-3 text-left"
            >
              <span className="font-display text-sm uppercase text-rusty-cream">{item.question}</span>
              {openId === item.id && (
                <p className="mt-2 text-sm text-rusty-cream/65">{item.answer}</p>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-4 bottom-24 z-10 md:inset-x-10">
        <div>
          <p className="font-display text-xs uppercase tracking-widest text-rusty-orange">Contacto</p>
          <p className="mt-2 text-sm text-rusty-cream/70">{SITE.address}</p>
          <p className="text-sm text-rusty-cream/70">{SITE.hours}</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-sm text-rusty-cream/70 hover:text-rusty-orange"
          >
            {SITE.phone}
          </a>
        </div>
      </div>
      <p className="pointer-events-none absolute bottom-24 left-0 right-0 text-center font-display text-[clamp(3rem,14vw,8rem)] uppercase leading-none text-rusty-carbon/30">
        FEAST MODE ON
      </p>
    </div>
  );
}

function CloseVertical() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  return (
    <div className="relative w-full bg-rusty-smoke">
      <div className="grain-overlay absolute inset-0" />
      <div className="relative mx-auto max-w-3xl px-4 py-12">
        <h2 className="font-display text-[clamp(2rem,8vw,3.5rem)] uppercase text-rusty-cream">FAQS</h2>
        <p className="mt-2 text-sm text-rusty-cream/60">Todo lo que necesitás saber antes de pedir.</p>
        <div className="mt-8 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              className="w-full border border-rusty-gray/50 bg-rusty-carbon/80 px-4 py-4 text-left transition hover:border-rusty-orange/40"
            >
              <span className="font-display text-sm uppercase text-rusty-cream">{item.question}</span>
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

export function HomePanelClose({ layout = "vertical" }: { layout?: PanelLayout }) {
  return layout === "horizontal" ? <CloseHorizontal /> : <CloseVertical />;
}
