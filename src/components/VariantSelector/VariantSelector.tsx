"use client";

import { TrimVariant } from "@/types";
import styles from "./VariantSelector.module.css";

interface VariantSelectorProps {
  variants: TrimVariant[];
  activeVariantId: string;
  onSelect: (variantId: string) => void;
}

export default function VariantSelector({
  variants,
  activeVariantId,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div className={styles.scrollContainer}>
      <div className={styles.row}>
        {variants.map((v) => (
          <button
            key={v.id}
            className={`${styles.chip} ${v.id === activeVariantId ? styles.active : ""}`}
            onClick={() => onSelect(v.id)}
          >
            {v.name} - KWD {v.price.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}
