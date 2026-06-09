import { PageShell } from "@/components/layout/PageShell";
import { SubPageHero } from "@/components/layout/SubPageHero";
import { MarqueeBand } from "@/components/motion/MarqueeBand";

export const metadata = {
  title: "Nosotros | Rusty Burger",
};

export default function NosotrosPage() {
  return (
    <PageShell>
      <SubPageHero
        title="NOSOTROS"
        subtitle="Rusty Food House nació en la calle: burger oscura, actitud viral y cocina sin filtros."
      />
      <MarqueeBand />
      <section className="mx-auto max-w-3xl px-4 py-20 text-lg leading-relaxed text-rusty-cream/80 md:px-8">
        <p className="mb-6">
          No somos un restaurante común. Somos una marca gastronómica con identidad brutalista:
          naranja quemado, negro carbón, stickers y smash que pega en el paladar y en el feed.
        </p>
        <p>
          Seguinos en Instagram{" "}
          <a
            href="https://instagram.com/rusty_burgers_"
            className="text-rusty-orange hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            @rusty_burgers_
          </a>{" "}
          para promos, drops y feast mode.
        </p>
      </section>
    </PageShell>
  );
}
