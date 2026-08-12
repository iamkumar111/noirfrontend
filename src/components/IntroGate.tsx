"use client";

import { useEffect, useState } from "react";
import WelcomeIntro from "./WelcomeIntro";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function IntroGate({ children }: { children: React.ReactNode }) {
  const [introSeen, setIntroSeenLocal] = useState<boolean | null>(null);
  const setStoreIntroSeen = useStore(state => state.setIntroSeen);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const seen = sessionStorage.getItem("noir_oak_intro_seen") === "true";
      setIntroSeenLocal(seen);
      setStoreIntroSeen(seen);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [setStoreIntroSeen]);

  const handleIntroComplete = () => {
    sessionStorage.setItem("noir_oak_intro_seen", "true");
    setIntroSeenLocal(true);
    setStoreIntroSeen(true);
  };

  // Keep the app visible while sessionStorage is checked; the intro itself
  // covers the page when needed, so there is no empty black loading screen.
  if (introSeen === null) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence>
        {!introSeen && <WelcomeIntro key="intro" onComplete={handleIntroComplete} />}
      </AnimatePresence>
      
      {/* 
        When intro is playing, we want children to be mounted (for preloading) 
        but maybe not visible or at least covered by the fixed Intro.
        Since WelcomeIntro has z-[100] and fixed inset-0, it covers the page.
        But to ensure the smooth fade-in requested by user:
        "The header should fade in after the video, not during the intro."
      */}
      <motion.div
        initial={introSeen ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
        className="w-full h-full min-h-screen relative"
      >
        {children}
      </motion.div>
    </>
  );
}
