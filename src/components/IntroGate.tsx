"use client";

import { useEffect, useState } from "react";
import WelcomeIntro from "./WelcomeIntro";
import { AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function IntroGate({ children }: { children: React.ReactNode }) {
  const [introSeen, setIntroSeenLocal] = useState<boolean | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const setStoreIntroSeen = useStore(state => state.setIntroSeen);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const seen = sessionStorage.getItem("noir_oak_intro_seen") === "true";
      setIntroSeenLocal(seen);
      setShowIntro(!seen);
      setContentReady(seen);
      setStoreIntroSeen(seen);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [setStoreIntroSeen]);

  const handleIntroComplete = () => {
    sessionStorage.setItem("noir_oak_intro_seen", "true");
    setStoreIntroSeen(true);
    setShowIntro(false);
  };

  if (introSeen === null) {
    return <div className="min-h-[100svh] bg-[#020202]" aria-hidden="true" />;
  }

  return (
    <>
      <AnimatePresence mode="wait" onExitComplete={() => setContentReady(true)}>
        {showIntro && <WelcomeIntro key="intro" onComplete={handleIntroComplete} />}
      </AnimatePresence>
      {contentReady ? children : null}
    </>
  );
}
