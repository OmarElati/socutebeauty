import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

type Notes = { top: string[]; heart: string[]; base: string[] };
type Tier = "top" | "heart" | "base";

interface ScentPyramidProps {
  notes: Notes;
  productName?: string;
  onExploreIngredients?: () => void;
}

export function ScentPyramid({ notes, productName, onExploreIngredients }: ScentPyramidProps) {
  const [activeTier, setActiveTier] = useState<Tier>("top");

  const topList =
    Array.isArray(notes?.top) && notes.top.length ? notes.top : ["Saffron", "Bergamot"];
  const heartList =
    Array.isArray(notes?.heart) && notes.heart.length ? notes.heart : ["Turkish Rose", "Iris"];
  const baseList =
    Array.isArray(notes?.base) && notes.base.length
      ? notes.base
      : ["Indonesian Patchouli", "Oud", "Sandalwood"];

  return (
    <div className="mx-auto w-full max-w-6xl rounded-3xl border border-gold/25 bg-[#260812] p-8 md:p-14 lg:p-16 text-foreground shadow-2xl relative overflow-hidden">
      {/* Background glow radial */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#4A1020]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        {/* Left Column: Interactive 3-Tier Stacked Pyramid Boxes */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-3 py-6">
          {/* Box 01: Top Notes */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveTier("top")}
            onMouseEnter={() => setActiveTier("top")}
            className={`relative flex h-24 w-44 md:w-48 items-center justify-center rounded-lg border transition-all duration-300 cursor-pointer ${
              activeTier === "top"
                ? "border-gold bg-gold/15 shadow-lg shadow-gold/20"
                : "border-gold/30 bg-[#340B18]/60 hover:border-gold/60"
            }`}
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#260812] px-3 text-[10px] uppercase tracking-[0.25em] text-gold font-medium whitespace-nowrap">
              THE OPENING
            </span>
            <span
              className={`font-serif text-3xl font-light tracking-widest transition-colors ${
                activeTier === "top" ? "text-gold" : "text-gold/50"
              }`}
            >
              01
            </span>
          </motion.button>

          {/* Box 02: Heart Notes */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveTier("heart")}
            onMouseEnter={() => setActiveTier("heart")}
            className={`relative flex h-28 w-60 md:w-64 items-center justify-center rounded-lg border transition-all duration-300 cursor-pointer ${
              activeTier === "heart"
                ? "border-gold bg-gold/15 shadow-lg shadow-gold/20"
                : "border-gold/30 bg-[#340B18]/60 hover:border-gold/60"
            }`}
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#260812] px-3 text-[10px] uppercase tracking-[0.25em] text-gold font-medium whitespace-nowrap">
              THE SOUL
            </span>
            <span
              className={`font-serif text-3xl font-light tracking-widest transition-colors ${
                activeTier === "heart" ? "text-gold" : "text-gold/50"
              }`}
            >
              02
            </span>
          </motion.button>

          {/* Box 03: Base Notes */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveTier("base")}
            onMouseEnter={() => setActiveTier("base")}
            className={`relative flex h-32 w-76 md:w-80 items-center justify-center rounded-lg border transition-all duration-300 cursor-pointer ${
              activeTier === "base"
                ? "border-gold bg-gold/15 shadow-lg shadow-gold/20"
                : "border-gold/30 bg-[#340B18]/60 hover:border-gold/60"
            }`}
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#260812] px-3 text-[10px] uppercase tracking-[0.25em] text-gold font-medium whitespace-nowrap">
              THE LINGERING
            </span>
            <span
              className={`font-serif text-3xl font-light tracking-widest transition-colors ${
                activeTier === "base" ? "text-gold" : "text-gold/50"
              }`}
            >
              03
            </span>
          </motion.button>
        </div>

        {/* Right Column: Scent Architecture Notes Evolution */}
        <div className="lg:col-span-7 space-y-8">
          {/* Header */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-medium block">
              EVOLUTION
            </span>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl italic text-foreground tracking-wide">
              Scent Architecture
            </h2>
          </div>

          {/* Notes breakdown */}
          <div className="space-y-7">
            {/* Top Notes Section */}
            <div
              className={`transition-opacity duration-300 ${
                activeTier === "top" ? "opacity-100" : "opacity-80"
              }`}
            >
              <div className="flex items-center gap-4 mb-2">
                <h3 className="font-serif text-xl text-gold font-normal">Top Notes</h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-gold/40 via-gold/15 to-transparent" />
              </div>
              <p className="text-sm leading-relaxed text-foreground/85">
                {topList.map((item, idx) => (
                  <span key={idx}>
                    <span className="text-gold font-semibold">{item}</span>
                    {idx < topList.length - 1 ? " and " : " "}
                  </span>
                ))}
                provide a sharp, radiant introduction that awakens the senses instantly.
              </p>
            </div>

            {/* Heart Notes Section */}
            <div
              className={`transition-opacity duration-300 ${
                activeTier === "heart" ? "opacity-100" : "opacity-80"
              }`}
            >
              <div className="flex items-center gap-4 mb-2">
                <h3 className="font-serif text-xl text-gold font-normal">Heart Notes</h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-gold/40 via-gold/15 to-transparent" />
              </div>
              <p className="text-sm leading-relaxed text-foreground/85">
                The essence of{" "}
                <span className="text-gold font-semibold">{heartList[0] || "Turkish Rose"}</span>
                {heartList[1] && (
                  <>
                    {" "}
                    entwines with powdery{" "}
                    <span className="text-gold font-semibold">{heartList[1]}</span>
                  </>
                )}
                {heartList.length > 2 && (
                  <>
                    {" "}
                    and{" "}
                    <span className="text-gold font-semibold">{heartList.slice(2).join(", ")}</span>
                  </>
                )}{" "}
                for a sophisticated, floral complexity.
              </p>
            </div>

            {/* Base Notes Section */}
            <div
              className={`transition-opacity duration-300 ${
                activeTier === "base" ? "opacity-100" : "opacity-80"
              }`}
            >
              <div className="flex items-center gap-4 mb-2">
                <h3 className="font-serif text-xl text-gold font-normal">Base Notes</h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-gold/40 via-gold/15 to-transparent" />
              </div>
              <p className="text-sm leading-relaxed text-foreground/85">
                A deep, resinous foundation of{" "}
                {baseList.map((item, idx) => {
                  const isLast = idx === baseList.length - 1;
                  return (
                    <span key={idx}>
                      <span className="text-gold font-semibold">{item}</span>
                      {!isLast ? (idx === baseList.length - 2 ? ", and " : ", ") : "."}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (onExploreIngredients) {
                  onExploreIngredients();
                } else {
                  const el = document.getElementById("ingredients-section");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-none border border-gold/50 bg-transparent px-8 py-3.5 text-xs uppercase tracking-[0.25em] text-gold font-medium hover:bg-gold hover:text-ink transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>EXPLORE INGREDIENTS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
