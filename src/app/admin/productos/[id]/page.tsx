import { AdminProductFormClient } from "@/components/admin/AdminProductFormClient";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminProductoEditPage({ params }: PageProps) {
  const { id } = await params;
  return <AdminProductFormClient productId={id} />;
}
