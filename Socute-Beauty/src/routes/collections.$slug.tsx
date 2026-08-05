import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { Suspense, useMemo, useState } from "react";
import { motion } from "motion/react";
import { productsQuery, categoriesQuery } from "@/lib/queries";
import { fromDbRow } from "@/lib/product-shape";
import { MonogramFlourish } from "@/components/monogram";
import { Sparkles, ArrowRight, SlidersHorizontal, X, Check } from "lucide-react";
import { slugify } from "@/lib/nav-mega-menu";
import { fetchNavTree, type NavNodeRow } from "@/lib/nav-mega-menu";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-skeleton";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/collections/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} · Velvet Aura | Socute Beauty` },
      {
        name: "description",
        content: `Découvrez la gamme ${params.slug.replace(/-/g, " ")} chez Socute Beauty Velvet Aura.`,
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  component: CollectionRoute,
});

function CollectionRoute() {
  return (
    <Suspense fallback={<CollectionLoading />}>
      <CollectionInner />
    </Suspense>
  );
}

function CollectionLoading() {
  return (
    <div className="min-h-screen pb-24">
      <section className="relative border-b border-gold/15 bg-surface-deep/50 py-16 text-center">
        <div className="mx-auto max-w-4xl px-6 space-y-4">
          <div className="mx-auto h-3 w-32 velvet-shimmer rounded-xs opacity-60" />
          <div className="mx-auto h-12 w-64 velvet-shimmer rounded-sm" />
          <div className="mx-auto h-4 w-96 velvet-shimmer rounded-xs opacity-40" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pt-12">
        <ProductGridSkeleton count={6} />
      </section>
    </div>
  );
}

