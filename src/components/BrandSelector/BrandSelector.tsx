"use client";

import { Brand } from "@/types";
import styles from "./BrandSelector.module.css";

interface BrandSelectorProps {
  brands: Brand[];
  selectedBrandId: string | null;
  onSelectBrand: (brandId: string) => void;
}

const countryFlags: Record<string, string> = {
  Japan: "\u{1F1EF}\u{1F1F5}",
  Germany: "\u{1F1E9}\u{1F1EA}",
  "South Korea": "\u{1F1F0}\u{1F1F7}",
  "United States": "\u{1F1FA}\u{1F1F8}",
  "United Kingdom": "\u{1F1EC}\u{1F1E7}",
  Italy: "\u{1F1EE}\u{1F1F9}",
  France: "\u{1F1EB}\u{1F1F7}",
  Sweden: "\u{1F1F8}\u{1F1EA}",
  China: "\u{1F1E8}\u{1F1F3}",
  India: "\u{1F1EE}\u{1F1F3}",
};

export default function BrandSelector({
  brands,
  selectedBrandId,
  onSelectBrand,
}: BrandSelectorProps) {
  return (
    <div className={styles.section}>
      <span className={styles.label}>Browse by Brand</span>
      <div className={styles.scrollContainer}>
        {brands.map((brand) => {
          const isSelected = brand.id === selectedBrandId;
          const flag = countryFlags[brand.country] || "";
          return (
            <button
              key={brand.id}
              className={`${styles.chip} ${isSelected ? styles.chipSelected : ""}`}
              onClick={() => onSelectBrand(brand.id)}
              type="button"
            >
              {flag ? `${flag} ${brand.name}` : brand.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
