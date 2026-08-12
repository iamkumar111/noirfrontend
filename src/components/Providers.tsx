"use client";

import { useEffect } from "react";
import CartDrawer from "./CartDrawer";
import IntroGate from "./IntroGate";
import LuxuryRouteTransition from "./transitions/LuxuryRouteTransition";
import { useStore } from "@/store/useStore";

export default function Providers({ children }: { children: React.ReactNode }) {
  const initializeMedusa = useStore((state) => state.initializeMedusa);

  useEffect(() => {
    void initializeMedusa();
  }, [initializeMedusa]);

  return (
    <LuxuryRouteTransition>
      <IntroGate>
        {children}
        <CartDrawer />
      </IntroGate>
    </LuxuryRouteTransition>
  );
}
