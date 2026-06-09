import { PageShell } from "@/components/layout/PageShell";
import { OrderLookupClient } from "@/components/orders/OrderLookupClient";

export const metadata = {
  title: "Seguimiento de pedido | Rusty Burger",
  description: "Consultá el estado de tu pedido Rusty Burger con tu código RB-XXXXXX.",
};

export default function SeguimientoPage() {
  return (
    <PageShell>
      <OrderLookupClient />
    </PageShell>
  );
}
