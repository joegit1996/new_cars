"use client";

import React, { useState } from "react";
import { useComparison } from "@/context/ComparisonContext";
import { Listing } from "@/types";
import styles from "./page.module.css";

interface CompareButtonProps {
  listing: Listing;
}

export function CompareButton({ listing }: CompareButtonProps) {
  const { addToComparison, removeFromComparison, isInComparison } =
    useComparison();
  const inComparison = isInComparison(listing.id);

  const handleClick = () => {
    if (inComparison) {
      removeFromComparison(listing.id);
    } else {
      addToComparison(listing);
    }
  };

  return (
    <button
      type="button"
      className={inComparison ? styles.compareButtonActive : styles.compareButton}
      onClick={handleClick}
    >
      {inComparison ? "Remove from Compare" : "Add to Compare"}
    </button>
  );
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

export function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.collapsibleSection}>
      <button
        type="button"
        className={styles.collapsibleHeader}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h2 className={styles.collapsibleTitle}>{title}</h2>
        <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {isOpen && <div className={styles.collapsibleBody}>{children}</div>}
    </div>
  );
}

interface SimilarListingsCarouselProps {
  listings: Listing[];
  brandNames: Record<string, string>;
  modelNames: Record<string, string>;
  trimNames: Record<string, string>;
  variantNames: Record<string, string>;
}

export function SimilarListingsCarousel({
  listings,
  brandNames,
  modelNames,
  trimNames,
  variantNames,
}: SimilarListingsCarouselProps) {
  const { isInComparison, addToComparison, removeFromComparison } =
    useComparison();

  // Dynamic import to avoid SSR issues with Swiper - use lazy import
  const ListingCard = React.lazy(
    () => import("@/components/ListingCard/ListingCard")
  );

  const handleToggleCompare = (listingId: string) => {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;
    if (isInComparison(listingId)) {
      removeFromComparison(listingId);
    } else {
      addToComparison(listing);
    }
  };

  if (listings.length === 0) {
    return <p className={styles.noSimilar}>No similar listings available.</p>;
  }

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <div className={styles.similarGrid}>
        {listings.map((listing) => (
          <div key={listing.id} className={styles.similarCard}>
            <ListingCard
              listing={listing}
              brandName={brandNames[listing.id] || listing.brandId}
              modelName={modelNames[listing.id] || listing.modelId}
              trimName={trimNames[listing.id] || listing.trimId}
              variantName={variantNames[listing.id] || listing.variantId}
              isInComparison={isInComparison(listing.id)}
              onToggleCompare={handleToggleCompare}
            />
          </div>
        ))}
      </div>
    </React.Suspense>
  );
}
