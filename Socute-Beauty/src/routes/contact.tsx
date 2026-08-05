import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Mail, Phone, MessageSquare, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { MonogramFlourish } from "@/components/monogram";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Conciergerie & Contact · Velvet Aura | Socute Beauty" },
      {
        name: "description",
        content:
          "Contactez les conseillers privés et le service client de Socute Beauty Velvet Aura.",
      },
      { property: "og:title", content: "Conciergerie & Contact · Velvet Aura" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Veuillez remplir tous les champs requis.");
      return;
    }
    setSubmitted(true);
    toast.success("Votre message a été transmis à notre conciergerie.");
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Breadcrumbs Navigation */}
      <div className="mx-auto max-w-7xl px-6 pt-6 pb-2">
        <Breadcrumbs items={[{ label: "Conciergerie & Contact" }]} />
      </div>

      {/* Hero */}
      <section className="border-b border-gold/15 bg-surface-deep/60 py-20 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.45em] text-gold">
            <Sparkles className="h-3 w-3" />
            <span>Private Client Desk</span>
          </div>
          <h1 className="mt-4 font-serif text-5xl italic text-foreground sm:text-6xl">
            Maison Concierge
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-foreground/60">
            How may we assist you today? Our concierge advisors respond within 4 hours.
          </p>
          <MonogramFlourish className="mx-auto mt-8 h-4 w-60 text-gold/40" />
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 pt-16">
        <div className="grid gap-12 md:grid-cols-12 md:items-start">
          {/* Direct Channels */}
          <div className="md:col-span-5 space-y-6">
            <div className="rounded-2xl border border-gold/20 bg-card/60 p-8 space-y-6">
              <h2 className="font-serif text-2xl text-foreground">Direct Assistance</h2>

              <div className="space-y-4 text-xs text-foreground/80">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Client Concierge</div>
                    <a
                      href="mailto:concierge@maisonlerredo.com"
                      className="hover:text-gold text-foreground/60"
                    >
                      concierge@maisonlerredo.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Telephone Assistance</div>
                    <a href="tel:+33142689000" className="hover:text-gold text-foreground/60">
                      +33 (0)1 42 68 90 00
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Concierge Hours</div>
                    <div className="text-foreground/60">Monday – Saturday: 09:00 – 20:00 CET</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Boutique & Atelier</div>
                    <a
                      href="https://maps.app.goo.gl/UQgKCF4WwbXTa42i6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/60 hover:text-gold underline"
                    >
                      Monastir, Tunisie (Voir sur Google Maps)
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gold/15 bg-surface-deep p-6 text-center space-y-2">
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
                Bespoke Orders
              </div>
              <p className="text-xs text-foreground/70">
                For wedding favors, corporate gifting, or private monogramming, email{" "}
                <a href="mailto:gifting@maisonlerredo.com" className="text-gold underline">
                  gifting@maisonlerredo.com
                </a>
                .
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7 rounded-2xl border border-gold/20 bg-surface-deep/80 p-8 md:p-10 shadow-xl">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <CheckCircle2 className="mx-auto h-12 w-12 text-gold" />
                <h3 className="font-serif text-3xl italic text-foreground">Message Sent</h3>
                <p className="text-sm text-foreground/80 max-w-md mx-auto">
                  Thank you, {name}. A member of our concierge team will reply to{" "}
                  <strong>{email}</strong> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-full border border-gold px-8 py-2.5 text-xs uppercase tracking-[0.25em] text-gold hover:bg-gold hover:text-ink transition-colors"
                >
                  Send Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center md:text-left">
                  <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-medium">
                    Send a Message
                  </span>
                  <h2 className="mt-1 font-serif text-3xl italic text-foreground">
                    How can we assist you?
                  </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-gold/20 bg-card p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-2">
                      Your Email *
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
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-2">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-lg border border-gold/20 bg-card p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Support">Order Support & Tracking</option>
                    <option value="Bespoke Scent Consultation">Bespoke Scent Consultation</option>
                    <option value="Corporate Gifting">Corporate & Event Gifting</option>
                    <option value="Press & Media">Press & Media Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-lg border border-gold/20 bg-card p-3 text-xs text-foreground focus:border-gold focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg border border-gold bg-gold py-3.5 text-xs font-medium uppercase tracking-[0.3em] text-ink transition-colors hover:bg-gold-soft cursor-pointer shadow-md"
                >
                  Send Message to Concierge
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
