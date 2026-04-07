import React from "react";
import styles from "./Skeleton.module.css";

interface SkeletonProps {
  variant: "line" | "card" | "circle" | "image";
  width?: string;
  height?: string;
  count?: number;
  className?: string;
}

export default function Skeleton({
  variant,
  width,
  height,
  count = 1,
  className,
}: SkeletonProps) {
  const variantClass = styles[variant];
  const baseStyle: React.CSSProperties = {};
  if (width) baseStyle.width = width;
  if (height) baseStyle.height = height;

  if (variant === "line" && count > 1) {
    return (
      <div className={styles.lineGroup}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${styles.skeleton} ${variantClass} ${className || ""}`}
            style={{
              ...baseStyle,
              width: i === count - 1 ? "60%" : width || "100%",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${styles.skeleton} ${variantClass} ${className || ""}`}
      style={baseStyle}
    />
  );
}

/* ─── Preset: ModelCard Skeleton ────────────────────────── */
export function ModelCardSkeleton() {
  return (
    <div className={styles.modelCardSkeleton}>
      <div className={styles.modelCardImage} />
      <div className={styles.modelCardInfo}>
        <div className={`${styles.skeleton} ${styles.line}`} />
        <div
          className={`${styles.skeleton} ${styles.line}`}
          style={{ width: "80%" }}
        />
        <div
          className={`${styles.skeleton} ${styles.line}`}
          style={{ width: "60%" }}
        />
      </div>
    </div>
  );
}

/* ─── Preset: ListingCard Skeleton ──────────────────────── */
export function ListingCardSkeleton() {
  return (
    <div className={styles.listingCardSkeleton}>
      <div className={styles.listingCardImage} />
      <div className={styles.listingCardBody}>
        <div className={`${styles.skeleton} ${styles.line}`} />
        <div
          className={`${styles.skeleton} ${styles.line}`}
          style={{ width: "50%" }}
        />
        <div
          className={`${styles.skeleton} ${styles.line}`}
          style={{ width: "70%", height: "20px" }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`${styles.skeleton} ${styles.line}`}
              style={{ width: "60px", height: "22px", borderRadius: "100px" }}
            />
          ))}
        </div>
        <div
          className={`${styles.skeleton} ${styles.line}`}
          style={{ width: "40%" }}
        />
      </div>
    </div>
  );
}

/* ─── Preset: Detail Page Skeleton ──────────────────────── */
export function DetailPageSkeleton() {
  return (
    <div className={styles.detailPage}>
      {/* Hero */}
      <div className={styles.detailHero}>
        <div className={styles.detailHeroLeft}>
          <div className={styles.detailMainImage} />
          <div className={styles.detailThumbnails}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.detailThumb} />
            ))}
          </div>
        </div>
        <div className={styles.detailHeroRight}>
          <div
            className={`${styles.skeleton} ${styles.line}`}
            style={{ height: "28px", width: "80%" }}
          />
          <div
            className={`${styles.skeleton} ${styles.line}`}
            style={{ height: "36px", width: "50%" }}
          />
          <div
            className={`${styles.skeleton} ${styles.line}`}
            style={{ height: "16px", width: "60%" }}
          />
          <div
            className={`${styles.skeleton} ${styles.line}`}
            style={{ height: "1px", width: "100%" }}
          />
          <div
            className={`${styles.skeleton} ${styles.line}`}
            style={{ height: "16px", width: "70%" }}
          />
          <div
            className={`${styles.skeleton} ${styles.line}`}
            style={{ height: "16px", width: "65%" }}
          />
          <div
            className={`${styles.skeleton} ${styles.line}`}
            style={{ height: "1px", width: "100%" }}
          />
          <div
            className={`${styles.skeleton} ${styles.line}`}
            style={{ height: "16px", width: "50%" }}
          />
          <div
            className={`${styles.skeleton} ${styles.line}`}
            style={{ height: "48px", borderRadius: "12px" }}
          />
          <div
            className={`${styles.skeleton} ${styles.line}`}
            style={{ height: "48px", borderRadius: "12px" }}
          />
        </div>
      </div>

      {/* Quick stats */}
      <div className={styles.detailQuickStats}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={styles.detailStatPill} />
        ))}
      </div>

      {/* Content sections */}
      <div className={styles.detailSections}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.detailSectionBlock}>
            <div
              className={`${styles.skeleton} ${styles.line}`}
              style={{ height: "24px", width: "40%" }}
            />
            <div className={`${styles.skeleton} ${styles.line}`} />
            <div
              className={`${styles.skeleton} ${styles.line}`}
              style={{ width: "90%" }}
            />
            <div
              className={`${styles.skeleton} ${styles.line}`}
              style={{ width: "75%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Preset: Compare Page Skeleton ─────────────────────── */
export function ComparePageSkeleton() {
  return (
    <div className={styles.comparePage}>
      <div className={styles.compareHeader}>
        <div
          className={`${styles.skeleton} ${styles.line}`}
          style={{ height: "28px", width: "200px" }}
        />
        <div
          className={`${styles.skeleton} ${styles.line}`}
          style={{ height: "36px", width: "100px", borderRadius: "8px" }}
        />
      </div>
      <div className={styles.compareTableSkeleton}>
        <div className={styles.compareRow}>
          <div className={styles.compareCell} />
          <div className={styles.compareCell} />
          <div className={styles.compareCell} />
        </div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={styles.compareDataRow}>
            <div className={styles.compareDataCell} />
            <div className={styles.compareDataCell} />
            <div className={styles.compareDataCell} />
          </div>
        ))}
      </div>
    </div>
  );
}
