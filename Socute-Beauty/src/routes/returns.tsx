import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, RefreshCw, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { MonogramFlourish } from "@/components/monogram";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Complimentary Returns & Scent Guarantee — Socute Beauty" },
      {
        name: "description",
        content: "30-day complimentary return policy with matching sample vial trial guarantee.",
      },
    ],
  }),
  component: ReturnsPage,
});

function ReturnsPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("Unopened Scent Trial");
  const [initiated, setInitiated] = useState(false);

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !email) {
      toast.error("Please provide order number and email.");
      return;
    }
    setInitiated(true);
    toast.success("Return authorization initiated. Prepaid courier label sent to your email!");
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="border-b border-gold/15 bg-surface-deep/60 py-20 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.45em] text-gold">
            <Sparkles className="h-3 w-3" />
            <span>The Socute Beauty Guarantee</span>
          </div>
          <h1 className="mt-4 font-serif text-5xl italic text-foreground sm:text-6xl">
            Returns & Scent Trial
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-foreground/60">
            Every full bottle includes a matching 2ml sample vial. Test the sample first — if it is
            not your signature, return the unopened full bottle for a 100% refund.
          </p>
          <MonogramFlourish className="mx-auto mt-8 h-4 w-60 text-gold/40" />
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 pt-16 space-y-16">
        {/* Step Guide */}
        <div className="grid gap-8 md:grid-cols-3 text-center">
          <div className="rounded-2xl border border-gold/15 bg-card/60 p-6 space-y-3">
            <div className="font-serif text-3xl font-light text-gold">01</div>
            <h3 className="font-serif text-xl text-foreground">Test the Sample First</h3>
            <p className="text-xs text-foreground/60">
              Open the 2ml glass vial included in your package before unsealing the crystal bottle.
            </p>
          </div>
          <div className="rounded-2xl border border-gold/15 bg-card/60 p-6 space-y-3">
            <div className="font-serif text-3xl font-light text-gold">02</div>
            <h3 className="font-serif text-xl text-foreground">30-Day Decision Period</h3>
            <p className="text-xs text-foreground/60">
              Wear the scent for several days to observe its dry-down notes on your skin.
            </p>
          </div>
          <div className="rounded-2xl border border-gold/15 bg-card/60 p-6 space-y-3">
            <div className="font-serif text-3xl font-light text-gold">03</div>
            <h3 className="font-serif text-xl text-foreground">Complimentary Return Courier</h3>
            <p className="text-xs text-foreground/60">
              If unsealed, return the main bottle using our prepaid label for an immediate refund or
              exchange.
            </p>
          </div>
        </div>

        {/* Portal Form */}
        <div className="mx-auto max-w-2xl rounded-2xl border border-gold/20 bg-surface-deep/80 p-8 md:p-10 shadow-xl">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-medium">
              Self-Service Portal
            </span>
            <h2 className="mt-1 font-serif text-3xl italic text-foreground">
              Initiate a Return or Exchange
            </h2>
          </div>

          {initiated ? (
            <div className="mt-8 rounded-xl border border-gold/30 bg-gold/10 p-6 text-center space-y-3">
              <CheckCircle2 className="mx-auto h-10 w-10 text-gold" />
              <h3 className="font-serif text-2xl text-foreground">
                Prepaid Return Label Generated
              </h3>
              <p className="text-xs text-foreground/80">
                Instructions and a DHL/FedEx return label have been emailed to{" "}
                <strong>{email}</strong> for Order <strong>#{orderNumber}</strong>.
              </p>
              <button
                onClick={() => setInitiated(false)}
                className="mt-4 rounded-full border border-gold px-6 py-2 text-xs uppercase tracking-[0.25em] text-gold hover:bg-gold hover:text-ink transition-colors"
              >
                Initiate Another Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleReturnSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-1.5">
                  Order Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. order-1722300000"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full rounded-lg border border-gold/20 bg-card p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-1.5">
                  Email Address associated with Order *
                </label>
                <input
                  type="email"
                  required
                  placeholder="email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gold/20 bg-card p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-1.5">
                  Reason for Return
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-lg border border-gold/20 bg-card p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                >
                  <option value="Unopened Scent Trial">Unopened Scent Trial Return</option>
                  <option value="Exchange for Different Fragrance">
                    Exchange for Different Fragrance
                  </option>
                  <option value="Damaged in Transit">Damaged in Transit</option>
                  <option value="Gift Return">Gift Return</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg border border-gold bg-gold py-3.5 text-xs font-medium uppercase tracking-[0.3em] text-ink transition-colors hover:bg-gold-soft cursor-pointer shadow-md"
              >
                Generate Prepaid Return Label
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
