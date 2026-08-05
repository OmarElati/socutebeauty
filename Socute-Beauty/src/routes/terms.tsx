import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { MonogramFlourish } from "@/components/monogram";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Socute Beauty" },
      {
        name: "description",
        content: "Terms of service and boutique order conditions for Socute Beauty.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen pb-24">
      <section className="border-b border-gold/15 bg-surface-deep/60 py-20 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.45em] text-gold">
            <Sparkles className="h-3 w-3" />
            <span>Boutique Conditions</span>
          </div>
          <h1 className="mt-4 font-serif text-5xl italic text-foreground sm:text-6xl">
            Terms of Service
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-foreground/60">
            Conditions governing client orders, atelier reservations, and intellectual property.
          </p>
          <MonogramFlourish className="mx-auto mt-8 h-4 w-60 text-gold/40" />
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-6 pt-16 space-y-8 text-xs text-foreground/80 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-xl text-foreground">1. Boutique Transactions</h2>
          <p>
            All purchases made via the Socute Beauty digital boutique or physical ateliers are
            subject to availability. Prices are quoted in USD or local currency inclusive of
            applicable duties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-foreground">2. Scent Trial Guarantee Policy</h2>
          <p>
            Full bottle purchases include a 2ml matching sample vial. The 30-day return policy
            applies strictly to unopened, original-sealed crystal decanters when tested via the
            sample vial first.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-foreground">3. Intellectual Property</h2>
          <p>
            All trademarks, bottle designs, monogram crests, and fragrance names (including Ombre
            Velours, Carel Nocturne, Rubis Sérac) are exclusive property of Socute Beauty SAS.
          </p>
        </section>
      </main>
    </div>
  );
}
