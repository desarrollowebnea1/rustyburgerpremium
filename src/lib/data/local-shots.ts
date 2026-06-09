export type LocalImage = {
  src: string;
  alt: string;
};

export const BARRA_SHOT: LocalImage = {
  src: "/rusty/local/barra-local.jpg",
  alt: "Rusty Food House — fachada del local",
};

/** 3 stickers limpios — PNG transparente, sin fondo de madera */
export const CARTELES_SHOTS: LocalImage[] = [
  {
    src: "/rusty/stickers/sticker-feast-mode.png?v=8",
    alt: "Sticker Feast Mode On",
  },
  {
    src: "/rusty/stickers/sticker-r-fire.png?v=8",
    alt: "Sticker La R",
  },
  {
    src: "/rusty/stickers/sticker-zero-regrets.png?v=8",
    alt: "Sticker Zero Regrets",
  },
];
