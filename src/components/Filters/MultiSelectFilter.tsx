"use client";

import React from "react";
import styles from "./MultiSelectFilter.module.css";

interface MultiSelectFilterProps {
  label: string;
  options: { value: string; label: string; count?: number }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function MultiSelectFilter({
  options,
  selected,
  onChange,
}: MultiSelectFilterProps) {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className={styles.group}>
      {options.map((option) => {
        const isChecked = selected.includes(option.value);
        return (
          <div
            key={option.value}
            className={styles.option}
            role="checkbox"
            aria-checked={isChecked}
            tabIndex={0}
            onClick={() => handleToggle(option.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleToggle(option.value);
              }
            }}
          >
            <div
              className={`${styles.checkbox} ${isChecked ? styles.checkboxChecked : ""}`}
            >
              <svg
                className={styles.checkmark}
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 5.5L4 8L8.5 2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.labelRow}>
              <span className={styles.labelText}>{option.label}</span>
              {option.count !== undefined && (
                <span className={styles.count}>({option.count})</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
