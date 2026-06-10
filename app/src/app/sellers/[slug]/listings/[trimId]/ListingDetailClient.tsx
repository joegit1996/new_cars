"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Home,
  Gauge,
  Fuel,
  Cog,
  Check,
  Minus,
  Info,
  Armchair,
  Car,
  Droplets,
  Camera,
  ShieldCheck,
  Tv,
} from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileTabBar from "@/components/MobileTabBar";
import PlaceholderImage from "@/components/PlaceholderImage";
import { EmbedAnchor } from "@/components/EmbedLink";
import { CompareProvider, useCompare } from "@/context/CompareContext";
import { FinanceCalculator } from "@/components/FinanceCalculator";
import { EquipmentCategory } from "@/data/types";
import type { FinancierCalcConfig, Trim, Model, Brand, Equipment } from "@/data/types";

function formatPrice(n: number) {
  return n.toLocaleString("en-US");
}

export default function ListingDetailClient({ slug, trimId }: { slug: string; trimId: string }) {
  return (
    <CompareProvider>
      <Inner slug={slug} trimId={trimId} />
    </CompareProvider>
  );
}

function Inner({ slug, trimId }: { slug: string; trimId: string }) {
  const { t, dir } = useLanguage();
  const compare = useCompare();
  const {
    getSellerBySlug,
    getListingForSellerTrim,
    getTrimById,
    getModelById,
    getBrandById,
    getSellerListingsForTrim,
  } = useAppData();

  const seller = getSellerBySlug(slug);
  const listing = seller ? getListingForSellerTrim(seller.id, trimId) : undefined;
  const trim = getTrimById(trimId);
  const model = trim ? getModelById(trim.modelId) : undefined;
  const brand = model ? getBrandById(model.brandId) : undefined;

  const otherSellers = useMemo(() => {
    if (!seller) return [];
    return getSellerListingsForTrim(trimId).filter((x) => x.seller.id !== seller.id);
  }, [seller, trimId, getSellerListingsForTrim]);

  const [galleryIdx, setGalleryIdx] = useState(0);

  if (!seller || !listing || !trim || !model || !brand) return null;

  const primary = seller.brandColor;
  const primaryDark = seller.brandColorDark ?? primary;

  const calcConfig: FinancierCalcConfig = {
    ...(seller.calculator ?? { paymentType: "installment" }),
    ...listing.calculatorOverride,
  };

  // Lead with the seller-provided thumbnail (matches what the user clicked
  // through from the seller's catalog), followed by the trim/model imagery.
  const images = [
    ...(listing.thumbnailUrl ? [listing.thumbnailUrl] : []),
    ...(trim.images.length > 0 ? trim.images : [model.imageUrl]),
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar compareCount={compare.totalCount} />

      {/* Seller brand strip */}
      <div className="w-full" style={{ background: primaryDark }}>
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-3 flex items-center gap-3">
          <span
            className="inline-flex items-center justify-center rounded-md bg-white p-1.5"
          >
            <Image src={seller.logoUrl} alt={seller.name} width={80} height={20} className="h-5 w-auto object-contain" unoptimized />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-white/70 leading-tight">
              {t.sellers.listingDetailLabel}
            </p>
            <p className="text-sm text-white font-bold leading-tight truncate">
              {seller.name}
            </p>
          </div>
          <EmbedAnchor
            href={`/sellers/${seller.slug}`}
            className="text-xs text-white/90 hover:text-white inline-flex items-center gap-1 whitespace-nowrap"
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${dir === "rtl" ? "rotate-180" : ""}`} />
            {t.sellers.backToSeller}
          </EmbedAnchor>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 pt-4">
        <nav className="hidden md:flex items-center gap-1.5 text-xs text-[#64748B]">
          <EmbedAnchor href="/" className="flex items-center gap-1 hover:text-[#1A56DB] transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>{t.common.home}</span>
          </EmbedAnchor>
          <ChevronRight className={`w-3 h-3 ${dir === "rtl" ? "rotate-180" : ""}`} />
          <EmbedAnchor href={`/sellers/${seller.slug}`} className="hover:text-[#1A56DB]">
            {seller.name}
          </EmbedAnchor>
          <ChevronRight className={`w-3 h-3 ${dir === "rtl" ? "rotate-180" : ""}`} />
          <span className="text-[#1E293B] font-medium">{brand.name} {model.name}</span>
        </nav>
      </div>

      {/* Hero + calculator */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        <div className="lg:grid lg:grid-cols-12 gap-8 lg:gap-10 space-y-8 lg:space-y-0">
          {/* Left: car */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white ring-1 ring-[#E2E8F0] flex items-center justify-center overflow-hidden">
                <Image src={brand.logoUrl} alt={brand.name} width={28} height={28} className="object-contain w-7 h-7" unoptimized />
              </div>
              <div>
                <p className="text-xs text-[#64748B]">{brand.name}</p>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B] leading-tight">
                  {model.name} <span className="text-[#64748B] font-medium">{trim.name}</span>
                </h1>
              </div>
            </div>

            <div
              className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#F1F5F9] to-[#E2E8F0]"
              style={{ aspectRatio: "16/10" }}
            >
              <Image
                src={images[galleryIdx]}
                alt={`${model.name} ${trim.name}`}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                priority
                className={
                  images[galleryIdx] === listing.thumbnailUrl
                    ? "object-contain p-6"
                    : "object-cover"
                }
                unoptimized
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={img + idx}
                    type="button"
                    onClick={() => setGalleryIdx(idx)}
                    className="relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border transition-colors bg-[#F1F5F9]"
                    style={{
                      borderColor: idx === galleryIdx ? primary : "#E2E8F0",
                    }}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="80px"
                      className={img === listing.thumbnailUrl ? "object-contain p-1" : "object-cover"}
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick specs */}
            <div className="grid grid-cols-3 gap-3">
              <SpecChip icon={<Gauge className="w-4 h-4" />} label={t.model.rowPower} value={`${trim.specs.horsepower} hp`} />
              <SpecChip icon={<Cog className="w-4 h-4" />} label={t.model.rowTransmission} value={trim.specs.transmission} />
              <SpecChip icon={<Fuel className="w-4 h-4" />} label={t.model.rowFuelEconomy} value={trim.specs.fuelEconomyCombined > 0 ? `${trim.specs.fuelEconomyCombined} L/100km` : t.model.electricLabel} />
            </div>
          </div>

          {/* Right: highlighted branded calculator */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className="rounded-2xl p-1"
              style={{
                background: `linear-gradient(135deg, ${primaryDark} 0%, ${primary} 100%)`,
              }}
            >
              <div className="bg-white rounded-2xl p-5 md:p-6 space-y-5">
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider font-bold" style={{ color: primary }}>
                      {t.sellers.branchedCalculatorTitle} {seller.name}
                    </p>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {seller.tagline}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="text-[11px] text-[#64748B] leading-tight">{t.model.priceLabel}</p>
                    <p className="text-lg font-bold text-[#1E293B] leading-tight">
                      {formatPrice(listing.price)} {t.common.kwd}
                    </p>
                  </div>
                </div>

                <FinanceCalculator
                  totalEstimate={listing.price}
                  config={calcConfig}
                  accent={{
                    primary,
                    primaryDark,
                    logoUrl: seller.logoUrl,
                    label: seller.name,
                  }}
                  branded
                />

                {listing.listingUrl && (
                  <a
                    href={listing.listingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{ background: primary }}
                  >
                    {t.sellers.applyCta} {seller.name}
                    <ArrowRight className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
                  </a>
                )}
              </div>
            </div>

            <EmbedAnchor
              href={`/model/${model.id}`}
              className="block text-center text-xs text-[#64748B] hover:text-[#1E293B] underline"
            >
              {t.model.exploreAllBrandModels?.replace("{brand}", brand.name) ?? brand.name}
            </EmbedAnchor>
          </div>
        </div>
      </section>

      {/* Detail sections (mirrors the bankboubyan.com listing layout) */}
      <ListingDetailsTabs trim={trim} model={model} brand={brand} primary={primary} />

      {/* Other sellers */}
      {otherSellers.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-12 border-t border-[#E2E8F0]">
          <h2 className="text-lg md:text-xl font-bold text-[#1E293B] mb-4">
            {t.sellers.otherSellersTitle}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {otherSellers.map(({ seller: s, listing: l }) => (
              <EmbedAnchor
                key={l.id}
                href={`/sellers/${s.slug}/listings/${l.trimId}`}
                className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3 hover:border-[#1A56DB] transition-colors"
              >
                <Image src={s.logoUrl} alt={s.name} width={32} height={32} className="w-8 h-8 object-contain" unoptimized />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1E293B] truncate">{s.name}</p>
                  <p className="text-xs text-[#64748B] truncate">
                    {formatPrice(l.price)} {t.common.kwd}
                    {l.promoText ? ` · ${l.promoText}` : ""}
                  </p>
                </div>
                <ArrowRight className={`w-4 h-4 text-[#64748B] ${dir === "rtl" ? "rotate-180" : ""}`} />
              </EmbedAnchor>
            ))}
          </div>
        </section>
      )}

      <Footer />
      <MobileTabBar activeTab="search" compareCount={compare.totalCount} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Listing details tabs (Quick Facts / Interior / Exterior / Fuel / Parking / Infotainment)
