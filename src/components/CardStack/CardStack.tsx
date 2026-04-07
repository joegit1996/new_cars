"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import styles from "./CardStack.module.css";

interface CardStackProps<T> {
  items: T[];
  renderCard: (item: T, isActive: boolean) => React.ReactNode;
  onChangeIndex?: (index: number) => void;
  cardWidth?: number;
  cardHeight?: number;
  showDots?: boolean;
}

const SPRING_CONFIG = { type: "spring" as const, stiffness: 300, damping: 30 };
const SWIPE_THRESHOLD = 50;

export default function CardStack<T>({
  items,
  renderCard,
  onChangeIndex,
  cardWidth,
  cardHeight,
  showDots = false,
}: CardStackProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);

  const resolvedWidth = cardWidth ?? (isMobile ? 300 : 400);
  const resolvedHeight = cardHeight ?? (isMobile ? 200 : 260);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(items.length - 1, index));
      setActiveIndex(clamped);
      onChangeIndex?.(clamped);
    },
    [items.length, onChangeIndex]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, goTo]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      goTo(activeIndex + 1);
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      goTo(activeIndex - 1);
    }
  };

  const getCardStyle = (index: number) => {
    const offset = index - activeIndex;
    const isActive = offset === 0;
    const absOffset = Math.abs(offset);

    const translateX = offset * (isMobile ? 60 : 80);
    const translateZ = isActive ? 0 : -absOffset * 80;
    const rotateY = offset * -8;
    const scale = isActive ? 1 : 0.9 - absOffset * 0.05;
    const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.15;
    const zIndex = items.length - absOffset;

    return {
      translateX,
      translateZ,
      rotateY,
      scale,
      opacity,
      zIndex,
    };
  };

  return (
    <div
      className={styles.container}
      ref={containerRef}
      style={{ perspective: 1000 }}
      tabIndex={0}
      role="region"
      aria-label="Card carousel"
    >
      <div
        className={styles.stage}
        style={{
          width: resolvedWidth + (isMobile ? 120 : 160),
          height: resolvedHeight + 20,
        }}
      >
        {items.map((item, index) => {
          const { translateX, translateZ, rotateY, scale, opacity, zIndex } =
            getCardStyle(index);
          const isActive = index === activeIndex;

          return (
            <motion.div
              key={index}
              className={styles.card}
              style={{
                width: resolvedWidth,
                height: resolvedHeight,
                zIndex,
                x: dragX,
              }}
              animate={{
                x: translateX,
                z: translateZ,
                rotateY,
                scale,
                opacity,
              }}
              transition={SPRING_CONFIG}
              onClick={() => goTo(index)}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragEnd={handleDragEnd}
              whileTap={isActive ? { cursor: "grabbing" } : undefined}
            >
              {renderCard(item, isActive)}
            </motion.div>
          );
        })}
      </div>

      {showDots && items.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Card navigation">
          {items.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
              onClick={() => goTo(index)}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Go to card ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
}
