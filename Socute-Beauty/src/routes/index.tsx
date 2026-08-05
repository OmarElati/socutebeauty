import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useRef, useState } from "react";
import { Monogram, MonogramFlourish } from "@/components/monogram";
import { productsQuery } from "@/lib/queries";
import { fromDbRow, type DisplayProduct } from "@/lib/product-shape";
import { formatCurrency } from "@/lib/utils";
import { ProductGridSkeleton } from "@/components/product-skeleton";
import { useWishlist, useIsInWishlist } from "@/lib/wishlist-store";
import { Heart, Sparkles, Loader2 } from "lucide-react";
import { ScentQuizModal } from "@/components/scent-quiz-modal";
import houseImage from "@/assets/house.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Socute Beauty · Velvet Aura — Haute Parfumerie & Cosmétique" },
      {
        name: "description",
        content:
          "Velvet Aura par Socute Beauty — Découvrez nos créations olfactives d'exception, soins précieux et cosmétique de luxe.",
      },
      { property: "og:title", content: "Socute Beauty · Velvet Aura" },
      {
        property: "og:description",
        content: "Haute Parfumerie & Cosmétique d'Exception.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  component: Index,
});

function Index() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-6 py-24">
          <ProductGridSkeleton count={6} />
        </div>
      }
    >
      <IndexInner />
    </Suspense>
  );
}

