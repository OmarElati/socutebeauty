import { AnimatePresence, motion } from "motion/react";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useWishlist } from "@/lib/wishlist-store";
import { useCart } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";
import { MonogramFlourish } from "./monogram";

export function WishlistDrawer() {
  const { isOpen, close, items, remove } = useWishlist();
  const addToCart = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-screen max-w-md bg-[#230612] text-foreground border-l border-gold/25 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gold/15 px-6 py-5">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-gold fill-gold/20" />
                <h2 className="font-serif text-xl font-normal text-foreground">
                  Vos Coups de Cœur ({items.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="p-1 text-foreground/60 hover:text-gold transition-colors"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 [scrollbar-width:none]">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-16">
                  <Heart className="h-12 w-12 text-gold/30 stroke-[1]" />
                  <p className="font-serif text-lg text-foreground/70 italic">
                    Votre liste d'envies est vide.
                  </p>
                  <p className="text-xs text-foreground/50 max-w-xs leading-relaxed">
                    Explorez nos créations Velvet Aura et enregistrez vos fragrances et soins
                    préférés.
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-2 border border-gold/30 bg-gold/10 px-5 py-2 text-xs uppercase tracking-[0.2em] text-gold hover:bg-gold hover:text-ink transition-all"
                  >
                    Découvrir nos collections
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.slug}
                    className="flex gap-4 border border-gold/15 bg-surface-deep/50 p-3.5 rounded-xs transition-colors hover:border-gold/30"
                  >
                    <Link
                      to="/shop/$slug"
                      params={{ slug: item.slug }}
                      onClick={close}
                      className="block shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-16 object-cover border border-gold/10"
                      />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to="/shop/$slug"
                            params={{ slug: item.slug }}
                            onClick={close}
                            className="font-serif text-base text-foreground hover:text-gold transition-colors"
                          >
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => remove(item.slug)}
                            className="text-foreground/40 hover:text-gold transition-colors p-1"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 mt-0.5">
                          {item.subtitle || "Socute Beauty"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gold/10">
                        <span className="font-serif text-base text-gold">
                          {formatCurrency(item.price)}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            addToCart({
                              slug: item.slug,
                              name: item.name,
                              subtitle: item.subtitle || "Socute Beauty",
                              ml: 50,
                              price: item.price,
                              image: item.image,
                            });
                            remove(item.slug);
                            close();
                            openCart();
                          }}
                          className="flex items-center gap-1.5 border border-gold/30 bg-gold/15 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gold hover:bg-gold hover:text-ink transition-all"
                        >
                          <ShoppingBag className="h-3 w-3" />
                          <span>Ajouter</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gold/15 p-6 bg-surface-deep/40 text-center">
                <MonogramFlourish className="mx-auto h-3 w-36 text-gold/30 mb-2" />
                <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/40">
                  Velvet Aura · Socute Beauty
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
