"use client";

import styles from "./Chip.module.css";

interface ChipProps {
  label: string;
  active?: boolean;
  onToggle?: () => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

export default function Chip({ label, active = false, onToggle, onRemove, showRemove = false }: ChipProps) {
  return (
    <button
      className={`${styles.chip} ${active ? styles.active : ""}`}
      onClick={onToggle}
      type="button"
    >
      <span className={styles.label}>{label}</span>
      {showRemove && (
        <span
          className={styles.remove}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          role="button"
          aria-label={`Remove ${label}`}
        >
          &times;
        </span>
      )}
    </button>
  );
}