function IndexInner() {
  const [quizOpen, setQuizOpen] = useState(false);
  const { data: rows } = useSuspenseQuery(productsQuery());
  const products = rows.map(fromDbRow);
  const featured = (
    products.filter(
      (p) => (rows.find((r) => r.slug === p.slug) as { featured?: boolean } | undefined)?.featured,
    ).length
      ? products.filter(
          (p) =>
            (rows.find((r) => r.slug === p.slug) as { featured?: boolean } | undefined)?.featured,
        )
      : products
  ).slice(0, 6);
  const firstSlug = products[0]?.slug ?? "ombre-velours";
  const secondSlug = products[1]?.slug ?? firstSlug;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const monogramScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0px", "35px"]);

  const houseRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: houseScrollProgress } = useScroll({
    target: houseRef,
    offset: ["start end", "end start"],
  });
  const houseImageY = useTransform(houseScrollProgress, [0, 1], ["-8%", "8%"]);
  const houseImageScale = useTransform(houseScrollProgress, [0, 1], [1.08, 1]);

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden pt-4 pb-16">
        {/* Parallax Background Glow Effects */}
        <motion.div
          style={{ y: bgY }}
          className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
        />
        <motion.div
          style={{ y: bgY }}
          className="pointer-events-none absolute -left-20 top-1/3 h-80 w-80 rounded-full bg-[#3d0a20]/40 blur-3xl"
        />

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-start px-6 pt-4 pb-12 text-center relative z-10">
          <motion.div style={{ scale: monogramScale }} className="mt-2">
            <Monogram className="h-40 w-40 text-gold sm:h-56 sm:w-56" strokeWidth={1.2} />
          </motion.div>

          <motion.div style={{ y: textY }} className="flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-4xl font-serif text-5xl leading-[1.05] text-foreground sm:text-6xl md:text-7xl"
            >
              Velvet Aura,
              <span className="block italic text-gold-soft mt-1">
                l'élégance portée comme un souvenir.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-6 max-w-lg text-sm leading-relaxed text-foreground/75"
            >
              Haute parfumerie, soins précieux et cosmétique d'exception. Chaque formule est
              élaborée dans nos ateliers pour sublimer votre sillage avec raffinement.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                to="/shop/$slug"
                params={{ slug: firstSlug }}
                className="border border-gold bg-gold px-8 py-4 text-[11px] uppercase tracking-[0.35em] text-ink transition-colors hover:bg-transparent hover:text-gold shadow-lg"
              >
                Découvrir la collection
              </Link>
              <button
                type="button"
                onClick={() => setQuizOpen(true)}
                className="flex items-center gap-2 border border-gold/40 bg-gold/10 hover:bg-gold hover:text-ink px-6 py-4 text-[11px] uppercase tracking-[0.3em] font-medium text-gold transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Trouver votre parfum</span>
              </button>
              <a
                href="#featured"
                className="gold-underline px-2 py-4 text-[11px] uppercase tracking-[0.35em] text-foreground/75 hover:text-gold"
              >
                La Maison
              </a>
            </motion.div>
          </motion.div>

          <MonogramFlourish className="mt-14 h-4 w-72 text-gold/50" />
        </div>
      </section>

      {/* Featured */}
      <section id="featured" className="bg-surface-light text-ink">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] uppercase tracking-[0.4em] text-ink/50">
              The Collection
            </span>
            <h2 className="mt-4 font-serif text-4xl italic md:text-5xl">Fragrances in residence</h2>
          </div>

          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {featured.map((p, i) => (
              <div key={p.id || `${p.slug}-${i}`} className="text-ink">
                <FeaturedCardLight product={p} index={i} />
              </div>
            ))}
          </div>

          <ViewAllButton totalCount={products.length} />
        </div>
      </section>

      {/* The house */}
      <section ref={houseRef} className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-28 md:grid-cols-2 md:items-center md:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="aspect-[4/5] overflow-hidden bg-surface-deep rounded-xs border border-gold/20 shadow-2xl relative"
          >
            <motion.img
              style={{ y: houseImageY, scale: houseImageScale }}
              src={houseImage}
              alt="The Socute Beauty atelier"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold">The house</span>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-foreground md:text-5xl">
              A parfumerie unhurried by <em className="text-gold-soft">season</em>.
            </h2>
            <MonogramFlourish className="mt-8 h-4 w-56 text-gold/50" />
            <p className="mt-8 text-sm leading-loose text-foreground/70">
              Founded in a quiet street off the Marais, Socute Beauty composes in small batches,
              ageing each accord in oak for six months before it reaches the bottle. We work with
              growers we have known for two decades — a single rose field in Grasse, a vetiver
              plantation in Haiti, oud distilled slowly in Assam.
            </p>
            <p className="mt-6 text-sm leading-loose text-foreground/70">
              There are no seasonal launches. There are no reformulations. There is only the
              composition, the wait, and the bottle.
            </p>
            <a
              href="#"
              className="mt-10 inline-block border border-gold/40 px-6 py-3 text-[11px] uppercase tracking-[0.3em] text-gold hover:bg-gold hover:text-ink transition-colors"
            >
              Read the story
            </a>
          </div>
        </div>
      </section>

      {/* Journal teaser */}
      <section className="bg-surface-deep">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold">Journal</span>
              <h2 className="mt-3 font-serif text-3xl italic text-foreground md:text-4xl">
                Fragments & essays
              </h2>
            </div>
            <a
              href="#"
              className="gold-underline hidden text-[11px] uppercase tracking-[0.3em] text-foreground/70 md:inline"
            >
              All entries
            </a>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {[
              {
                kicker: "Perfumery",
                title: "On the patience of oud",
                excerpt:
                  "Why we age our Assam distillate for six months in oak, and what it does to the resin.",
              },
              {
                kicker: "Ritual",
                title: "The pulse point, reconsidered",
                excerpt: "A short guide to layering scent in low light, from our senior perfumer.",
              },
            ].map((post) => (
              <a key={post.title} href="#" className="group block border-t border-gold/15 pt-8">
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold/70">{post.kicker}</p>
                <h3 className="mt-4 font-serif text-2xl italic text-foreground group-hover:text-gold transition-colors md:text-3xl">
                  {post.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-loose text-foreground/60">
                  {post.excerpt}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Scent Quiz Modal */}
      <ScentQuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
    </>
  );
}

// Card variant scoped to the light surface so we get the correct contrast
function FeaturedCardLight({ product, index }: { product: DisplayProduct; index: number }) {
  const toggleWishlist = useWishlist((s) => s.toggle);
  const isInWishlist = useIsInWishlist(product.slug);

  const badge =
    index === 0
      ? "Bestseller"
      : index === 1
        ? "Nouveauté"
        : index === 3
          ? "Édition Limitée"
          : index === 4
            ? "Bestseller"
            : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <div className="group relative block h-full rounded-xs border border-gold/0 hover:border-gold/30 p-2 sm:p-3 bg-transparent hover:bg-gold/5 transition-all duration-300 shadow-none hover:shadow-2xl">
        <Link to="/shop/$slug" params={{ slug: product.slug }}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xs bg-surface-deep">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />

            {/* Soft, semi-transparent gold overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#230612]/60 via-gold/10 to-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Gold-accented Badge or Category */}
            {badge ? (
              <span className="absolute left-3 top-3 z-10 rounded-xs border border-gold/60 bg-[#1e050f]/90 px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-gold font-medium backdrop-blur-md shadow-lg">
                {badge}
              </span>
            ) : (
              <span className="absolute left-3 top-3 z-10 rounded-xs border border-gold/25 bg-[#1e050f]/65 px-2 py-0.5 text-[8px] uppercase tracking-[0.28em] text-gold-soft backdrop-blur-sm">
                {product.category}
              </span>
            )}

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
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-background/80 text-foreground/80 hover:border-gold hover:text-gold backdrop-blur-md transition-all cursor-pointer shadow-md active:scale-90"
              aria-label="Ajouter aux favoris"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isInWishlist ? "fill-gold text-gold" : "text-foreground/80 hover:text-gold"
                }`}
              />
            </button>
          </div>

          <div className="mt-4 flex items-baseline justify-between gap-3 px-1">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-ink group-hover:text-gold transition-colors font-medium">
                {product.name}
              </h3>
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-ink/65 font-medium">
                {product.subtitle}
              </p>
            </div>
            <p className="font-serif text-base sm:text-lg text-gold-dark font-semibold whitespace-nowrap">
              {formatCurrency(product.price)}
            </p>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

function ViewAllButton({ totalCount }: { totalCount: number }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate({ to: "/collections/$slug", params: { slug: "all" } });
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mt-16 text-center"
    >
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 border border-ink/20 hover:border-gold/60 rounded-xs bg-transparent hover:bg-gold/10 text-[11px] uppercase tracking-[0.35em] text-ink hover:text-gold font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,162,75,0.25)] hover:[text-shadow:_0_0_8px_rgba(201,162,75,0.4)] active:scale-95 cursor-pointer disabled:opacity-85"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 text-gold animate-spin" />
            <span>Chargement...</span>
          </>
        ) : (
          <span>
            {totalCount > 0 ? `Voir les ${totalCount} créations` : "Voir toute la collection"}
          </span>
        )}
      </button>
    </motion.div>
  );
}
