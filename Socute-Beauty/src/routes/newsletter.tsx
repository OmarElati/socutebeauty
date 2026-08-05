import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Mail, CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Monogram, MonogramFlourish } from "@/components/monogram";

export const Route = createFileRoute("/newsletter")({
  head: () => ({
    meta: [
      { title: "The Socute Beauty Gazette — Maison Newsletter" },
      {
        name: "description",
        content:
          "Subscribe to receive private harvest dispatches, secret masterclass invitations, and a $25 welcome voucher.",
      },
    ],
  }),
  component: NewsletterPage,
});

function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const voucherCode = "GAZETTE-WELCOME-25";

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    setSubscribed(true);
    toast.success(
      "Welcome to The Socute Beauty Gazette! Your $25 welcome voucher has been generated.",
    );
  };

  const copyVoucher = () => {
    navigator.clipboard.writeText(voucherCode);
    toast.success("Voucher code copied to clipboard!");
  };

  return (
    <div className="min-h-screen pb-24">
      <section className="border-b border-gold/15 bg-surface-deep/60 py-24 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <Monogram className="mx-auto h-14 w-14 text-gold" animate={false} />
          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.45em] text-gold">
            <Sparkles className="h-3 w-3" />
            <span>Exclusive Dispatches</span>
          </div>
          <h1 className="mt-4 font-serif text-5xl italic text-foreground sm:text-6xl">
            The Socute Beauty Gazette
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-foreground/60">
            Private invitations to micro-harvest Extraits, olfactory essays, and invitations to
            private atelier sessions.
          </p>
          <MonogramFlourish className="mx-auto mt-8 h-4 w-60 text-gold/40" />
        </div>
      </section>

      <main className="mx-auto max-w-xl px-6 pt-16">
        <div className="rounded-2xl border border-gold/30 bg-card/60 p-8 md:p-12 shadow-2xl text-center">
          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <CheckCircle2 className="mx-auto h-12 w-12 text-gold" />
              <h2 className="font-serif text-3xl italic text-foreground">
                Welcome to the Inner Circle
              </h2>
              <p className="text-xs text-foreground/70">
                Thank you for subscribing, {firstName || "esteemed guest"}. As a welcome gesture,
                enjoy $25 off your first order over $150.
              </p>

              <div className="rounded-xl border border-gold/40 bg-surface-deep/90 p-5 space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold">
                  Your Welcome Voucher Code
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-xl tracking-wider text-foreground font-semibold">
                    {voucherCode}
                  </span>
                  <button
                    onClick={copyVoucher}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gold/30 text-gold hover:bg-gold/10"
                    title="Copy code"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-5">
              <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-medium">
                Subscribe & Receive $25 Off
              </span>
              <h2 className="font-serif text-3xl italic text-foreground">Correspond with Us</h2>

              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First Name (Optional)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-lg border border-gold/20 bg-surface-deep p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gold/20 bg-surface-deep p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg border border-gold bg-gold py-3.5 text-xs font-medium uppercase tracking-[0.3em] text-ink transition-colors hover:bg-gold-soft cursor-pointer shadow-md"
              >
                Join The Gazette
              </button>

              <p className="text-[10px] text-foreground/50">
                We respect your privacy. Unsubscribe at any time with a single click.
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
