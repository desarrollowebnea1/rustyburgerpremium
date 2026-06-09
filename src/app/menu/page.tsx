import { PageShell } from "@/components/layout/PageShell";
import { SubPageHero } from "@/components/layout/SubPageHero";
import { ProductMotionGrid } from "@/components/motion/ProductMotionGrid";
import { MarqueeBand } from "@/components/motion/MarqueeBand";

export const metadata = {
  title: "Menú | Rusty Burger",
  description: "Smash burgers brutales — Chill Cheese, Molho Rusty y más.",
};

export default function MenuPage() {
  return (
    <PageShell>
      <SubPageHero title="MENU BRUTAL" subtitle="Todas las burgers, sides y salsas Rusty. Pedí por WhatsApp." />
      <MarqueeBand />
      <ProductMotionGrid />
    </PageShell>
  );
}
