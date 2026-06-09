import { PageShell } from "@/components/layout/PageShell";
import { SubPageHero } from "@/components/layout/SubPageHero";
import { MotionFAQ } from "@/components/motion/MotionFAQ";

export const metadata = {
  title: "FAQs | Rusty Burger",
};

export default function FaqsPage() {
  return (
    <PageShell>
      <SubPageHero title="FAQS" subtitle="Delivery, iFood, horarios y cómo pedir." />
      <MotionFAQ />
    </PageShell>
  );
}
