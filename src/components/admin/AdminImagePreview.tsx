"use client";

import { useState } from "react";

type AdminImagePreviewProps = {
  src: string | null | undefined;
  alt?: string;
  className?: string;
  emptyLabel?: string;
};

export function AdminImagePreview({
  src,
  alt = "Vista previa",
  className = "h-24 w-24 object-cover border border-rusty-gray/40",
  emptyLabel = "Sin imagen",
}: AdminImagePreviewProps) {
  const [failed, setFailed] = useState(false);

  if (!src?.trim()) {
    return (
      <div
        className={`flex items-center justify-center bg-rusty-smoke text-[10px] uppercase tracking-wider text-rusty-cream/30 ${className}`}
      >
        {emptyLabel}
      </div>
    );
  }

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-rusty-smoke text-[10px] uppercase tracking-wider text-rusty-fire/80 ${className}`}
      >
        Error al cargar
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
