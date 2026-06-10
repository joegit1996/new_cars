"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
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
  ChevronDown,
  Search,
  Scale,
} from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { useLanguage, tFormat } from "@/context/LanguageContext";
import { EquipmentCategory } from "@/data/types";
import type { Trim, TrimVariant, Equipment } from "@/data/types";
import PlaceholderImage from "@/components/PlaceholderImage";
import VideoHero from "@/components/VideoHero";
import CircularGallery from "@/components/CircularGallery";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileTabBar from "@/components/MobileTabBar";
import { CompareProvider } from "@/context/CompareContext";
import { EmbedAnchor } from "@/components/EmbedLink";
import { useIsEmbedded } from "@/hooks/useIsEmbedded";
import { CardsParallax } from "@/components/ui/scroll-cards";
import { FinanceCalculator } from "@/components/FinanceCalculator";
import NextImage from "next/image";
import type { FinancierCalcConfig, Seller, SellerListing } from "@/data/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPrice(price: number) {
  return price.toLocaleString("en-US");
}

function FadeSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      id={id}
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
// Hero Video (replaces carousel)
// ---------------------------------------------------------------------------

function HeroVideo({ heroMedia }: { heroMedia?: { type: "video" | "image"; url: string } }) {
  return <VideoHero media={heroMedia} />;
}

// ---------------------------------------------------------------------------
// Porsche-style Trim Tabs (like Coupe / Cabriolet / Targa)
// ---------------------------------------------------------------------------

