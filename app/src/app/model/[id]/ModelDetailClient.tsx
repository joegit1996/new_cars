"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Gauge,
  Fuel,
  Cog,
  Ruler,
  Weight,
  Shield,
  Zap,
  Timer,
  ArrowUpRight,
  ArrowLeft,
  MapPin,
  Phone,
  ExternalLink,
  X,
  Car,
  Droplets,
  Calendar,
  Layers,
  Send,
} from "lucide-react";
import {
  getModelById,
  getBrandByModelId,
  getTrimsByModel,
  getBranchesForModel,
} from "@/data/helpers";
import { EquipmentCategory } from "@/data/types";
import type { Trim, TrimVariant, Equipment } from "@/data/types";
import PlaceholderImage from "@/components/PlaceholderImage";
import LeadFormModal from "@/components/LeadFormModal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileTabBar from "@/components/MobileTabBar";
import { CompareProvider } from "@/context/CompareContext";
import { EmbedAnchor } from "@/components/EmbedLink";
import { useIsEmbedded } from "@/hooks/useIsEmbedded";

// --------------- Helpers ---------------
function formatPrice(price: number) {
  return price.toLocaleString("en-US");
}

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

// --------------- Hero Carousel ---------------
function HeroCarousel({ trimName }: { trimName: string }) {
  const [current, setCurrent] = useState(0);
  const slides = [0, 1, 2];
  const labels = [`${trimName} - Front`, `${trimName} - Side`, `${trimName} - Rear`];
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  const goNext = useCallback(() => {
    setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
  }, [slides.length]);

  // Auto-swipe every 5s
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

// --------------- Trim Selector ---------------
function TrimSelector({
  trims,
  selectedTrimId,
  onSelect,
  selectedVariant,
  onVariantSelect,
  modelId,
}: {
  trims: Trim[];
  selectedTrimId: string;
  onSelect: (id: string) => void;
  selectedVariant: TrimVariant | null;
  onVariantSelect: (v: TrimVariant | null) => void;
  modelId: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedTrim = trims.find((t) => t.id === selectedTrimId);

  return (
    <div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3 styled-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
      >
        {trims.map((trim) => {
          const isSelected = trim.id === selectedTrimId;
          return (
            <button
              key={trim.id}
              onClick={() => {
                onSelect(trim.id);
                onVariantSelect(null);
              }}
              className={`shrink-0 w-48 md:w-56 rounded-xl p-3 border-2 text-start transition-all ${
                isSelected
                  ? "bg-[#1A56DB] border-[#1A56DB] text-white shadow-lg"
                  : "bg-white border-[#E2E8F0] text-[#1E293B] hover:border-[#1A56DB]/40"
              }`}
            >
              <div className={`rounded-lg overflow-hidden mb-2 ${isSelected ? "ring-2 ring-white/30" : ""}`}>
                <PlaceholderImage
                  aspectRatio="3/2"
                  className="w-full"
                  label={trim.name}
                />
              </div>
              <p className="font-bold text-sm truncate">{trim.name}</p>
              <p className={`text-xs mt-0.5 ${isSelected ? "text-white/80" : "text-[#F59E0B]"} font-bold`}>
                {formatPrice(trim.price)} KWD
              </p>
              <p className={`text-xs mt-1 ${isSelected ? "text-white/70" : "text-[#64748B]"} truncate`}>
                {trim.engineSummary}
              </p>
              <span
                className={`inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-[#F1F5F9] text-[#64748B]"
                }`}
              >
                {trim.fuelType}
              </span>
            </button>
          );
        })}

      </div>

      {/* Variant chips */}
      {selectedTrim && selectedTrim.variants.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-[#E2E8F0]"
        >
          <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-2">
            {selectedTrim.name} Variants
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onVariantSelect(null)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                !selectedVariant
                  ? "bg-[#1A56DB] text-white border-[#1A56DB]"
                  : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1A56DB]"
              }`}
            >
              Base
            </button>
            {selectedTrim.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => onVariantSelect(v)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  selectedVariant?.id === v.id
                    ? "bg-[#1A56DB] text-white border-[#1A56DB]"
                    : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1A56DB]"
                }`}
              >
                {v.name} (+{formatPrice(v.price - selectedTrim.price)} KWD)
              </button>
            ))}
          </div>

          {/* Variant image preview strip */}
          <AnimatePresence mode="wait">
            {selectedVariant?.images && selectedVariant.images.length > 0 && (
              <motion.div
                key={selectedVariant.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
                className="mt-3"
              >
                <p className="text-[11px] text-[#64748B] mb-1.5">
                  {selectedVariant.name} appearance
                </p>
                <div className="flex gap-2 overflow-x-auto styled-scrollbar pb-1">
                  {selectedVariant.images.slice(0, 3).map((imgSrc, i) => {
                    const previewLabels = [
                      `${selectedVariant.name} - Exterior`,
                      `${selectedVariant.name} - Interior`,
                      `${selectedVariant.name} - Detail`,
                    ];
                    return (
                      <div
                        key={i}
                        className="shrink-0 w-28 md:w-36 rounded-lg overflow-hidden border border-[#E2E8F0]"
                      >
                        <PlaceholderImage
                          aspectRatio="4/3"
                          className="w-full"
                          label={previewLabels[i] || selectedVariant.name}
                        />
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

// --------------- Key Specs Panel ---------------
function KeySpecsPanel({ trim }: { trim: Trim }) {
  const s = trim.specs;
  const specItems = [
    { icon: Cog, label: "Engine", value: s.engineType },
    { icon: Gauge, label: "Displacement", value: s.displacement > 0 ? `${s.displacement}L` : "N/A" },
    { icon: Zap, label: "Horsepower", value: `${s.horsepower} hp` },
    { icon: Zap, label: "Torque", value: `${s.torque} Nm` },
    { icon: Timer, label: "0-100 km/h", value: `${s.zeroToHundred}s` },
    { icon: Gauge, label: "Top Speed", value: `${s.topSpeed} km/h` },
    { icon: Fuel, label: "Fuel (City)", value: s.fuelEconomyCity > 0 ? `${s.fuelEconomyCity} L/100km` : "N/A" },
    { icon: Fuel, label: "Fuel (Highway)", value: s.fuelEconomyHighway > 0 ? `${s.fuelEconomyHighway} L/100km` : "N/A" },
    { icon: Fuel, label: "Fuel (Combined)", value: s.fuelEconomyCombined > 0 ? `${s.fuelEconomyCombined} L/100km` : "N/A" },
    { icon: Cog, label: "Transmission", value: s.transmission },
    { icon: Car, label: "Drive Type", value: s.driveType },
    { icon: Ruler, label: "Length", value: `${s.lengthMm} mm` },
    { icon: Ruler, label: "Width", value: `${s.widthMm} mm` },
    { icon: Ruler, label: "Height", value: `${s.heightMm} mm` },
    { icon: Ruler, label: "Wheelbase", value: `${s.wheelbaseMm} mm` },
    { icon: Droplets, label: "Trunk", value: `${s.trunkVolumeLiters} L` },
    { icon: Weight, label: "Curb Weight", value: `${s.curbWeightKg} kg` },
    { icon: Fuel, label: "Fuel Tank", value: s.fuelTankLiters > 0 ? `${s.fuelTankLiters} L` : "N/A" },
    { icon: Car, label: "Seating", value: `${s.seatingCapacity} seats` },
    { icon: Shield, label: "Warranty", value: s.warranty },
    { icon: Shield, label: "Spec Region", value: s.specRegion },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {specItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex items-start gap-3 bg-[#F1F5F9] rounded-lg p-3"
          >
            <Icon className="w-5 h-5 text-[#1A56DB] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-[#64748B]">{item.label}</p>
              <p className="text-sm font-medium text-[#1E293B] truncate">
                {item.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --------------- Equipment Section ---------------
const EQUIPMENT_TABS: EquipmentCategory[] = [
  EquipmentCategory.Safety,
  EquipmentCategory.Comfort,
  EquipmentCategory.Technology,
  EquipmentCategory.Exterior,
  EquipmentCategory.Interior,
];

function EquipmentSection({
  equipment,
  baseEquipment,
}: {
  equipment: Equipment[];
  baseEquipment: Equipment[];
}) {
  const [activeTab, setActiveTab] = useState<EquipmentCategory>(
    EquipmentCategory.Safety
  );
  const [showDiffOnly, setShowDiffOnly] = useState(false);

  const filtered = equipment.filter((e) => e.category === activeTab);
  const displayItems = showDiffOnly
    ? filtered.filter((e) => {
        const base = baseEquipment.find(
          (b) => b.name === e.name && b.category === e.category
        );
        return !base || base.isStandard !== e.isStandard;
      })
    : filtered;

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 styled-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {EQUIPMENT_TABS.map((cat) => {
          const count = equipment.filter((e) => e.category === cat).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`shrink-0 px-4 py-2 text-sm rounded-lg border transition-colors ${
                activeTab === cat
                  ? "bg-[#1A56DB] text-white border-[#1A56DB]"
                  : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1A56DB]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-2 mt-3 mb-3">
        <button
          onClick={() => setShowDiffOnly(!showDiffOnly)}
          className="text-xs text-[#1A56DB] hover:underline font-medium"
        >
          {showDiffOnly ? "Show all" : "Show differences from base trim"}
        </button>
      </div>

      {/* Items */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTab}-${showDiffOnly}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-2"
        >
          {displayItems.length === 0 ? (
            <p className="text-sm text-[#64748B] py-4">
              No differences from base trim in this category.
            </p>
          ) : (
            displayItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between bg-[#F1F5F9] rounded-lg px-4 py-2.5"
              >
                <span className="text-sm text-[#1E293B]">{item.name}</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    item.isStandard
                      ? "bg-[#10B981]/10 text-[#10B981]"
                      : "bg-[#F59E0B]/10 text-[#F59E0B]"
                  }`}
                >
                  {item.isStandard ? "Standard" : "Optional"}
                </span>
              </div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// --------------- Gallery with Lightbox ---------------
function Gallery() {
  const [filter, setFilter] = useState<"All" | "Exterior" | "Interior">("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const filters = ["All", "Exterior", "Interior"] as const;

  const images = [
    { label: "Front Three-Quarter", category: "Exterior" },
    { label: "Side Profile", category: "Exterior" },
    { label: "Rear View", category: "Exterior" },
    { label: "Front Grille Detail", category: "Exterior" },
    { label: "Dashboard", category: "Interior" },
    { label: "Rear Seats", category: "Interior" },
    { label: "Steering Wheel", category: "Interior" },
    { label: "Center Console", category: "Interior" },
    { label: "Wheel Design", category: "Exterior" },
  ];

  const filtered =
    filter === "All" ? images : images.filter((img) => img.category === filter);

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
              filter === f
                ? "bg-[#1A56DB] text-white border-[#1A56DB]"
                : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1A56DB]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {filtered.map((img, i) => (
          <button
            key={`${img.label}-${i}`}
            onClick={() => setLightboxIndex(i)}
            className="rounded-lg overflow-hidden hover:ring-2 hover:ring-[#1A56DB] transition-all"
          >
            <PlaceholderImage
              aspectRatio="4/3"
              className="w-full"
              label={img.label}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 end-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {lightboxIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex - 1);
                }}
                className="absolute start-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {lightboxIndex < filtered.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex + 1);
                }}
                className="absolute end-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <div
              className="w-full max-w-4xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <PlaceholderImage
                aspectRatio="16/9"
                className="w-full rounded-lg"
                label={filtered[lightboxIndex]?.label}
              />
              <p className="text-white/70 text-sm text-center mt-3">
                {filtered[lightboxIndex]?.label} -- {lightboxIndex + 1} of{" "}
                {filtered.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --------------- Pricing Breakdown ---------------
function PricingBreakdown({
  trim,
  selectedVariant,
}: {
  trim: Trim;
  selectedVariant: TrimVariant | null;
}) {
  const basePrice = selectedVariant ? selectedVariant.price : trim.price;
  const regFees = Math.round(basePrice * 0.02);
  const insurance = Math.round(basePrice * 0.035);
  const totalEstimate = basePrice + regFees + insurance;

  const [downPct, setDownPct] = useState(20);
  const [tenure, setTenure] = useState(48);

  const downPayment = Math.round(totalEstimate * (downPct / 100));
  const financed = totalEstimate - downPayment;
  const rate = 0.039;
  const monthly =
    tenure > 0
      ? Math.round((financed * (1 + rate * (tenure / 12))) / tenure)
      : 0;

  return (
    <div className="space-y-6">
      {/* Base price */}
      <div className="bg-[#F1F5F9] rounded-xl p-5">
        <p className="text-sm text-[#64748B] mb-1">Base Price</p>
        <p className="text-3xl font-bold text-[#F59E0B]">
          {formatPrice(basePrice)} KWD
        </p>
      </div>

      {/* Estimated Fees */}
      <div className="bg-[#F1F5F9] rounded-xl p-5 space-y-3">
        <h4 className="font-bold text-[#1E293B] text-sm">Estimated Fees</h4>
        <div className="flex justify-between text-sm">
          <span className="text-[#64748B]">Registration Fees (est.)</span>
          <span className="text-[#1E293B] font-medium">
            {formatPrice(regFees)} KWD
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#64748B]">Insurance (est.)</span>
          <span className="text-[#1E293B] font-medium">
            {formatPrice(insurance)} KWD
          </span>
        </div>
        <div className="border-t border-[#E2E8F0] pt-3 flex justify-between text-sm">
          <span className="text-[#1E293B] font-bold">Total Estimate</span>
          <span className="text-[#1E293B] font-bold">
            {formatPrice(totalEstimate)} KWD
          </span>
        </div>
      </div>

      {/* Monthly Calculator */}
      <div className="bg-[#F1F5F9] rounded-xl p-5 space-y-5">
        <h4 className="font-bold text-[#1E293B] text-sm">
          Monthly Installment Calculator
        </h4>

        {/* Down Payment */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#64748B]">Down Payment</span>
            <span className="text-[#1E293B] font-medium">
              {downPct}% ({formatPrice(downPayment)} KWD)
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))}
            className="w-full accent-[#1A56DB]"
          />
          <div className="flex justify-between text-xs text-[#64748B] mt-1">
            <span>10%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Tenure */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#64748B]">Tenure</span>
            <span className="text-[#1E293B] font-medium">{tenure} months</span>
          </div>
          <input
            type="range"
            min={12}
            max={60}
            step={6}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full accent-[#1A56DB]"
          />
          <div className="flex justify-between text-xs text-[#64748B] mt-1">
            <span>12 mo</span>
            <span>60 mo</span>
          </div>
        </div>

        {/* Result */}
        <div className="bg-white rounded-lg p-4 text-center">
          <p className="text-xs text-[#64748B] mb-1">
            Estimated Monthly Installment
          </p>
          <p className="text-2xl font-bold text-[#1A56DB]">
            {formatPrice(monthly)} KWD/mo
          </p>
        </div>
      </div>
    </div>
  );
}

// --------------- Branches Section ---------------
function BranchesSection({ modelId }: { modelId: string }) {
  const branchList = getBranchesForModel(modelId);

  return (
    <div className="space-y-3">
      {branchList.map((branch) => (
        <div
          key={branch.id}
          className="flex items-start gap-4 bg-[#F1F5F9] rounded-xl p-4"
        >
          <div className="w-10 h-10 rounded-full bg-[#1A56DB]/10 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-[#1A56DB]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-[#1E293B]">{branch.name}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{branch.location}</p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <a
                href={`tel:${branch.phone}`}
                className="flex items-center gap-1.5 text-xs text-[#1A56DB] hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                {branch.phone}
              </a>
              <a
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#1A56DB] hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open in Maps
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// --------------- Key Highlights ---------------
function KeyHighlights({
  model,
  trimCount,
}: {
  model: { bodyType: string; year: number; specsSummary: { engineRange: string; hpRange: string; fuelTypes: string[] } };
  trimCount: number;
}) {
  const highlights = [
    { icon: Car, label: "Body Type", value: model.bodyType },
    { icon: Calendar, label: "Model Year", value: String(model.year) },
    { icon: Cog, label: "Engine", value: model.specsSummary.engineRange },
    { icon: Zap, label: "Power", value: model.specsSummary.hpRange },
    { icon: Fuel, label: "Fuel", value: model.specsSummary.fuelTypes.join(", ") },
    { icon: Layers, label: "Trims", value: `${trimCount} available` },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
      {highlights.map((h) => {
        const Icon = h.icon;
        return (
          <div key={h.label} className="bg-[#F1F5F9] rounded-lg p-3 text-center">
            <Icon className="w-4 h-4 text-[#1A56DB] mx-auto mb-1.5" />
            <p className="text-[10px] text-[#64748B] uppercase tracking-wide">{h.label}</p>
            <p className="text-xs font-bold text-[#1E293B] mt-0.5 truncate">{h.value}</p>
          </div>
        );
      })}
    </div>
  );
}

// --------------- All Trims Comparison ---------------
function AllTrimsComparison({
  trims,
  modelId,
}: {
  trims: Trim[];
  modelId: string;
}) {
  const specRows = [
    { label: "Engine", get: (t: Trim) => t.engineSummary },
    { label: "Power", get: (t: Trim) => `${t.specs.horsepower} hp` },
    { label: "Torque", get: (t: Trim) => `${t.specs.torque} Nm` },
    { label: "0-100", get: (t: Trim) => `${t.specs.zeroToHundred}s` },
    { label: "Transmission", get: (t: Trim) => t.specs.transmission },
    { label: "Drive", get: (t: Trim) => t.specs.driveType },
    { label: "Fuel Economy", get: (t: Trim) => t.specs.fuelEconomyCombined > 0 ? `${t.specs.fuelEconomyCombined} L/100km` : "Electric" },
  ];

  return (
    <div>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto styled-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-start text-xs font-medium text-[#64748B] p-2 w-32" />
              {trims.map((t) => (
                <th key={t.id} className="p-2 text-center min-w-[160px]">
                  <div className="w-full rounded-lg p-3 border border-[#E2E8F0] bg-white text-start">
                    <p className="font-bold text-sm text-[#1E293B]">{t.name}</p>
                    <p className="text-sm font-bold text-[#F59E0B] mt-0.5">{formatPrice(t.price)} KWD</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specRows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-[#F8FAFC]" : "bg-white"}>
                <td className="px-3 py-2.5 text-xs font-medium text-[#64748B]">{row.label}</td>
                {trims.map((t) => (
                  <td key={t.id} className="px-3 py-2.5 text-sm text-[#1E293B] text-center">{row.get(t)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile table */}
      <div className="md:hidden overflow-x-auto styled-scrollbar -mx-4 px-4">
        <table className="w-full border-collapse min-w-[320px]">
          <thead>
            <tr>
              <th className="text-start text-xs font-medium text-[#64748B] p-2 w-24" />
              {trims.map((t) => (
                <th key={t.id} className="p-2 text-center">
                  <div className="rounded-lg p-2.5 border border-[#E2E8F0] bg-white text-start">
                    <p className="font-bold text-xs text-[#1E293B]">{t.name}</p>
                    <p className="text-xs font-bold text-[#F59E0B] mt-0.5">{formatPrice(t.price)} KWD</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specRows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-[#F8FAFC]" : "bg-white"}>
                <td className="px-2 py-2 text-[11px] font-medium text-[#64748B]">{row.label}</td>
                {trims.map((t) => (
                  <td key={t.id} className="px-2 py-2 text-xs text-[#1E293B] text-center">{row.get(t)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =============== MAIN PAGE COMPONENT ===============
export default function ModelDetailClient({ id }: { id: string }) {
  const model = getModelById(id);
  const brand = getBrandByModelId(id);
  const allTrims = getTrimsByModel(id);

  const [selectedTrimId, setSelectedTrimId] = useState(allTrims[0]?.id || "");
  const [selectedVariant, setSelectedVariant] = useState<TrimVariant | null>(
    null
  );
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const isEmbedded = useIsEmbedded();

  const selectedTrim = allTrims.find((t) => t.id === selectedTrimId) || allTrims[0];
  const currentPrice = selectedVariant
    ? selectedVariant.price
    : selectedTrim?.price || 0;

  if (!model || !brand || !selectedTrim) {
    return (
      <CompareProvider>
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-[#F8FAFC] min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-xl font-bold text-[#1E293B] mb-2">
              Model Not Found
            </h1>
            <p className="text-sm text-[#64748B]">
              The model you are looking for does not exist.
            </p>
            <EmbedAnchor
              href="/"
              className="inline-block mt-4 px-5 py-2.5 bg-[#1A56DB] text-white text-sm font-medium rounded-xl hover:bg-[#1A56DB]/90 transition-colors"
            >
              Go Home
            </EmbedAnchor>
          </div>
        </main>
        <Footer />
      </CompareProvider>
    );
  }

  const baseEquipment = allTrims[0]?.equipment || [];

  return (
    <CompareProvider>
      <Navbar />

      <main className="flex-1 bg-[#F8FAFC] pb-32 md:pb-8">
        {/* ---- Breadcrumb (desktop) ---- */}
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <nav className="hidden md:flex py-3 text-xs text-[#64748B] items-center gap-1.5 overflow-x-auto">
            <EmbedAnchor href="/" className="hover:text-[#1A56DB] shrink-0">
              Home
            </EmbedAnchor>
            <span>/</span>
            <EmbedAnchor
              href={`/brand/${brand.id}`}
              className="hover:text-[#1A56DB] shrink-0"
            >
              {brand.name}
            </EmbedAnchor>
            <span>/</span>
            <span className="text-[#1E293B] font-medium truncate">
              {model.name}
            </span>
          </nav>
          {/* ---- Mobile back button ---- */}
          <div className="md:hidden py-3">
            <EmbedAnchor
              href={`/brand/${brand.id}`}
              className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#1A56DB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to {brand.name}</span>
            </EmbedAnchor>
          </div>
        </div>

        {/* ---- Hero Section (full-width) ---- */}
        <FadeSection>
          <div className="relative w-full">
            <HeroCarousel trimName={selectedTrim.name} />
            {/* Bookmark */}
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`absolute top-3 end-3 z-10 w-10 h-10 flex items-center justify-center rounded-full shadow transition-colors ${
                bookmarked
                  ? "bg-[#1A56DB] text-white"
                  : "bg-white/80 text-[#64748B] hover:text-[#1A56DB]"
              }`}
              aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark
                className="w-5 h-5"
                fill={bookmarked ? "currentColor" : "none"}
              />
            </button>
          </div>
        </FadeSection>

        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="mt-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B]">
                  {brand.name} {model.name}
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-sm text-[#64748B]">{model.year}</span>
                  <span className="px-2.5 py-0.5 text-xs rounded-full bg-[#F1F5F9] text-[#64748B] font-medium">
                    {model.bodyType}
                  </span>
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentPrice}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="text-xl md:text-2xl font-bold text-[#F59E0B]"
                >
                  Starting from {formatPrice(currentPrice)} KWD
                </motion.p>
              </AnimatePresence>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={() => setLeadModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 bg-[#1A56DB] text-white text-sm font-bold rounded-xl hover:bg-[#1A56DB]/90 transition-colors"
              >
                I&apos;m Interested
              </button>
              <button
                onClick={() => document.getElementById("branches-section")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full sm:w-auto px-6 py-3 border-2 border-[#1A56DB] text-[#1A56DB] text-sm font-bold rounded-xl hover:bg-[#1A56DB]/5 transition-colors"
              >
                Contact Dealership
              </button>
              <a
                href={`/brand/${brand.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 text-[#64748B] text-sm font-medium rounded-xl hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
              >
                Visit Brand Website
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* ---- Key Highlights ---- */}
          <FadeSection className="mt-6">
            <KeyHighlights model={model} trimCount={allTrims.length} />
          </FadeSection>

          {/* ---- Two Column Layout (desktop) ---- */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-8 mt-8">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-10">
              {/* ---- All Trims Comparison ---- */}
              <FadeSection>
                <h2 className="text-lg font-bold text-[#1E293B] mb-4">
                  Compare Trims
                </h2>
                <AllTrimsComparison
                  trims={allTrims}
                  modelId={model.id}
                />
              </FadeSection>

              {/* ---- Trim Selector ---- */}
              <FadeSection>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-[#1E293B]">
                    {model.name} Trims
                  </h2>
                  <EmbedAnchor
                    href={`/model/${model.id}/trims`}
                    className="flex items-center gap-1 text-sm font-medium text-[#1A56DB] hover:underline transition-colors"
                  >
                    View All Trims
                    <ArrowUpRight className="w-4 h-4" />
                  </EmbedAnchor>
                </div>
                <TrimSelector
                  trims={allTrims}
                  selectedTrimId={selectedTrimId}
                  onSelect={(id) => {
                    setSelectedTrimId(id);
                    setSelectedVariant(null);
                  }}
                  selectedVariant={selectedVariant}
                  onVariantSelect={setSelectedVariant}
                  modelId={model.id}
                />
              </FadeSection>

              {/* ---- Key Specs ---- */}
              <FadeSection>
                <h2 className="text-lg font-bold text-[#1E293B] mb-4">
                  Full Specifications {"\u2014"} {selectedTrim.name}
                </h2>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTrimId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <KeySpecsPanel trim={selectedTrim} />
                  </motion.div>
                </AnimatePresence>
              </FadeSection>

              {/* ---- Equipment ---- */}
              <FadeSection>
                <h2 className="text-lg font-bold text-[#1E293B] mb-4">
                  Standard &amp; Optional Equipment
                </h2>
                <EquipmentSection
                  equipment={selectedTrim.equipment}
                  baseEquipment={baseEquipment}
                />
              </FadeSection>

              {/* ---- Gallery ---- */}
              <FadeSection>
                <h2 className="text-lg font-bold text-[#1E293B] mb-4">Gallery</h2>
                <Gallery />
              </FadeSection>
            </div>

            {/* Right sidebar (desktop) */}
            <div className="lg:col-span-1 mt-10 lg:mt-0">
              <div className="lg:sticky lg:top-20 space-y-6">
                {/* ---- Pricing Breakdown ---- */}
                <FadeSection>
                  <h2 className="text-lg font-bold text-[#1E293B] mb-4">
                    Pricing
                  </h2>
                  <PricingBreakdown
                    trim={selectedTrim}
                    selectedVariant={selectedVariant}
                  />
                </FadeSection>

                {/* ---- Branches ---- */}
                <FadeSection>
                  <h2 id="branches-section" className="text-lg font-bold text-[#1E293B] mb-4 scroll-mt-24">
                    Authorized Branches
                  </h2>
                  <BranchesSection modelId={model.id} />
                </FadeSection>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ---- Sticky Footer (Mobile) ---- */}
      <div className={`md:hidden fixed inset-x-0 z-40 bg-white border-t border-[#E2E8F0] px-4 py-2.5 flex items-center justify-between shadow-[0_-2px_10px_rgba(0,0,0,0.06)] ${
        isEmbedded ? "bottom-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]" : "bottom-[calc(3.5rem+env(safe-area-inset-bottom))]"
      }`}>
        <div className="min-w-0">
          <p className="text-[10px] text-[#64748B] leading-tight">Starting from</p>
          <p className="text-base font-bold text-[#F59E0B] leading-tight">
            {formatPrice(currentPrice)} KWD
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/brand/${brand.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1E293B] text-white hover:bg-[#1E293B]/80 transition-colors"
            aria-label="Visit brand website"
          >
            <ExternalLink className="w-[18px] h-[18px]" />
          </a>
          <button
            onClick={() => setLeadModalOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1A56DB] text-white hover:bg-[#1A56DB]/90 transition-colors"
            aria-label="I'm interested"
          >
            <Send className="w-[18px] h-[18px]" />
          </button>
          <a
            href={`tel:${getBranchesForModel(model.id)[0]?.phone || "+965 2222 1111"}`}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#10B981] text-white hover:bg-[#10B981]/80 transition-colors"
            aria-label="Call dealership"
          >
            <Phone className="w-[18px] h-[18px]" />
          </a>
        </div>
      </div>

      <Footer />
      <MobileTabBar />

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        vehicle={{
          brandName: brand.name,
          modelName: model.name,
          trimName: selectedTrim.name,
          variantName: selectedVariant?.name,
        }}
      />
    </CompareProvider>
  );
}
