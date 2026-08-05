import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Download, Mail, ExternalLink } from "lucide-react";
import { MonogramFlourish } from "@/components/monogram";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/press")({
  head: () => ({
    meta: [
      { title: "Press & Media Room — Socute Beauty" },
      {
        name: "description",
        content:
          "Media coverage, press kit downloads, and media contact information for Socute Beauty.",
      },
    ],
  }),
  component: PressPage,
});

const QUOTES = [
  {
    publication: "Vogue Paris",
    quote:
      "Ombre Velours is the most cerebral amber composition of the decade — a hypnotic blend of smoked papyrus and velvet iris.",
  },
  {
    publication: "Harper's Bazaar",
    quote:
      "Socute Beauty brings back the lost reverence of slow, small-batch French-Tunisian haute perfumerie.",
  },
  {
    publication: "Monocle Magazine",
    quote:
      "With their refillable lead-free crystal vessels, Socute Beauty sets the benchmark for true conscious luxury.",
  },
];

function PressPage() {
  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="border-b border-gold/15 bg-surface-deep/60 py-20 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.45em] text-gold">
            <Sparkles className="h-3 w-3" />
            <span>Editorial & Media</span>
          </div>
          <h1 className="mt-4 font-serif text-5xl italic text-foreground sm:text-6xl">
            Press Room
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-foreground/60">
            Editorial highlights, brand imagery, and press contacts for journalists and
            publications.
          </p>
          <MonogramFlourish className="mx-auto mt-8 h-4 w-60 text-gold/40" />
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 pt-16 space-y-16">
        {/* Editorial Quotes */}
        <div className="grid gap-8 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gold/20 bg-card/60 p-8 space-y-4 text-center"
            >
              <span className="font-serif text-xl text-gold">{q.publication}</span>
              <p className="font-serif text-sm italic text-foreground/85 leading-relaxed">
                &ldquo;{q.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>

        {/* Press Assets & Contact */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-gold/20 bg-surface-deep/80 p-8 space-y-4">
            <Download className="h-8 w-8 text-gold" />
            <h3 className="font-serif text-2xl text-foreground">Press Kit & Media Assets</h3>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Download high-resolution product photography, founder portraits, scent note
              breakdowns, and official brand guidelines.
            </p>
            <button
              onClick={() => alert("Downloading Socute Beauty Press Kit (ZIP — 48MB)...")}
              className="mt-2 inline-flex items-center gap-2 rounded-lg border border-gold bg-gold px-6 py-3 text-xs uppercase tracking-[0.25em] text-ink font-medium hover:bg-gold-soft cursor-pointer"
            >
              Download Press Kit (ZIP)
            </button>
          </div>

          <div className="rounded-2xl border border-gold/20 bg-surface-deep/80 p-8 space-y-4">
            <Mail className="h-8 w-8 text-gold" />
            <h3 className="font-serif text-2xl text-foreground">Media Relations</h3>
            <p className="text-xs text-foreground/70 leading-relaxed">
              For sample requests, perfumer interviews, or feature inquiries, please contact our
              global press office.
            </p>
            <div className="text-xs text-gold font-medium">
              <a href="mailto:press@socutebeauty.com" className="hover:underline">
                press@socutebeauty.com
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
