import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ShoppingBag, Check, ShieldCheck, Gift } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { MonogramFlourish } from "@/components/monogram";

export const Route = createFileRoute("/discovery-set")({
  head: () => ({
    meta: [
      { title: "The Atelier Discovery Set — Socute Beauty" },
      {
        name: "description",
        content:
          "6 x 5ml Extrait vials of our signature scents + $75 voucher code toward any full bottle.",
      },
    ],
  }),
  component: DiscoverySetPage,
});

const VIALS = [
  { name: "Ombre Velours", notes: "Amber · Smoked Papyrus · Rose", family: "Amber Woods" },
  { name: "Carel Nocturne", notes: "Suede · Ink · Birch Tar", family: "Leather & Ink" },
  { name: "Rubis Sérac", notes: "Damask Rose · Sichuan Pepper · Cassis", family: "Crimson Rose" },
  { name: "Délagée Mattur", notes: "Orris Butter · White Musk · Aldehydes", family: "Marble Musk" },
  { name: "Vert de Serre", notes: "Fig Leaf · Tomato Vine · Oakmoss", family: "Green Chypre" },
  {
    name: "Laxte Blanche",
    notes: "Almond Milk · Orange Blossom · Sandalwood",
    family: "White Gourmand",
  },
];

function DiscoverySetPage() {
  const [selectedVial, setSelectedVial] = useState(0);
  const addLine = useCart((s) => s.addLine);
  const openCart = useCart((s) => s.open);

  const handleAddSet = () => {
    addLine({
      id: "discovery-set-75",
      product_id: "prod-discovery-set",
      slug: "discovery-set",
      name: "The Atelier Discovery Set (6 x 5ml Extraits)",
      price: 75,
      ml: 30,
      image: "/products/product-1.jpg",
      qty: 1,
    });
    toast.success("Added Atelier Discovery Set ($75) to your cart!");
    openCart();
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="border-b border-gold/15 bg-surface-deep/60 py-20 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.45em] text-gold">
            <Sparkles className="h-3 w-3" />
            <span>Olfactive Exploration</span>
          </div>
          <h1 className="mt-4 font-serif text-5xl italic text-foreground sm:text-6xl">
            The Atelier Discovery Set
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-foreground/60">
            Six 5ml hand-poured Extraits de Parfum packaged in black velvet, accompanied by a
            complimentary $75 voucher code.
          </p>
          <MonogramFlourish className="mx-auto mt-8 h-4 w-60 text-gold/40" />
        </div>
      </section>

      {/* Main Set Layout */}
      <main className="mx-auto max-w-6xl px-6 pt-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Image & Interactive Vial Selector */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-gold/30 bg-surface-deep">
              <img
                src="/products/product-1.jpg"
                alt="Atelier Discovery Set"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-deep via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-gold/20 bg-background/90 p-4 backdrop-blur-md">
                <span className="text-[9px] uppercase tracking-[0.3em] text-gold font-medium">
                  Included Vial #{selectedVial + 1}
                </span>
                <h3 className="font-serif text-xl text-foreground">{VIALS[selectedVial].name}</h3>
                <p className="mt-1 text-xs text-foreground/70">{VIALS[selectedVial].notes}</p>
              </div>
            </div>

            {/* Vial Grid Buttons */}
            <div className="grid grid-cols-3 gap-3">
              {VIALS.map((vial, i) => (
                <button
                  key={vial.name}
                  onClick={() => setSelectedVial(i)}
                  className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                    selectedVial === i
                      ? "border-gold bg-gold/15 text-gold shadow-md"
                      : "border-gold/20 bg-card/40 text-foreground/70 hover:border-gold/40"
                  }`}
                >
                  <div className="text-[9px] uppercase tracking-[0.2em] text-gold">
                    Vial 0{i + 1}
                  </div>
                  <div className="font-serif text-xs text-foreground truncate">{vial.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Value Props & Add to Cart */}
          <div className="lg:col-span-6 space-y-8 rounded-2xl border border-gold/20 bg-card/60 p-8 md:p-10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-medium">
                Bespoke Offer
              </span>
              <h2 className="mt-1 font-serif text-3xl italic text-foreground">
                Test at home. Redeem in full.
              </h2>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-serif text-4xl text-gold">$75</span>
                <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                  Complimentary Global Courier
                </span>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-gold/15 bg-surface-deep/70 p-5 text-xs text-foreground/80">
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span>
                  <strong>6 x 5ml Extraits (30ml Total Payload):</strong> Glass vials with
                  micro-atomizer sprays.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Gift className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span>
                  <strong>$75 Full Value Voucher:</strong> Inside your set is a unique code
                  redeemable toward any 50ml or 100ml full bottle.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span>
                  <strong>Olfactive Tasting Guide:</strong> Hand-printed blotters and note
                  breakdowns included.
                </span>
              </div>
            </div>

            <button
              onClick={handleAddSet}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gold bg-gold py-4 text-xs font-medium uppercase tracking-[0.3em] text-ink transition-colors hover:bg-gold-soft cursor-pointer shadow-lg"
            >
              <ShoppingBag className="h-4 w-4" />
              Acquire Discovery Set ($75)
            </button>

            <p className="text-center text-[11px] text-foreground/50">
              Ships next business day in velvet-lined gift box with embossed seal.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
