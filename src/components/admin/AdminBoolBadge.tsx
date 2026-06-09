export function AdminBoolBadge({
  value,
  trueLabel = "Sí",
  falseLabel = "No",
}: {
  value: boolean;
  trueLabel?: string;
  falseLabel?: string;
}) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider ${
        value
          ? "bg-rusty-orange/20 text-rusty-orange"
          : "bg-rusty-gray/30 text-rusty-cream/40"
      }`}
    >
      {value ? trueLabel : falseLabel}
    </span>
  );
}
