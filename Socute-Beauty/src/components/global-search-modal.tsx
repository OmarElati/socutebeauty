import { useState, useMemo, useEffect, useRef } from "react";
import { Search, X, ArrowRight, Eye, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import { NEW_MOCK_PRODUCTS, type MockProduct } from "@/lib/new-products-data";
import { formatCurrency } from "@/lib/utils";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuickView?: (product: MockProduct) => void;
}

export function GlobalSearchModal({ isOpen, onClose, onSelectQuickView }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return NEW_MOCK_PRODUCTS.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const catMatch = p.categories?.name?.toLowerCase().includes(q);
      const groupMatch = p.group_slug.toLowerCase().includes(q);
      const descMatch = p.description.toLowerCase().includes(q);
      const subMatch = p.subtitle.toLowerCase().includes(q);
      return nameMatch || catMatch || groupMatch || descMatch || subMatch;
    }).slice(0, 8);
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-3xl rounded-xs border border-gold/30 bg-[#230612] p-6 shadow-2xl text-foreground"
        >
          {/* Header & Input */}
          <div className="flex items-center justify-between border-b border-gold/20 pb-4">
            <div className="flex items-center gap-2 text-gold">
              <Sparkles className="h-4 w-4" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium">
                Recherche Socute Beauty
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-foreground/60 hover:text-gold transition-colors"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gold/60" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un produit, soin, parfum..."
              className="w-full border border-gold/25 bg-background/60 py-3.5 pl-12 pr-10 text-sm text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/50 rounded-xs transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-gold"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick Categories list if search is empty */}
          {!query.trim() && (
            <div className="mt-6 pt-2">
              <div className="text-[10px] uppercase tracking-[0.25em] text-foreground/50 mb-3">
                Catégories populaires:
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Best Seller",
                  "Promotion",
                  "Professionnels",
                  "Produit Cosmétique",
                  "Produit Cheveux",
                  "Parfum et brume",
                ].map((catName) => (
                  <button
                    key={catName}
                    type="button"
                    onClick={() => setQuery(catName)}
                    className="text-xs border border-gold/15 bg-surface-deep/60 px-3 py-1.5 text-foreground/75 hover:border-gold/40 hover:text-gold transition-colors"
                  >
                    {catName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {query.trim() && (
            <div className="mt-6 space-y-3 max-h-[60vh] overflow-y-auto pr-1 [scrollbar-width:none]">
              <div className="text-[10px] uppercase tracking-[0.25em] text-gold/75 mb-2">
                {results.length} résultat{results.length > 1 ? "s" : ""} trouvé
                {results.length > 1 ? "s" : ""}
              </div>

              {results.length === 0 ? (
                <div className="py-12 text-center text-sm font-serif italic text-foreground/50">
                  Aucun produit ne correspond à votre recherche "{query}".
                </div>
              ) : (
                results.map((product) => (
                  <div
                    key={product.id}
                    className="group flex items-center justify-between border border-gold/15 bg-surface-deep/50 p-3 transition-colors hover:border-gold/40 hover:bg-surface-deep"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-14 w-12 object-cover border border-gold/10"
                      />
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.25em] text-gold/80">
                          {product.categories?.name || product.category_slug}
                        </div>
                        <h4 className="font-serif text-lg text-foreground group-hover:text-gold transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/50">
                          {product.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-serif text-base text-gold font-normal">
                        {formatCurrency(product.price)}
                      </span>

                      {onSelectQuickView && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectQuickView(product);
                          }}
                          className="flex items-center gap-1 border border-gold/20 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.15em] text-foreground/80 hover:border-gold hover:text-gold transition-all"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Aperçu</span>
                        </button>
                      )}

                      <Link
                        to="/shop/$slug"
                        params={{ slug: product.slug }}
                        onClick={onClose}
                        className="p-1.5 text-gold/70 hover:text-gold"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
