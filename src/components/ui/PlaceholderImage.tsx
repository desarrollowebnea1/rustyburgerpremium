import Image from "next/image";

type PlaceholderImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
};

/**
 * Imagen con fallback visual si el asset real aún no está en /public/rusty/
 * Reemplazar src por .jpg/.png reales manteniendo la misma ruta.
 */
export function PlaceholderImage({
  src,
  alt,
  className = "",
  priority = false,
  fill = false,
  width,
  height,
}: PlaceholderImageProps) {
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover ${className}`}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 600}
      height={height ?? 600}
      className={className}
      priority={priority}
    />
  );
}
