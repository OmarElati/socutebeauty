import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, Suspense } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productBySlugQuery, productsQuery } from "@/lib/queries";
import { fromDbRow } from "@/lib/product-shape";
import { ScentPyramid } from "@/components/scent-pyramid";
import { ProductCard } from "@/components/product-card";
import { MonogramFlourish } from "@/components/monogram";
import { useCart } from "@/lib/cart-store";
import { useWishlist, useIsInWishlist } from "@/lib/wishlist-store";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { formatCurrency } from "@/lib/utils";
import { ProductGridSkeleton } from "@/components/product-skeleton";

export const Route = createFileRoute("/shop/$slug")({
  loader: async ({ params, context }) => {
    const row = await context.queryClient.ensureQueryData(productBySlugQuery(params.slug));
    if (!row) throw notFound();
    void context.queryClient.prefetchQuery(productsQuery());
    return { product: fromDbRow(row) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Formulation non trouvée · Socute Beauty" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} · Velvet Aura | Socute Beauty`;
    const description = `${product.subtitle} - ${product.concentration}. ${product.description.slice(0, 140)}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: () => (
    <Suspense fallback={<ProductPageLoading />}>
      <ProductPage />
    </Suspense>
  ),
});

function ProductPageLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 space-y-12">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="aspect-[4/5] velvet-shimmer border border-gold/15 rounded-sm" />
        <div className="space-y-6">
          <div className="h-4 w-1/3 velvet-shimmer rounded-xs" />
          <div className="h-12 w-3/4 velvet-shimmer rounded-sm" />
          <div className="h-6 w-1/2 velvet-shimmer rounded-xs opacity-70" />
          <div className="h-8 w-1/4 velvet-shimmer rounded-xs" />
          <div className="h-24 w-full velvet-shimmer rounded-sm opacity-50" />
        </div>
      </div>
      <ProductGridSkeleton count={3} />
    </div>
  );
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { data: allRows } = useSuspenseQuery(productsQuery());
  const products = allRows.map(fromDbRow);
  const defaultSize = product.sizes[Math.min(1, product.sizes.length - 1)]!;
  const [ml, setMl] = useState<number>(defaultSize.ml);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"description" | "notes" | "ritual">("description");
  const [adding, setAdding] = useState(false);

  const add = useCart((s) => s.add);
  const open = useCart((s) => s.open);

  const toggleWishlist = useWishlist((s) => s.toggle);
  const isInWishlist = useIsInWishlist(product.slug);

  const currentPrice =
    product.sizes.find((s: { ml: number; price: number }) => s.ml === ml)?.price ?? product.price;
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  async function handleAdd() {
    setAdding(true);
    const size =
      product.sizes.find((s: { ml: number; price: number }) => s.ml === ml) ?? product.sizes[0];
    for (let i = 0; i < qty; i++) {
      add({
        slug: product.slug,
        name: product.name,
        subtitle: product.subtitle,
        image: product.image,
        ml: size.ml,
        price: size.price,
      });
    }
    // brief morph then open drawer
    await new Promise((r) => setTimeout(r, 550));
    open();
    setAdding(false);
    toast("Added to your bag", { description: `${product.name} · ${ml} ml` });
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pt-6 pb-2">
        <Breadcrumbs
          items={[
            { label: "Collections", href: "/collections/all" },
            {
              label: product.category || "Shop",
              href: `/collections/${product.category ? product.category.toLowerCase().replace(/\s+/g, "-") : "all"}`,
            },
            { label: product.name },
          ]}
        />
      </div>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-2 md:gap-16 md:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="relative aspect-[4/5] overflow-hidden bg-surface-deep group"
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-[7000ms] ease-out group-hover:scale-110"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="flex flex-col"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
            {product.category} · {product.concentration}
          </span>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] text-foreground md:text-6xl">
            {product.name}
          </h1>
          <p className="mt-3 font-serif text-lg italic text-foreground/70">{product.subtitle}</p>

          <MonogramFlourish className="mt-6 h-3 w-40 text-gold/50" />

          <p className="mt-8 font-serif text-3xl text-gold">{formatCurrency(currentPrice)}</p>

          <div className="mt-10">
            <div className="text-[10px] uppercase tracking-[0.4em] text-foreground/60">Volume</div>
            <div className="mt-4 flex gap-3">
              {product.sizes.map((s: { ml: number; price: number }) => (
                <button
                  key={s.ml}
                  onClick={() => setMl(s.ml)}
                  className={`border px-5 py-3 text-xs uppercase tracking-[0.25em] transition-all ${
                    ml === s.ml
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-gold/25 text-foreground/70 hover:border-gold/60"
                  }`}
                >
                  {s.ml} ml
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-gold/25">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-4 py-3 text-foreground/70 hover:text-gold"
                aria-label="Decrease"
              >
                −
              </button>
              <span className="min-w-8 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-4 py-3 text-foreground/70 hover:text-gold"
                aria-label="Increase"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={adding}
              className="flex-1 overflow-hidden bg-gold px-8 py-4 text-[11px] uppercase tracking-[0.35em] text-ink transition-all hover:bg-gold-soft disabled:opacity-70 cursor-pointer"
            >
              <motion.span
                key={adding ? "adding" : "idle"}
                initial={{ y: adding ? -20 : 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                {adding ? "Ajout au panier…" : "Ajouter au panier"}
              </motion.span>
            </button>

            <button
              type="button"
              onClick={() =>
                toggleWishlist({
                  slug: product.slug,
                  name: product.name,
                  subtitle: product.subtitle,
                  price: currentPrice,
                  image: product.image,
                  category: product.category,
                })
              }
              className={`p-4 border transition-colors cursor-pointer rounded-xs ${
                isInWishlist
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-gold/25 text-foreground/60 hover:border-gold hover:text-gold"
              }`}
              aria-label="Ajouter aux favoris"
            >
              <Heart className={`h-5 w-5 ${isInWishlist ? "fill-gold text-gold" : ""}`} />
            </button>
          </div>

          <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-foreground/40">
            Complimentary shipping over $200 · Samples with every order
          </p>

          {/* Tabs */}
          <div className="mt-14">
            <div className="flex gap-8 border-b border-gold/15">
              {(["description", "notes", "ritual"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`relative pb-4 text-[11px] uppercase tracking-[0.35em] transition-colors ${
                    tab === k ? "text-gold" : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  {k}
                  {tab === k && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute inset-x-0 -bottom-px h-px bg-gold"
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-6 min-h-[120px] text-sm leading-loose text-foreground/75">
              {tab === "description" && <p>{product.description}</p>}
              {tab === "notes" && (
                <div className="space-y-3 font-serif italic">
                  <p>
                    <span className="text-gold not-italic text-[10px] uppercase tracking-[0.4em] mr-3">
                      Top
                    </span>
                    {Array.isArray(product.notes?.top) && product.notes.top.length > 0
                      ? product.notes.top.join(" · ")
                      : "Saffron · Bergamot"}
                  </p>
                  <p>
                    <span className="text-gold not-italic text-[10px] uppercase tracking-[0.4em] mr-3">
                      Heart
                    </span>
                    {Array.isArray(product.notes?.heart) && product.notes.heart.length > 0
                      ? product.notes.heart.join(" · ")
                      : "Turkish Rose · Iris"}
                  </p>
                  <p>
                    <span className="text-gold not-italic text-[10px] uppercase tracking-[0.4em] mr-3">
                      Base
                    </span>
                    {Array.isArray(product.notes?.base) && product.notes.base.length > 0
                      ? product.notes.base.join(" · ")
                      : "Patchouli · Sandalwood"}
                  </p>
                </div>
              )}
              {tab === "ritual" && <p>{product.ritual}</p>}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Scent pyramid */}
      <section className="border-t border-gold/15 bg-surface-deep">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-14 flex flex-col items-center text-center">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
              The composition
            </span>
            <h2 className="mt-4 font-serif text-4xl italic text-foreground md:text-5xl">
              Scent pyramid
            </h2>
            <p className="mt-4 max-w-md text-sm text-foreground/60">
              Move through the three tiers to understand how {product.name} unfolds on skin.
            </p>
          </div>
          <ScentPyramid notes={product.notes} productName={product.name} />
        </div>
      </section>

      {/* Related */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
                Also in the collection
              </span>
              <h2 className="mt-3 font-serif text-3xl italic text-foreground md:text-4xl">
                You may also love
              </h2>
            </div>
          </div>
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {related.map((p, i) => (
              <ProductCard key={p.id || `${p.slug}-${i}`} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
