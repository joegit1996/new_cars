"use client";

import React from "react";
import styles from "./VariantSelector.module.css";
import { Variant } from "@/types";

interface VariantSelectorProps {
  availableVariants: Variant[];
  selectedVariantIds: string[];
  onToggleVariant: (id: string) => void;
}

export default function VariantSelector({
  availableVariants,
  selectedVariantIds,
  onToggleVariant,
}: VariantSelectorProps) {
  const formatPrice = (price: number) =>
    `$${price.toLocaleString("en-US")}`;

  return (
    <div className={styles.container}>
      {availableVariants.map((variant) => {
        const isSelected = selectedVariantIds.includes(variant.id);
        return (
          <button
            key={variant.id}
            className={`${styles.chip} ${isSelected ? styles.chipSelected : ""}`}
            onClick={() => onToggleVariant(variant.id)}
            type="button"
          >
            {variant.name}
            <span className={styles.chipPrice}>
              {formatPrice(variant.price)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
