"use client";

import React from "react";
import styles from "./ColorFilter.module.css";
import { ColorOption } from "@/types";

interface ColorFilterProps {
  colors: ColorOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.7;
}

export default function ColorFilter({
  colors,
  selected,
  onChange,
}: ColorFilterProps) {
  const handleToggle = (colorName: string) => {
    if (selected.includes(colorName)) {
      onChange(selected.filter((c) => c !== colorName));
    } else {
      onChange([...selected, colorName]);
    }
  };

  return (
    <div className={styles.grid}>
      {colors.map((color) => {
        const isSelected = selected.includes(color.name);
        const light = isLightColor(color.hex);
        return (
          <div
            key={color.name}
            className={styles.swatchWrapper}
            onClick={() => handleToggle(color.name)}
            title={color.name}
            role="checkbox"
            aria-checked={isSelected}
            aria-label={color.name}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleToggle(color.name);
              }
            }}
          >
            <div
              className={`${styles.swatch} ${isSelected ? styles.swatchSelected : ""}`}
              style={{ backgroundColor: color.hex }}
            >
              {isSelected && (
                <svg
                  className={`${styles.checkOverlay} ${light ? styles.lightCheck : ""}`}
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 7.5L5.5 11L12 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
