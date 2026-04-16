"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import EmbedLink from "@/components/EmbedLink";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import dynamic from "next/dynamic";
import { Component as EtheralShadow } from "@/components/ui/etheral-shadow";
import { BeamsBackground } from "@/components/ui/beams-background";

const CarModel3D = dynamic(() => import("@/components/CarModel3D"), {
  ssr: false,
  loading: () => null,
});

import { CompareProvider, useCompare } from "@/context/CompareContext";
import Navbar from "@/components/Navbar";
import MobileTabBar from "@/components/MobileTabBar";
import Footer from "@/components/Footer";
import ModelCard from "@/components/ModelCard";
import PlaceholderImage from "@/components/PlaceholderImage";
import { silhouetteMap } from "@/components/PlaceholderImage";
import { BodyTypeIcon } from "@/components/BodyTypeIcon";

import { brands, models, lifestyleCollections } from "@/data/mock-data";
import { getNewModels, getBrandById, getModelsByBodyType, getModelsByBrand } from "@/data/helpers";

// ---------- Animation Helpers ----------

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ---------- Section Components ----------

function SectionTitle({
  title,
  subtitle,
  href,
  linkLabel,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B]">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-[#64748B] dim-subtitle">{subtitle}</p>
        )}
      </div>
      {href && (
        <EmbedLink
          href={href}
          className="shrink-0 flex items-center gap-1 text-sm font-medium text-[#1A56DB] hover:underline dim-link"
        >
          {linkLabel || "View All"} <ArrowRight className="w-4 h-4" />
        </EmbedLink>
      )}
    </div>
  );
}

// ---------- Hero ----------

