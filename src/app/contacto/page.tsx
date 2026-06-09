import { PageShell } from "@/components/layout/PageShell";
import { SubPageHero } from "@/components/layout/SubPageHero";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, SITE, WHATSAPP_URL } from "@/lib/constants";

export const metadata = {
  title: "Contacto | Rusty Burger",
};

export default function ContactoPage() {
  return (
    <PageShell>
      <SubPageHero title="CONTACTO" subtitle="Pedí, preguntá, sumate al Burger Club." />
      <section className="mx-auto flex max-w-lg flex-col items-center gap-8 px-4 py-20 md:px-8">
        <WhatsAppButton size="lg" className="w-full max-w-sm">
          WhatsApp
        </WhatsAppButton>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-display text-2xl uppercase text-rusty-cream hover:text-rusty-orange"
        >
          {INSTAGRAM_HANDLE}
        </a>
        <div className="text-center text-rusty-cream/70">
          <p>{SITE.address}</p>
          <p className="mt-2">{SITE.hours}</p>
          <p className="mt-2">
            <a href={WHATSAPP_URL} className="text-rusty-orange">
              {SITE.phone}
            </a>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
