import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useIsMounted } from "@/hooks/use-mounted";

export interface WishlistItem {
  slug: string;
  name: string;
  subtitle?: string;
  price: number;
  image: string;
  category?: string;
}

interface WishlistState {
  items: WishlistItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: (item: WishlistItem) => void;
  isInWishlist: (slug: string) => boolean;
  remove: (slug: string) => void;
}

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: (item) => {
        const { items } = get();
        const exists = items.some((i) => i.slug === item.slug);
        if (exists) {
          set({ items: items.filter((i) => i.slug !== item.slug) });
        } else {
          set({ items: [...items, item] });
        }
      },
      isInWishlist: (slug) => get().items.some((i) => i.slug === slug),
      remove: (slug) => set({ items: get().items.filter((i) => i.slug !== slug) }),
    }),
    {
      name: "socute_beauty_wishlist",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" && typeof localStorage !== "undefined"
          ? localStorage
          : noopStorage,
      ),
    },
  ),
);

export function useIsInWishlist(slug: string) {
  const isMounted = useIsMounted();
  const isInWishlist = useWishlist((s) => s.isInWishlist(slug));
  return isMounted ? isInWishlist : false;
}

export function useWishlistCount() {
  const isMounted = useIsMounted();
  const count = useWishlist((s) => s.items.length);
  return isMounted ? count : 0;
}