// Mirrors the section layout used on bankboubyan.com listing pages.
// ---------------------------------------------------------------------------

const COUNTRY_OF_ORIGIN: Record<string, string> = {
  bmw: "Germany",
  mercedes: "Germany",
  porsche: "Germany",
  mitsubishi: "Japan",
  soueast: "China",
};

type DetailTabKey = "facts" | "interior" | "exterior" | "fuel" | "parking" | "infotainment";

function ListingDetailsTabs({
  trim,
  model,
  brand,
  primary,
}: {
  trim: Trim;
  model: Model;
  brand: Brand;
  primary: string;
}) {
  const { t } = useLanguage();
  const [active, setActive] = useState<DetailTabKey>("facts");

  const tabs: Array<{ key: DetailTabKey; label: string; icon: React.ReactNode }> = [
    { key: "facts", label: t.listingDetails.facts, icon: <Info className="w-4 h-4" /> },
    { key: "interior", label: t.listingDetails.interior, icon: <Armchair className="w-4 h-4" /> },
    { key: "exterior", label: t.listingDetails.exterior, icon: <Car className="w-4 h-4" /> },
    { key: "fuel", label: t.listingDetails.fuel, icon: <Droplets className="w-4 h-4" /> },
    { key: "parking", label: t.listingDetails.parking, icon: <Camera className="w-4 h-4" /> },
    { key: "infotainment", label: t.listingDetails.infotainment, icon: <Tv className="w-4 h-4" /> },
  ];

  return (
    <section className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
      <h2 className="text-lg md:text-xl font-bold text-[#1E293B] mb-4">
        {t.listingDetails.title}
      </h2>

      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
        {/* Tab strip */}
        <div className="border-b border-[#E2E8F0] overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((tab) => {
              const isActive = tab.key === active;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActive(tab.key)}
                  className="flex items-center gap-1.5 px-4 md:px-5 py-3 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
                  style={{
                    borderBottomColor: isActive ? primary : "transparent",
                    color: isActive ? primary : "#64748B",
                    background: isActive ? `${primary}08` : "transparent",
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel */}
        <div className="p-5 md:p-6">
          {active === "facts" && <QuickFactsPanel trim={trim} model={model} brand={brand} />}
          {active === "interior" && (
            <EquipmentPanel
              equipment={trim.equipment.filter(
                (e) =>
                  e.category === EquipmentCategory.Comfort ||
                  e.category === EquipmentCategory.Interior
              )}
              emptyText={t.listingDetails.emptyInterior}
              primary={primary}
            />
          )}
          {active === "exterior" && (
            <EquipmentPanel
              equipment={trim.equipment.filter((e) => e.category === EquipmentCategory.Exterior)}
              emptyText={t.listingDetails.emptyExterior}
              primary={primary}
              extraFacts={[
                { label: t.listingDetails.length, value: `${trim.specs.lengthMm} mm` },
                { label: t.listingDetails.width, value: `${trim.specs.widthMm} mm` },
                { label: t.listingDetails.height, value: `${trim.specs.heightMm} mm` },
                { label: t.listingDetails.wheelbase, value: `${trim.specs.wheelbaseMm} mm` },
              ]}
            />
          )}
          {active === "fuel" && (
            <FactGrid
              rows={
                trim.specs.fuelEconomyCombined > 0
                  ? [
                      { label: t.listingDetails.fuelCity, value: `${trim.specs.fuelEconomyCity} L/100km` },
                      { label: t.listingDetails.fuelHighway, value: `${trim.specs.fuelEconomyHighway} L/100km` },
                      { label: t.listingDetails.fuelCombined, value: `${trim.specs.fuelEconomyCombined} L/100km` },
                      { label: t.listingDetails.fuelTank, value: `${trim.specs.fuelTankLiters} L` },
                      { label: t.listingDetails.fuelType, value: trim.fuelType },
                    ]
                  : [
                      { label: t.listingDetails.fuelType, value: t.model.electricLabel },
                      { label: t.listingDetails.fuelCombined, value: "—" },
                    ]
              }
            />
          )}
          {active === "parking" && (
            <EquipmentPanel
              equipment={trim.equipment.filter((e) => e.category === EquipmentCategory.Safety)}
              emptyText={t.listingDetails.emptyParking}
              primary={primary}
            />
          )}
          {active === "infotainment" && (
            <EquipmentPanel
              equipment={trim.equipment.filter((e) => e.category === EquipmentCategory.Technology)}
              emptyText={t.listingDetails.emptyInfotainment}
              primary={primary}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function QuickFactsPanel({ trim, model, brand }: { trim: Trim; model: Model; brand: Brand }) {
  const { t } = useLanguage();
  const country = COUNTRY_OF_ORIGIN[brand.id] ?? "—";
  const gears =
    trim.specs.transmission === "Manual"
      ? "6"
      : trim.specs.transmission === "CVT"
      ? "—"
      : "8";
  const rows = [
    { label: t.listingDetails.model, value: model.name },
    { label: t.listingDetails.modelYear, value: String(model.year) },
    { label: t.listingDetails.trimLabel, value: trim.name },
    { label: t.listingDetails.body, value: model.bodyType },
    { label: t.listingDetails.engine, value: trim.engineSummary },
    {
      label: t.listingDetails.engineType,
      value:
        trim.specs.cylinders > 0
          ? `${trim.specs.engineType} (${trim.specs.cylinders}-cyl, ${trim.specs.displacement}L)`
          : trim.specs.engineType,
    },
    { label: t.listingDetails.seating, value: String(trim.specs.seatingCapacity) },
    {
      label: t.listingDetails.doors,
      value: model.bodyType === "Coupe" || model.bodyType === "Convertible" ? "2" : model.bodyType === "Pickup" ? "4" : "4",
    },
    { label: t.listingDetails.origin, value: country },
    { label: t.listingDetails.wheelDrive, value: trim.specs.driveType },
    { label: t.listingDetails.brakes, value: t.listingDetails.brakesValue },
    { label: t.listingDetails.gears, value: gears },
    { label: t.listingDetails.power, value: `${trim.specs.horsepower} hp` },
    { label: t.listingDetails.torque, value: `${trim.specs.torque} Nm` },
    { label: t.listingDetails.zeroToHundred, value: `${trim.specs.zeroToHundred} s` },
    { label: t.listingDetails.topSpeed, value: `${trim.specs.topSpeed} km/h` },
    { label: t.listingDetails.warranty, value: trim.specs.warranty },
  ];
  return <FactGrid rows={rows} />;
}

function FactGrid({ rows }: { rows: Array<{ label: string; value: string }> }) {
  return (
    <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-center justify-between gap-3 py-2 border-b border-[#F1F5F9]"
        >
          <dt className="text-xs text-[#64748B]">{r.label}</dt>
          <dd className="text-sm font-medium text-[#1E293B] text-end">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function EquipmentPanel({
  equipment,
  emptyText,
  primary,
  extraFacts,
}: {
  equipment: Equipment[];
  emptyText: string;
  primary: string;
  extraFacts?: Array<{ label: string; value: string }>;
}) {
  const { t } = useLanguage();
  if (equipment.length === 0 && (!extraFacts || extraFacts.length === 0)) {
    return <p className="text-sm text-[#64748B]">{emptyText}</p>;
  }
  return (
    <div className="space-y-5">
      {extraFacts && extraFacts.length > 0 && <FactGrid rows={extraFacts} />}
      {equipment.length > 0 && (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
          {equipment.map((e) => (
            <li
              key={e.name}
              className="flex items-center gap-2 text-sm border-b border-[#F1F5F9] pb-2"
            >
              {e.isStandard ? (
                <Check className="w-4 h-4 shrink-0" style={{ color: primary }} />
              ) : (
                <Minus className="w-4 h-4 shrink-0 text-[#94A3B8]" />
              )}
              <span className="text-[#1E293B] flex-1">{e.name}</span>
              {!e.isStandard && (
                <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold">
                  {t.listingDetails.optional}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SpecChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white border border-[#E2E8F0] p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mb-0.5">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-sm font-bold text-[#1E293B]">{value}</p>
    </div>
  );
}
