import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, ShieldCheck } from "lucide-react";
import { MonogramFlourish } from "@/components/monogram";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Socute Beauty" },
      {
        name: "description",
        content: "Privacy policy and personal data protection standards for Socute Beauty.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen pb-24">
      <section className="border-b border-gold/15 bg-surface-deep/60 py-20 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.45em] text-gold">
            <Sparkles className="h-3 w-3" />
            <span>Data Protection</span>
          </div>
          <h1 className="mt-4 font-serif text-5xl italic text-foreground sm:text-6xl">
            Privacy Policy
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-foreground/60">
            Your privacy is held with the same discretion as our private formulation salons.
          </p>
          <MonogramFlourish className="mx-auto mt-8 h-4 w-60 text-gold/40" />
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-6 pt-16 space-y-8 text-xs text-foreground/80 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-xl text-foreground">1. Collection of Information</h2>
          <p>
            Socute Beauty collects personal information solely to process orders, manage atelier
            reservations, and deliver tailored correspondence. This includes your name, shipping
            address, email address, and payment information processed through secure encrypted
            channels.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-foreground">2. Use of Data</h2>
          <p>
            We do not sell, rent, or trade your personal data to any third-party advertisers. Your
            information is shared only with certified fulfillment partners (e.g., courier services)
            required to complete your delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-foreground">3. Your Rights & GDPR Compliance</h2>
          <p>
            Under European Union GDPR regulations and global privacy standards, you maintain the
            right to inspect, edit, or request complete erasure of your personal records at any time
            by contacting our Privacy Desk at{" "}
            <a href="mailto:privacy@socutebeauty.com" className="text-gold underline">
              privacy@socutebeauty.com
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
