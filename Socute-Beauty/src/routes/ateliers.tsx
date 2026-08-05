import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  User,
  Mail,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { MonogramFlourish } from "@/components/monogram";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const Route = createFileRoute("/ateliers")({
  head: () => ({
    meta: [
      { title: "Nos Ateliers Privés · Velvet Aura | Socute Beauty" },
      {
        name: "description",
        content:
          "Réservez une consultation olfactive privée ou une masterclass dans nos ateliers d'exception.",
      },
      { property: "og:title", content: "Nos Ateliers Privés · Velvet Aura" },
    ],
  }),
  component: AteliersPage,
});

const MASTERCLASSES = [
  {
    id: "class-1",
    title: "Atelier Haute Cosmétique & Parfumerie",
    duration: "90 Minutes",
    location: "Monastir Atelier — Monastir, Tunisie",
    price: "150 TND / personne",
    description:
      "Une immersion exclusive dans l'art de la formulation cosmétique et parfumée avec nos experts.",
  },
  {
    id: "class-2",
    title: "Distillation Botanique & Soins de la Peau",
    duration: "120 Minutes",
    location: "Monastir Atelier — Monastir, Tunisie",
    price: "180 TND / personne",
    description:
      "Découverte des essences de jasmin, fleur d'oranger et néroli avec distillation en atelier.",
  },
  {
    id: "class-3",
    title: "Consultation & Diagnostic Beauté Sur Mesure",
    duration: "60 Minutes",
    location: "Salon Privé Boutique Monastir",
    price: "120 TND / session",
    description: "Diagnostic personnalisé pour créer votre routine soin et parfum sur mesure.",
  },
];

function AteliersPage() {
  const [selectedClass, setSelectedClass] = useState(MASTERCLASSES[0].id);
  const [atelierLocation, setAtelierLocation] = useState("Boutique Monastir — Monastir, Tunisie");
  const [date, setDate] = useState("2026-08-15");
  const [timeSlot, setTimeSlot] = useState("14:00 PM");
  const [guests, setGuests] = useState("1 Guest");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please fill in your name and email address.");
      return;
    }
    setSubmitted(true);
    toast.success(
      "Reservation request received! Our atelier concierge will contact you within 4 hours.",
    );
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Breadcrumbs Navigation */}
      <div className="mx-auto max-w-7xl px-6 pt-6 pb-2">
        <Breadcrumbs items={[{ label: "Ateliers Privés & Masterclasses" }]} />
      </div>

      {/* Hero */}
      <section className="border-b border-gold/15 bg-surface-deep/60 py-20 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.45em] text-gold">
            <Sparkles className="h-3 w-3" />
            <span>Private Salons & Masterclasses</span>
          </div>
          <h1 className="mt-4 font-serif text-5xl italic text-foreground sm:text-6xl">
            The Olfactive Ateliers
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-foreground/60">
            Step behind the veil of formulation. Reserve private consultations and blend custom
            Extraits.
          </p>
          <MonogramFlourish className="mx-auto mt-8 h-4 w-60 text-gold/40" />
        </div>
      </section>

      {/* Masterclass Offerings */}
      <section className="mx-auto max-w-6xl px-6 pt-16">
        <div className="text-center">
          <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-medium">
            Experiences
          </span>
          <h2 className="mt-2 font-serif text-3xl italic text-foreground">Curated Masterclasses</h2>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {MASTERCLASSES.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedClass(item.id)}
              className={`group cursor-pointer rounded-2xl border p-8 transition-all duration-300 ${
                selectedClass === item.id
                  ? "border-gold bg-surface-deep shadow-xl shadow-gold/10"
                  : "border-gold/15 bg-card/40 hover:border-gold/30 hover:bg-card"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-gold">
                <span>{item.duration}</span>
                <span>{item.price}</span>
              </div>
              <h3 className="mt-4 font-serif text-2xl text-foreground group-hover:text-gold transition-colors">
                {item.title}
              </h3>
              <p className="mt-3 text-xs text-foreground/70 leading-relaxed">{item.description}</p>
              <div className="mt-6 flex items-center gap-2 text-[11px] text-foreground/50 border-t border-gold/10 pt-4">
                <MapPin className="h-3.5 w-3.5 text-gold" />
                <span>{item.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form */}
      <section className="mx-auto mt-20 max-w-4xl px-6">
        <div className="rounded-2xl border border-gold/20 bg-surface-deep/80 p-8 md:p-12 shadow-2xl">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
              Reservation Request
            </span>
            <h2 className="mt-2 font-serif text-3xl italic text-foreground">
              Book Your Atelier Experience
            </h2>
            <p className="mt-2 text-xs text-foreground/60">
              Complimentary tea, raw ingredient inspection, and custom bottle engraving included.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-10 rounded-xl border border-gold/30 bg-gold/10 p-8 text-center space-y-4"
            >
              <CheckCircle2 className="mx-auto h-12 w-12 text-gold" />
              <h3 className="font-serif text-2xl text-foreground">Reservation Request Confirmed</h3>
              <p className="text-sm text-foreground/80 max-w-md mx-auto">
                Thank you, {name}. We have reserved your provisional slot for{" "}
                <strong>{MASTERCLASSES.find((m) => m.id === selectedClass)?.title}</strong> on{" "}
                <strong>{date}</strong> at <strong>{timeSlot}</strong>.
              </p>
              <p className="text-xs text-foreground/60">
                Our concierge team will send a confirmation code to {email}.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 rounded-full border border-gold px-6 py-2 text-xs uppercase tracking-[0.25em] text-gold hover:bg-gold hover:text-ink transition-colors"
              >
                Book Another Appointment
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-2">
                    Selected Masterclass
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full rounded-lg border border-gold/20 bg-card p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    {MASTERCLASSES.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title} ({m.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-2">
                    Atelier Location
                  </label>
                  <select
                    value={atelierLocation}
                    onChange={(e) => setAtelierLocation(e.target.value)}
                    className="w-full rounded-lg border border-gold/20 bg-card p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="Boutique Monastir — Monastir, Tunisie">
                      Boutique Monastir — Monastir, Tunisie
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-gold/20 bg-card p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-2">
                    Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full rounded-lg border border-gold/20 bg-card p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="14:00 PM">14:00 PM</option>
                    <option value="16:30 PM">16:30 PM</option>
                    <option value="19:00 PM">19:00 PM (Private Evening)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-2">
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full rounded-lg border border-gold/20 bg-card p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="1 Guest">1 Guest</option>
                    <option value="2 Guests">2 Guests</option>
                    <option value="3 Guests">3 Guests</option>
                    <option value="Private Group (4-6)">Private Group (4-6)</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Baroness Claire Dupont"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gold/20 bg-card p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="claire@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gold/20 bg-card p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-2">
                  Special Olfactive Requests / Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention any preferred note families (e.g. amber, iris, leather) or special celebration occasions."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-gold/20 bg-card p-3 text-xs text-foreground focus:border-gold focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg border border-gold bg-gold py-3.5 text-xs font-medium uppercase tracking-[0.3em] text-ink transition-colors hover:bg-gold-soft cursor-pointer"
              >
                Submit Atelier Booking Request
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
