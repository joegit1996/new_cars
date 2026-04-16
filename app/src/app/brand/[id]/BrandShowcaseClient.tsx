"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  Gauge,
  Fuel,
  Cog,
  ArrowRight,
  ArrowLeft,
  Car,
  MapPin,
  Wrench,
  Smartphone,
  Home,
  Leaf,
} from "lucide-react";
import {
  getBrandById,
  getModelsByBrandSegmentOrder,
  getBrandEditorial,
  getTrimsByModel,
} from "@/data/helpers";
import { filterModels } from "@/data/helpers";
import type { Model } from "@/data/types";
import { type FilterState, PRICE_MIN, PRICE_MAX } from "@/components/FilterPanel";
import FilterPanel from "@/components/FilterPanel";
import PlaceholderImage from "@/components/PlaceholderImage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileTabBar from "@/components/MobileTabBar";
import { CompareProvider, useCompare } from "@/context/CompareContext";
import { EmbedAnchor } from "@/components/EmbedLink";
import { FullScreenScrollFX } from "@/components/ui/full-screen-scroll-fx";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPrice(price: number) {
  return price.toLocaleString("en-US");
}

const serviceIcons: Record<string, React.ReactNode> = {
  car: <Car className="w-6 h-6" />,
  "map-pin": <MapPin className="w-6 h-6" />,
  wrench: <Wrench className="w-6 h-6" />,
  smartphone: <Smartphone className="w-6 h-6" />,
};

// ---------------------------------------------------------------------------
// Fade-in section
// ---------------------------------------------------------------------------

function FadeSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Brand Hero (same as browse page)
// ---------------------------------------------------------------------------

