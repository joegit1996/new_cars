"use client";

import React from "react";
import Link from "next/link";
import styles from "./ListingCard.module.css";
import { Listing } from "@/types";

interface ListingCardProps {
  listing: Listing;
  brandName: string;
  modelName: string;
  trimName: string;
  variantName: string;
  isInComparison: boolean;
  onToggleCompare: (listingId: string) => void;
}

const BADGE_MAP: Record<string, { label: string; className: string }> = {
  "in-stock": { label: "In Stock", className: styles.badgeInStock },
  "in-transit": { label: "In Transit", className: styles.badgeInTransit },
  "build-to-order": { label: "Build to Order", className: styles.badgeBuildToOrder },
};

function formatPrice(price: number): string {
  return `$${price.toLocaleString("en-US")}`;
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 7L6 10L11 4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ListingCard({
  listing,
  brandName,
  modelName,
  trimName,
  variantName,
  isInComparison,
  onToggleCompare,
}: ListingCardProps) {
  const badge = BADGE_MAP[listing.status];
  const showMsrp = listing.price !== listing.msrp;

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleCompare(listing.id);
  };

  const transmissionLabel =
    listing.specs.transmission === "cvt"
      ? "CVT"
      : listing.specs.transmission === "dct"
        ? "DCT"
        : listing.specs.transmission === "automatic"
          ? "Auto"
          : "Manual";

  return (
    <Link href={`/listing/${listing.id}`} className={styles.card}>
      <div className={styles.imageArea}>
        <img
          className={styles.image}
          src={listing.images[0] || "https://placehold.co/600x400/e9ebf2/324575?text=No+Image"}
          alt={`${listing.year} ${brandName} ${modelName}`}
        />
        <div
          className={styles.colorDot}
          style={{ backgroundColor: listing.color.exterior.hex }}
        />
        {badge && (
          <span className={`${styles.badge} ${badge.className}`}>
            {badge.label}
          </span>
        )}
        <button
          className={`${styles.compareBtn} ${isInComparison ? styles.compareBtnChecked : ""}`}
          onClick={handleCompareClick}
          type="button"
          aria-label={isInComparison ? "Remove from comparison" : "Add to comparison"}
        >
          {isInComparison ? (
            <CheckIcon />
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="10" height="10" rx="2" stroke="var(--neutral_400)" strokeWidth="1.5" fill="none" />
            </svg>
          )}
        </button>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>
          {listing.year} {brandName} {modelName} {trimName}
        </h3>
        <p className={styles.variantName}>{variantName}</p>

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(listing.price)}</span>
          {showMsrp && (
            <span className={styles.msrp}>{formatPrice(listing.msrp)}</span>
          )}
        </div>

        <div className={styles.specsRow}>
          <span className={styles.specPill}>{listing.specs.horsepower} HP</span>
          <span className={styles.specPill}>{listing.specs.fuelEconomy.combined} MPG</span>
          <span className={styles.specPill}>{listing.specs.drivetrain}</span>
          <span className={styles.specPill}>{transmissionLabel}</span>
        </div>

        <p className={styles.colors}>
          <span>Ext:</span>
          <span
            className={styles.colorDotSmall}
            style={{ backgroundColor: listing.color.exterior.hex }}
          />
          <span>{listing.color.exterior.name}</span>
          <span className={styles.colorSeparator}>&bull;</span>
          <span>Int: {listing.color.interior}</span>
        </p>

        <p className={styles.dealer}>
          {listing.dealer.name} &#11088; {listing.dealer.rating}
        </p>
      </div>
    </Link>
  );
}
