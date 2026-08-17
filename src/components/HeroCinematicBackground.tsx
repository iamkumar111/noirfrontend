"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

interface HeroCinematicBackgroundProps { canPlay?: boolean }

/**
 * One stable video element: it neither remounts for cart/menu/store updates nor
 * competes with a second intro stream. The matching poster stays visible until
 * the first decoded video frame is ready.
 */
export default function HeroCinematicBackground({ canPlay = false }: HeroCinematicBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video || reduceMotion || document.hidden) return;
    try { await video.play(); } catch { /* Browser autoplay policy keeps the poster visible. */ }
  }, [reduceMotion]);

  useEffect(() => {
    if (!canPlay || reduceMotion) return;
    void play();
    const onVisibility = () => { if (!document.hidden) void play(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [canPlay, play, reduceMotion]);

  return (
    <div className="absolute inset-0 z-[1] overflow-hidden bg-[#090806]" aria-hidden="true">
      <Image
        src="/images/hero/hero-loop-poster.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {!reduceMotion && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ opacity: ready ? 1 : 0, transition: "opacity 220ms ease-out" }}
          src="/videos/loopherosection-pingpong.mp4"
          poster="/images/hero/hero-loop-poster.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={play}
          onLoadedData={() => setReady(true)}
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_72%_58%_at_50%_28%,rgba(31,23,12,.12),rgba(5,4,3,.48)_72%)]" />
    </div>
  );
}
