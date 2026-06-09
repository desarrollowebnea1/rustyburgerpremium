import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rusty: {
          carbon: "#090909",
          smoke: "#141414",
          orange: "#F18700",
          orangeBright: "#FF8A00",
          orangeBurnt: "#C96A00",
          cream: "#F2EFEA",
          gray: "#3A3A3A",
          fire: "#E5391D",
        },
      },
      fontFamily: {
        display: ["var(--font-anton)", "Bebas Neue", "Oswald", "sans-serif"],
        condensed: [
          "var(--font-condensed)",
          "var(--font-anton)",
          "Arial Narrow",
          "sans-serif",
        ],
        body: ["var(--font-inter)", "Manrope", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "checker-rusty":
          "linear-gradient(45deg, #141414 25%, transparent 25%), linear-gradient(-45deg, #141414 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #141414 75%), linear-gradient(-45deg, transparent 75%, #141414 75%)",
        "noise":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        checker: "24px 24px",
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(var(--rotate, 0deg))" },
          "50%": { transform: "translateY(-12px) rotate(var(--rotate, 0deg))" },
        },
      },
      boxShadow: {
        rusty: "0 24px 60px -12px rgba(241, 135, 0, 0.35)",
        brutal: "8px 8px 0 #F18700",
      },
    },
  },
  plugins: [],
};

export default config;
