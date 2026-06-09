"use client";

import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export function CartFloatingButton() {
  const { cartCount, openCart, isHydrated } = useCart();
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");
  const isCheckoutFlow =
    pathname === "/checkout" || pathname.startsWith("/pedido/");

  if (isAdmin || isCheckoutFlow) return null;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="Abrir carrito"
      className={`fixed right-4 z-[115] flex items-center gap-2 rounded-full border-2 border-rusty-orange bg-rusty-carbon/92 px-4 py-3 font-display text-xs uppercase tracking-wider text-rusty-cream shadow-brutal backdrop-blur-sm transition hover:bg-rusty-smoke hover:text-rusty-orange md:right-6 md:px-5 ${
        isHome ? "bottom-[5.75rem] md:bottom-[6.25rem]" : "bottom-6 md:bottom-8"
      }`}
    >
      <span aria-hidden className="text-base leading-none">
        🛒
      </span>
      <span>Pedido</span>
      {isHydrated && cartCount > 0 && (
        <span className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-rusty-orange px-1.5 text-[11px] text-rusty-carbon">
          {cartCount}
        </span>
      )}
    </button>
  );
}
