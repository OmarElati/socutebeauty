import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Gift, Check, ShoppingBag, CreditCard } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { Monogram, MonogramFlourish } from "@/components/monogram";

export const Route = createFileRoute("/gift-cards")({
  head: () => ({
    meta: [
      { title: "Bespoke Gift Cards — Socute Beauty" },
      {
        name: "description",
        content:
          "Present the gift of fragrance choice with digital or wax-sealed parchment gift cards.",
      },
    ],
  }),
  component: GiftCardsPage,
});

const DENOMINATIONS = [100, 150, 250, 500];

function GiftCardsPage() {
  const [amount, setAmount] = useState<number>(150);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"digital" | "parchment">("digital");

  const addLine = useCart((s) => s.addLine);
  const openCart = useCart((s) => s.open);

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();

    const title = `Socute Beauty ${deliveryMethod === "digital" ? "Digital" : "Wax-Sealed"} Gift Card ($${amount})`;
    addLine({
      id: `gift-card-${amount}-${Date.now()}`,
      product_id: `gc-${amount}`,
      slug: "gift-card",
      name: title,
      price: amount,
      ml: 0,
      image: "/products/product-1.jpg",
      qty: 1,
    });

    toast.success(`Added $${amount} Gift Card to your cart`);
    openCart();
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="border-b border-gold/15 bg-surface-deep/60 py-20 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.45em] text-gold">
            <Sparkles className="h-3 w-3" />
            <span>The Gift of Choice</span>
          </div>
          <h1 className="mt-4 font-serif text-5xl italic text-foreground sm:text-6xl">
            Atelier Gift Cards
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-foreground/60">
            Delivered instantly via digital calligraphic scroll or shipped as a gold-foil wax-sealed
            letter.
          </p>
          <MonogramFlourish className="mx-auto mt-8 h-4 w-60 text-gold/40" />
        </div>
      </section>

      {/* Main Interactive Customizer */}
      <main className="mx-auto max-w-5xl px-6 pt-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Card Preview */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="relative overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-br from-surface-deep via-[#410E21] to-[#1A1114] p-8 shadow-2xl">
              {/* Gold foil overlay effect */}
              <div className="absolute right-0 top-0 h-32 w-32 bg-radial from-gold/20 via-transparent to-transparent blur-xl" />

              <div className="flex items-center justify-between">
                <Monogram className="h-10 w-10 text-gold" animate={false} />
                <span className="font-serif text-3xl text-gold">${amount}</span>
              </div>

              <div className="mt-12 space-y-2">
                <div className="text-[9px] uppercase tracking-[0.35em] text-gold/80">
                  Gift Certificate
                </div>
                <div className="font-serif text-2xl text-foreground">
                  {recipientName ? recipientName : "To Someone Special"}
                </div>
                {message && (
                  <p className="mt-4 font-serif text-xs italic text-foreground/75 leading-relaxed line-clamp-3">
                    &ldquo;{message}&rdquo;
                  </p>
                )}
              </div>

              <div className="mt-12 flex items-end justify-between border-t border-gold/20 pt-4 text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                <div>From: {senderName || "Maison Admirer"}</div>
                <div>{deliveryMethod === "digital" ? "Digital Delivery" : "Wax-Sealed Post"}</div>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-foreground/50">
              Valid online and at all Socute Beauty ateliers worldwide. Never expires.
            </p>
          </div>

          {/* Form Controls */}
          <div className="lg:col-span-7 rounded-2xl border border-gold/20 bg-card/60 p-8">
            <form onSubmit={handleAddToCart} className="space-y-6">
              {/* Denomination Picker */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-3 font-medium">
                  Select Gift Card Value
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {DENOMINATIONS.map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setAmount(val)}
                      className={`rounded-lg border py-3 text-sm font-serif transition-all cursor-pointer ${
                        amount === val
                          ? "border-gold bg-gold text-surface-deep font-semibold"
                          : "border-gold/20 text-foreground hover:border-gold/40"
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Method */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-3 font-medium">
                  Delivery Format
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("digital")}
                    className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
                      deliveryMethod === "digital"
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-gold/20 text-foreground/70 hover:border-gold/40"
                    }`}
                  >
                    <div className="text-xs font-medium uppercase tracking-[0.2em]">
                      Instant Digital Scroll
                    </div>
                    <div className="mt-1 text-[11px] text-foreground/60">
                      Sent immediately via email
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("parchment")}
                    className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
                      deliveryMethod === "parchment"
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-gold/20 text-foreground/70 hover:border-gold/40"
                    }`}
                  >
                    <div className="text-xs font-medium uppercase tracking-[0.2em]">
                      Physical Wax Seal
                    </div>
                    <div className="mt-1 text-[11px] text-foreground/60">
                      Shipped in heavy parchment box
                    </div>
                  </button>
                </div>
              </div>

              {/* Personalization Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-1.5">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Recipient's Name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full rounded-lg border border-gold/20 bg-surface-deep p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-1.5">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="recipient@email.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full rounded-lg border border-gold/20 bg-surface-deep p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-1.5">
                  Your Name (Sender)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full rounded-lg border border-gold/20 bg-surface-deep p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-1.5">
                  Personal Gift Message
                </label>
                <textarea
                  rows={3}
                  placeholder="Add a calligraphic message to accompany the gift card..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-lg border border-gold/20 bg-surface-deep p-3 text-xs text-foreground focus:border-gold focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gold bg-gold py-4 text-xs font-medium uppercase tracking-[0.3em] text-ink transition-colors hover:bg-gold-soft cursor-pointer shadow-lg"
              >
                <ShoppingBag className="h-4 w-4" />
                Add Gift Card to Cart (${amount})
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
