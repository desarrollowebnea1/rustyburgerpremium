import { PageShell } from "@/components/layout/PageShell";
import { SubPageHero } from "@/components/layout/SubPageHero";
import { LocalAtmosphereSection } from "@/components/motion/LocalAtmosphereSection";
import { SITE } from "@/lib/constants";

export const metadata = {
  title: "Sucursal | Rusty Burger",
};

export default function SucursalPage() {
  return (
    <PageShell>
      <SubPageHero title="SUCURSAL" subtitle="Dark kitchen vibes. Madera, neón naranja, humo y burger." />
      <LocalAtmosphereSection />
      <section className="mx-auto max-w-xl px-4 pb-24 text-center md:px-8">
        <p className="font-display text-xl uppercase text-rusty-orange">{SITE.hours}</p>
        <p className="mt-4 text-rusty-cream/70">{SITE.address}</p>
      </section>
    </PageShell>
  );
}
