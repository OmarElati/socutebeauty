import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ChevronDown, Search } from "lucide-react";
import { MonogramFlourish } from "@/components/monogram";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — Socute Beauty" },
      {
        name: "description",
        content:
          "Answers regarding scent sillage, formulation concentration, order tracking, and refill services.",
      },
    ],
  }),
  component: FaqPage,
});

interface FaqItem {
  q: string;
  a: string;
  category:
    "Formulation & Sillage" | "Orders & Courier" | "Refill & Bottle Care" | "Discovery & Vouchers";
}

const FAQS: FaqItem[] = [
  {
    category: "Formulation & Sillage",
    q: "What is the difference between Eau de Parfum and Extrait de Parfum?",
    a: "Our Eaux de Parfum contain 20–22% perfume concentrate oil, delivering a luminous, airy radiance for 6–8 hours. Extraits de Parfum contain 28–32% concentrate, offering a richer, deeper sillage that lingers on skin for over 12 hours.",
  },
  {
    category: "Formulation & Sillage",
    q: "Are your ingredients synthetic or natural?",
    a: "We practice hybrid haute parfumerie. We combine ethically wild-harvested natural resins, absolute oils, and flowers with safe, high-purity aroma-molecules (such as cashmeran and clean musks) to achieve artistic depth while preventing skin allergies.",
  },
  {
    category: "Formulation & Sillage",
    q: "How should I apply my Extrait for maximum longevity?",
    a: "Apply to warm pulse points — the throat, inner wrists, behind the ears, and inside elbows. Avoid rubbing your wrists together, as friction crushes top note molecules.",
  },
  {
    category: "Orders & Courier",
    q: "Quels sont les délais et modalités de livraison (Livraison) ?",
    a: "Toute commande est traitée et expédiée sous 24h. La livraison à domicile s'effectue en 24h à 48h sur toute la Tunisie. Le retrait gratuit en boutique à Monastir est disponible sous 2 heures (Click & Collect).",
  },
  {
    category: "Orders & Courier",
    q: "Can I include a handwritten note for gifts?",
    a: "Yes. During checkout, enter your personal message. Our calligrapher hand-writes every note on gold-embossed cotton parchment.",
  },
  {
    category: "Refill & Bottle Care",
    q: "How does the Maison Refill Service work?",
    a: "Bring your empty Socute Beauty crystal bottle to any boutique worldwide for complimentary steam cleaning and a 20% discounted refill from our apothecary carboys, or order aluminum refill cartridges online.",
  },
  {
    category: "Refill & Bottle Care",
    q: "What is the shelf life of my fragrance?",
    a: "When stored in a cool place away from direct sunlight, high-concentration perfume oils mature like fine wine and remain pristine for 3 to 5 years.",
  },
  {
    category: "Discovery & Vouchers",
    q: "How do I redeem my $75 Discovery Set voucher code?",
    a: "Inside your Discovery Set box is a gold foil card bearing your unique 12-character code. Enter this code at checkout on any 50ml or 100ml bottle order to deduct $75.",
  },
];

function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All",
    "Formulation & Sillage",
    "Orders & Courier",
    "Refill & Bottle Care",
    "Discovery & Vouchers",
  ];

  const filteredFaqs = FAQS.filter((f) => {
    const matchesCategory = activeCategory === "All" || f.category === activeCategory;
    const matchesSearch =
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="border-b border-gold/15 bg-surface-deep/60 py-20 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.45em] text-gold">
            <Sparkles className="h-3 w-3" />
            <span>Maison Knowledge</span>
          </div>
          <h1 className="mt-4 font-serif text-5xl italic text-foreground sm:text-6xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-foreground/60">
            Everything you wish to know regarding our formulations, shipping protocols, and refill
            ateliers.
          </p>
          <MonogramFlourish className="mx-auto mt-8 h-4 w-60 text-gold/40" />
        </div>
      </section>

      {/* Main content */}
      <main className="mx-auto max-w-4xl px-6 pt-12 space-y-10">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-gold" />
          <input
            type="text"
            placeholder="Search questions or keywords (e.g. sillage, refill, voucher)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gold/20 bg-surface-deep/80 pl-11 pr-4 py-3 text-xs text-foreground focus:border-gold focus:outline-none"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer ${
                activeCategory === cat
                  ? "border-gold bg-gold text-surface-deep font-medium"
                  : "border-gold/20 text-foreground/60 hover:border-gold/40 hover:text-gold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-4 pt-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-foreground/50 text-sm font-serif italic">
              No answers matching your search inquiry. Try another search term.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-gold/15 bg-card/60 overflow-hidden transition-colors hover:border-gold/30"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left cursor-pointer"
                  >
                    <span className="font-serif text-lg text-foreground pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-gold shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="border-t border-gold/10 p-5 text-xs leading-relaxed text-foreground/75 bg-surface-deep/40">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
