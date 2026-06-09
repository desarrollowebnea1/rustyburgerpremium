import Link from "next/link";

type RustyLogoMarkProps = {
  size?: "sm" | "md" | "lg" | "xl";
  /** `light` = fondo claro · `dark` = fondo oscuro */
  tone?: "light" | "dark";
  href?: string;
  className?: string;
};

const SIZE_CLASSES = {
  sm: "text-[1.125rem] md:text-[1.25rem]",
  md: "text-2xl md:text-3xl",
  lg: "text-3xl md:text-4xl",
  xl: "text-[clamp(2rem,12vw,4.5rem)]",
} as const;

export function RustyLogoMark({
  size = "md",
  tone = "dark",
  href,
  className = "",
}: RustyLogoMarkProps) {
  const burgerClass = tone === "light" ? "text-[#0A0A0A]" : "text-rusty-cream";

  const mark = (
    <span
      className={`inline-block font-condensed font-bold uppercase tracking-[-0.04em] ${SIZE_CLASSES[size]} ${className}`}
    >
      <span className="text-rusty-orange [text-shadow:0_2px_14px_rgba(241,135,0,0.35)]">
        RUSTY
      </span>
      <span className={burgerClass}> BURGER</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Rusty Burger inicio" className="inline-block">
        {mark}
      </Link>
    );
  }

  return mark;
}
