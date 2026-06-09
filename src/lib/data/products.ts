export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: string;
  badge?: "TOP" | "PROMO";
  image: string;
};

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "chill-cheese",
    name: "Chill Cheese",
    description: "Doble smash, cheddar fundido y salsa Rusty.",
    price: "R$ 38",
    badge: "TOP",
    image: "/rusty/hero/collage/burger-chill-cheese.jpg",
  },
  {
    id: "2",
    slug: "molho-rusty",
    name: "Molho Rusty",
    description: "La firma: molho secreto, bacon crocante, onion jam.",
    price: "R$ 42",
    badge: "TOP",
    image: "/rusty/hero/collage/burger-melt.jpg",
  },
  {
    id: "3",
    slug: "classica",
    name: "Clássica",
    description: "Smash puro, queijo, pepino, mostaza y ketchup.",
    price: "R$ 32",
    image: "/rusty/hero/collage/burger-classica.jpg",
  },
  {
    id: "4",
    slug: "bacon-cheddar",
    name: "Bacon Cheddar",
    description: "Bacon extra, cheddar americano, cebolla crujiente.",
    price: "R$ 40",
    badge: "PROMO",
    image: "/rusty/hero/collage/burger-feast-mode.jpg",
  },
  {
    id: "5",
    slug: "onion",
    name: "Onion",
    description: "Aros de cebolla, BBQ ahumada, queso derretido.",
    price: "R$ 36",
    image: "/rusty/hero/collage/burger-onion.jpg",
  },
  {
    id: "6",
    slug: "pao-tostado",
    name: "Pão Tostado",
    description: "Pan tostado en mantequilla, smash doble, pickles.",
    price: "R$ 34",
    image: "/rusty/hero/collage/burger-pao-tostado.jpg",
  },
];

export const HORIZONTAL_COLLECTION = [
  { slug: "smash-night", label: "SMASH NIGHT", price: "R$ 45" },
  { slug: "rusty-box", label: "RUSTY BOX", price: "R$ 89" },
  { slug: "feast-duo", label: "FEAST DUO", price: "R$ 72" },
  { slug: "zero-regrets", label: "ZERO REGRETS", price: "R$ 48" },
];
