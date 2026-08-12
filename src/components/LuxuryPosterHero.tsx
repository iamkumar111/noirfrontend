"use client";

import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import Link from '@/components/transitions/LuxuryLink';
import HeroCinematicBackground from '@/components/HeroCinematicBackground';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * LuxuryPosterHero — a centred cinematic brand poster.
 *
 * The golden-tree video sits as atmosphere in the upper-centre; the headline
 * stack lives in the lower-centre over a soft black scrim so the two never
 * fight. Gold dust drifts behind the emblem only — never behind the text.
 */
export default function LuxuryPosterHero({ canPlay = false }: { canPlay?: boolean }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-end text-center overflow-hidden grain-fine pb-[8vh] md:pb-[12vh] section-top">
      {/* Atmospheric golden-tree background (centred emblem) */}
      <HeroCinematicBackground canPlay={canPlay} />

      {/* Gold dust drifting L→R behind the emblem (upper area only, never text) */}
      <div className="absolute inset-x-0 top-0 h-[52%] z-[3] pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: ['-8%', '8%'], opacity: [0.18, 0.32, 0.18] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 gold-dust"
          style={{ '--dust-x': '50%', '--dust-y': '42%' } as CSSProperties}
        />
      </div>

      {/* Localized text scrim behind text area */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(5,4,3,0.58) 0%, rgba(5,4,3,0.18) 58%, transparent 78%)' }}
      />

      {/* Soft warm radial glow behind hero content */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(184, 138, 59, 0.12) 0%, transparent 60%)' }}
      />

      {/* ── Poster content — centred, lower half ──────────────────────────── */}
      <div className="hero-content relative z-[6] flex flex-col items-center">
        {/* Top luxury label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
          className="mb-7 md:mb-8"
        >
          <span className="hero-label">Lot 1 Pre-Paid Only</span>
        </motion.div>

        {/* Headline text layer only — the atmospheric background remains isolated above. */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.16 }}
          className="hero-title font-serif"
          aria-label="ARTISAN CONFECTIONERY HOUSE"
        >
          <span className="hero-title-main">
            <span className="hero-title-artisan">ARTISAN</span>{' '}
            <span className="hero-title-confectionery">CONFECTIONERY</span>
          </span>{' '}
          <span className="hero-title-secondary">HOUSE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.22 }}
          className="hero-editorial-line font-serif font-light italic"
        >
          where finish becomes the experience.
        </motion.p>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="hero-description"
        >
          Pure couverture coated almonds, gold-sealed makhana tins and rigid gifting vaults prepared in numbered micro-batches.
        </motion.p>

        {/* CTAs — fade in after the headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.38 }}
          className="hero-actions"
        >
          <Link href="/vip-access" className="hero-action hero-action-primary btn-foil">
            <span className="btn-label">Request VIP Access</span>
          </Link>
          <Link href="/collection" className="hero-action btn-quiet">
            Preview the Vault
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.46 }}
          className="hero-note"
        >
          Member preview. Pre-paid reservations. Batch card included.
        </motion.p>
      </div>
    </section>
  );
}
