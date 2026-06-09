export function AdminAlert({
  type,
  message,
}: {
  type: "error" | "success";
  message: string;
}) {
  const styles =
    type === "error"
      ? "border-rusty-fire/30 bg-rusty-fire/10 text-rusty-cream"
      : "border-rusty-orange/30 bg-rusty-orange/10 text-rusty-cream";

  return (
    <p className={`border px-4 py-3 text-sm ${styles}`} role="alert">
      {message}
    </p>
  );
}
