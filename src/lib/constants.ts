export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5547984062460";

export const WHATSAPP_MESSAGE =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
  "Olá! Quero pedir no Rusty Burger";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export const INSTAGRAM_URL = "https://instagram.com/rusty_burgers_";
export const INSTAGRAM_HANDLE = "@rusty_burgers_";

export const SITE = {
  name: "Rusty Burger",
  tagline: "Rusty Food House",
  address:
    "RUSTY FOOD HOUSE - AVENIDA MARGINAL LESTE 390, BALNEARIO CAMBORIU",
  hours: "Mar–Dom · 18h–00h",
  phone: "5547984062460",
} as const;

export const ASSETS = {
  logo: "/rusty/logo/rusty-logo.svg",
  logoAlt: "/rusty/logo/rusty-logo.png",
  heroBurger: "/rusty/products/hero-burger.svg",
  textures: {
    grunge: "/rusty/textures/grunge.svg",
    checker: "/rusty/textures/checker.svg",
  },
  products: (slug: string) => `/rusty/products/${slug}.jpg`,
  stickers: (name: string) => `/rusty/stickers/${name}.svg`,
  local: (name: string) => `/rusty/local/${name}.jpg`,
  promos: (name: string) => `/rusty/promos/${name}.jpg`,
} as const;

export const NAV_LINKS = [
  { href: "/menu", label: "MENU" },
  { href: "/promos", label: "PROMOS" },
  { href: "/nosotros", label: "NOSOTROS" },
  { href: "/sucursal", label: "SUCURSAL" },
  { href: "/faqs", label: "FAQS" },
] as const;

export const MARQUEE_TEXT =
  "RUSTY BURGER · FEAST MODE ON · SMASH BURGER · PEDÍ AHORA · DELIVERY · ZERO REGRETS · BORA PRO RUSTY · ";

export type HeroStickerConfig = {
  label: string;
  rotate: number;
  variant: "orange" | "cream" | "fire" | "outline";
  delay: number;
  className: string;
  mobile?: boolean;
};

export const HERO_STICKERS: HeroStickerConfig[] = [
  {
    label: "FEAST MODE ON",
    rotate: -8,
    variant: "orange",
    delay: 0.25,
    className: "absolute -left-2 top-2 z-30 md:left-2 md:top-6",
    mobile: true,
  },
  {
    label: "ZERO REGRETS",
    rotate: 10,
    variant: "cream",
    delay: 0.35,
    className: "absolute right-0 top-16 z-30 md:right-6 md:top-20",
    mobile: true,
  },
  {
    label: "PEDÍ AHORA",
    rotate: -4,
    variant: "fire",
    delay: 0.45,
    className: "absolute bottom-36 left-2 z-30 md:bottom-44 md:left-6",
    mobile: true,
  },
  {
    label: "BURGER CLUB",
    rotate: 12,
    variant: "outline",
    delay: 0.55,
    className: "absolute bottom-12 right-0 z-30 md:right-10 md:bottom-16",
    mobile: true,
  },
  {
    label: "RUSTY SAUCE",
    rotate: -14,
    variant: "orange",
    delay: 0.65,
    className: "absolute left-1/2 top-1/2 z-30 hidden -translate-x-1/2 md:block",
    mobile: false,
  },
  {
    label: "HOT & LOUD",
    rotate: 6,
    variant: "fire",
    delay: 0.75,
    className: "absolute -right-4 top-1/3 z-30 hidden md:block",
    mobile: false,
  },
  {
    label: "SMASH IT",
    rotate: -10,
    variant: "cream",
    delay: 0.85,
    className: "absolute bottom-24 right-1/4 z-30 hidden lg:block",
    mobile: false,
  },
];
