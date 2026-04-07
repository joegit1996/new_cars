"use client";

import React, { useMemo } from "react";
import styles from "./ListingsFeed.module.css";
import { Listing, Brand } from "@/types";
import ListingCard from "@/components/ListingCard/ListingCard";

interface ListingsFeedProps {
  listings: Listing[];
  brands: Brand[];
  isInComparison: (id: string) => boolean;
  onToggleCompare: (id: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

function SearchIcon() {
  return (
    <svg
      className={styles.emptyIcon}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="22" cy="22" r="12" stroke="currentColor" strokeWidth="3" />
      <path d="M31 31L40 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function ListingsFeed({
  listings,
  brands,
  isInComparison,
  onToggleCompare,
  sortBy,
  onSortChange,
}: ListingsFeedProps) {
  // Build a lookup map for brand/model/trim/variant names
  const nameMap = useMemo(() => {
    const map: Record<
      string,
      { brandName: string; modelName: string; trimName: string; variantName: string }
    > = {};
    for (const brand of brands) {
      for (const model of brand.models) {
        for (const trim of model.trims) {
          for (const variant of trim.variants) {
            // Build a composite key from IDs
            const key = `${brand.id}|${model.id}|${trim.id}|${variant.id}`;
            map[key] = {
              brandName: brand.name,
              modelName: model.name,
              trimName: trim.name,
              variantName: variant.name,
            };
          }
        }
      }
    }
    return map;
  }, [brands]);

  const resolveNames = (listing: Listing) => {
    const key = `${listing.brandId}|${listing.modelId}|${listing.trimId}|${listing.variantId}`;
    return (
      nameMap[key] || {
        brandName: listing.brandId,
        modelName: listing.modelId,
        trimName: listing.trimId,
        variantName: listing.variantId,
      }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <p className={styles.count}>
          {listings.length} vehicle{listings.length !== 1 ? "s" : ""} found
        </p>
        <select
          className={styles.sortSelect}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="hp-desc">Horsepower</option>
          <option value="mpg-desc">Best MPG</option>
        </select>
      </div>

      {listings.length === 0 ? (
        <div className={styles.empty}>
          <SearchIcon />
          <p className={styles.emptyText}>No vehicles match your filters</p>
          <button
            className={styles.clearBtn}
            type="button"
            onClick={() => onSortChange("__clear__")}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {listings.map((listing, index) => {
            const names = resolveNames(listing);
            return (
              <div
                key={listing.id}
                className={styles.gridItem}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ListingCard
                  listing={listing}
                  brandName={names.brandName}
                  modelName={names.modelName}
                  trimName={names.trimName}
                  variantName={names.variantName}
                  isInComparison={isInComparison(listing.id)}
                  onToggleCompare={onToggleCompare}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
