"use client";

import { useState, useMemo } from "react";
import { Brand, Trim } from "@/types";
import ImageGallery from "@/components/ImageGallery/ImageGallery";
import VariantSelector from "@/components/VariantSelector/VariantSelector";
import ColorSwatches from "@/components/ColorSwatches/ColorSwatches";
import SpecsSection from "@/components/SpecsSection/SpecsSection";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import styles from "./DetailsPage.module.css";

interface DetailsPageProps {
  brand: Brand;
  trim: Trim;
  modelName: string;
  initialVariantId?: string;
}

export default function DetailsPage({
  brand,
  trim,
  modelName,
  initialVariantId,
}: DetailsPageProps) {
  const [activeVariantId, setActiveVariantId] = useState(
    initialVariantId || trim.variants[0]?.id || ""
  );

  const activeVariant = useMemo(
    () => trim.variants.find((v) => v.id === activeVariantId) || trim.variants[0],
    [trim.variants, activeVariantId]
  );

  const [activeColorHex, setActiveColorHex] = useState(
    activeVariant?.colors[0]?.hex || ""
  );

  const [transitioning, setTransitioning] = useState(false);

  const handleVariantChange = (variantId: string) => {
    setTransitioning(true);
    setTimeout(() => {
      setActiveVariantId(variantId);
      const newVariant = trim.variants.find((v) => v.id === variantId);
      if (newVariant?.colors[0]) {
        setActiveColorHex(newVariant.colors[0].hex);
      }
      setTransitioning(false);
    }, 50);
  };

  const showSelector = !initialVariantId && trim.variants.length > 1;

  const breadcrumbItems = [
    { label: brand.name, href: `/brands/${brand.slug}` },
    { label: modelName },
  ];

  return (
    <div className={styles.page}>
      {/* ImageGallery is full-width, outside the container */}
      <div className={`${styles.galleryWrap} ${transitioning ? styles.fade : ""}`}>
        <ImageGallery images={activeVariant?.images || []} />
      </div>

      {/* Content container */}
      <div className={styles.container}>
        {showSelector && (
          <div className={styles.selectorWrap}>
            <VariantSelector
              variants={trim.variants}
              activeVariantId={activeVariantId}
              onSelect={handleVariantChange}
            />
          </div>
        )}

        <div className={styles.breadcrumbWrap}>
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <h1 className={styles.trimName}>{trim.name}</h1>

        <p className={styles.variantName}>{activeVariant?.name}</p>

        <p className={styles.price}>
          KWD {activeVariant?.price.toLocaleString()}
        </p>

        <div className={styles.colorsWrap}>
          <ColorSwatches
            colors={activeVariant?.colors || []}
            activeColor={activeColorHex}
            onSelect={setActiveColorHex}
          />
        </div>

        <div className={styles.specsWrap}>
          <SpecsSection specs={activeVariant?.specs || ({} as any)} />
        </div>
      </div>
    </div>
  );
}
