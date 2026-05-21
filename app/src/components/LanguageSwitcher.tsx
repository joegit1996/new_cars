"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LOCALE_SHORT } from "@/i18n/config";

interface LanguageSwitcherProps {
  variant?: "navbar" | "menu" | "footer";
  className?: string;
}

/**
 * Toggle between English and Arabic. Updates the URL `?lang=` param,
 * which in turn drives html dir + dictionary selection.
 */
export default function LanguageSwitcher({
  variant = "navbar",
  className = "",
}: LanguageSwitcherProps) {
  const { lang, toggleLang, t } = useLanguage();
  const nextLabel = lang === "ar" ? LOCALE_SHORT.en : LOCALE_SHORT.ar;
  const ariaLabel = `${t.common.language}: ${lang === "ar" ? t.common.english : t.common.arabic}`;

  if (variant === "menu") {
    return (
      <button
        onClick={toggleLang}
        aria-label={ariaLabel}
        className={`flex items-center gap-3 text-white/80 hover:text-white py-2 ${className}`}
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm">
          {lang === "ar" ? t.common.english : t.common.arabic}
        </span>
      </button>
    );
  }

  if (variant === "footer") {
    return (
      <button
        onClick={toggleLang}
        aria-label={ariaLabel}
        className={`inline-flex items-center gap-2 text-sm hover:text-white transition-colors ${className}`}
      >
        <Globe className="w-4 h-4" />
        <span>{lang === "ar" ? t.common.english : t.common.arabic}</span>
      </button>
    );
  }

  // navbar variant
  return (
    <button
      onClick={toggleLang}
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-xs font-semibold px-2.5 py-1.5 rounded-full border border-white/20 hover:border-white/40 ${className}`}
    >
      <Globe className="w-3.5 h-3.5" />
      <span>{nextLabel}</span>
    </button>
  );
}
