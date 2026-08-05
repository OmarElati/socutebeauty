import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  X,
  ChevronDown,
  Search,
  Sparkles,
  Heart,
  ShoppingBag,
  Globe,
  Instagram,
  Facebook,
} from "lucide-react";
import { Monogram } from "./monogram";
import { MEGA_MENU_DATA, slugify } from "@/lib/nav-mega-menu";
import { LanguageCurrencyDropdown } from "./language-currency-dropdown";
import { useWishlistCount } from "@/lib/wishlist-store";
import { useCartCount } from "@/lib/cart-store";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.84V7.65a6.34 6.34 0 0 0-5.46 6.27A6.34 6.34 0 1 0 14.8 20V9.33a8.28 8.28 0 0 0 4.79 1.51V7.39a4.84 4.84 0 0 1-.3-.7z" />
    </svg>
  );
}

export interface NavItem {
  id: string;
  name: string;
  slug: string;
  hasDropdown: boolean;
}

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  onOpenSearch: () => void;
  onOpenQuiz: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

export function MobileNavDrawer({
  isOpen,
  onClose,
  navItems,
  onOpenSearch,
  onOpenQuiz,
  onOpenCart,
  onOpenWishlist,
}: MobileNavDrawerProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const wishlistCount = useWishlistCount();
  const cartCount = useCartCount();

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleCategory = (slug: string) => {
    setExpandedCategory((prev) => (prev === slug ? null : slug));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
          />

          {/* Slide-out Drawer Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 35 }}
            className="absolute top-0 left-0 bottom-0 w-[85%] max-w-[340px] bg-[#1a040d] border-r border-gold/25 shadow-2xl flex flex-col text-foreground overflow-hidden z-10"
          >
            {/* Drawer Top Bar Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gold/20 bg-background/50">
              <Link to="/" onClick={onClose} className="flex items-center gap-2.5 group">
                <Monogram
                  className="h-7 w-7 text-gold transition-transform duration-300 group-hover:scale-105"
                  animate={false}
                  strokeWidth={1.8}
                />
                <div>
                  <div className="font-serif text-base tracking-wide font-medium leading-none text-foreground">
                    Socute Beauty
                  </div>
                  <div className="mt-0.5 text-[7px] uppercase tracking-[0.3em] text-gold/75">
                    Haute Parfumerie
                  </div>
                </div>
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer le menu"
                className="p-1.5 rounded-full text-foreground/80 hover:text-gold hover:bg-gold/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Actions Row inside Drawer */}
            <div className="px-5 py-3.5 border-b border-gold/15 bg-gold/5 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="flex items-center justify-between w-full px-3 py-2 text-xs text-foreground/80 bg-background/60 border border-gold/20 rounded-xs hover:border-gold/50 hover:text-gold transition-all"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-3.5 w-3.5 text-gold" />
                  <span className="tracking-wide">Rechercher un parfum...</span>
                </div>
                <span className="text-[10px] text-gold/60 uppercase tracking-widest">OK</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQuiz();
                }}
                className="flex items-center justify-center gap-2 w-full px-3 py-2 text-[10px] uppercase tracking-[0.2em] font-medium text-ink bg-gold hover:bg-gold-light transition-all rounded-xs shadow-md"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Trouver votre parfum</span>
              </button>

              {/* Wishlist & Cart Quick Shortcuts */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenWishlist();
                  }}
                  className="flex items-center gap-1.5 text-foreground/80 hover:text-gold transition-colors py-1 px-2 rounded-xs border border-gold/10 bg-background/30"
                >
                  <Heart className="h-3.5 w-3.5 text-gold" />
                  <span>Favoris</span>
                  {wishlistCount > 0 && (
                    <span className="ml-1 rounded-full bg-gold/20 px-1.5 py-0.2 text-[9px] font-semibold text-gold">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCart();
                  }}
                  className="flex items-center gap-1.5 text-foreground/80 hover:text-gold transition-colors py-1 px-2 rounded-xs border border-gold/10 bg-background/30"
                >
                  <ShoppingBag className="h-3.5 w-3.5 text-gold" />
                  <span>Panier</span>
                  {cartCount > 0 && (
                    <span className="ml-1 rounded-full bg-gold px-1.5 py-0.2 text-[9px] font-semibold text-ink">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Main Navigation Items Scroll Container */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1 divide-y divide-gold/10">
              <div className="pb-2">
                <p className="text-[9px] uppercase tracking-[0.35em] text-gold/70 font-semibold mb-3">
                  Collections & Rayons
                </p>
                {navItems.map((item) => {
                  const groups = MEGA_MENU_DATA[item.slug];
                  const isExpanded = expandedCategory === item.slug;

                  return (
                    <div key={item.id || item.slug} className="py-1.5">
                      <div className="flex items-center justify-between">
                        <Link
                          to="/collections/$slug"
                          params={{ slug: item.slug }}
                          onClick={onClose}
                          className="text-xs uppercase tracking-[0.18em] font-medium text-foreground/90 hover:text-gold transition-colors flex-1 py-1"
                        >
                          {item.name}
                        </Link>
                        {item.hasDropdown && groups && groups.length > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleCategory(item.slug)}
                            aria-label={`Développer ${item.name}`}
                            className="p-1.5 text-gold/80 hover:text-gold transition-transform duration-200"
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                isExpanded ? "rotate-180 text-gold" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Sub-group links */}
                      <AnimatePresence>
                        {item.hasDropdown && groups && isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-3 mt-1.5 border-l-2 border-gold/30 space-y-3 py-1"
                          >
                            {groups.map((group, gIdx) => (
                              <div key={gIdx} className="space-y-1">
                                <Link
                                  to="/collections/$slug"
                                  params={{ slug: slugify(group.title) }}
                                  onClick={onClose}
                                  className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold block hover:underline"
                                >
                                  {group.title}
                                </Link>
                                <div className="flex flex-col space-y-1 pl-1.5">
                                  {group.items.map((sub, sIdx) => (
                                    <Link
                                      key={sIdx}
                                      to="/collections/$slug"
                                      params={{ slug: sub.slug }}
                                      onClick={onClose}
                                      className="text-xs text-foreground/70 hover:text-gold transition-colors py-0.5 block"
                                    >
                                      {sub.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Maison Links */}
              <div className="pt-4 pb-2">
                <p className="text-[9px] uppercase tracking-[0.35em] text-gold/70 font-semibold mb-3">
                  La Maison
                </p>
                <div className="flex flex-col space-y-2 text-xs">
                  <Link
                    to="/about"
                    onClick={onClose}
                    className="text-foreground/80 hover:text-gold transition-colors py-0.5"
                  >
                    À propos de la Maison
                  </Link>
                  <Link
                    to="/journal"
                    onClick={onClose}
                    className="text-foreground/80 hover:text-gold transition-colors py-0.5"
                  >
                    Journal & Essais
                  </Link>
                  <Link
                    to="/ateliers"
                    onClick={onClose}
                    className="text-foreground/80 hover:text-gold transition-colors py-0.5"
                  >
                    Nos Ateliers
                  </Link>
                  <Link
                    to="/stores"
                    onClick={onClose}
                    className="text-foreground/80 hover:text-gold transition-colors py-0.5"
                  >
                    Nos Boutiques
                  </Link>
                  <Link
                    to="/contact"
                    onClick={onClose}
                    className="text-foreground/80 hover:text-gold transition-colors py-0.5"
                  >
                    Service Client & Contact
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer: Language & Socials */}
            <div className="p-4 border-t border-gold/20 bg-background/60 space-y-3">
              <div className="flex items-center justify-between">
                <LanguageCurrencyDropdown />
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.instagram.com/socute_beauty_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-gold/80 hover:text-gold transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@socutebeauty7"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="text-gold/80 hover:text-gold transition-colors"
                  >
                    <TikTokIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61580827380530&locale=fr_FR"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-gold/80 hover:text-gold transition-colors"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="text-[9px] uppercase tracking-[0.25em] text-foreground/40 text-center">
                © MMXXVI Socute Beauty · Monastir
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
