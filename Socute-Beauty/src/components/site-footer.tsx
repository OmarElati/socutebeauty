import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Monogram, MonogramFlourish } from "./monogram";
import { ArrowRight, Check, Sparkles, Instagram, Facebook } from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.84V7.65a6.34 6.34 0 0 0-5.46 6.27A6.34 6.34 0 1 0 14.8 20V9.33a8.28 8.28 0 0 0 4.79 1.51V7.39a4.84 4.84 0 0 1-.3-.7z" />
    </svg>
  );
}

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (val: string) => {
    if (!val.trim()) {
      return "Veuillez saisir votre adresse email.";
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val.trim())) {
      return "Veuillez indiquer une adresse email valide (ex: atelier@socute.com).";
    }
    return null;
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSubscribed(true);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  return (
    <footer className="bg-surface-deep text-foreground/70 border-t border-gold/15">
      <div className="mx-auto max-w-7xl px-6 py-20">
        {/* Velvet Aura Newsletter Block */}
        <div className="mb-20 rounded-sm border border-gold/25 bg-background/40 p-8 sm:p-12 text-center max-w-4xl mx-auto backdrop-blur-sm relative overflow-hidden shadow-2xl">
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gold/10 blur-2xl" />
          <div className="absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-gold/10 blur-2xl" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-gold font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Correspondance Privée</span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl text-foreground font-normal italic">
              Join our Atelier
            </h3>
            <p className="mx-auto max-w-lg text-xs sm:text-sm text-foreground/70 leading-relaxed">
              Inscrivez-vous pour rejoindre le cercle privé Socute Beauty et recevoir nos
              invitations exclusives, découvertes olfactives et créations rares.
            </p>

            {subscribed ? (
              <div className="mt-6 p-6 border border-gold/40 bg-gold/10 rounded-xs max-w-lg mx-auto backdrop-blur-md shadow-lg space-y-3 animate-in fade-in zoom-in-95 duration-300">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gold text-ink">
                  <Check className="h-5 w-5 stroke-[2.5]" />
                </div>
                <h4 className="font-serif text-lg text-foreground font-medium italic">
                  Bienvenue dans l'Atelier
                </h4>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Votre invitation exclusive a été envoyée à{" "}
                  <strong className="text-gold font-semibold">{email}</strong>. Nous avons hâte de
                  partager nos créations d'exception avec vous.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubscribed(false);
                    setEmail("");
                  }}
                  className="mt-2 text-[10px] uppercase tracking-[0.2em] text-gold hover:underline cursor-pointer"
                >
                  Inscrire une autre adresse →
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                noValidate
                className="mt-6 flex flex-col items-center max-w-md mx-auto"
              >
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Votre adresse email (ex: atelier@socute.com)..."
                      className={`w-full border ${
                        error
                          ? "border-red-400/80 bg-red-950/20"
                          : "border-gold/30 bg-background/80"
                      } px-4 py-3 text-xs text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none rounded-xs transition-colors`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 border border-gold bg-gold/20 hover:bg-gold hover:text-ink px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium text-gold transition-all rounded-xs cursor-pointer whitespace-nowrap shadow-md"
                  >
                    <span>Rejoindre</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-[11px] text-red-300/90 text-left w-full tracking-wide">
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <Monogram className="h-14 w-14 text-gold" animate={false} strokeWidth={1.6} />
          <p className="mt-5 font-serif text-xl text-foreground">Socute Beauty</p>
          <MonogramFlourish className="mt-4 h-4 w-64 text-gold/50" />

          {/* Social Links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
            <a
              href="https://www.instagram.com/socute_beauty_/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/70 hover:text-gold transition-colors"
            >
              <Instagram className="h-4 w-4 text-gold" />
              <span>Instagram</span>
            </a>
            <a
              href="https://www.tiktok.com/@socutebeauty7"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/70 hover:text-gold transition-colors"
            >
              <TikTokIcon className="h-4 w-4 text-gold" />
              <span>TikTok</span>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61580827380530&locale=fr_FR"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/70 hover:text-gold transition-colors"
            >
              <Facebook className="h-4 w-4 text-gold" />
              <span>Facebook</span>
            </a>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-10 md:grid-cols-4">
          <div key="Maison">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-gold font-medium">Maison</h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/about" className="gold-underline hover:text-gold transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/journal" className="gold-underline hover:text-gold transition-colors">
                  Journal
                </Link>
              </li>
              <li>
                <Link to="/ateliers" className="gold-underline hover:text-gold transition-colors">
                  Ateliers
                </Link>
              </li>
              <li>
                <Link
                  to="/sustainability"
                  className="gold-underline hover:text-gold transition-colors"
                >
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>
          <div key="Boutique">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-gold font-medium">
              Boutique
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  to="/collections/$slug"
                  params={{ slug: "all" }}
                  className="gold-underline hover:text-gold transition-colors"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/gift-cards" className="gold-underline hover:text-gold transition-colors">
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link
                  to="/discovery-set"
                  className="gold-underline hover:text-gold transition-colors"
                >
                  Discovery Set
                </Link>
              </li>
              <li>
                <Link to="/stores" className="gold-underline hover:text-gold transition-colors">
                  Store Locator
                </Link>
              </li>
            </ul>
          </div>
          <div key="Care">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-gold font-medium">Care</h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/contact" className="gold-underline hover:text-gold transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="gold-underline hover:text-gold transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/returns" className="gold-underline hover:text-gold transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/faq" className="gold-underline hover:text-gold transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div key="Correspond">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-gold font-medium">
              Correspond
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/newsletter" className="gold-underline hover:text-gold transition-colors">
                  Newsletter
                </Link>
              </li>
              <li>
                <Link to="/press" className="gold-underline hover:text-gold transition-colors">
                  Press Room
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="gold-underline hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="gold-underline hover:text-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-gold/15 pt-8 text-center text-[10px] uppercase tracking-[0.3em] text-foreground/40">
          © MMXXVI Socute Beauty · Monastir, Tunisie
        </div>
      </div>
    </footer>
  );
}
