"use client";

import { createContext, useContext } from 'react';

/**
 * The four states of the Golden Vault Passage transition:
 *  - idle:       nothing happening, overlay unmounted
 *  - exiting:    velvet curtain closing over the current page
 *  - navigating: brief hold while the route actually changes
 *  - entering:   curtain parting to reveal the new page
 */
export type TransitionPhase = 'idle' | 'exiting' | 'navigating' | 'entering';

export interface LuxuryNavigateOptions {
  replace?: boolean;
}

export interface LuxuryTransitionValue {
  phase: TransitionPhase;
  isTransitioning: boolean;
  /** Begin a luxury transition to an internal href. */
  navigate: (href: string, options?: LuxuryNavigateOptions) => void;
}

export const LuxuryTransitionContext = createContext<LuxuryTransitionValue | null>(null);

/**
 * Access the luxury navigation API. Safe to call outside the provider — it
 * falls back to a hard navigation so nothing ever dead-ends.
 */
export function useLuxuryNavigation(): LuxuryTransitionValue {
  const ctx = useContext(LuxuryTransitionContext);
  if (ctx) return ctx;

  return {
    phase: 'idle',
    isTransitioning: false,
    navigate: (href: string) => {
      if (typeof window !== 'undefined') window.location.href = href;
    },
  };
}
