"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { CartProductInput } from "@/lib/cart-utils";

type AddToCartButtonProps = {
  product: CartProductInput;
  label?: string;
  className?: string;
  openOnAdd?: boolean;
};

export function AddToCartButton({
  product,
  label = "Agregar",
  className = "",
  openOnAdd = true,
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(product, 1);
    setAdded(true);
    if (openOnAdd) openCart();
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center bg-rusty-orange px-5 py-2.5 font-display text-xs uppercase tracking-wider text-rusty-carbon transition hover:bg-rusty-orangeBright ${className}`}
    >
      {added ? "Agregado ✓" : label}
    </button>
  );
}
