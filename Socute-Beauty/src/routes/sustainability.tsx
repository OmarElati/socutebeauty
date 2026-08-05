import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Sparkles, Recycle, ShieldCheck, Leaf, Feather, ArrowRight } from "lucide-react";
import { MonogramFlourish } from "@/components/monogram";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: "Conscious Luxury & Sustainability — Socute Beauty" },
      {
        name: "description",
        content:
          "Our commitments to zero-waste crystal vessels, ethical botanical harvests, and carbon-neutral transit.",
      },
    ],
  }),
  component: SustainabilityPage,
});

function SustainabilityPage() {
  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="border-b border-gold/15 bg-surface-deep/60 py-20 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.45em] text-gold">
            <Sparkles className="h-3 w-3" />
            <span>Responsibility & Permanence</span>
          </div>
          <h1 className="mt-4 font-serif text-5xl italic text-foreground sm:text-6xl">
            Conscious Luxury
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-foreground/60">
            True luxury leaves no trace except beauty and sillage. Discover our circular crystal
            initiative and fair-trade botanical charters.
          </p>
          <MonogramFlourish className="mx-auto mt-8 h-4 w-60 text-gold/40" />
        </div>
      </section>

      {/* Metrics */}
      <section className="mx-auto max-w-5xl px-6 pt-16">
        <div className="grid gap-8 sm:grid-cols-4 text-center">
          {[
            { metric: "100%", label: "Refillable Crystal Vessels" },
            { metric: "0%", label: "Single-Use Plastic Packaging" },
            { metric: "92%", label: "Direct Artisan Farm Sourcing" },
            { metric: "Carbon-Free", label: "Green Shipping Protocol" },
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl border border-gold/15 bg-card/40 p-6">
              <div className="font-serif text-3xl text-gold">{item.metric}</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-foreground/70">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pt-20">
        <div className="space-y-16">
          {/* Feature 1 */}
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-medium">
                Protocol 01
              </span>
              <h2 className="font-serif text-3xl italic text-foreground">
                Indefinitely Refillable Bottles
              </h2>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Rather than treating perfume bottles as disposable objects, every Socute Beauty
                crystal decanters is engineered with threaded brass spray pumps that disassemble
                effortlessly.
              </p>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Bring your empty bottle to any of our global ateliers for a 20% savings refill from
                our apothecary carboys, or order aluminum refill cartridges delivered directly to
                your door.
              </p>
            </div>
            <div className="rounded-2xl border border-gold/20 bg-surface-deep/80 p-8 text-center">
              <Recycle className="mx-auto h-12 w-12 text-gold" />
              <h3 className="mt-4 font-serif text-xl text-foreground">The Refill Exchange</h3>
              <p className="mt-2 text-xs text-foreground/60">
                Over 14,000 glass bottles saved from landfills since 2022.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div className="order-2 md:order-1 rounded-2xl border border-gold/20 bg-surface-deep/80 p-8 text-center">
              <Leaf className="mx-auto h-12 w-12 text-gold" />
              <h3 className="mt-4 font-serif text-xl text-foreground">Fair-Trade Cooperatives</h3>
              <p className="mt-2 text-xs text-foreground/60">
                Direct profit sharing with floral harvesting communities in Tunisia and Madagascar.
              </p>
            </div>
            <div className="order-1 md:order-2 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-medium">
                Protocol 02
              </span>
              <h2 className="font-serif text-3xl italic text-foreground">
                Botanical Respect & Biodiversity
              </h2>
              <p className="text-sm text-foreground/70 leading-relaxed">
                We work directly with small family estates in Sfax, Grasse, and Madagascar. We pay
                35% above market rates to preserve traditional organic farming practices without
                synthetic pesticides.
              </p>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Rare wood resins such as wild oud and benzoin are only harvested from self-healing
                tree bark under strict forestry conservation permits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-24 max-w-4xl px-6 text-center">
        <div className="rounded-2xl border border-gold/20 bg-card p-12">
          <h2 className="font-serif text-3xl italic text-foreground">
            Explore Our Refillable Collection
          </h2>
          <p className="mt-3 text-sm text-foreground/70">
            Each order arrives in 100% compostable unbleached linen and cotton gift boxes.
          </p>
          <div className="mt-8">
            <Link
              to="/collections/$slug"
              params={{ slug: "all" }}
              className="inline-flex items-center gap-2 border border-gold bg-gold px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-ink transition-colors hover:bg-gold-soft"
            >
              Shop Responsible Formulations <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
