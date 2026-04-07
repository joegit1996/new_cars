"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import styles from "./FilterPanel.module.css";
import { Filters, Model, BodyType, FuelType, Transmission, Drivetrain, ColorOption } from "@/types";
import TrimSelector from "./TrimSelector";
import VariantSelector from "./VariantSelector";
import PriceRangeFilter from "./PriceRangeFilter";
import MultiSelectFilter from "./MultiSelectFilter";
import ColorFilter from "./ColorFilter";
import FeatureFilter from "./FeatureFilter";

interface FilterPanelProps {
  filters: Partial<Filters>;
  onFiltersChange: (filters: Partial<Filters>) => void;
  availableModels?: Model[];
  selectedModelIds?: string[];
  isOpen?: boolean;
  onClose?: () => void;
}

const BODY_TYPE_OPTIONS: { value: BodyType; label: string }[] = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "hatchback", label: "Hatchback" },
  { value: "coupe", label: "Coupe" },
  { value: "truck", label: "Truck" },
  { value: "van", label: "Van" },
  { value: "convertible", label: "Convertible" },
  { value: "wagon", label: "Wagon" },
];

const FUEL_TYPE_OPTIONS: { value: FuelType; label: string }[] = [
  { value: "gasoline", label: "Gasoline" },
  { value: "diesel", label: "Diesel" },
  { value: "hybrid", label: "Hybrid" },
  { value: "plug-in-hybrid", label: "Plug-in Hybrid" },
  { value: "electric", label: "Electric" },
];

const TRANSMISSION_OPTIONS: { value: Transmission; label: string }[] = [
  { value: "automatic", label: "Automatic" },
  { value: "manual", label: "Manual" },
  { value: "cvt", label: "CVT" },
  { value: "dct", label: "DCT" },
];

const DRIVETRAIN_OPTIONS: { value: Drivetrain; label: string }[] = [
  { value: "FWD", label: "FWD" },
  { value: "RWD", label: "RWD" },
  { value: "AWD", label: "AWD" },
  { value: "4WD", label: "4WD" },
];

