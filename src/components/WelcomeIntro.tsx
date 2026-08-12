"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedLogoAura from "./AnimatedLogoAura";

interface WelcomeIntroProps {
  onComplete: () => void;
}

export default function WelcomeIntro({ onComplete }: WelcomeIntroProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isSkipping, setIsSkipping] = useState(false);
  const [prefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSkip = useCallback(() => {
    if (isSkipping) return;
    setIsSkipping(true);
    setShowIntro(false);
    window.setTimeout(onComplete, 650);
  }, [isSkipping, onComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkip]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      if (Number.isFinite(duration) && duration > 0) {
        setVideoProgress((videoRef.current.currentTime / duration) * 100);
      }
    }
  };

  const finishIntro = () => {
    setIsSkipping(true);
    setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => {
        onComplete();
      }, 1000); // 1s fade to homepage
    }, 500); // 0.5s hold
  };

  if (prefersReducedMotion || videoError) {
    return (
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] bg-[#020202] flex flex-col items-center justify-center noise-bg overflow-hidden"
          >
            <AnimatedLogoAura position="center" isFullOpacity />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]/50 pointer-events-none opacity-80 z-10"></div>
            
            <div className="text-center z-20 relative mt-40">
              <button
                onClick={handleSkip}
                className="px-10 py-4 bg-[#050505]/80 backdrop-blur-md border border-[#C9A45C]/30 uppercase tracking-[0.3em] text-[10px] text-[#C9A45C] hover:bg-[#C9A45C]/10 hover:text-[#FDF5E6] transition-all duration-500 rounded-sm"
              >
                Enter Site
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-[#020202] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background Video */}
          <motion.div
            animate={{ opacity: isSkipping ? 0 : 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
              poster="/images/hero/welcome-intro-poster.jpg"
              onTimeUpdate={handleTimeUpdate}
              onEnded={finishIntro}
              onError={() => setVideoError(true)}
              className="w-full h-full object-contain md:object-cover object-center"
              src="/videos/noir-oak-welcome-intro.mp4"
            />
          </motion.div>

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-[#020202]/30 pointer-events-none opacity-80"></div>
          <div className="absolute inset-0 vignette pointer-events-none opacity-90"></div>
          <div className="absolute inset-0 noise-bg pointer-events-none z-10"></div>


          {/* Skip Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isSkipping ? 0 : 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-6 right-1/2 translate-x-1/2 md:bottom-10 md:right-10 md:translate-x-0 z-30"
          >
            <button
              onClick={handleSkip}
              aria-label="Skip Intro"
              className="px-5 py-3 md:px-6 bg-[#020202]/60 backdrop-blur-md border border-[#C9A45C]/30 text-[#C9A45C] text-[9px] uppercase tracking-[0.24em] md:tracking-[0.3em] hover:bg-[#C9A45C]/10 hover:shadow-[0_0_20px_rgba(201,164,92,0.2)] hover:text-[#FDF5E6] transition-all duration-500 rounded-sm whitespace-nowrap"
            >
              Skip Intro
            </button>
          </motion.div>

          {/* Loading Progress Line */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 z-30">
            <motion.div
              className="h-full bg-gradient-to-r from-[#C9A45C] via-[#FDF5E6] to-[#C9A45C]"
              style={{ width: `${videoProgress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
