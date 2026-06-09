"use client";

export function AdminAlert({
  type,
  message,
  onDismiss,
}: {
  type: "error" | "success";
  message: string;
  onDismiss?: () => void;
}) {
  const styles =
    type === "error"
      ? "border-rusty-fire/40 bg-rusty-fire/10 text-rusty-cream"
      : "border-emerald-500/35 bg-emerald-950/25 text-rusty-cream";

  return (
    <div
      className={`flex items-start justify-between gap-3 border px-4 py-3 text-sm ${styles}`}
      role="alert"
    >
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-rusty-cream/50 transition hover:text-rusty-cream"
          aria-label="Cerrar mensaje"
        >
          ✕
        </button>
      )}
    </div>
  );
}
