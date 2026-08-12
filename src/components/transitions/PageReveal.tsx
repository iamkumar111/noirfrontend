"use client";

import { motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * Wraps page content and re-plays the existing soft upward fade whenever the
 * route changes. The curtain and its atmospheric layers provide the softness;
 * the incoming DOM stays unfiltered so text and product imagery remain sharp.
 */
export default function PageReveal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0.15 : 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: reduce ? 0 : 0.05,
      }}
    >
      {children}
    </motion.div>
  );
}
