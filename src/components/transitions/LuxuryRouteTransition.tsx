"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  LuxuryTransitionContext,
  type LuxuryNavigateOptions,
  type TransitionPhase,
} from '@/hooks/useLuxuryNavigation';

// ── Timings (seconds) — tuned to feel ~1.4s end to end ──────────────────────
const EXIT_S = 0.42;  // curtain closing
const HOLD_S = 0.08;  // brief hold while the route swaps
const ENTRY_S = 0.46; // curtain parting
const EASE = [0.22, 1, 0.36, 1] as const;

// ── Dynamic label per destination ───────────────────────────────────────────
function labelForHref(href: string | null): string {
  if (!href) return 'Opening the Vault';
  const path = href.split('?')[0].split('#')[0];
  if (path === '/') return 'Returning to Noir & Oak';
  if (path.startsWith('/collection')) return 'Entering the Private Collection';
  if (path.startsWith('/product')) return 'Opening the Collection';
  if (path.startsWith('/gifting')) return 'Opening the Gifting Vault';
  if (path.startsWith('/vip')) return 'Unlocking Private Access';
  if (path.startsWith('/login')) return 'Entering the Members Lounge';
  if (path.startsWith('/checkout')) return 'Securing Your Reservation';
  if (path.startsWith('/success')) return 'Sealing Your Reservation';
  if (path.startsWith('/dashboard')) return 'Entering Your Private Lounge';
  if (path.startsWith('/orders') || path.startsWith('/wishlist') || path.startsWith('/profile'))
    return 'Entering Your Private Lounge';
  if (path.startsWith('/our-story')) return 'Entering the Origin';
  if (path.startsWith('/admin')) return 'Entering the Vault Office';
  return 'Opening the Vault';
}

function scrollTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
}

