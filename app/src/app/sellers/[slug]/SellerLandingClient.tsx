"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
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
import type { ComparisonItem } from "@/components/ComparisonTray";
import PlaceholderImage from "@/components/PlaceholderImage";
import { EmbedAnchor } from "@/components/EmbedLink";
import { useHistoryState } from "@/hooks/useHistoryState";
import { CompareProvider, useCompare } from "@/context/CompareContext";
import { useAppData } from "@/context/AppDataContext";
import { useLanguage, tFormat } from "@/context/LanguageContext";
import type { Brand, Model, SellerListing, SortBy } from "@/data/types";

const ITEMS_PER_PAGE = 12;

const SORT_VALUES: SortBy[] = ["price-asc", "price-desc", "newest", "popular", "horsepower"];

interface EnrichedListing {
  listing: SellerListing;
  model: Model;
  brand: Brand;
}

function listingToCardData(e: EnrichedListing, sellerSlug: string): ModelData & { __hrefOverride: string } {
  const { listing, model, brand } = e;
  return {
    id: listing.id,
    name: model.name,
    brandId: model.brandId,
    brandName: brand.name,
    brandLogoUrl: brand.logoUrl,
    bodyType: model.bodyType,
    startingPrice: listing.price,
    engineRange: model.specsSummary.engineRange,
    hpRange: model.specsSummary.hpRange,
    fuelType: model.specsSummary.fuelTypes.join(", "),
    trimCount: model.trimCount,
    isNew: model.isNew,
    isUpdated: model.isUpdated,
    imageUrl: listing.thumbnailUrl ?? model.imageUrl,
    __hrefOverride: `/sellers/${sellerSlug}/listings/${listing.trimId}`,
  };
}

export default function SellerLandingClient({ slug }: { slug: string }) {
  return (
    <CompareProvider>
      <Inner slug={slug} />
    </CompareProvider>
  );
}

/** sessionStorage tag the listing detail page reads to decide whether the
 *  "Back to seller" link can safely use browser back (so saved scroll +
 *  filter state is restored) versus pushing a new entry. */
const SELLER_ORIGIN_KEY = "__sellerPageOrigin";

