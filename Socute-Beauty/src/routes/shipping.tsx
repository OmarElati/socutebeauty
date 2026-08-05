import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  Truck,
  ShieldCheck,
  Box,
  MapPin,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { MonogramFlourish } from "@/components/monogram";
import { toast } from "sonner";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Livraison & Expédition · Socute Beauty Monastir" },
      {
        name: "description",
        content:
          "Suivi de commande en ligne, livraison à domicile en Tunisie (24-48h), retrait gratuit en boutique à Monastir et FAQ d'expédition.",
      },
    ],
  }),
  component: ShippingPage,
});

const REGIONS = [
  {
    region: "Monastir & Région du Sahel",
    standard: "24h (Livraison express)",
    express: "Retrait Gratuit sous 2h (Boutique Monastir)",
    complimentary: "Toutes Commandes",
  },
  {
    region: "Toute la Tunisie (Grand Tunis, Sousse, Sfax, Nabeul, Bizerte...)",
    standard: "24h – 48h (Jours ouvrables)",
    express: "Livraison à Domicile Sécurisée",
    complimentary: "Commandes > 150 TND",
  },
  {
    region: "Europe & Union Européenne",
    standard: "2 – 4 Jours Ouvrables",
    express: "Express Courier Air",
    complimentary: "Commandes > 150 €",
  },
  {
    region: "Reste du Monde & International",
    standard: "3 – 6 Jours Ouvrables",
    express: "DHL / FedEx Priority",
    complimentary: "Commandes > 200 $",
  },
];

const SHIPPING_FAQS = [
  {
    q: "Puis-je récupérer ma commande gratuitement en boutique à Monastir ?",
    a: "Absolument ! Avec notre service Click & Collect, votre commande est préparée sous 2 heures à notre boutique de Monastir, Tunisie. Le retrait en boutique est totalement gratuit pour toute commande.",
  },
  {
    q: "Quels sont les délais de livraison pour Monastir et la Tunisie ?",
    a: "Pour Monastir et la région du Sahel, la livraison s'effectue sous 24h. Pour le reste de la Tunisie (Grand Tunis, Sousse, Sfax, Nabeul, Bizerte, Djerba, etc.), comptez 24h à 48h jours ouvrables.",
  },
  {
    q: "Proposez-vous le paiement à la livraison (espèces à la réception) ?",
    a: "Oui, vous pouvez régler votre commande au livreur en espèces au moment de la remise de votre colis en toute confiance.",
  },
  {
    q: "Quels sont les frais de livraison en Tunisie ?",
    a: "La livraison est 100% offerte dès 150 TND d'achat. Pour les commandes inférieures, des frais fixes forfaitaires de 7 TND sont appliqués.",
  },
  {
    q: "Comment suivre l'avancement de mon colis ?",
    a: "Il vous suffit d'utiliser notre outil de suivi de commande en haut de cette page en insérant votre numéro de commande (ex: SB-84920) ou de contacter directement notre équipe à Monastir via le bouton WhatsApp flottant.",
  },
];

