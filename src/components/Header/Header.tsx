"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {!isHome && (
          <button
            className={styles.back}
            onClick={() => router.back()}
            type="button"
            aria-label="Go back"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <Link href="/" className={styles.brand}>
          New Cars
        </Link>
      </div>
    </header>
  );
}
