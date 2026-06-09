import type { Metadata } from "next";
import { Anton, Barlow_Condensed, Inter, Oswald } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-condensed",
  display: "swap",
});

const inter = Inter({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rusty Burger | Feast Mode On",
  description:
    "Hamburguesas oscuras, queso brutal y sabor callejero. Rusty Food House — pedí por WhatsApp o iFood.",
  keywords: ["burger", "smash", "Rusty Burger", "delivery", "São Paulo"],
  openGraph: {
    title: "Rusty Burger — Feast Mode On",
    description: "Burger brand brutalista. Dark kitchen. Smash.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${anton.variable} ${barlowCondensed.variable} ${inter.variable} ${oswald.variable} font-body`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
