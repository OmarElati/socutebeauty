import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MapPin, Clock, Phone, Mail, Calendar, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { MonogramFlourish } from "@/components/monogram";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const Route = createFileRoute("/stores")({
  head: () => ({
    meta: [
      { title: "Boutique & Atelier Monastir · Socute Beauty" },
      {
        name: "description",
        content:
          "Découvrez notre adresse d'exception et notre atelier de beauté situé à Monastir, Tunisie.",
      },
      { property: "og:title", content: "Boutique Monastir · Socute Beauty" },
    ],
  }),
  component: StoresPage,
});

interface Store {
  id: string;
  city: string;
  country: string;
  name: string;
  address: string;
  district: string;
  hours: string;
  phone: string;
  email: string;
  mapUrl: string;
  features: string[];
}

const MONASTIR_STORE: Store = {
  id: "monastir",
  city: "Monastir",
  country: "Tunisie",
  name: "Boutique & Atelier Socute Beauty — Monastir",
  address: "Monastir, Tunisie",
  district: "Centre Ville / Corniche Monastir",
  hours: "Lundi – Samedi: 09:00 – 19:30",
  phone: "+216 73 000 000",
  email: "contact@socutebeauty.com",
  mapUrl: "https://maps.app.goo.gl/UQgKCF4WwbXTa42i6",
  features: [
    "Retrait en Boutique Gratuit (Click & Collect)",
    "Atelier Privé & Conseils Beauté",
    "Compositions & Testeurs sur Mesure",
  ],
};

function StoresPage() {
  const [selectedStore] = useState<Store>(MONASTIR_STORE);
  const [appointmentModal, setAppointmentModal] = useState<Store | null>(null);

  return (
    <div className="min-h-screen pb-24">
      {/* Breadcrumbs Navigation */}
      <div className="mx-auto max-w-7xl px-6 pt-6 pb-2">
        <Breadcrumbs items={[{ label: "Notre Boutique & Atelier" }]} />
      </div>

      {/* Hero */}
      <section className="border-b border-gold/15 bg-surface-deep/60 py-20 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.45em] text-gold">
            <Sparkles className="h-3 w-3" />
            <span>Adresse Privilégiée</span>
          </div>
          <h1 className="mt-4 font-serif text-5xl italic text-foreground sm:text-6xl">
            Boutique & Atelier Monastir
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-foreground/60">
            Plongez dans l'univers d'exception Socute Beauty au cœur de Monastir, Tunisie.
          </p>
          <MonogramFlourish className="mx-auto mt-8 h-4 w-60 text-gold/40" />
        </div>
      </section>

      {/* Main Locator */}
      <main className="mx-auto max-w-5xl px-6 pt-16">
        {/* Store Detail Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-gold/20 bg-card/60 p-8 md:p-12 shadow-2xl grid gap-8 md:grid-cols-12 md:items-center"
        >
          <div className="md:col-span-7 space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.35em] text-gold font-medium">
                {selectedStore.country} · {selectedStore.district}
              </span>
              <h2 className="mt-1 font-serif text-3xl italic text-foreground sm:text-4xl">
                {selectedStore.name}
              </h2>
            </div>

            <div className="space-y-3 text-xs text-foreground/80">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span>{selectedStore.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gold shrink-0" />
                <span>{selectedStore.hours}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gold shrink-0" />
                <a href={`tel:${selectedStore.phone}`} className="hover:text-gold">
                  {selectedStore.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                <a href={`mailto:${selectedStore.email}`} className="hover:text-gold">
                  {selectedStore.email}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <span className="block text-[10px] uppercase tracking-[0.25em] text-gold mb-2 font-medium">
                Services & Expériences
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedStore.features.map((feat) => (
                  <span
                    key={feat}
                    className="rounded-md border border-gold/20 bg-surface-deep/80 px-3 py-1 text-[11px] text-foreground/80"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href={selectedStore.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gold bg-gold px-6 py-3 text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-soft cursor-pointer font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                Ouvrir dans Google Maps
              </a>
              <button
                onClick={() => setAppointmentModal(selectedStore)}
                className="inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-6 py-3 text-xs uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold/20 cursor-pointer font-medium"
              >
                <Calendar className="h-4 w-4" />
                Réserver un rendez-vous privé
              </button>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col items-center justify-between rounded-xl border border-gold/20 bg-surface-deep p-4 text-center space-y-4 overflow-hidden shadow-lg">
            <div className="w-full h-56 rounded-lg overflow-hidden border border-gold/15 relative bg-card">
              <iframe
                title="Google Maps Monastir Socute Beauty"
                src="https://maps.google.com/maps?q=Monastir,Tunisia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter opacity-90 hover:opacity-100 transition-opacity"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gold font-medium">
                <MapPin className="h-3.5 w-3.5" />
                <span>Localisation Monastir</span>
              </div>
              <p className="text-xs text-foreground/70">
                Venez découvrir nos collections et bénéficier du retrait gratuit Click & Collect en
                2h.
              </p>
            </div>
            <a
              href={selectedStore.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg border border-gold/30 bg-gold/10 text-xs text-gold font-medium hover:bg-gold/20 transition-colors"
            >
              <span>Ouvrir dans l'application Google Maps</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
      </main>

      {/* Appointment Modal */}
      <AnimatePresence>
        {appointmentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border border-gold/30 bg-surface-deep p-8 shadow-2xl space-y-5"
            >
              <button
                onClick={() => setAppointmentModal(null)}
                className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full border border-gold/20 text-gold hover:bg-gold/10"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
                Demande de Rendez-Vous
              </div>
              <h3 className="font-serif text-2xl italic text-foreground">Boutique Monastir</h3>

              <p className="text-xs text-foreground/70">
                Veuillez indiquer vos coordonnées et la date souhaitée. Notre équipe confirmera
                votre rendez-vous.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success(
                    "Demande de rendez-vous enregistrée pour la boutique de Monastir !",
                  );
                  setAppointmentModal(null);
                }}
                className="space-y-4 pt-2"
              >
                <input
                  type="text"
                  required
                  placeholder="Votre Nom & Prénom"
                  className="w-full rounded-lg border border-gold/20 bg-card p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="Votre Adresse Email"
                  className="w-full rounded-lg border border-gold/20 bg-card p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                />
                <input
                  type="date"
                  required
                  className="w-full rounded-lg border border-gold/20 bg-card p-3 text-xs text-foreground focus:border-gold focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg border border-gold bg-gold py-3 text-xs uppercase tracking-[0.25em] text-ink font-medium hover:bg-gold-soft cursor-pointer"
                >
                  Confirmer le Rendez-Vous
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
