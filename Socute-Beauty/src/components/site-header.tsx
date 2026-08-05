import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, User, ShoppingBag, Menu, X, ChevronDown, Sparkles, Heart } from "lucide-react";
import { Monogram } from "./monogram";
import { useCart, useCartCount } from "@/lib/cart-store";
import { useWishlist, useWishlistCount } from "@/lib/wishlist-store";
import { WishlistDrawer } from "./wishlist-drawer";
import { AnimatePresence, motion } from "motion/react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { meQuery } from "@/lib/queries";
import { fetchNavTree, slugify, type MegaMenuItem } from "@/lib/nav-mega-menu";
import { LanguageCurrencyDropdown } from "./language-currency-dropdown";
import { GlobalSearchModal } from "./global-search-modal";
import { QuickViewModal, type QuickViewProduct } from "./quick-view-modal";
import { ScentQuizModal } from "./scent-quiz-modal";
import { MobileNavDrawer } from "./mobile-nav-drawer";
import type { MockProduct } from "@/lib/new-products-data";



export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [session, setSession] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [activeMegaSlug, setActiveMegaSlug] = useState<string | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProduct | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  const openCart = useCart((s) => s.open);
  const count = useCartCount();

  const openWishlist = useWishlist((s) => s.open);
  const wishlistCount = useWishlistCount();

  const { data: navItems = [] } = useQuery<MegaMenuItem[]>({
    queryKey: ["nav-tree"],
    queryFn: fetchNavTree,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const { data: me } = useQuery({ ...meQuery(), enabled: session });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeMegaItem = activeMegaSlug ? navItems.find((n) => n.slug === activeMegaSlug) : null;
  const activeMegaGroups = activeMegaItem?.groups ?? null;

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-gold/15 shadow-xl"
            : "bg-background/80 backdrop-blur-sm"
        }`}
        onMouseLeave={() => setActiveMegaSlug(null)}
      >
        {/* Top Header Row: Left Search & Actions, Centered Logo, Right User/Wishlist/Cart */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-8 py-3.5 gap-2">
          {/* Left Side: Mobile Menu Button, Search & Scent Quiz */}
          <div className="flex flex-1 items-center gap-1.5 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-1.5 text-foreground/80 hover:text-gold transition-colors shrink-0"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Mobile Search Button — Positioned safely on left side */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="sm:hidden group/msearch p-1.5 text-foreground/80 hover:text-gold hover:shadow-[0_0_12px_rgba(201,162,75,0.35)] active:scale-95 transition-all rounded-xs cursor-pointer shrink-0"
            >
              <Search
                className="h-4.5 w-4.5 text-gold/90 transition-transform duration-500 ease-out group-hover/msearch:rotate-[360deg]"
                strokeWidth={1.5}
              />
            </button>

            {/* Desktop Research / Search Button with Tooltip, 360 Rotation, Golden Glow & Press Scale-down */}
            <div className="relative group/search hidden sm:inline-block">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search — Discover Collection"
                className="group/searchbtn flex items-center gap-2 px-3 py-1.5 text-foreground/80 hover:text-gold border border-gold/20 hover:border-gold/60 rounded-xs bg-background/50 hover:bg-gold/10 hover:shadow-[0_0_15px_rgba(201,162,75,0.35)] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <Search
                  className="h-4 w-4 text-gold/90 transition-transform duration-500 ease-out group-hover/searchbtn:rotate-[360deg]"
                  strokeWidth={1.5}
                />
                <span className="text-[11px] tracking-wider text-foreground/70 group-hover/searchbtn:text-gold hidden xl:inline">
                  Rechercher...
                </span>
              </button>

              {/* Tooltip on Desktop Hover: 'Discover Collection' */}
              <div className="absolute left-1/2 -bottom-9 -translate-x-1/2 opacity-0 group-hover/search:opacity-100 pointer-events-none transition-all duration-200 z-50">
                <div className="whitespace-nowrap rounded-xs bg-[#230612] px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-gold border border-gold/30 shadow-xl backdrop-blur-md">
                  Discover Collection
                </div>
              </div>
            </div>

            {/* Scent Quiz Button */}
            <button
              type="button"
              onClick={() => setQuizOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-gold border border-gold/30 hover:border-gold rounded-xs bg-gold/10 hover:bg-gold hover:text-ink transition-all font-medium cursor-pointer shrink-0"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Trouver votre parfum</span>
            </button>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex items-center justify-center shrink-0 px-1 sm:px-2">
            <Link
              to="/"
              className="flex flex-col items-center text-center text-foreground group"
              aria-label="Socute Beauty — home"
            >
              <Monogram
                className="h-7 sm:h-8 w-7 sm:w-8 text-gold transition-transform duration-300 group-hover:scale-105"
                animate={false}
                strokeWidth={1.8}
              />
              <div className="mt-0.5 sm:mt-1">
                <div className="font-serif text-base sm:text-xl tracking-wide leading-none font-medium whitespace-nowrap">
                  Socute Beauty
                </div>
                <div className="mt-0.5 text-[7px] sm:text-[8px] uppercase tracking-[0.28em] sm:tracking-[0.35em] text-gold/75 whitespace-nowrap">
                  Cosmétique & Parfumerie
                </div>
              </div>
            </Link>
          </div>

          {/* Right Side: Language Dropdown, Account & Cart */}
          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4 text-foreground/80">
            {/* Language & Currency Dropdown */}
            <div className="hidden sm:block">
              <LanguageCurrencyDropdown />
            </div>

            {session ? (
              <button
                aria-label="Sign out"
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/";
                }}
                className="text-[10px] uppercase tracking-[0.25em] hover:text-gold transition-colors hidden md:block"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/auth"
                aria-label="Sign in"
                className="hover:text-gold transition-colors p-1"
              >
                <User className="h-4.5 w-4.5" strokeWidth={1.5} />
              </Link>
            )}

            {/* Wishlist Button */}
            <button
              onClick={openWishlist}
              aria-label={`Wishlist, ${wishlistCount} items`}
              className="relative p-1 hover:text-gold transition-colors cursor-pointer"
            >
              <Heart className="h-4.5 w-4.5" strokeWidth={1.5} />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 24 }}
                    className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-medium text-ink"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              id="cart-trigger"
              onClick={openCart}
              aria-label={`Cart, ${count} items`}
              className="relative p-1 hover:text-gold transition-colors cursor-pointer"
            >
              <ShoppingBag className="h-4.5 w-4.5" strokeWidth={1.5} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 24 }}
                    className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-medium text-ink"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Second Header Row: Desktop Category Bar (Hover to trigger Mega Menu) */}
        <nav className="hidden md:flex border-t border-gold/15 bg-background/50 py-3 px-6 relative">
          <div className="mx-auto flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2.5 max-w-6xl">
            {navItems.map((cat) => (
              <div
                key={cat.id || cat.slug}
                onMouseEnter={() => {
                  if (cat.hasDropdown) {
                    setActiveMegaSlug(cat.slug);
                  } else {
                    setActiveMegaSlug(null);
                  }
                }}
                className="relative py-1"
              >
                <Link
                  to="/collections/$slug"
                  params={{ slug: cat.slug }}
                  onClick={() => setActiveMegaSlug(null)}
                  className={`group flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.22em] transition-colors font-normal text-center ${
                    activeMegaSlug === cat.slug ? "text-gold" : "text-foreground/85 hover:text-gold"
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat.hasDropdown && (
                    <ChevronDown
                      className={`h-3 w-3 text-gold/70 transition-transform duration-200 ${
                        activeMegaSlug === cat.slug
                          ? "rotate-180 text-gold"
                          : "group-hover:translate-y-0.5"
                      }`}
                    />
                  )}
                </Link>
              </div>
            ))}
          </div>
        </nav>

        {/* Desktop Hover Mega Menu Container */}
        <AnimatePresence>
          {activeMegaSlug && activeMegaGroups && activeMegaGroups.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 right-0 top-full hidden md:block z-50 border-t border-b border-gold/20 bg-[#230612]/95 backdrop-blur-2xl shadow-2xl py-8 px-8 text-foreground"
              onMouseEnter={() => setActiveMegaSlug(activeMegaSlug)}
              onMouseLeave={() => setActiveMegaSlug(null)}
            >
              <div className="mx-auto max-w-7xl">
                <div className="mb-5 flex items-center justify-between border-b border-gold/15 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-gold" />
                    <span className="text-xs uppercase tracking-[0.3em] font-semibold text-gold">
                      {navItems.find((n) => n.slug === activeMegaSlug)?.name}
                    </span>
                  </div>
                  <Link
                    to="/collections/$slug"
                    params={{ slug: activeMegaSlug }}
                    onClick={() => setActiveMegaSlug(null)}
                    className="text-[10px] uppercase tracking-[0.2em] text-gold/80 hover:text-gold hover:underline"
                  >
                    Voir tout →
                  </Link>
                </div>

                {/* Responsive & Flexible Multi-Column Layout for Mega Menu */}
                <div className="flex flex-wrap items-start justify-start gap-x-8 gap-y-8">
                  {activeMegaGroups.map((group, idx) => (
                    <div key={idx} className="space-y-3 min-w-[160px] flex-1 max-w-[260px]">
                      <Link
                        to="/collections/$slug"
                        params={{ slug: slugify(group.title) }}
                        onClick={() => setActiveMegaSlug(null)}
                        className="group/subtitle flex items-center justify-between border-b border-gold/15 pb-1.5 text-[11px] font-normal uppercase tracking-[0.18em] text-gold hover:text-gold-light hover:underline transition-colors block"
                      >
                        <span>{group.title}</span>
                        <span className="text-[10px] opacity-0 group-hover/subtitle:opacity-100 transition-opacity">
                          →
                        </span>
                      </Link>
                      <ul className="space-y-1.5">
                        {group.items.map((sub, sIdx) => (
                          <li key={sIdx}>
                            <Link
                              to="/collections/$slug"
                              params={{ slug: sub.slug }}
                              onClick={() => setActiveMegaSlug(null)}
                              className="text-xs text-foreground/75 hover:text-gold transition-colors block py-0.5 font-sans hover:translate-x-1 transition-transform"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Slide-Out Navigation Drawer */}
        <MobileNavDrawer
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          navItems={navItems}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenQuiz={() => setQuizOpen(true)}
          onOpenCart={openCart}
          onOpenWishlist={openWishlist}
        />
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectQuickView={(prod) => {
          setQuickViewProduct({
            id: prod.id,
            slug: prod.slug,
            name: prod.name,
            subtitle: prod.subtitle,
            category: prod.categories?.name || prod.category_slug,
            concentration: prod.concentration,
            price: prod.price,
            image: prod.image_url,
            description: prod.description,
            ritual: prod.ritual,
            sizes: prod.sizes,
            notes_top: prod.notes_top,
          });
        }}
      />

      {/* Quick View Modal */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />

      {/* Wishlist Drawer */}
      <WishlistDrawer />

      {/* Scent Quiz Modal */}
      <ScentQuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
    </>
  );
}
