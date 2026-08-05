import { AnimatePresence, motion } from "motion/react";
import { X, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { createOrder } from "@/lib/products.functions";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, close, lines, remove, updateQty, subtotal } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const clear = useCart((s) => s.clear);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUserId(data.user.id);
        if (data.user.email) setEmail((prev) => prev || data.user.email || "");
        const disp = data.user.user_metadata?.display_name || data.user.email?.split("@")[0] || "";
        if (disp) setName((prev) => prev || disp);
      }
    });
  }, []);

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (lines.length === 0) return;
    setSubmitting(true);
    try {
      const itemsPayload = lines.map((l) => ({
        slug: l.slug,
        name: l.name,
        subtitle: l.subtitle,
        ml: l.ml,
        price: l.price,
        qty: l.qty,
        image: l.image,
      }));
      const subtotalVal = lines.reduce((s, i) => s + i.price * i.qty, 0);

      const { data: row, error } = await supabase
        .from("orders")
        .insert({
          user_id: userId || null,
          email: email.trim(),
          full_name: name.trim(),
          subtotal: subtotalVal,
          currency: "USD",
          status: "pending",
          items: itemsPayload,
          notes: notes ? notes.trim() : null,
        })
        .select("id")
        .single();

      if (error) throw new Error(error.message);

      toast.success("Order placed successfully!", {
        description: `Confirmation #${row.id.slice(0, 8)}`,
      });
      clear();
      setCheckoutOpen(false);
      close();
      setEmail("");
      setName("");
      setNotes("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-surface-deep/70 backdrop-blur-md"
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-gold/20 bg-background"
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-gold/15 px-6 py-5">
              <div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-gold">Your bag</div>
                <div className="mt-1 font-serif text-lg text-foreground">
                  {lines.length === 0
                    ? "Empty"
                    : `${lines.length} composition${lines.length > 1 ? "s" : ""}`}
                </div>
              </div>
              <button
                onClick={close}
                aria-label="Close cart"
                className="text-foreground/70 hover:text-gold transition-colors"
              >
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-foreground/60">
                  <p className="font-serif text-2xl text-foreground">Nothing yet</p>
                  <p className="mt-3 max-w-xs text-sm">
                    Discover the collection and begin your composition.
                  </p>
                  <button
                    onClick={close}
                    className="mt-8 border border-gold px-6 py-3 text-[10px] uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold hover:text-ink"
                  >
                    Explore
                  </button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {lines.map((line) => (
                    <li key={line.id} className="flex gap-4">
                      <div className="h-24 w-20 flex-none overflow-hidden bg-surface-deep">
                        <img
                          src={line.image}
                          alt={line.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-serif text-base text-foreground">{line.name}</p>
                            <p className="font-serif text-sm text-gold">
                              {formatCurrency(line.price * line.qty)}
                            </p>
                          </div>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-foreground/50">
                            {line.ml} ml · {line.subtitle}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-gold/25">
                            <button
                              aria-label="Decrease"
                              onClick={() => updateQty(line.id, line.qty - 1)}
                              className="p-2 text-foreground/70 hover:text-gold"
                            >
                              <Minus className="h-3 w-3" strokeWidth={1.4} />
                            </button>
                            <span className="min-w-6 text-center text-xs">{line.qty}</span>
                            <button
                              aria-label="Increase"
                              onClick={() => updateQty(line.id, line.qty + 1)}
                              className="p-2 text-foreground/70 hover:text-gold"
                            >
                              <Plus className="h-3 w-3" strokeWidth={1.4} />
                            </button>
                          </div>
                          <button
                            onClick={() => remove(line.id)}
                            className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 hover:text-gold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-gold/15 px-6 py-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/60">
                    Subtotal
                  </span>
                  <span className="font-serif text-2xl text-gold">
                    {formatCurrency(subtotal())}
                  </span>
                </div>
                <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-foreground/40">
                  Shipping and duties calculated at checkout
                </p>
                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="mt-6 w-full bg-gold px-6 py-4 text-[11px] uppercase tracking-[0.3em] text-ink transition-colors hover:bg-gold-soft"
                >
                  Proceed to checkout
                </button>
              </div>
            )}

            {checkoutOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col bg-background border-l border-gold/20"
              >
                <div className="flex items-center justify-between border-b border-gold/15 px-6 py-5">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.4em] text-gold">Checkout</div>
                    <div className="mt-1 font-serif text-lg text-foreground">
                      {formatCurrency(subtotal())}
                    </div>
                  </div>
                  <button
                    onClick={() => setCheckoutOpen(false)}
                    aria-label="Back"
                    className="text-foreground/70 hover:text-gold"
                  >
                    <X className="h-5 w-5" strokeWidth={1.4} />
                  </button>
                </div>
                <form onSubmit={submitOrder} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">
                      Name
                    </span>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 w-full border border-gold/25 bg-transparent px-3 py-3 focus:border-gold outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">
                      Email
                    </span>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 w-full border border-gold/25 bg-transparent px-3 py-3 focus:border-gold outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">
                      Notes (optional)
                    </span>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="mt-2 w-full border border-gold/25 bg-transparent px-3 py-3 focus:border-gold outline-none"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-4 w-full bg-gold px-6 py-4 text-[11px] uppercase tracking-[0.3em] text-ink hover:bg-gold-soft disabled:opacity-70"
                  >
                    {submitting ? "Placing order…" : "Place order"}
                  </button>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 text-center">
                    A member of the atelier will contact you to complete payment.
                  </p>
                </form>
              </motion.div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