export default function LuxuryRouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [phase, setPhase] = useState<TransitionPhase>('idle');
  const [label, setLabel] = useState('Opening the Vault');

  const phaseRef = useRef<TransitionPhase>('idle');
  const pendingRef = useRef<string | null>(null);
  const optionsRef = useRef<LuxuryNavigateOptions | undefined>(undefined);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // ── Public navigate() ─────────────────────────────────────────────────────
  const navigate = useCallback(
    (href: string, options?: LuxuryNavigateOptions) => {
      if (!href) return;
      const targetPath = href.split('#')[0];
      const currentFull = pathname;

      // Same page (no hash change target) — just glide to top.
      if (targetPath === currentFull || targetPath === '') {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        return;
      }

      // Reduced motion — navigate immediately; PageReveal does a soft fade.
      if (reduceMotion) {
        if (options?.replace) router.replace(href);
        else router.push(href);
        return;
      }

      // Already mid-transition — ignore rapid re-clicks.
      if (phaseRef.current !== 'idle') return;

      pendingRef.current = href;
      optionsRef.current = options;
      setLabel(labelForHref(href));
      setPhase('exiting');
    },
    [pathname, reduceMotion, router],
  );

  // ── exiting → (push route) → navigating ───────────────────────────────────
  useEffect(() => {
    if (phase !== 'exiting') return;
    const t = setTimeout(() => {
      setPhase('navigating');
      const href = pendingRef.current;
      if (href) {
        if (optionsRef.current?.replace) router.replace(href);
        else router.push(href);
      }
    }, (EXIT_S + HOLD_S) * 1000);
    return () => clearTimeout(t);
  }, [phase, router]);

  // ── route committed → entering ────────────────────────────────────────────
  useEffect(() => {
    if (pathname === prevPathRef.current) return;
    prevPathRef.current = pathname;
    scrollTop();

    // Only play the "parting" half if we were driving a transition. Back/forward
    // and reduced-motion navigations just reset scroll and reveal softly.
    if (phaseRef.current === 'navigating' || phaseRef.current === 'exiting') {
      setPhase('entering');
    }
  }, [pathname]);

  // ── entering → idle ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'entering') return;
    const t = setTimeout(() => {
      setPhase('idle');
      pendingRef.current = null;
      optionsRef.current = undefined;
    }, ENTRY_S * 1000);
    return () => clearTimeout(t);
  }, [phase]);

  // ── Global capture-phase interceptor — catches any internal <a> not already
  //    handled by a LuxuryLink (which marks itself data-lux). ────────────────
  useEffect(() => {
    if (reduceMotion) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest('a');
      if (!anchor) return;
      if (anchor.dataset.lux !== undefined) return; // LuxuryLink handles itself
      if (anchor.dataset.noTransition !== undefined) return;

      const target = anchor.getAttribute('target');
      if (target && target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const href = anchor.getAttribute('href');
      if (!href) return;
      // Internal absolute paths only.
      if (!href.startsWith('/') || href.startsWith('//')) return;

      const [path, hash] = href.split('#');
      const targetPath = path || pathname;
      // Same-page anchor jump — let the browser handle the smooth scroll.
      if (hash && targetPath === pathname) return;
      if (targetPath === pathname) return;

      e.preventDefault();
      e.stopImmediatePropagation();
      navigate(href);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [navigate, pathname, reduceMotion]);

  const value = useMemo(
    () => ({ phase, navigate, isTransitioning: phase !== 'idle' }),
    [phase, navigate],
  );

  const overlayActive = phase !== 'idle' && !reduceMotion;

  return (
    <LuxuryTransitionContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {overlayActive && <VaultPassageOverlay phase={phase} label={label} />}
      </AnimatePresence>
    </LuxuryTransitionContext.Provider>
  );
}

// ── The overlay — "Golden Vault Passage" ─────────────────────────────────────
function VaultPassageOverlay({ phase, label }: { phase: TransitionPhase; label: string }) {
  const closed = phase === 'exiting';
  const parting = phase === 'entering';
  const centerVisible = phase === 'exiting' || phase === 'navigating';

  // Lightweight deterministic gold dust.
  const particles = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        top: (i * 6.7) % 100,
        left: (i * 17.3) % 100,
        size: 1 + (i % 3) * 0.7,
        drift: i % 2 === 0 ? 60 : -48,
        dur: 3.4 + (i % 4) * 0.6,
        delay: (i % 6) * 0.12,
      })),
    [],
  );

  const velvet =
    'linear-gradient(180deg, #0b0905 0%, #050403 45%, #0d0a05 100%)';

  return (
    <motion.div
      aria-hidden="true"
      className="luxury-transition fixed inset-0 z-[95] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      style={{ pointerEvents: 'auto' }}
    >
      {/* ── Velvet curtain — two panels closing to centre, then parting ─────── */}
      <motion.div
        className="transition-background transition-panel absolute inset-y-0 left-0 z-0 w-[52%]"
        style={{ background: velvet, boxShadow: 'inset -28px 0 54px rgba(0,0,0,0.72)' }}
        initial={{ x: '-100%' }}
        animate={{ x: closed || phase === 'navigating' ? '0%' : parting ? '-100%' : '-100%' }}
        transition={{ duration: parting ? ENTRY_S : EXIT_S, ease: EASE }}
      />
      <motion.div
        className="transition-background transition-panel absolute inset-y-0 right-0 z-0 w-[52%]"
        style={{ background: velvet, boxShadow: 'inset 28px 0 54px rgba(0,0,0,0.72)' }}
        initial={{ x: '100%' }}
        animate={{ x: closed || phase === 'navigating' ? '0%' : '100%' }}
        transition={{ duration: parting ? ENTRY_S : EXIT_S, ease: EASE }}
      />

      {/* ── Atmosphere: radial gold glow, velvet vignette, smoke, dust ─────── */}
      <motion.div
        className="transition-atmosphere absolute inset-0 z-[1] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: parting ? 0 : 1 }}
        transition={{ duration: parting ? 0.28 : 0.34, ease: 'easeInOut' }}
      >
        {/* base tint */}
        <div className="transition-background absolute inset-0" style={{ background: 'rgba(8,6,3,0.82)' }} />
        {/* radial gold glow */}
        <div
          className="transition-glow absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 42% at 50% 50%, rgba(226,193,118,0.16) 0%, transparent 60%)' }}
        />
        {/* velvet vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 85% 75% at 50% 50%, transparent 45%, rgba(0,0,0,0.58) 100%)' }}
        />
        {/* soft smoke sweeps (blurred radials, drifting) */}
        <motion.div
          className="transition-smoke absolute -inset-x-1/4 inset-y-0"
          style={{ background: 'radial-gradient(ellipse 40% 60% at 30% 50%, rgba(80,70,55,0.28), transparent 70%)', filter: 'blur(60px)' }}
          animate={{ x: ['6%', '-10%'] }}
          transition={{ duration: 3.2, ease: 'easeInOut' }}
        />
        <motion.div
          className="transition-smoke absolute -inset-x-1/4 inset-y-0"
          style={{ background: 'radial-gradient(ellipse 35% 55% at 70% 45%, rgba(201,164,92,0.10), transparent 70%)', filter: 'blur(70px)' }}
          animate={{ x: ['-8%', '8%'] }}
          transition={{ duration: 3.6, ease: 'easeInOut' }}
        />
        {/* gold dust */}
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="transition-particle absolute rounded-full"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: '#E2C176',
              boxShadow: '0 0 6px rgba(226,193,118,0.6)',
            }}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: [0, 0.5, 0], x: p.drift, y: p.drift * 0.2 }}
            transition={{ duration: p.dur, delay: p.delay, ease: 'linear', repeat: Infinity }}
          />
        ))}
      </motion.div>

      {/* ── Centre: gold line, monogram, label ─────────────────────────────── */}
      <motion.div
        className="transition-sharp-content-wrapper absolute inset-0 z-[3] grid place-items-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: centerVisible ? 1 : 0 }}
        transition={{ duration: 0.45, delay: centerVisible ? 0.28 : 0, ease: 'easeInOut' }}
      >
        <div className="transition-sharp-content flex flex-col items-center justify-center">
          {/* Monogram — circular ring and its aura remain separate so no glow is clipped into a square. */}
          <motion.div
            className="transition-logo relative mb-7 flex items-center justify-center"
            initial={{ scale: 0.985, opacity: 0 }}
            animate={{ scale: centerVisible ? 1 : 0.985, opacity: centerVisible ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          >
            <div className="transition-emblem-wrapper">
              <div className="transition-emblem-glow" aria-hidden="true" />
              <div className="transition-emblem">
                <span className="font-serif text-[#E2C176] text-lg tracking-tight">
                  N&amp;O
                </span>
              </div>
            </div>
          </motion.div>

          {/* Thin antique-gold line drawing from centre outward */}
          <motion.div
            className="transition-gold-line h-[1px] w-[min(340px,60vw)]"
            style={{
              background: 'linear-gradient(90deg, transparent, #B88A3B, #E2C176, #B88A3B, transparent)',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: centerVisible ? 1 : 0, opacity: centerVisible ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: EASE }}
          />

          {/* Label */}
          <motion.p
            className="transition-label mt-6 font-light"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: centerVisible ? 1 : 0, y: centerVisible ? 0 : 6 }}
            transition={{ duration: 0.6, delay: 0.42, ease: EASE }}
          >
            {label}
          </motion.p>
        </div>
      </motion.div>

      {/* ── Progress line at the bottom ─────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
        <motion.div
          className="h-full"
          style={{ background: 'linear-gradient(90deg, transparent, #B88A3B, #E2C176, #B88A3B, transparent)', transformOrigin: 'left' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: parting ? 1 : closed || phase === 'navigating' ? 0.72 : 0.12 }}
          transition={{ duration: parting ? ENTRY_S : EXIT_S + HOLD_S, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}