function ShippingPage() {
  const [orderQuery, setOrderQuery] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<{
    id: string;
    status: string;
    step: number;
    destination: string;
    estimatedDelivery: string;
    carrier: string;
  } | null>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) {
      toast.error("Veuillez entrer un numéro de commande.");
      return;
    }

    const cleanId = orderQuery.trim().toUpperCase();
    setTrackedOrder({
      id: cleanId.startsWith("SB-") ? cleanId : `SB-${cleanId}`,
      status: "En cours de préparation à la Boutique Monastir",
      step: 2,
      destination: "Monastir / Adresse de livraison enregistrée",
      estimatedDelivery: "Demain avant 17h00 (Livraison Express)",
      carrier: "Socute Express Monastir / Aramex Tunisie",
    });
    toast.success("Statut de commande mis à jour !");
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <section className="border-b border-gold/15 bg-surface-deep/60 py-20 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.45em] text-gold">
            <Sparkles className="h-3 w-3" />
            <span>Service de Livraison Privilégié</span>
          </div>
          <h1 className="mt-4 font-serif text-5xl italic text-foreground sm:text-6xl">
            Livraison & Retrait en Boutique
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-foreground/60">
            Livraison rapide et soignée à domicile partout en Tunisie, et retrait gratuit sous 2
            heures dans notre boutique à Monastir.
          </p>
          <MonogramFlourish className="mx-auto mt-8 h-4 w-60 text-gold/40" />
        </div>
      </section>

      {/* Main Grid */}
      <main className="mx-auto max-w-5xl px-6 pt-16 space-y-16">
        {/* Order Tracking Widget */}
        <div className="rounded-2xl border border-gold/30 bg-card/80 p-8 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
                <Truck className="h-4 w-4" />
                <span>Suivi de Commande en Temps Réel</span>
              </div>
              <h2 className="font-serif text-2xl italic text-foreground mt-1">
                Suivre Ma Livraison Monastir & Tunisie
              </h2>
            </div>
            <p className="text-xs text-foreground/60 max-w-xs">
              Saisissez votre numéro de commande pour vérifier l'état d’avancement de votre colis.
            </p>
          </div>

          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/60" />
              <input
                type="text"
                placeholder="Ex: SB-84920 ou numéro de téléphone"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="w-full rounded-xl border border-gold/25 bg-surface-deep pl-10 pr-4 py-3 text-xs text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold bg-gold px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink font-medium hover:bg-gold-soft transition-colors cursor-pointer"
            >
              <span>Vérifier Statut</span>
            </button>
          </form>

          {trackedOrder && (
            <div className="mt-6 rounded-xl border border-gold/20 bg-surface-deep p-6 space-y-6 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/15 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
                    Commande Réf:
                  </span>
                  <h4 className="font-serif text-lg text-foreground font-semibold">
                    {trackedOrder.id}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
                    Transporteur Local:
                  </span>
                  <p className="text-xs text-foreground/80">{trackedOrder.carrier}</p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="space-y-1.5">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-gold text-ink font-bold text-xs">
                    ✓
                  </div>
                  <p className="text-[11px] font-medium text-foreground">Commande Confirmée</p>
                </div>
                <div className="space-y-1.5">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-gold bg-gold/20 text-gold font-bold text-xs animate-pulse">
                    2
                  </div>
                  <p className="text-[11px] font-medium text-gold">Préparation Monastir</p>
                </div>
                <div className="space-y-1.5">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-surface text-foreground/40 text-xs">
                    3
                  </div>
                  <p className="text-[11px] text-foreground/40">En cours d'expédition</p>
                </div>
                <div className="space-y-1.5">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-surface text-foreground/40 text-xs">
                    4
                  </div>
                  <p className="text-[11px] text-foreground/40">Livré / Retiré</p>
                </div>
              </div>

              <div className="rounded-lg bg-gold/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gold shrink-0" />
                  <span>
                    <strong>Livraison Estimée:</strong> {trackedOrder.estimatedDelivery}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gold font-medium">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>Prise en charge: Boutique Monastir</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Boutique Pick-up Banner */}
        <div className="rounded-2xl border border-gold/30 bg-gold/10 p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
              <MapPin className="h-4 w-4" />
              <span>Retrait Gratuit à Monastir</span>
            </div>
            <h2 className="font-serif text-2xl italic text-foreground">
              Click & Collect en 2 Heures
            </h2>
            <p className="text-xs text-foreground/70 max-w-xl">
              Passez votre commande en ligne et venez récupérer votre colis soigneusement préparé
              directement à notre boutique de Monastir, Tunisie.
            </p>
          </div>
          <a
            href="https://maps.app.goo.gl/UQgKCF4WwbXTa42i6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gold bg-gold px-6 py-3 text-xs uppercase tracking-[0.2em] text-ink font-medium hover:bg-gold-soft shrink-0 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Voir Boutique sur Google Maps
          </a>
        </div>

        {/* Value Cards */}
        <div className="grid gap-6 sm:grid-cols-3 text-center">
          <div className="rounded-2xl border border-gold/15 bg-card/60 p-6 space-y-3">
            <Truck className="mx-auto h-8 w-8 text-gold" />
            <h3 className="font-serif text-xl text-foreground">Livraison Rapide Tunisie</h3>
            <p className="text-xs text-foreground/60">
              Expédition sécurisée avec livraison sous 24h à 48h à votre adresse partout en Tunisie.
            </p>
          </div>
          <div className="rounded-2xl border border-gold/15 bg-card/60 p-6 space-y-3">
            <Box className="mx-auto h-8 w-8 text-gold" />
            <h3 className="font-serif text-xl text-foreground">Emballage Soigné & Écrin</h3>
            <p className="text-xs text-foreground/60">
              Chaque produit est expédié dans un coffret signature protégé avec échantillons
              offerts.
            </p>
          </div>
          <div className="rounded-2xl border border-gold/15 bg-card/60 p-6 space-y-3">
            <ShieldCheck className="mx-auto h-8 w-8 text-gold" />
            <h3 className="font-serif text-xl text-foreground">Suivi & Confirmation SMS</h3>
            <p className="text-xs text-foreground/60">
              Vous recevez un appel ou SMS de confirmation avant le passage du livreur à votre
              porte.
            </p>
          </div>
        </div>

        {/* Regions Table */}
        <div className="rounded-2xl border border-gold/20 bg-surface-deep/80 p-8 shadow-xl">
          <h2 className="font-serif text-2xl italic text-foreground mb-6">
            Délais et Tarifs de Livraison (Livraison)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gold/20 text-[10px] uppercase tracking-[0.25em] text-gold">
                  <th className="pb-3 font-medium">Zone de Livraison</th>
                  <th className="pb-3 font-medium">Délai Estimé</th>
                  <th className="pb-3 font-medium">Option Express / Retrait</th>
                  <th className="pb-3 font-medium">Livraison Gratuite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10 text-foreground/80">
                {REGIONS.map((row, i) => (
                  <tr key={i} className="hover:bg-gold/5 transition-colors">
                    <td className="py-4 font-serif text-sm font-medium text-foreground">
                      {row.region}
                    </td>
                    <td className="py-4">{row.standard}</td>
                    <td className="py-4">{row.express}</td>
                    <td className="py-4 text-gold font-medium">{row.complimentary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipping FAQ Section */}
        <div className="rounded-2xl border border-gold/20 bg-card/60 p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold font-medium">
            <HelpCircle className="h-4 w-4" />
            <span>Foire Aux Questions</span>
          </div>
          <h2 className="font-serif text-3xl italic text-foreground">
            Questions Fréquentes sur la Livraison
          </h2>

          <div className="divide-y divide-gold/15">
            {SHIPPING_FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="py-4">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between text-left font-serif text-base text-foreground hover:text-gold transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-gold shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-foreground/40 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-xs leading-relaxed text-foreground/70 pr-6">{faq.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
