"use client";

import React, { useState, useMemo } from "react";
import { useComparison } from "@/context/ComparisonContext";
import { ComparisonItem } from "@/types";
import styles from "./ComparisonTable.module.css";

interface SectionConfig {
  id: string;
  title: string;
  rows: RowConfig[];
}

interface RowConfig {
  label: string;
  getValue: (item: ComparisonItem) => string | number | null | undefined;
  isBestHighest?: boolean;
  isBestLowest?: boolean;
  isFeatureCheck?: boolean;
  isSavings?: boolean;
}

function formatCurrency(val: number): string {
  return "$" + val.toLocaleString();
}

function formatMpg(val: number | undefined): string {
  return val != null ? `${val} MPG` : "—";
}

function renderStars(rating: number | undefined): string {
  if (rating == null) return "—";
  return "★".repeat(rating) + "☆".repeat(Math.max(0, 5 - rating));
}

export default function ComparisonTable() {
  const { items, removeFromComparison } = useComparison();
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );
  const [showDiffsOnly, setShowDiffsOnly] = useState(false);

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Collect all unique features across all items
  const allFeatures = useMemo(() => {
    const featureSet = new Set<string>();
    items.forEach((item) => {
      item.listing.features.forEach((f) => featureSet.add(f));
      item.variant.additionalFeatures.forEach((f) => featureSet.add(f));
    });
    return Array.from(featureSet).sort();
  }, [items]);

  const hasFeature = (item: ComparisonItem, feature: string): boolean => {
    return (
      item.listing.features.includes(feature) ||
      item.variant.additionalFeatures.includes(feature)
    );
  };

  const sections: SectionConfig[] = useMemo(
    () => [
      {
        id: "price",
        title: "Price & Value",
        rows: [
          {
            label: "MSRP",
            getValue: (item) => formatCurrency(item.listing.msrp),
          },
          {
            label: "Dealer Price",
            getValue: (item) => formatCurrency(item.listing.price),
          },
          {
            label: "Savings",
            getValue: (item) => {
              const savings = item.listing.msrp - item.listing.price;
              return savings > 0 ? formatCurrency(savings) : "$0";
            },
            isSavings: true,
          },
        ],
      },
      {
        id: "performance",
        title: "Performance & Powertrain",
        rows: [
          {
            label: "Engine",
            getValue: (item) => item.listing.specs.engine,
          },
          {
            label: "Horsepower",
            getValue: (item) => item.listing.specs.horsepower,
            isBestHighest: true,
          },
          {
            label: "Torque",
            getValue: (item) => item.listing.specs.torque,
            isBestHighest: true,
          },
          {
            label: "Transmission",
            getValue: (item) => item.listing.specs.transmission.toUpperCase(),
          },
          {
            label: "Drivetrain",
            getValue: (item) => item.listing.specs.drivetrain,
          },
        ],
      },
      {
        id: "fuel",
        title: "Fuel Economy",
        rows: [
          {
            label: "City MPG",
            getValue: (item) => item.listing.specs.fuelEconomy.city,
            isBestHighest: true,
          },
          {
            label: "Highway MPG",
            getValue: (item) => item.listing.specs.fuelEconomy.highway,
            isBestHighest: true,
          },
          {
            label: "Combined MPG",
            getValue: (item) => item.listing.specs.fuelEconomy.combined,
            isBestHighest: true,
          },
        ],
      },
      {
        id: "dimensions",
        title: "Dimensions & Capacity",
        rows: [
          {
            label: "Seating Capacity",
            getValue: (item) => item.listing.specs.seatingCapacity,
          },
          {
            label: "Cargo Volume",
            getValue: (item) =>
              item.listing.specs.cargoVolume
                ? `${item.listing.specs.cargoVolume} cu ft`
                : "—",
            isBestHighest: true,
          },
          {
            label: "Curb Weight",
            getValue: (item) =>
              item.listing.specs.curbWeight
                ? `${item.listing.specs.curbWeight.toLocaleString()} lbs`
                : "—",
          },
          ...(items.some((item) => item.listing.specs.dimensions)
            ? [
                {
                  label: "Length",
                  getValue: (item: ComparisonItem) =>
                    item.listing.specs.dimensions
                      ? `${item.listing.specs.dimensions.length} in`
                      : "—",
                },
                {
                  label: "Width",
                  getValue: (item: ComparisonItem) =>
                    item.listing.specs.dimensions
                      ? `${item.listing.specs.dimensions.width} in`
                      : "—",
                },
                {
                  label: "Height",
                  getValue: (item: ComparisonItem) =>
                    item.listing.specs.dimensions
                      ? `${item.listing.specs.dimensions.height} in`
                      : "—",
                },
                {
                  label: "Wheelbase",
                  getValue: (item: ComparisonItem) =>
                    item.listing.specs.dimensions
                      ? `${item.listing.specs.dimensions.wheelbase} in`
                      : "—",
                },
                {
                  label: "Ground Clearance",
                  getValue: (item: ComparisonItem) =>
                    item.listing.specs.dimensions
                      ? `${item.listing.specs.dimensions.groundClearance} in`
                      : "—",
                },
              ]
            : []),
        ],
      },
      {
        id: "features",
        title: "Features",
        rows: allFeatures.map((feature) => ({
          label: feature,
          getValue: (item: ComparisonItem) =>
            hasFeature(item, feature) ? "yes" : "no",
          isFeatureCheck: true,
        })),
      },
      {
        id: "safety",
        title: "Safety",
        rows: [
          {
            label: "NHTSA Rating",
            getValue: (item) => item.listing.safetyRating?.nhtsa ?? null,
            isBestHighest: true,
          },
          {
            label: "IIHS Top Safety Pick",
            getValue: (item) =>
              item.listing.safetyRating?.iihsTopPick ? "yes" : "no",
            isFeatureCheck: true,
          },
        ],
      },
      {
        id: "warranty",
        title: "Warranty",
        rows: [
          {
            label: "Basic",
            getValue: (item) => item.listing.warranty.basic,
          },
          {
            label: "Powertrain",
            getValue: (item) => item.listing.warranty.powertrain,
          },
          {
            label: "Corrosion",
            getValue: (item) => item.listing.warranty.corrosion,
          },
          {
            label: "Roadside",
            getValue: (item) => item.listing.warranty.roadside,
          },
        ],
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, allFeatures]
  );

  const getBestIndex = (
    row: RowConfig,
    highest: boolean
  ): Set<number> => {
    const values = items.map((item) => {
      const val = row.getValue(item);
      if (typeof val === "number") return val;
      // Try parsing numeric from strings like "15.2 cu ft"
      if (typeof val === "string") {
        const parsed = parseFloat(val.replace(/[^0-9.-]/g, ""));
        if (!isNaN(parsed)) return parsed;
      }
      return null;
    });

    const numericValues = values.filter((v) => v !== null) as number[];
    if (numericValues.length === 0) return new Set();

    const best = highest
      ? Math.max(...numericValues)
      : Math.min(...numericValues);

    const bestIndices = new Set<number>();
    values.forEach((v, i) => {
      if (v === best) bestIndices.add(i);
    });
    // Only highlight if not all the same
    if (bestIndices.size === values.length) return new Set();
    return bestIndices;
  };

  const isRowIdentical = (row: RowConfig): boolean => {
    if (items.length <= 1) return true;
    const values = items.map((item) => String(row.getValue(item) ?? ""));
    return values.every((v) => v === values[0]);
  };

  const colCount = items.length + 1; // label col + car cols

  return (
    <div>
      <div className={styles.toggleBar}>
        <button
          className={`${styles.toggleBtn} ${
            showDiffsOnly ? styles.toggleBtnActive : ""
          }`}
          onClick={() => setShowDiffsOnly(!showDiffsOnly)}
        >
          Show Differences Only
        </button>
      </div>

      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead className={styles.stickyHeader}>
            <tr className={styles.headerRow}>
              <td className={styles.labelCol}></td>
              {items.map((item) => (
                <td key={item.listing.id} className={styles.carCol}>
                  <img
                    src={item.listing.images[0] || item.model.image}
                    alt={`${item.brand.name} ${item.model.name}`}
                    className={styles.carImage}
                  />
                  <div className={styles.carTitle}>
                    {item.listing.year} {item.brand.name} {item.model.name}{" "}
                    {item.trim.name}
                  </div>
                  <div className={styles.carVariant}>{item.variant.name}</div>
                  <div className={styles.carPrice}>
                    {formatCurrency(item.listing.price)}
                  </div>
                  <button
                    className={styles.removeButton}
                    onClick={() => removeFromComparison(item.listing.id)}
                  >
                    Remove
                  </button>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => {
              const isCollapsed = collapsedSections.has(section.id);
              const visibleRows = showDiffsOnly
                ? section.rows.filter((row) => !isRowIdentical(row))
                : section.rows;

              return (
                <React.Fragment key={section.id}>
                  <tr
                    className={styles.sectionHeader}
                    onClick={() => toggleSection(section.id)}
                  >
                    <td colSpan={colCount}>
                      <div className={styles.sectionTitle}>
                        <span
                          className={`${styles.chevron} ${
                            !isCollapsed ? styles.chevronOpen : ""
                          }`}
                        >
                          ▶
                        </span>
                        {section.title}
                      </div>
                    </td>
                  </tr>
                  {!isCollapsed &&
                    visibleRows.map((row) => {
                      const bestIndices = row.isBestHighest
                        ? getBestIndex(row, true)
                        : row.isBestLowest
                        ? getBestIndex(row, false)
                        : new Set<number>();

                      return (
                        <tr key={row.label} className={styles.dataRow}>
                          <td className={styles.labelCol}>{row.label}</td>
                          {items.map((item, idx) => {
                            const val = row.getValue(item);
                            const isBest = bestIndices.has(idx);

                            if (row.isFeatureCheck) {
                              return (
                                <td
                                  key={item.listing.id}
                                  className={
                                    val === "yes" ? styles.check : styles.dash
                                  }
                                >
                                  {val === "yes" ? "✓" : "—"}
                                </td>
                              );
                            }

                            if (row.isSavings) {
                              const savings =
                                item.listing.msrp - item.listing.price;
                              return (
                                <td
                                  key={item.listing.id}
                                  className={
                                    savings > 0 ? styles.savings : undefined
                                  }
                                >
                                  {savings > 0
                                    ? formatCurrency(savings)
                                    : "$0"}
                                </td>
                              );
                            }

                            // For NHTSA rating, render stars
                            if (
                              row.label === "NHTSA Rating" &&
                              typeof val === "number"
                            ) {
                              return (
                                <td
                                  key={item.listing.id}
                                  className={
                                    isBest ? styles.bestValue : undefined
                                  }
                                >
                                  {renderStars(val)}
                                </td>
                              );
                            }

                            let displayVal: string;
                            if (val == null) {
                              displayVal = "—";
                            } else if (typeof val === "number") {
                              displayVal = val.toLocaleString();
                            } else {
                              displayVal = String(val);
                            }

                            return (
                              <td
                                key={item.listing.id}
                                className={
                                  isBest ? styles.bestValue : undefined
                                }
                              >
                                {displayVal}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
