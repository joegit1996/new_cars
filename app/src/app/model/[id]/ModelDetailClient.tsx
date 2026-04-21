"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useInView, useScroll, useMotionValueEvent } from "framer-motion";
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
import {
  getModelById,
  getBrandByModelId,
  getTrimsByModel,
  getBranchesForModel,
} from "@/data/helpers";
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
            {trim.name}
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
  const s = trim.specs;

  const stats = [
    {
      value: String(s.zeroToHundred),
      unit: "s",
      label: "Acceleration 0 - 100 km/h",
    },
    {
      value: String(s.horsepower),
      unit: "hp",
      label: `Power (${s.engineType})`,
    },
    {
      value: String(s.topSpeed),
      unit: "km/h",
      label: "Top speed",
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
            View all technical details
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
  const s = trim.specs;

  const items = useMemo(
    () => [
      {
        tag: "Performance",
        title: `${s.horsepower} hp.`,
        description: `${s.torque} Nm of torque. 0-100 km/h in ${s.zeroToHundred} seconds. A top speed of ${s.topSpeed} km/h. Raw power, precisely delivered.`,
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
        tag: "Drivetrain",
        title: `${s.transmission}.`,
        description: `${s.engineType} ${s.displacement > 0 ? `${s.displacement}L ${s.cylinders}-cylinder` : "electric"} engine paired with ${s.driveType} drive. Engineered for response and refinement in every gear.`,
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
        tag: "Design",
        title: `${model.bodyType}.`,
        description: `${s.lengthMm}mm long, ${s.widthMm}mm wide, ${s.heightMm}mm tall. ${s.seatingCapacity} seats with ${s.trunkVolumeLiters}L of cargo space. Every proportion is intentional.`,
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
        tag: "Efficiency",
        title: s.fuelEconomyCombined > 0 ? `${s.fuelEconomyCombined} L/100km.` : "Zero emissions.",
        description: s.fuelEconomyCombined > 0
          ? `City: ${s.fuelEconomyCity} L/100km. Highway: ${s.fuelEconomyHighway} L/100km. ${s.fuelTankLiters}L fuel tank. Go further on every drop.`
          : "Pure electric power. Maximum range with zero compromise on performance.",
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
    [trim, model, bodyType, images]
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
  const sections = [
    { id: "section-highlights", label: "Highlights" },
    { id: "section-specs", label: "Specs" },
    { id: "section-gallery", label: "Gallery" },
    { id: "section-pricing", label: "Pricing" },
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
                {brandName} {modelName}
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
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </EmbedAnchor>
              <EmbedAnchor
                href="/compare"
                className="w-8 h-8 flex items-center justify-center rounded-full text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
                aria-label="Compare"
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
                  I'm Interested
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  const imgs = model.images;
  const features = useMemo(() => [
    {
      title: "Performance.",
      description: `${trim.specs.horsepower} hp and ${trim.specs.torque} Nm of torque deliver exhilarating acceleration. 0-100 km/h in just ${trim.specs.zeroToHundred} seconds with a top speed of ${trim.specs.topSpeed} km/h.`,
      image: imgs?.hero ?? model.imageUrl,
    },
    {
      title: "Drivetrain.",
      description: `${trim.specs.transmission} transmission paired with ${trim.specs.driveType} drive. The ${trim.specs.engineType} engine displaces ${trim.specs.displacement > 0 ? `${trim.specs.displacement}L with ${trim.specs.cylinders} cylinders` : "pure electric power"}.`,
      image: imgs?.detail ?? model.imageUrl,
    },
    {
      title: "Efficiency.",
      description: trim.specs.fuelEconomyCombined > 0
        ? `Combined fuel economy of ${trim.specs.fuelEconomyCombined} L/100km. City: ${trim.specs.fuelEconomyCity} L/100km, Highway: ${trim.specs.fuelEconomyHighway} L/100km. ${trim.specs.fuelTankLiters}L fuel tank.`
        : "Zero emissions with pure electric power. Efficient energy management for maximum range.",
      image: imgs?.side ?? model.imageUrl,
    },
    {
      title: "Design.",
      description: `${model.bodyType} body style with ${trim.specs.seatingCapacity} seats. ${trim.specs.lengthMm}mm length, ${trim.specs.widthMm}mm width, and ${trim.specs.wheelbaseMm}mm wheelbase provide a commanding presence.`,
      image: imgs?.front ?? model.imageUrl,
    },
    {
      title: "Comfort.",
      description: `${trim.specs.trunkVolumeLiters}L of cargo space. Curb weight of ${trim.specs.curbWeightKg}kg ensures a planted, confident ride. ${trim.specs.warranty} warranty coverage included.`,
      image: imgs?.rear ?? model.imageUrl,
    },
  ], [trim, model, imgs]);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

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
          <p className="text-xs text-[#1A56DB] font-bold uppercase tracking-wider mb-1">Highlights</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B]">
            What defines this car.
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
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
              canScrollRight
                ? "border-[#E2E8F0] text-[#1E293B] hover:border-[#1E293B]"
                : "border-[#E2E8F0] text-[#CBD5E1] cursor-default"
            }`}
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal carousel */}
      <div
        ref={scrollRef}
        className={`flex gap-4 overflow-x-auto pb-4 select-none ps-4 md:ps-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{
          scrollbarWidth: "none",
          scrollSnapType: "none",
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
            className="shrink-0 w-[85vw] md:w-[55vw] lg:w-[42vw] rounded-2xl overflow-hidden relative"
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
            className="w-2 h-2 rounded-full bg-[#CBD5E1]"
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
  const s = trim.specs;
  const features = useMemo(
    () => [
      {
        title: "Chassis & Handling",
        description: `${s.driveType} drive with a ${s.wheelbaseMm}mm wheelbase delivers a balanced, planted feel. At ${s.curbWeightKg}kg, every input translates to precise, confident response.`,
        icon: <Shield className="w-5 h-5" />,
      },
      {
        title: "Powertrain",
        description: `${s.engineType} ${s.displacement > 0 ? `${s.displacement}L ${s.cylinders}-cylinder` : "electric motor"} producing ${s.horsepower} hp and ${s.torque} Nm. Paired with ${s.transmission} transmission for seamless delivery.`,
        icon: <Zap className="w-5 h-5" />,
      },
      {
        title: "Acceleration & Speed",
        description: `0-100 km/h in ${s.zeroToHundred} seconds with a top speed of ${s.topSpeed} km/h. Responsive throttle mapping puts power exactly where you need it.`,
        icon: <Timer className="w-5 h-5" />,
      },
      {
        title: "Proportions",
        description: `${s.lengthMm}mm long, ${s.widthMm}mm wide, ${s.heightMm}mm tall. ${s.seatingCapacity} seats and ${s.trunkVolumeLiters}L of cargo. Purpose-built proportions.`,
        icon: <Ruler className="w-5 h-5" />,
      },
    ],
    [trim]
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
              The Experience
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight max-w-xl">
              Driving dynamics.
            </h2>
            <p className="text-sm md:text-base text-white/60 mt-3 max-w-lg leading-relaxed">
              Every element of the {model.name}{" "}is engineered for an exceptional driving experience &mdash; from the powertrain to the chassis, delivering confidence and control.
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
  if (trim.variants.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
      <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-2">
        {trim.name} Variants
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
            {v.name} (+{formatPrice(v.price - trim.price)} KWD)
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
  const [expanded, setExpanded] = useState(false);
  const s = trim.specs;

  const groups = [
    {
      title: "Engine & Performance",
      items: [
        { label: "Engine", value: s.engineType },
        { label: "Displacement", value: s.displacement > 0 ? `${s.displacement}L` : "N/A" },
        { label: "Cylinders", value: s.displacement > 0 ? String(s.cylinders) : "N/A" },
        { label: "Horsepower", value: `${s.horsepower} hp` },
        { label: "Torque", value: `${s.torque} Nm` },
        { label: "0-100 km/h", value: `${s.zeroToHundred}s` },
        { label: "Top Speed", value: `${s.topSpeed} km/h` },
      ],
    },
    {
      title: "Transmission & Drive",
      items: [
        { label: "Transmission", value: s.transmission },
        { label: "Drive Type", value: s.driveType },
      ],
    },
    {
      title: "Fuel Economy",
      items: [
        { label: "City", value: s.fuelEconomyCity > 0 ? `${s.fuelEconomyCity} L/100km` : "N/A" },
        { label: "Highway", value: s.fuelEconomyHighway > 0 ? `${s.fuelEconomyHighway} L/100km` : "N/A" },
        { label: "Combined", value: s.fuelEconomyCombined > 0 ? `${s.fuelEconomyCombined} L/100km` : "N/A" },
        { label: "Fuel Tank", value: s.fuelTankLiters > 0 ? `${s.fuelTankLiters} L` : "N/A" },
      ],
    },
    {
      title: "Dimensions & Weight",
      items: [
        { label: "Length", value: `${s.lengthMm} mm` },
        { label: "Width", value: `${s.widthMm} mm` },
        { label: "Height", value: `${s.heightMm} mm` },
        { label: "Wheelbase", value: `${s.wheelbaseMm} mm` },
        { label: "Trunk Volume", value: `${s.trunkVolumeLiters} L` },
        { label: "Curb Weight", value: `${s.curbWeightKg} kg` },
      ],
    },
    {
      title: "Other",
      items: [
        { label: "Seating", value: `${s.seatingCapacity} seats` },
        { label: "Warranty", value: s.warranty },
        { label: "Spec Region", value: s.specRegion },
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
          {expanded ? "Show less" : "View all specifications"}
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
              {cat}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-3 mb-3">
        <button
          onClick={() => setShowDiffOnly(!showDiffOnly)}
          className="text-xs text-[#1A56DB] hover:underline font-medium"
        >
          {showDiffOnly ? "Show all" : "Show differences from base trim"}
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

// ---------------------------------------------------------------------------
// Gallery images data (used by CircularGallery component)
// ---------------------------------------------------------------------------

const GALLERY_IMAGES = [
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

const GALLERY_FILTERS = ["All", "Exterior", "Interior"] as const;

function GallerySection() {
  const [galleryFilter, setGalleryFilter] = useState<string>("All");

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
      <p className="text-xs text-[#1A56DB] font-bold uppercase tracking-wider mb-1">Explore</p>
      <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-6">
        Gallery.
      </h2>
      <div className="flex gap-2 mb-4">
        {GALLERY_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setGalleryFilter(f)}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
              galleryFilter === f
                ? "bg-[#1A56DB] text-white border-[#1A56DB]"
                : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#1A56DB]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <CircularGallery images={GALLERY_IMAGES} filter={galleryFilter} />
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
          <span className="text-[#1E293B] font-medium">{formatPrice(regFees)} KWD</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#64748B]">Insurance (est.)</span>
          <span className="text-[#1E293B] font-medium">{formatPrice(insurance)} KWD</span>
        </div>
        <div className="border-t border-[#E2E8F0] pt-3 flex justify-between text-sm">
          <span className="text-[#1E293B] font-bold">Total Estimate</span>
          <span className="text-[#1E293B] font-bold">{formatPrice(totalEstimate)} KWD</span>
        </div>
      </div>

      {/* Monthly Calculator */}
      <div className="bg-[#F1F5F9] rounded-xl p-5 space-y-5">
        <h4 className="font-bold text-[#1E293B] text-sm">Monthly Installment Calculator</h4>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#64748B]">Down Payment</span>
            <span className="text-[#1E293B] font-medium">{downPct}% ({formatPrice(downPayment)} KWD)</span>
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

        <div className="bg-white rounded-lg p-4 text-center">
          <p className="text-xs text-[#64748B] mb-1">Estimated Monthly Installment</p>
          <p className="text-2xl font-bold text-[#1A56DB]">{formatPrice(monthly)} KWD/mo</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Branches Section (kept from original)
// ---------------------------------------------------------------------------

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
    <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0" style={{ scrollbarWidth: "none" }}>
      <table className="w-full border-collapse min-w-[400px]">
        <thead>
          <tr>
            <th className="text-start text-xs font-medium text-[#64748B] p-2 w-28 md:w-32" />
            {trims.map((t) => (
              <th key={t.id} className="p-2 text-center min-w-[140px] md:min-w-[160px]">
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
  );
}

// =============== MAIN PAGE COMPONENT ===============

export default function ModelDetailClient({ id }: { id: string }) {
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
  const { scrollY } = useScroll({ container: mainRef });

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show sticky nav after scrolling past hero + model info area
    setShowSubNav(latest > 500);
  });

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
            <h1 className="text-xl font-bold text-[#1E293B] mb-2">Model Not Found</h1>
            <p className="text-sm text-[#64748B]">The model you are looking for does not exist.</p>
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
      {/* Mobile: app-shell layout locked to viewport */}
      <div className="flex flex-col h-[100dvh] overflow-hidden md:contents">

      {/* Top bar: Navbar on initial load, replaced by StickySubNav on scroll */}
      <div className="flex-none md:contents">
        <Navbar />
      </div>

      {/* Sticky Sub-nav */}
      <StickySubNav
        modelName={model.name}
        brandName={brand.name}
        leadFormUrl={selectedTrim.leadFormUrl}
        visible={showSubNav}
      />

      <main ref={mainRef} className="flex-1 overflow-y-auto bg-[#F8FAFC] pb-6 md:pb-8" style={{ containerType: "size" }}>
        {/* ---- Breadcrumb ---- */}
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <nav className="hidden md:flex py-3 text-xs text-[#64748B] items-center gap-1.5">
            <EmbedAnchor href="/" className="hover:text-[#1A56DB] shrink-0">Home</EmbedAnchor>
            <span>/</span>
            <EmbedAnchor href={`/brand/${brand.id}`} className="hover:text-[#1A56DB] shrink-0">{brand.name}</EmbedAnchor>
            <span>/</span>
            <span className="text-[#1E293B] font-medium truncate">{model.name}</span>
          </nav>
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

        {/* ---- Hero ---- */}
        <div ref={heroRef} className="relative w-full">
          <HeroVideo heroMedia={brand.heroMedia} />
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`absolute top-3 end-3 z-10 w-10 h-10 flex items-center justify-center rounded-full shadow transition-colors ${
              bookmarked
                ? "bg-[#1A56DB] text-white"
                : "bg-white/80 text-[#64748B] hover:text-[#1A56DB]"
            }`}
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
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
                  {brand.name} {model.name}
                </h1>
                <div className="flex items-center justify-center gap-3 mt-3">
                  <span className="px-3 py-1 text-xs rounded-md border border-[#E2E8F0] text-[#64748B] font-medium">
                    {selectedTrim.fuelType}
                  </span>
                  {(model.isNew || model.isUpdated) && (
                    <span className="px-3 py-1 text-xs rounded-md bg-[#1A56DB] text-white font-medium">
                      {model.isNew ? "New" : "Updated"}
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
                  Starting from {formatPrice(currentPrice)} KWD
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
                      I'm Interested
                    </a>
                  )}
                  <button
                    onClick={() => document.getElementById("section-branches")?.scrollIntoView({ behavior: "smooth" })}
                    className="w-full sm:w-auto px-8 py-3 border border-[#E2E8F0] text-[#1E293B] text-sm font-medium rounded-lg hover:border-[#1E293B] transition-colors"
                  >
                    Contact Dealership
                  </button>
                  {selectedTrim.websiteUrl && (
                    <a
                      href={selectedTrim.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-8 py-3 border border-[#E2E8F0] text-[#1E293B] text-sm font-medium rounded-lg hover:border-[#1E293B] transition-colors"
                    >
                      Visit Website
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

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
              <p className="text-xs text-[#1A56DB] font-bold uppercase tracking-wider mb-1 text-center">Compare</p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-8 text-center">
                Choose your trim.
              </h2>
              <AllTrimsComparison trims={allTrims} modelId={model.id} />
              <div className="text-center mt-6">
                <EmbedAnchor
                  href={`/model/${model.id}/trims`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1A56DB] hover:underline"
                >
                  View all trims in detail
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
                <p className="text-xs text-[#1A56DB] font-bold uppercase tracking-wider mb-1">Technical Details</p>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-2">
                  Specifications.
                </h2>
                <p className="text-sm text-[#64748B] mb-6">
                  Full technical specifications for the {selectedTrim.name} trim.
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
                <p className="text-xs text-[#1A56DB] font-bold uppercase tracking-wider mb-1">Features</p>
                <h3 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-6">
                  Equipment.
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
                <p className="text-xs text-[#1A56DB] font-bold uppercase tracking-wider mb-1">Investment</p>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-6">
                  Pricing.
                </h2>
                <PricingBreakdown trim={selectedTrim} selectedVariant={selectedVariant} />
              </div>

              {/* Branches */}
              <div className="mt-10 lg:mt-0" id="section-branches">
                <p className="text-xs text-[#1A56DB] font-bold uppercase tracking-wider mb-1">Visit Us</p>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-6 scroll-mt-24">
                  Authorized Branches.
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
              Ready to drive the {model.name}?
            </h2>
            <p className="text-sm text-[#64748B] mb-6 max-w-md mx-auto">
              Get in touch with an authorized dealer to schedule a test drive or get a personalized quote.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {selectedTrim.leadFormUrl && (
                <a
                  href={selectedTrim.leadFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3 bg-[#1E293B] text-white text-sm font-bold rounded-lg hover:bg-[#1E293B]/90 transition-colors text-center"
                >
                  I'm Interested
                </a>
              )}
              <EmbedAnchor
                href={`/brand/${brand.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-8 py-3 border border-[#E2E8F0] text-[#1E293B] text-sm font-medium rounded-lg hover:border-[#1E293B] transition-colors"
              >
                Explore All {brand.name} Models
              </EmbedAnchor>
              {selectedTrim.websiteUrl && (
                <a
                  href={selectedTrim.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-8 py-3 border border-[#E2E8F0] text-[#1E293B] text-sm font-medium rounded-lg hover:border-[#1E293B] transition-colors"
                >
                  Visit Website
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
          <p className="text-[10px] text-[#64748B] leading-tight">Starting from</p>
          <p className="text-base font-bold text-[#F59E0B] leading-tight">
            {formatPrice(currentPrice)} KWD
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedTrim.leadFormUrl && (
            <a
              href={selectedTrim.leadFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1A56DB] text-white hover:bg-[#1A56DB]/90 transition-colors"
              aria-label="I'm interested"
            >
              <Send className="w-[18px] h-[18px]" />
            </a>
          )}
          <a
            href={`tel:${getBranchesForModel(model.id)[0]?.phone || "+965 2222 1111"}`}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#10B981] text-white hover:bg-[#10B981]/80 transition-colors"
            aria-label="Call dealership"
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
