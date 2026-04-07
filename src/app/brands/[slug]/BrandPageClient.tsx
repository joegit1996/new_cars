"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Brand, Model, Trim } from "@/types";
import ModelCarousel from "@/components/ModelCarousel/ModelCarousel";
import FilterRow from "@/components/FilterRow/FilterRow";
import { FilterState } from "@/components/FilterRow/FilterRow";
import TrimFeed from "@/components/TrimFeed/TrimFeed";
import styles from "./page.module.css";

interface BrandPageClientProps {
  brand: Brand;
  models: Model[];
  trims: Trim[];
}

function trimMatchesFilters(trim: Trim, filters: FilterState): boolean {
  const hasActiveFilter =
    filters.priceRange !== undefined ||
    filters.year !== undefined ||
    filters.bodyType !== undefined ||
    filters.engineType !== undefined ||
    filters.drivetrain !== undefined ||
    filters.transmission !== undefined;

  if (!hasActiveFilter) return true;

  return trim.variants.some((variant) => {
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      if (variant.price < min || variant.price > max) return false;
    }
    if (filters.year !== undefined) {
      if (variant.specs.year !== filters.year) return false;
    }
    if (filters.bodyType !== undefined) {
      if (variant.specs.bodyType !== filters.bodyType) return false;
    }
    if (filters.engineType !== undefined) {
      const engineLower = variant.specs.engine.toLowerCase();
      const fuelLower = variant.specs.fuelType.toLowerCase();
      const filterLower = filters.engineType.toLowerCase();
      if (!engineLower.includes(filterLower) && !fuelLower.includes(filterLower)) return false;
    }
    if (filters.drivetrain !== undefined) {
      if (variant.specs.drivetrain !== filters.drivetrain) return false;
    }
    if (filters.transmission !== undefined) {
      if (!variant.specs.transmission.toLowerCase().includes(filters.transmission.toLowerCase())) return false;
    }
    return true;
  });
}

export default function BrandPageClient({ brand, models, trims }: BrandPageClientProps) {
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);
  const [filterState, setFilterState] = useState<FilterState>({});
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSelectionChange = useCallback((ids: string[]) => {
    setLoading(true);
    setSelectedModelIds(ids);
  }, []);

  const handleFilterChange = useCallback((filters: FilterState) => {
    setLoading(true);
    setFilterState(filters);
  }, []);

  useEffect(() => {
    if (loading) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setLoading(false);
      }, 300);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [loading]);

  const filteredTrims = useMemo(() => {
    let result = trims;

    if (selectedModelIds.length > 0) {
      result = result.filter((t) => selectedModelIds.includes(t.modelId));
    }

    result = result.filter((t) => trimMatchesFilters(t, filterState));

    return result;
  }, [trims, selectedModelIds, filterState]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>{brand.name}</h1>
        <ModelCarousel
          models={models}
          selectedModelIds={selectedModelIds}
          onSelectionChange={handleSelectionChange}
        />
        <div className={styles.gap} />
        <FilterRow filters={filterState} onFilterChange={handleFilterChange} />
        <div className={styles.gap} />
        <TrimFeed trims={filteredTrims} brandSlug={brand.slug} loading={loading} />
      </div>
    </main>
  );
}
