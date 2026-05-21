"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_PREFIX = "__hs_";

function getEntryKey(): string {
  if (typeof window === "undefined") return "";
  const state = window.history.state as { __navKey?: string } | null;
  return state?.__navKey ?? window.location.pathname + window.location.search;
}

function storageKey(navKey: string, key: string): string {
  return `${STORAGE_PREFIX}${navKey}:${key}`;
}

function readStored<T>(key: string): T | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const navKey = getEntryKey();
    const raw = window.sessionStorage.getItem(storageKey(navKey, key));
    if (raw == null) return undefined;
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

function writeStored(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    const navKey = getEntryKey();
    window.sessionStorage.setItem(storageKey(navKey, key), JSON.stringify(value));
  } catch {
    /* quota or serialization errors are non-fatal */
  }
}

/**
 * Persists a piece of UI state in sessionStorage, keyed by a unique navigation
 * key stored in `history.state.__navKey` (set by ScrollToTop on first visit
 * to each history entry). When the user navigates back/forward to a tagged
 * entry, the same key resolves the stored value and restores it.
 *
 * sessionStorage is used instead of history.state directly because Next.js's
 * router can replace `history.state` on navigation, which would wipe app
 * data keyed inside it.
 */
export function useHistoryState<T>(
  key: string,
  initial: T,
): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = readStored<T>(key);
    if (stored !== undefined) return stored;
    return initial;
  });

  const lastSavedRef = useRef<T>(value);

  useEffect(() => {
    if (Object.is(lastSavedRef.current, value)) return;
    lastSavedRef.current = value;
    writeStored(key, value);
  }, [key, value]);

  return [value, setValue];
}
