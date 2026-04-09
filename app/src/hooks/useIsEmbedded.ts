"use client";

import { useSyncExternalStore } from "react";

function getSnapshot(): boolean {
  // Default to embedded mode; the class "is-standalone" opts out
  return !document.documentElement.classList.contains("is-standalone");
}

function getServerSnapshot(): boolean {
  return true;
}

function subscribe(callback: () => void): () => void {
  // Re-check if the class changes (unlikely but safe)
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

export function useIsEmbedded(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
