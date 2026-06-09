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
      className={`fixed z-[105] flex items-center gap-1.5 rounded-full border-2 border-rusty-orange bg-rusty-carbon/92 font-display uppercase tracking-wider text-rusty-cream shadow-brutal backdrop-blur-sm transition hover:bg-rusty-smoke hover:text-rusty-orange ${
        isHome
          ? "max-lg:bottom-[5.5rem] max-lg:right-3 max-lg:px-3 max-lg:py-2 max-lg:text-[10px] lg:bottom-[6.25rem] lg:right-6 lg:gap-2 lg:px-5 lg:py-3 lg:text-xs"
          : "bottom-6 right-4 gap-2 px-4 py-3 text-xs md:bottom-8 md:right-6"
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
