"use client";

import { useState, useCallback } from "react";
import Chip from "@/components/Chip/Chip";
import BottomSheet from "@/components/BottomSheet/BottomSheet";
import styles from "./FilterRow.module.css";

export interface FilterState {
  priceRange?: [number, number];
  year?: number;
  bodyType?: string;
  engineType?: string;
  drivetrain?: string;
  transmission?: string;
}

interface FilterRowProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

type FilterKey = keyof FilterState;

interface FilterConfig {
  key: FilterKey;
  label: string;
  options: { label: string; value: unknown }[];
}

const PRICE_RANGES: { label: string; value: [number, number] }[] = [
  { label: "Under 10K", value: [0, 10000] },
  { label: "10K - 20K", value: [10000, 20000] },
  { label: "20K - 30K", value: [20000, 30000] },
  { label: "30K+", value: [30000, Infinity] },
];

const FILTER_CONFIGS: FilterConfig[] = [
  {
    key: "priceRange",
    label: "Price Range",
    options: PRICE_RANGES.map((r) => ({ label: r.label, value: r.value })),
  },
  {
    key: "year",
    label: "Year",
    options: [
      { label: "2024", value: 2024 },
      { label: "2025", value: 2025 },
    ],
  },
  {
    key: "bodyType",
    label: "Body Type",
    options: [
      { label: "Sedan", value: "Sedan" },
      { label: "SUV", value: "SUV" },
      { label: "Coupe", value: "Coupe" },
      { label: "Convertible", value: "Convertible" },
    ],
  },
  {
    key: "engineType",
    label: "Engine Type",
    options: [
      { label: "Gasoline", value: "Gasoline" },
      { label: "Diesel", value: "Diesel" },
      { label: "Hybrid", value: "Hybrid" },
      { label: "Electric", value: "Electric" },
      { label: "Turbocharged", value: "Turbocharged" },
    ],
  },
  {
    key: "drivetrain",
    label: "Drivetrain",
    options: [
      { label: "FWD", value: "FWD" },
      { label: "RWD", value: "RWD" },
      { label: "AWD", value: "AWD" },
    ],
  },
  {
    key: "transmission",
    label: "Transmission",
    options: [
      { label: "Automatic", value: "Automatic" },
      { label: "Manual", value: "Manual" },
    ],
  },
];

function getChipLabel(config: FilterConfig, filters: FilterState): string {
  const value = filters[config.key];
  if (value === undefined) return config.label;

  if (config.key === "priceRange") {
    const pr = value as [number, number];
    const match = PRICE_RANGES.find((r) => r.value[0] === pr[0] && r.value[1] === pr[1]);
    return match ? match.label : config.label;
  }

  return String(value);
}

function isOptionSelected(config: FilterConfig, optionValue: unknown, filters: FilterState): boolean {
  const current = filters[config.key];
  if (current === undefined) return false;

  if (config.key === "priceRange") {
    const cv = current as [number, number];
    const ov = optionValue as [number, number];
    return cv[0] === ov[0] && cv[1] === ov[1];
  }

  return current === optionValue;
}

export default function FilterRow({ filters, onFilterChange }: FilterRowProps) {
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);

  const handleOptionSelect = useCallback(
    (key: FilterKey, value: unknown) => {
      const current = filters[key];
      let isAlreadySelected = false;

      if (key === "priceRange" && current !== undefined) {
        const cv = current as [number, number];
        const nv = value as [number, number];
        isAlreadySelected = cv[0] === nv[0] && cv[1] === nv[1];
      } else {
        isAlreadySelected = current === value;
      }

      const next = { ...filters };
      if (isAlreadySelected) {
        delete next[key];
      } else {
        (next as Record<string, unknown>)[key] = value;
      }
      onFilterChange(next);
      setOpenFilter(null);
    },
    [filters, onFilterChange]
  );

  const activeConfig = openFilter ? FILTER_CONFIGS.find((c) => c.key === openFilter) : null;

  return (
    <>
      <div className={styles.row}>
        {FILTER_CONFIGS.map((config) => {
          const isActive = filters[config.key] !== undefined;
          return (
            <Chip
              key={config.key}
              label={getChipLabel(config, filters)}
              active={isActive}
              onToggle={() => setOpenFilter(config.key)}
            />
          );
        })}
      </div>

      {activeConfig && (
        <BottomSheet
          isOpen={openFilter !== null}
          onClose={() => setOpenFilter(null)}
          title={activeConfig.label}
        >
          <div className={styles.options}>
            {activeConfig.options.map((option) => {
              const selected = isOptionSelected(activeConfig, option.value, filters);
              return (
                <button
                  key={option.label}
                  className={`${styles.option} ${selected ? styles.optionActive : ""}`}
                  onClick={() => handleOptionSelect(activeConfig.key, option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </BottomSheet>
      )}
    </>
  );
}
