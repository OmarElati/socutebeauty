import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, ArrowRight, RotateCcw, Check, ShoppingBag, Heart } from "lucide-react";
import { NEW_MOCK_PRODUCTS, type MockProduct } from "@/lib/new-products-data";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { formatCurrency } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

interface QuizQuestion {
  id: string;
  title: string;
  subtitle: string;
  options: {
    label: string;
    desc: string;
    tag: string;
  }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "mood",
    title: "Quel univers caractérise votre humeur ?",
    subtitle: "Sélectionnez l'atmosphère qui vous ressemble aujourd'hui.",
    options: [
      {
        label: "Nuit Mystérieuse & Velours",
        desc: "Notes profondes d'ambre, de cuir précieux et de fumée rare.",
        tag: "amber",
      },
      {
        label: "Aube Fraîche & Lumineuse",
        desc: "Éclats d'agrumes de Calabre et fraîcheur rosée du matin.",
        tag: "fresh",
      },
      {
        label: "Élégance Florale & Sensuelle",
        desc: "Rose de Turquie, Iris velouté et bouquets d'exception.",
        tag: "floral",
      },
      {
        label: "Intensité Boisée & Rares Résines",
        desc: "Oud somptueux, santal crémant et patchouli d'Indonésie.",
        tag: "woody",
      },
    ],
  },
  {
    id: "notes",
    title: "Quelles notes olfactives vous captivent ?",
    subtitle: "Choisissez votre signature olfactive préférée.",
    options: [
      {
        label: "Safran, Oud & Épices Chaudes",
        desc: "Opulence et chaleur des terres d'Orient.",
        tag: "amber",
      },
      {
        label: "Rose Damascena & Beurre d'Iris",
        desc: "Romantisme et douceur poudrée de haute couture.",
        tag: "floral",
      },
      {
        label: "Bergamote, Néroli & Thés Rares",
        desc: "Vivacité, fraîcheur éclatante et clarté.",
        tag: "fresh",
      },
      {
        label: "Santal Crémant, Vétiver & Cèdre",
        desc: "Sillage boisé, chaleureux et envoûtant.",
        tag: "woody",
      },
    ],
  },
  {
    id: "occasion",
    title: "Pour quel moment de vie cherchez-vous ce parfum ?",
    subtitle: "Votre parfum accompagne vos rituels les plus précieux.",
    options: [
      {
        label: "Grandes Soirées & Événements",
        desc: "Pour marquer les esprits d'un sillage inoubliable.",
        tag: "amber",
      },
      {
        label: "Signature Quotidienne Raffinée",
        desc: "Une présence élégante et équilibrée du matin au soir.",
        tag: "fresh",
      },
      {
        label: "Rendez-vous Intimes & Rituels Privés",
        desc: "Une aura douce, chaleureuse et captivante.",
        tag: "floral",
      },
      {
        label: "Collection Privée & Cadeau d'Exception",
        desc: "Une œuvre rare de la Haute Parfumerie Socute.",
        tag: "woody",
      },
    ],
  },
  {
    id: "intensity",
    title: "Quelle intensité de sillage préférez-vous ?",
    subtitle: "L'empreinte que vous laissez derrière vous.",
    options: [
      {
        label: "Intime & Subtil",
        desc: "Un voile délicat ressenti au plus près de la peau.",
        tag: "floral",
      },
      {
        label: "Radiant & Équilibré",
        desc: "Un sillage harmonieux qui vous précède avec grâce.",
        tag: "fresh",
      },
      {
        label: "Opulent & Magnétique",
        desc: "Une présence affirmée qui captive dès les premiers instants.",
        tag: "amber",
      },
    ],
  },
];

