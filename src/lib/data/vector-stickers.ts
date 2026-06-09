export type VectorStickerPlacement = {
  id: string;
  variant: "globe" | "metal" | "feast-min" | "smash" | "rusty-seal";
  left: string;
  top: string;
  rotate: number;
  delay: number;
  width: number;
};

/** Stickers SVG — minimalistas, sin fondo, estilo editorial actual */
export const VECTOR_STICKERS: VectorStickerPlacement[] = [
  {
    id: "globe-trotamundo",
    variant: "globe",
    left: "3vw",
    top: "10vh",
    rotate: -5,
    delay: 0.6,
    width: 136,
  },
  {
    id: "metal-r",
    variant: "metal",
    left: "81vw",
    top: "14vh",
    rotate: 4,
    delay: 0.65,
    width: 88,
  },
  {
    id: "feast-minimal",
    variant: "feast-min",
    left: "36vw",
    top: "18vh",
    rotate: -3,
    delay: 0.72,
    width: 118,
  },
  {
    id: "smash-now",
    variant: "smash",
    left: "18vw",
    top: "52vh",
    rotate: 8,
    delay: 0.8,
    width: 104,
  },
  {
    id: "rusty-seal",
    variant: "rusty-seal",
    left: "78vw",
    top: "58vh",
    rotate: -5,
    delay: 0.85,
    width: 88,
  },
];
