"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./FeatureFilter.module.css";
import MultiSelectFilter from "./MultiSelectFilter";

interface FeatureFilterProps {
  selectedFeatures: string[];
  onChange: (features: string[]) => void;
}

const FEATURE_GROUPS: Record<string, string[]> = {
  Safety: [
    "Adaptive Cruise Control",
    "Blind Spot Monitor",
    "Lane Keep Assist",
    "360 Camera",
    "Auto Emergency Braking",
  ],
  "Comfort & Convenience": [
    "Heated Seats",
    "Ventilated Seats",
    "Leather Seats",
    "Sunroof/Moonroof",
    "Remote Start",
  ],
  Technology: [
    "Apple CarPlay",
    "Android Auto",
    "Navigation",
    "Head-Up Display",
    "Wireless Charging",
  ],
};

function SubAccordion({
  label,
  features,
  selectedFeatures,
  onChange,
}: {
  label: string;
  features: string[];
  selectedFeatures: string[];
  onChange: (features: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const updateHeight = useCallback(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, []);

  useEffect(() => {
    updateHeight();
  }, [open, selectedFeatures, updateHeight]);

  const options = features.map((f) => ({
    value: f,
    label: f,
  }));

  const selectedInGroup = selectedFeatures.filter((f) =>
    features.includes(f)
  );

  const handleChange = (newSelected: string[]) => {
    const otherSelected = selectedFeatures.filter(
      (f) => !features.includes(f)
    );
    onChange([...otherSelected, ...newSelected]);
  };

  return (
    <div className={styles.subSection}>
      <button
        className={styles.subHeader}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className={styles.subLabel}>
          {label}
          {selectedInGroup.length > 0 && ` (${selectedInGroup.length})`}
        </span>
        <svg
          className={`${styles.subChevron} ${open ? styles.subChevronOpen : ""}`}
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 5L7 9L11 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        className={styles.subContent}
        style={{ height: open ? height : 0 }}
      >
        <div ref={contentRef} className={styles.subContentInner}>
          <MultiSelectFilter
            label={label}
            options={options}
            selected={selectedInGroup}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

export default function FeatureFilter({
  selectedFeatures,
  onChange,
}: FeatureFilterProps) {
  return (
    <div className={styles.container}>
      {Object.entries(FEATURE_GROUPS).map(([group, features]) => (
        <SubAccordion
          key={group}
          label={group}
          features={features}
          selectedFeatures={selectedFeatures}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