interface ScentQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScentQuizModal({ isOpen, onClose }: ScentQuizModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommended, setRecommended] = useState<MockProduct[] | null>(null);

  const addToCart = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const { toggle: toggleWishlist, isInWishlist } = useWishlist();

  if (!isOpen) return null;

  const question = QUIZ_QUESTIONS[currentStep];

  const handleSelectOption = (tag: string) => {
    const updated = { ...answers, [question.id]: tag };
    setAnswers(updated);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Calculate recommendations
      calculateResults(updated);
    }
  };

  const calculateResults = (userAnswers: Record<string, string>) => {
    const tags = Object.values(userAnswers);
    const countMap: Record<string, number> = { amber: 0, fresh: 0, floral: 0, woody: 0 };
    tags.forEach((t) => {
      countMap[t] = (countMap[t] || 0) + 1;
    });

    const dominant = Object.keys(countMap).reduce((a, b) => (countMap[a] > countMap[b] ? a : b));

    // Filter products from NEW_MOCK_PRODUCTS
    let filtered = NEW_MOCK_PRODUCTS.filter((p) => {
      const topStr = Array.isArray(p.notes_top) ? p.notes_top.join(" ") : "";
      const heartStr = Array.isArray(p.notes_heart) ? p.notes_heart.join(" ") : "";
      const baseStr = Array.isArray(p.notes_base) ? p.notes_base.join(" ") : "";
      const text = `${p.name} ${p.subtitle} ${topStr} ${heartStr} ${baseStr}`.toLowerCase();
      if (dominant === "amber")
        return text.includes("ambre") || text.includes("oud") || text.includes("safran");
      if (dominant === "floral")
        return text.includes("rose") || text.includes("iris") || text.includes("fleur");
      if (dominant === "fresh")
        return text.includes("bergamote") || text.includes("citron") || text.includes("thé");
      return text.includes("santal") || text.includes("patchouli") || text.includes("bois");
    });

    if (filtered.length < 3) {
      filtered = NEW_MOCK_PRODUCTS.slice(0, 3);
    } else {
      filtered = filtered.slice(0, 3);
    }

    setRecommended(filtered);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommended(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl h-[620px] max-h-[88vh] flex flex-col rounded-xl border border-gold/30 bg-[#230612] p-6 sm:p-8 text-foreground shadow-2xl overflow-hidden z-10"
        >
          {/* Subtle glow background */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#4A1020]/40 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="shrink-0 flex items-center justify-between border-b border-gold/15 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-gold" />
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
                Diagnostic Olfactif · Socute Beauty
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-foreground/60 hover:text-gold transition-colors"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!recommended ? (
            /* Quiz Questions View */
            <div className="flex-1 flex flex-col min-h-0 justify-between">
              {/* Progress indicator */}
              <div className="shrink-0">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-foreground/50 mb-3">
                  <span>
                    Étape {currentStep + 1} sur {QUIZ_QUESTIONS.length}
                  </span>
                  <span>
                    {Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}% Complété
                  </span>
                </div>
                <div className="h-1 w-full bg-gold/15 rounded-full mb-6 overflow-hidden">
                  <motion.div
                    className="h-full bg-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col justify-between min-h-0 overflow-y-auto pr-1"
              >
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-foreground font-normal mb-2">
                    {question.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground/60 mb-6">{question.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
                  {question.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(opt.tag)}
                      className="group flex flex-col justify-between p-4 sm:p-5 rounded-lg border border-gold/20 bg-background/40 hover:bg-gold/15 hover:border-gold transition-all text-left cursor-pointer min-h-[120px]"
                    >
                      <div>
                        <span className="font-serif text-base text-foreground group-hover:text-gold transition-colors font-medium block">
                          {opt.label}
                        </span>
                        <p className="text-xs text-foreground/60 mt-1.5 leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-gold/70 group-hover:text-gold">
                        <span>Sélectionner</span>
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            /* Recommended Results View */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-1"
            >
              <div className="text-center max-w-lg mx-auto mb-8">
                <h3 className="font-serif text-3xl text-foreground italic">
                  Nos recommandations sur-mesure
                </h3>
                <p className="text-xs text-foreground/60 mt-2">
                  D'après vos préférences, ces fragrances Socute Beauty sublimeront parfaitement
                  votre sillage.
                </p>
              </div>

              {/* Recommended Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {recommended.map((p) => {
                  const isWish = isInWishlist(p.slug);
                  return (
                    <div
                      key={p.slug}
                      className="group flex flex-col justify-between rounded-lg border border-gold/20 bg-background/50 p-4 transition-all hover:border-gold/50"
                    >
                      <div>
                        <div className="relative aspect-square overflow-hidden rounded-md bg-surface-deep mb-3">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              toggleWishlist({
                                slug: p.slug,
                                name: p.name,
                                subtitle: p.subtitle,
                                price: p.price,
                                image: p.image_url,
                              })
                            }
                            aria-label="Wishlist"
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/70 backdrop-blur-sm border border-gold/20 text-foreground hover:text-gold transition-colors"
                          >
                            <Heart className={`h-4 w-4 ${isWish ? "fill-gold text-gold" : ""}`} />
                          </button>
                        </div>

                        <span className="text-[9px] uppercase tracking-[0.25em] text-gold/80 font-medium">
                          {p.concentration || "Parfum"}
                        </span>
                        <h4 className="font-serif text-lg text-foreground mt-0.5">{p.name}</h4>
                        <p className="text-xs text-gold mt-1 font-serif">
                          {formatCurrency(p.price)}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gold/15 flex items-center justify-between gap-2">
                        <Link
                          to="/shop/$slug"
                          params={{ slug: p.slug }}
                          onClick={onClose}
                          className="flex-1 text-center py-2 border border-gold/30 bg-gold/10 hover:bg-gold hover:text-ink text-[10px] uppercase tracking-[0.2em] font-medium text-gold transition-all rounded-xs"
                        >
                          Découvrir
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            addToCart({
                              slug: p.slug,
                              name: p.name,
                              subtitle: p.subtitle,
                              ml: 50,
                              price: p.price,
                              image: p.image_url,
                            });
                            onClose();
                            openCart();
                          }}
                          aria-label="Ajouter au panier"
                          className="p-2 border border-gold/30 bg-gold/20 hover:bg-gold hover:text-ink text-gold transition-all rounded-xs"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reset Quiz Button */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/70 hover:text-gold transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Refaire le test</span>
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
