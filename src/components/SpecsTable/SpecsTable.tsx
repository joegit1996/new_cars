import React from "react";
import styles from "./SpecsTable.module.css";

interface SpecsTableProps {
  sections: {
    title: string;
    rows: { label: string; value: string | number }[];
  }[];
}

export default function SpecsTable({ sections }: SpecsTableProps) {
  return (
    <div className={styles.specsTable}>
      {sections.map((section) => (
        <div key={section.title} className={styles.section}>
          <h4 className={styles.sectionTitle}>{section.title}</h4>
          <div className={styles.rows}>
            {section.rows.map((row, index) => (
              <div
                key={row.label}
                className={`${styles.row} ${index % 2 === 0 ? styles.rowEven : styles.rowOdd}`}
              >
                <span className={styles.label}>{row.label}</span>
                <span className={styles.value}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
