"use client";

import { Trim } from "@/types";
import { getModelById } from "@/data";
import TrimCard from "@/components/TrimCard/TrimCard";
import Skeleton from "@/components/Skeleton/Skeleton";
import styles from "./TrimFeed.module.css";

interface TrimFeedProps {
  trims: Trim[];
  brandSlug: string;
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <Skeleton width="120px" height="90px" borderRadius="8px" />
      <div className={styles.skeletonContent}>
        <Skeleton width="70%" height="16px" borderRadius="4px" />
        <Skeleton width="50%" height="14px" borderRadius="4px" />
        <Skeleton width="40%" height="16px" borderRadius="4px" />
        <Skeleton width="90%" height="12px" borderRadius="4px" />
      </div>
    </div>
  );
}

export default function TrimFeed({ trims, brandSlug, loading = false }: TrimFeedProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Trims</h2>
      <div className={styles.feed}>
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : trims.length > 0 ? (
          trims.map((trim) => {
            const model = getModelById(trim.modelId);
            return (
              <TrimCard
                key={trim.id}
                trim={trim}
                brandSlug={brandSlug}
                modelName={model?.name ?? ""}
              />
            );
          })
        ) : (
          <p className={styles.empty}>No trims match your filters.</p>
        )}
      </div>
    </section>
  );
}
