"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Filters, Listing, BodyType, FuelType, Transmission, Drivetrain } from "@/types";
import { filterListings } from "@/data/listings";

type FilterKey = keyof Filters;

export function useFilters(brandId: string | null, modelIds: string[]) {
  const [filters, setFilters] = useState<Partial<Filters>>({});

  // Reset filters when brandId changes
  useEffect(() => {
    setFilters({});
  }, [brandId]);

  const fullFilters: Partial<Filters> = useMemo(
    () => ({
      ...filters,
      brandId: brandId || undefined,
      modelIds: modelIds.length > 0 ? modelIds : undefined,
    }),
    [filters, brandId, modelIds]
  );

  const filteredListings: Listing[] = useMemo(
    () => filterListings(fullFilters),
    [fullFilters]
  );

  const setFilter = useCallback(
    (newFilters: Partial<Filters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const clearFilter = useCallback(
    (key: FilterKey, value?: string) => {
      setFilters((prev) => {
        const next = { ...prev };

        if (!value) {
          delete next[key];
          return next;
        }

        // For array-type filters, remove the specific value
        const current = next[key];
        if (Array.isArray(current)) {
          const filtered = (current as string[]).filter((v) => v !== value);
          if (filtered.length === 0) {
            delete next[key];
          } else {
            (next as Record<string, unknown>)[key] = filtered;
          }
        } else {
          delete next[key];
        }

        return next;
      });
    },
    []
  );

  const clearAll = useCallback(() => {
    setFilters({});
  }, []);

  return {
    filters: fullFilters,
    setFilter,
    clearFilter,
    clearAll,
    filteredListings,
  };
}
