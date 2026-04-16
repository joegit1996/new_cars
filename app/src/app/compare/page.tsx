"use client";

import { useState, useMemo, useCallback, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import EmbedLink from "../../components/EmbedLink";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowLeftRight,
  Plus,
  Share2,
  Check,
  Minus,
  ExternalLink,
  Scale,
  Search,
  Home,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MobileTabBar from "../../components/MobileTabBar";
import PlaceholderImage from "../../components/PlaceholderImage";
import LeadFormModal from "../../components/LeadFormModal";
import { CompareProvider, useCompare } from "../../context/CompareContext";
import type { CompareMode } from "../../context/CompareContext";
import {
  getTrimById,
  getTrimsByModel,
  getBrandByModelId,
  getModelById,
  getBrandById,
  getModelAggregateSpecs,
  searchTrims,
  searchModelsDeduped,
} from "../../data/helpers";
import { useIsEmbedded } from "../../hooks/useIsEmbedded";
import type { Trim, Model, ModelAggregateSpecs, SearchEntry, BodyType } from "../../data/types";

/* ------------------------------------------------------------------ */
/* 10 key equipment features to compare                               */
/* ------------------------------------------------------------------ */
const KEY_FEATURES = [
  "Adaptive Cruise Control",
  "Lane Departure Warning",
  "Blind Spot Monitor",
  "360-Degree Camera",
  "Panoramic Sunroof",
  "Leather Seats",
  "Apple CarPlay",
  "Android Auto",
  "Wireless Charging",
  "LED Headlights",
];

/* ------------------------------------------------------------------ */
/* Spec row helpers                                                    */
/* ------------------------------------------------------------------ */
interface SpecRow {
  label: string;
  getValue: (t: Trim) => string;
  getRaw: (t: Trim) => string | number;
}

function sr(
  label: string,
  getValue: (t: Trim) => string,
  getRaw?: (t: Trim) => string | number,
): SpecRow {
  return { label, getValue, getRaw: getRaw ?? getValue };
}

const overviewRows: SpecRow[] = [
  sr("Body Type", (t) => getModelById(t.modelId)?.bodyType ?? "-"),
  sr("Fuel Type", (t) => t.fuelType),
  sr("Year", (t) => String(getModelById(t.modelId)?.year ?? "-")),
  sr("Spec Region", (t) => t.specs.specRegion),
];

const engineRows: SpecRow[] = [
  sr("Engine Type", (t) => t.specs.engineType),
  sr("Displacement", (t) => (t.specs.displacement > 0 ? `${t.specs.displacement}L` : "N/A"), (t) => t.specs.displacement),
  sr("Cylinders", (t) => (t.specs.cylinders > 0 ? String(t.specs.cylinders) : "N/A"), (t) => t.specs.cylinders),
  sr("Horsepower", (t) => `${t.specs.horsepower} hp`, (t) => t.specs.horsepower),
  sr("Torque", (t) => `${t.specs.torque} Nm`, (t) => t.specs.torque),
  sr("0-100 km/h", (t) => `${t.specs.zeroToHundred}s`, (t) => t.specs.zeroToHundred),
  sr("Top Speed", (t) => `${t.specs.topSpeed} km/h`, (t) => t.specs.topSpeed),
  sr("Transmission", (t) => t.specs.transmission),
  sr("Drive Type", (t) => t.specs.driveType),
];

const dimensionRows: SpecRow[] = [
  sr("Length", (t) => `${t.specs.lengthMm} mm`, (t) => t.specs.lengthMm),
  sr("Width", (t) => `${t.specs.widthMm} mm`, (t) => t.specs.widthMm),
  sr("Height", (t) => `${t.specs.heightMm} mm`, (t) => t.specs.heightMm),
  sr("Wheelbase", (t) => `${t.specs.wheelbaseMm} mm`, (t) => t.specs.wheelbaseMm),
  sr("Trunk", (t) => `${t.specs.trunkVolumeLiters} L`, (t) => t.specs.trunkVolumeLiters),
  sr("Seating", (t) => String(t.specs.seatingCapacity), (t) => t.specs.seatingCapacity),
  sr("Curb Weight", (t) => `${t.specs.curbWeightKg} kg`, (t) => t.specs.curbWeightKg),
];

const fuelRows: SpecRow[] = [
  sr("City", (t) => (t.specs.fuelEconomyCity > 0 ? `${t.specs.fuelEconomyCity} L/100km` : "Electric"), (t) => t.specs.fuelEconomyCity),
  sr("Highway", (t) => (t.specs.fuelEconomyHighway > 0 ? `${t.specs.fuelEconomyHighway} L/100km` : "Electric"), (t) => t.specs.fuelEconomyHighway),
  sr("Combined", (t) => (t.specs.fuelEconomyCombined > 0 ? `${t.specs.fuelEconomyCombined} L/100km` : "Electric"), (t) => t.specs.fuelEconomyCombined),
];

const pricingRows: SpecRow[] = [
  sr("Base Price", (t) => `${t.price.toLocaleString()} KWD`, (t) => t.price),
  sr("Warranty", (t) => t.specs.warranty),
];

/* ------------------------------------------------------------------ */
/* Model-level spec row helpers                                       */
/* ------------------------------------------------------------------ */
function rangeStr(min: number, max: number, suffix: string): string {
  if (min === max) return `${min}${suffix}`;
  return `${min}${suffix} - ${max}${suffix}`;
}

interface ModelSpecRow {
  label: string;
  getValue: (m: Model, agg: ModelAggregateSpecs) => string;
  getRaw: (m: Model, agg: ModelAggregateSpecs) => string | number;
}

function msr(
  label: string,
  getValue: (m: Model, agg: ModelAggregateSpecs) => string,
  getRaw?: (m: Model, agg: ModelAggregateSpecs) => string | number,
): ModelSpecRow {
  return { label, getValue, getRaw: getRaw ?? getValue };
}

const modelOverviewRows: ModelSpecRow[] = [
  msr("Body Type", (m) => m.bodyType),
  msr("Year", (m) => String(m.year)),
  msr("Trims Available", (_m, agg) => String(agg.trimCount)),
  msr("Fuel Types", (_m, agg) => agg.fuelTypes.join(", ")),
  msr("Transmissions", (_m, agg) => agg.transmissions.join(", ")),
  msr("Drive Types", (_m, agg) => agg.driveTypes.join(", ")),
];

const modelEngineRows: ModelSpecRow[] = [
  msr("Engine Range", (m) => m.specsSummary.engineRange),
  msr("Displacement", (_m, agg) => rangeStr(agg.displacementRange.min, agg.displacementRange.max, "L"), (_m, agg) => agg.displacementRange.max),
  msr("Horsepower", (_m, agg) => rangeStr(agg.hpRange.min, agg.hpRange.max, " hp"), (_m, agg) => agg.hpRange.max),
  msr("Torque", (_m, agg) => rangeStr(agg.torqueRange.min, agg.torqueRange.max, " Nm"), (_m, agg) => agg.torqueRange.max),
];

const modelDimensionRows: ModelSpecRow[] = [
  msr("Length", (_m, agg) => rangeStr(agg.dimensionRanges.length.min, agg.dimensionRanges.length.max, " mm"), (_m, agg) => agg.dimensionRanges.length.max),
  msr("Width", (_m, agg) => rangeStr(agg.dimensionRanges.width.min, agg.dimensionRanges.width.max, " mm"), (_m, agg) => agg.dimensionRanges.width.max),
  msr("Height", (_m, agg) => rangeStr(agg.dimensionRanges.height.min, agg.dimensionRanges.height.max, " mm"), (_m, agg) => agg.dimensionRanges.height.max),
  msr("Wheelbase", (_m, agg) => rangeStr(agg.dimensionRanges.wheelbase.min, agg.dimensionRanges.wheelbase.max, " mm"), (_m, agg) => agg.dimensionRanges.wheelbase.max),
  msr("Seating", (_m, agg) => rangeStr(agg.seatingRange.min, agg.seatingRange.max, ""), (_m, agg) => agg.seatingRange.max),
];

const modelPricingRows: ModelSpecRow[] = [
  msr("Price Range", (_m, agg) => `${agg.priceRange.min.toLocaleString()} - ${agg.priceRange.max.toLocaleString()} KWD`, (_m, agg) => agg.priceRange.min),
];

/* ------------------------------------------------------------------ */
/* Shared sub-components                                              */
/* ------------------------------------------------------------------ */

function SectionHeader({ title, colSpan }: { title: string; colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="bg-[#0F1B2D] px-3 py-2.5">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h3>
      </td>
    </tr>
  );
}

function CompareRow({
  label,
  values,
  highlight,
  hasAddCol,
}: {
  label: string;
  values: string[];
  highlight: boolean;
  hasAddCol: boolean;
}) {
  return (
    <tr className="border-b border-[#E2E8F0]">
      <td className="sticky start-0 z-10 bg-[#F1F5F9] px-3 py-2.5 text-xs font-medium text-[#64748B]">
        {label}
      </td>
      {values.map((val, i) => (
        <td
          key={i}
          className={`px-3 py-2.5 text-sm text-[#1E293B] text-center ${highlight ? "bg-[#F59E0B]/12" : ""}`}
        >
          {val}
        </td>
      ))}
      {hasAddCol && <td className="bg-white" />}
    </tr>
  );
}

function EquipmentRow({
  feature,
  trims,
  highlight,
  hasAddCol,
}: {
  feature: string;
  trims: Trim[];
  highlight: boolean;
  hasAddCol: boolean;
}) {
  return (
    <tr className="border-b border-[#E2E8F0]">
      <td className="sticky start-0 z-10 bg-[#F1F5F9] px-3 py-2.5 text-xs font-medium text-[#64748B]">
        {feature}
      </td>
      {trims.map((t) => {
        const eq = t.equipment.find((e) => e.name === feature);
        const isStandard = eq?.isStandard;
        return (
          <td key={t.id} className={`px-3 py-2.5 text-center ${highlight ? "bg-[#F59E0B]/12" : ""}`}>
            {isStandard ? (
              <Check className="w-4 h-4 text-[#10B981] mx-auto" />
            ) : eq ? (
              <span className="text-xs text-[#F59E0B] font-medium">Optional</span>
            ) : (
              <Minus className="w-4 h-4 text-[#EF4444]/50 mx-auto" />
            )}
          </td>
        );
      })}
      {hasAddCol && <td className="bg-white" />}
    </tr>
  );
}

function ModelEquipmentRow({
  feature,
  aggregates,
  highlight,
  hasAddCol,
}: {
  feature: string;
  aggregates: ModelAggregateSpecs[];
  highlight: boolean;
  hasAddCol: boolean;
}) {
  return (
    <tr className="border-b border-[#E2E8F0]">
      <td className="sticky start-0 z-10 bg-[#F1F5F9] px-3 py-2.5 text-xs font-medium text-[#64748B]">
        {feature}
      </td>
      {aggregates.map((agg, i) => {
        const status = agg.equipmentMap[feature];
        return (
          <td key={i} className={`px-3 py-2.5 text-center ${highlight ? "bg-[#F59E0B]/12" : ""}`}>
            {status === "standard" ? (
              <Check className="w-4 h-4 text-[#10B981] mx-auto" />
            ) : status === "some" ? (
              <span className="text-xs text-[#F59E0B] font-medium">Some trims</span>
            ) : (
              <Minus className="w-4 h-4 text-[#EF4444]/50 mx-auto" />
            )}
          </td>
        );
      })}
      {hasAddCol && <td className="bg-white" />}
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/* Inline picker component                                            */
/* ------------------------------------------------------------------ */

function InlinePicker({
  mode,
  existingIds,
  onSelect,
}: {
  mode: CompareMode;
  existingIds: string[];
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    return mode === "models" ? searchModelsDeduped(query) : searchTrims(query);
  }, [query, mode]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group flex flex-col items-center justify-center h-full bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-all"
      >
        {/* Placeholder image area */}
        <div className="w-full aspect-[16/10] bg-[#F1F5F9] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center group-hover:bg-[#1A56DB]/10 transition-colors">
            <Plus className="w-5 h-5 text-[#94A3B8] group-hover:text-[#1A56DB] transition-colors" />
          </div>
        </div>
        {/* Text area matching card padding */}
        <div className="p-3 w-full text-start">
          <p className="text-xs text-[#94A3B8]">Add to comparison</p>
          <p className="font-semibold text-sm text-[#64748B] group-hover:text-[#1A56DB] transition-colors">
            Select a vehicle
          </p>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm flex flex-col">
      <div className="relative border-b border-[#E2E8F0] px-3">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={mode === "models" ? "Search models..." : "Search trims..."}
          className="w-full ps-7 pe-7 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none"
        />
        <button
          onClick={() => setIsOpen(false)}
          className="absolute end-2 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1E293B]"
          aria-label="Close picker"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[300px]">
        {query.length < 2 ? (
          <p className="text-xs text-[#94A3B8] text-center py-6">Type to search...</p>
        ) : results.length === 0 ? (
          <p className="text-xs text-[#64748B] text-center py-6">No results</p>
        ) : (
          <ul>
            {results.slice(0, 10).map((entry) => {
              const itemId = mode === "models" ? entry.modelId : entry.trimId;
              const isDisabled = existingIds.includes(itemId);
              return (
                <li key={`${entry.modelId}-${entry.trimId}`}>
                  <button
                    onClick={() => {
                      if (!isDisabled) {
                        onSelect(itemId);
                        setIsOpen(false);
                      }
                    }}
                    disabled={isDisabled}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left border-b border-[#F1F5F9] last:border-0 transition-colors ${
                      isDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <div className="w-10 h-7 rounded overflow-hidden shrink-0 bg-[#F1F5F9]">
                      <PlaceholderImage aspectRatio="4/3" className="w-full h-full" bodyType={entry.bodyType as BodyType} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#64748B]">{entry.brandName}</p>
                      <p className="text-xs font-semibold text-[#1E293B] truncate">
                        {entry.modelName}
                        {mode === "trims" && (
                          <span className="font-normal text-[#64748B]"> {entry.trimName}</span>
                        )}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-[#F59E0B] shrink-0">
                      {entry.price.toLocaleString()} KWD
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="border-t border-[#E2E8F0]">
          <EmbedLink
            href="/browse"
            className="block text-center py-2.5 text-xs font-semibold text-[#1A56DB] hover:bg-[#F8FAFC]"
          >
            Browse All
          </EmbedLink>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab button                                                         */
/* ------------------------------------------------------------------ */

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2.5 text-sm font-semibold transition-colors ${
        active ? "text-[#1A56DB]" : "text-[#64748B] hover:text-[#1E293B]"
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="compare-tab-indicator"
          className="absolute bottom-0 inset-x-0 h-0.5 bg-[#1A56DB] rounded-full"
        />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Main comparison content                                            */
/* ------------------------------------------------------------------ */

function CompareContent() {
  const searchParams = useSearchParams();
  const compare = useCompare();
  const isEmbedded = useIsEmbedded();

  // Determine initial tab from URL
  const initialTab = (searchParams.get("tab") as CompareMode) || "models";
  const [activeTab, setActiveTab] = useState<CompareMode>(initialTab);

  // Resolve IDs from URL params
  const initialModelIds = useMemo(() => {
    const idsParam = searchParams.get("ids");
    if (idsParam) return idsParam.split(",").filter(Boolean);
    return [];
  }, [searchParams]);

  const initialTrimIds = useMemo(() => {
    const trimParam = searchParams.get("trims");
    if (trimParam) return trimParam.split(",").filter(Boolean);
    return [];
  }, [searchParams]);

  const [activeModelIds, setActiveModelIds] = useState<string[]>(() => initialModelIds);
  const [activeTrimIds, setActiveTrimIds] = useState<string[]>(() => initialTrimIds);

  // If URL had trims, switch to trims tab
  useEffect(() => {
    if (initialTrimIds.length > 0 && initialModelIds.length === 0) {
      setActiveTab("trims");
    }
  }, [initialTrimIds, initialModelIds]);

  const [highlightDiffs, setHighlightDiffs] = useState(false);
  const [leadModal, setLeadModal] = useState<{ open: boolean; trim: Trim | null }>({ open: false, trim: null });
  const [copied, setCopied] = useState(false);

  // Resolve models
  const selectedModels = useMemo(
    () => activeModelIds.map((id) => getModelById(id)).filter((m): m is Model => m !== undefined),
    [activeModelIds],
  );
  const modelAggregates = useMemo(
    () => selectedModels.map((m) => ({ model: m, agg: getModelAggregateSpecs(m.id)!, brand: getBrandByModelId(m.id) })).filter((x) => x.agg),
    [selectedModels],
  );

  // Resolve trims
  const selectedTrims = useMemo(
    () => activeTrimIds.map((id) => getTrimById(id)).filter((t): t is Trim => t !== undefined),
    [activeTrimIds],
  );
  const trimInfo = selectedTrims.map((t) => {
    const model = getModelById(t.modelId);
    const brand = model ? getBrandByModelId(model.id) : undefined;
    return { trim: t, model, brand };
  });

  // Add handlers
  const addModel = useCallback((modelId: string) => {
    setActiveModelIds((prev) => {
      if (prev.length >= 4 || prev.includes(modelId)) return prev;
      return [...prev, modelId];
    });
  }, []);

  const addTrim = useCallback((trimId: string) => {
    setActiveTrimIds((prev) => {
      if (prev.length >= 4 || prev.includes(trimId)) return prev;
      return [...prev, trimId];
    });
  }, []);

  const removeModel = (id: string) => setActiveModelIds((prev) => prev.filter((mid) => mid !== id));
  const removeTrim = (id: string) => setActiveTrimIds((prev) => prev.filter((tid) => tid !== id));

  // Diff detection
  const isDiff = (rawValues: (string | number)[]) => {
    if (!highlightDiffs || rawValues.length < 2) return false;
    return !rawValues.every((v) => v === rawValues[0]);
  };

  // Share
  const shareComparison = () => {
    const embedSuffix = isEmbedded ? "&embedded=true" : "";
    let url: string;
    if (activeTab === "models") {
      const ids = activeModelIds.join(",");
      url = `${window.location.origin}/compare?tab=models&ids=${ids}${embedSuffix}`;
    } else {
      const ids = activeTrimIds.join(",");
      url = `${window.location.origin}/compare?tab=trims&trims=${ids}${embedSuffix}`;
    }
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentItems = activeTab === "models" ? activeModelIds : activeTrimIds;
  const hasAddCol = currentItems.length < 4;
  const isEmpty = currentItems.length === 0;

  /* ---- EMPTY STATE ---- */
  if (isEmpty) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar compareCount={compare.totalCount} />
        <main className="flex-1 px-4 md:px-6 pb-20 md:pb-0">
          <div className="max-w-4xl mx-auto pt-4 md:pt-8">
            {/* Back to Home */}
            <nav className="hidden md:flex items-center gap-1.5 text-xs text-[#64748B] mb-4">
              <EmbedLink href="/" className="flex items-center gap-1 hover:text-[#1A56DB] transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </EmbedLink>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#1E293B] font-medium">Compare</span>
            </nav>
            <div className="md:hidden mb-3">
              <EmbedLink href="/" className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#1A56DB] transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </EmbedLink>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#E2E8F0] mb-8">
              <TabButton active={activeTab === "models"} onClick={() => setActiveTab("models")}>
                Compare Models
              </TabButton>
              <TabButton active={activeTab === "trims"} onClick={() => setActiveTab("trims")}>
                Compare Trims
              </TabButton>
            </div>

            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#1A56DB]/10 rounded-2xl flex items-center justify-center">
                <Scale className="w-8 h-8 text-[#1A56DB]" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-2">
                Compare {activeTab === "models" ? "Models" : "Trims"} Side by Side
              </h1>
              <p className="text-sm text-[#64748B] max-w-md mx-auto">
                {activeTab === "models"
                  ? "Compare models to see aggregate specs, price ranges, and available features across all trims."
                  : "Compare specific trims for exact specs, equipment, and pricing."}
              </p>
            </div>

            {/* Add vehicles inline */}
            <div className="max-w-sm mx-auto mb-12">
              <InlinePicker
                mode={activeTab}
                existingIds={currentItems}
                onSelect={activeTab === "models" ? addModel : addTrim}
              />
            </div>

            {/* Popular comparisons */}
            <div className="mb-10">
              <h2 className="text-lg font-bold text-[#1E293B] mb-4">Popular Comparisons</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { title: "C-Class vs 3 Series", subtitle: "Luxury sedan showdown", ids: "merc-c200,bmw-320i", tab: "trims" as CompareMode },
                  { title: "Land Cruiser vs X5", subtitle: "Premium SUV battle", ids: "toyota-lc-gxr,bmw-x5-40i", tab: "trims" as CompareMode },
                  { title: "Camry vs 3 Series", subtitle: "Mid-size value pick", ids: "toyota-camry-le,bmw-320i", tab: "trims" as CompareMode },
                ].map((comp) => (
                  <EmbedLink
                    key={comp.ids}
                    href={`/compare?tab=${comp.tab}&trims=${comp.ids}`}
                    className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E2E8F0] hover:border-[#1A56DB] transition-colors"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
                      <ArrowLeftRight className="w-5 h-5 text-[#F59E0B]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[#1E293B] group-hover:text-[#1A56DB] transition-colors">{comp.title}</p>
                      <p className="text-xs text-[#64748B]">{comp.subtitle}</p>
                    </div>
                  </EmbedLink>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <EmbedLink
                href="/browse"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A56DB] text-white font-bold rounded-xl hover:bg-[#1A56DB]/90 transition-colors"
              >
                Browse Cars to Compare
              </EmbedLink>
            </div>
          </div>
        </main>
        <Footer />
        <MobileTabBar activeTab="compare" compareCount={compare.totalCount} />
      </div>
    );
  }

  /* ---- MODELS COMPARISON VIEW ---- */
  const modelsTotalCols = modelAggregates.length + 1 + (hasAddCol && activeTab === "models" ? 1 : 0);

  /* ---- TRIMS COMPARISON VIEW ---- */
  const trimsTotalCols = selectedTrims.length + 1 + (hasAddCol && activeTab === "trims" ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar compareCount={compare.totalCount} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 pt-4 pb-24 md:pb-10">
        {/* Back to Home */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs text-[#64748B] mb-4">
          <EmbedLink href="/" className="flex items-center gap-1 hover:text-[#1A56DB] transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </EmbedLink>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1E293B] font-medium">Compare</span>
        </nav>
        <div className="md:hidden mb-3">
          <EmbedLink href="/" className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#1A56DB] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </EmbedLink>
        </div>

        {/* Tabs + Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex border-b border-[#E2E8F0]">
            <TabButton active={activeTab === "models"} onClick={() => setActiveTab("models")}>
              Compare Models
            </TabButton>
            <TabButton active={activeTab === "trims"} onClick={() => setActiveTab("trims")}>
              Compare Trims
            </TabButton>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {/* Highlight Differences Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-sm text-[#64748B]">Highlight Differences</span>
              <button
                type="button"
                role="switch"
                aria-checked={highlightDiffs}
                onClick={() => setHighlightDiffs((v) => !v)}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
                  highlightDiffs ? "bg-[#F59E0B]" : "bg-[#E2E8F0]"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    highlightDiffs ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </label>
            {/* Share */}
            <button
              onClick={shareComparison}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#1A56DB] border border-[#1A56DB] rounded-xl hover:bg-[#1A56DB]/5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Share2 className="w-4 h-4" />}
              {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* =============== MODELS TAB =============== */}
          {activeTab === "models" && (
            <motion.div
              key="models"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="overflow-x-auto styled-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-4">
                <table className="w-full min-w-[640px] border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky start-0 z-20 bg-[#F8FAFC] w-36 md:w-44 p-2" />
                      {modelAggregates.map(({ model, agg, brand }) => (
                        <th key={model.id} className="p-2 align-top min-w-[180px] md:min-w-[210px]">
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm"
                          >
                            <div className="relative">
                              <PlaceholderImage aspectRatio="16/10" label={model.name} bodyType={model.bodyType} imageUrl={model.imageUrl} />
                              <button
                                onClick={() => removeModel(model.id)}
                                className="absolute top-2 end-2 p-1 bg-white/90 rounded-full text-[#64748B] hover:text-[#EF4444] transition-colors shadow-sm"
                                aria-label={`Remove ${model.name}`}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="p-3 text-start">
                              <p className="text-xs text-[#64748B]">{brand?.name}</p>
                              <p className="font-bold text-sm text-[#1E293B] leading-tight">{model.name}</p>
                              <p className="text-[#F59E0B] font-bold text-sm mt-1">
                                {agg.priceRange.min === agg.priceRange.max
                                  ? `${agg.priceRange.min.toLocaleString()} KWD`
                                  : `${agg.priceRange.min.toLocaleString()} - ${agg.priceRange.max.toLocaleString()} KWD`}
                              </p>
                              <p className="text-[10px] text-[#94A3B8] mt-0.5">{agg.trimCount} trims</p>
                            </div>
                          </motion.div>
                        </th>
                      ))}
                      {hasAddCol && (
                        <th className="p-2 align-top min-w-[180px]">
                          <InlinePicker mode="models" existingIds={activeModelIds} onSelect={addModel} />
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {/* Overview */}
                    <SectionHeader title="Overview" colSpan={modelsTotalCols} />
                    {modelOverviewRows.map((row) => {
                      const rawVals = modelAggregates.map(({ model, agg }) => row.getRaw(model, agg));
                      return (
                        <CompareRow
                          key={row.label}
                          label={row.label}
                          values={modelAggregates.map(({ model, agg }) => row.getValue(model, agg))}
                          highlight={isDiff(rawVals)}
                          hasAddCol={hasAddCol}
                        />
                      );
                    })}

                    {/* Engine & Performance */}
                    <SectionHeader title="Engine & Performance" colSpan={modelsTotalCols} />
                    {modelEngineRows.map((row) => {
                      const rawVals = modelAggregates.map(({ model, agg }) => row.getRaw(model, agg));
                      return (
                        <CompareRow
                          key={row.label}
                          label={row.label}
                          values={modelAggregates.map(({ model, agg }) => row.getValue(model, agg))}
                          highlight={isDiff(rawVals)}
                          hasAddCol={hasAddCol}
                        />
                      );
                    })}

                    {/* Dimensions */}
                    <SectionHeader title="Dimensions & Capacity" colSpan={modelsTotalCols} />
                    {modelDimensionRows.map((row) => {
                      const rawVals = modelAggregates.map(({ model, agg }) => row.getRaw(model, agg));
                      return (
                        <CompareRow
                          key={row.label}
                          label={row.label}
                          values={modelAggregates.map(({ model, agg }) => row.getValue(model, agg))}
                          highlight={isDiff(rawVals)}
                          hasAddCol={hasAddCol}
                        />
                      );
                    })}

                    {/* Equipment Highlights */}
                    <SectionHeader title="Equipment Highlights" colSpan={modelsTotalCols} />
                    {KEY_FEATURES.map((feature) => {
                      const rawVals = modelAggregates.map(({ agg }) => agg.equipmentMap[feature] || "none");
                      return (
                        <ModelEquipmentRow
                          key={feature}
                          feature={feature}
                          aggregates={modelAggregates.map(({ agg }) => agg)}
                          highlight={isDiff(rawVals)}
                          hasAddCol={hasAddCol}
                        />
                      );
                    })}

                    {/* Pricing */}
                    <SectionHeader title="Pricing" colSpan={modelsTotalCols} />
                    {modelPricingRows.map((row) => {
                      const rawVals = modelAggregates.map(({ model, agg }) => row.getRaw(model, agg));
                      return (
                        <CompareRow
                          key={row.label}
                          label={row.label}
                          values={modelAggregates.map(({ model, agg }) => row.getValue(model, agg))}
                          highlight={isDiff(rawVals)}
                          hasAddCol={hasAddCol}
                        />
                      );
                    })}

                    {/* CTA Row */}
                    <tr>
                      <td className="sticky start-0 z-10 bg-[#F8FAFC] p-2" />
                      {modelAggregates.map(({ model, brand }) => (
                        <td key={model.id} className="p-3">
                          <div className="space-y-2">
                            <EmbedLink
                              href={`/model/${model.id}`}
                              className="block w-full py-2.5 bg-[#1A56DB] text-white text-sm font-bold rounded-xl hover:bg-[#1A56DB]/90 transition-colors text-center"
                            >
                              View {model.name}
                            </EmbedLink>
                            <a
                              href="#"
                              className="flex items-center justify-center gap-1.5 w-full py-2 text-sm font-medium text-[#64748B] border border-[#E2E8F0] rounded-xl hover:border-[#1A56DB] hover:text-[#1A56DB] transition-colors"
                            >
                              Visit {brand?.name ?? "Brand"} Website
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      ))}
                      {hasAddCol && <td />}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* =============== TRIMS TAB =============== */}
          {activeTab === "trims" && (
            <motion.div
              key="trims"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="overflow-x-auto styled-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-4">
                <table className="w-full min-w-[640px] border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky start-0 z-20 bg-[#F8FAFC] w-36 md:w-44 p-2" />
                      {trimInfo.map(({ trim, model, brand }) => (
                        <th key={trim.id} className="p-2 align-top min-w-[180px] md:min-w-[210px]">
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm"
                          >
                            <div className="relative">
                              <PlaceholderImage aspectRatio="16/10" label={trim.name} />
                              <button
                                onClick={() => removeTrim(trim.id)}
                                className="absolute top-2 end-2 p-1 bg-white/90 rounded-full text-[#64748B] hover:text-[#EF4444] transition-colors shadow-sm"
                                aria-label={`Remove ${trim.name}`}
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="absolute top-2 start-2 p-1 bg-white/90 rounded-full text-[#64748B] shadow-sm">
                                <ArrowLeftRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                            <div className="p-3 text-start">
                              <p className="text-xs text-[#64748B]">{brand?.name}</p>
                              <p className="font-bold text-sm text-[#1E293B] leading-tight">
                                {model?.name} {trim.name}
                              </p>
                              <p className="text-[#F59E0B] font-bold text-sm mt-1">
                                {trim.price.toLocaleString()} KWD
                              </p>
                            </div>
                          </motion.div>
                        </th>
                      ))}
                      {hasAddCol && (
                        <th className="p-2 align-top min-w-[180px]">
                          <InlinePicker mode="trims" existingIds={activeTrimIds} onSelect={addTrim} />
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    <SectionHeader title="Overview" colSpan={trimsTotalCols} />
                    {overviewRows.map((row) => {
                      const rawVals = selectedTrims.map(row.getRaw);
                      return <CompareRow key={row.label} label={row.label} values={selectedTrims.map(row.getValue)} highlight={isDiff(rawVals)} hasAddCol={hasAddCol} />;
                    })}

                    <SectionHeader title="Engine & Performance" colSpan={trimsTotalCols} />
                    {engineRows.map((row) => {
                      const rawVals = selectedTrims.map(row.getRaw);
                      return <CompareRow key={row.label} label={row.label} values={selectedTrims.map(row.getValue)} highlight={isDiff(rawVals)} hasAddCol={hasAddCol} />;
                    })}

                    <SectionHeader title="Dimensions & Capacity" colSpan={trimsTotalCols} />
                    {dimensionRows.map((row) => {
                      const rawVals = selectedTrims.map(row.getRaw);
                      return <CompareRow key={row.label} label={row.label} values={selectedTrims.map(row.getValue)} highlight={isDiff(rawVals)} hasAddCol={hasAddCol} />;
                    })}

                    <SectionHeader title="Fuel Economy" colSpan={trimsTotalCols} />
                    {fuelRows.map((row) => {
                      const rawVals = selectedTrims.map(row.getRaw);
                      return <CompareRow key={row.label} label={row.label} values={selectedTrims.map(row.getValue)} highlight={isDiff(rawVals)} hasAddCol={hasAddCol} />;
                    })}

                    <SectionHeader title="Equipment Highlights" colSpan={trimsTotalCols} />
                    {KEY_FEATURES.map((feature) => {
                      const rawVals = selectedTrims.map((t) => {
                        const eq = t.equipment.find((e) => e.name === feature);
                        return eq?.isStandard ? "standard" : eq ? "optional" : "none";
                      });
                      return <EquipmentRow key={feature} feature={feature} trims={selectedTrims} highlight={isDiff(rawVals)} hasAddCol={hasAddCol} />;
                    })}

                    <SectionHeader title="Pricing" colSpan={trimsTotalCols} />
                    {pricingRows.map((row) => {
                      const rawVals = selectedTrims.map(row.getRaw);
                      return <CompareRow key={row.label} label={row.label} values={selectedTrims.map(row.getValue)} highlight={isDiff(rawVals)} hasAddCol={hasAddCol} />;
                    })}

                    {/* CTA Row */}
                    <tr>
                      <td className="sticky start-0 z-10 bg-[#F8FAFC] p-2" />
                      {trimInfo.map(({ trim, brand }) => (
                        <td key={trim.id} className="p-3">
                          <div className="space-y-2">
                            <button
                              onClick={() => setLeadModal({ open: true, trim })}
                              className="w-full py-2.5 bg-[#1A56DB] text-white text-sm font-bold rounded-xl hover:bg-[#1A56DB]/90 transition-colors"
                            >
                              I&apos;m Interested
                            </button>
                            <a
                              href="#"
                              className="flex items-center justify-center gap-1.5 w-full py-2 text-sm font-medium text-[#64748B] border border-[#E2E8F0] rounded-xl hover:border-[#1A56DB] hover:text-[#1A56DB] transition-colors"
                            >
                              Visit {brand?.name ?? "Brand"} Website
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      ))}
                      {hasAddCol && <td />}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      <MobileTabBar activeTab="compare" compareCount={compare.totalCount} />

      {/* Lead Form Modal */}
      {leadModal.trim && (
        <LeadFormModal
          isOpen={leadModal.open}
          onClose={() => setLeadModal({ open: false, trim: null })}
          vehicle={{
            brandName: getBrandByModelId(leadModal.trim.modelId)?.name || "",
            modelName: getModelById(leadModal.trim.modelId)?.name || "",
            trimName: leadModal.trim.name,
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page export                                                        */
/* ------------------------------------------------------------------ */

export default function ComparePage() {
  return (
    <CompareProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <p className="text-[#64748B]">Loading comparison...</p>
          </div>
        }
      >
        <CompareContent />
      </Suspense>
    </CompareProvider>
  );
}