function HeroSection() {
  return (
    <BeamsBackground className="h-[100svh] min-h-0" intensity="medium">
      {/* 3D Model -- positioned below the text area */}
      <div className="absolute top-[38%] md:top-[28%] bottom-[24%] md:bottom-0 left-[8%] right-[8%] md:left-0 md:right-0 z-[5]">
        <CarModel3D className="w-full h-full" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col h-[100svh] pointer-events-none">
        {/* Top text with scrim so it never collides with the model */}
        <div className="pt-24 md:pt-28 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
          >
            <span className="block text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-white/90">
              Find Your Perfect
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: "easeOut" }}
          >
            <span className="block text-6xl md:text-7xl lg:text-[8rem] lg:leading-[0.9] font-bold tracking-tight text-[#60A5FA]">
              New Car
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7, ease: "easeOut" }}
            className="mt-5 md:mt-6 text-sm md:text-base font-light tracking-[0.15em] uppercase text-white/60 max-w-lg mx-auto"
          >
            Browse, compare &amp; configure across every brand in Kuwait
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7, ease: "easeOut" }}
            className="mt-6 pointer-events-auto md:hidden"
          >
            <EmbedLink
              href="/browse"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A56DB] text-white text-sm font-medium rounded-xl hover:bg-[#1544B0] transition-colors"
            >
              Browse All Cars <ArrowRight className="w-4 h-4" />
            </EmbedLink>
          </motion.div>
        </div>

        {/* Spacer pushes stats to bottom */}
        <div className="flex-1" />

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-3xl mx-auto px-4 pb-8 md:pb-10"
        >
          <div className="flex flex-col items-center gap-3 md:flex-row md:justify-center md:gap-12 py-4 border-t border-white/10">
            {[
              { value: "45+", label: "Brands" },
              { value: "300+", label: "Models" },
              { value: "Daily", label: "Updated" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 md:gap-3">
                <span className="text-xl md:text-2xl font-bold text-white">
                  {stat.value}
                </span>
                <span className="text-xs md:text-sm text-white/40 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </BeamsBackground>
  );
}

/* ---------- Old Hero (revert by swapping back) ----------
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0F1B2D]">
      <div className="absolute inset-0">
        <EtheralShadow
          color="rgba(26, 86, 219, 0.6)"
          animation={{ scale: 80, speed: 90 }}
          noise={{ opacity: 0.6, scale: 0.5 }}
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Find Your Perfect{" "}<span className="text-[#60A5FA]">New Car</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }} className="mt-4 text-lg md:text-xl text-white/70 max-w-lg">
              Browse, compare, and configure across every brand in Kuwait
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }} className="mt-8 flex flex-wrap gap-4">
              <EmbedLink href="/browse" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A56DB] text-white font-medium rounded-xl hover:bg-[#1544B0] transition-colors">Browse All Cars<ArrowRight className="w-4 h-4" /></EmbedLink>
              <EmbedLink href="/compare" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-medium rounded-xl hover:border-white/60 transition-colors">Compare Cars</EmbedLink>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-12 flex flex-wrap gap-6 md:gap-10">
              {[{ value: "45+", label: "Brands" },{ value: "300+", label: "Models" },{ value: "Daily", label: "Updated" }].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3"><span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span><span className="text-sm text-white/50 uppercase tracking-wider">{stat.label}</span></div>
              ))}
            </motion.div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="rounded-xl overflow-hidden mb-3"><PlaceholderImage aspectRatio="16/10" label="Featured Model" bodyType="SUV" imageUrl="/images/cars/toyota-lc.jpg" /></div>
              <p className="text-xs text-white/50 uppercase tracking-wider">New Arrival</p>
              <p className="text-lg font-bold text-white mt-0.5">Toyota Land Cruiser</p>
              <p className="text-sm text-[#F59E0B] font-bold mt-1">Starting from 22,000 KWD</p>
              <EmbedLink href="/model/toyota-lc" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors">View Details <ArrowRight className="w-3.5 h-3.5" /></EmbedLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
---------- End Old Hero ---------- */

// ---------- Featured Brands ----------

const brandGradients: Record<string, string> = {
  mercedes:
    "radial-gradient(ellipse at 30% 20%, #2d3748 0%, #1a202c 50%, #0d1117 100%)",
  bmw: "radial-gradient(ellipse at 30% 20%, #1e3a5f 0%, #142850 50%, #0a1628 100%)",
  toyota:
    "radial-gradient(ellipse at 30% 20%, #7f1d1d 0%, #581c1c 50%, #2d0e0e 100%)",
  porsche:
    "radial-gradient(ellipse at 30% 20%, #6b2020 0%, #4a1515 50%, #2a0d0d 100%)",
};

function FeaturedBrands() {
  const featuredBrands = useMemo(() => brands.filter((b) => b.featured), []);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mobileActiveIdx, setMobileActiveIdx] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileCarouselViewRef = useRef<HTMLDivElement>(null);
  const cardsEntranceRef = useRef<HTMLDivElement>(null);
  const cardsVisible = useInView(cardsEntranceRef, { once: true, margin: "-60px" });

  /* -- Dim page on card hover (desktop only) -- */
  const [isCardsHovered, setIsCardsHovered] = useState(false);
  const hasReachedSection = useRef(false);
  useEffect(() => {
    if (cardsVisible) hasReachedSection.current = true;

    const root = document.getElementById("page-root");
    if (!root) return;

    const hasHover = window.matchMedia("(hover: hover)").matches;

    if (hasHover && hasReachedSection.current) {
      root.style.transition =
        "background-color 0.6s cubic-bezier(0, 0, 0.2, 1)";
      if (isCardsHovered) {
        root.style.backgroundColor = "#0F1B2D";
        root.classList.remove("page-light");
      } else {
        root.style.backgroundColor = "#F8FAFC";
        root.classList.add("page-light");
      }
    } else {
      root.style.backgroundColor = "#F8FAFC";
      root.classList.add("page-light");
    }

    return () => {
      root.style.backgroundColor = "";
      root.classList.remove("page-light");
    };
  }, [isCardsHovered, cardsVisible]);

  if (featuredBrands.length === 0) return null;

  const getRow = (idx: number) => Math.floor(idx / 2);

  const getCardWidth = (idx: number): string => {
    if (hoveredIdx === null) return "calc(50% - 12px)";
    if (getRow(idx) !== getRow(hoveredIdx)) return "calc(50% - 12px)";
    return idx === hoveredIdx ? "calc(55% - 12px)" : "calc(45% - 12px)";
  };

  const scrollRaf = useRef<number>(0);
  const handleMobileScroll = () => {
    if (scrollRaf.current) return;
    scrollRaf.current = requestAnimationFrame(() => {
      scrollRaf.current = 0;
      const el = mobileScrollRef.current;
      if (!el) return;
      const card = el.firstElementChild as HTMLElement | null;
      if (!card) return;
      const cardW = card.offsetWidth;
      const gap = 16;
      const centerOffset = (el.offsetWidth - cardW) / 2;
      const idx = Math.round((el.scrollLeft + centerOffset) / (cardW + gap));
      setMobileActiveIdx(
        Math.max(0, Math.min(idx, featuredBrands.length - 1))
      );
    });
  };

  const scrollToCard = (idx: number) => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    const cardW = card.offsetWidth;
    const gap = 16;
    const centerOffset = (el.offsetWidth - cardW) / 2;
    el.scrollTo({
      left: idx * (cardW + gap) - centerOffset,
      behavior: "smooth",
    });
  };

  /* ---------- Brand logo shared between desktop & mobile ---------- */
  const BrandLogo = ({ brandId, name, logoUrl, size = 44 }: { brandId: string; name: string; logoUrl?: string; size?: number }) => {
    const [imgError, setImgError] = useState(false);
    const hasLogo = logoUrl && !imgError;
    return (
      <div
        className="rounded-full flex items-center justify-center shrink-0 border border-white/20 shadow-lg overflow-hidden"
        style={{
          width: size,
          height: size,
          backgroundColor: hasLogo ? "#FFFFFF" : (brandColors[brandId] || "#64748B"),
        }}
      >
        {hasLogo ? (
          <img
            src={logoUrl}
            alt={`${name} logo`}
            className="w-[70%] h-[70%] object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <span
            className="text-white font-bold"
            style={{ fontSize: size * 0.28 }}
          >
            {name.substring(0, 2).toUpperCase()}
          </span>
        )}
      </div>
    );
  };

  return (
    <section
      className="py-10 md:py-16 min-h-dvh md:min-h-0 flex flex-col md:block overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex-1 flex flex-col md:block">
        <h2
          className="text-3xl md:text-[2.75rem] font-bold leading-tight text-[#1E293B] mb-6 md:mb-12"
        >
          Featured Brands
        </h2>

        {/* ---- Desktop: 2-col flex with hover expand/shrink ---- */}
        <div
          ref={cardsEntranceRef}
          className="hidden md:flex flex-wrap gap-6 transition-all duration-[800ms] ease-out"
          style={{
            opacity: cardsVisible ? 1 : 0,
            transform: cardsVisible ? "translateY(0)" : "translateY(32px)",
          }}
          onMouseEnter={() => setIsCardsHovered(true)}
          onMouseLeave={() => setIsCardsHovered(false)}
        >
          {featuredBrands.map((brand, idx) => {
            const topModel = getModelsByBrand(brand.id)[0];
            const isHovered = hoveredIdx === idx;
            const SilhouetteIcon =
              silhouetteMap[topModel?.bodyType || "Sedan"] ||
              silhouetteMap["Sedan"];

            return (
              <EmbedLink
                key={brand.id}
                href={`/brand/${brand.id}`}
                className="group relative overflow-hidden rounded-2xl block"
                style={{
                  width: getCardWidth(idx),
                  height: "clamp(380px, 40vw, 580px)",
                  transition: "width 0.6s cubic-bezier(0, 0, 0.2, 1)",
                  background:
                    brandGradients[brand.id] || brandGradients.mercedes,
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Car image */}
                <div
                  className="absolute inset-0 transition-transform duration-[800ms] ease-out"
                  style={{
                    transform: isHovered ? "scale(1.08)" : "scale(1)",
                  }}
                >
                  {topModel?.imageUrl ? (
                    <img
                      src={topModel.imageUrl}
                      alt={`${brand.name} ${topModel.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      viewBox="0 0 120 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[70%] h-auto"
                      style={{
                        opacity: 0.07,
                        filter: "brightness(0) invert(1)",
                      }}
                    >
                      <SilhouetteIcon />
                    </svg>
                  )}
                </div>

                {/* Top gradient */}
                <div className="absolute top-0 inset-x-0 h-[30%] bg-gradient-to-b from-black/60 via-black/25 to-transparent z-[5]" />

                {/* Bottom gradient */}
                <div className="absolute bottom-0 inset-x-0 h-[40%] bg-gradient-to-t from-black/70 via-black/35 to-transparent z-[5]" />

                {/* Brand logo + name */}
                <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
                  <BrandLogo brandId={brand.id} name={brand.name} logoUrl={brand.logoUrl} size={48} />
                  <h3 className="text-[2rem] lg:text-[2.5rem] font-bold text-white italic leading-none">
                    {brand.name}
                  </h3>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 inset-x-0 p-6 z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-medium text-white/90 bg-white/[0.12] backdrop-blur-sm px-2.5 py-1 rounded-md">
                      {brand.modelCount} models
                    </span>
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <p className="text-sm text-white/50 line-clamp-1">
                      {brand.tagline || `Explore the ${brand.name} lineup`}
                    </p>

                    <span className="shrink-0 flex items-center gap-1.5 text-sm font-medium text-white">
                      <span
                        className="overflow-hidden whitespace-nowrap transition-all duration-500"
                        style={{
                          maxWidth: isHovered ? "80px" : "0px",
                          opacity: isHovered ? 1 : 0,
                        }}
                      >
                        Explore
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </EmbedLink>
            );
          })}
        </div>

        {/* ---- Mobile: Full-screen swipeable carousel ---- */}
        <div ref={mobileCarouselViewRef} className="md:hidden flex-1 flex flex-col min-h-0">
          <div
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="flex-1 flex gap-4 overflow-x-auto snap-x snap-mandatory items-stretch"
            style={{ scrollbarWidth: "none" }}
          >
            {featuredBrands.map((brand) => {
              const topModel = getModelsByBrand(brand.id)[0];
              const SilhouetteIcon =
                silhouetteMap[topModel?.bodyType || "Sedan"] ||
                silhouetteMap["Sedan"];

              return (
                <EmbedLink
                  key={brand.id}
                  href={`/brand/${brand.id}`}
                  className="shrink-0 snap-center relative overflow-hidden rounded-2xl block self-stretch [scroll-snap-stop:always]"
                  style={{
                    width: "100%",
                    background:
                      brandGradients[brand.id] || brandGradients.mercedes,
                  }}
                >
                  {/* Car image */}
                  <div className="absolute inset-0">
                    {topModel?.imageUrl ? (
                      <img
                        src={topModel.imageUrl}
                        alt={`${brand.name} ${topModel.name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          viewBox="0 0 120 60"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4/5 h-auto"
                          style={{
                            opacity: 0.06,
                            filter: "brightness(0) invert(1)",
                          }}
                        >
                          <SilhouetteIcon />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Top gradient */}
                  <div className="absolute top-0 inset-x-0 h-[25%] bg-gradient-to-b from-black/50 to-transparent z-[5]" />

                  {/* Bottom gradient */}
                  <div className="absolute bottom-0 inset-x-0 h-[50%] bg-gradient-to-t from-black/80 via-black/40 to-transparent z-[5]" />

                  {/* Brand logo + name */}
                  <div className="absolute top-5 left-5 z-10 flex items-center gap-3">
                    <BrandLogo brandId={brand.id} name={brand.name} logoUrl={brand.logoUrl} size={40} />
                    <h3 className="text-3xl font-bold text-white italic leading-none">
                      {brand.name}
                    </h3>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 inset-x-0 p-5 z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[11px] font-medium text-white/90 bg-white/[0.12] backdrop-blur-sm px-2.5 py-1 rounded-md">
                        {brand.modelCount} models
                      </span>
                    </div>

                    {brand.tagline && (
                      <p className="text-sm text-white/50 mb-4">
                        {brand.tagline}
                      </p>
                    )}

                    <div className="flex items-center justify-center gap-2 bg-white/[0.08] backdrop-blur-sm rounded-xl py-3.5 text-sm font-medium text-white border border-white/[0.08]">
                      Explore <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </EmbedLink>
              );
            })}
          </div>

          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-2 py-4">
            {featuredBrands.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToCard(idx)}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: idx === mobileActiveIdx ? "24px" : "8px",
                  backgroundColor:
                    idx === mobileActiveIdx
                      ? "#0F1B2D"
                      : "#94A3B8",
                }}
                aria-label={`Go to brand ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Browse by Brand ----------

import { brandColors } from "@/data/helpers";

function BrowseByBrandLogo({ brand }: { brand: typeof brands[0] }) {
  const [imgError, setImgError] = useState(false);
  const hasLogo = brand.logoUrl && !imgError;
  return (
    <div
      className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform"
      style={{ backgroundColor: hasLogo ? "#FFFFFF" : (brandColors[brand.id] || "#64748B") }}
    >
      {hasLogo ? (
        <img
          src={brand.logoUrl}
          alt={`${brand.name} logo`}
          className="w-[70%] h-[70%] object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-white font-bold text-lg md:text-xl">
          {brand.name.substring(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function BrowseByBrand() {
  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <SectionTitle
        title="Browse by Brand"
        subtitle="Explore cars from leading manufacturers"
        href="/browse?view=brands"
        linkLabel="View All Brands"
      />
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
        {brands.map((brand) => (
          <EmbedLink
            key={brand.id}
            href={`/brand/${brand.id}`}
            className="group flex flex-col items-center gap-2 p-4 md:p-5 bg-white rounded-lg border border-[#E2E8F0] hover:border-[#1A56DB] hover:shadow-lg transition-all"
          >
            <BrowseByBrandLogo brand={brand} />
            <span className="text-sm font-bold text-[#1E293B] text-center leading-tight">
              {brand.name}
            </span>
            <span className="text-[11px] font-medium text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
              {brand.modelCount} models
            </span>
          </EmbedLink>
        ))}
      </div>
    </AnimatedSection>
  );
}

// ---------- Browse by Body Type ----------

const bodyTypes = ["Sedan", "SUV", "Hatchback", "Coupe", "Pickup", "Van", "Convertible"];

function BrowseByBodyType() {
  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <SectionTitle
        title="Browse by Body Type"
        subtitle="Find the shape that fits your style"
      />
      {/* Clip the container on the right so the last card is cropped, hinting scroll */}
      <div className="overflow-hidden -mr-4 md:-mr-6">
        <div className="flex gap-3 overflow-x-auto pb-2 pr-4 md:pr-6 styled-scrollbar">
          {bodyTypes.map((type) => {
            const count = getModelsByBodyType(type).length;
            return (
              <EmbedLink
                key={type}
                href={`/browse?body=${type.toLowerCase()}`}
                className="group shrink-0 flex flex-col items-center gap-2 p-4 md:p-5 w-28 md:w-32 bg-white rounded-lg border border-[#E2E8F0] hover:border-[#1A56DB] hover:shadow-lg transition-all"
              >
                <BodyTypeIcon
                  type={type}
                  className="w-16 h-10 text-[#64748B] group-hover:text-[#1A56DB] transition-colors"
                />
                <span className="text-sm font-bold text-[#1E293B]">{type}</span>
                <span className="text-[11px] text-[#64748B]">
                  {count} model{count !== 1 ? "s" : ""}
                </span>
              </EmbedLink>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ---------- Popular Models ----------

function PopularModels() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCompare();
  const popular = useMemo(() => models.slice(0, 8), []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <SectionTitle
        title="Popular Models"
        subtitle="Most searched cars in Kuwait"
        href="/browse"
        linkLabel="View All"
      />

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white rounded-full shadow-lg border border-[#E2E8F0] text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white rounded-full shadow-lg border border-[#E2E8F0] text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pt-1 pb-4 styled-scrollbar snap-x snap-mandatory"
        >
          {popular.map((model) => {
            const brand = getBrandById(model.brandId);
            return (
              <div
                key={model.id}
                className="shrink-0 w-[280px] md:w-[300px] snap-start"
              >
                <ModelCard
                  model={{
                    id: model.id,
                    name: model.name,
                    brandId: model.brandId,
                    brandName: brand?.name || "",
                    bodyType: model.bodyType,
                    startingPrice: model.startingPrice,
                    engineRange: model.specsSummary.engineRange,
                    hpRange: model.specsSummary.hpRange,
                    fuelType: model.specsSummary.fuelTypes.join(", "),
                    trimCount: model.trimCount,
                    isNew: model.isNew,
                    isUpdated: model.isUpdated,
                    imageUrl: model.imageUrl,
                  }}
                  onCompare={(id) =>
                    addItem({
                      id,
                      name: model.name,
                      brandName: brand?.name || "",
                      price: model.startingPrice,
                      imageUrl: model.imageUrl,
                    })
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ---------- Browse by Budget ----------

function BrowseByBudget() {
  const MIN_PRICE = 3000;
  const MAX_PRICE = 80000;
  const [minPrice, setMinPrice] = useState(5000);
  const [maxPrice, setMaxPrice] = useState(30000);
  const [isMonthly, setIsMonthly] = useState(false);

  const displayMin = isMonthly ? Math.round(minPrice / 60) : minPrice;
  const displayMax = isMonthly ? Math.round(maxPrice / 60) : maxPrice;
  const unit = isMonthly ? "KWD/mo" : "KWD";

  return (
    <AnimatedSection className="bg-[#0F1B2D]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
          Browse by Budget
        </h2>
        <p className="text-sm text-white/50 mb-8">
          Set your price range and discover what fits
        </p>

        <div className="max-w-xl space-y-6">
          {/* Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMonthly(false)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                !isMonthly
                  ? "bg-[#1A56DB] text-white"
                  : "bg-white/10 text-white/60 hover:text-white"
              }`}
            >
              Total Price
            </button>
            <button
              onClick={() => setIsMonthly(true)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isMonthly
                  ? "bg-[#1A56DB] text-white"
                  : "bg-white/10 text-white/60 hover:text-white"
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Price display */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <span className="text-xs text-white/40 uppercase tracking-wider">From</span>
              <p className="text-xl font-bold text-[#F59E0B]">
                {displayMin.toLocaleString()} {unit}
              </p>
            </div>
            <div className="w-8 h-px bg-white/20" />
            <div className="flex-1">
              <span className="text-xs text-white/40 uppercase tracking-wider">To</span>
              <p className="text-xl font-bold text-[#F59E0B]">
                {displayMax.toLocaleString()} {unit}
              </p>
            </div>
          </div>

          {/* Dual range sliders */}
          <div className="relative h-10 flex items-center">
            {/* Track background */}
            <div className="absolute inset-x-0 h-1.5 bg-white/10 rounded-full" />
            {/* Active track */}
            <div
              className="absolute h-1.5 bg-[#1A56DB] rounded-full"
              style={{
                left: `${((minPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
                right: `${100 - ((maxPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
              }}
            />
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={500}
              value={minPrice}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val < maxPrice - 1000) setMinPrice(val);
              }}
              className="absolute inset-x-0 w-full appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#1A56DB] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#1A56DB] [&::-moz-range-thumb]:cursor-pointer"
              style={{ zIndex: minPrice > MAX_PRICE - 1000 ? 5 : 3 }}
            />
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={500}
              value={maxPrice}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > minPrice + 1000) setMaxPrice(val);
              }}
              className="absolute inset-x-0 w-full appearance-none bg-transparent pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#1A56DB] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#1A56DB] [&::-moz-range-thumb]:cursor-pointer"
              style={{ zIndex: 4 }}
            />
          </div>

          {/* Show results button */}
          <EmbedLink
            href={`/browse?minPrice=${minPrice}&maxPrice=${maxPrice}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A56DB] text-white font-medium rounded-xl hover:bg-[#1544B0] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Show Results
          </EmbedLink>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ---------- What's New ----------

function WhatsNew() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const newModels = useMemo(() => getNewModels(), []);
  const { addItem } = useCompare();

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <SectionTitle
        title="What's New"
        subtitle="Latest arrivals and recently updated models"
        href="/browse?sort=newest"
        linkLabel="See All"
      />

      <div className="relative">
        {/* Scroll buttons -- desktop only */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white rounded-full shadow-lg border border-[#E2E8F0] text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white rounded-full shadow-lg border border-[#E2E8F0] text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pt-1 pb-4 styled-scrollbar snap-x snap-mandatory"
        >
          {newModels.map((model) => {
            const brand = getBrandById(model.brandId);
            return (
              <div
                key={model.id}
                className="shrink-0 w-[280px] md:w-[300px] snap-start"
              >
                <ModelCard
                  model={{
                    id: model.id,
                    name: model.name,
                    brandId: model.brandId,
                    brandName: brand?.name || "",
                    bodyType: model.bodyType,
                    startingPrice: model.startingPrice,
                    engineRange: model.specsSummary.engineRange,
                    hpRange: model.specsSummary.hpRange,
                    fuelType: model.specsSummary.fuelTypes.join(", "),
                    trimCount: model.trimCount,
                    isNew: model.isNew,
                    isUpdated: model.isUpdated,
                    imageUrl: model.imageUrl,
                  }}
                  onCompare={(id) =>
                    addItem({
                      id,
                      name: model.name,
                      brandName: brand?.name || "",
                      price: model.startingPrice,
                      imageUrl: model.imageUrl,
                    })
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ---------- Explore by Lifestyle ----------

const lifestyleThemes: {
  bg: string;
  text: string;
  accent: string;
  label: string;
  icon: string;
}[] = [
  { bg: "#0F1B2D", text: "#FFFFFF", accent: "#60A5FA", label: "Family", icon: "shield" },
  { bg: "#7F1D1D", text: "#FFFFFF", accent: "#FCA5A5", label: "Speed", icon: "zap" },
  { bg: "#1E293B", text: "#FFFFFF", accent: "#F59E0B", label: "Luxury", icon: "crown" },
  { bg: "#064E3B", text: "#FFFFFF", accent: "#6EE7B7", label: "Value", icon: "tag" },
];

function ExploreByLifestyle() {
  return (
    <AnimatedSection className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B]">
          Explore by Lifestyle
        </h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Curated collections for every kind of driver
        </p>
      </div>

      {/* Asymmetric grid: first card spans 2 rows on desktop */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
          {lifestyleCollections.map((collection, i) => {
            const theme = lifestyleThemes[i % lifestyleThemes.length];
            const isHero = i === 0;

            return (
              <EmbedLink
                key={collection.id}
                href={`/browse?collection=${collection.id}`}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                  isHero
                    ? "md:col-span-5 md:row-span-2"
                    : "md:col-span-7"
                }`}
                style={{ backgroundColor: theme.bg }}
              >
                {/* Decorative background pattern */}
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.text} 1px, transparent 0)`,
                    backgroundSize: "24px 24px",
                  }}
                />
                {/* Gradient sweep */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, transparent 40%, ${theme.accent}15 100%)`,
                  }}
                />

                <div
                  className={`relative flex flex-col justify-between ${
                    isHero ? "p-6 md:p-8 min-h-[200px] md:min-h-full" : "p-5 md:p-6 min-h-[140px] md:min-h-[160px]"
                  }`}
                >
                  {/* Top row: label + count */}
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="inline-block text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-md"
                      style={{
                        backgroundColor: `${theme.accent}20`,
                        color: theme.accent,
                      }}
                    >
                      {theme.label}
                    </span>
                    <span
                      className={`font-bold tabular-nums ${
                        isHero ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"
                      }`}
                      style={{ color: `${theme.accent}30` }}
                    >
                      {collection.modelIds.length}
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="mt-auto">
                    <h3
                      className={`font-bold leading-tight ${
                        isHero
                          ? "text-xl md:text-2xl"
                          : "text-lg md:text-xl"
                      }`}
                      style={{ color: theme.text }}
                    >
                      {collection.title}
                    </h3>
                    <p
                      className="mt-1.5 text-sm leading-relaxed opacity-60 line-clamp-2"
                      style={{ color: theme.text }}
                    >
                      {collection.description}
                    </p>

                    <div
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all duration-300"
                      style={{ color: theme.accent }}
                    >
                      Browse Collection
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </EmbedLink>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}

// ---------- Main Page Content (needs CompareProvider above) ----------

function HomePageContent() {
  const { totalCount } = useCompare();

  return (
    <div id="page-root" className="min-h-screen flex flex-col bg-slate-950">
      <Navbar compareCount={totalCount} />

      <main className="flex-1 pb-20 md:pb-0">
        <HeroSection />
        <FeaturedBrands />
        <BrowseByBrand />
        <BrowseByBodyType />
        <PopularModels />
        <BrowseByBudget />
        <WhatsNew />
        <ExploreByLifestyle />
      </main>

      <Footer />
      <MobileTabBar activeTab="home" compareCount={totalCount} />
    </div>
  );
}

// ---------- Exported Page ----------

export default function Home() {
  return (
    <CompareProvider>
      <HomePageContent />
    </CompareProvider>
  );
}
