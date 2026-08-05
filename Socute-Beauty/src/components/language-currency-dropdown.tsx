import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";

export interface Preferences {
  lang: string;
  currency: string;
}

const LANGUAGES = [
  { code: "FR", name: "Français", flag: "🇹🇳 / 🇫🇷" },
  { code: "EN", name: "English", flag: "🇬🇧" },
  { code: "AR", name: "العربية", flag: "🇹🇳" },
];

const CURRENCIES = [
  { code: "DT", name: "Dinar Tunisien", symbol: "DT" },
  { code: "EUR", name: "Euro (€)", symbol: "€" },
  { code: "USD", name: "US Dollar ($)", symbol: "$" },
];

export function LanguageCurrencyDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>({ lang: "FR", currency: "DT" });

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("lerredo_prefs");
      if (saved) {
        try {
          setPrefs(JSON.parse(saved));
        } catch {
          // fallback
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.setItem("lerredo_prefs", JSON.stringify(prefs));
    }
  }, [prefs]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-foreground/80 hover:text-gold border border-gold/15 hover:border-gold/30 rounded-xs bg-background/50 transition-colors"
      >
        <Globe className="h-3.5 w-3.5 text-gold/80" />
        <span>
          {prefs.lang} · {prefs.currency}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-gold/60 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-gold" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 z-50 rounded-sm border border-gold/20 bg-[#230612]/95 backdrop-blur-xl p-4 shadow-2xl space-y-4">
          {/* Language Selection */}
          <div>
            <div className="text-[9px] uppercase tracking-[0.25em] text-gold/80 mb-2 font-medium border-b border-gold/15 pb-1">
              Langue / Language
            </div>
            <div className="space-y-1">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setPrefs((p) => ({ ...p, lang: l.code }))}
                  className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-xs text-left transition-colors ${
                    prefs.lang === l.code
                      ? "bg-gold/15 text-gold font-normal"
                      : "text-foreground/75 hover:bg-gold/10 hover:text-gold"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                  </span>
                  {prefs.lang === l.code && <Check className="h-3 w-3 text-gold" />}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Selection */}
          <div>
            <div className="text-[9px] uppercase tracking-[0.25em] text-gold/80 mb-2 font-medium border-b border-gold/15 pb-1">
              Devise / Currency
            </div>
            <div className="space-y-1">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setPrefs((p) => ({ ...p, currency: c.code }))}
                  className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-xs text-left transition-colors ${
                    prefs.currency === c.code
                      ? "bg-gold/15 text-gold font-normal"
                      : "text-foreground/75 hover:bg-gold/10 hover:text-gold"
                  }`}
                >
                  <span>{c.name}</span>
                  {prefs.currency === c.code && <Check className="h-3 w-3 text-gold" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
