"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export default function Providers({ children }: { children: React.ReactNode }) {
  const initializeMedusa = useStore((state) => state.initializeMedusa);

  useEffect(() => {
    void initializeMedusa();
  }, [initializeMedusa]);

  return <>{children}</>;
}