function AccordionSection({
  label,
  defaultOpen = false,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const updateHeight = useCallback(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, []);

  useEffect(() => {
    updateHeight();
  }, [open, children, updateHeight]);

  // Observe content size changes
  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver(updateHeight);
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [updateHeight]);

  return (
    <div className={styles.section}>
      <button
        className={styles.sectionHeader}
        onClick={() => setOpen(!open)}
        type="button"
        aria-expanded={open}
      >
        <span className={styles.sectionLabel}>{label}</span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        className={styles.sectionContent}
        style={{ height: open ? height : 0 }}
      >
        <div ref={contentRef} className={styles.sectionContentInner}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function FilterPanel({
  filters,
  onFiltersChange,
  availableModels = [],
  selectedModelIds = [],
  isOpen = false,
  onClose,
}: FilterPanelProps) {
  const update = (partial: Partial<Filters>) => {
    onFiltersChange({ ...filters, ...partial });
  };

  // Derive trims from selected models
  const availableTrims = useMemo(() => {
    if (selectedModelIds.length === 0) return [];
    return availableModels
      .filter((m) => selectedModelIds.includes(m.id))
      .flatMap((m) => m.trims);
  }, [availableModels, selectedModelIds]);

  // Model names lookup
  const modelNames = useMemo(() => {
    const map: Record<string, string> = {};
    availableModels.forEach((m) => {
      map[m.id] = m.name;
    });
    return map;
  }, [availableModels]);

  // Derive variants from selected trims
  const availableVariants = useMemo(() => {
    const trimIds = filters.trimIds || [];
    if (trimIds.length === 0) return [];
    return availableTrims
      .filter((t) => trimIds.includes(t.id))
      .flatMap((t) => t.variants);
  }, [availableTrims, filters.trimIds]);

  // Collect all color options from available models
  const allColors = useMemo(() => {
    const colorMap = new Map<string, ColorOption>();
    const models = availableModels.length > 0 ? availableModels : [];
    models.forEach((m) => {
      m.trims.forEach((t) => {
        t.variants.forEach((v) => {
          v.colorOptions.forEach((c) => {
            if (!colorMap.has(c.name)) {
              colorMap.set(c.name, c);
            }
          });
        });
      });
    });
    return Array.from(colorMap.values());
  }, [availableModels]);

  // Count active filters
  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.trimIds && filters.trimIds.length > 0) count += filters.trimIds.length;
    if (filters.variantIds && filters.variantIds.length > 0) count += filters.variantIds.length;
    if (filters.priceRange) count += 1;
    if (filters.bodyTypes && filters.bodyTypes.length > 0) count += filters.bodyTypes.length;
    if (filters.fuelTypes && filters.fuelTypes.length > 0) count += filters.fuelTypes.length;
    if (filters.transmissions && filters.transmissions.length > 0) count += filters.transmissions.length;
    if (filters.drivetrains && filters.drivetrains.length > 0) count += filters.drivetrains.length;
    if (filters.exteriorColors && filters.exteriorColors.length > 0) count += filters.exteriorColors.length;
    if (filters.features && filters.features.length > 0) count += filters.features.length;
    return count;
  }, [filters]);

  const handleClearAll = () => {
    onFiltersChange({
      brandId: filters.brandId,
      modelIds: filters.modelIds,
      sortBy: filters.sortBy,
    });
  };

  const showTrims = selectedModelIds.length > 0 && availableTrims.length > 0;
  const showVariants = (filters.trimIds?.length ?? 0) > 0 && availableVariants.length > 0;

  return (
    <>
      {onClose && (
        <div
          className={`${styles.mobileOverlay} ${isOpen ? styles.mobileOverlayVisible : ""}`}
          onClick={onClose}
        />
      )}
      <aside className={`${styles.panel} ${isOpen ? styles.panelOpen : ""}`}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>Filters</h2>
          {activeCount > 0 && (
            <span className={styles.badge}>{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            className={styles.clearAll}
            onClick={handleClearAll}
            type="button"
          >
            Clear All
          </button>
        )}
      </div>

      <div className={styles.sections}>
        {showTrims && (
          <AccordionSection label="Trims" defaultOpen>
            <TrimSelector
              availableTrims={availableTrims}
              selectedTrimIds={filters.trimIds || []}
              onToggleTrim={(id) => {
                const current = filters.trimIds || [];
                const next = current.includes(id)
                  ? current.filter((t) => t !== id)
                  : [...current, id];
                update({ trimIds: next });
              }}
              modelNames={modelNames}
            />
          </AccordionSection>
        )}

        {showVariants && (
          <AccordionSection label="Variants" defaultOpen>
            <VariantSelector
              availableVariants={availableVariants}
              selectedVariantIds={filters.variantIds || []}
              onToggleVariant={(id) => {
                const current = filters.variantIds || [];
                const next = current.includes(id)
                  ? current.filter((v) => v !== id)
                  : [...current, id];
                update({ variantIds: next });
              }}
            />
          </AccordionSection>
        )}

        <AccordionSection label="Price Range" defaultOpen>
          <PriceRangeFilter
            min={0}
            max={200000}
            value={filters.priceRange || [0, 200000]}
            onChange={(range) => update({ priceRange: range })}
          />
        </AccordionSection>

        <AccordionSection label="Body Type">
          <MultiSelectFilter
            label="Body Type"
            options={BODY_TYPE_OPTIONS}
            selected={filters.bodyTypes || []}
            onChange={(bodyTypes) => update({ bodyTypes: bodyTypes as BodyType[] })}
          />
        </AccordionSection>

        <AccordionSection label="Fuel Type">
          <MultiSelectFilter
            label="Fuel Type"
            options={FUEL_TYPE_OPTIONS}
            selected={filters.fuelTypes || []}
            onChange={(fuelTypes) => update({ fuelTypes: fuelTypes as FuelType[] })}
          />
        </AccordionSection>

        <AccordionSection label="Transmission">
          <MultiSelectFilter
            label="Transmission"
            options={TRANSMISSION_OPTIONS}
            selected={filters.transmissions || []}
            onChange={(transmissions) =>
              update({ transmissions: transmissions as Transmission[] })
            }
          />
        </AccordionSection>

        <AccordionSection label="Drivetrain">
          <MultiSelectFilter
            label="Drivetrain"
            options={DRIVETRAIN_OPTIONS}
            selected={filters.drivetrains || []}
            onChange={(drivetrains) =>
              update({ drivetrains: drivetrains as Drivetrain[] })
            }
          />
        </AccordionSection>

        <AccordionSection label="Exterior Color">
          <ColorFilter
            colors={allColors}
            selected={filters.exteriorColors || []}
            onChange={(exteriorColors) => update({ exteriorColors })}
          />
        </AccordionSection>

        <AccordionSection label="Features">
          <FeatureFilter
            selectedFeatures={filters.features || []}
            onChange={(features) => update({ features })}
          />
        </AccordionSection>
      </div>
    </aside>
    </>
  );
}