function TrimTabs({
  trims,
  selectedTrimId,
  onSelect,
}: {
  trims: Trim[];
  selectedTrimId: string;
  onSelect: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ln } = useLanguage();

  return (
    <div
      ref={scrollRef}
      className="flex items-center justify-center gap-1 md:gap-2 overflow-x-auto py-1 px-4 md:px-0"
      style={{ scrollbarWidth: "none" }}
    >
      {trims.map((trim) => {
        const isSelected = trim.id === selectedTrimId;
        return (
          <button
            key={trim.id}
            onClick={() => onSelect(trim.id)}
            className={`relative shrink-0 px-4 py-2.5 text-sm transition-colors whitespace-nowrap ${
              isSelected
                ? "text-[#1E293B] font-bold"
                : "text-[#64748B] hover:text-[#1E293B]"
            }`}
          >
            {ln.trim(trim.name)}
            {isSelected && (
              <motion.div
                layoutId="trim-underline"
                className="absolute bottom-0 inset-x-2 h-[2px] bg-[#1E293B] rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Porsche-style Hero Specs (massive typography)
// ---------------------------------------------------------------------------

function HeroSpecs({ trim, bodyType, imageUrl }: { trim: Trim; bodyType: string; imageUrl?: string }) {
  const { t, ln } = useLanguage();
  const s = trim.specs;

  const stats = [
    {
      value: String(s.zeroToHundred),
      unit: "s",
      label: t.model.acceleration0to100Label,
    },
    {
      value: String(s.horsepower),
      unit: "hp",
      label: `${t.model.power} (${ln.engineSummary(s.engineType)})`,
    },
    {
      value: String(s.topSpeed),
      unit: "km/h",
      label: t.model.topSpeedLabel,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-20">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Left: specs */}
        <div className="flex-1 space-y-8 md:space-y-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="flex items-baseline gap-1">
                <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#1E293B] leading-none tracking-tight">
                  {stat.value}
                </span>
                <span className="text-lg md:text-xl font-medium text-[#64748B]">
                  {stat.unit}
                </span>
              </div>
              <p className="text-sm text-[#64748B] mt-1">{stat.label}</p>
            </motion.div>
          ))}

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            onClick={() => document.getElementById("section-specs")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#1E293B] border border-[#E2E8F0] rounded-lg hover:border-[#1E293B] transition-colors"
          >
            {t.model.viewAllTechnicalDetails}
          </motion.button>
        </div>

        {/* Right: car front view */}
        <motion.div
          className="flex-1 max-w-xl md:max-w-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PlaceholderImage
            aspectRatio="4/3"
            bodyType={bodyType}
            label=""
            className="w-full rounded-2xl"
            silhouetteSize="lg"
            imageUrl={imageUrl}
          />
        </motion.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scroll Cards Section (full-screen stacking cards)
// ---------------------------------------------------------------------------

function ScrollCardsSection({
  model,
  trim,
  bodyType,
  imageUrl,
  images,
}: {
  model: { name: string; bodyType: string; imageUrl?: string };
  trim: Trim;
  images?: { front?: string; rear?: string; side?: string; detail?: string; hero?: string };
  bodyType: string;
  imageUrl?: string;
}) {
  const { t, ln } = useLanguage();
  const s = trim.specs;

  const items = useMemo(
    () => [
      {
        tag: t.model.performance,
        title: `${s.horsepower} hp.`,
        description: tFormat(t.model.descPerformance, { torque: s.torque, zeroToHundred: s.zeroToHundred, topSpeed: s.topSpeed }),
        image: (
          <PlaceholderImage
            aspectRatio="4/3"
            bodyType={bodyType}
            label=""
            className="w-full md:rounded-2xl"
            silhouetteSize="lg"
            imageUrl={images?.front ?? imageUrl}
          />
        ),
        color: "#0F172A",
        textColor: "#FFFFFF",
      },
      {
        tag: t.model.drivetrainTag,
        title: `${ln.transmission(s.transmission)}.`,
        description: tFormat(t.model.descDrivetrainEngine, {
          engineType: ln.engineSummary(s.engineType),
          engineDetail: s.displacement > 0
            ? tFormat(t.model.engineDetailCylinder, { displacement: s.displacement, cylinders: s.cylinders })
            : t.model.engineDetailElectric,
          driveType: ln.drive(s.driveType),
        }),
        image: (
          <PlaceholderImage
            aspectRatio="4/3"
            bodyType={bodyType}
            label=""
            className="w-full md:rounded-2xl"
            silhouetteSize="lg"
            imageUrl={images?.detail ?? imageUrl}
          />
        ),
        color: "#FFFFFF",
        textColor: "#1E293B",
      },
      {
        tag: t.model.designTag,
        title: `${(t.bodyTypes as Record<string, string>)[model.bodyType] ?? model.bodyType}.`,
        description: tFormat(t.model.descDesign, {
          lengthMm: s.lengthMm,
          widthMm: s.widthMm,
          heightMm: s.heightMm,
          seatingCapacity: s.seatingCapacity,
          trunkVolumeLiters: s.trunkVolumeLiters,
        }),
        image: (
          <PlaceholderImage
            aspectRatio="4/3"
            bodyType={bodyType}
            label=""
            className="w-full md:rounded-2xl"
            silhouetteSize="lg"
            imageUrl={images?.side ?? imageUrl}
          />
        ),
        color: "#F8FAFC",
        textColor: "#1E293B",
      },
      {
        tag: t.model.efficiencyTag,
        title: s.fuelEconomyCombined > 0 ? `${s.fuelEconomyCombined} L/100km.` : t.model.zeroEmissions,
        description: s.fuelEconomyCombined > 0
          ? tFormat(t.model.descEfficiencyFuel, { city: s.fuelEconomyCity, highway: s.fuelEconomyHighway, fuelTank: s.fuelTankLiters })
          : t.model.pureElectricLong,
        image: (
          <PlaceholderImage
            aspectRatio="4/3"
            bodyType={bodyType}
            label=""
            className="w-full md:rounded-2xl"
            silhouetteSize="lg"
            imageUrl={images?.rear ?? imageUrl}
          />
        ),
        color: "#111318",
        textColor: "#FFFFFF",
      },
    ],
    [trim, model, bodyType, images, t]
  );

  return <CardsParallax items={items} />;
}

// ---------------------------------------------------------------------------
// Sticky Sub-nav (Porsche-style)
// ---------------------------------------------------------------------------

function StickySubNav({
  modelName,
  brandName,
  leadFormUrl,
  visible,
}: {
  modelName: string;
  brandName: string;
  leadFormUrl?: string;
  visible: boolean;
}) {
  const { t, ln } = useLanguage();
  const sections = [
    { id: "section-highlights", label: t.model.sectionHighlights },
    { id: "section-specs", label: t.model.sectionSpecs },
    { id: "section-gallery", label: t.model.sectionGallery },
    { id: "section-pricing", label: t.model.sectionPricing },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0] shadow-sm"
        >
          <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between h-12">
            {/* Left: model name */}
            <div className="flex items-center gap-4 min-w-0">
              <span className="font-bold text-sm text-[#1E293B] truncate">
                {ln.brand(brandName)} {ln.model(modelName)}
              </span>
              {/* Section links - desktop */}
              <nav className="hidden md:flex items-center gap-1">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
                    className="px-3 py-1.5 text-xs text-[#64748B] hover:text-[#1E293B] transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right: Search, Compare, CTA */}
            <div className="flex items-center gap-3">
              <EmbedAnchor
                href="/search"
                className="w-8 h-8 flex items-center justify-center rounded-full text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
                aria-label={t.common.search}
              >
                <Search className="w-4 h-4" />
              </EmbedAnchor>
              <EmbedAnchor
                href="/compare"
                className="w-8 h-8 flex items-center justify-center rounded-full text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
                aria-label={t.model.compare}
              >
                <Scale className="w-4 h-4" />
              </EmbedAnchor>
              {leadFormUrl && (
                <a
                  href={leadFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 text-xs font-bold bg-[#1A56DB] text-white rounded-lg hover:bg-[#1A56DB]/90 transition-colors"
                >
                  {t.model.imInterested}
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Feature Highlights Carousel (Porsche-style dark cards)
// ---------------------------------------------------------------------------

function FeatureHighlights({
  model,
  trim,
}: {
  model: { bodyType: string; year: number; specsSummary: { engineRange: string; hpRange: string; fuelTypes: string[] }; imageUrl?: string; images?: { front?: string; rear?: string; side?: string; detail?: string; hero?: string } };
  trim: Trim;
}) {
  const { t, dir, ln } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  const imgs = model.images;
  const features = useMemo(() => [
    {
      title: t.model.featurePerformance,
      description: tFormat(t.model.descPerformanceFeature, {
        horsepower: trim.specs.horsepower,
        torque: trim.specs.torque,
        zeroToHundred: trim.specs.zeroToHundred,
        topSpeed: trim.specs.topSpeed,
      }),
      image: imgs?.hero ?? model.imageUrl,
    },
    {
      title: t.model.featureDrivetrain,
      description: tFormat(t.model.descDrivetrainFeature, {
        transmission: ln.transmission(trim.specs.transmission),
        driveType: ln.drive(trim.specs.driveType),
        engineType: trim.specs.engineType,
        engineDetail: trim.specs.displacement > 0
          ? tFormat(t.model.engineDetailCylinderFeature, { displacement: trim.specs.displacement, cylinders: trim.specs.cylinders })
          : t.model.engineDetailElectricFeature,
      }),
      image: imgs?.detail ?? model.imageUrl,
    },
    {
      title: t.model.featureEfficiency,
      description: trim.specs.fuelEconomyCombined > 0
        ? tFormat(t.model.descEfficiencyFeatureFuel, {
            combined: trim.specs.fuelEconomyCombined,
            city: trim.specs.fuelEconomyCity,
            highway: trim.specs.fuelEconomyHighway,
            fuelTank: trim.specs.fuelTankLiters,
          })
        : t.model.descEfficiencyFeatureElectric,
      image: imgs?.side ?? model.imageUrl,
    },
    {
      title: t.model.featureDesign,
      description: tFormat(t.model.descDesignFeature, {
        bodyType: (t.bodyTypes as Record<string, string>)[model.bodyType] ?? model.bodyType,
        seatingCapacity: trim.specs.seatingCapacity,
        lengthMm: trim.specs.lengthMm,
        widthMm: trim.specs.widthMm,
        wheelbaseMm: trim.specs.wheelbaseMm,
      }),
      image: imgs?.front ?? model.imageUrl,
    },
    {
      title: t.model.featureComfort,
      description: tFormat(t.model.descComfortFeature, {
        trunkVolumeLiters: trim.specs.trunkVolumeLiters,
        curbWeight: trim.specs.curbWeightKg,
        warranty: trim.specs.warranty,
      }),
      image: imgs?.rear ?? model.imageUrl,
    },
  ], [trim, model, imgs, t]);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    const first = el.querySelector<HTMLElement>(":scope > div");
    if (first) {
      const cardW = first.offsetWidth + 16; // gap-4
      const idx = Math.round(el.scrollLeft / cardW);
      setActiveIndex(Math.max(0, Math.min(idx, features.length - 1)));
    }
  }, [features.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("div")?.offsetWidth || 400;
    el.scrollBy({ left: dir === "left" ? -cardWidth - 16 : cardWidth + 16, behavior: "smooth" });
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragStartX.current = e.pageX - el.offsetLeft;
    dragScrollLeft.current = el.scrollLeft;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = dragScrollLeft.current - (x - dragStartX.current);
  }, [isDragging]);

  const handleMouseUpOrLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs text-[#1A56DB] font-bold uppercase tracking-wider mb-1">{t.model.sectionHighlights}</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B]">
            {t.model.whatDefinesThisCar}
          </h2>
        </div>
        {/* Scroll arrows - desktop */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
              canScrollLeft
                ? "border-[#E2E8F0] text-[#1E293B] hover:border-[#1E293B]"
                : "border-[#E2E8F0] text-[#CBD5E1] cursor-default"
            }`}
            aria-label={t.common.previous}
          >
            <ChevronLeft className={`w-5 h-5 ${dir === "rtl" ? "rotate-180" : ""}`} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
              canScrollRight
                ? "border-[#E2E8F0] text-[#1E293B] hover:border-[#1E293B]"
                : "border-[#E2E8F0] text-[#CBD5E1] cursor-default"
            }`}
            aria-label={t.common.next}
          >
            <ChevronRight className={`w-5 h-5 ${dir === "rtl" ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Horizontal carousel — snap on touch (mobile), free-scroll on desktop click-drag */}
      <div
        ref={scrollRef}
        className={`flex gap-4 overflow-x-auto pb-4 select-none ps-4 md:ps-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] snap-x snap-mandatory md:snap-none ${isDragging ? "cursor-grabbing snap-none" : "cursor-grab"}`}
        style={{
          scrollbarWidth: "none",
          paddingRight: "1rem",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {features.map((feature, i) => (
          <div
            key={feature.title}
            className="shrink-0 w-[85vw] md:w-[55vw] lg:w-[42vw] rounded-2xl overflow-hidden relative snap-start"
          >
            {/* Dark image background */}
            <div className="relative aspect-[4/3]">
              <PlaceholderImage
                aspectRatio="4/3"
                bodyType={model.bodyType}
                label=""
                className="w-full h-full !bg-[#111318]"
                silhouetteSize="md"
                imageUrl={feature.image}
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-[#111318]/60 to-transparent" />

              {/* Text overlay at bottom */}
              <div className="absolute bottom-0 inset-x-0 p-5 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots indicator (mobile) */}
      <div className="flex md:hidden justify-center gap-1.5 mt-4">
        {features.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === activeIndex ? "w-6 bg-[#1A56DB]" : "w-2 bg-[#CBD5E1]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Driving Experience Section (Porsche-inspired)
// ---------------------------------------------------------------------------

function DrivingExperienceSection({
  model,
  trim,
}: {
  model: { name: string; bodyType: string; imageUrl?: string };
  trim: Trim;
}) {
  const { t } = useLanguage();
  const s = trim.specs;
  const features = useMemo(
    () => [
      {
        title: t.model.chassisHandling,
        description: tFormat(t.model.descChassis, {
          driveType: s.driveType,
          wheelbaseMm: s.wheelbaseMm,
          curbWeight: s.curbWeightKg,
        }),
        icon: <Shield className="w-5 h-5" />,
      },
      {
        title: t.model.powertrain,
        description: tFormat(t.model.descPowertrain, {
          engineType: s.engineType,
          engineDetail: s.displacement > 0
            ? tFormat(t.model.engineDetailCylinderDriving, { displacement: s.displacement, cylinders: s.cylinders })
            : t.model.engineDetailElectricDriving,
          horsepower: s.horsepower,
          torque: s.torque,
          transmission: s.transmission,
        }),
        icon: <Zap className="w-5 h-5" />,
      },
      {
        title: t.model.accelerationAndSpeed,
        description: tFormat(t.model.descAccelerationSpeed, {
          zeroToHundred: s.zeroToHundred,
          topSpeed: s.topSpeed,
        }),
        icon: <Timer className="w-5 h-5" />,
      },
      {
        title: t.model.proportions,
        description: tFormat(t.model.descProportions, {
          lengthMm: s.lengthMm,
          widthMm: s.widthMm,
          heightMm: s.heightMm,
          seatingCapacity: s.seatingCapacity,
          trunkVolumeLiters: s.trunkVolumeLiters,
        }),
        icon: <Ruler className="w-5 h-5" />,
      },
    ],
    [trim, t]
  );

  return (
    <div className="bg-[#111318]">
      {/* Hero area with car image */}
      <div className="relative overflow-hidden">
        <div className="aspect-[3/4] md:aspect-[2/1]">
          <PlaceholderImage
            aspectRatio="2/1"
            bodyType={model.bodyType}
            label=""
            className="w-full h-full !bg-[#111318] opacity-60"
            silhouetteSize="lg"
            imageUrl={model.imageUrl}
          />
        </div>
        {/* Gradual fade from photo into section background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent 30%, rgba(17,19,24,0.1) 50%, rgba(17,19,24,0.45) 65%, rgba(17,19,24,0.8) 80%, #111318 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl mx-auto px-4 md:px-6 pb-10 md:pb-14 w-full">
            <p className="text-xs text-[#1A56DB] font-bold uppercase tracking-wider mb-2">
              {t.model.theExperience}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight max-w-xl">
              {t.model.drivingDynamics}
            </h2>
            <p className="text-sm md:text-base text-white/60 mt-3 max-w-lg leading-relaxed">
              {tFormat(t.model.drivingDynamicsSubtitle, { model: model.name })}
            </p>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex gap-4 p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08]"
            >
              <div className="w-10 h-10 rounded-full bg-[#1A56DB]/20 flex items-center justify-center shrink-0 text-[#1A56DB]">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Variant Selector (sub-trim variants)
// ---------------------------------------------------------------------------

function VariantSelector({
  trim,
  selectedVariant,
  onVariantSelect,
}: {
  trim: Trim;
  selectedVariant: TrimVariant | null;
  onVariantSelect: (v: TrimVariant | null) => void;
}) {
  const { t, ln } = useLanguage();
  if (trim.variants.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
      <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-2">
        {tFormat(t.model.variantsLabel, { trim: ln.trim(trim.name) })}
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
          {t.model.baseVariant}
        </button>
        {trim.variants.map((v) => (
          <button
            key={v.id}
            onClick={() => onVariantSelect(v)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              selectedVariant?.id === v.id
                ? "bg-[#1A56DB] text-white border-[#1A56DB]"
                : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1A56DB]"
            }`}
          >
            {ln.trim(v.name)} (+{formatPrice(v.price - trim.price)} {t.common.kwd})
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Full Specs (expandable, Porsche-style grouped)
// ---------------------------------------------------------------------------

function FullSpecs({ trim }: { trim: Trim }) {
  const { t, ln } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const s = trim.specs;

  const groups = [
    {
      title: t.model.engineAndPerformance,
      items: [
        { label: t.model.specEngine, value: ln.engineSummary(s.engineType) },
        { label: t.model.specDisplacement, value: s.displacement > 0 ? `${s.displacement}L` : t.model.na },
        { label: t.model.specCylinders, value: s.displacement > 0 ? String(s.cylinders) : t.model.na },
        { label: t.model.specHorsepower, value: `${s.horsepower} hp` },
        { label: t.model.specTorque, value: `${s.torque} Nm` },
        { label: t.model.spec0to100, value: `${s.zeroToHundred}s` },
        { label: t.model.specTopSpeed, value: `${s.topSpeed} km/h` },
      ],
    },
    {
      title: t.model.transmissionAndDrive,
      items: [
        { label: t.model.specTransmission, value: ln.transmission(s.transmission) },
        { label: t.model.specDriveType, value: ln.drive(s.driveType) },
      ],
    },
    {
      title: t.model.fuelEconomyGroup,
      items: [
        { label: t.model.specCity, value: s.fuelEconomyCity > 0 ? `${s.fuelEconomyCity} L/100km` : t.model.na },
        { label: t.model.specHighway, value: s.fuelEconomyHighway > 0 ? `${s.fuelEconomyHighway} L/100km` : t.model.na },
        { label: t.model.specCombined, value: s.fuelEconomyCombined > 0 ? `${s.fuelEconomyCombined} L/100km` : t.model.na },
        { label: t.model.specFuelTank, value: s.fuelTankLiters > 0 ? `${s.fuelTankLiters} L` : t.model.na },
      ],
    },
    {
      title: t.model.dimensionsAndWeight,
      items: [
        { label: t.model.specLength, value: `${s.lengthMm} mm` },
        { label: t.model.specWidth, value: `${s.widthMm} mm` },
        { label: t.model.specHeight, value: `${s.heightMm} mm` },
        { label: t.model.specWheelbase, value: `${s.wheelbaseMm} mm` },
        { label: t.model.specTrunkVolume, value: `${s.trunkVolumeLiters} L` },
        { label: t.model.specCurbWeight, value: `${s.curbWeightKg} kg` },
      ],
    },
    {
      title: t.model.other,
      items: [
        { label: t.model.specSeating, value: `${s.seatingCapacity}${t.model.seatsUnit}` },
        { label: t.model.specWarranty, value: s.warranty },
        { label: t.model.specSpecRegion, value: s.specRegion },
      ],
    },
  ];

  const visibleGroups = expanded ? groups : groups.slice(0, 2);

  return (
    <div>
      <div className="space-y-6">
        {visibleGroups.map((group) => (
          <div key={group.title}>
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">
              {group.title}
            </h4>
            <div className="divide-y divide-[#E2E8F0]">
              {group.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3"
                >
                  <span className="text-sm text-[#64748B]">{item.label}</span>
                  <span className="text-sm font-medium text-[#1E293B]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {groups.length > 2 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#1A56DB] hover:underline"
        >
          {expanded ? t.model.showLess : t.model.viewAllSpecifications}
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Equipment Section
// ---------------------------------------------------------------------------

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
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<EquipmentCategory>(EquipmentCategory.Safety);
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

  const catLabels: Record<EquipmentCategory, string> = {
    [EquipmentCategory.Safety]: t.model.catSafety,
    [EquipmentCategory.Comfort]: t.model.catComfort,
    [EquipmentCategory.Technology]: t.model.catTechnology,
    [EquipmentCategory.Exterior]: t.model.catExterior,
    [EquipmentCategory.Interior]: t.model.catInterior,
  };

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0" style={{ scrollbarWidth: "none" }}>
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
              {catLabels[cat]}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-3 mb-3">
        <button
          onClick={() => setShowDiffOnly(!showDiffOnly)}
          className="text-xs text-[#1A56DB] hover:underline font-medium"
        >
          {showDiffOnly ? t.model.showAll : t.model.showDifferencesFromBase}
        </button>
      </div>

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
              {t.model.noDifferencesInCategory}
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
                  {item.isStandard ? t.model.standard : t.model.optional}
                </span>
              </div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gallery images data (used by CircularGallery component)
// ---------------------------------------------------------------------------

const GALLERY_IMAGES_DATA = [
  { key: "galFrontThreeQuarter", category: "Exterior" },
  { key: "galSideProfile", category: "Exterior" },
  { key: "galRearView", category: "Exterior" },
  { key: "galFrontGrilleDetail", category: "Exterior" },
  { key: "galDashboard", category: "Interior" },
  { key: "galRearSeats", category: "Interior" },
  { key: "galSteeringWheel", category: "Interior" },
  { key: "galCenterConsole", category: "Interior" },
  { key: "galWheelDesign", category: "Exterior" },
] as const;

function GallerySection() {
  const { t } = useLanguage();
  const galleryFilters = [
    { key: "All", label: t.model.galleryAll },
    { key: "Exterior", label: t.model.galleryExterior },
    { key: "Interior", label: t.model.galleryInterior },
  ];
  const [galleryFilter, setGalleryFilter] = useState<string>("All");

  const galleryImages = GALLERY_IMAGES_DATA.map((g) => ({
    label: (t.model as Record<string, string>)[g.key] ?? g.key,
    category: g.category,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
      <p className="text-xs text-[#1A56DB] font-bold uppercase tracking-wider mb-1">{t.model.explore}</p>
      <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-6">
        {t.model.galleryTitle}
      </h2>
      <div className="flex gap-2 mb-4">
        {galleryFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setGalleryFilter(f.key)}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
              galleryFilter === f.key
                ? "bg-[#1A56DB] text-white border-[#1A56DB]"
                : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1A56DB]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <CircularGallery images={galleryImages} filter={galleryFilter} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pricing Breakdown (kept from original)
// ---------------------------------------------------------------------------

function PricingBreakdown({
  trim,
  selectedVariant,
}: {
  trim: Trim;
  selectedVariant: TrimVariant | null;
}) {
  const { t } = useLanguage();
  const { getSellerListingsForTrim } = useAppData();
  const onRequest = trim.priceOnRequest === true;
  const basePrice = selectedVariant ? selectedVariant.price : trim.price;
  const regFees = Math.round(basePrice * 0.02);
  const insurance = Math.round(basePrice * 0.035);
  const totalEstimate = basePrice + regFees + insurance;

  const sellerOffers = getSellerListingsForTrim(trim.id);
  // Default the calculator to the first available financier listing for this
  // trim (e.g. Boubyan when it covers the car). Falls back to the generic
  // calculator when no listing exists.
  const defaultFinancierId = useMemo(
    () =>
      sellerOffers.find(
        (o) => o.seller.type === "financier" && o.listing.paymentType === "installment"
      )?.seller.id ?? null,
    [sellerOffers]
  );
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(defaultFinancierId);

  // When the user switches trims/variants, re-pick the default for the new trim.
  useEffect(() => {
    setSelectedSellerId(defaultFinancierId);
  }, [defaultFinancierId, trim.id]);

  const selectedOffer = selectedSellerId
    ? sellerOffers.find((o) => o.seller.id === selectedSellerId) ?? null
    : null;

  const effectiveCalcConfig: FinancierCalcConfig | undefined = selectedOffer
    ? {
        ...(selectedOffer.seller.calculator ?? { paymentType: "installment" }),
        ...selectedOffer.listing.calculatorOverride,
      }
    : undefined;

  const effectiveAccent = selectedOffer
    ? {
        primary: selectedOffer.seller.brandColor,
        primaryDark: selectedOffer.seller.brandColorDark,
        logoUrl: selectedOffer.seller.logoUrl,
        label: selectedOffer.seller.name,
      }
    : undefined;

  if (onRequest) {
    return (
      <div className="space-y-6">
        <div className="bg-[#F1F5F9] rounded-xl p-5">
          <p className="text-sm text-[#64748B] mb-1">{t.model.basePriceLabel}</p>
          <p className="text-3xl font-bold text-[#F59E0B]">{t.common.priceOnRequest}</p>
        </div>
        {sellerOffers.length > 0 && (
          <SellerOffersList
            offers={sellerOffers}
            selectedSellerId={selectedSellerId}
            onSelect={setSelectedSellerId}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Base price */}
      <div className="bg-[#F1F5F9] rounded-xl p-5">
        <p className="text-sm text-[#64748B] mb-1">{t.model.basePriceLabel}</p>
        <p className="text-3xl font-bold text-[#F59E0B]">
          {formatPrice(basePrice)} {t.common.kwd}
        </p>
      </div>

      {/* Estimated Fees */}
      <div className="bg-[#F1F5F9] rounded-xl p-5 space-y-3">
        <h4 className="font-bold text-[#1E293B] text-sm">{t.model.estimatedFees}</h4>
        <div className="flex justify-between text-sm">
          <span className="text-[#64748B]">{t.model.registrationFees}</span>
          <span className="text-[#1E293B] font-medium">{formatPrice(regFees)} {t.common.kwd}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#64748B]">{t.model.insurance}</span>
          <span className="text-[#1E293B] font-medium">{formatPrice(insurance)} {t.common.kwd}</span>
        </div>
        <div className="border-t border-[#E2E8F0] pt-3 flex justify-between text-sm">
          <span className="text-[#1E293B] font-bold">{t.model.totalEstimate}</span>
          <span className="text-[#1E293B] font-bold">{formatPrice(totalEstimate)} {t.common.kwd}</span>
        </div>
      </div>

      {/* Available sellers */}
      {sellerOffers.length > 0 && (
        <SellerOffersList
          offers={sellerOffers}
          selectedSellerId={selectedSellerId}
          onSelect={setSelectedSellerId}
        />
      )}

      {/* Monthly Calculator (rebrands when a financier is selected) */}
      <FinanceCalculator
        totalEstimate={totalEstimate}
        config={effectiveCalcConfig}
        accent={effectiveAccent}
        branded={!!selectedOffer}
      />
    </div>
  );
}

function HeroSellerChips({ trimId }: { trimId: string }) {
  const { t } = useLanguage();
  const { getSellerListingsForTrim } = useAppData();
  const offers = getSellerListingsForTrim(trimId);
  if (offers.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="text-[11px] uppercase tracking-wider text-[#64748B] font-bold mb-2">
        {t.model.alsoAvailableFrom}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {offers.map(({ seller, listing }) => (
          <EmbedAnchor
            key={listing.id}
            href={`/sellers/${seller.slug}/listings/${listing.trimId}`}
            className="group inline-flex items-center gap-2 rounded-full bg-white border pl-1.5 pr-3 py-1 transition-colors hover:shadow-sm"
            style={{ borderColor: `${seller.brandColor}33` }}
          >
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white border"
              style={{ borderColor: `${seller.brandColor}55` }}
            >
              <NextImage
                src={seller.logoUrl}
                alt={seller.name}
                width={20}
                height={20}
                className="w-4 h-4 object-contain"
                unoptimized
              />
            </span>
            <span className="text-xs font-bold text-[#1E293B]">{seller.name}</span>
            {listing.promoText && (
              <span
                className="text-[11px] font-semibold border-s ps-2"
                style={{ color: seller.brandColor, borderColor: `${seller.brandColor}33` }}
              >
                {listing.promoText}
              </span>
            )}
            <ArrowUpRight
              className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
              style={{ color: seller.brandColor }}
            />
          </EmbedAnchor>
        ))}
      </div>
    </div>
  );
}

function SellerOffersList({
  offers,
  selectedSellerId,
  onSelect,
}: {
  offers: Array<{ seller: Seller; listing: SellerListing }>;
  selectedSellerId: string | null;
  onSelect: (sellerId: string | null) => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="bg-[#F1F5F9] rounded-xl p-5 space-y-3">
      <div className="flex items-baseline justify-between">
        <h4 className="font-bold text-[#1E293B] text-sm">
          {t.model.availableFromTitle}
        </h4>
        <span className="text-xs text-[#64748B]">
          {offers.length} {offers.length === 1 ? t.model.seller : t.model.sellers}
        </span>
      </div>
      <div className="space-y-2">
        {offers.map(({ seller, listing }) => {
          const active = selectedSellerId === seller.id;
          return (
            <div
              key={listing.id}
              className="rounded-lg border bg-white p-3 sm:p-4 transition-colors"
              style={{
                borderColor: active ? seller.brandColor : "#E2E8F0",
                boxShadow: active
                  ? `0 0 0 1px ${seller.brandColor} inset`
                  : undefined,
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div
                  className="inline-flex items-center justify-center rounded-md bg-white p-1.5 border self-start sm:self-auto"
                  style={{ borderColor: `${seller.brandColor}33` }}
                >
                  <NextImage
                    src={seller.logoUrl}
                    alt={seller.name}
                    width={80}
                    height={24}
                    className="h-6 w-auto object-contain"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-[#1E293B]">{seller.name}</p>
                    <span
                      className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{
                        background: `${seller.brandColor}1A`,
                        color: seller.brandColor,
                      }}
                    >
                      {listing.paymentType === "installment"
                        ? t.model.installment
                        : t.model.cash}
                    </span>
                  </div>
                  {listing.promoText && (
                    <p className="text-xs text-[#64748B] mt-0.5 truncate">
                      {listing.promoText}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-end">
                    <p className="text-[11px] text-[#64748B] leading-tight">
                      {t.model.priceLabel}
                    </p>
                    <p className="text-sm font-bold text-[#1E293B] leading-tight">
                      {formatPrice(listing.price)} {t.common.kwd}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelect(active ? null : seller.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                    style={
                      active
                        ? {
                            background: "#fff",
                            color: seller.brandColor,
                            border: `1px solid ${seller.brandColor}`,
                          }
                        : {
                            background: seller.brandColor,
                            color: "#fff",
                          }
                    }
                  >
                    {active ? t.model.usingCalculator : t.model.useCalculator}
                  </button>
                  <EmbedAnchor
                    href={`/sellers/${seller.slug}/listings/${listing.trimId}`}
                    className="text-xs font-semibold underline whitespace-nowrap"
                    style={{ color: seller.brandColor }}
                  >
                    {t.model.viewSellerPage}
                  </EmbedAnchor>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {selectedSellerId && (
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="text-xs text-[#64748B] hover:text-[#1E293B] underline"
        >
          {t.model.resetCalculator}
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Branches Section (kept from original)
// ---------------------------------------------------------------------------

function BranchesSection({ modelId }: { modelId: string }) {
  const { t, ln } = useLanguage();
  const { getBranchesForModel } = useAppData();
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
            <p className="font-bold text-sm text-[#1E293B]">{ln.branch(branch.name)}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{ln.location(branch.location)}</p>
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
                {t.model.openInMaps}
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// All Trims Comparison
// ---------------------------------------------------------------------------

function AllTrimsComparison({
  trims,
  modelId,
}: {
  trims: Trim[];
  modelId: string;
}) {
  const { t, ln } = useLanguage();
  const specRows = [
    { label: t.model.rowEngine, get: (tr: Trim) => ln.engineSummary(tr.engineSummary) },
    { label: t.model.rowPower, get: (tr: Trim) => `${tr.specs.horsepower} hp` },
    { label: t.model.rowTorque, get: (tr: Trim) => `${tr.specs.torque} Nm` },
    { label: t.model.row0to100, get: (tr: Trim) => `${tr.specs.zeroToHundred}s` },
    { label: t.model.rowTransmission, get: (tr: Trim) => ln.transmission(tr.specs.transmission) },
    { label: t.model.rowDrive, get: (tr: Trim) => ln.drive(tr.specs.driveType) },
    { label: t.model.rowFuelEconomy, get: (tr: Trim) => tr.specs.fuelEconomyCombined > 0 ? `${tr.specs.fuelEconomyCombined} L/100km` : t.model.electricLabel },
  ];

  return (
    <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0" style={{ scrollbarWidth: "none" }}>
      <table className="w-full border-collapse min-w-[400px]">
        <thead>
          <tr>
            <th className="text-start text-xs font-medium text-[#64748B] p-2 w-28 md:w-32" />
            {trims.map((tr) => (
              <th key={tr.id} className="p-2 text-center min-w-[140px] md:min-w-[160px]">
                <div className="w-full rounded-lg p-3 border border-[#E2E8F0] bg-white text-start">
                  <p className="font-bold text-sm text-[#1E293B]">{tr.name}</p>
                  <p className="text-sm font-bold text-[#F59E0B] mt-0.5">
                    {tr.priceOnRequest ? t.common.priceOnRequest : `${formatPrice(tr.price)} ${t.common.kwd}`}
                  </p>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specRows.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? "bg-[#F8FAFC]" : "bg-white"}>
              <td className="px-3 py-2.5 text-xs font-medium text-[#64748B]">{row.label}</td>
              {trims.map((tr) => (
                <td key={tr.id} className="px-3 py-2.5 text-sm text-[#1E293B] text-center">{row.get(tr)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =============== MAIN PAGE COMPONENT ===============

export default function ModelDetailClient({ id }: { id: string }) {
  const { t, dir, ln } = useLanguage();
  const { getModelById, getBrandByModelId, getTrimsByModel, getBranchesForModel, loading } = useAppData();

  const model = getModelById(id);
  const brand = getBrandByModelId(id);
  const allTrims = getTrimsByModel(id);

  const searchParams = useSearchParams();
  const trimParam = searchParams.get("trim");
  const initialTrimId = (trimParam && allTrims.some((t) => t.id === trimParam)) ? trimParam : (allTrims[0]?.id || "");
  const [selectedTrimId, setSelectedTrimId] = useState(initialTrimId);
  const [selectedVariant, setSelectedVariant] = useState<TrimVariant | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [showSubNav, setShowSubNav] = useState(false);
  const isEmbedded = useIsEmbedded();

  const heroRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const handleScroll = () => setShowSubNav(el.scrollTop > 500);
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  });

  const selectedTrim = allTrims.find((t) => t.id === selectedTrimId) || allTrims[0];
  const currentPrice = selectedVariant
    ? selectedVariant.price
    : selectedTrim?.price || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!model || !brand || !selectedTrim) {
    return (
      <CompareProvider>
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-[#F8FAFC] min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-xl font-bold text-[#1E293B] mb-2">{t.model.notFoundTitle}</h1>
            <p className="text-sm text-[#64748B]">{t.model.notFoundMessage}</p>
            <EmbedAnchor
              href="/"
              className="inline-block mt-4 px-5 py-2.5 bg-[#1A56DB] text-white text-sm font-medium rounded-xl hover:bg-[#1A56DB]/90 transition-colors"
            >
              {t.model.goHome}
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
      {/* Mobile: app-shell layout locked to viewport */}
      <div className="flex flex-col h-[100dvh] overflow-hidden md:contents">

      {/* Top bar: Navbar on initial load, replaced by StickySubNav on scroll */}
      <div className="flex-none md:contents">
        <Navbar />
      </div>

      {/* Sticky Sub-nav */}
      <StickySubNav
        modelName={ln.model(model.name)}
        brandName={ln.brand(brand.name)}
        leadFormUrl={selectedTrim.leadFormUrl}
        visible={showSubNav}
      />

      <main ref={mainRef} className="flex-1 overflow-y-auto bg-[#F8FAFC] pb-6 md:pb-8" style={{ containerType: "size" }}>
        {/* ---- Breadcrumb ---- */}
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <nav className="hidden md:flex py-3 text-xs text-[#64748B] items-center gap-1.5">
            <EmbedAnchor href="/" className="hover:text-[#1A56DB] shrink-0">{t.common.home}</EmbedAnchor>
            <span>/</span>
            <EmbedAnchor href={`/brand/${brand.id}`} className="hover:text-[#1A56DB] shrink-0">{ln.brand(brand.name)}</EmbedAnchor>
            <span>/</span>
            <span className="text-[#1E293B] font-medium truncate">{ln.model(model.name)}</span>
          </nav>
          <div className="md:hidden py-3">
            <EmbedAnchor
              href={`/brand/${brand.id}`}
              className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#1A56DB] transition-colors"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${dir === "rtl" ? "rotate-180" : ""}`} />
              <span>{tFormat(t.model.backToBrandShort, { brand: ln.brand(brand.name) })}</span>
            </EmbedAnchor>
          </div>
        </div>

        {/* ---- Hero ---- */}
        <div ref={heroRef} className="relative w-full">
          <HeroVideo heroMedia={model.heroMedia ?? brand.heroMedia} />
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`absolute top-3 end-3 z-10 w-10 h-10 flex items-center justify-center rounded-full shadow transition-colors ${
              bookmarked
                ? "bg-[#1A56DB] text-white"
                : "bg-white/80 text-[#64748B] hover:text-[#1A56DB]"
            }`}
            aria-label={bookmarked ? t.model.removeBookmark : t.model.addBookmark}
          >
            <Bookmark className="w-5 h-5" fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        {/* ---- Trim Tabs (Porsche-style) ---- */}
        {allTrims.length > 1 && (
          <div className="bg-white">
            <div className="max-w-6xl mx-auto">
              <TrimTabs
                trims={allTrims}
                selectedTrimId={selectedTrimId}
                onSelect={(id) => { setSelectedTrimId(id); setSelectedVariant(null); }}
              />
            </div>
          </div>
        )}

        {/* ---- Model Name + Badge + CTAs (centered, Porsche-style) ---- */}
        <div className="bg-white pb-8 pt-8 md:pt-10 text-center">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTrimId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="text-3xl md:text-5xl font-bold text-[#1E293B] tracking-tight">
                  {ln.brand(brand.name)} {ln.model(model.name)}
                </h1>
                <div className="flex items-center justify-center gap-3 mt-3">
                  <span className="px-3 py-1 text-xs rounded-md border border-[#E2E8F0] text-[#64748B] font-medium">
                    {ln.fuel(selectedTrim.fuelType)}
                  </span>
                  {(model.isNew || model.isUpdated) && (
                    <span className="px-3 py-1 text-xs rounded-md bg-[#1A56DB] text-white font-medium">
                      {model.isNew ? t.common.new : t.common.updated}
                    </span>
                  )}
                </div>

                {/* Price */}
                <motion.p
                  key={currentPrice}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg md:text-xl font-bold text-[#F59E0B] mt-4"
                >
                  {t.model.startingFrom} {formatPrice(currentPrice)} {t.common.kwd}
                </motion.p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                  {selectedTrim.leadFormUrl && (
                    <a
                      href={selectedTrim.leadFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-8 py-3 bg-[#1E293B] text-white text-sm font-bold rounded-lg hover:bg-[#1E293B]/90 transition-colors text-center"
                    >
                      {t.model.imInterested}
                    </a>
                  )}
                  <button
                    onClick={() => document.getElementById("section-branches")?.scrollIntoView({ behavior: "smooth" })}
                    className="w-full sm:w-auto px-8 py-3 border border-[#E2E8F0] text-[#1E293B] text-sm font-medium rounded-lg hover:border-[#1E293B] transition-colors"
                  >
                    {t.model.contactDealership}
                  </button>
                  {selectedTrim.websiteUrl && (
                    <a
                      href={selectedTrim.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-8 py-3 border border-[#E2E8F0] text-[#1E293B] text-sm font-medium rounded-lg hover:border-[#1E293B] transition-colors"
                    >
                      {t.model.visitWebsite}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Sellers for this trim (compact chip row) */}
                <HeroSellerChips trimId={selectedTrim.id} />

                {/* Variant selector */}
                {selectedTrim.variants.length > 0 && (
                  <div className="max-w-lg mx-auto mt-6">
                    <VariantSelector
                      trim={selectedTrim}
                      selectedVariant={selectedVariant}
                      onVariantSelect={setSelectedVariant}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ---- Hero Specs (Porsche-style massive numbers) ---- */}
        <FadeSection className="bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTrimId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSpecs trim={selectedTrim} bodyType={model.bodyType} imageUrl={model.imageUrl} />
            </motion.div>
          </AnimatePresence>
        </FadeSection>

        {/* ---- Scroll Cards (full-screen stacking) ---- */}
        <ScrollCardsSection model={model} trim={selectedTrim} bodyType={model.bodyType} imageUrl={model.imageUrl} images={model.images} />

        {/* ---- Feature Highlights Carousel (Porsche-style dark cards) ---- */}
        <FadeSection id="section-highlights" className="bg-white">
          <FeatureHighlights model={model} trim={selectedTrim} />
        </FadeSection>

        {/* ---- Driving Experience (Porsche-inspired) ---- */}
        <FadeSection>
          <DrivingExperienceSection model={model} trim={selectedTrim} />
        </FadeSection>

        {/* ---- Compare Trims ---- */}
        {allTrims.length > 1 && (
          <FadeSection className="bg-white">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
              <p className="text-xs text-[#1A56DB] font-bold uppercase tracking-wider mb-1 text-center">{t.model.compare}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-8 text-center">
                {t.model.chooseYourTrim}
              </h2>
              <AllTrimsComparison trims={allTrims} modelId={model.id} />
              <div className="text-center mt-6">
                <EmbedAnchor
                  href={`/model/${model.id}/trims`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1A56DB] hover:underline"
                >
                  {t.model.viewAllTrimsInDetail}
                  <ArrowUpRight className="w-4 h-4" />
                </EmbedAnchor>
              </div>
            </div>
          </FadeSection>
        )}

        {/* ---- Full Specifications ---- */}
        <FadeSection id="section-specs" className="bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12">
              <div>
                <p className="text-xs text-[#1A56DB] font-bold uppercase tracking-wider mb-1">{t.model.technicalDetails}</p>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-2">
                  {t.model.specificationsTitle}
                </h2>
                <p className="text-sm text-[#64748B] mb-6">
                  {tFormat(t.model.fullTechSpecsFor, { trim: ln.trim(selectedTrim.name) })}
                </p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTrimId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <FullSpecs trim={selectedTrim} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right: equipment */}
              <div className="mt-10 lg:mt-0">
                <p className="text-xs text-[#1A56DB] font-bold uppercase tracking-wider mb-1">{t.model.features}</p>
                <h3 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-6">
                  {t.model.equipmentTitle}
                </h3>
                <EquipmentSection
                  equipment={selectedTrim.equipment}
                  baseEquipment={baseEquipment}
                />
              </div>
            </div>
          </div>
        </FadeSection>

        {/* ---- Gallery ---- */}
        <FadeSection id="section-gallery" className="bg-white">
          <GallerySection key={id} />
        </FadeSection>

        {/* ---- Pricing & Branches (side by side on desktop) ---- */}
        <FadeSection id="section-pricing" className="bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12">
              {/* Pricing */}
              <div>
                <p className="text-xs text-[#1A56DB] font-bold uppercase tracking-wider mb-1">{t.model.investment}</p>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-6">
                  {t.model.pricingTitle}
                </h2>
                <PricingBreakdown trim={selectedTrim} selectedVariant={selectedVariant} />
              </div>

              {/* Branches */}
              <div className="mt-10 lg:mt-0" id="section-branches">
                <p className="text-xs text-[#1A56DB] font-bold uppercase tracking-wider mb-1">{t.model.visitUs}</p>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-6 scroll-mt-24">
                  {t.model.authorizedBranches}
                </h2>
                <BranchesSection modelId={model.id} />
              </div>
            </div>
          </div>
        </FadeSection>

        {/* ---- Bottom CTA ---- */}
        <FadeSection className="bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-2">
              {tFormat(t.model.readyToDrive, { model: model.name })}
            </h2>
            <p className="text-sm text-[#64748B] mb-6 max-w-md mx-auto">
              {t.model.bottomCtaSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {selectedTrim.leadFormUrl && (
                <a
                  href={selectedTrim.leadFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3 bg-[#1E293B] text-white text-sm font-bold rounded-lg hover:bg-[#1E293B]/90 transition-colors text-center"
                >
                  {t.model.imInterested}
                </a>
              )}
              <EmbedAnchor
                href={`/brand/${brand.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-8 py-3 border border-[#E2E8F0] text-[#1E293B] text-sm font-medium rounded-lg hover:border-[#1E293B] transition-colors"
              >
                {tFormat(t.model.exploreAllBrandModels, { brand: ln.brand(brand.name) })}
              </EmbedAnchor>
              {selectedTrim.websiteUrl && (
                <a
                  href={selectedTrim.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-8 py-3 border border-[#E2E8F0] text-[#1E293B] text-sm font-medium rounded-lg hover:border-[#1E293B] transition-colors"
                >
                  {t.model.visitWebsite}
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </FadeSection>
      </main>

      {/* ---- Bottom Bar (Mobile) ---- */}
      <div className="flex-none md:hidden bg-white border-t border-[#E2E8F0] px-4 py-2.5 flex items-center justify-between shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="min-w-0">
          <p className="text-[10px] text-[#64748B] leading-tight">{t.model.startingFrom}</p>
          <p className="text-base font-bold text-[#F59E0B] leading-tight">
            {formatPrice(currentPrice)} {t.common.kwd}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedTrim.leadFormUrl && (
            <a
              href={selectedTrim.leadFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1A56DB] text-white hover:bg-[#1A56DB]/90 transition-colors"
              aria-label={t.model.imInterested}
            >
              <Send className="w-[18px] h-[18px]" />
            </a>
          )}
          <a
            href={`tel:${getBranchesForModel(model.id)[0]?.phone || "+965 2222 1111"}`}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#10B981] text-white hover:bg-[#10B981]/80 transition-colors"
            aria-label={t.model.callDealership}
          >
            <Phone className="w-[18px] h-[18px]" />
          </a>
        </div>
      </div>

      {/* Desktop footer + mobile tab bar */}
      <div className="hidden md:block"><Footer /></div>
      <div className="flex-none md:contents"><MobileTabBar /></div>

      </div>{/* end mobile app-shell */}

    </CompareProvider>
  );
}
