"use client";

import { Model } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ModelCard from "@/components/ModelCard/ModelCard";
import styles from "./ModelCarousel.module.css";

interface ModelCarouselProps {
  models: Model[];
  selectedModelIds: string[];
  onToggleModel: (modelId: string) => void;
}

function SkeletonLoader() {
  return (
    <div className={styles.skeletonContainer}>
      {[0, 1, 2].map((i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonInfo}>
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLineMedium} />
            <div className={styles.skeletonLineShort} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ModelCarousel({
  models,
  selectedModelIds,
  onToggleModel,
}: ModelCarouselProps) {
  if (models.length === 0) {
    return null;
  }

  return (
    <section className={styles.section} key={models[0]?.brandId}>
      <div className={styles.header}>
        <h2 className={styles.title}>Explore Models</h2>
        <p className={styles.subtitle}>Select one or more to browse</p>
      </div>

      <div className={styles.carouselContainer}>
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView="auto"
          spaceBetween={20}
          grabCursor
          navigation
          pagination={{ clickable: true }}
        >
          {models.map((model) => (
            <SwiperSlide key={model.id} style={{ width: "auto" }}>
              <ModelCard
                model={model}
                isSelected={selectedModelIds.includes(model.id)}
                onSelect={onToggleModel}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export { SkeletonLoader as ModelCarouselSkeleton };
