"use client";

import { useState } from "react";
import { Search, Scale, Heart, User, Menu, X } from "lucide-react";
import { useIsEmbedded } from "../hooks/useIsEmbedded";
import GlobalSearch, { MobileGlobalSearch } from "./GlobalSearch";

interface NavbarProps {
  compareCount?: number;
}

export default function Navbar({ compareCount = 0 }: NavbarProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isEmbedded = useIsEmbedded();
  if (isEmbedded) return null;

  return (
    <header className="sticky top-0 z-50 bg-[#0F1B2D]">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <a href="/" className="text-white font-bold text-xl tracking-tight shrink-0">
          4Sale <span className="text-[#60A5FA]">New Cars</span>
        </a>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <GlobalSearch />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-5 shrink-0">
          <button className="relative text-white/80 hover:text-white transition-colors" aria-label="Compare">
            <Scale className="w-5 h-5" />
            {compareCount > 0 && (
              <span className="absolute -top-1.5 -end-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[#1A56DB] text-white text-[10px] font-bold rounded-full px-1">
                {compareCount}
              </span>
            )}
          </button>
          <button className="text-white/80 hover:text-white transition-colors" aria-label="Saved">
            <Heart className="w-5 h-5" />
          </button>
          <button className="text-white/80 hover:text-white transition-colors" aria-label="Account">
            <User className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <a href="/" className="text-white font-bold text-lg tracking-tight">
          4Sale <span className="text-[#60A5FA]">New Cars</span>
        </a>

        {/* Center: Search Icon */}
        <button
          className="text-white/80 hover:text-white transition-colors"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          aria-label="Search"
        >
          {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
        </button>

        {/* Hamburger */}
        <button
          className="text-white/80 hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Search Overlay */}
      <MobileGlobalSearch open={mobileSearchOpen} onClose={() => setMobileSearchOpen(false)} />

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F1B2D] border-t border-white/10 px-4 pb-4">
          <div className="flex flex-col gap-3 py-3">
            <a href="/compare" className="flex items-center gap-3 text-white/80 hover:text-white py-2">
              <Scale className="w-5 h-5" />
              <span className="text-sm">Compare</span>
              {compareCount > 0 && (
                <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-[#1A56DB] text-white text-[10px] font-bold rounded-full px-1">
                  {compareCount}
                </span>
              )}
            </a>
            <a href="/saved" className="flex items-center gap-3 text-white/80 hover:text-white py-2">
              <Heart className="w-5 h-5" />
              <span className="text-sm">Saved</span>
            </a>
            <a href="/account" className="flex items-center gap-3 text-white/80 hover:text-white py-2">
              <User className="w-5 h-5" />
              <span className="text-sm">Account</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
