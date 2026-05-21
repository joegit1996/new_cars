"use client";

import { useState } from "react";
import { Search, Scale, Heart, User, Menu, X } from "lucide-react";
import { useIsEmbedded } from "../hooks/useIsEmbedded";
import GlobalSearch, { MobileGlobalSearch } from "./GlobalSearch";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import EmbedLink from "./EmbedLink";

interface NavbarProps {
  compareCount?: number;
}

export default function Navbar({ compareCount = 0 }: NavbarProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isEmbedded = useIsEmbedded();
  const { t } = useLanguage();
  if (isEmbedded) return null;

  return (
    <header className="sticky top-0 z-50 bg-[#0F1B2D]">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <EmbedLink href="/" className="text-white font-bold text-xl tracking-tight shrink-0">
          {t.nav.brand} <span className="text-[#60A5FA]">{t.nav.brandAccent}</span>
        </EmbedLink>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <GlobalSearch />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4 shrink-0">
          <LanguageSwitcher />
          <button className="relative text-white/80 hover:text-white transition-colors" aria-label={t.nav.compare}>
            <Scale className="w-5 h-5" />
            {compareCount > 0 && (
              <span className="absolute -top-1.5 -end-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[#1A56DB] text-white text-[10px] font-bold rounded-full px-1">
                {compareCount}
              </span>
            )}
          </button>
          <button className="text-white/80 hover:text-white transition-colors" aria-label={t.nav.saved}>
            <Heart className="w-5 h-5" />
          </button>
          <button className="text-white/80 hover:text-white transition-colors" aria-label={t.nav.account}>
            <User className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <EmbedLink href="/" className="text-white font-bold text-lg tracking-tight">
          {t.nav.brand} <span className="text-[#60A5FA]">{t.nav.brandAccent}</span>
        </EmbedLink>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {/* Center: Search Icon */}
          <button
            className="text-white/80 hover:text-white transition-colors"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            aria-label={t.nav.search}
          >
            {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

          {/* Hamburger */}
          <button
            className="text-white/80 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t.common.menu}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      <MobileGlobalSearch open={mobileSearchOpen} onClose={() => setMobileSearchOpen(false)} />

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F1B2D] border-t border-white/10 px-4 pb-4">
          <div className="flex flex-col gap-3 py-3">
            <EmbedLink href="/compare" className="flex items-center gap-3 text-white/80 hover:text-white py-2">
              <Scale className="w-5 h-5" />
              <span className="text-sm">{t.nav.compare}</span>
              {compareCount > 0 && (
                <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-[#1A56DB] text-white text-[10px] font-bold rounded-full px-1">
                  {compareCount}
                </span>
              )}
            </EmbedLink>
            <EmbedLink href="/saved" className="flex items-center gap-3 text-white/80 hover:text-white py-2">
              <Heart className="w-5 h-5" />
              <span className="text-sm">{t.nav.saved}</span>
            </EmbedLink>
            <EmbedLink href="/account" className="flex items-center gap-3 text-white/80 hover:text-white py-2">
              <User className="w-5 h-5" />
              <span className="text-sm">{t.nav.account}</span>
            </EmbedLink>
            <LanguageSwitcher variant="menu" />
          </div>
        </div>
      )}
    </header>
  );
}
