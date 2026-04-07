"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useComparison } from "@/context/ComparisonContext";
import { brands } from "@/data/brands";
import ComparisonTable from "@/components/ComparisonTable/ComparisonTable";
import styles from "./page.module.css";

export default function ComparePage() {
  const { items, clearComparison } = useComparison();
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  const selectedBrandData = brands.find((b) => b.id === selectedBrand);
  const modelsForBrand = selectedBrandData?.models ?? [];

  const handleBrowse = () => {
    if (selectedBrand) {
      router.push(`/?brand=${selectedBrand}`);
    } else {
      router.push("/");
    }
  };

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Compare Vehicles</h1>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M5 17H3v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2" />
              <path d="M9 17h6" />
              <path d="M14 6l-4 -4" />
              <path d="M10 6l4 -4" />
            </svg>
          </div>
          <h2 className={styles.emptyTitle}>No vehicles to compare</h2>
          <p className={styles.emptyText}>
            Add vehicles from the showroom to start comparing.
          </p>
          <Link href="/" className={styles.browseLink}>
            Browse Showroom
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Compare Vehicles</h1>
        <button className={styles.clearBtn} onClick={clearComparison}>
          Clear All
        </button>
      </div>

      <ComparisonTable />

      {items.length < 4 && (
        <div className={styles.addSection}>
          <h3 className={styles.addSectionTitle}>Add Another Vehicle</h3>
          <div className={styles.selectorRow}>
            <select
              className={styles.select}
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setSelectedModel("");
              }}
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <select
              className={styles.select}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedBrand}
            >
              <option value="">Select Model</option>
              {modelsForBrand.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <button className={styles.goBtn} onClick={handleBrowse}>
              Browse Showroom
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
