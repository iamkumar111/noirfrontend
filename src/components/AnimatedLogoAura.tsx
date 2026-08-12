"use client";

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useMemo } from 'react';

interface AnimatedLogoAuraProps {
  position?: 'center' | 'left' | 'right';
  opacity?: number;
  isFullOpacity?: boolean;
}

const NUT_GLOWS = [
  { top: 26, left: 42, size: 7, duration: 6.8, delay: 0.2, x: 1.6, y: -1.0, rotate: 1.4 },
  { top: 31, left: 54, size: 5, duration: 7.4, delay: 1.1, x: -1.8, y: 1.2, rotate: -1.8 },
  { top: 38, left: 36, size: 4, duration: 5.9, delay: 0.7, x: 1.2, y: 1.6, rotate: 1.0 },
  { top: 40, left: 62, size: 6, duration: 8.2, delay: 1.8, x: -1.4, y: -1.3, rotate: -1.2 },
  { top: 48, left: 45, size: 4, duration: 6.5, delay: 2.2, x: 1.9, y: 1.0, rotate: 2.0 },
  { top: 53, left: 58, size: 5, duration: 7.8, delay: 0.4, x: -1.2, y: 1.8, rotate: -1.5 },
  { top: 56, left: 39, size: 4, duration: 8.6, delay: 1.5, x: 1.0, y: -1.5, rotate: 1.2 },
  { top: 33, left: 47, size: 3, duration: 6.2, delay: 2.8, x: -1.5, y: 1.0, rotate: -1.0 },
];

function makeParticles(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const row = i % 9;
    return {
      id: i,
      top: 16 + ((i * 13) % 58),
      left: -18 - ((i * 7) % 22),
      size: 1 + (i % 3) * 0.6,
      duration: 18 + (i % 7) * 2.4,
      delay: (i % 11) * 0.9,
      yDrift: (row - 4) * 1.4,
      opacity: 0.16 + (i % 5) * 0.045,
    };
  });
}

