/** 3 calcomanías Rusty — SVG limpio, sin fondo de foto/madera */
export type RustyBrandStickerVariant = "feast-mode" | "r-fire" | "zero-regrets";

type Props = {
  variant: RustyBrandStickerVariant;
  className?: string;
};

export function RustyBrandStickerArt({ variant, className = "" }: Props) {
  switch (variant) {
    case "feast-mode":
      return (
        <svg
          viewBox="0 0 200 130"
          className={className}
          aria-hidden
          role="img"
        >
          <defs>
            <filter id="feast-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.35" />
            </filter>
          </defs>
          <g filter="url(#feast-shadow)">
            <rect x="8" y="12" width="184" height="106" rx="4" fill="#0A0A0A" />
            <rect x="8" y="12" width="184" height="106" rx="4" fill="none" stroke="#F18700" strokeWidth="2.5" />
            <text
              x="100"
              y="48"
              textAnchor="middle"
              fill="#F2EFEA"
              fontSize="14"
              fontFamily="var(--font-oswald), sans-serif"
              fontWeight="600"
              letterSpacing="0.28em"
            >
              FEAST
            </text>
            <text
              x="100"
              y="82"
              textAnchor="middle"
              fill="#F18700"
              fontSize="28"
              fontFamily="var(--font-oswald), sans-serif"
              fontWeight="700"
              letterSpacing="0.06em"
            >
              MODE ON
            </text>
            {/* Burger icon */}
            <ellipse cx="100" cy="98" rx="22" ry="5" fill="#F18700" opacity="0.35" />
            <path
              d="M82 92 Q100 78 118 92"
              fill="none"
              stroke="#F2EFEA"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M86 90 h28" stroke="#F18700" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "r-fire":
      return (
        <svg viewBox="0 0 140 150" className={className} aria-hidden role="img">
          <defs>
            <linearGradient id="r-fire-grad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#C45A00" />
              <stop offset="45%" stopColor="#F18700" />
              <stop offset="100%" stopColor="#FFB347" />
            </linearGradient>
            <filter id="r-fire-shadow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.4" />
            </filter>
          </defs>
          <g filter="url(#r-fire-shadow)">
            {/* Flame */}
            <path
              d="M70 18 C58 38 52 48 54 62 C48 58 44 68 48 78 C42 72 38 82 44 94 C40 88 36 98 42 108 C50 100 58 108 70 118 C82 108 90 100 98 108 C104 98 100 88 96 94 C102 82 98 72 92 78 C96 68 92 58 86 62 C88 48 82 38 70 18 Z"
              fill="url(#r-fire-grad)"
            />
            <path
              d="M70 42 C64 54 62 62 64 72 C68 66 72 74 70 84 C74 74 78 66 76 72 C78 62 74 54 70 42 Z"
              fill="#FFF5E0"
              opacity="0.75"
            />
            {/* R letter */}
            <text
              x="70"
              y="138"
              textAnchor="middle"
              fill="#F18700"
              fontSize="72"
              fontFamily="var(--font-oswald), sans-serif"
              fontWeight="800"
              stroke="#0A0A0A"
              strokeWidth="3"
              paintOrder="stroke fill"
            >
              R
            </text>
          </g>
        </svg>
      );

    case "zero-regrets":
      return (
        <svg viewBox="0 0 220 120" className={className} aria-hidden role="img">
          <defs>
            <filter id="zr-shadow" x="-15%" y="-20%" width="130%" height="140%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.38" />
            </filter>
          </defs>
          <g filter="url(#zr-shadow)">
            <rect x="6" y="10" width="208" height="100" rx="6" fill="#0A0A0A" />
            <rect x="6" y="10" width="208" height="100" rx="6" fill="none" stroke="#F18700" strokeWidth="2" />
            <text
              x="110"
              y="38"
              textAnchor="middle"
              fill="#F2EFEA"
              fontSize="11"
              fontFamily="var(--font-oswald), sans-serif"
              fontWeight="600"
              letterSpacing="0.22em"
              opacity="0.9"
            >
              BURGER FRIES &amp;
            </text>
            <text
              x="110"
              y="72"
              textAnchor="middle"
              fill="#F18700"
              fontSize="26"
              fontFamily="var(--font-oswald), sans-serif"
              fontWeight="700"
              letterSpacing="0.08em"
            >
              ZERO
            </text>
            <text
              x="110"
              y="98"
              textAnchor="middle"
              fill="#F2EFEA"
              fontSize="22"
              fontFamily="var(--font-oswald), sans-serif"
              fontWeight="700"
              letterSpacing="0.1em"
            >
              REGRETS
            </text>
            <circle cx="28" cy="54" r="8" fill="#F18700" opacity="0.9" />
            <path
              d="M24 54 L28 48 L32 54 L28 58 Z"
              fill="#FFF5E0"
              opacity="0.8"
            />
          </g>
        </svg>
      );
  }
}
