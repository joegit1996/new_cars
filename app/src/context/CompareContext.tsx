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

interface CompareContextType {
  items: CompareItem[];
  addItem: (item: CompareItem) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  isInCompare: (id: string) => boolean;
  toggleItem: (item: CompareItem) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);

  const addItem = useCallback((item: CompareItem) => {
    setItems((prev) => {
      if (prev.length >= 4) return prev;
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  const isInCompare = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const toggleItem = useCallback(
    (item: CompareItem) => {
      if (isInCompare(item.id)) {
        removeItem(item.id);
      } else {
        addItem(item);
      }
    },
    [isInCompare, removeItem, addItem]
  );

  return (
    <CompareContext.Provider
      value={{ items, addItem, removeItem, clearAll, isInCompare, toggleItem }}
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
