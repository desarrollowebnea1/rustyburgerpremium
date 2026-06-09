export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "delivery",
    question: "¿Hacen delivery?",
    answer:
      "Sí. Pedí por WhatsApp o iFood. Zona de entrega según disponibilidad — consultanos antes de cerrar tu pedido.",
  },
  {
    id: "ubicacion",
    question: "¿Dónde están?",
    answer:
      "RUSTY FOOD HOUSE - AVENIDA MARGINAL LESTE 390, BALNEARIO CAMBORIU",
  },
  {
    id: "como-pido",
    question: "¿Cómo pido?",
    answer:
      "WhatsApp directo (botón PEDÍ AHORA), iFood o en el mostrador. Elegí burger, sides y bebida — te confirmamos en minutos.",
  },
  {
    id: "combos",
    question: "¿Tienen combos?",
    answer:
      "Sí. Promo Rusty #1: burger + fritas + bebida. Más combos en Promos y stories de Instagram.",
  },
  {
    id: "ifood",
    question: "¿Aceptan iFood?",
    answer: "Sí, buscá Rusty Burger en iFood para delivery con la misma brutalidad de sabor.",
  },
  {
    id: "horarios",
    question: "¿Horarios?",
    answer: "Mar–Dom · 18h–00h (ajustar según local). Feriados: seguinos en Instagram.",
  },
];
