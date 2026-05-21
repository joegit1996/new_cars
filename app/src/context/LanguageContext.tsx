"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  DEFAULT_LOCALE,
  type Locale,
  getDir,
  resolveLocale,
} from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import {
  locBrand,
  locModel,
  locTrim,
  locBranch,
  locLocation,
  locTagline,
  locFuel,
  locDrive,
  locTransmission,
  locBody,
  locClass,
  locCompound,
  locEngineSummary,
  locCollectionTitle,
  locCollectionDescription,
  type LocalizableLang,
} from "@/i18n/names";
import { getEditorialAr } from "@/i18n/editorial-ar";
import type { BrandEditorial } from "@/data/types";

interface NameLocalizers {
  brand: (name: string) => string;
  model: (name: string) => string;
  trim: (name: string) => string;
  branch: (name: string) => string;
  location: (name: string) => string;
  tagline: (name: string) => string;
  fuel: (name: string) => string;
  drive: (name: string) => string;
  transmission: (name: string) => string;
  body: (name: string) => string;
  class: (name: string) => string;
  compound: (name: string) => string;
  engineSummary: (name: string) => string;
  collectionTitle: (id: string, fallback: string) => string;
  collectionDescription: (id: string, fallback: string) => string;
  editorial: (brandId: string, fallback: BrandEditorial | undefined) => BrandEditorial | undefined;
}

interface LanguageContextValue {
  lang: Locale;
  dir: "rtl" | "ltr";
  t: Dictionary;
  ln: NameLocalizers;
  setLang: (next: Locale) => void;
  toggleLang: () => void;
}

function buildLocalizers(lang: LocalizableLang): NameLocalizers {
  return {
    brand: (n) => locBrand(n, lang),
    model: (n) => locModel(n, lang),
    trim: (n) => locTrim(n, lang),
    branch: (n) => locBranch(n, lang),
    location: (n) => locLocation(n, lang),
    tagline: (n) => locTagline(n, lang),
    fuel: (n) => locFuel(n, lang),
    drive: (n) => locDrive(n, lang),
    transmission: (n) => locTransmission(n, lang),
    body: (n) => locBody(n, lang),
    class: (n) => locClass(n, lang),
    compound: (n) => locCompound(n, lang),
    engineSummary: (n) => locEngineSummary(n, lang),
    collectionTitle: (id, fallback) => locCollectionTitle(id, fallback, lang),
    collectionDescription: (id, fallback) => locCollectionDescription(id, fallback, lang),
    editorial: (brandId, fallback) =>
      lang === "ar" ? (getEditorialAr(brandId) ?? fallback) : fallback,
  };
}

const fallback: LanguageContextValue = {
  lang: DEFAULT_LOCALE,
  dir: "ltr",
  t: getDictionary(DEFAULT_LOCALE),
  ln: buildLocalizers(DEFAULT_LOCALE as LocalizableLang),
  setLang: () => {},
  toggleLang: () => {},
};

const LanguageContext = createContext<LanguageContextValue>(fallback);

export function useLanguage() {
  return useContext(LanguageContext);
}

/**
 * Translate helper that supports `{placeholder}` interpolation.
 * Example: tFormat(t.brand.exploreLineup, { brand: "Mercedes" })
 */
export function tFormat(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const lang = useMemo<Locale>(
    () => resolveLocale(searchParams.get("lang")),
    [searchParams]
  );
  const dir = getDir(lang);
  const t = useMemo(() => getDictionary(lang), [lang]);
  const ln = useMemo(() => buildLocalizers(lang as LocalizableLang), [lang]);

  // Keep <html lang> and <html dir> in sync with current locale
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", dir);
  }, [lang, dir]);

  const setLang = (next: Locale) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (next === DEFAULT_LOCALE) {
      sp.delete("lang");
    } else {
      sp.set("lang", next);
    }
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const toggleLang = () => setLang(lang === "ar" ? "en" : "ar");

  return (
    <LanguageContext.Provider value={{ lang, dir, t, ln, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
