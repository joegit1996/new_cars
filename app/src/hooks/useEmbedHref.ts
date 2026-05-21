"use client";

import { useSearchParams } from "next/navigation";
import { isLocale } from "@/i18n/config";

// Embedded mode is the default and only option, so we no longer append
// `?embedded=true` to internal URLs. We still preserve the `lang` param so
// language selection sticks across navigations.

function applyParams(path: string, lang: string | null): string {
  try {
    const url = new URL(path, "http://placeholder");
    if (lang && isLocale(lang)) url.searchParams.set("lang", lang);
    return url.pathname + url.search + url.hash;
  } catch {
    return path;
  }
}

export function useEmbedHref(path: string): string {
  const sp = useSearchParams();
  const lang = sp.get("lang");
  if (!lang) return path;
  return applyParams(path, lang);
}

export function appendEmbedParam(
  path: string,
  _isEmbedded: boolean,
  lang?: string | null,
): string {
  if (!lang) return path;
  return applyParams(path, lang ?? null);
}