export default function AnimatedLogoAura({
  position = 'center',
  opacity = 0.22,
  isFullOpacity = false,
}: AnimatedLogoAuraProps) {
  const reduceMotion = useReducedMotion();
  const desktopParticles = useMemo(() => makeParticles(10), []);
  const mobileParticles = useMemo(() => makeParticles(4), []);

  const desktopPosClasses = {
    center: 'md:left-1/2 md:-translate-x-1/2',
    left: 'md:left-[4%] md:translate-x-0',
    right: 'md:right-[2%] md:translate-x-0 md:left-auto',
  };

  const currentOpacity = isFullOpacity ? 0.34 : opacity;

  const treeMotion = reduceMotion
    ? {}
    : {
        scale: [1, 1.006, 1],
      };

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_35%,rgba(201,164,92,0.055),transparent_68%)]" />

      <motion.div
        className={`absolute top-[12%] md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2 w-[110vw] md:w-[65vw] max-w-[900px] aspect-square ${desktopPosClasses[position]}`}
        style={{
          opacity: currentOpacity,
          WebkitMaskImage: 'radial-gradient(ellipse 58% 58% at 50% 48%, black 0%, rgba(0,0,0,0.86) 54%, rgba(0,0,0,0.28) 74%, transparent 91%)',
          maskImage: 'radial-gradient(ellipse 58% 58% at 50% 48%, black 0%, rgba(0,0,0,0.86) 54%, rgba(0,0,0,0.28) 74%, transparent 91%)',
        }}
      >
        {/* Smoke: behind the emblem, never over content. */}
        <motion.div
          className="absolute inset-[4%] z-[1] hidden md:block rounded-full blur-3xl mix-blend-screen"
          style={{
            background:
              'radial-gradient(ellipse 44% 36% at 38% 42%, rgba(150,126,84,0.20), transparent 72%), radial-gradient(ellipse 38% 44% at 64% 52%, rgba(74,58,42,0.18), transparent 74%)',
          }}
          animate={reduceMotion ? {} : { x: ['-1.5%', '1.8%', '-1.5%'], opacity: [0.45, 0.72, 0.45] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute inset-[6%] z-[1] md:hidden rounded-full blur-3xl mix-blend-screen"
          style={{
            background: 'radial-gradient(ellipse 52% 42% at 50% 42%, rgba(150,126,84,0.14), transparent 76%)',
          }}
          animate={reduceMotion ? {} : { opacity: [0.42, 0.58, 0.42] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Slow left-to-right gold dust behind the tree. */}
        <div className="absolute inset-0 z-[2] hidden md:block overflow-hidden">
          {desktopParticles.map((particle) => (
            <motion.span
              key={particle.id}
              className="absolute rounded-full"
              style={{
                top: `${particle.top}%`,
                left: `${particle.left}%`,
                width: particle.size,
                height: particle.size,
                background: 'rgba(226,193,118,0.9)',
                boxShadow: '0 0 7px rgba(226,193,118,0.40)',
              }}
              animate={
                reduceMotion
                  ? { opacity: 0.18 }
                  : { x: ['0vw', '92vw'], y: [0, particle.yDrift, 0], opacity: [0, particle.opacity, 0] }
              }
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 z-[2] md:hidden overflow-hidden">
          {mobileParticles.map((particle) => (
            <motion.span
              key={particle.id}
              className="absolute rounded-full"
              style={{
                top: `${particle.top}%`,
                left: `${particle.left}%`,
                width: particle.size,
                height: particle.size,
                background: 'rgba(226,193,118,0.82)',
                boxShadow: '0 0 5px rgba(226,193,118,0.32)',
              }}
              animate={
                reduceMotion
                  ? { opacity: 0.12 }
                  : { x: ['0vw', '118vw'], y: [0, particle.yDrift * 0.7, 0], opacity: [0, particle.opacity * 0.75, 0] }
              }
              transition={{
                duration: particle.duration + 4,
                delay: particle.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* Stable tree emblem. Only the glow breathes very slightly. */}
        <motion.div
          className="absolute inset-[5%] z-[3]"
          animate={treeMotion}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            filter:
              'drop-shadow(0 0 18px rgba(201,164,92,0.20)) drop-shadow(0 0 42px rgba(201,164,92,0.10)) brightness(1.04) contrast(1.08)',
          }}
        >
          <Image
            src="/images/logo/noir-oak-tree-mark.png"
            alt=""
            fill
            sizes="(max-width: 768px) 110vw, 65vw"
            className="object-contain pointer-events-none select-none"
            priority={isFullOpacity}
            draggable={false}
          />

          {/* Canopy glows: fake small nut/leaf movement without moving the PNG. */}
          {!reduceMotion && NUT_GLOWS.slice(0, 4).map((glow) => (
            <motion.span
              key={`${glow.top}-${glow.left}`}
              className="absolute rounded-full"
              style={{
                top: `${glow.top}%`,
                left: `${glow.left}%`,
                width: glow.size,
                height: glow.size,
                background: 'radial-gradient(circle, rgba(255,242,188,0.56), rgba(226,193,118,0.22) 45%, transparent 70%)',
                boxShadow: '0 0 10px rgba(226,193,118,0.22)',
                transformOrigin: '50% 70%',
              }}
              animate={{
                x: [-glow.x, glow.x, -glow.x],
                y: [glow.y, -glow.y, glow.y],
                rotate: [-glow.rotate, glow.rotate, -glow.rotate],
                opacity: [0.36, 0.62, 0.36],
              }}
              transition={{
                duration: glow.duration,
                delay: glow.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Metallic foil sweep. Transform-only and deliberately slow. */}
          {!reduceMotion && (
            <motion.div
              className="absolute -inset-y-4 -left-1/3 w-1/3 skew-x-[-20deg] mix-blend-screen"
              style={{
                background:
                  'linear-gradient(110deg, transparent 35%, rgba(226,193,118,0.25) 50%, transparent 65%)',
                WebkitMaskImage: 'radial-gradient(ellipse 48% 58% at 58% 45%, black 0%, transparent 78%)',
                maskImage: 'radial-gradient(ellipse 48% 58% at 58% 45%, black 0%, transparent 78%)',
              }}
              animate={{ x: ['-80%', '520%'], opacity: [0, 0.8, 0] }}
              transition={{
                duration: 3.6,
                repeat: Infinity,
                repeatDelay: 6.8,
                ease: 'easeInOut',
              }}
            />
          )}
        </motion.div>

        {/* Local text scrim layer above tree, below content. */}
        <div
          className="absolute inset-0 z-[4] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 48%, rgba(0,0,0,0.42), rgba(0,0,0,0.18) 42%, transparent 70%)',
          }}
        />
      </motion.div>
    </div>
  );
}
