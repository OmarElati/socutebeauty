import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Eye, Heart } from "lucide-react";
import type { DisplayProduct } from "@/lib/product-shape";
import { formatCurrency } from "@/lib/utils";
import { QuickViewModal } from "./quick-view-modal";
import { useWishlist, useIsInWishlist } from "@/lib/wishlist-store";

export function ProductCard({ product, index = 0 }: { product: DisplayProduct; index?: number }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const toggleWishlist = useWishlist((s) => s.toggle);
  const isInWishlist = useIsInWishlist(product.slug);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="group relative block">
          <Link to="/shop/$slug" params={{ slug: product.slug }}>
            <div className="relative aspect-[4/5] overflow-hidden bg-surface-deep border border-gold/10 hover:border-gold/30 transition-colors">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[7000ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-deep/60 via-transparent to-transparent" />
              <div className="absolute left-5 top-5 text-[10px] uppercase tracking-[0.35em] text-gold-soft/80">
                {product.category}
              </div>

              {/* Heart Wishlist Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist({
                    slug: product.slug,
                    name: product.name,
                    subtitle: product.subtitle,
                    price: product.price,
                    image: product.image,
                    category: product.category,
                  });
                }}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gold/20 bg-background/60 text-foreground/80 hover:border-gold hover:text-gold backdrop-blur-md transition-all cursor-pointer"
                aria-label="Ajouter aux favoris"
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    isInWishlist ? "fill-gold text-gold" : "text-foreground/80 hover:text-gold"
                  }`}
                />
              </button>

              {/* Quick View Hover Trigger */}
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setQuickViewOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 border border-gold bg-[#230612]/90 backdrop-blur-md py-2 px-4 text-[10px] uppercase tracking-[0.25em] text-gold hover:bg-gold hover:text-ink transition-all shadow-lg cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Aperçu rapide</span>
                </button>
              </div>
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl text-foreground group-hover:text-gold transition-colors">
                  {product.name}
                </h3>
                <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-foreground/50">
                  {product.subtitle}
                </p>
              </div>
              <p className="font-serif text-lg text-gold">{formatCurrency(product.price)}</p>
            </div>
          </Link>
        </div>
      </motion.div>

      {quickViewOpen && (
        <QuickViewModal
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            subtitle: product.subtitle,
            category: product.category,
            concentration: product.concentration,
            price: product.price,
            image: product.image,
            description: product.description,
            ritual: product.ritual,
            sizes: product.sizes,
            notes_top: product.notes_top,
          }}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
}
