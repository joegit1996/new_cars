"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./PriceRangeFilter.module.css";

interface PriceRangeFilterProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
}

export default function PriceRangeFilter({
  min,
  max,
  value,
  onChange,
}: PriceRangeFilterProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const debouncedOnChange = useCallback(
    (newValue: [number, number]) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onChange(newValue);
      }, 300);
    },
    [onChange]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleMinSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), localValue[1] - 1);
    const newValue: [number, number] = [newMin, localValue[1]];
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  const handleMaxSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), localValue[0] + 1);
    const newValue: [number, number] = [localValue[0], newMax];
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  const handleMinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const num = Number(raw);
    if (!isNaN(num)) {
      const clamped = Math.max(min, Math.min(num, localValue[1] - 1));
      const newValue: [number, number] = [clamped, localValue[1]];
      setLocalValue(newValue);
      debouncedOnChange(newValue);
    }
  };

  const handleMaxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const num = Number(raw);
    if (!isNaN(num)) {
      const clamped = Math.min(max, Math.max(num, localValue[0] + 1));
      const newValue: [number, number] = [localValue[0], clamped];
      setLocalValue(newValue);
      debouncedOnChange(newValue);
    }
  };

  const formatPrice = (price: number) =>
    `$${price.toLocaleString("en-US")}`;

  const leftPercent = ((localValue[0] - min) / (max - min)) * 100;
  const rightPercent = ((localValue[1] - min) / (max - min)) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.rangeDisplay}>
        {formatPrice(localValue[0])} &ndash; {formatPrice(localValue[1])}
      </div>

      <div className={styles.sliderContainer}>
        <div className={styles.track} />
        <div
          className={styles.activeTrack}
          style={{
            left: `${leftPercent}%`,
            right: `${100 - rightPercent}%`,
          }}
        />
        <input
          type="range"
          className={styles.rangeInput}
          min={min}
          max={max}
          value={localValue[0]}
          onChange={handleMinSlider}
          aria-label="Minimum price"
        />
        <input
          type="range"
          className={styles.rangeInput}
          min={min}
          max={max}
          value={localValue[1]}
          onChange={handleMaxSlider}
          aria-label="Maximum price"
        />
      </div>

      <div className={styles.inputRow}>
        <input
          type="text"
          className={styles.textInput}
          value={formatPrice(localValue[0])}
          onChange={handleMinInput}
          aria-label="Minimum price input"
        />
        <span className={styles.inputSeparator}>&ndash;</span>
        <input
          type="text"
          className={styles.textInput}
          value={formatPrice(localValue[1])}
          onChange={handleMaxInput}
          aria-label="Maximum price input"
        />
      </div>
    </div>
  );
}
