"use client";

import { useCallback, useMemo } from "react";
import { Model } from "@/types";
import Chip from "@/components/Chip/Chip";
import { CardStack, CardStackItem } from "@/components/ui/card-stack";
import styles from "./ModelCarousel.module.css";

type ModelCard = CardStackItem & {
  modelId: string;
  image: string;
  startingPrice: number;
};

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

  const cardItems: ModelCard[] = useMemo(
    () =>
      models.map((m) => ({
        id: m.id,
        title: m.name,
        imageSrc: m.image,
        modelId: m.id,
        image: m.image,
        startingPrice: m.startingPrice,
      })),
    [models]
  );

  const renderCard = useCallback(
    (item: ModelCard, state: { active: boolean }) => {
      const isSelected = selectedModelIds.includes(item.modelId);
      return (
        <div
          className={`${styles.modelCard} ${isSelected ? styles.selected : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleModel(item.modelId);
          }}
        >
          <img
            src={item.image}
            alt={item.title}
            className={styles.modelImage}
            draggable={false}
          />
          <div className={styles.modelInfo}>
            <h3 className={styles.modelName}>{item.title}</h3>
            <p className={styles.modelPrice}>
              From KWD {item.startingPrice.toLocaleString()}
            </p>
          </div>
        </div>
      );
    },
    [selectedModelIds, toggleModel]
  );

  return (
    <div className={styles.wrapper}>
      <CardStack
        items={cardItems}
        renderCard={renderCard}
        cardWidth={400}
        cardHeight={260}
        showDots
        loop={false}
      />

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
