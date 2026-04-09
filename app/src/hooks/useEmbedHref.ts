"use client";

import { useIsEmbedded } from "./useIsEmbedded";

export function useEmbedHref(path: string): string {
  const isEmbedded = useIsEmbedded();
  if (!isEmbedded) return path;

  try {
    const url = new URL(path, "http://placeholder");
    url.searchParams.set("embedded", "true");
    return url.pathname + url.search;
  } catch {
    return path;
  }
}

export function appendEmbedParam(path: string, isEmbedded: boolean): string {
  if (!isEmbedded) return path;

  try {
    const url = new URL(path, "http://placeholder");
    url.searchParams.set("embedded", "true");
    return url.pathname + url.search;
  } catch {
    return path;
  }
}
