"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  sanitizeCartItems,
  toCartItemFromProduct,
  type CartItem,
  type CartProductInput,
} from "@/lib/cart-utils";

export type { CartItem } from "@/lib/cart-utils";

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  isHydrated: boolean;
  cartCount: number;
  subtotal: number;
  addItem: (product: CartProductInput, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        setItems(sanitizeCartItems(parsed));
      }
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
      setItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addItem = useCallback((product: CartProductInput, quantity = 1) => {
    const qty = Math.max(1, Math.floor(quantity));

    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, toCartItemFromProduct(product, qty)];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const qty = Math.floor(quantity);
    if (qty < 1) {
      setItems((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: qty } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      isHydrated,
      cartCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
    }),
    [
      items,
      isOpen,
      isHydrated,
      cartCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return ctx;
}
