"use client";

import React from "react";
import styles from "./ActiveFilters.module.css";
import { Filters } from "@/types";

interface ActiveFiltersProps {
  filters: Partial<Filters>;
  onRemoveFilter: (filterKey: string, value?: string) => void;
  onClearAll: () => void;
}

const BODY_TYPE_LABELS: Record<string, string> = {
  sedan: "Sedan",
  suv: "SUV",
  hatchback: "Hatchback",
  coupe: "Coupe",
  truck: "Truck",
  van: "Van",
  convertible: "Convertible",
  wagon: "Wagon",
};

const FUEL_TYPE_LABELS: Record<string, string> = {
  gasoline: "Gasoline",
  diesel: "Diesel",
  hybrid: "Hybrid",
  "plug-in-hybrid": "Plug-in Hybrid",
  electric: "Electric",
};

const TRANSMISSION_LABELS: Record<string, string> = {
  automatic: "Automatic",
  manual: "Manual",
  cvt: "CVT",
  dct: "DCT",
};

function formatPriceShort(price: number): string {
  if (price >= 1000) {
    return `$${Math.round(price / 1000)}K`;
  }
  return `$${price}`;
}

function XIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4L10 10M10 4L4 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ActiveFilters({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersProps) {
  const chips: { key: string; value?: string; label: string }[] = [];

  // Trim chips
  if (filters.trimIds && filters.trimIds.length > 0) {
    filters.trimIds.forEach((id) => {
      chips.push({ key: "trimIds", value: id, label: `Trim: ${id}` });
    });
  }

  // Variant chips
  if (filters.variantIds && filters.variantIds.length > 0) {
    filters.variantIds.forEach((id) => {
      chips.push({ key: "variantIds", value: id, label: `Variant: ${id}` });
    });
  }

  // Price range
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    chips.push({
      key: "priceRange",
      label: `Price: ${formatPriceShort(min)}-${formatPriceShort(max)}`,
    });
  }

  // Body types
  if (filters.bodyTypes && filters.bodyTypes.length > 0) {
    filters.bodyTypes.forEach((bt) => {
      chips.push({
        key: "bodyTypes",
        value: bt,
        label: `Body: ${BODY_TYPE_LABELS[bt] || bt}`,
      });
    });
  }

  // Fuel types
  if (filters.fuelTypes && filters.fuelTypes.length > 0) {
    filters.fuelTypes.forEach((ft) => {
      chips.push({
        key: "fuelTypes",
        value: ft,
        label: `Fuel: ${FUEL_TYPE_LABELS[ft] || ft}`,
      });
    });
  }

  // Transmissions
  if (filters.transmissions && filters.transmissions.length > 0) {
    filters.transmissions.forEach((t) => {
      chips.push({
        key: "transmissions",
        value: t,
        label: `Trans: ${TRANSMISSION_LABELS[t] || t}`,
      });
    });
  }

  // Drivetrains
  if (filters.drivetrains && filters.drivetrains.length > 0) {
    filters.drivetrains.forEach((d) => {
      chips.push({ key: "drivetrains", value: d, label: `Drive: ${d}` });
    });
  }

  // Exterior colors
  if (filters.exteriorColors && filters.exteriorColors.length > 0) {
    filters.exteriorColors.forEach((c) => {
      chips.push({ key: "exteriorColors", value: c, label: `Color: ${c}` });
    });
  }

  // Features
  if (filters.features && filters.features.length > 0) {
    filters.features.forEach((f) => {
      chips.push({ key: "features", value: f, label: f });
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className={styles.container}>
      {chips.map((chip, i) => (
        <div key={`${chip.key}-${chip.value || i}`} className={styles.chip}>
          <span className={styles.chipLabel}>{chip.label}</span>
          <button
            className={styles.chipRemove}
            onClick={() => onRemoveFilter(chip.key, chip.value)}
            type="button"
            aria-label={`Remove ${chip.label}`}
          >
            <XIcon />
          </button>
        </div>
      ))}
      <button
        className={styles.clearAll}
        onClick={onClearAll}
        type="button"
      >
        Clear All
      </button>
    </div>
  );
}
