"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { ComparisonItem, Listing } from "@/types";
import { getBrandById, getModelById, getTrimById } from "@/data/brands";

interface ComparisonContextType {
  items: ComparisonItem[];
  addToComparison: (listing: Listing) => void;
  removeFromComparison: (listingId: string) => void;
  isInComparison: (listingId: string) => boolean;
  clearComparison: () => void;
}

const ComparisonContext = createContext<ComparisonContextType>({
  items: [],
  addToComparison: () => {},
  removeFromComparison: () => {},
  isInComparison: () => false,
  clearComparison: () => {},
});

const MAX_COMPARISON_ITEMS = 4;

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ComparisonItem[]>([]);

  const addToComparison = useCallback((listing: Listing) => {
    setItems((prev) => {
      if (prev.length >= MAX_COMPARISON_ITEMS) return prev;
      if (prev.some((item) => item.listing.id === listing.id)) return prev;

      const brand = getBrandById(listing.brandId);
      if (!brand) return prev;

      const model = getModelById(listing.brandId, listing.modelId);
      if (!model) return prev;

      const trim = getTrimById(listing.modelId, listing.trimId);
      if (!trim) return prev;

      const variant = trim.variants.find((v) => v.id === listing.variantId);
      if (!variant) return prev;

      return [...prev, { listing, brand, model, trim, variant }];
    });
  }, []);

  const removeFromComparison = useCallback((listingId: string) => {
    setItems((prev) => prev.filter((item) => item.listing.id !== listingId));
  }, []);

  const isInComparison = useCallback(
    (listingId: string) => {
      return items.some((item) => item.listing.id === listingId);
    },
    [items]
  );

  const clearComparison = useCallback(() => {
    setItems([]);
  }, []);

  return (
    <ComparisonContext.Provider
      value={{
        items,
        addToComparison,
        removeFromComparison,
        isInComparison,
        clearComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  return useContext(ComparisonContext);
}
