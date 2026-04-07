"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import styles from "./ImageGallery.module.css";

export default function ImageGallery({ images }: { images: string[] }) {
  return (
    <div className={styles.gallery}>
      <Swiper
        modules={[Pagination, Navigation]}
        pagination={{ clickable: true }}
        navigation
        loop={images.length > 1}
        className={styles.swiper}
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <div className={styles.slideWrap}>
              <img src={src} alt={`View ${i + 1}`} className={styles.image} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