function CollectionInner() {
  const { slug } = Route.useParams();
  const { data: rows } = useSuspenseQuery(productsQuery());
  const { data: categories = [] } = useQuery(categoriesQuery());
  const allProducts = rows.map((r) => fromDbRow(r as unknown as Record<string, unknown>));

  const [sortOption, setSortOption] = useState<"default" | "price-asc" | "price-desc" | "name-asc">(
    "default",
  );
  const [selectedConcentration, setSelectedConcentration] = useState<string>("all");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // ── Nav nodes for dynamic product_ids + category filtering ──────────────
  const { data: allNavNodes = [] } = useQuery<NavNodeRow[]>({
    queryKey: ["nav-nodes-flat"],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from("nav_nodes")
        .select("id, label, slug, parent_id, sort_order, category_id, product_ids");
      return ((data ?? []) as unknown) as NavNodeRow[];
    },
    staleTime: 60_000,
  });

  // Get human title for active category/group/sub-category
  const categoryTitle = useMemo(() => {
    const node = allNavNodes.find((n) => n.slug === slug);
    if (node) return node.label;
    return slug.replace(/-/g, " ");
  }, [slug, allNavNodes]);

  // Sub-groups if slug is a title node with children (subtitles)
  const activeGroups = useMemo(() => {
    const titleNode = allNavNodes.find((n) => n.slug === slug && n.parent_id === null);
    if (!titleNode) return [];
    const subtitles = allNavNodes
      .filter((n) => n.parent_id === titleNode.id)
      .sort((a, b) => a.sort_order - b.sort_order);
    return subtitles.map((sub) => ({
      title: sub.label,
      slug: sub.slug,
      items: allNavNodes
        .filter((n) => n.parent_id === sub.id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((n) => ({ name: n.label, slug: n.slug })),
    }));
  }, [slug, allNavNodes]);

  // Filter products by nav_node product_ids + category_id, or fallback to slug match
  const baseFilteredProducts = useMemo(() => {
    if (slug === "all") return allProducts;

    // Check if slug matches a nav node
    const navNode = allNavNodes.find((n) => n.slug === slug);
    if (navNode) {
      const pinned: string[] = Array.isArray(navNode.product_ids) ? navNode.product_ids : [];
      const hasPinned = pinned.length > 0;
      const hasCat = !!navNode.category_id;

      if (hasPinned || hasCat) {
        return allProducts.filter((p) => {
          if (hasPinned && p.id && pinned.includes(p.id)) return true;
          if (hasCat) {
            const row = rows.find((r) => r.slug === p.slug) as Record<string, unknown> | undefined;
            const catObj = row?.categories as { id?: string } | undefined;
            if (catObj?.id === navNode.category_id) return true;
          }
          return false;
        });
      }
    }

    // Fallback: slug-based category/group matching
    const targetSlug = slug.toLowerCase();
    return allProducts.filter((p) => {
      const matchDb = (rows.find((r) => r.slug === p.slug) ?? p) as Record<string, unknown>;
      const categoriesObj = matchDb.categories as { slug?: string; name?: string } | undefined;
      const catSlug = categoriesObj?.slug?.toLowerCase();
      const pCat = p.category?.toLowerCase();
      return catSlug === targetSlug || pCat === targetSlug || p.slug?.toLowerCase() === targetSlug;
    });
  }, [slug, allProducts, rows, allNavNodes]);

  // Extract available concentrations/formulations in current set
  const concentrations = useMemo(() => {
    const set = new Set<string>();
    baseFilteredProducts.forEach((p) => {
      if (p.concentration) set.add(p.concentration);
    });
    return Array.from(set);
  }, [baseFilteredProducts]);

  // Apply extra filters & sorting
  const finalProducts = useMemo(() => {
    let list = [...baseFilteredProducts];

    if (selectedConcentration !== "all") {
      list = list.filter((p) => p.concentration === selectedConcentration);
    }

    if (sortOption === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortOption === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [baseFilteredProducts, selectedConcentration, sortOption]);

  return (
    <div className="min-h-screen pb-24">
      {/* Breadcrumbs Navigation */}
      <div className="mx-auto max-w-7xl px-6 pt-6 pb-2">
        <Breadcrumbs
          items={[{ label: "Collections", href: "/collections/all" }, { label: categoryTitle }]}
        />
      </div>

      {/* Hero Section */}
      <section className="relative border-b border-gold/15 bg-surface-deep/50 py-12 sm:py-16 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.45em] text-gold"
          >
            <Sparkles className="h-3 w-3" />
            <span>Socute Beauty Velvet Aura</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="mt-4 font-serif text-4xl capitalize italic text-foreground sm:text-6xl"
          >
            {categoryTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-4 max-w-md text-xs sm:text-sm text-foreground/60"
          >
            {slug === "all"
              ? "Découvrez l'ensemble de notre résidence de haute parfumerie, soins précieux et cosmétique d'exception."
              : `Formulations d'exception sélectionnées dans notre série ${categoryTitle}.`}
          </motion.p>

          <MonogramFlourish className="mx-auto mt-6 h-4 w-60 text-gold/40" />
        </div>
      </section>

      {/* Sub-groups Filter (if active category has sub groups) */}
      {activeGroups.length > 0 && (
        <div className="border-b border-gold/15 bg-surface-deep/40 px-6 py-3">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <span className="text-[9px] uppercase tracking-[0.25em] text-gold/80 mr-2 whitespace-nowrap font-medium">
              Gamme:
            </span>
            {activeGroups.map((group, idx) => {
              const gSlug = slugify(group.title);
              return (
                <Link
                  key={idx}
                  to="/collections/$slug"
                  params={{ slug: gSlug }}
                  className="whitespace-nowrap text-[10px] uppercase tracking-[0.18em] text-foreground/70 hover:text-gold transition-colors px-3 py-1 border border-gold/15 hover:border-gold/40 bg-background/50"
                >
                  {group.title}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Layout with Sidebar & Grid */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        {/* Top Control Bar for Mobile / Desktop count */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gold/15 pb-4 text-xs uppercase tracking-[0.25em] text-foreground/60">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen((v) => !v)}
              className="md:hidden flex items-center gap-2 border border-gold/25 bg-surface-deep px-3 py-1.5 text-[10px] text-gold"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filtres</span>
            </button>
            <span>
              {finalProducts.length} produit{finalProducts.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-gold/70 text-[10px]">Trier par:</span>
            <select
              value={sortOption}
              onChange={(e) =>
                setSortOption(e.target.value as "default" | "price-asc" | "price-desc" | "name-asc")
              }
              className="border border-gold/20 bg-[#230612] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-foreground focus:border-gold focus:outline-none rounded-xs"
            >
              <option value="default">Recommandé</option>
              <option value="price-asc">Prix : Croissant</option>
              <option value="price-desc">Prix : Décroissant</option>
              <option value="name-asc">Nom : A à Z</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block md:col-span-1 space-y-8 pr-4 border-r border-gold/15">
            {/* Categories list */}
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium mb-4 pb-2 border-b border-gold/15">
                Collections
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    to="/collections/$slug"
                    params={{ slug: "all" }}
                    className={`block transition-colors ${
                      slug === "all"
                        ? "text-gold font-medium"
                        : "text-foreground/70 hover:text-gold"
                    }`}
                  >
                    Toutes les créations ({allProducts.length})
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      to="/collections/$slug"
                      params={{ slug: c.slug }}
                      className={`block transition-colors ${
                        slug === c.slug
                          ? "text-gold font-medium"
                          : "text-foreground/70 hover:text-gold"
                      }`}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Formulation / Concentration filter */}
            {concentrations.length > 0 && (
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium mb-4 pb-2 border-b border-gold/15">
                  Type / Concentration
                </h3>
                <div className="space-y-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedConcentration("all")}
                    className={`w-full text-left transition-colors flex items-center justify-between ${
                      selectedConcentration === "all"
                        ? "text-gold font-medium"
                        : "text-foreground/70 hover:text-gold"
                    }`}
                  >
                    <span>Tous les types</span>
                    {selectedConcentration === "all" && <Check className="h-3.5 w-3.5" />}
                  </button>
                  {concentrations.map((conc) => (
                    <button
                      key={conc}
                      type="button"
                      onClick={() => setSelectedConcentration(conc)}
                      className={`w-full text-left transition-colors flex items-center justify-between ${
                        selectedConcentration === conc
                          ? "text-gold font-medium"
                          : "text-foreground/70 hover:text-gold"
                      }`}
                    >
                      <span>{conc}</span>
                      {selectedConcentration === conc && (
                        <Check className="h-3.5 w-3.5 text-gold" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main Product Grid */}
          <div className="md:col-span-3">
            {finalProducts.length === 0 ? (
              <div className="border border-gold/15 bg-surface-deep/30 p-16 text-center rounded-xs">
                <h2 className="font-serif text-2xl italic text-foreground">Aucun produit trouvé</h2>
                <p className="mt-3 text-sm text-foreground/60">
                  Aucun produit ne correspond aux filtres sélectionnés.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedConcentration("all");
                    setSortOption("default");
                  }}
                  className="mt-6 inline-flex items-center gap-2 border border-gold bg-gold px-6 py-3 text-[10px] uppercase tracking-[0.3em] text-ink transition-colors hover:bg-gold-soft cursor-pointer"
                >
                  Réinitialiser les filtres <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {finalProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id || `${product.slug}-${idx}`}
                    product={product}
                    index={idx}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
