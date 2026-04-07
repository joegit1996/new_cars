"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useComparison } from "@/context/ComparisonContext";
import styles from "./ComparisonBar.module.css";

export default function ComparisonBar() {
  const { items, removeFromComparison } = useComparison();
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);
  const prevCountRef = useRef(0);

  useEffect(() => {
    const count = items.length;
    const prevCount = prevCountRef.current;

    if (count > 0 && prevCount === 0) {
      setHiding(false);
      setVisible(true);
    } else if (count === 0 && prevCount > 0) {
      setHiding(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setHiding(false);
      }, 500);
      return () => clearTimeout(timer);
    }

    prevCountRef.current = count;
  }, [items.length]);

  if (!visible) return null;

  const emptySlots = Math.max(0, 4 - items.length);

  return (
    <div className={`${styles.bar} ${hiding ? styles.barHiding : ""}`}>
      <div className={styles.container}>
        <div className={styles.slots}>
          {items.map((item) => (
            <div key={item.listing.id} className={styles.slot}>
              <img
                src={item.listing.images[0] || item.model.image}
                alt={`${item.brand.name} ${item.model.name}`}
                className={styles.thumbnail}
              />
              <span className={styles.carName}>
                {item.brand.name} {item.model.name}
              </span>
              <button
                className={styles.removeBtn}
                onClick={() => removeFromComparison(item.listing.id)}
                aria-label={`Remove ${item.brand.name} ${item.model.name}`}
              >
                ×
              </button>
            </div>
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <div key={`empty-${i}`} className={styles.emptySlot}>
              +
            </div>
          ))}
        </div>
        <div className={styles.ctaArea}>
          {items.length >= 2 ? (
            <Link href="/compare" className={styles.compareBtn}>
              Compare ({items.length})
            </Link>
          ) : (
            <span
              className={`${styles.compareBtn} ${styles.compareBtnDisabled}`}
            >
              Compare ({items.length})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
