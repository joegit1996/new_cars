"use client";

import { ColorOption } from "@/types";
import styles from "./ColorSwatches.module.css";

interface ColorSwatchesProps {
  colors: ColorOption[];
  activeColor: string;
  onSelect: (hex: string) => void;
}

export default function ColorSwatches({
  colors,
  activeColor,
  onSelect,
}: ColorSwatchesProps) {
  const activeName = colors.find((c) => c.hex === activeColor)?.name || "";

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        {colors.map((color) => (
          <button
            key={color.hex}
            className={`${styles.swatch} ${color.hex === activeColor ? styles.active : ""}`}
            style={{ backgroundColor: color.hex }}
            onClick={() => onSelect(color.hex)}
            aria-label={color.name}
          />
        ))}
      </div>
      <span className={styles.colorName}>{activeName}</span>
    </div>
  );
}
