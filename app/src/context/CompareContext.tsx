"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface CompareItem {
  id: string;
  name: string;
  brandName: string;
  price: number;
  imageUrl: string;
}

export type CompareMode = "models" | "trims";

interface CompareContextType {
  mode: CompareMode;
  setMode: (mode: CompareMode) => void;
  modelItems: CompareItem[];
  trimItems: CompareItem[];
  // Convenience: returns items for the current mode
  items: CompareItem[];
  totalCount: number;
  addItem: (item: CompareItem, target?: CompareMode) => void;
  removeItem: (id: string, target?: CompareMode) => void;
  clearAll: (target?: CompareMode) => void;
  isInCompare: (id: string, target?: CompareMode) => boolean;
  toggleItem: (item: CompareItem, target?: CompareMode) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<CompareMode>("models");
  const [modelItems, setModelItems] = useState<CompareItem[]>([]);
  const [trimItems, setTrimItems] = useState<CompareItem[]>([]);

  const getItems = (target: CompareMode) => (target === "models" ? modelItems : trimItems);
  const getSetItems = (target: CompareMode) => (target === "models" ? setModelItems : setTrimItems);

  const addItem = useCallback((item: CompareItem, target?: CompareMode) => {
    const setter = target === "trims" ? setTrimItems : target === "models" ? setModelItems : (mode === "models" ? setModelItems : setTrimItems);
    setter((prev) => {
      if (prev.length >= 4) return prev;
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, [mode]);

  const removeItem = useCallback((id: string, target?: CompareMode) => {
    const setter = target === "trims" ? setTrimItems : target === "models" ? setModelItems : (mode === "models" ? setModelItems : setTrimItems);
    setter((prev) => prev.filter((i) => i.id !== id));
  }, [mode]);

  const clearAll = useCallback((target?: CompareMode) => {
    const setter = target === "trims" ? setTrimItems : target === "models" ? setModelItems : (mode === "models" ? setModelItems : setTrimItems);
    setter([]);
  }, [mode]);

  const isInCompare = useCallback(
    (id: string, target?: CompareMode) => {
      const items = target === "trims" ? trimItems : target === "models" ? modelItems : (mode === "models" ? modelItems : trimItems);
      return items.some((i) => i.id === id);
    },
    [modelItems, trimItems, mode]
  );

  const toggleItem = useCallback(
    (item: CompareItem, target?: CompareMode) => {
      if (isInCompare(item.id, target)) {
        removeItem(item.id, target);
      } else {
        addItem(item, target);
      }
    },
    [isInCompare, removeItem, addItem]
  );

  const items = mode === "models" ? modelItems : trimItems;
  const totalCount = modelItems.length + trimItems.length;

  return (
    <CompareContext.Provider
      value={{
        mode,
        setMode,
        modelItems,
        trimItems,
        items,
        totalCount,
        addItem,
        removeItem,
        clearAll,
        isInCompare,
        toggleItem,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
