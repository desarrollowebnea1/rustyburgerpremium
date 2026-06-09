"use client";

import { motion, useMotionValue } from "framer-motion";
import type { VectorStickerPlacement } from "@/lib/data/vector-stickers";

type HeroVectorStickerProps = VectorStickerPlacement;

function StickerArt({
  variant,
  uid,
}: {
  variant: VectorStickerPlacement["variant"];
  uid: string;
}) {
  switch (variant) {
    case "globe":
      return (
        <svg viewBox="0 0 168 132" className="h-full w-full" aria-hidden>
          <defs>
            <linearGradient id={`${uid}-orbit`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0" />
              <stop offset="50%" stopColor="#0A0A0A" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Órbita — estilo space-tech */}
          <ellipse
            cx="72"
            cy="52"
            rx="58"
            ry="14"
            fill="none"
            stroke={`url(#${uid}-orbit)`}
            strokeWidth="0.65"
            transform="rotate(-18 72 52)"
          />
          {/* Globo fino */}
          <circle cx="72" cy="52" r="44" fill="none" stroke="#0A0A0A" strokeWidth="0.55" opacity="0.82" />
          <ellipse cx="72" cy="52" rx="17" ry="44" fill="none" stroke="#0A0A0A" strokeWidth="0.45" opacity="0.38" />
          <path d="M28 52h88M72 8v88" stroke="#0A0A0A" strokeWidth="0.4" opacity="0.22" />
          <circle cx="72" cy="52" r="1.8" fill="#F18700" />
          <circle cx="108" cy="38" r="1.2" fill="#0A0A0A" opacity="0.35" />
          {/* Coordenadas micro */}
          <text
            x="128"
            y="30"
            fill="#0A0A0A"
            fontSize="5.5"
            fontFamily="ui-monospace, monospace"
            letterSpacing="0.12em"
            opacity="0.42"
          >
            34.6°S
          </text>
          <text
            x="72"
            y="112"
            textAnchor="middle"
            fill="#0A0A0A"
            fontSize="6.2"
            fontFamily="var(--font-inter), sans-serif"
            fontWeight="600"
            letterSpacing="0.34em"
            opacity="0.88"
          >
            RUSTYBURGER
          </text>
          <text
            x="72"
            y="124"
            textAnchor="middle"
            fill="#0A0A0A"
            fontSize="5.8"
            fontFamily="var(--font-inter), sans-serif"
            fontWeight="300"
            letterSpacing="0.42em"
            opacity="0.52"
          >
            TROTAMUNDO
          </text>
        </svg>
      );
    case "metal":
      return (
        <svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden>
          <defs>
            <linearGradient id={`${uid}-chrome`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F4F4F4" />
              <stop offset="35%" stopColor="#8E8E8E" />
              <stop offset="68%" stopColor="#D8D8D8" />
              <stop offset="100%" stopColor="#3A3A3A" />
            </linearGradient>
            <linearGradient id={`${uid}-chrome-hi`} x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`${uid}-orange-edge`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F18700" stopOpacity="0" />
              <stop offset="100%" stopColor="#F18700" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          {/* Marco hex — aerospace */}
          <path
            d="M48 6 L84 26 V70 L48 90 L12 70 V26 Z"
            fill="none"
            stroke="#0A0A0A"
            strokeWidth="0.7"
            opacity="0.55"
          />
          <path
            d="M48 10 L80 28 V68 L48 86 L16 68 V28 Z"
            fill="none"
            stroke={`url(#${uid}-chrome)`}
            strokeWidth="1.1"
          />
          {/* Highlight brushed */}
          <path
            d="M22 30 L74 30"
            stroke={`url(#${uid}-chrome-hi)`}
            strokeWidth="0.5"
            opacity="0.65"
          />
          {/* R geométrica — stroke premium, no círculo relleno */}
          <path
            d="M34 68 V30 H52 C62 30 68 36 68 44 C68 51 63 56 54 57 L70 68"
            fill="none"
            stroke="#0A0A0A"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M34 68 V30 H52 C62 30 68 36 68 44 C68 51 63 56 54 57 L70 68"
            fill="none"
            stroke={`url(#${uid}-orange-edge)`}
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />
          {/* Crosshair ticks */}
          <path d="M48 14 V18 M48 78 V82 M14 48 H18 M78 48 H82" stroke="#0A0A0A" strokeWidth="0.45" opacity="0.28" />
        </svg>
      );
    case "feast-min":
      return (
        <svg viewBox="0 0 200 48" className="h-full w-full" aria-hidden>
          <text
            x="0"
            y="18"
            fill="#0A0A0A"
            fontSize="11"
            fontFamily="var(--font-inter), sans-serif"
            fontWeight="500"
            letterSpacing="0.42em"
          >
            FEAST
          </text>
          <text
            x="0"
            y="38"
            fill="#F18700"
            fontSize="22"
            fontFamily="var(--font-oswald), sans-serif"
            fontWeight="600"
            letterSpacing="0.12em"
          >
            MODE ON
          </text>
          <line x1="0" y1="44" x2="120" y2="44" stroke="#0A0A0A" strokeWidth="0.6" opacity="0.25" />
        </svg>
      );
    case "smash":
      return (
        <svg viewBox="0 0 160 56" className="h-full w-full" aria-hidden>
          <rect
            x="0.5"
            y="0.5"
            width="159"
            height="55"
            rx="28"
            fill="none"
            stroke="#0A0A0A"
            strokeWidth="1"
            opacity="0.55"
          />
          <text
            x="80"
            y="34"
            textAnchor="middle"
            fill="#0A0A0A"
            fontSize="13"
            fontFamily="var(--font-inter), sans-serif"
            fontWeight="600"
            letterSpacing="0.38em"
          >
            SMASH
          </text>
        </svg>
      );
    case "rusty-seal":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
          <circle cx="50" cy="50" r="46" fill="none" stroke="#0A0A0A" strokeWidth="1" opacity="0.4" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#F18700" strokeWidth="1.2" opacity="0.9" />
          <text
            x="50"
            y="44"
            textAnchor="middle"
            fill="#F18700"
            fontSize="10"
            fontFamily="var(--font-inter), sans-serif"
            fontWeight="600"
            letterSpacing="0.3em"
          >
            RUSTY
          </text>
          <text
            x="50"
            y="62"
            textAnchor="middle"
            fill="#0A0A0A"
            fontSize="8"
            fontFamily="var(--font-inter), sans-serif"
            fontWeight="400"
            letterSpacing="0.22em"
            opacity="0.75"
          >
            PREMIUM
          </text>
        </svg>
      );
    default:
      return null;
  }
}

export function HeroVectorSticker({
  id,
  variant,
  left,
  top,
  rotate,
  width,
}: HeroVectorStickerProps) {
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  return (
    <motion.div
      data-hero-sticker
      data-sticker-id={id}
      className="hero-vector-sticker pointer-events-auto absolute cursor-grab touch-none active:cursor-grabbing"
      style={{
        left,
        top,
        rotate,
        width,
        x: dragX,
        y: dragY,
        zIndex: 17,
      }}
      drag
      dragElastic={0}
      dragMomentum={false}
      whileDrag={{ zIndex: 40, cursor: "grabbing" }}
      data-lenis-prevent
      data-lenis-prevent-touch
      aria-hidden
    >
      <StickerArt variant={variant} uid={id} />
    </motion.div>
  );
}