function BrandHero({ brandName, logoUrl, heroImages }: { brandName: string; logoUrl?: string; heroImages?: string[] }) {
  const [current, setCurrent] = useState(0);
  const slides = [0, 1, 2];
  const labels = [`${brandName} - Lineup`, `${brandName} - Heritage`, `${brandName} - Innovation`];
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  const goNext = useCallback(() => {
    setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
  }, [slides.length]);

  useEffect(() => {
    autoPlayRef.current = setInterval(goNext, 5000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [goNext]);

  const resetAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(goNext, 5000);
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-[#E2E8F0]"
      onTouchStart={(e) => { touchStart.current = e.targetTouches[0].clientX; }}
      onTouchMove={(e) => { touchEnd.current = e.targetTouches[0].clientX; }}
      onTouchEnd={() => {
        const diff = touchStart.current - touchEnd.current;
        if (diff > 50) { setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1)); resetAutoPlay(); }
        else if (diff < -50) { setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1)); resetAutoPlay(); }
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PlaceholderImage aspectRatio="21/9" className="w-full" label="" imageUrl={heroImages?.[current % (heroImages?.length || 1)]} />
        </motion.div>
      </AnimatePresence>

      {/* Brand name overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex items-end">
        <div className="px-4 md:px-6 pb-5 md:pb-7 max-w-7xl mx-auto w-full flex items-center gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-lg flex items-center justify-center shrink-0 overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={`${brandName} logo`} className="w-[70%] h-[70%] object-contain" />
            ) : (
              <span className="text-[#1E293B] font-bold text-base md:text-xl">
                {brandName.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">
              {brandName}
            </h1>
            <p className="text-sm text-white/70 mt-0.5 hidden md:block">
              Explore the full {brandName} lineup in Kuwait
            </p>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); resetAutoPlay(); }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "bg-white w-6" : "bg-white/50 w-2"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter Modal (light theme)
// ---------------------------------------------------------------------------

function FilterModal({
  open,
  onClose,
  filters,
  onChange,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (f: FilterState) => void;
  resultCount: number;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={onClose}
          />

          {/* Desktop: centered modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="hidden md:flex fixed inset-0 z-[60] items-center justify-center p-8"
            onClick={onClose}
          >
            <div
              className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl max-w-xl w-full max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
                <h2 className="font-bold text-[#1E293B] text-lg">More Filters</h2>
                <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#1E293B] transition-colors" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5 styled-scrollbar">
                <FilterPanel filters={filters} onChange={onChange} hideBrands />
              </div>
              <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between gap-4">
                <button
                  onClick={() =>
                    onChange({
                      priceRange: [PRICE_MIN, PRICE_MAX],
                      bodyTypes: [],
                      fuelTypes: [],
                      transmissions: [],
                      driveTypes: [],
                      seating: [],
                      specRegions: [],
                      brands: [],
                    })
                  }
                  className="text-sm text-[#64748B] hover:text-[#1E293B] transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#1A56DB] text-white font-bold text-sm rounded-xl hover:bg-[#1A56DB]/90 transition-colors"
                >
                  Show {resultCount} Model{resultCount !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Mobile: bottom sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed bottom-0 inset-x-0 z-[60] bg-white rounded-t-2xl max-h-[85vh] flex flex-col"
          >
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 rounded-full bg-[#E2E8F0]" />
            </div>
            <div className="flex items-center justify-between px-4 pb-3 border-b border-[#E2E8F0]">
              <h2 className="font-bold text-[#1E293B]">More Filters</h2>
              <button onClick={onClose} className="p-1 text-[#64748B]" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 styled-scrollbar">
              <FilterPanel filters={filters} onChange={onChange} hideBrands />
            </div>
            <div className="px-4 py-3 border-t border-[#E2E8F0]">
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#1A56DB] text-white font-bold text-sm rounded-xl"
              >
                Show {resultCount} Model{resultCount !== 1 ? "s" : ""}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Model Showcase Zone
// ---------------------------------------------------------------------------

function ModelShowcase({
  models,
  brandName,
  filterMode,
  onFilterModeChange,
  availableBodyTypes,
  activeBodyTypes,
  onToggleBodyType,
  availableFamilies,
  activeFamilies,
  onToggleFamily,
  onClearFamilies,
  onFilterOpen,
}: {
  models: Model[];
  brandName: string;
  filterMode: FilterMode;
  onFilterModeChange: (mode: FilterMode) => void;
  availableBodyTypes: string[];
  activeBodyTypes: string[];
  onToggleBodyType: (bt: string) => void;
  availableFamilies: string[];
  activeFamilies: string[];
  onToggleFamily: (family: string) => void;
  onClearFamilies: () => void;
  onFilterOpen: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  // Reset index when filtered set changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [models.length]);

  const current = models[currentIndex];
  const trimData = current ? getTrimsByModel(current.id) : [];
  const topTrim = trimData[0];

  const goTo = useCallback(
    (idx: number, dir: number) => {
      const clamped = Math.max(0, Math.min(idx, models.length - 1));
      if (clamped !== currentIndex) {
        setDirection(dir);
        setCurrentIndex(clamped);
      }
    },
    [currentIndex, models.length]
  );

  const prev = useCallback(() => goTo(currentIndex - 1, -1), [currentIndex, goTo]);
  const next = useCallback(() => goTo(currentIndex + 1, 1), [currentIndex, goTo]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEnd.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => {
    const diff = touchStart.current - touchEnd.current;
    if (diff > 60) next();
    else if (diff < -60) prev();
  };

  if (!current) return null;

  const textVariants = {
    enter: (d: number) => ({ opacity: 0, x: d * 30 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -30 }),
  };

  const isAllActive = filterMode === "bodyType" ? activeBodyTypes.length === 0 : activeFamilies.length === 0;
  const chips = filterMode === "bodyType" ? availableBodyTypes : availableFamilies;
  const activeChips = filterMode === "bodyType" ? activeBodyTypes : activeFamilies;
  const onChipClick = filterMode === "bodyType" ? onToggleBodyType : onToggleFamily;
  const onAllClick = filterMode === "bodyType"
    ? () => { if (activeBodyTypes.length > 0) activeBodyTypes.forEach((bt) => onToggleBodyType(bt)); }
    : onClearFamilies;

  return (
    <div
      className="relative bg-[#F8FAFC] select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Filter bar */}
        <div className="flex items-center gap-3 mb-6">
          {/* Mode toggle */}
          {availableFamilies.length > 0 && (
            <div className="flex items-center bg-[#E2E8F0] rounded-lg p-0.5 shrink-0">
              <button
                onClick={() => onFilterModeChange("bodyType")}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-colors ${
                  filterMode === "bodyType"
                    ? "bg-white text-[#1E293B] shadow-sm"
                    : "text-[#64748B] hover:text-[#1E293B]"
                }`}
              >
                Body Type
              </button>
              <button
                onClick={() => onFilterModeChange("class")}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-colors ${
                  filterMode === "class"
                    ? "bg-white text-[#1E293B] shadow-sm"
                    : "text-[#64748B] hover:text-[#1E293B]"
                }`}
              >
                Class
              </button>
            </div>
          )}

          {/* Scrollable pills */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 min-w-max">
              <button
                onClick={onAllClick}
                className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap ${
                  isAllActive
                    ? "bg-[#1A56DB] text-white border-[#1A56DB]"
                    : "bg-white text-[#1E293B] border-[#E2E8F0] hover:border-[#1A56DB]"
                }`}
              >
                All
              </button>
              {chips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => onChipClick(chip)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap ${
                    activeChips.includes(chip)
                      ? "bg-[#1A56DB] text-white border-[#1A56DB]"
                      : "bg-white text-[#1E293B] border-[#E2E8F0] hover:border-[#1A56DB]"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* More Filters button */}
          <button
            onClick={onFilterOpen}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#1A56DB] hover:text-[#1A56DB] transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">More Filters</span>
          </button>
        </div>

        {/* Model name */}
        <div className="text-center mb-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id + "-name"}
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-2xl md:text-4xl font-bold text-[#1E293B]">
                {current.name}
              </h2>
              <p className="text-xs md:text-sm text-[#64748B] mt-1 uppercase tracking-widest">
                {current.bodyType}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Car image with arrows */}
        <div className="relative flex items-center">
          {/* Left arrow */}
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className={`hidden md:flex absolute start-0 z-10 w-10 h-10 items-center justify-center rounded-full border shadow-sm transition-all ${
              currentIndex === 0
                ? "border-[#E2E8F0] text-[#CBD5E1] cursor-default"
                : "border-[#E2E8F0] text-[#1E293B] bg-white hover:shadow-md hover:border-[#CBD5E1]"
            }`}
            aria-label="Previous model"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Car image */}
          <div className="flex-1 px-0 md:px-14">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="max-w-3xl mx-auto group/car cursor-pointer overflow-hidden rounded-xl"
              >
                <div className="transition-transform duration-500 ease-out group-hover/car:scale-105">
                  <PlaceholderImage
                    aspectRatio="16/9"
                    bodyType={current.bodyType}
                    label={`${brandName} ${current.name}`}
                    className="w-full"
                    imageUrl={current.imageUrl}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            disabled={currentIndex === models.length - 1}
            className={`hidden md:flex absolute end-0 z-10 w-10 h-10 items-center justify-center rounded-full border shadow-sm transition-all ${
              currentIndex === models.length - 1
                ? "border-[#E2E8F0] text-[#CBD5E1] cursor-default"
                : "border-[#E2E8F0] text-[#1E293B] bg-white hover:shadow-md hover:border-[#CBD5E1]"
            }`}
            aria-label="Next model"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Specs + Price + CTA */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id + "-details"}
            custom={direction}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="mt-6 text-center"
          >
            {topTrim && (
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-4">
                <span className="flex items-center gap-1.5 text-xs md:text-sm text-[#64748B]">
                  <Gauge className="w-3.5 h-3.5" />
                  {topTrim.horsepower} hp
                </span>
                <span className="flex items-center gap-1.5 text-xs md:text-sm text-[#64748B]">
                  <Cog className="w-3.5 h-3.5" />
                  {topTrim.engineSummary.split(",")[0]}
                </span>
                <span className="flex items-center gap-1.5 text-xs md:text-sm text-[#64748B]">
                  <Fuel className="w-3.5 h-3.5" />
                  {topTrim.fuelType}
                </span>
              </div>
            )}

            <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-1">Starting from</p>
            <p className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-4">
              {formatPrice(current.startingPrice)} <span className="text-lg font-normal text-[#64748B]">KWD</span>
            </p>

            <EmbedAnchor
              href={`/model/${current.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A56DB] text-white font-bold text-sm rounded-xl hover:bg-[#1A56DB]/90 transition-colors"
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </EmbedAnchor>
          </motion.div>
        </AnimatePresence>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className="text-xs text-[#94A3B8] tabular-nums">
            {currentIndex + 1} / {models.length}
          </span>
          <div className="h-1 w-24 md:w-32 bg-[#E2E8F0] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#1A56DB] rounded-full"
              animate={{ width: `${((currentIndex + 1) / models.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Brand Details Zone
// ---------------------------------------------------------------------------

function FeaturedModelsSection({
  models,
  brandName,
  brandId,
}: {
  models: Model[];
  brandName: string;
  brandId: string;
}) {
  const featured = useMemo(() => {
    const highlighted = models.filter((m) => m.isNew || m.isUpdated);
    const rest = models.filter((m) => !m.isNew && !m.isUpdated);
    const shuffled = [...rest].sort(() => Math.random() - 0.5);
    return [...highlighted, ...shuffled].slice(0, 6);
  }, [models]);

  const [isMobile, setIsMobile] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const sections = useMemo(
    () =>
      featured.map((model) => {
        const trim = getTrimsByModel(model.id)[0];
        return {
          id: model.id,
          background: "",
          leftLabel: (
            <span className="normal-case tracking-normal">{model.name}</span>
          ),
          title: model.name,
          rightLabel: (
            <span className="normal-case tracking-normal text-right">
              {formatPrice(model.startingPrice)}{" "}
              <span className="text-[0.7em] opacity-50">KWD</span>
            </span>
          ),
          bottomContent: (
            <div className="flex flex-col items-center gap-2 text-center normal-case tracking-normal">
              <div className="flex items-center gap-3">
                {(model.isNew || model.isUpdated) && (
                  <span className="px-3 py-1 bg-white text-[#111318] text-[10px] font-bold uppercase tracking-wider rounded-md">
                    {model.isNew ? "New" : "Updated"}
                  </span>
                )}
                <span className="text-[11px] text-white/50 uppercase tracking-widest">
                  {model.bodyType}
                </span>
              </div>
              {trim && (
                <span className="text-sm text-white/60">
                  {trim.horsepower} hp &middot;{" "}
                  {trim.engineSummary.split(",")[0]}
                </span>
              )}
              <div className="flex items-center gap-4 mt-1">
                <span className="text-xl md:text-2xl font-bold text-white">
                  {formatPrice(model.startingPrice)}{" "}
                  <span className="text-sm font-normal text-white/40">KWD</span>
                </span>
                <EmbedAnchor
                  href={`/model/${model.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-xl border border-white/10 transition-all duration-300"
                >
                  View Details <ArrowRight className="w-4 h-4" />
                </EmbedAnchor>
              </div>
            </div>
          ),
          renderBackground: (active: boolean) => (
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: active ? 1 : 0 }}
            >
              <div className="absolute inset-0 flex items-center justify-center [&_svg]:!opacity-70">
                <PlaceholderImage
                  aspectRatio="16/9"
                  bodyType={model.bodyType}
                  label=""
                  className="w-full h-full !bg-[#111318]"
                  silhouetteSize="lg"
                  imageUrl={model.imageUrl}
                />
              </div>
              {/* Thin bottom fade for text readability only */}
              <div className="absolute bottom-0 inset-x-0 h-[25%] bg-gradient-to-t from-[#111318] to-transparent" />
            </div>
          ),
        };
      }),
    [featured, brandName]
  );

  if (featured.length === 0) return null;

  // Mobile: card-based carousel instead of scroll-pinned FX
  if (isMobile) {
    return (
      <div className="bg-[#111318] text-white py-10">
        <div className="px-4 mb-6">
          <p className="text-xs text-white/50 font-bold uppercase tracking-wider mb-2 text-center">
            Recommended
          </p>
          <h3 className="text-2xl font-bold text-center">Featured Models</h3>
        </div>

        <div className="relative">
          <div
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4"
            style={{ scrollbarWidth: "none" }}
          >
            {featured.map((model) => {
              const trim = getTrimsByModel(model.id)[0];
              return (
                <EmbedAnchor
                  key={model.id}
                  href={`/model/${model.id}`}
                  className="shrink-0 w-[85vw] snap-center relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                >
                  {(model.isNew || model.isUpdated) && (
                    <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-white text-[#111318] text-[10px] font-bold uppercase tracking-wider rounded-md">
                      {model.isNew ? "New" : "Updated"}
                    </div>
                  )}
                  <PlaceholderImage
                    aspectRatio="3/2"
                    bodyType={model.bodyType}
                    label={`${brandName} ${model.name}`}
                    className="w-full"
                    imageUrl={model.imageUrl}
                  />
                  <div className="p-4">
                    <h4 className="font-bold text-white text-lg leading-tight">
                      {model.name}
                    </h4>
                    <p className="text-[11px] text-white/40 uppercase tracking-wider mt-0.5">
                      {model.bodyType}
                    </p>
                    {trim && (
                      <p className="text-xs text-white/50 mt-2">
                        {trim.horsepower} hp &middot;{" "}
                        {trim.engineSummary.split(",")[0]}
                      </p>
                    )}
                    <p className="text-base font-bold text-white mt-2">
                      {formatPrice(model.startingPrice)}{" "}
                      <span className="text-xs font-normal text-white/40">
                        KWD
                      </span>
                    </p>
                  </div>
                </EmbedAnchor>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <FullScreenScrollFX
      sections={sections}
      header={
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-white/50 font-bold uppercase tracking-wider block">
            Recommended
          </span>
          <span className="text-3xl md:text-4xl font-bold text-white block">
            Featured Models
          </span>
        </div>
      }
      colors={{
        text: "rgba(255,255,255,0.92)",
        overlay: "rgba(0,0,0,0)",
        pageBg: "#111318",
        stageBg: "#111318",
      }}
      bgTransition="fade"
      parallaxAmount={3}
      durations={{ change: 0.6, snap: 700 }}
      showProgress={true}
      onIndexChange={setActiveIdx}
    />
  );
}

function DiscoverByBodyType({
  brandId,
  brandName,
  models,
}: {
  brandId: string;
  brandName: string;
  models: Model[];
}) {
  const bodyTypes = useMemo(() => {
    const map = new Map<string, { count: number; imageUrl?: string }>();
    models.forEach((m) => {
      const existing = map.get(m.bodyType);
      if (existing) {
        existing.count++;
        if (!existing.imageUrl && m.imageUrl) existing.imageUrl = m.imageUrl;
      } else {
        map.set(m.bodyType, { count: 1, imageUrl: m.imageUrl });
      }
    });
    return Array.from(map.entries()).sort((a, b) => b[1].count - a[1].count);
  }, [models]);

  return (
    <FadeSection>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <p className="text-xs text-[#1A56DB] font-bold uppercase tracking-wider mb-2 text-center">Browse</p>
        <h3 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-3 text-center">
          Discover by Body Type
        </h3>
        <p className="text-sm text-[#64748B] text-center mb-8 max-w-lg mx-auto">
          Find the perfect {brandName} for your lifestyle
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {bodyTypes.map(([bt, info]) => (
            <EmbedAnchor
              key={bt}
              href={`/browse?brand=${brandId}&bodyType=${bt}`}
              className="group relative rounded-2xl overflow-hidden bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#1A56DB] hover:shadow-xl transition-all duration-300"
            >
              <div className="overflow-hidden">
                <div className="transition-transform duration-500 ease-out group-hover:scale-110">
                  <PlaceholderImage
                    aspectRatio="4/3"
                    bodyType={bt}
                    label=""
                    className="w-full"
                    imageUrl={info.imageUrl}
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/80 via-[#1E293B]/20 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4 md:p-5 flex items-end justify-between">
                <div>
                  <h4 className="font-bold text-white text-xl md:text-2xl">{bt}s</h4>
                  <p className="text-xs text-white/60 mt-0.5">{info.count} model{info.count !== 1 ? "s" : ""}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-white/25 flex items-center justify-center transition-all duration-300">
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>
              </div>
            </EmbedAnchor>
          ))}
        </div>
      </div>
    </FadeSection>
  );
}

function BrowseByClass({
  brandId,
  brandName,
  models,
}: {
  brandId: string;
  brandName: string;
  models: Model[];
}) {
  const families = useMemo(() => {
    const map = new Map<string, { count: number; priceFrom: number; bodyType: string; imageUrl?: string }>();
    models.forEach((m) => {
      if (!m.modelFamily) return;
      const existing = map.get(m.modelFamily);
      if (existing) {
        existing.count++;
        existing.priceFrom = Math.min(existing.priceFrom, m.startingPrice);
        if (!existing.imageUrl && m.imageUrl) existing.imageUrl = m.imageUrl;
      } else {
        map.set(m.modelFamily, { count: 1, priceFrom: m.startingPrice, bodyType: m.bodyType, imageUrl: m.imageUrl });
      }
    });
    return Array.from(map.entries());
  }, [models]);

  if (families.length === 0) return null;

  return (
    <FadeSection>
      <div className="bg-[#111318] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <p className="text-xs text-white/50 font-bold uppercase tracking-wider mb-2 text-center">
            Explore
          </p>
          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-center">
            Browse by Class
          </h3>
          <p className="text-sm text-white/60 text-center mb-10 max-w-lg mx-auto">
            Each {brandName} class offers a distinct driving experience
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {families.map(([family, info]) => (
              <EmbedAnchor
                key={family}
                href={`/browse?brand=${brandId}&family=${encodeURIComponent(family)}`}
                className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/25 transition-all duration-300 text-center"
              >
                <div className="overflow-hidden">
                  <div className="transition-transform duration-500 ease-out group-hover:scale-110">
                    <PlaceholderImage
                      aspectRatio="4/3"
                      bodyType={info.bodyType}
                      label=""
                      className="w-full"
                      imageUrl={info.imageUrl}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-white text-lg mb-1">{family}</h4>
                  <p className="text-xs text-white/40 mb-1.5">
                    {info.count} model{info.count !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-white/60">
                    From <span className="text-white font-bold">{formatPrice(info.priceFrom)}</span> KWD
                  </p>
                </div>
              </EmbedAnchor>
            ))}
          </div>
        </div>
      </div>
    </FadeSection>
  );
}

function BrandDetailsZone({
  brandId,
  brandName,
  allModels,
}: {
  brandId: string;
  brandName: string;
  allModels: Model[];
}) {
  const editorial = getBrandEditorial(brandId);
  const brand = getBrandById(brandId);
  if (!editorial) return null;

  // Pick representative images from available models
  const heritageImage = allModels[0]?.imageUrl;
  const innovationImage = allModels[Math.min(1, allModels.length - 1)]?.imageUrl;

  return (
    <div className="border-t border-[#E2E8F0]">
      {/* About the Brand */}
      <FadeSection className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="rounded-2xl overflow-hidden bg-[#F1F5F9]">
              <PlaceholderImage aspectRatio="4/3" label="" className="w-full" imageUrl={heritageImage} />
            </div>
            <div>
              <p className="text-xs text-[#1A56DB] font-bold uppercase tracking-wider mb-2">
                {editorial.heritage.title}
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-4">
                {brand?.tagline}
              </h3>
              <p className="text-base text-[#64748B] leading-relaxed mb-5">
                {editorial.heritage.description}
              </p>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="w-12 h-12 rounded-lg bg-[#1A56DB]/10 flex items-center justify-center shrink-0">
                  <span className="text-[#1A56DB] font-bold text-sm">{editorial.heritage.founded}</span>
                </div>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {editorial.heritage.milestone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeSection>

      {/* Featured Models (dark section) */}
      <FeaturedModelsSection models={allModels} brandName={brandName} brandId={brandId} />

      {/* Discover by Body Type */}
      <DiscoverByBodyType brandId={brandId} brandName={brandName} models={allModels} />

      {/* Browse by Class */}
      <BrowseByClass brandId={brandId} brandName={brandName} models={allModels} />

      {/* Innovation / Technology (dark section) */}
      <FadeSection>
        <div className="bg-[#111318] text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <p className="text-xs text-white/50 font-bold uppercase tracking-wider mb-2">Technology & Innovation</p>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{editorial.innovationTitle}</h3>
                <p className="text-base text-white/70 leading-relaxed mb-6">
                  {editorial.innovationDescription}
                </p>
                {editorial.sustainability && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Sustainability</span>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {editorial.sustainability}
                    </p>
                  </div>
                )}
              </div>
              <div className="rounded-2xl overflow-hidden">
                <PlaceholderImage aspectRatio="4/3" label="" className="w-full" imageUrl={innovationImage} />
              </div>
            </div>
          </div>
        </div>
      </FadeSection>

      {/* Services */}
      <FadeSection className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <p className="text-xs text-[#1A56DB] font-bold uppercase tracking-wider mb-2 text-center">Get Started</p>
          <h3 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-8 text-center">Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editorial.serviceLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="group flex items-start gap-4 p-5 md:p-6 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#1A56DB] hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[#1A56DB]/10 flex items-center justify-center shrink-0 text-[#1A56DB]">
                  {serviceIcons[link.icon] || <Car className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-[#1E293B] mb-1">{link.title}</h4>
                  <p className="text-sm text-[#64748B] leading-relaxed">{link.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#1A56DB] mt-1 ml-auto shrink-0 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* Full Lineup CTA */}
      <FadeSection>
        <div className="bg-[#F8FAFC] border-t border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-[#1E293B] mb-2">
              Explore the Full {brandName} Lineup
            </h3>
            <p className="text-sm text-[#64748B] mb-6">
              View all models side by side with detailed specs, prices, and trims
            </p>
            <EmbedAnchor
              href={`/browse?brand=${brandId}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A56DB] text-white font-bold text-sm rounded-xl hover:bg-[#1A56DB]/90 transition-colors"
            >
              View All Models
              <ArrowRight className="w-4 h-4" />
            </EmbedAnchor>
          </div>
        </div>
      </FadeSection>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page Content
// ---------------------------------------------------------------------------

type FilterMode = "bodyType" | "class";

function BrandShowcaseContent({ brandId }: { brandId: string }) {
  const brand = getBrandById(brandId);
  const compare = useCompare();
  const allBrandModels = useMemo(() => getModelsByBrandSegmentOrder(brandId), [brandId]);

  // Derive available body types and model families
  const availableBodyTypes = useMemo(() => {
    const types = new Set(allBrandModels.map((m) => m.bodyType));
    return Array.from(types);
  }, [allBrandModels]);

  const availableFamilies = useMemo(() => {
    const families = new Set(allBrandModels.map((m) => m.modelFamily).filter(Boolean) as string[]);
    return Array.from(families);
  }, [allBrandModels]);

  // Filter mode toggle
  const [filterMode, setFilterMode] = useState<FilterMode>("bodyType");

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [PRICE_MIN, PRICE_MAX],
    bodyTypes: [],
    fuelTypes: [],
    transmissions: [],
    driveTypes: [],
    seating: [],
    specRegions: [],
    brands: [],
  });
  const [activeFamilies, setActiveFamilies] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const toggleBodyType = useCallback((bt: string) => {
    setFilters((prev) => {
      const current = prev.bodyTypes;
      const next = current.includes(bt)
        ? current.filter((t) => t !== bt)
        : [...current, bt];
      return { ...prev, bodyTypes: next };
    });
  }, []);

  const toggleFamily = useCallback((family: string) => {
    setActiveFamilies((prev) =>
      prev.includes(family) ? prev.filter((f) => f !== family) : [...prev, family]
    );
  }, []);

  const clearFamilies = useCallback(() => setActiveFamilies([]), []);

  // When switching filter mode, clear the other mode's selections
  const handleFilterModeChange = useCallback((mode: FilterMode) => {
    setFilterMode(mode);
    if (mode === "bodyType") {
      setActiveFamilies([]);
    } else {
      setFilters((prev) => ({ ...prev, bodyTypes: [] }));
    }
  }, []);

  // Filter models
  const filteredModels = useMemo(() => {
    let result = filterModels(allBrandModels, filters);
    // Apply family filter on top
    if (activeFamilies.length > 0) {
      result = result.filter((m) => m.modelFamily && activeFamilies.includes(m.modelFamily));
    }
    return result.sort((a, b) => (a.segmentOrder ?? 999) - (b.segmentOrder ?? 999));
  }, [allBrandModels, filters, activeFamilies]);

  if (!brand) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-[#64748B]">Brand not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar compareCount={compare.totalCount} />

      {/* Brand Hero */}
      <BrandHero brandName={brand.name} logoUrl={brand.logoUrl} heroImages={allBrandModels.slice(0, 3).map(m => m.imageUrl).filter(Boolean) as string[]} />

      {/* Navigation bar (breadcrumb + back) */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 pt-4">
        <nav className="hidden md:flex items-center gap-1.5 text-xs text-[#64748B]">
          <EmbedAnchor href="/" className="flex items-center gap-1 hover:text-[#1A56DB] transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </EmbedAnchor>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1E293B] font-medium">{brand.name}</span>
        </nav>
        <div className="md:hidden">
          <EmbedAnchor href="/" className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#1A56DB] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </EmbedAnchor>
        </div>
      </div>

      {/* Model Showcase */}
      {filteredModels.length > 0 ? (
        <ModelShowcase
          models={filteredModels}
          brandName={brand.name}
          filterMode={filterMode}
          onFilterModeChange={handleFilterModeChange}
          availableBodyTypes={availableBodyTypes}
          activeBodyTypes={filters.bodyTypes}
          onToggleBodyType={toggleBodyType}
          availableFamilies={availableFamilies}
          activeFamilies={activeFamilies}
          onToggleFamily={toggleFamily}
          onClearFamilies={clearFamilies}
          onFilterOpen={() => setFilterOpen(true)}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 mb-4 rounded-full bg-[#F1F5F9] flex items-center justify-center">
            <SlidersHorizontal className="w-10 h-10 text-[#64748B]" />
          </div>
          <h2 className="font-bold text-lg text-[#1E293B] mb-2">No models match your filters</h2>
          <p className="text-sm text-[#64748B] mb-4">Try adjusting your criteria</p>
          <button
            onClick={() => {
              setFilters({
                priceRange: [PRICE_MIN, PRICE_MAX],
                bodyTypes: [],
                fuelTypes: [],
                transmissions: [],
                driveTypes: [],
                seating: [],
                specRegions: [],
                brands: [],
              });
              setActiveFamilies([]);
            }}
            className="px-5 py-2.5 bg-[#1A56DB] text-white text-sm font-bold rounded-xl hover:bg-[#1A56DB]/90 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Brand Details */}
      <BrandDetailsZone brandId={brandId} brandName={brand.name} allModels={allBrandModels} />

      {/* Filter Modal */}
      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        resultCount={filteredModels.length}
      />

      <Footer />
      <MobileTabBar activeTab="search" compareCount={compare.totalCount} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page Export
// ---------------------------------------------------------------------------

export default function BrandShowcasePage({ brandId }: { brandId: string }) {
  return (
    <CompareProvider>
      <BrandShowcaseContent brandId={brandId} />
    </CompareProvider>
  );
}
