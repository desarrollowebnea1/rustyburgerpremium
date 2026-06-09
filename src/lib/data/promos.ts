export type Promo = {
  id: string;
  number: number;
  name: string;
  tagline: string;
  description: string;
  price: string;
  image: string;
};

export const RUSTY_PROMOS: Promo[] = [
  {
    id: "promo-1",
    number: 1,
    name: "Combo Rusty",
    tagline: "Burger + fritas + bebida",
    description: "Burger + fritas + bebida",
    price: "R$ 49",
    image: "/rusty/hero/collage/burger-classica.jpg",
  },
  {
    id: "promo-2",
    number: 2,
    name: "Feast Duo",
    tagline: "2 burgers + 2 bebidas",
    description: "2 burgers + 2 bebidas — feast mode para dos.",
    price: "R$ 72",
    image: "/rusty/hero/collage/burger-feast-mode.jpg",
  },
  {
    id: "promo-3",
    number: 3,
    name: "Smash Night",
    tagline: "Burger smash + papas",
    description: "Burger smash + papas crocantes.",
    price: "R$ 45",
    image: "/rusty/hero/collage/burger-chill-cheese.jpg",
  },
  {
    id: "promo-4",
    number: 4,
    name: "Rusty Box",
    tagline: "Box familiar brutal",
    description: "4 burgers + fritas + bebidas — para el crew.",
    price: "R$ 89",
    image: "/rusty/hero/collage/burger-melt.jpg",
  },
];
