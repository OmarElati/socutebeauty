import { create } from "zustand";
import { useState, useEffect } from "react";

export type CartAddInput = {
  slug: string;
  name: string;
  subtitle?: string | null;
  image?: string | null;
  ml: number;
  price: number;
};

export type CartLine = {
  id: string; // slug + ml
  slug: string;
  name: string;
  subtitle: string;
  image: string;
  ml: number;
  price: number;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (input: CartAddInput) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  subtotal: () => number;
  count: () => number;
  clear: () => void;
};

export const useCart = create<CartState>((set, get) => ({
  lines: [],
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  add: (input) => {
    const id = `${input.slug}-${input.ml}`;
    set((state) => {
      const existing = state.lines.find((l) => l.id === id);
      if (existing) {
        return {
          lines: state.lines.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)),
        };
      }
      return {
        lines: [
          ...state.lines,
          {
            id,
            slug: input.slug,
            name: input.name,
            subtitle: input.subtitle ?? "",
            image: input.image ?? "",
            ml: input.ml,
            price: input.price,
            qty: 1,
          },
        ],
      };
    });
  },
  remove: (id) => set((state) => ({ lines: state.lines.filter((l) => l.id !== id) })),
  updateQty: (id, qty) =>
    set((state) => ({
      lines: state.lines
        .map((l) => (l.id === id ? { ...l, qty: Math.max(0, qty) } : l))
        .filter((l) => l.qty > 0),
    })),
  subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.qty, 0),
  count: () => get().lines.reduce((sum, l) => sum + l.qty, 0),
  clear: () => set({ lines: [] }),
}));

export function useCartCount() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  return mounted ? count : 0;
}
