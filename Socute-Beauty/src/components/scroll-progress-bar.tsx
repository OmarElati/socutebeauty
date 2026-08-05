import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold/60 via-gold to-gold-light z-[100] origin-left shadow-[0_0_10px_rgba(201,162,75,0.7)] pointer-events-none"
      style={{ scaleX }}
    />
  );
}
