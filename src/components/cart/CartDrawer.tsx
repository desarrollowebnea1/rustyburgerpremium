"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/cart-utils";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    isHydrated,
  } = useCart();

  useEffect(() => {
    if (!isOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar carrito"
            className="fixed inset-0 z-[200] bg-rusty-carbon/70 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Tu pedido"
            className="fixed bottom-0 right-0 z-[210] flex h-[min(92vh,720px)] w-full max-w-md flex-col border-l-2 border-t-2 border-rusty-orange bg-rusty-smoke shadow-2xl md:bottom-0 md:top-0 md:h-full md:max-h-none md:border-t-0"
            initial={{ x: "100%", y: 0 }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: "100%", y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <header className="flex items-center justify-between border-b border-rusty-gray/40 px-5 py-4">
              <div>
                <p className="font-display text-xs uppercase tracking-[0.3em] text-rusty-orange">
                  Rusty Burger
                </p>
                <h2 className="font-display text-2xl uppercase text-rusty-cream">Tu pedido</h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="flex h-10 w-10 items-center justify-center border border-rusty-gray/50 text-rusty-cream hover:border-rusty-orange hover:text-rusty-orange"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {!isHydrated ? (
                <p className="text-sm text-rusty-cream/50">Cargando carrito…</p>
              ) : items.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="font-display text-xl uppercase text-rusty-cream">Carrito vacío</p>
                  <p className="mt-2 text-sm text-rusty-cream/50">
                    Agregá burgers desde el menú.
                  </p>
                  <Link
                    href="/menu"
                    onClick={closeCart}
                    className="mt-6 inline-block bg-rusty-orange px-6 py-3 font-display text-xs uppercase text-rusty-carbon"
                  >
                    Ver menú
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex gap-3 border border-rusty-gray/40 bg-rusty-carbon/60 p-3"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-rusty-carbon">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-rusty-cream/30">
                            RB
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-sm uppercase text-rusty-cream">
                          {item.name}
                        </p>
                        <p className="text-xs text-rusty-orange">
                          {formatCurrency(item.price)}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="flex h-9 w-9 items-center justify-center border border-rusty-gray/50 text-rusty-cream hover:border-rusty-orange"
                            aria-label="Menos cantidad"
                          >
                            −
                          </button>
                          <span className="min-w-[1.5rem] text-center text-sm text-rusty-cream">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="flex h-9 w-9 items-center justify-center border border-rusty-gray/50 text-rusty-cream hover:border-rusty-orange"
                            aria-label="Más cantidad"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="ml-auto text-xs uppercase text-rusty-cream/40 hover:text-rusty-fire"
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {isHydrated && items.length > 0 && (
              <footer className="border-t border-rusty-gray/40 px-5 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-widest text-rusty-cream/60">
                    Subtotal
                  </span>
                  <span className="font-display text-2xl text-rusty-orange">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block bg-rusty-orange py-3 text-center font-display text-sm uppercase tracking-wider text-rusty-carbon transition hover:bg-rusty-orangeBright"
                  >
                    Finalizar pedido
                  </Link>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="py-2 text-center font-display text-xs uppercase tracking-wider text-rusty-cream/60 hover:text-rusty-orange"
                  >
                    Seguir comprando
                  </button>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="py-1 text-center text-[10px] uppercase tracking-widest text-rusty-cream/30 hover:text-rusty-fire"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
