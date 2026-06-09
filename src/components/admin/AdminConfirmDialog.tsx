"use client";

import { btnDanger, btnSecondary } from "@/components/admin/admin-ui";

export function AdminConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md border border-rusty-gray/40 bg-rusty-carbon p-6">
        <h2 className="font-display text-lg uppercase text-rusty-cream">{title}</h2>
        <p className="mt-3 text-sm text-rusty-cream/70">{message}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={onCancel} disabled={loading} className={btnSecondary}>
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} disabled={loading} className={btnDanger}>
            {loading ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
