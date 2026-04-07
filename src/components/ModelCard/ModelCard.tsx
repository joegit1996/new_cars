"use client";

import { Model } from "@/types";
import styles from "./ModelCard.module.css";

interface ModelCardProps {
  model: Model;
  isSelected: boolean;
  onSelect: (modelId: string) => void;
}

function formatPrice(price: number): string {
  return price.toLocaleString("en-US");
}

export default function ModelCard({ model, isSelected, onSelect }: ModelCardProps) {
  const cardClass = isSelected
    ? `${styles.card} ${styles.cardSelected}`
    : styles.card;

  return (
    <div
      className={cardClass}
      onClick={() => onSelect(model.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(model.id);
        }
      }}
      aria-pressed={isSelected}
      aria-label={`${model.name} ${model.year} — From $${formatPrice(model.priceRange.min)}`}
    >
      {/* Image section */}
      <div className={styles.imageContainer}>
        <img
          className={styles.image}
          src={model.image}
          alt={`${model.name} ${model.year}`}
          loading="lazy"
        />
        <div className={styles.gradient} />
        <div className={styles.imageOverlay}>
          <span className={styles.modelName}>{model.name}</span>
          <span className={styles.yearBadge}>{model.year}</span>
        </div>
      </div>

      {/* Selected checkmark */}
      {isSelected && (
        <div className={styles.checkBadge}>
          <svg className={styles.checkIcon} viewBox="0 0 12 12" aria-hidden="true">
            <polyline points="2,6 5,9 10,3" />
          </svg>
        </div>
      )}

      {/* Info section */}
      <div className={styles.info}>
        <div className={styles.priceRow}>
          <span className={styles.priceFrom}>
            From ${formatPrice(model.priceRange.min)}
          </span>
          <span className={styles.priceTo}>
            to ${formatPrice(model.priceRange.max)}
          </span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.bodyTypePill}>{model.bodyType}</span>
          <span className={styles.trimCount}>
            {model.trims.length} trim{model.trims.length !== 1 ? "s" : ""} available
          </span>
        </div>
      </div>
    </div>
  );
}
