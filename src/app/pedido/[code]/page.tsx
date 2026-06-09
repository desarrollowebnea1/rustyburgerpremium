import { PageShell } from "@/components/layout/PageShell";
import { OrderTrackingClient } from "@/components/orders/OrderTrackingClient";

export const metadata = {
  title: "Seguimiento de pedido | Rusty Burger",
};

type PageProps = {
  params: { code: string };
};

export default function PedidoPage({ params }: PageProps) {
  return (
    <PageShell>
      <OrderTrackingClient code={params.code} />
    </PageShell>
  );
}
