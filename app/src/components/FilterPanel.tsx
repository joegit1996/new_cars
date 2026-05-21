"use client";

import { useState, useCallback } from "react";
import { ChevronDown, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import DualRangeSlider from "./DualRangeSlider";
import { BodyTypeIcon } from "./BodyTypeIcon";

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
  labels,
  icons,
}: {
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
  labels?: Record<string, string>;
  icons?: Record<string, React.ReactNode>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = selected.includes(option);
        const icon = icons?.[option];
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              isActive
                ? "bg-[#1A56DB] text-white border-[#1A56DB]"
                : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1A56DB]"
            }`}
          >
            {icon && <span className="shrink-0">{icon}</span>}
            <span>{labels?.[option] ?? option}</span>
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
  unit,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (val: [number, number]) => void;
  step?: number;
  formatLabel?: (v: number) => string;
  unit: string;
}) {
  const { dir } = useLanguage();
  const fmt = formatLabel || ((v: number) => v.toLocaleString());

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-[#64748B]">
        <span>{fmt(value[0])} {unit}</span>
        <span>{fmt(value[1])} {unit}</span>
      </div>
      <DualRangeSlider
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        step={step}
        minGap={step}
        dir={dir}
        variant="light"
      />
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
  const { t, ln: _ln } = useLanguage();

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

  const bodyLabels = t.bodyTypes as Record<string, string>;
  const fuelLabels = t.fuelTypes as Record<string, string>;
  const transmissionLabels = t.transmissions as Record<string, string>;
  const driveLabels = t.driveTypes as Record<string, string>;
  const brandLabels: Record<string, string> = Object.fromEntries(
    brands.map((b) => [b, _ln.brand(b)])
  );

  // Collect all active filter chips
  const activeChips: { label: string; onRemove: () => void }[] = [];

  if (
    filters.priceRange[0] !== PRICE_MIN ||
    filters.priceRange[1] !== PRICE_MAX
  ) {
    activeChips.push({
      label: `${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()} ${t.common.kwd}`,
      onRemove: () =>
        onChange({ ...filters, priceRange: [PRICE_MIN, PRICE_MAX] }),
    });
  }

  const labelFor = (key: keyof FilterState, val: string): string => {
    if (key === "bodyTypes") return bodyLabels[val] ?? val;
    if (key === "fuelTypes") return fuelLabels[val] ?? val;
    if (key === "transmissions") return transmissionLabels[val] ?? val;
    if (key === "driveTypes") return driveLabels[val] ?? val;
    if (key === "seating") return `${val}${t.browse.seats}`;
    if (key === "brands") return brandLabels[val] ?? val;
    return val;
  };

  const chipArrayKeys: (keyof FilterState)[] = [
    "bodyTypes",
    "fuelTypes",
    "transmissions",
    "driveTypes",
    "seating",
    "specRegions",
    "brands",
  ];

  for (const key of chipArrayKeys) {
    for (const val of filters[key] as string[]) {
      activeChips.push({
        label: labelFor(key, val),
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
              {t.browse.activeFilters} ({activeChips.length})
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-[#EF4444] hover:text-[#EF4444]/80 transition-colors"
            >
              {t.browse.clearAll}
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
                  aria-label={t.common.clear}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Brands (top of filter list) */}
      {!hideBrands && (
        <CollapsibleSection title={t.browse.brand}>
          <ChipGroup
            options={brands}
            selected={filters.brands}
            onToggle={(v) => toggleArrayValue("brands", v)}
            labels={brandLabels}
          />
        </CollapsibleSection>
      )}

      {/* Price Range */}
      <CollapsibleSection title={t.browse.priceRange}>
        <RangeSlider
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={filters.priceRange}
          onChange={(val) => onChange({ ...filters, priceRange: val })}
          unit={t.common.kwd}
        />
      </CollapsibleSection>

      {/* Body Type */}
      <CollapsibleSection title={t.browse.bodyType}>
        <ChipGroup
          options={BODY_TYPES}
          selected={filters.bodyTypes}
          onToggle={(v) => toggleArrayValue("bodyTypes", v)}
          labels={bodyLabels}
          icons={Object.fromEntries(BODY_TYPES.map((bt) => [bt, <BodyTypeIcon key={bt} type={bt} className="w-7 h-4" />]))}
        />
      </CollapsibleSection>

      {/* Fuel Type */}
      <CollapsibleSection title={t.browse.fuelType}>
        <ChipGroup
          options={FUEL_TYPES}
          selected={filters.fuelTypes}
          onToggle={(v) => toggleArrayValue("fuelTypes", v)}
          labels={fuelLabels}
        />
      </CollapsibleSection>

      {/* Transmission */}
      <CollapsibleSection title={t.browse.transmission}>
        <ChipGroup
          options={TRANSMISSIONS}
          selected={filters.transmissions}
          onToggle={(v) => toggleArrayValue("transmissions", v)}
          labels={transmissionLabels}
        />
      </CollapsibleSection>

      {/* Drive Type */}
      <CollapsibleSection title={t.browse.driveType}>
        <ChipGroup
          options={DRIVE_TYPES}
          selected={filters.driveTypes}
          onToggle={(v) => toggleArrayValue("driveTypes", v)}
          labels={driveLabels}
        />
      </CollapsibleSection>

      {/* Seating */}
      <CollapsibleSection title={t.browse.seating}>
        <ChipGroup
          options={SEATING}
          selected={filters.seating}
          onToggle={(v) => toggleArrayValue("seating", v)}
        />
      </CollapsibleSection>

      {/* Spec Region */}
      <CollapsibleSection title={t.browse.specRegion}>
        <ChipGroup
          options={SPEC_REGIONS}
          selected={filters.specRegions}
          onToggle={(v) => toggleArrayValue("specRegions", v)}
        />
      </CollapsibleSection>
    </div>
  );
}

export { PRICE_MIN, PRICE_MAX };
