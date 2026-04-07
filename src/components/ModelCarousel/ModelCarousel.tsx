"use client";

import { useCallback } from "react";
import { Model } from "@/types";
import Chip from "@/components/Chip/Chip";
import CardStack from "@/components/CardStack/CardStack";
import styles from "./ModelCarousel.module.css";

interface ModelCarouselProps {
  models: Model[];
  selectedModelIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export default function ModelCarousel({
  models,
  selectedModelIds,
  onSelectionChange,
}: ModelCarouselProps) {
  const toggleModel = useCallback(
    (modelId: string) => {
      onSelectionChange(
        selectedModelIds.includes(modelId)
          ? selectedModelIds.filter((id) => id !== modelId)
          : [...selectedModelIds, modelId]
      );
    },
    [selectedModelIds, onSelectionChange]
  );

  const removeModel = useCallback(
    (modelId: string) => {
      onSelectionChange(selectedModelIds.filter((id) => id !== modelId));
    },
    [selectedModelIds, onSelectionChange]
  );

  const renderCard = (model: Model, isActive: boolean) => {
    const isSelected = selectedModelIds.includes(model.id);
    return (
      <div
        className={`${styles.modelCard} ${isSelected ? styles.selected : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleModel(model.id);
        }}
      >
        <img
          src={model.image}
          alt={model.name}
          className={styles.modelImage}
        />
        <div className={styles.modelInfo}>
          <h3 className={styles.modelName}>{model.name}</h3>
          <p className={styles.modelPrice}>
            From KWD {model.startingPrice.toLocaleString()}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <CardStack items={models} renderCard={renderCard} showDots />

      {selectedModelIds.length > 0 && (
        <div className={styles.selectedChips}>
          {selectedModelIds.map((id) => {
            const model = models.find((m) => m.id === id);
            if (!model) return null;
            return (
              <Chip
                key={id}
                label={model.name}
                active
                showRemove
                onRemove={() => removeModel(id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
