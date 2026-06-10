"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Home, ChevronRight, ArrowLeft, Search, X } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileTabBar from "@/components/MobileTabBar";
import { EmbedAnchor } from "@/components/EmbedLink";
import PlaceholderImage from "@/components/PlaceholderImage";
import SellerHero from "@/components/SellerHero";
import { CompareProvider, useCompare } from "@/context/CompareContext";

function formatPrice(price: number) {
  return price.toLocaleString("en-US");
}

export default function SellerLandingClient({ slug }: { slug: string }) {
  return (
    <CompareProvider>
      <Inner slug={slug} />
    </CompareProvider>
  );
}

function Inner({ slug }: { slug: string }) {
  const { getSellerBySlug, getListingsBySeller, getTrimById, getModelById, getBrandById } = useAppData();
  const { t, dir } = useLanguage();
  const compare = useCompare();

  const seller = getSellerBySlug(slug);
  const listings = useMemo(() => (seller ? getListingsBySeller(seller.id) : []), [seller, getListingsBySeller]);

  const enrichedListings = useMemo(() => {
    return listings
      .map((listing) => {
        const trim = getTrimById(listing.trimId);
        const model = getModelById(listing.modelId);
        const brand = model ? getBrandById(model.brandId) : undefined;
        if (!trim || !model || !brand) return null;
        return { listing, trim, model, brand };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [listings, getTrimById, getModelById, getBrandById]);

  if (!seller) return null;

  const primary = seller.brandColor;
  const primaryDark = seller.brandColorDark ?? primary;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar compareCount={compare.totalCount} />

      {/* Hero -- static branded image */}
      <SellerHero
        imageUrl={seller.heroMedia?.url ?? seller.heroImages?.[0] ?? ""}
        logoUrl={seller.logoUrl}
        title={seller.about?.headline ?? seller.name}
        subtitle={seller.tagline}
        brandColor={primary}
        brandColorDark={primaryDark}
      >
        <a
          href="#listings"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white"
          style={{ color: primary }}
        >
          {t.sellers.viewListings}
          <ArrowRight className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
        </a>
      </SellerHero>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 pt-4">
        <nav className="hidden md:flex items-center gap-1.5 text-xs text-[#64748B]">
          <EmbedAnchor href="/" className="flex items-center gap-1 hover:text-[#1A56DB] transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>{t.common.home}</span>
          </EmbedAnchor>
          <ChevronRight className={`w-3 h-3 ${dir === "rtl" ? "rotate-180" : ""}`} />
          <span className="text-[#1E293B] font-medium">{seller.name}</span>
        </nav>
        <div className="md:hidden">
          <EmbedAnchor href="/" className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#1A56DB] transition-colors">
            <ArrowLeft className={`w-3.5 h-3.5 ${dir === "rtl" ? "rotate-180" : ""}`} />
            <span>{t.common.backToHome}</span>
          </EmbedAnchor>
        </div>
      </div>

      {/* About */}
      {seller.about && (
        <section className="max-w-6xl mx-auto w-full px-4 md:px-6 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: primary }}>
                {t.sellers.aboutLabel}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-4">
                {seller.about.headline}
              </h2>
              <p className="text-sm md:text-base text-[#64748B] leading-relaxed">
                {seller.about.body}
              </p>
              {seller.websiteUrl && (
                <a
                  href={seller.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-5 text-sm font-bold"
                  style={{ color: primary }}
                >
                  {t.sellers.visitWebsite}
                  <ArrowRight className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
                </a>
              )}
            </div>
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#F1F5F9]">
              {seller.about.imageUrl && (
                <Image
                  src={seller.about.imageUrl}
                  alt={seller.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Auto finance product */}
      {seller.financingIntro && (
        <section
          className="w-full"
          style={{
            background: `linear-gradient(135deg, ${primaryDark} 0%, ${primary} 100%)`,
          }}
        >
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 text-white">
            <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
              {t.sellers.autoFinanceLabel}
            </p>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              {seller.financingIntro.headline}
            </h2>
            <p className="text-sm md:text-base opacity-90 max-w-2xl mb-8 leading-relaxed">
              {seller.financingIntro.body}
            </p>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {seller.financingIntro.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 bg-white/10 backdrop-blur rounded-xl p-3"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-white/90" />
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Available listings */}
      <ListingsSection enrichedListings={enrichedListings} sellerSlug={seller.slug} primary={primary} />

      <Footer />
      <MobileTabBar activeTab="search" compareCount={compare.totalCount} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Listings section with filters
// ---------------------------------------------------------------------------

import type { Trim, Model, Brand, SellerListing, PaymentType } from "@/data/types";

interface EnrichedListing {
  listing: SellerListing;
  trim: Trim;
  model: Model;
  brand: Brand;
}

type SortBy = "price-asc" | "price-desc" | "newest";

function ListingsSection({
  enrichedListings,
  sellerSlug,
  primary,
}: {
  enrichedListings: EnrichedListing[];
  sellerSlug: string;
  primary: string;
}) {
  const { t } = useLanguage();

  const [query, setQuery] = useState("");
  const [brandIds, setBrandIds] = useState<string[]>([]);
  const [modelIds, setModelIds] = useState<string[]>([]);
  const [bodyTypes, setBodyTypes] = useState<string[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("price-asc");

  // Facets derived from the full catalog (not the filtered set) so the user
  // can always re-add a filter they cleared.
  const availableBrands = useMemo(() => {
    const map = new Map<string, Brand>();
    for (const e of enrichedListings) map.set(e.brand.id, e.brand);
    return Array.from(map.values());
  }, [enrichedListings]);

  // Models facet -- if a brand filter is active, only show models from those brands
  const availableModels = useMemo(() => {
    const map = new Map<string, Model>();
    for (const e of enrichedListings) {
      if (brandIds.length > 0 && !brandIds.includes(e.brand.id)) continue;
      map.set(e.model.id, e.model);
    }
    return Array.from(map.values());
  }, [enrichedListings, brandIds]);

  const availableBodyTypes = useMemo(() => {
    const set = new Set<string>();
    for (const e of enrichedListings) set.add(e.model.bodyType);
    return Array.from(set);
  }, [enrichedListings]);

  const availablePaymentTypes = useMemo(() => {
    const set = new Set<PaymentType>();
    for (const e of enrichedListings) set.add(e.listing.paymentType);
    return Array.from(set);
  }, [enrichedListings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = enrichedListings.filter((e) => {
      if (brandIds.length > 0 && !brandIds.includes(e.brand.id)) return false;
      if (modelIds.length > 0 && !modelIds.includes(e.model.id)) return false;
      if (bodyTypes.length > 0 && !bodyTypes.includes(e.model.bodyType)) return false;
      if (paymentTypes.length > 0 && !paymentTypes.includes(e.listing.paymentType)) return false;
      if (q) {
        const hay = `${e.brand.name} ${e.model.name} ${e.trim.name}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.listing.price - b.listing.price;
        case "price-desc":
          return b.listing.price - a.listing.price;
        case "newest":
          return (b.model.year ?? 0) - (a.model.year ?? 0);
      }
    });
    return list;
  }, [enrichedListings, query, brandIds, modelIds, bodyTypes, paymentTypes, sortBy]);

  const activeFilterCount =
    brandIds.length + modelIds.length + bodyTypes.length + paymentTypes.length + (query.trim() ? 1 : 0);

  const toggle = <T extends string>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const clearAll = () => {
    setQuery("");
    setBrandIds([]);
    setModelIds([]);
    setBodyTypes([]);
    setPaymentTypes([]);
  };

  // Drop model filter if its brand was removed
  const handleBrandToggle = (id: string) => {
    const next = toggle(brandIds, id);
    setBrandIds(next);
    if (next.length > 0) {
      setModelIds((prev) =>
        prev.filter((mid) => {
          const m = availableModels.find((mm) => mm.id === mid);
          return m ? next.includes(m.brandId) : false;
        })
      );
    }
  };

  return (
    <section className="max-w-6xl mx-auto w-full px-4 md:px-6 py-12 md:py-16" id="listings">
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: primary }}>
            {t.sellers.listingsLabel}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B]">
            {t.sellers.availableCars}
          </h2>
        </div>
        <span className="text-sm text-[#64748B]">
          {filtered.length} {t.sellers.cars}
        </span>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3 md:p-4 mb-5 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <label className="flex-1 relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.sellers.searchPlaceholder}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl ps-9 pe-3 py-2.5 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2"
              style={{ ["--tw-ring-color" as never]: `${primary}55` }}
            />
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-sm text-[#1E293B] focus:outline-none focus:ring-2 md:w-56"
            style={{ ["--tw-ring-color" as never]: `${primary}55` }}
          >
            <option value="price-asc">{t.sellers.sortPriceAsc}</option>
            <option value="price-desc">{t.sellers.sortPriceDesc}</option>
            <option value="newest">{t.sellers.sortNewest}</option>
          </select>
        </div>

        {/* Brand chips (always shown) */}
        {availableBrands.length > 0 && (
          <ChipRow label={t.sellers.filterBrand}>
            {availableBrands.map((b) => {
              const active = brandIds.includes(b.id);
              return (
                <FilterChip
                  key={b.id}
                  active={active}
                  primary={primary}
                  onClick={() => handleBrandToggle(b.id)}
                >
                  {b.name}
                </FilterChip>
              );
            })}
          </ChipRow>
        )}

        {/* Model chips (always shown; filtered by selected brand) */}
        {availableModels.length > 0 && (
          <ChipRow label={t.sellers.filterModel}>
            {availableModels.map((m) => {
              const active = modelIds.includes(m.id);
              return (
                <FilterChip
                  key={m.id}
                  active={active}
                  primary={primary}
                  onClick={() => setModelIds(toggle(modelIds, m.id))}
                >
                  {m.name}
                </FilterChip>
              );
            })}
          </ChipRow>
        )}

        {/* Body-type chips */}
        {availableBodyTypes.length > 1 && (
          <ChipRow label={t.sellers.filterBodyType}>
            {availableBodyTypes.map((bt) => {
              const active = bodyTypes.includes(bt);
              return (
                <FilterChip
                  key={bt}
                  active={active}
                  primary={primary}
                  onClick={() => setBodyTypes(toggle(bodyTypes, bt))}
                >
                  {bt}
                </FilterChip>
              );
            })}
          </ChipRow>
        )}

        {/* Payment-type chips */}
        {availablePaymentTypes.length > 1 && (
          <ChipRow label={t.sellers.filterPayment}>
            {availablePaymentTypes.map((pt) => {
              const active = paymentTypes.includes(pt);
              return (
                <FilterChip
                  key={pt}
                  active={active}
                  primary={primary}
                  onClick={() => setPaymentTypes(toggle(paymentTypes, pt))}
                >
                  {pt === "installment" ? t.model.installment : t.model.cash}
                </FilterChip>
              );
            })}
          </ChipRow>
        )}

        {activeFilterCount > 0 && (
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-xs text-[#64748B] hover:text-[#1E293B] underline"
            >
              <X className="w-3.5 h-3.5" />
              {t.sellers.clearFilters} ({activeFilterCount})
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center text-sm text-[#64748B]">
          {t.sellers.noListings}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filtered.map(({ listing, trim, model, brand }) => (
            <EmbedAnchor
              key={listing.id}
              href={`/sellers/${sellerSlug}/listings/${trim.id}`}
              className="group block rounded-2xl overflow-hidden bg-white border border-[#E2E8F0] hover:border-[#1A56DB] transition-colors"
            >
              <div className="relative">
                {listing.thumbnailUrl ? (
                  <div
                    className="relative w-full bg-gradient-to-b from-[#F1F5F9] to-[#E2E8F0]"
                    style={{ aspectRatio: "4/3" }}
                  >
                    <Image
                      src={listing.thumbnailUrl}
                      alt={`${model.name} ${trim.name}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-contain p-3"
                      unoptimized
                    />
                  </div>
                ) : (
                  <PlaceholderImage
                    aspectRatio="4/3"
                    label={model.name}
                    bodyType={model.bodyType}
                    silhouetteSize="lg"
                    imageUrl={trim.images[0] ?? model.imageUrl}
                  />
                )}
                <span
                  className="absolute top-3 start-3 inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded text-white"
                  style={{ background: primary }}
                >
                  {listing.paymentType === "installment" ? t.model.installment : t.model.cash}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center overflow-hidden ring-1 ring-[#E2E8F0]">
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      width={20}
                      height={20}
                      className="object-contain w-5 h-5"
                      unoptimized
                    />
                  </div>
                  <p className="text-xs text-[#64748B]">{brand.name}</p>
                </div>
                <h3 className="font-bold text-[#1E293B] text-base group-hover:text-[#1A56DB] transition-colors">
                  {model.name} <span className="text-[#64748B] font-medium">· {trim.name}</span>
                </h3>
                <div className="flex items-end justify-between pt-1">
                  <div>
                    <p className="text-[11px] text-[#64748B] leading-tight">{t.model.priceLabel}</p>
                    <p className="text-base font-bold text-[#1E293B] leading-tight">
                      {formatPrice(listing.price)} {t.common.kwd}
                    </p>
                  </div>
                  {listing.promoText && (
                    <p
                      className="text-[11px] font-semibold text-end max-w-[55%] truncate"
                      style={{ color: primary }}
                    >
                      {listing.promoText}
                    </p>
                  )}
                </div>
              </div>
            </EmbedAnchor>
          ))}
        </div>
      )}
    </section>
  );
}

function ChipRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 flex-wrap">
      <p className="text-[11px] uppercase tracking-wider font-bold text-[#94A3B8] pt-1.5 min-w-[88px]">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  primary,
  onClick,
  children,
}: {
  active: boolean;
  primary: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
      style={
        active
          ? { background: primary, color: "#fff", borderColor: primary }
          : { background: "#fff", color: "#1E293B", borderColor: "#E2E8F0" }
      }
    >
      {children}
    </button>
  );
}
