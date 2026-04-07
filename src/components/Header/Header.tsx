"use client";

import styles from "./Header.module.css";

interface HeaderProps {
  compareCount?: number;
}

export default function Header({ compareCount = 0 }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <span className={styles.logo}>4Sale</span>
        <span className={styles.title}>New Cars</span>
        <a href="/compare" className={styles.compareLink}>
          <span className={styles.compareLinkText}>Compare</span>
          {compareCount > 0 && (
            <span className={styles.badge}>{compareCount}</span>
          )}
        </a>
      </div>
    </header>
  );
}
