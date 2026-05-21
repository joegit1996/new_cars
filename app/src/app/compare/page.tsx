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
import { useAppData } from "@/context/AppDataContext";
import { useLanguage, tFormat } from "@/context/LanguageContext";
import { useIsEmbedded } from "../../hooks/useIsEmbedded";
import type { Trim, Model, ModelAggregateSpecs, BodyType } from "../../data/types";
import type { Dictionary } from "@/i18n/dictionaries";

/* ------------------------------------------------------------------ */
/* 10 key equipment features to compare                               */
/* ------------------------------------------------------------------ */
const KEY_FEATURES: ReadonlyArray<keyof Dictionary["compare"]["features"]> = [
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

type Ln = {
  body: (n: string) => string;
  fuel: (n: string) => string;
  drive: (n: string) => string;
  transmission: (n: string) => string;
};

function makeOverviewRows(
  t: Dictionary,
  ln: Ln,
  getModelById: (id: string) => Model | undefined,
): SpecRow[] {
  return [
    sr(t.compare.bodyType, (tr) => ln.body(getModelById(tr.modelId)?.bodyType ?? "-")),
    sr(t.compare.fuelType, (tr) => ln.fuel(tr.fuelType)),
    sr(t.compare.year, (tr) => String(getModelById(tr.modelId)?.year ?? "-")),
    sr(t.compare.specRegion, (tr) => tr.specs.specRegion),
  ];
}

function makeEngineRows(t: Dictionary, ln: Ln): SpecRow[] {
  return [
    sr(t.compare.engineType, (tr) => tr.specs.engineType),
    sr(t.compare.displacement, (tr) => (tr.specs.displacement > 0 ? `${tr.specs.displacement}L` : t.compare.notAvailable), (tr) => tr.specs.displacement),
    sr(t.compare.cylinders, (tr) => (tr.specs.cylinders > 0 ? String(tr.specs.cylinders) : t.compare.notAvailable), (tr) => tr.specs.cylinders),
    sr(t.compare.horsepower, (tr) => `${tr.specs.horsepower} hp`, (tr) => tr.specs.horsepower),
    sr(t.compare.torque, (tr) => `${tr.specs.torque} Nm`, (tr) => tr.specs.torque),
    sr(t.compare.accelerationShort, (tr) => `${tr.specs.zeroToHundred}s`, (tr) => tr.specs.zeroToHundred),
    sr(t.compare.topSpeed, (tr) => `${tr.specs.topSpeed} km/h`, (tr) => tr.specs.topSpeed),
    sr(t.compare.transmission, (tr) => ln.transmission(tr.specs.transmission)),
    sr(t.compare.driveType, (tr) => ln.drive(tr.specs.driveType)),
  ];
}

function makeDimensionRows(t: Dictionary): SpecRow[] {
  return [
    sr(t.compare.length, (tr) => `${tr.specs.lengthMm} mm`, (tr) => tr.specs.lengthMm),
    sr(t.compare.width, (tr) => `${tr.specs.widthMm} mm`, (tr) => tr.specs.widthMm),
    sr(t.compare.height, (tr) => `${tr.specs.heightMm} mm`, (tr) => tr.specs.heightMm),
    sr(t.compare.wheelbase, (tr) => `${tr.specs.wheelbaseMm} mm`, (tr) => tr.specs.wheelbaseMm),
    sr(t.compare.trunk, (tr) => `${tr.specs.trunkVolumeLiters} L`, (tr) => tr.specs.trunkVolumeLiters),
    sr(t.compare.seating, (tr) => String(tr.specs.seatingCapacity), (tr) => tr.specs.seatingCapacity),
    sr(t.compare.curbWeight, (tr) => `${tr.specs.curbWeightKg} kg`, (tr) => tr.specs.curbWeightKg),
  ];
}

function makeFuelRows(t: Dictionary): SpecRow[] {
  return [
    sr(t.compare.city, (tr) => (tr.specs.fuelEconomyCity > 0 ? `${tr.specs.fuelEconomyCity} L/100km` : t.compare.electric), (tr) => tr.specs.fuelEconomyCity),
    sr(t.compare.highway, (tr) => (tr.specs.fuelEconomyHighway > 0 ? `${tr.specs.fuelEconomyHighway} L/100km` : t.compare.electric), (tr) => tr.specs.fuelEconomyHighway),
    sr(t.compare.combined, (tr) => (tr.specs.fuelEconomyCombined > 0 ? `${tr.specs.fuelEconomyCombined} L/100km` : t.compare.electric), (tr) => tr.specs.fuelEconomyCombined),
  ];
}

function makePricingRows(t: Dictionary): SpecRow[] {
  return [
    sr(t.compare.basePrice, (tr) => `${tr.price.toLocaleString()} ${t.common.kwd}`, (tr) => tr.price),
    sr(t.compare.warranty, (tr) => tr.specs.warranty),
  ];
}

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

function makeModelOverviewRows(t: Dictionary, ln: Ln): ModelSpecRow[] {
  return [
    msr(t.compare.bodyType, (m) => ln.body(m.bodyType)),
    msr(t.compare.year, (m) => String(m.year)),
    msr(t.compare.trimsAvailable, (_m, agg) => String(agg.trimCount)),
    msr(t.compare.fuelTypes, (_m, agg) => agg.fuelTypes.map((f) => ln.fuel(f)).join("، ")),
    msr(t.compare.transmissions, (_m, agg) => agg.transmissions.map((x) => ln.transmission(x)).join("، ")),
    msr(t.compare.driveTypes, (_m, agg) => agg.driveTypes.map((x) => ln.drive(x)).join("، ")),
  ];
}

function makeModelEngineRows(t: Dictionary): ModelSpecRow[] {
  return [
    msr(t.compare.engineRange, (m) => m.specsSummary.engineRange),
    msr(t.compare.displacement, (_m, agg) => rangeStr(agg.displacementRange.min, agg.displacementRange.max, "L"), (_m, agg) => agg.displacementRange.max),
    msr(t.compare.horsepower, (_m, agg) => rangeStr(agg.hpRange.min, agg.hpRange.max, " hp"), (_m, agg) => agg.hpRange.max),
    msr(t.compare.torque, (_m, agg) => rangeStr(agg.torqueRange.min, agg.torqueRange.max, " Nm"), (_m, agg) => agg.torqueRange.max),
  ];
}

function makeModelDimensionRows(t: Dictionary): ModelSpecRow[] {
  return [
    msr(t.compare.length, (_m, agg) => rangeStr(agg.dimensionRanges.length.min, agg.dimensionRanges.length.max, " mm"), (_m, agg) => agg.dimensionRanges.length.max),
    msr(t.compare.width, (_m, agg) => rangeStr(agg.dimensionRanges.width.min, agg.dimensionRanges.width.max, " mm"), (_m, agg) => agg.dimensionRanges.width.max),
    msr(t.compare.height, (_m, agg) => rangeStr(agg.dimensionRanges.height.min, agg.dimensionRanges.height.max, " mm"), (_m, agg) => agg.dimensionRanges.height.max),
    msr(t.compare.wheelbase, (_m, agg) => rangeStr(agg.dimensionRanges.wheelbase.min, agg.dimensionRanges.wheelbase.max, " mm"), (_m, agg) => agg.dimensionRanges.wheelbase.max),
    msr(t.compare.seating, (_m, agg) => rangeStr(agg.seatingRange.min, agg.seatingRange.max, ""), (_m, agg) => agg.seatingRange.max),
  ];
}

function makeModelPricingRows(t: Dictionary): ModelSpecRow[] {
  return [
    msr(t.compare.priceRange, (_m, agg) => `${agg.priceRange.min.toLocaleString()} - ${agg.priceRange.max.toLocaleString()} ${t.common.kwd}`, (_m, agg) => agg.priceRange.min),
  ];
}

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
  featureLabel,
  trims,
  highlight,
  hasAddCol,
  optionalLabel,
}: {
  feature: string;
  featureLabel: string;
  trims: Trim[];
  highlight: boolean;
  hasAddCol: boolean;
  optionalLabel: string;
}) {
  return (
    <tr className="border-b border-[#E2E8F0]">
      <td className="sticky start-0 z-10 bg-[#F1F5F9] px-3 py-2.5 text-xs font-medium text-[#64748B]">
        {featureLabel}
      </td>
      {trims.map((t) => {
        const eq = t.equipment.find((e) => e.name === feature);
        const isStandard = eq?.isStandard;
        return (
          <td key={t.id} className={`px-3 py-2.5 text-center ${highlight ? "bg-[#F59E0B]/12" : ""}`}>
            {isStandard ? (
              <Check className="w-4 h-4 text-[#10B981] mx-auto" />
            ) : eq ? (
              <span className="text-xs text-[#F59E0B] font-medium">{optionalLabel}</span>
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
  featureLabel,
  aggregates,
  highlight,
  hasAddCol,
  someTrimsLabel,
}: {
  feature: string;
  featureLabel: string;
  aggregates: ModelAggregateSpecs[];
  highlight: boolean;
  hasAddCol: boolean;
  someTrimsLabel: string;
}) {
  return (
    <tr className="border-b border-[#E2E8F0]">
      <td className="sticky start-0 z-10 bg-[#F1F5F9] px-3 py-2.5 text-xs font-medium text-[#64748B]">
        {featureLabel}
      </td>
      {aggregates.map((agg, i) => {
        const status = agg.equipmentMap[feature];
        return (
          <td key={i} className={`px-3 py-2.5 text-center ${highlight ? "bg-[#F59E0B]/12" : ""}`}>
            {status === "standard" ? (
              <Check className="w-4 h-4 text-[#10B981] mx-auto" />
            ) : status === "some" ? (
              <span className="text-xs text-[#F59E0B] font-medium">{someTrimsLabel}</span>
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
  const { searchModelsDeduped, searchTrims } = useAppData();
  const { t, ln } = useLanguage();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    return mode === "models" ? searchModelsDeduped(query) : searchTrims(query);
  }, [query, mode, searchModelsDeduped, searchTrims]);

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
          <p className="text-xs text-[#94A3B8]">{t.compare.addToComparison}</p>
          <p className="font-semibold text-sm text-[#64748B] group-hover:text-[#1A56DB] transition-colors">
            {t.compare.selectVehicle}
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
          placeholder={mode === "models" ? t.compare.searchModels : t.compare.searchTrims}
          className="w-full ps-7 pe-7 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none"
        />
        <button
          onClick={() => setIsOpen(false)}
          className="absolute end-2 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1E293B]"
          aria-label={t.compare.closePicker}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[300px]">
        {query.length < 2 ? (
          <p className="text-xs text-[#94A3B8] text-center py-6">{t.compare.typeToSearch}</p>
        ) : results.length === 0 ? (
          <p className="text-xs text-[#64748B] text-center py-6">{t.compare.noResults}</p>
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
                      <p className="text-[10px] text-[#64748B]">{ln.brand(entry.brandName)}</p>
                      <p className="text-xs font-semibold text-[#1E293B] truncate">
                        {ln.model(entry.modelName)}
                        {mode === "trims" && (
                          <span className="font-normal text-[#64748B]"> {ln.trim(entry.trimName)}</span>
                        )}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-[#F59E0B] shrink-0">
                      {entry.price.toLocaleString()} {t.common.kwd}
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
            {t.compare.browseAll}
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
  const { t, dir, ln } = useLanguage();
  const { getTrimById, getBrandByModelId, getModelById, getModelAggregateSpecs, loading } = useAppData();

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
    [activeModelIds, getModelById],
  );
  const modelAggregates = useMemo(
    () => selectedModels.map((m) => ({ model: m, agg: getModelAggregateSpecs(m.id)!, brand: getBrandByModelId(m.id) })).filter((x) => x.agg),
    [selectedModels, getModelAggregateSpecs, getBrandByModelId],
  );

  // Resolve trims
  const selectedTrims = useMemo(
    () => activeTrimIds.map((id) => getTrimById(id)).filter((tr): tr is Trim => tr !== undefined),
    [activeTrimIds, getTrimById],
  );
  const trimInfo = selectedTrims.map((tr) => {
    const model = getModelById(tr.modelId);
    const brand = model ? getBrandByModelId(model.id) : undefined;
    return { trim: tr, model, brand };
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

  // Localized rows
  const overviewRows = useMemo(() => makeOverviewRows(t, ln, getModelById), [t, ln, getModelById]);
  const engineRows = useMemo(() => makeEngineRows(t, ln), [t, ln]);
  const dimensionRows = useMemo(() => makeDimensionRows(t), [t]);
  const fuelRows = useMemo(() => makeFuelRows(t), [t]);
  const pricingRows = useMemo(() => makePricingRows(t), [t]);
  const modelOverviewRows = useMemo(() => makeModelOverviewRows(t, ln), [t, ln]);
  const modelEngineRows = useMemo(() => makeModelEngineRows(t), [t]);
  const modelDimensionRows = useMemo(() => makeModelDimensionRows(t), [t]);
  const modelPricingRows = useMemo(() => makeModelPricingRows(t), [t]);

  const currentItems = activeTab === "models" ? activeModelIds : activeTrimIds;
  const hasAddCol = currentItems.length < 4;
  const isEmpty = currentItems.length === 0;
  const rtlFlip = dir === "rtl" ? "rotate-180" : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
                <span>{t.common.home}</span>
              </EmbedLink>
              <ChevronRight className={`w-3 h-3 ${rtlFlip}`} />
              <span className="text-[#1E293B] font-medium">{t.common.compare}</span>
            </nav>
            <div className="md:hidden mb-3">
              <EmbedLink href="/" className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#1A56DB] transition-colors">
                <ArrowLeft className={`w-3.5 h-3.5 ${rtlFlip}`} />
                <span>{t.common.backToHome}</span>
              </EmbedLink>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#E2E8F0] mb-8">
              <TabButton active={activeTab === "models"} onClick={() => setActiveTab("models")}>
                {t.compare.compareModels}
              </TabButton>
              <TabButton active={activeTab === "trims"} onClick={() => setActiveTab("trims")}>
                {t.compare.compareTrims}
              </TabButton>
            </div>

            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#1A56DB]/10 rounded-2xl flex items-center justify-center">
                <Scale className="w-8 h-8 text-[#1A56DB]" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-2">
                {tFormat(t.compare.compareSideBySide, {
                  what: activeTab === "models" ? t.compare.models : t.compare.trims,
                })}
              </h1>
              <p className="text-sm text-[#64748B] max-w-md mx-auto">
                {activeTab === "models" ? t.compare.modelsSubtitle : t.compare.trimsSubtitle}
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
              <h2 className="text-lg font-bold text-[#1E293B] mb-4">{t.compare.popularComparisons}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { title: t.compare.popularComparison1Title, subtitle: t.compare.popularComparison1Subtitle, ids: "merc-c200,bmw-320i", tab: "trims" as CompareMode },
                  { title: t.compare.popularComparison2Title, subtitle: t.compare.popularComparison2Subtitle, ids: "toyota-lc-gxr,bmw-x5-40i", tab: "trims" as CompareMode },
                  { title: t.compare.popularComparison3Title, subtitle: t.compare.popularComparison3Subtitle, ids: "toyota-camry-le,bmw-320i", tab: "trims" as CompareMode },
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
                {t.compare.browseCarsToCompare}
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
            <span>{t.common.home}</span>
          </EmbedLink>
          <ChevronRight className={`w-3 h-3 ${rtlFlip}`} />
          <span className="text-[#1E293B] font-medium">{t.common.compare}</span>
        </nav>
        <div className="md:hidden mb-3">
          <EmbedLink href="/" className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#1A56DB] transition-colors">
            <ArrowLeft className={`w-3.5 h-3.5 ${rtlFlip}`} />
            <span>{t.common.backToHome}</span>
          </EmbedLink>
        </div>

        {/* Tabs + Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex border-b border-[#E2E8F0]">
            <TabButton active={activeTab === "models"} onClick={() => setActiveTab("models")}>
              {t.compare.compareModels}
            </TabButton>
            <TabButton active={activeTab === "trims"} onClick={() => setActiveTab("trims")}>
              {t.compare.compareTrims}
            </TabButton>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {/* Highlight Differences Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-sm text-[#64748B]">{t.compare.highlightDifferences}</span>
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
              {copied ? t.compare.copied : t.compare.share}
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
                              <PlaceholderImage aspectRatio="16/10" label={ln.model(model.name)} bodyType={model.bodyType} imageUrl={model.imageUrl} />
                              <button
                                onClick={() => removeModel(model.id)}
                                className="absolute top-2 end-2 p-1 bg-white/90 rounded-full text-[#64748B] hover:text-[#EF4444] transition-colors shadow-sm"
                                aria-label={tFormat(t.compare.removeItem, { name: ln.model(model.name) })}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="p-3 text-start">
                              <p className="text-xs text-[#64748B]">{brand ? ln.brand(brand.name) : ""}</p>
                              <p className="font-bold text-sm text-[#1E293B] leading-tight">{ln.model(model.name)}</p>
                              <p className="text-[#F59E0B] font-bold text-sm mt-1">
                                {agg.priceRange.min === agg.priceRange.max
                                  ? `${agg.priceRange.min.toLocaleString()} ${t.common.kwd}`
                                  : `${agg.priceRange.min.toLocaleString()} - ${agg.priceRange.max.toLocaleString()} ${t.common.kwd}`}
                              </p>
                              <p className="text-[10px] text-[#94A3B8] mt-0.5">{tFormat(t.compare.trimsCount, { count: agg.trimCount })}</p>
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
                    <SectionHeader title={t.compare.overview} colSpan={modelsTotalCols} />
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
                    <SectionHeader title={t.compare.enginePerformance} colSpan={modelsTotalCols} />
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
                    <SectionHeader title={t.compare.dimensionsCapacity} colSpan={modelsTotalCols} />
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
                    <SectionHeader title={t.compare.equipmentHighlights} colSpan={modelsTotalCols} />
                    {KEY_FEATURES.map((feature) => {
                      const rawVals = modelAggregates.map(({ agg }) => agg.equipmentMap[feature] || "none");
                      return (
                        <ModelEquipmentRow
                          key={feature}
                          feature={feature}
                          featureLabel={t.compare.features[feature]}
                          aggregates={modelAggregates.map(({ agg }) => agg)}
                          highlight={isDiff(rawVals)}
                          hasAddCol={hasAddCol}
                          someTrimsLabel={t.compare.someTrims}
                        />
                      );
                    })}

                    {/* Pricing */}
                    <SectionHeader title={t.compare.pricing} colSpan={modelsTotalCols} />
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
                              {tFormat(t.compare.viewModel, { name: model.name })}
                            </EmbedLink>
                            <a
                              href="#"
                              className="flex items-center justify-center gap-1.5 w-full py-2 text-sm font-medium text-[#64748B] border border-[#E2E8F0] rounded-xl hover:border-[#1A56DB] hover:text-[#1A56DB] transition-colors"
                            >
                              {brand?.name
                                ? tFormat(t.compare.visitBrandWebsite, { brand: brand.name })
                                : t.compare.visitWebsite}
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
                              <PlaceholderImage aspectRatio="16/10" label={ln.trim(trim.name)} />
                              <button
                                onClick={() => removeTrim(trim.id)}
                                className="absolute top-2 end-2 p-1 bg-white/90 rounded-full text-[#64748B] hover:text-[#EF4444] transition-colors shadow-sm"
                                aria-label={tFormat(t.compare.removeItem, { name: ln.trim(trim.name) })}
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="absolute top-2 start-2 p-1 bg-white/90 rounded-full text-[#64748B] shadow-sm">
                                <ArrowLeftRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                            <div className="p-3 text-start">
                              <p className="text-xs text-[#64748B]">{brand ? ln.brand(brand.name) : ""}</p>
                              <p className="font-bold text-sm text-[#1E293B] leading-tight">
                                {model ? ln.model(model.name) : ""} {ln.trim(trim.name)}
                              </p>
                              <p className="text-[#F59E0B] font-bold text-sm mt-1">
                                {trim.price.toLocaleString()} {t.common.kwd}
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
                    <SectionHeader title={t.compare.overview} colSpan={trimsTotalCols} />
                    {overviewRows.map((row) => {
                      const rawVals = selectedTrims.map(row.getRaw);
                      return <CompareRow key={row.label} label={row.label} values={selectedTrims.map(row.getValue)} highlight={isDiff(rawVals)} hasAddCol={hasAddCol} />;
                    })}

                    <SectionHeader title={t.compare.enginePerformance} colSpan={trimsTotalCols} />
                    {engineRows.map((row) => {
                      const rawVals = selectedTrims.map(row.getRaw);
                      return <CompareRow key={row.label} label={row.label} values={selectedTrims.map(row.getValue)} highlight={isDiff(rawVals)} hasAddCol={hasAddCol} />;
                    })}

                    <SectionHeader title={t.compare.dimensionsCapacity} colSpan={trimsTotalCols} />
                    {dimensionRows.map((row) => {
                      const rawVals = selectedTrims.map(row.getRaw);
                      return <CompareRow key={row.label} label={row.label} values={selectedTrims.map(row.getValue)} highlight={isDiff(rawVals)} hasAddCol={hasAddCol} />;
                    })}

                    <SectionHeader title={t.compare.fuelEconomy} colSpan={trimsTotalCols} />
                    {fuelRows.map((row) => {
                      const rawVals = selectedTrims.map(row.getRaw);
                      return <CompareRow key={row.label} label={row.label} values={selectedTrims.map(row.getValue)} highlight={isDiff(rawVals)} hasAddCol={hasAddCol} />;
                    })}

                    <SectionHeader title={t.compare.equipmentHighlights} colSpan={trimsTotalCols} />
                    {KEY_FEATURES.map((feature) => {
                      const rawVals = selectedTrims.map((tr) => {
                        const eq = tr.equipment.find((e) => e.name === feature);
                        return eq?.isStandard ? "standard" : eq ? "optional" : "none";
                      });
                      return (
                        <EquipmentRow
                          key={feature}
                          feature={feature}
                          featureLabel={t.compare.features[feature]}
                          trims={selectedTrims}
                          highlight={isDiff(rawVals)}
                          hasAddCol={hasAddCol}
                          optionalLabel={t.compare.optional}
                        />
                      );
                    })}

                    <SectionHeader title={t.compare.pricing} colSpan={trimsTotalCols} />
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
                              {t.compare.iAmInterested}
                            </button>
                            <a
                              href="#"
                              className="flex items-center justify-center gap-1.5 w-full py-2 text-sm font-medium text-[#64748B] border border-[#E2E8F0] rounded-xl hover:border-[#1A56DB] hover:text-[#1A56DB] transition-colors"
                            >
                              {brand?.name
                                ? tFormat(t.compare.visitBrandWebsite, { brand: brand.name })
                                : t.compare.visitWebsite}
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
            brandName: ln.brand(getBrandByModelId(leadModal.trim.modelId)?.name || ""),
            modelName: ln.model(getModelById(leadModal.trim.modelId)?.name || ""),
            trimName: ln.trim(leadModal.trim.name),
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page export                                                        */
/* ------------------------------------------------------------------ */

function CompareLoadingFallback() {
  const { t, ln } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <p className="text-[#64748B]">{t.compare.loadingComparison}</p>
    </div>
  );
}

export default function ComparePage() {
  return (
    <CompareProvider>
      <Suspense fallback={<CompareLoadingFallback />}>
        <CompareContent />
      </Suspense>
    </CompareProvider>
  );
}
