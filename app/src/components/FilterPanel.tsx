"use client";

import { useState, useCallback } from "react";
import { ChevronDown, X } from "lucide-react";

// --- Types ---

export interface FilterState {
  priceRange: [number, number];
  bodyTypes: string[];
  fuelTypes: string[];
  transmissions: string[];
  driveTypes: string[];
  seating: string[];
  specRegions: string[];
  brands: string[];
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  hideBrands?: boolean;
  availableBrands?: string[];
}

const BODY_TYPES = ["Sedan", "SUV", "Hatchback", "Coupe", "Pickup", "Van", "Convertible"];
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "PHEV", "Electric"];
const TRANSMISSIONS = ["Automatic", "Manual", "CVT"];
const DRIVE_TYPES = ["FWD", "RWD", "AWD/4WD"];
const SEATING = ["2", "5", "7", "8+"];
const SPEC_REGIONS = ["GCC", "US", "European"];

const DEFAULT_BRANDS = [
  "Toyota", "Lexus", "BMW", "Mercedes-Benz", "Chery", "Changan", "Haval", "MG",
];

const PRICE_MIN = 3000;
const PRICE_MAX = 80000;

// --- Sub-components ---

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#E2E8F0] pb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-2 text-sm font-bold text-[#1E293B]"
      >
        {title}
        <ChevronDown
          className={`w-4 h-4 text-[#64748B] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && <div className="pt-1">{children}</div>}
    </div>
  );
}

function ChipGroup({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              isActive
                ? "bg-[#1A56DB] text-white border-[#1A56DB]"
                : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1A56DB]"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function RangeSlider({
  min,
  max,
  value,
  onChange,
  step = 500,
  formatLabel,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (val: [number, number]) => void;
  step?: number;
  formatLabel?: (v: number) => string;
}) {
  const fmt = formatLabel || ((v: number) => v.toLocaleString());

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-[#64748B]">
        <span>{fmt(value[0])} KWD</span>
        <span>{fmt(value[1])} KWD</span>
      </div>
      <div className="space-y-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v <= value[1]) onChange([v, value[1]]);
          }}
          className="w-full accent-[#1A56DB]"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v >= value[0]) onChange([value[0], v]);
          }}
          className="w-full accent-[#1A56DB]"
        />
      </div>
    </div>
  );
}

// --- Main Component ---

export default function FilterPanel({
  filters,
  onChange,
  hideBrands = false,
  availableBrands,
}: FilterPanelProps) {
  const brands = availableBrands || DEFAULT_BRANDS;

  const toggleArrayValue = useCallback(
    (key: keyof FilterState, value: string) => {
      const arr = filters[key] as string[];
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      onChange({ ...filters, [key]: next });
    },
    [filters, onChange]
  );

  // Collect all active filter chips
  const activeChips: { label: string; onRemove: () => void }[] = [];

  if (
    filters.priceRange[0] !== PRICE_MIN ||
    filters.priceRange[1] !== PRICE_MAX
  ) {
    activeChips.push({
      label: `${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()} KWD`,
      onRemove: () =>
        onChange({ ...filters, priceRange: [PRICE_MIN, PRICE_MAX] }),
    });
  }

  const chipArrayKeys: { key: keyof FilterState; label: string }[] = [
    { key: "bodyTypes", label: "" },
    { key: "fuelTypes", label: "" },
    { key: "transmissions", label: "" },
    { key: "driveTypes", label: "" },
    { key: "seating", label: " seats" },
    { key: "specRegions", label: "" },
    { key: "brands", label: "" },
  ];

  for (const { key, label } of chipArrayKeys) {
    for (const val of filters[key] as string[]) {
      activeChips.push({
        label: `${val}${label}`,
        onRemove: () => toggleArrayValue(key, val),
      });
    }
  }

  const clearAll = () => {
    onChange({
      priceRange: [PRICE_MIN, PRICE_MAX],
      bodyTypes: [],
      fuelTypes: [],
      transmissions: [],
      driveTypes: [],
      seating: [],
      specRegions: [],
      brands: [],
    });
  };

  return (
    <div className="space-y-4">
      {/* Active Filters */}
      {activeChips.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1E293B]">
              Active Filters ({activeChips.length})
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-[#EF4444] hover:text-[#EF4444]/80 transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeChips.map((chip, i) => (
              <span
                key={`${chip.label}-${i}`}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#1A56DB]/10 text-[#1A56DB] text-xs rounded-md"
              >
                {chip.label}
                <button
                  onClick={chip.onRemove}
                  className="hover:text-[#EF4444] transition-colors"
                  aria-label={`Remove ${chip.label} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <CollapsibleSection title="Price Range (KWD)">
        <RangeSlider
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={filters.priceRange}
          onChange={(val) => onChange({ ...filters, priceRange: val })}
        />
      </CollapsibleSection>

      {/* Body Type */}
      <CollapsibleSection title="Body Type">
        <ChipGroup
          options={BODY_TYPES}
          selected={filters.bodyTypes}
          onToggle={(v) => toggleArrayValue("bodyTypes", v)}
        />
      </CollapsibleSection>

      {/* Fuel Type */}
      <CollapsibleSection title="Fuel Type">
        <ChipGroup
          options={FUEL_TYPES}
          selected={filters.fuelTypes}
          onToggle={(v) => toggleArrayValue("fuelTypes", v)}
        />
      </CollapsibleSection>

      {/* Transmission */}
      <CollapsibleSection title="Transmission">
        <ChipGroup
          options={TRANSMISSIONS}
          selected={filters.transmissions}
          onToggle={(v) => toggleArrayValue("transmissions", v)}
        />
      </CollapsibleSection>

      {/* Drive Type */}
      <CollapsibleSection title="Drive Type">
        <ChipGroup
          options={DRIVE_TYPES}
          selected={filters.driveTypes}
          onToggle={(v) => toggleArrayValue("driveTypes", v)}
        />
      </CollapsibleSection>

      {/* Seating */}
      <CollapsibleSection title="Seating Capacity">
        <ChipGroup
          options={SEATING}
          selected={filters.seating}
          onToggle={(v) => toggleArrayValue("seating", v)}
        />
      </CollapsibleSection>

      {/* Spec Region */}
      <CollapsibleSection title="Spec Region">
        <ChipGroup
          options={SPEC_REGIONS}
          selected={filters.specRegions}
          onToggle={(v) => toggleArrayValue("specRegions", v)}
        />
      </CollapsibleSection>

      {/* Brands */}
      {!hideBrands && (
        <CollapsibleSection title="Brand">
          <ChipGroup
            options={brands}
            selected={filters.brands}
            onToggle={(v) => toggleArrayValue("brands", v)}
          />
        </CollapsibleSection>
      )}
    </div>
  );
}

export { PRICE_MIN, PRICE_MAX };
