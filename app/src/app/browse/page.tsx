"use client";

import { useState, useMemo, useCallback, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal, X, ChevronLeft, ChevronRight,
  LayoutGrid, GalleryHorizontalEnd, ChevronDown, Home, ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileTabBar from "@/components/MobileTabBar";
import ModelCard, { type ModelData } from "@/components/ModelCard";
import FilterPanel, { type FilterState, PRICE_MIN, PRICE_MAX } from "@/components/FilterPanel";
import ComparisonTray, { type ComparisonItem } from "@/components/ComparisonTray";
import PlaceholderImage from "@/components/PlaceholderImage";
import { EmbedAnchor } from "@/components/EmbedLink";
import { useIsEmbedded } from "@/hooks/useIsEmbedded";
import { appendEmbedParam } from "@/hooks/useEmbedHref";
import { CompareProvider, useCompare } from "@/context/CompareContext";
import { models as allModelsRaw } from "@/data/mock-data";
import {
  getBrandById,
  getModelsByBrand,
  getModelsByBodyType,
  getModelsByLifestyleCollection,
  getCollectionById,
  filterModels,
  sortModels,
} from "@/data/helpers";
import type { Model, SortBy } from "@/data/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ITEMS_PER_PAGE = 12;

function modelToCardData(m: Model): ModelData {
  const brand = getBrandById(m.brandId);
  return {
    id: m.id,
    name: m.name,
    brandName: brand?.name ?? "",
    bodyType: m.bodyType,
    startingPrice: m.startingPrice,
    engineRange: m.specsSummary.engineRange,
    hpRange: m.specsSummary.hpRange,
    fuelType: m.specsSummary.fuelTypes.join(", "),
    trimCount: m.trimCount,
    isNew: m.isNew,
    isUpdated: m.isUpdated,
  };
}

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "horsepower", label: "Horsepower" },
];

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------------------------------------------------------------------------
// Carousel component
// ---------------------------------------------------------------------------

