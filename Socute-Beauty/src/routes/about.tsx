import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Monogram, MonogramFlourish } from "@/components/monogram";
import { Sparkles, Award, Compass, Heart, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "La Maison · Velvet Aura | Socute Beauty" },
      {
        name: "description",
        content:
          "Découvrez l'héritage, la haute parfumerie et l'artisanat d'exception de Socute Beauty Velvet Aura.",
      },
      { property: "og:title", content: "La Maison · Velvet Aura" },
      {
        property: "og:description",
        content: "L'art de l'élégance et de la haute parfumerie.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen pb-24">
      {/* Breadcrumbs Navigation */}
      <div className="mx-auto max-w-7xl px-6 pt-6 pb-2">
        <Breadcrumbs items={[{ label: "La Maison & Héritage" }]} />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gold/15 bg-surface-deep/60 py-24 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <Monogram className="h-16 w-16 text-gold" animate={false} strokeWidth={1.8} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.45em] text-gold"
          >
            <Sparkles className="h-3 w-3" />
            <span>Monastir, Tunisie — Fondé en MMXVI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-4 font-serif text-5xl italic text-foreground sm:text-6xl"
          >
            The Art of Olfactive Permanence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mt-6 max-w-2xl font-serif text-lg leading-relaxed text-foreground/80 italic"
          >
            &ldquo;A fragrance should not merely announce a presence; it must linger in memory like
            fine silk left in an velvet trunk.&rdquo;
          </motion.p>

          <MonogramFlourish className="mx-auto mt-8 h-4 w-64 text-gold/40" />
        </div>
      </section>

      {/* Narrative Section */}
      <section className="mx-auto max-w-5xl px-6 pt-20">
        <div className="grid gap-14 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-medium">
              Chapter I — Origins
            </span>
            <h2 className="font-serif text-3xl italic text-foreground sm:text-4xl">
              Born between Mediterranean light and Parisian dusk.
            </h2>
            <p className="text-sm leading-relaxed text-foreground/70">
              Socute Beauty was founded in 2016 by master formulator Julien Laurent and botanist
              Amira Al-Mansour. Uniting the botanical richness of North African neroli, jasmine
              sambac, and rare resin harvests with traditional French haute parfumerie, the house
              was born from a desire to return to unhurried formulation.
            </p>
            <p className="text-sm leading-relaxed text-foreground/70">
              Every creation is macerated for a minimum of 90 days in heavy dark glass vessels at
              our historical atelier in Paris, before being hand-poured and monobrand-sealed.
            </p>
          </div>

          <div className="relative rounded-2xl border border-gold/20 bg-surface-deep/40 p-8 text-center backdrop-blur-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold border border-gold/30">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="mt-6 font-serif text-2xl text-foreground">Our 4 Pillars</h3>
            <ul className="mt-6 space-y-4 text-left text-xs text-foreground/80">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                <span>
                  <strong>No Compromise Concentration:</strong> All fragrances are Extraits or
                  high-volume Eaux de Parfum (minimum 22-30% perfume concentrate).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                <span>
                  <strong>Ethical Wild-Harvesting:</strong> Sustainably sourced resins, roses, and
                  woods with direct artisan fair-trade compensation.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                <span>
                  <strong>Heavy Lead-Free Crystal:</strong> Hand-cut glass bottles engineered to be
                  refilled indefinitely at any Maison atelier.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                <span>
                  <strong>Small Batch Serialisation:</strong> Every bottle carries a handwritten
                  batch number and hand-embossed wax insignia.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-5xl px-6 pt-24">
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-medium">
            Chronology
          </span>
          <h2 className="mt-2 font-serif text-3xl italic text-foreground">The House Timeline</h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {[
            {
              year: "2016",
              title: "The First Harvest",
              desc: "Formulation of Ombre Velours No. 01 in Paris 1er.",
            },
            {
              year: "2019",
              title: "Paris Flagship",
              desc: "Opening of the historical Rue Saint-Honoré atelier.",
            },
            {
              year: "2022",
              title: "Refillable Crystal",
              desc: "Launch of the zero-waste crystal vessel initiative.",
            },
            {
              year: "2026",
              title: "Global Residencies",
              desc: "Ateliers open in Sfax, London, Tokyo, and New York.",
            },
          ].map((item, idx) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="rounded-xl border border-gold/15 bg-card/50 p-6 text-center"
            >
              <div className="font-serif text-3xl font-light text-gold">{item.year}</div>
              <h3 className="mt-2 font-serif text-lg text-foreground">{item.title}</h3>
              <p className="mt-2 text-xs text-foreground/60 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-24 max-w-4xl px-6 text-center">
        <div className="rounded-2xl border border-gold/20 bg-surface-deep/80 p-12">
          <h2 className="font-serif text-3xl italic text-foreground">
            Experience the Formulations
          </h2>
          <p className="mt-3 text-sm text-foreground/70">
            Explore our full repertoire of rare extraits and eaux de parfum.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/collections/$slug"
              params={{ slug: "all" }}
              className="inline-flex items-center gap-2 border border-gold bg-gold px-7 py-3 text.xs uppercase tracking-[0.25em] text-ink transition-all hover:bg-gold-soft"
            >
              Explore Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
