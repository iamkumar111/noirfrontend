"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

interface HeroCinematicBackgroundProps {
  canPlay?: boolean;
}

const CROSSFADE_OFFSET_S = 1.4;
const CROSSFADE_DURATION_S = 1.6;
const LOOP_OPACITY = 0.28;

let heroIntroPlayedThisSession = false;

export default function HeroCinematicBackground({ canPlay = false }: HeroCinematicBackgroundProps) {
  const introRef = useRef<HTMLVideoElement>(null);
  const loopRef = useRef<HTMLVideoElement>(null);
  const [crossfadeStarted, setCrossfadeStarted] = useState(heroIntroPlayedThisSession);
  const [introComplete, setIntroComplete] = useState(heroIntroPlayedThisSession);
  const [showVeil, setShowVeil] = useState(!heroIntroPlayedThisSession);

  const safePlay = useCallback(async (video: HTMLVideoElement | null) => {
    if (!video || !canPlay || document.hidden) return;

    try {
      await video.play();
    } catch (error) {
      const name = error instanceof DOMException ? error.name : '';
      if (name !== 'AbortError' && name !== 'NotAllowedError') {
        console.warn('Hero background video could not play:', error);
      }
    }
  }, [canPlay]);

  useEffect(() => {
    if (!canPlay) return;

    safePlay(loopRef.current);

    if (!heroIntroPlayedThisSession) {
      safePlay(introRef.current);
    }

    const handleVisibility = () => {
      if (!document.hidden) {
        safePlay(loopRef.current);
        if (!heroIntroPlayedThisSession) {
          safePlay(introRef.current);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [canPlay, safePlay]);

  const handleIntroTimeUpdate = () => {
    const intro = introRef.current;
    if (!intro || crossfadeStarted || !Number.isFinite(intro.duration)) return;

    if (intro.duration - intro.currentTime <= CROSSFADE_OFFSET_S) {
      setCrossfadeStarted(true);
      setShowVeil(false);
      safePlay(loopRef.current);
    }
  };

  const handleIntroEnded = () => {
    heroIntroPlayedThisSession = true;
    setCrossfadeStarted(true);
    setIntroComplete(true);
    setShowVeil(false);
    safePlay(loopRef.current);
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden z-[1] pointer-events-none select-none"
      style={{ backgroundColor: '#090806' }}
      aria-hidden="true"
    >
      {/* z-0: velvet gradient base */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 72% 54% at 50% 18%, rgba(38,28,14,0.52) 0%, rgba(8,6,4,0.78) 48%, #090806 86%)',
        }}
      />

      <video
        ref={loopRef}
        className="absolute inset-0 z-[1] h-full w-full object-cover opacity-0"
        style={{
          opacity: canPlay && crossfadeStarted ? LOOP_OPACITY : 0,
          transition: `opacity ${CROSSFADE_DURATION_S}s ease`,
          WebkitMaskImage: 'radial-gradient(ellipse 78% 68% at 50% 44%, black 0%, rgba(0,0,0,0.74) 58%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 78% 68% at 50% 44%, black 0%, rgba(0,0,0,0.74) 58%, transparent 100%)',
        }}
        src="/videos/loopherosection-pingpong.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => safePlay(loopRef.current)}
      />

      <AnimatePresence>
        {canPlay && !introComplete && (
          <motion.video
            key="hero-intro"
            ref={introRef}
            className="absolute inset-0 z-[2] h-full w-full object-cover"
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 44%, black 0%, rgba(0,0,0,0.78) 58%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse 80% 70% at 50% 44%, black 0%, rgba(0,0,0,0.78) 58%, transparent 100%)',
            }}
            src="/videos/noir-oak-hero-intro.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            initial={{ opacity: showVeil ? 0 : 0.35 }}
            animate={{ opacity: crossfadeStarted ? 0 : 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: CROSSFADE_DURATION_S, ease: 'easeInOut' }}
            onCanPlay={() => {
              setShowVeil(false);
              safePlay(introRef.current);
            }}
            onTimeUpdate={handleIntroTimeUpdate}
            onEnded={handleIntroEnded}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 z-[3]"
        initial={false}
        animate={{ opacity: showVeil ? 1 : 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        style={{
          background:
            'radial-gradient(ellipse 58% 48% at 50% 28%, rgba(37,26,12,0.72), rgba(9,8,6,0.96) 68%)',
        }}
      />

      {/* z-4: readability scrims around the hero text zone, max opacity 0.35 */}
      <div
        className="absolute inset-0 z-[4]"
        style={{
          background: `
            radial-gradient(circle at 50% 68%, rgba(0,0,0,0.35), rgba(0,0,0,0.15) 36%, transparent 70%),
            linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 34%, rgba(0,0,0,0.35) 100%)
          `,
        }}
      />
    </div>
  );
}