function Inner({ slug }: { slug: string }) {
  const {
    getSellerBySlug,
    getListingsBySeller,
    getModelById,
    getBrandById,
    filterModels,
    sortModels,
    loading,
  } = useAppData();

  // Tag this seller page in sessionStorage so the listing detail's back link
  // knows browser back will land here.
  useEffect(() => {
    try {
      sessionStorage.setItem(SELLER_ORIGIN_KEY, `${slug}|${Date.now()}`);
    } catch {
      /* sessionStorage may be unavailable in some embedded contexts */
    }
  }, [slug]);
  const { t, dir, ln } = useLanguage();
  const compare = useCompare();

  const SORT_OPTIONS = SORT_VALUES.map((value) => ({ value, label: t.browse.sortBy[value] }));

  const seller = getSellerBySlug(slug);

  // One enriched entry per listing (some listings share a model).
  const enrichedListings = useMemo<EnrichedListing[]>(() => {
    if (!seller) return [];
    const out: EnrichedListing[] = [];
    for (const listing of getListingsBySeller(seller.id)) {
      const model = getModelById(listing.modelId);
      if (!model) continue;
      const brand = getBrandById(model.brandId);
      if (!brand) continue;
      out.push({ listing, model, brand });
    }
    return out;
  }, [seller, getListingsBySeller, getModelById, getBrandById]);

  // Unique models -- used as the filter input so brand/body/fuel facets work
  // on the underlying catalogue, not on duplicate per-listing rows.
  const baseModels = useMemo<Model[]>(() => {
    const seen = new Set<string>();
    const out: Model[] = [];
    for (const { model } of enrichedListings) {
      if (seen.has(model.id)) continue;
      seen.add(model.id);
      out.push(model);
    }
    return out;
  }, [enrichedListings]);

  // If every model is from the same brand, hide the brand facet (it's noise).
  const hideBrands = useMemo(() => {
    if (baseModels.length === 0) return false;
    const first = baseModels[0]!.brandId;
    return baseModels.every((m) => m.brandId === first);
  }, [baseModels]);

  const initialFilters: FilterState = useMemo(
    () => ({
      priceRange: [PRICE_MIN, PRICE_MAX],
      bodyTypes: [],
      fuelTypes: [],
      transmissions: [],
      driveTypes: [],
      seating: [],
      specRegions: [],
      brands: [],
    }),
    [],
  );

  const [filters, setFiltersRaw] = useHistoryState<FilterState>(`seller:${slug}:filters`, initialFilters);
  const [sort, setSortRaw] = useHistoryState<SortBy>(`seller:${slug}:sort`, "popular");
  const [view, setView] = useHistoryState<"carousel" | "grid">(`seller:${slug}:view`, "grid");
  const [page, setPage] = useHistoryState<number>(`seller:${slug}:page`, 1);
  const [selectedIdsArr, setSelectedIdsArr] = useHistoryState<string[]>(`seller:${slug}:selectedIds`, []);

  const setFilters = useCallback(
    (v: FilterState | ((prev: FilterState) => FilterState)) => {
      setFiltersRaw(v);
      setPage(1);
    },
    [setFiltersRaw, setPage],
  );
  const setSort = useCallback(
    (v: SortBy | ((prev: SortBy) => SortBy)) => {
      setSortRaw(v);
      setPage(1);
    },
    [setSortRaw, setPage],
  );
  const selectedIds = useMemo(() => new Set(selectedIdsArr), [selectedIdsArr]);
  const setSelectedIds = useCallback(
    (updater: Set<string> | ((prev: Set<string>) => Set<string>)) => {
      setSelectedIdsArr((prev) => {
        const prevSet = new Set(prev);
        const next = typeof updater === "function" ? updater(prevSet) : updater;
        return Array.from(next);
      });
    },
    [setSelectedIdsArr],
  );

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Filter at the model level, then keep listings whose model passes. For
  // price sorts, sort listings directly by listing.price (more useful to a
  // buyer than the model's startingPrice). For non-price sorts, fall back to
  // the model-level order via sortModels.
  const filteredListings = useMemo(() => {
    const passIds = new Set(filterModels(baseModels, filters).map((m) => m.id));
    const passing = enrichedListings.filter((e) => passIds.has(e.model.id));
    if (sort === "price-asc") return [...passing].sort((a, b) => a.listing.price - b.listing.price);
    if (sort === "price-desc") return [...passing].sort((a, b) => b.listing.price - a.listing.price);
    const modelOrder = new Map(sortModels(baseModels, sort).map((m, i) => [m.id, i]));
    return [...passing].sort(
      (a, b) => (modelOrder.get(a.model.id) ?? 0) - (modelOrder.get(b.model.id) ?? 0),
    );
  }, [enrichedListings, baseModels, filters, sort, filterModels, sortModels]);

  const paginatedListings = useMemo(
    () => filteredListings.slice(0, page * ITEMS_PER_PAGE),
    [filteredListings, page],
  );
  const hasMore = paginatedListings.length < filteredListings.length;

  const cardItems = useMemo(
    () => paginatedListings.map((e) => listingToCardData(e, slug)),
    [paginatedListings, slug],
  );

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        if (next.size >= 4) return prev;
        next.add(id);
      }
      return next;
    });
  }, [setSelectedIds]);

  const clearSelection = () => setSelectedIds(new Set());

  // Selected ids are listing ids. Look up via enrichedListings.
  const selectionItems: ComparisonItem[] = useMemo(() => {
    return Array.from(selectedIds)
      .map((id) => {
        const e = enrichedListings.find((x) => x.listing.id === id);
        if (!e) return null;
        const brandLabel = ln.brand(e.brand.name);
        return {
          id: e.listing.id,
          name: ln.model(e.model.name),
          trimName: `${brandLabel} ${ln.model(e.model.name)}`,
        };
      })
      .filter((x): x is ComparisonItem => x !== null);
  }, [selectedIds, enrichedListings, ln]);

  // For the compare URL we need underlying model ids (compare page works on
  // models, not listings).
  const selectedModelIds = useMemo(() => {
    const ids: string[] = [];
    const seen = new Set<string>();
    for (const id of selectedIds) {
      const e = enrichedListings.find((x) => x.listing.id === id);
      if (!e || seen.has(e.model.id)) continue;
      seen.add(e.model.id);
      ids.push(e.model.id);
    }
    return ids;
  }, [selectedIds, enrichedListings]);

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? t.browse.sort;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!seller) return null;

  const description = seller.about?.body ?? seller.tagline ?? "";
  const primaryDark = seller.brandColorDark ?? seller.brandColor;
  const heroMedia = seller.heroMedia ?? (seller.heroImages?.[0] ? { type: "image" as const, url: seller.heroImages[0] } : undefined);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar compareCount={compare.totalCount} />

      {/* Seller brand strip -- matches the strip on the listing detail page,
          gives the page instant brand presence in the seller's colour. */}
      <div className="w-full" style={{ background: primaryDark }}>
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-3 flex items-center gap-3">
          <span className="inline-flex items-center justify-center rounded-md bg-white p-1.5 shrink-0">
            <Image
              src={seller.logoUrl}
              alt={seller.name}
              width={80}
              height={20}
              className="h-5 w-auto object-contain"
              unoptimized
            />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-white/70 leading-tight">
              {t.sellers.listingsLabel}
            </p>
            <p className="text-sm text-white font-bold leading-tight truncate">
              {seller.name}
            </p>
          </div>
          {seller.tagline && (
            <p className="hidden md:block text-xs text-white/80 max-w-xs truncate text-end">
              {seller.tagline}
            </p>
          )}
        </div>
      </div>

      {/* Slim brand banner -- atmosphere, not a full hero. Keeps the first row
          of cards visible above the fold on mobile. */}
      {heroMedia && (
        <div className="relative w-full h-48 md:h-72 bg-[#0F1B2D] overflow-hidden">
          {heroMedia.type === "video" ? (
            <video
              src={heroMedia.url}
              poster={heroMedia.poster}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <Image
              src={heroMedia.url}
              alt={seller.name}
              fill
              sizes="100vw"
              priority
              className="object-cover"
              unoptimized
            />
          )}
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 pt-4 pb-32">
        {/* Breadcrumb -- desktop */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs text-[#64748B] mb-4">
          <EmbedAnchor href="/" className="flex items-center gap-1 hover:text-[#1A56DB] transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>{t.common.home}</span>
          </EmbedAnchor>
          <ChevronRight className={`w-3 h-3 ${dir === "rtl" ? "rotate-180" : ""}`} />
          <span className="text-[#1E293B] font-medium">{seller.name}</span>
        </nav>
        {/* Mobile back */}
        <div className="md:hidden mb-3">
          <EmbedAnchor href="/" className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#1A56DB] transition-colors">
            <ArrowLeft className={`w-3.5 h-3.5 ${dir === "rtl" ? "rotate-180" : ""}`} />
            <span>{t.common.backToHome}</span>
          </EmbedAnchor>
        </div>

        {/* Page Header -- replaces browse's "All cars" with logo + seller name + description */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shrink-0 flex items-center justify-center overflow-hidden ring-1 ring-[#E2E8F0] shadow-sm">
              <Image
                src={seller.logoUrl}
                alt={`${seller.name} logo`}
                width={48}
                height={48}
                className="object-contain w-10 h-10 md:w-12 md:h-12"
                unoptimized
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-xl md:text-2xl text-[#1E293B] leading-tight">
                {seller.name}
              </h1>
              {description && <ExpandableDescription text={description} />}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between">
            <span className="text-sm text-[#64748B]" suppressHydrationWarning>
              {t.browse.showing} {filteredListings.length}{" "}
              {filteredListings.length !== 1 ? t.common.models : t.common.model}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] hover:border-[#1A56DB] transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {t.browse.filters}
              </button>

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

              <div className="flex items-center border border-[#E2E8F0] rounded-lg overflow-hidden">
                <button
                  onClick={() => setView("carousel")}
                  className={`p-2 transition-colors ${
                    view === "carousel"
                      ? "bg-[#1A56DB] text-white"
                      : "bg-white text-[#64748B] hover:text-[#1E293B]"
                  }`}
                  aria-label={t.browse.sort}
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
                  aria-label={t.browse.filters}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Body: sidebar + content */}
        <div className="flex gap-6">
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-20 bg-white rounded-lg border border-[#E2E8F0] p-4 max-h-[calc(100vh-6rem)] overflow-y-auto styled-scrollbar">
              <FilterPanel filters={filters} onChange={setFilters} hideBrands={hideBrands} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {cardItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 mb-4 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                  <SlidersHorizontal className="w-10 h-10 text-[#64748B]" />
                </div>
                <h2 className="font-bold text-lg text-[#1E293B] mb-2">
                  {t.browse.noResults}
                </h2>
                <p className="text-sm text-[#64748B] mb-4">&nbsp;</p>
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
                  {t.common.clear} {t.common.filters}
                </button>
              </div>
            ) : view === "carousel" ? (
              <Carousel
                items={cardItems}
                selectedIds={selectedIds}
                onSelect={toggleSelection}
              />
            ) : (
              <div
                key={`grid-${cardItems.length}`}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {cardItems.map((item) => (
                  <ModelCard
                    key={item.id}
                    model={item}
                    isSelected={selectedIds.has(item.id)}
                    onSelect={toggleSelection}
                    hrefOverride={item.__hrefOverride}
                    imageFit="contain"
                  />
                ))}
              </div>
            )}

            {hasMore && cardItems.length > 0 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-8 py-3 border-2 border-[#1A56DB] text-[#1A56DB] text-sm font-bold rounded-xl hover:bg-[#1A56DB] hover:text-white transition-colors"
                >
                  {t.browse.loadMore}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <MobileFilterSheet
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onChange={setFilters}
        resultCount={filteredListings.length}
        hideBrands={hideBrands}
      />

      {/* Desktop selection bar */}
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
                    aria-label={`${t.compare.removeCar} ${item.trimName}`}
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
                {t.common.clear}
              </button>
              <EmbedAnchor
                href={`/compare?ids=${selectedModelIds.join(",")}`}
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-colors ${
                  selectedIds.size >= 2
                    ? "bg-[#1A56DB] text-white hover:bg-[#1A56DB]/90"
                    : "bg-[#1A56DB]/40 text-white cursor-not-allowed pointer-events-none"
                }`}
              >
                {t.common.compare}
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
              <span className="text-sm font-bold text-[#1E293B]">{selectedIds.size}</span>
              <button
                onClick={clearSelection}
                className="text-xs text-[#64748B] hover:text-[#EF4444] transition-colors"
              >
                {t.common.clear}
              </button>
            </div>
            <EmbedAnchor
              href={`/compare?ids=${selectedModelIds.join(",")}`}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors ${
                selectedIds.size >= 2
                  ? "bg-[#1A56DB] text-white"
                  : "bg-[#1A56DB]/40 text-white pointer-events-none"
              }`}
            >
              {t.common.compare}
            </EmbedAnchor>
          </div>
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
      <MobileTabBar activeTab="search" compareCount={compare.totalCount} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Carousel -- identical to browse
// ---------------------------------------------------------------------------

type CarouselItem = ModelData & { __hrefOverride?: string };

function Carousel({
  items,
  selectedIds,
  onSelect,
}: {
  items: CarouselItem[];
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileCardW, setMobileCardW] = useState(300);
  const { t, dir } = useLanguage();

  useEffect(() => {
    function measure() {
      setMobileCardW(window.innerWidth * 0.82 + 12);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [items.length]);

  const maxIndex = Math.max(0, items.length - 1);
  const goTo = useCallback(
    (idx: number) => setCurrentIndex(Math.max(0, Math.min(idx, maxIndex))),
    [maxIndex],
  );
  const prev = () => goTo(currentIndex - 1);
  const next = () => goTo(currentIndex + 1);

  const CARD_WIDTH_DESKTOP = 360;
  const GAP_DESKTOP = 16;
  const CARD_UNIT_DESKTOP = CARD_WIDTH_DESKTOP + GAP_DESKTOP;

  return (
    <div className="relative">
      <div className="hidden md:block overflow-hidden">
        <motion.div
          className="flex gap-4"
          animate={{ x: -(currentIndex * CARD_UNIT_DESKTOP) }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {items.map((item, i) => {
            const isCenter = i === currentIndex;
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
                <ModelCard model={item} isSelected={selectedIds.has(item.id)} onSelect={onSelect} hrefOverride={item.__hrefOverride} imageFit="contain" />
              </motion.div>
            );
          })}
        </motion.div>

        {currentIndex > 0 && (
          <button
            onClick={prev}
            className="absolute start-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-lg border border-[#E2E8F0] text-[#1E293B] hover:bg-white transition-colors"
            aria-label={t.common.previous}
          >
            <ChevronLeft className={`w-5 h-5 ${dir === "rtl" ? "rotate-180" : ""}`} />
          </button>
        )}
        {currentIndex < maxIndex && (
          <button
            onClick={next}
            className="absolute end-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-lg border border-[#E2E8F0] text-[#1E293B] hover:bg-white transition-colors"
            aria-label={t.common.next}
          >
            <ChevronRight className={`w-5 h-5 ${dir === "rtl" ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

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
          animate={{ x: -(currentIndex * mobileCardW) }}
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
              <ModelCard model={item} isSelected={selectedIds.has(item.id)} onSelect={onSelect} />
            </motion.div>
          ))}
        </motion.div>
      </div>

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
// Mobile filter sheet -- identical to browse
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
  const { t } = useLanguage();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-2xl max-h-[85vh] flex flex-col"
          >
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 rounded-full bg-[#E2E8F0]" />
            </div>
            <div className="flex items-center justify-between px-4 pb-3 border-b border-[#E2E8F0]">
              <h2 className="font-bold text-[#1E293B]">{t.common.filters}</h2>
              <button onClick={onClose} className="p-1 text-[#64748B]" aria-label={t.common.close}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 styled-scrollbar">
              <FilterPanel filters={filters} onChange={onChange} hideBrands={hideBrands} />
            </div>
            <div className="px-4 py-3 border-t border-[#E2E8F0]">
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#1A56DB] text-white font-bold text-sm rounded-xl"
              >
                {tFormat(t.browse.showRange, { count: resultCount })}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Expandable description -- clamps to 2 lines on mobile, full on desktop.
// Shows a "See more / See less" toggle only when the text actually overflows
// in the clamped state.
// ---------------------------------------------------------------------------

function ExpandableDescription({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      if (!mobile) {
        setOverflows(false);
        return;
      }
      // Only trust the measurement while the clamp is actually applied.
      if (el.classList.contains("line-clamp-2")) {
        setOverflows(el.scrollHeight > el.clientHeight + 1);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [text]);

  return (
    <div className="mt-1">
      <p
        ref={ref}
        className={`text-sm text-[#64748B] leading-relaxed ${
          expanded ? "" : "line-clamp-2 md:line-clamp-none"
        }`}
      >
        {text}
      </p>
      {overflows && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="md:hidden mt-1 text-xs font-bold text-[#1A56DB] hover:underline"
        >
          {expanded ? t.common.seeLess : t.common.seeMore}
        </button>
      )}
    </div>
  );
}
