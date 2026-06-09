"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartFloatingButton } from "@/components/cart/CartFloatingButton";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
      <CartFloatingButton />
    </CartProvider>
  );
}
