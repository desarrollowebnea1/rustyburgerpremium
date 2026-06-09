import { PageShell } from "@/components/layout/PageShell";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata = {
  title: "Checkout | Rusty Burger",
};

export default function CheckoutPage() {
  return (
    <PageShell>
      <CheckoutClient />
    </PageShell>
  );
}
