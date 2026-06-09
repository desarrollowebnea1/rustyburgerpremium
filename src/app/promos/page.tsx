import { PageShell } from "@/components/layout/PageShell";
import { SubPageHero } from "@/components/layout/SubPageHero";
import { PromoPosterSection } from "@/components/motion/PromoPosterSection";
import { HorizontalCollection } from "@/components/motion/HorizontalCollection";

export const metadata = {
  title: "Promos | Rusty Burger",
};

export default function PromosPage() {
  return (
    <PageShell>
      <SubPageHero title="PROMOS RUSTY" subtitle="Combos, feast mode y cero arrepentimientos." />
      <PromoPosterSection />
      <HorizontalCollection />
    </PageShell>
  );
}
