"use client";

import React from "react";
import styles from "./TrimSelector.module.css";
import { Trim } from "@/types";

interface TrimSelectorProps {
  availableTrims: Trim[];
  selectedTrimIds: string[];
  onToggleTrim: (id: string) => void;
  modelNames: Record<string, string>;
}

export default function TrimSelector({
  availableTrims,
  selectedTrimIds,
  onToggleTrim,
  modelNames,
}: TrimSelectorProps) {
  const grouped = availableTrims.reduce<Record<string, Trim[]>>((acc, trim) => {
    const modelId = trim.modelId;
    if (!acc[modelId]) acc[modelId] = [];
    acc[modelId].push(trim);
    return acc;
  }, {});

  const formatPrice = (price: number) =>
    `$${price.toLocaleString("en-US")}`;

  return (
    <div className={styles.container}>
      {Object.entries(grouped).map(([modelId, trims]) => (
        <div key={modelId} className={styles.modelGroup}>
          <span className={styles.modelName}>
            {modelNames[modelId] || modelId}
          </span>
          <div className={styles.chips}>
            {trims.map((trim) => {
              const isSelected = selectedTrimIds.includes(trim.id);
              return (
                <button
                  key={trim.id}
                  className={`${styles.chip} ${isSelected ? styles.chipSelected : ""}`}
                  onClick={() => onToggleTrim(trim.id)}
                  type="button"
                >
                  {trim.name}
                  <span className={styles.chipPrice}>
                    {formatPrice(trim.basePrice)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
