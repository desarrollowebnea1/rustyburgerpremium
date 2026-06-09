/**
 * Matriz forense Vicio @ 1920×1080 — valores objetivo para réplica Rusty.
 * Fuente: overlay captura vicio.com + medición visual normalizada.
 */
export const HERO_VICIO_SPEC = {
  canvas: {
    bg: "#F1EFE8",
    height: "100svh",
  },

  /** Header fijo */
  header: {
    logoLeft: "1.25rem",
    logoTop: "1.1rem",
    logoSize: "1.375rem",
    ctaPaddingX: "1.25rem",
    ctaPaddingY: "0.55rem",
    promoMaxWidth: "220px",
    promoSize: "7px",
    promoTracking: "0.2em",
  },

  /** Burger hero — overlap central */
  burger: {
    left: "0vw",
    top: "5.5vh",
    height: "58vh",
    maxWidth: "41vw",
    zIndex: 30,
    hoverScale: 0.96,
  },

  /** Bloque editorial derecho */
  editorial: {
    top: "8.5vh",
    right: "1.5vw",
    width: "56vw",
    metaTop: "0",
    metaPaddingLeft: "2vw",
    titlePaddingLeft: "0",
    titleSize: "9.15vw",
    titleLineHeight: 0.84,
    titleTracking: "-0.048em",
  },

  /** 3 fotos — sandwich entre título y COLLECTION */
  collageRow: {
    marginTop: "1.2vh",
    marginLeft: "8vw",
    width: "88%",
    height: "34vh",
    gap: "5px",
  },

  /** COLLECTION — abajo izquierda, burger la tapa parcialmente */
  collection: {
    left: "6vw",
    top: "56vh",
    fontSize: "8.8vw",
    lineHeight: 0.86,
    tracking: "-0.046em",
    zIndex: 12,
  },

  /** Link menú */
  menuLink: {
    left: "6vw",
    top: "68.5vh",
  },

  /** Línea variedades — esquina inferior izquierda */
  menuLine: {
    left: "2.8vw",
    bottom: "11.5vh",
    maxWidth: "54vw",
    fontSize: "7.5px",
    tracking: "0.24em",
  },

  /** Micro-copy */
  micro: {
    handleLeft: "40vw",
    handleTop: "36vh",
    metaGlobeLeft: "41vw",
    metaGlobeTop: "7.5vh",
  },

  /** Footer nav */
  footer: {
    bottom: "1rem",
    linkSize: "11px",
    linkTracking: "0.1em",
    iconSize: "20px",
  },
} as const;

/** Valores Rusty actuales (pre-calibración) para delta */
export const HERO_RUSTY_BEFORE = {
  burger: { left: "2vw", top: "4vh", height: "62vh", maxWidth: "42vw" },
  title: { size: "11.4vw", right: "0" },
  collageRow: { height: "48vh", marginLeft: "14%" },
  collection: { top: "auto", inRightStack: true },
} as const;
