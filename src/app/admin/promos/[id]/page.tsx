import { AdminPromoFormClient } from "@/components/admin/AdminPromoFormClient";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminPromoEditPage({ params }: PageProps) {
  const { id } = await params;
  return <AdminPromoFormClient promoId={id} />;
}
