import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, BookOpen, Clock, Tag, X, ArrowRight } from "lucide-react";
import { MonogramFlourish } from "@/components/monogram";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Le Journal Olfactif · Velvet Aura | Socute Beauty" },
      {
        name: "description",
        content:
          "Essais sur les récoltes botaniques, l'architecture des senteurs et la haute parfumerie.",
      },
      { property: "og:title", content: "Le Journal Olfactif · Velvet Aura" },
    ],
  }),
  component: JournalPage,
});

interface Article {
  id: string;
  title: string;
  kicker: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  excerpt: string;
  content: string[];
  quote: string;
  image: string;
}

const ARTICLES: Article[] = [
  {
    id: "art-1",
    title: "The Architecture of Midnight Amber",
    kicker: "Formulation Essay",
    category: "Notes & Accords",
    date: "July 2026",
    readTime: "6 min read",
    author: "Julien Laurent",
    excerpt:
      "Why true golden amber cannot be distilled from stone, but must be constructed layer by layer with resins, vanilla absolute, and smoked papyrus.",
    quote: "Amber is not a ingredient — it is an atmosphere captured in amber glass.",
    image: "/products/product-1.jpg",
    content: [
      "In classical perfumery, amber has always been a poetic illusion. Unlike rose or sandalwood, there is no flower called 'amber'. It is a fantasy accord created by harmonizing warm benzoin from Siam, labdanum from Mediterranean rockrose, and Madagascar vanilla.",
      "At Socute Beauty, we elevate this historical accord by introducing smoked papyrus harvested along the Nile valley and pink pepper from Reunion Island. The resulting sillage is not merely sweet, but carries an intellectual dryness akin to aged leather bindings in a sunlit library.",
      "During our 90-day maceration process, the papyrus slowly tempers the sweetness of benzoin, allowing the resinous heart to glow like candlelight through stained glass.",
    ],
  },
  {
    id: "art-2",
    title: "Harvesting Neroli in Sfax: A Dawn Ritual",
    kicker: "Botanical Dispatch",
    category: "Behind the Harvest",
    date: "June 2026",
    readTime: "8 min read",
    author: "Amira Al-Mansour",
    excerpt:
      "At 5:00 AM before the heat of the Tunisian sun touches the blossoms, local women gather bitter orange petals by hand onto stretched cotton cloths.",
    quote:
      "If the sun touches the petal for an hour, half of the volatile etherial oils evaporate into the sky.",
    image: "/products/product-5.jpg",
    content: [
      "The bitter orange groves of Sfax are among the oldest in the Mediterranean basin. Every spring, when the white blossoms open, the air across the coastal orchards becomes thick with an intoxicating honeyed sweetness.",
      "To preserve the fragile top notes of our Extraits, harvesting begins in darkness. Skilled hands pick individual blossoms, dropping them onto linen sheets laid across the red earth.",
      "By mid-day, the fresh petals undergo gentle hydro-distillation in copper alembics, yielding the sparkling, crisp neroli essence that animates Vert de Serre and Laxte Blanche.",
    ],
  },
  {
    id: "art-3",
    title: "The Solitary Art of Extrait Concentration",
    kicker: "Atelier Perspective",
    category: "Perfumer's Desk",
    date: "May 2026",
    readTime: "5 min read",
    author: "Julien Laurent",
    excerpt:
      "Why modern fragrance has degraded into diluted sprays, and why Socute Beauty insists on a minimum 25% fragrance oil payload.",
    quote: "Mass perfumery sells alcohol and water. Atelier perfumery sells memory and permanence.",
    image: "/products/product-2.jpg",
    content: [
      "Most commercial perfumes found in department stores contain between 8% and 12% aromatic concentrate. The remaining 90% is denatured alcohol designed to evaporate rapidly, producing an immediate burst that vanishes within two hours.",
      "In contrast, Extrait de Parfum represents the highest concentration of the perfumer's craft. At 25% to 30% concentration, the alcohol acts only as a weightless carrier. Upon skin contact, the oils bind with natural sebum, warming slowly over twelve hours.",
      "This creates a sillage that does not invade a room, but draws those nearby into your immediate orbit.",
    ],
  },
  {
    id: "art-4",
    title: "On the Care and Aging of Hand-Cut Crystal Vessels",
    kicker: "Rituals & Objects",
    category: "Refill & Care",
    date: "April 2026",
    readTime: "4 min read",
    author: "House Curator",
    excerpt:
      "How to preserve perfume oils away from heat and UV light, and the craft behind our refillable monobrand decanters.",
    quote:
      "A crystal bottle is meant to be passed down through generations, refilled at the atelier like fine wine.",
    image: "/products/product-4.jpg",
    content: [
      "Perfume is a living chemical harmony. Sunlight, heat fluctuations, and oxygen are its principal adversaries. To shield our formulations, Socute Beauty bottles are crafted from ultra-dense crystal with high UV resistance.",
      "Keep your bottle away from direct bathroom humidity and window sills. A dark dresser or nightstand provides the ideal temperature stability.",
      "When your bottle empties, bring it to any Socute Beauty boutique for complimentary steam cleaning and a 20% discounted refill directly from our apothecary carboys.",
    ],
  },
];

