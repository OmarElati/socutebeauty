import { motion } from "motion/react";

/**
 * Socute Beauty SB Monogram — uses the real white transparent PNG logo.
 *
 * animate=false  → instant static render (header / navbar)
 * animate=true   → cinematic reveal: left-to-right wipe (S side first,
 *                  then B side) + simultaneous blur-to-sharp fade-in,
 *                  mimicking the pen-drawing effect on the actual image.
 */
export function Monogram({
  className,
  animate = true,
  strokeWidth: _sw,
}: {
  className?: string;
  animate?: boolean;
  strokeWidth?: number;
}) {
  if (!animate) {
    return (
      <img
        src="/logo-sb.png"
        alt="Socute Beauty"
        className={className}
        style={{ objectFit: "contain", display: "block" }}
        draggable={false}
      />
    );
  }

  return (
    <motion.img
      src="/logo-sb.png"
      alt="Socute Beauty"
      className={className}
      draggable={false}
      style={{ objectFit: "contain", display: "block" }}
      initial={{
        clipPath: "inset(0 100% 0 0 round 0px)",
        filter: "blur(6px)",
        opacity: 0.4,
      }}
      animate={{
        clipPath: "inset(0 0% 0 0 round 0px)",
        filter: "blur(0px)",
        opacity: 1,
      }}
      transition={{
        clipPath: { duration: 2.2, ease: [0.4, 0, 0.15, 1] },
        filter:   { duration: 1.4, ease: "easeOut" },
        opacity:  { duration: 0.4, ease: "easeIn" },
      }}
    />
  );
}

/**
 * MonogramFlourish — decorative horizontal ornament divider.
 */
export function MonogramFlourish({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 16"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={0.8}
      strokeLinecap="round"
    >
      <line x1="0" y1="8" x2="88" y2="8" />
      <path d="M 96 8 C 100 2, 108 2, 112 8 C 116 14, 124 14, 128 8 C 132 2, 140 2, 144 8" />
      <line x1="152" y1="8" x2="240" y2="8" />
      <circle cx="120" cy="8" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
