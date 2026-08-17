"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

interface WelcomeIntroProps { onComplete: () => void }

/** A single, self-contained gate. The page is not mounted until its exit ends. */
export default function WelcomeIntro({ onComplete }: WelcomeIntroProps) {
  const reduceMotion = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  const [finished, setFinished] = useState(false);

  const finish = useCallback(() => {
    if (finished) return;
    setFinished(true);
    onComplete();
  }, [finished, onComplete]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 769px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (desktop) return;
    const timer = window.setTimeout(finish, reduceMotion ? 80 : 820);
    return () => window.clearTimeout(timer);
  }, [desktop, finish, reduceMotion]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && finish();
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [finish]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] grid min-h-[100svh] place-items-center overflow-hidden bg-[#020202]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.08 : 0.18, ease: "easeOut" }}
    >
      {desktop ? (
        <>
          <video
            autoPlay muted playsInline preload="metadata" onEnded={finish} onError={finish}
            className="absolute inset-0 h-full w-full object-cover"
            src="/videos/noir-oak-welcome-intro.mp4"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,2,2,.18),rgba(2,2,2,.56))]" />
          <button onClick={finish} className="absolute bottom-10 right-10 z-10 min-h-11 border border-[#C9A45C]/35 bg-[#020202]/85 px-6 text-[10px] uppercase tracking-[.24em] text-[#C9A45C] transition-colors hover:text-[#FDF5E6]">
            Skip Intro
          </button>
        </>
      ) : (
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: reduceMotion ? 1 : 1.015 }}
          transition={{ duration: reduceMotion ? 0.08 : 0.48, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src="/images/logo/noir-oak-tree-mark.png" alt="NOIR & OAK" width={132} height={132} priority sizes="132px" className="h-[132px] w-[132px] object-contain" />
          <span className="mt-5 font-serif text-xl tracking-[.22em] text-[#E2C176]">NOIR &amp; OAK</span>
        </motion.div>
      )}
    </motion.div>
  );
}
