import { AdminOrderDetailClient } from "@/components/admin/AdminOrderDetailClient";

type PageProps = {
  params: { id: string };
};

export default function AdminPedidoDetailPage({ params }: PageProps) {
  return <AdminOrderDetailClient orderId={params.id} />;
}