function Carousel({
  items,
  selectedIds,
  onSelect,
}: {
  items: ModelData[];
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileCardW, setMobileCardW] = useState(300);

  // Measure mobile card width from viewport
  useEffect(() => {
    function measure() {
      setMobileCardW(window.innerWidth * 0.82 + 12);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Reset index when items change
  useEffect(() => {
    setCurrentIndex(0);
  }, [items.length]);

  const maxIndex = Math.max(0, items.length - 1);

  const goTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(idx, maxIndex));
      setCurrentIndex(clamped);
    },
    [maxIndex]
  );

  const prev = () => goTo(currentIndex - 1);
  const next = () => goTo(currentIndex + 1);

  // Desktop: show 3, offset by card width + gap
  // Mobile: show 1 with peek
  const CARD_WIDTH_DESKTOP = 360;
  const GAP_DESKTOP = 16;
  const CARD_UNIT_DESKTOP = CARD_WIDTH_DESKTOP + GAP_DESKTOP;

  return (
    <div className="relative">
      {/* Desktop Carousel */}
      <div className="hidden md:block overflow-hidden">
        <motion.div
          className="flex gap-4"
          animate={{ x: -(currentIndex * CARD_UNIT_DESKTOP) }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {items.map((item, i) => {
            const distFromCenter = Math.abs(i - currentIndex);
            const isCenter = distFromCenter === 0;
            return (
              <motion.div
                key={item.id}
                className="shrink-0"
                style={{ width: CARD_WIDTH_DESKTOP }}
                animate={{
                  scale: isCenter ? 1 : 0.95,
                  opacity: isCenter ? 1 : 0.75,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <ModelCard
                  model={item}
                  isSelected={selectedIds.has(item.id)}
                  onSelect={onSelect}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={prev}
            className="absolute start-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-lg border border-[#E2E8F0] text-[#1E293B] hover:bg-white transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {currentIndex < maxIndex && (
          <button
            onClick={next}
            className="absolute end-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-lg border border-[#E2E8F0] text-[#1E293B] hover:bg-white transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mobile Carousel -- swipe */}
      <div className="md:hidden overflow-hidden">
        <motion.div
          className="flex gap-3 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{
            left: -(items.length - 1) * mobileCardW,
            right: 0,
          }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            const swipe = info.offset.x;
            if (swipe < -50) goTo(currentIndex + Math.max(1, Math.round(Math.abs(swipe) / mobileCardW)));
            else if (swipe > 50) goTo(currentIndex - Math.max(1, Math.round(swipe / mobileCardW)));
          }}
          animate={{
            x: -(currentIndex * mobileCardW),
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              className="shrink-0"
              style={{ width: "82vw" }}
              animate={{
                scale: i === currentIndex ? 1 : 0.95,
                opacity: i === currentIndex ? 1 : 0.7,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <ModelCard
                model={item}
                isSelected={selectedIds.has(item.id)}
                onSelect={onSelect}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Progress bar */}
      {items.length > 1 && (
        <div className="mt-4 flex justify-center">
          <div className="h-1 w-32 bg-[#E2E8F0] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#1A56DB] rounded-full"
              animate={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Brand Hero
// ---------------------------------------------------------------------------

function BrandHero({ brandName, brandId }: { brandName: string; brandId: string }) {
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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStart.current - touchEnd.current;
    const threshold = 50;
    if (diff > threshold) {
      setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
      resetAutoPlay();
    } else if (diff < -threshold) {
      setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
      resetAutoPlay();
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-[#E2E8F0]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PlaceholderImage
            aspectRatio="21/9"
            className="w-full"
            label={labels[current]}
          />
        </motion.div>
      </AnimatePresence>

      {/* Brand name overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex items-end">
        <div className="px-4 md:px-6 pb-5 md:pb-7 max-w-7xl mx-auto w-full flex items-center gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-lg flex items-center justify-center shrink-0">
            <span className="text-[#1E293B] font-bold text-base md:text-xl">
              {brandName.substring(0, 2).toUpperCase()}
            </span>
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
            onClick={() => {
              setCurrent(i);
              resetAutoPlay();
            }}
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
// Mobile filter sheet
// ---------------------------------------------------------------------------

function MobileFilterSheet({
  open,
  onClose,
  filters,
  onChange,
  resultCount,
  hideBrands,
}: {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (f: FilterState) => void;
  resultCount: number;
  hideBrands: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-2xl max-h-[85vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 rounded-full bg-[#E2E8F0]" />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-[#E2E8F0]">
              <h2 className="font-bold text-[#1E293B]">Filters</h2>
              <button onClick={onClose} className="p-1 text-[#64748B]" aria-label="Close filters">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 styled-scrollbar">
              <FilterPanel filters={filters} onChange={onChange} hideBrands={hideBrands} />
            </div>
            {/* Footer */}
            <div className="px-4 py-3 border-t border-[#E2E8F0]">
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#1A56DB] text-white font-bold text-sm rounded-xl"
              >
                Show {resultCount} Result{resultCount !== 1 ? "s" : ""}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Inner page content (uses useSearchParams)
// ---------------------------------------------------------------------------

function BrowsePageContent() {
  const searchParams = useSearchParams();
  const brandParam = searchParams.get("brand");
  const bodyParam = searchParams.get("body");
  const collectionParam = searchParams.get("collection");

  const compare = useCompare();

  // Resolve base model set
  const { baseModels, pageTitle, breadcrumbLabel } = useMemo(() => {
    if (collectionParam) {
      const col = getCollectionById(collectionParam);
      if (col) {
        return {
          baseModels: getModelsByLifestyleCollection(collectionParam),
          pageTitle: col.title,
          breadcrumbLabel: col.title,
        };
      }
    }
    if (brandParam) {
      const brand = getBrandById(brandParam);
      if (brand) {
        return {
          baseModels: getModelsByBrand(brandParam),
          pageTitle: brand.name,
          breadcrumbLabel: brand.name,
        };
      }
    }
    if (bodyParam) {
      const bodyName = capitalize(bodyParam);
      return {
        baseModels: getModelsByBodyType(bodyName),
        pageTitle: bodyName,
        breadcrumbLabel: bodyName,
      };
    }
    return {
      baseModels: allModelsRaw,
      pageTitle: "All Cars",
      breadcrumbLabel: "All Cars",
    };
  }, [brandParam, bodyParam, collectionParam]);

  // Filters
  const initialFilters: FilterState = useMemo(() => {
    const f: FilterState = {
      priceRange: [PRICE_MIN, PRICE_MAX],
      bodyTypes: bodyParam ? [capitalize(bodyParam)] : [],
      fuelTypes: [],
      transmissions: [],
      driveTypes: [],
      seating: [],
      specRegions: [],
      brands: brandParam ? (() => { const b = getBrandById(brandParam); return b ? [b.name] : []; })() : [],
    };
    return f;
  }, [brandParam, bodyParam]);

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sort, setSort] = useState<SortBy>("popular");
  const [view, setView] = useState<"carousel" | "grid">("grid");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Reset page when filters/sort change
  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  // Filtered + sorted models
  const filteredModels = useMemo(() => {
    const filtered = filterModels(baseModels, filters);
    return sortModels(filtered, sort);
  }, [baseModels, filters, sort]);

  // Paginated
  const paginatedModels = useMemo(() => {
    return filteredModels.slice(0, page * ITEMS_PER_PAGE);
  }, [filteredModels, page]);

  const hasMore = paginatedModels.length < filteredModels.length;

  // Card data
  const cardItems = useMemo(() => paginatedModels.map(modelToCardData), [paginatedModels]);

  // Selection
  const toggleSelection = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (next.size >= 4) return prev;
          next.add(id);
        }
        return next;
      });
    },
    []
  );

  const clearSelection = () => setSelectedIds(new Set());

  // Build comparison tray items from selected IDs
  const selectionItems: ComparisonItem[] = useMemo(() => {
    return Array.from(selectedIds)
      .map((id) => {
        const m = allModelsRaw.find((mod) => mod.id === id);
        if (!m) return null;
        const brand = getBrandById(m.brandId);
        return { id: m.id, name: m.name, trimName: `${brand?.name ?? ""} ${m.name}` };
      })
      .filter((x): x is ComparisonItem => x !== null);
  }, [selectedIds]);

  const isEmbedded = useIsEmbedded();
  const hideBrands = !!brandParam;
  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Sort";

  const brandObj = brandParam ? getBrandById(brandParam) : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar compareCount={compare.items.length} />

      {/* Brand Hero -- full-width, only on brand pages */}
      {brandObj && <BrandHero brandName={brandObj.name} brandId={brandObj.id} />}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 pt-4 pb-32">
        {/* Breadcrumb -- desktop only */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs text-[#64748B] mb-4">
          <EmbedAnchor href="/" className="flex items-center gap-1 hover:text-[#1A56DB] transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </EmbedAnchor>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1E293B] font-medium">{breadcrumbLabel}</span>
        </nav>
        {/* Mobile back button */}
        <div className="md:hidden mb-3">
          <EmbedAnchor href="/" className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#1A56DB] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </EmbedAnchor>
        </div>

        {/* Page Header */}
        <div className="flex flex-col gap-3 mb-6">
          {!brandObj && (
            <h1 className="font-bold text-xl md:text-2xl text-[#1E293B]">{pageTitle}</h1>
          )}

          <div className="flex flex-wrap items-center gap-3 justify-between">
            {/* Result count */}
            <span className="text-sm text-[#64748B]">
              Showing {filteredModels.length} model{filteredModels.length !== 1 ? "s" : ""}
            </span>

            <div className="flex items-center gap-2">
              {/* Mobile filter button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] hover:border-[#1A56DB] transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] hover:border-[#1A56DB] transition-colors"
                >
                  {currentSortLabel}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute end-0 top-full mt-1 z-30 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1 min-w-[180px]"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSort(opt.value);
                            setSortOpen(false);
                          }}
                          className={`w-full text-start px-4 py-2 text-xs transition-colors ${
                            sort === opt.value
                              ? "bg-[#1A56DB]/10 text-[#1A56DB] font-bold"
                              : "text-[#1E293B] hover:bg-[#F1F5F9]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* View toggle */}
              <div className="flex items-center border border-[#E2E8F0] rounded-lg overflow-hidden">
                <button
                  onClick={() => setView("carousel")}
                  className={`p-2 transition-colors ${
                    view === "carousel"
                      ? "bg-[#1A56DB] text-white"
                      : "bg-white text-[#64748B] hover:text-[#1E293B]"
                  }`}
                  aria-label="Carousel view"
                >
                  <GalleryHorizontalEnd className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 transition-colors ${
                    view === "grid"
                      ? "bg-[#1A56DB] text-white"
                      : "bg-white text-[#64748B] hover:text-[#1E293B]"
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Body: sidebar + content */}
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-20 bg-white rounded-lg border border-[#E2E8F0] p-4 max-h-[calc(100vh-6rem)] overflow-y-auto styled-scrollbar">
              <FilterPanel filters={filters} onChange={setFilters} hideBrands={hideBrands} />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {cardItems.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 mb-4 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                  <SlidersHorizontal className="w-10 h-10 text-[#64748B]" />
                </div>
                <h2 className="font-bold text-lg text-[#1E293B] mb-2">
                  No models match your filters
                </h2>
                <p className="text-sm text-[#64748B] mb-4">
                  Try adjusting your criteria to see more results.
                </p>
                <button
                  onClick={() =>
                    setFilters({
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
                  className="px-5 py-2.5 bg-[#1A56DB] text-white text-sm font-bold rounded-xl hover:bg-[#1A56DB]/90 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : view === "carousel" ? (
              <Carousel
                items={cardItems}
                selectedIds={selectedIds}
                onSelect={toggleSelection}
              />
            ) : (
              /* Grid view */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cardItems.map((item) => (
                  <ModelCard
                    key={item.id}
                    model={item}
                    isSelected={selectedIds.has(item.id)}
                    onSelect={toggleSelection}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && cardItems.length > 0 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-8 py-3 border-2 border-[#1A56DB] text-[#1A56DB] text-sm font-bold rounded-xl hover:bg-[#1A56DB] hover:text-white transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile filter sheet */}
      <MobileFilterSheet
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onChange={setFilters}
        resultCount={filteredModels.length}
        hideBrands={hideBrands}
      />

      {/* Selection bar */}
      {selectedIds.size > 0 && (
        <div className="hidden md:block fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E2E8F0] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-[#1E293B]">
              {selectedIds.size} selected
            </span>
            <div className="flex items-center gap-3 flex-1 justify-center overflow-x-auto">
              {selectionItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 bg-[#F1F5F9] rounded-lg ps-1 pe-2 py-1 shrink-0"
                >
                  <div className="w-12 h-8 rounded overflow-hidden">
                    <PlaceholderImage aspectRatio="3/2" className="w-full h-full" />
                  </div>
                  <span className="text-xs font-medium text-[#1E293B] whitespace-nowrap">
                    {item.trimName}
                  </span>
                  <button
                    onClick={() => toggleSelection(item.id)}
                    className="p-0.5 rounded-full hover:bg-[#EF4444]/10 text-[#64748B] hover:text-[#EF4444] transition-colors"
                    aria-label={`Remove ${item.trimName}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={clearSelection}
                className="text-xs text-[#64748B] hover:text-[#EF4444] transition-colors"
              >
                Clear
              </button>
              <EmbedAnchor
                href={`/compare?ids=${Array.from(selectedIds).join(",")}`}
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-colors ${
                  selectedIds.size >= 2
                    ? "bg-[#1A56DB] text-white hover:bg-[#1A56DB]/90"
                    : "bg-[#1A56DB]/40 text-white cursor-not-allowed pointer-events-none"
                }`}
              >
                Compare Selected
              </EmbedAnchor>
            </div>
          </div>
        </div>
      )}

      {/* Mobile selection bar */}
      {selectedIds.size > 0 && (
        <div className="md:hidden fixed bottom-[60px] inset-x-0 z-40 bg-white border-t border-[#E2E8F0] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#1E293B]">
                {selectedIds.size} selected
              </span>
              <button
                onClick={clearSelection}
                className="text-xs text-[#64748B] hover:text-[#EF4444] transition-colors"
              >
                Clear
              </button>
            </div>
            <EmbedAnchor
              href={`/compare?ids=${Array.from(selectedIds).join(",")}`}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors ${
                selectedIds.size >= 2
                  ? "bg-[#1A56DB] text-white"
                  : "bg-[#1A56DB]/40 text-white pointer-events-none"
              }`}
            >
              Compare Selected
            </EmbedAnchor>
          </div>
          {/* Thumbnails */}
          <div className="flex items-center gap-2 mt-2 overflow-x-auto">
            {selectionItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-1.5 bg-[#F1F5F9] rounded-lg ps-1 pe-2 py-1 shrink-0"
              >
                <div className="w-10 h-7 rounded overflow-hidden">
                  <PlaceholderImage aspectRatio="3/2" className="w-full h-full" />
                </div>
                <span className="text-[10px] font-medium text-[#1E293B] whitespace-nowrap max-w-[80px] truncate">
                  {item.trimName}
                </span>
                <button
                  onClick={() => toggleSelection(item.id)}
                  className="p-0.5 text-[#64748B] hover:text-[#EF4444]"
                  aria-label={`Remove ${item.trimName}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
      <MobileTabBar activeTab="search" compareCount={compare.items.length} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page export -- wrapped in Suspense for useSearchParams
// ---------------------------------------------------------------------------

export default function BrowsePage() {
  return (
    <CompareProvider>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <BrowsePageContent />
      </Suspense>
    </CompareProvider>
  );
}
