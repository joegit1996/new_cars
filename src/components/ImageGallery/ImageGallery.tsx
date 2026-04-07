"use client";

import React, { useState } from "react";
import styles from "./ImageGallery.module.css";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);

  const handleThumbnailClick = (index: number) => {
    if (index === activeIndex) return;
    setFading(true);
    setTimeout(() => {
      setActiveIndex(index);
      setFading(false);
    }, 150);
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageWrapper}>
        <img
          className={`${styles.mainImage} ${fading ? styles.mainImageFading : ""}`}
          src={images[activeIndex] || "https://placehold.co/600x400/e9ebf2/324575?text=No+Image"}
          alt={alt}
        />
      </div>
      {images.length > 1 && (
        <div className={styles.thumbnailStrip}>
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.thumbnail} ${index === activeIndex ? styles.thumbnailActive : ""}`}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img
                className={styles.thumbnailImage}
                src={img}
                alt={`${alt} thumbnail ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
