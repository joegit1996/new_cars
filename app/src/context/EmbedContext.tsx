"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

interface EmbedContextType {
  isEmbedded: boolean;
}

const EmbedContext = createContext<EmbedContextType>({ isEmbedded: false });

export function EmbedProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const isEmbedded = searchParams.get("embedded") === "true";

  return (
    <EmbedContext.Provider value={{ isEmbedded }}>
      {children}
    </EmbedContext.Provider>
  );
}

export function useEmbed() {
  return useContext(EmbedContext);
}
