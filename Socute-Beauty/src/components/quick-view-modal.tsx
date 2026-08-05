import { useState } from "react";
import { X, ShoppingBag, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";
import { MonogramFlourish } from "./monogram";

export interface QuickViewProduct {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  category?: string;
  concentration?: string;
  price: number;
  image?: string;
  image_url?: string;
  description?: string;
  ritual?: string;
  sizes?: { ml: number; price: number }[];
  notes_top?: string[];
  notes_heart?: string[];
  notes_base?: string[];
}

interface QuickViewModalProps {
  product: QuickViewProduct | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const imageUrl = product.image || product.image_url || "/products/product-1.jpg";
  const sizes =
    product.sizes && product.sizes.length > 0 ? product.sizes : [{ ml: 50, price: product.price }];
  const currentPrice = sizes[selectedSizeIdx]?.price ?? product.price;
  const currentMl = sizes[selectedSizeIdx]?.ml ?? 50;

  const handleAddToCart = () => {
    add({
      slug: product.slug,
      name: product.name,
      subtitle: product.subtitle || "Socute Beauty",
      ml: currentMl,
      price: currentPrice,
      image: imageUrl,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
      openCart();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xs border border-gold/25 bg-[#230612] text-foreground shadow-2xl [scrollbar-width:none]"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 bg-background/60 text-foreground/80 hover:border-gold hover:text-gold backdrop-blur-sm transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Column */}
            <div className="relative aspect-[4/5] bg-surface-deep overflow-hidden md:h-full border-r border-gold/15">
              <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#230612]/70 via-transparent to-transparent" />
              <div className="absolute left-5 top-5 border border-gold/20 bg-background/80 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-gold backdrop-blur-md">
                {product.category || "Aperçu Produit"}
              </div>
            </div>

            {/* Content Column */}
            <div className="flex flex-col justify-between p-6 sm:p-8 md:p-10">
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-gold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{product.concentration || "Formulation d'Exception"}</span>
                </div>

                <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-foreground font-normal">
                  {product.name}
                </h2>

                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-foreground/50">
                  {product.subtitle || "Socute Beauty"}
                </p>

                <div className="mt-5 font-serif text-2xl text-gold">
                  {formatCurrency(currentPrice)}
                </div>

                <p className="mt-4 text-xs sm:text-sm text-foreground/75 leading-relaxed">
                  {product.description ||
                    "Formulation professionnelle premium d'exception, conçue avec les exigences des experts et de Socute Beauty."}
                </p>

                {/* Sizes Selector */}
                {sizes.length > 1 && (
                  <div className="mt-6">
                    <div className="text-[10px] uppercase tracking-[0.35em] text-gold/80 mb-2">
                      Format / Volume
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((sz, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedSizeIdx(idx)}
                          className={`px-3.5 py-1.5 text-xs tracking-wider border transition-all ${
                            selectedSizeIdx === idx
                              ? "border-gold bg-gold/15 text-gold font-medium"
                              : "border-gold/20 text-foreground/60 hover:border-gold/40 hover:text-gold"
                          }`}
                        >
                          {sz.ml} ml · {formatCurrency(sz.price)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes preview if available */}
                {product.notes_top && product.notes_top.length > 0 && (
                  <div className="mt-6 border-t border-gold/15 pt-4 space-y-1.5 text-xs text-foreground/70">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
                        Points Clés:{" "}
                      </span>
                      <span>{product.notes_top.join(" · ")}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-8 border-t border-gold/15 pt-6">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={added}
                  className="w-full flex items-center justify-center gap-3 border border-gold bg-gold/15 px-6 py-3.5 text-xs uppercase tracking-[0.3em] font-medium text-gold hover:bg-gold hover:text-ink transition-all shadow-lg cursor-pointer"
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Ajouté au panier</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span>Ajouter au panier — {formatCurrency(currentPrice)}</span>
                    </>
                  )}
                </button>
                <MonogramFlourish className="mx-auto mt-4 h-3 w-40 text-gold/30" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
