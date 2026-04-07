"use client";

import { useState, useCallback, useMemo } from "react";
import { brands } from "@/data/brands";
import { listings } from "@/data/listings";
import { Listing } from "@/types";
import BrandSelector from "@/components/BrandSelector/BrandSelector";
import ModelCarousel from "@/components/ModelCarousel/ModelCarousel";
import ActiveFilters from "@/components/ActiveFilters/ActiveFilters";
import FilterPanel from "@/components/Filters/FilterPanel";
import ListingsFeed from "@/components/ListingsFeed/ListingsFeed";
import { useFilters } from "@/hooks/useFilters";
import { useComparison } from "@/context/ComparisonContext";
import styles from "./page.module.css";

export default function Home() {
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const selectedBrand = brands.find((b) => b.id === selectedBrandId);

  const {
    filters,
    setFilter,
    clearFilter,
    clearAll,
    filteredListings,
  } = useFilters(selectedBrandId, selectedModelIds);

  const { addToComparison, removeFromComparison, isInComparison } = useComparison();

  const [sortBy, setSortBy] = useState<string>("price-asc");

  // Apply sort via filter
  const sortedListings = useMemo(() => {
    // filteredListings already applies sortBy from filters, so we sync it
    return filteredListings;
  }, [filteredListings]);

  // Keep sortBy in sync with filters
  const handleSortChange = useCallback(
    (sort: string) => {
      if (sort === "__clear__") {
        clearAll();
        return;
      }
      setSortBy(sort);
      setFilter({ sortBy: sort as typeof filters.sortBy });
    },
    [clearAll, setFilter]
  );

  const handleSelectBrand = (id: string) => {
    if (id === selectedBrandId) {
      setSelectedBrandId(null);
      setSelectedModelIds([]);
    } else {
      setSelectedBrandId(id);
      setSelectedModelIds([]);
    }
  };

  const handleToggleModel = (modelId: string) => {
    setSelectedModelIds((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleToggleCompare = useCallback(
    (listingId: string) => {
      if (isInComparison(listingId)) {
        removeFromComparison(listingId);
      } else {
        const listing = listings.find((l: Listing) => l.id === listingId);
        if (listing) {
          addToComparison(listing);
        }
      }
    },
    [isInComparison, removeFromComparison, addToComparison]
  );

  const handleRemoveFilter = useCallback(
    (filterKey: string, value?: string) => {
      clearFilter(filterKey as keyof typeof filters, value);
    },
    [clearFilter]
  );

  const handleClearAll = useCallback(() => {
    clearAll();
  }, [clearAll]);

  // Check if there are active filters (beyond brand/model/sort)
  const hasActiveFilters =
    (filters.trimIds && filters.trimIds.length > 0) ||
    (filters.variantIds && filters.variantIds.length > 0) ||
    filters.priceRange !== undefined ||
    (filters.bodyTypes && filters.bodyTypes.length > 0) ||
    (filters.fuelTypes && filters.fuelTypes.length > 0) ||
    (filters.transmissions && filters.transmissions.length > 0) ||
    (filters.drivetrains && filters.drivetrains.length > 0) ||
    (filters.exteriorColors && filters.exteriorColors.length > 0) ||
    (filters.features && filters.features.length > 0);

  // Count active filters for the badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.trimIds) count += filters.trimIds.length;
    if (filters.variantIds) count += filters.variantIds.length;
    if (filters.priceRange) count += 1;
    if (filters.bodyTypes) count += filters.bodyTypes.length;
    if (filters.fuelTypes) count += filters.fuelTypes.length;
    if (filters.transmissions) count += filters.transmissions.length;
    if (filters.drivetrains) count += filters.drivetrains.length;
    if (filters.exteriorColors) count += filters.exteriorColors.length;
    if (filters.features) count += filters.features.length;
    return count;
  }, [filters]);

  const availableModels = selectedBrand ? selectedBrand.models : [];

  return (
    <div className={styles.page}>
      <BrandSelector
        brands={brands}
        selectedBrandId={selectedBrandId}
        onSelectBrand={handleSelectBrand}
      />

      {selectedBrand && (
        <ModelCarousel
          models={selectedBrand.models}
          selectedModelIds={selectedModelIds}
          onToggleModel={handleToggleModel}
        />
      )}

      {hasActiveFilters && (
        <ActiveFilters
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAll}
        />
      )}

      <div className={styles.mainLayout}>
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilter}
          availableModels={availableModels}
          selectedModelIds={selectedModelIds}
          isOpen={filterPanelOpen}
          onClose={() => setFilterPanelOpen(false)}
        />

        <ListingsFeed
          listings={sortedListings}
          brands={brands}
          isInComparison={isInComparison}
          onToggleCompare={handleToggleCompare}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Mobile filter toggle button */}
      <button
        className={styles.filterToggle}
        type="button"
        onClick={() => setFilterPanelOpen(!filterPanelOpen)}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4H16M5 9H13M7 14H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Filters
        {activeFilterCount > 0 && (
          <span className={styles.filterToggleBadge}>{activeFilterCount}</span>
        )}
      </button>
    </div>
  );
}