function JournalPage() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = [
    "All",
    "Notes & Accords",
    "Behind the Harvest",
    "Perfumer's Desk",
    "Refill & Care",
  ];

  const filteredArticles =
    activeCategory === "All" ? ARTICLES : ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <div className="min-h-screen pb-24">
      {/* Breadcrumbs Navigation */}
      <div className="mx-auto max-w-7xl px-6 pt-6 pb-2">
        <Breadcrumbs items={[{ label: "Le Journal Olfactif" }]} />
      </div>

      {/* Header */}
      <section className="border-b border-gold/15 bg-surface-deep/60 py-20 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.45em] text-gold">
            <Sparkles className="h-3 w-3" />
            <span>Socute Beauty Gazette</span>
          </div>
          <h1 className="mt-4 font-serif text-5xl italic text-foreground sm:text-6xl">
            The Scent Journal
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-foreground/60">
            Explorations into rare raw materials, botanical harvests, and olfactive architecture.
          </p>
          <MonogramFlourish className="mx-auto mt-8 h-4 w-60 text-gold/40" />
        </div>
      </section>

      {/* Categories */}
      <nav className="sticky top-[73px] z-30 border-b border-gold/15 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl justify-center overflow-x-auto px-6 py-4">
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "border-gold bg-gold text-surface-deep font-medium"
                    : "border-gold/20 text-foreground/60 hover:border-gold/40 hover:text-gold"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Articles Grid */}
      <main className="mx-auto max-w-6xl px-6 pt-16">
        <div className="grid gap-10 md:grid-cols-2">
          {filteredArticles.map((art, idx) => (
            <motion.article
              key={art.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedArticle(art)}
              className="group cursor-pointer rounded-2xl border border-gold/15 bg-card/60 p-6 transition-all duration-300 hover:border-gold/40 hover:bg-card"
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-surface-deep border border-gold/10">
                <img
                  src={art.image}
                  alt={art.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full border border-gold/30 bg-background/80 px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-gold backdrop-blur-md">
                  {art.category}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-gold">
                  <span>{art.kicker}</span>
                  <span>·</span>
                  <span className="text-foreground/50">{art.readTime}</span>
                </div>

                <h2 className="font-serif text-2xl text-foreground group-hover:text-gold transition-colors">
                  {art.title}
                </h2>

                <p className="text-xs text-foreground/70 leading-relaxed line-clamp-3">
                  {art.excerpt}
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-foreground/50 border-t border-gold/10">
                  <span>By {art.author}</span>
                  <span className="group-hover:text-gold flex items-center gap-1">
                    Read Essay <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gold/30 bg-surface-deep p-8 shadow-2xl md:p-12"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-gold/20 text-gold hover:bg-gold/10"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="text-[10px] uppercase tracking-[0.35em] text-gold">
                {selectedArticle.category} · {selectedArticle.date}
              </div>

              <h2 className="mt-3 font-serif text-4xl italic text-foreground">
                {selectedArticle.title}
              </h2>

              <div className="mt-2 text-xs text-foreground/50">
                Written by {selectedArticle.author} — {selectedArticle.readTime}
              </div>

              <blockquote className="my-8 rounded-r-xl border-l-2 border-gold bg-gold/5 p-6 font-serif text-lg italic text-gold">
                &ldquo;{selectedArticle.quote}&rdquo;
              </blockquote>

              <div className="space-y-4 text-sm leading-relaxed text-foreground/85">
                {selectedArticle.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="mt-10 border-t border-gold/20 pt-6 text-center">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="rounded-full border border-gold bg-gold/10 px-8 py-2.5 text-xs uppercase tracking-[0.3em] text-gold hover:bg-gold hover:text-ink transition-colors"
                >
                  Close Article
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
