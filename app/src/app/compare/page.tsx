"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import EmbedLink from "../../components/EmbedLink";
import { motion } from "framer-motion";
import {
  X,
  ArrowLeftRight,
  Plus,
  Share2,
  Check,
  Minus,
  ExternalLink,
  Scale,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MobileTabBar from "../../components/MobileTabBar";
import PlaceholderImage from "../../components/PlaceholderImage";
import LeadFormModal from "../../components/LeadFormModal";
import { CompareProvider, useCompare } from "../../context/CompareContext";
import {
  getTrimById,
  getTrimsByModel,
  getBrandByModelId,
  getModelById,
} from "../../data/helpers";
import { useIsEmbedded } from "../../hooks/useIsEmbedded";
import type { Trim } from "../../data/types";

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
/* Spec row definitions                                               */
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
  sr(
    "Displacement",
    (t) => (t.specs.displacement > 0 ? `${t.specs.displacement}L` : "N/A"),
    (t) => t.specs.displacement,
  ),
  sr(
    "Cylinders",
    (t) => (t.specs.cylinders > 0 ? String(t.specs.cylinders) : "N/A"),
    (t) => t.specs.cylinders,
  ),
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
  sr(
    "City",
    (t) => (t.specs.fuelEconomyCity > 0 ? `${t.specs.fuelEconomyCity} L/100km` : "Electric"),
    (t) => t.specs.fuelEconomyCity,
  ),
  sr(
    "Highway",
    (t) =>
      t.specs.fuelEconomyHighway > 0 ? `${t.specs.fuelEconomyHighway} L/100km` : "Electric",
    (t) => t.specs.fuelEconomyHighway,
  ),
  sr(
    "Combined",
    (t) =>
      t.specs.fuelEconomyCombined > 0 ? `${t.specs.fuelEconomyCombined} L/100km` : "Electric",
    (t) => t.specs.fuelEconomyCombined,
  ),
];

const pricingRows: SpecRow[] = [
  sr("Base Price", (t) => `${t.price.toLocaleString()} KWD`, (t) => t.price),
  sr("Warranty", (t) => t.specs.warranty),
];

/* ------------------------------------------------------------------ */
/* Sub-components                                                     */
/* ------------------------------------------------------------------ */

function SectionHeader({
  title,
  colSpan,
}: {
  title: string;
  colSpan: number;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="bg-[#0F1B2D] px-3 py-2.5"
      >
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          {title}
        </h3>
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
          className={`px-3 py-2.5 text-sm text-[#1E293B] text-center ${
            highlight ? "bg-[#F59E0B]/12" : ""
          }`}
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
          <td
            key={t.id}
            className={`px-3 py-2.5 text-center ${highlight ? "bg-[#F59E0B]/12" : ""}`}
          >
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

/* ------------------------------------------------------------------ */
/* Main comparison content                                            */
/* ------------------------------------------------------------------ */

function CompareContent() {
  const searchParams = useSearchParams();
  const { items, removeItem } = useCompare();

  const isEmbedded = useIsEmbedded();

  /* Resolve trim IDs: URL params take priority, then context */
  const initialIds = useMemo(() => {
    const trimParam = searchParams.get("trims");
    if (trimParam) return trimParam.split(",").filter(Boolean);

    // Support model IDs from browse page (?ids=model1,model2)
    const modelParam = searchParams.get("ids");
    if (modelParam) {
      return modelParam
        .split(",")
        .filter(Boolean)
        .map((modelId) => {
          const trims = getTrimsByModel(modelId);
          return trims[0]?.id;
        })
        .filter((id): id is string => !!id);
    }

    return items.map((i) => i.id);
  }, [searchParams, items]);

  const [activeTrimIds, setActiveTrimIds] = useState<string[]>(() => initialIds);

  const selectedTrims = useMemo(
    () =>
      activeTrimIds
        .map((id) => getTrimById(id))
        .filter((t): t is Trim => t !== undefined),
    [activeTrimIds],
  );

  const [highlightDiffs, setHighlightDiffs] = useState(false);
  const [leadModal, setLeadModal] = useState<{
    open: boolean;
    trim: Trim | null;
  }>({ open: false, trim: null });
  const [copied, setCopied] = useState(false);

  const removeTrim = (id: string) => {
    setActiveTrimIds((prev) => prev.filter((tid) => tid !== id));
    removeItem(id);
  };

  const shareComparison = () => {
    const ids = selectedTrims.map((t) => t.id).join(",");
    const embedSuffix = isEmbedded ? "&embedded=true" : "";
    const url = `${window.location.origin}/compare?trims=${ids}${embedSuffix}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* Difference detection */
  const isDiff = (rawValues: (string | number)[]) => {
    if (!highlightDiffs || rawValues.length < 2) return false;
    return !rawValues.every((v) => v === rawValues[0]);
  };

  /* Build enriched info per trim */
  const trimInfo = selectedTrims.map((t) => {
    const model = getModelById(t.modelId);
    const brand = model ? getBrandByModelId(model.id) : undefined;
    return { trim: t, model, brand };
  });

  const hasAddCol = selectedTrims.length < 4;
  const totalCols = selectedTrims.length + 1 + (hasAddCol ? 1 : 0);

  /* ---- EMPTY STATE ---- */
  if (selectedTrims.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar compareCount={items.length} />
        <main className="flex-1 px-4 md:px-6 pb-20 md:pb-0">
          <div className="max-w-4xl mx-auto pt-12 md:pt-16">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#1A56DB]/10 rounded-2xl flex items-center justify-center">
                <Scale className="w-8 h-8 text-[#1A56DB]" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-2">
                Compare Vehicles Side by Side
              </h1>
              <p className="text-sm text-[#64748B] max-w-md mx-auto">
                Select two or more vehicles to compare specs, features, pricing, and equipment in detail.
              </p>
            </div>

            {/* How it works */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {[
                { step: "1", title: "Browse cars", desc: "Find vehicles that interest you from our catalog" },
                { step: "2", title: "Add to compare", desc: "Use the compare button on any car card" },
                { step: "3", title: "See side by side", desc: "View detailed specs and features compared" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#E2E8F0]">
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-[#1A56DB] text-white text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                  <div>
                    <p className="font-bold text-sm text-[#1E293B]">{item.title}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Popular comparisons */}
            <div className="mb-10">
              <h2 className="text-lg font-bold text-[#1E293B] mb-4">Popular Comparisons</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { title: "C-Class vs 3 Series", subtitle: "Luxury sedan showdown", ids: "merc-c200,bmw-320i" },
                  { title: "Land Cruiser vs X5", subtitle: "Premium SUV battle", ids: "toyota-lc-gxr,bmw-x5-40i" },
                  { title: "Camry vs 3 Series", subtitle: "Mid-size value pick", ids: "toyota-camry-le,bmw-320i" },
                ].map((comp) => (
                  <EmbedLink
                    key={comp.ids}
                    href={`/compare?trims=${comp.ids}`}
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

            {/* Comparison preview skeleton */}
            <div className="mb-10">
              <h2 className="text-lg font-bold text-[#1E293B] mb-4">What you will see</h2>
              <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden p-4">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="bg-[#E2E8F0] rounded-lg h-20 animate-pulse" />
                      <div className="bg-[#E2E8F0] rounded h-3 w-3/4 animate-pulse" />
                      <div className="bg-[#F59E0B]/20 rounded h-3 w-1/2 animate-pulse" />
                    </div>
                  ))}
                </div>
                {["Price", "Horsepower", "Torque", "0-100 km/h", "Fuel Economy"].map((label) => (
                  <div key={label} className="grid grid-cols-4 gap-3 py-2 border-t border-[#F1F5F9]">
                    <div className="text-xs text-[#94A3B8]">{label}</div>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-[#F1F5F9] rounded h-4 animate-pulse" />
                    ))}
                  </div>
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
        <MobileTabBar activeTab="compare" compareCount={items.length} />
      </div>
    );
  }

  /* ---- MAIN COMPARISON VIEW ---- */
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar compareCount={items.length} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 pt-6 pb-24 md:pb-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-[#1E293B]">
            Compare Vehicles
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            {/* Highlight Differences Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-sm text-[#64748B]">
                Highlight Differences
              </span>
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
              {copied ? (
                <Check className="w-4 h-4 text-[#10B981]" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Share Comparison"}
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto styled-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-4">
          <table className="w-full min-w-[640px] border-collapse">
            {/* Vehicle Header Row */}
            <thead>
              <tr>
                <th className="sticky start-0 z-20 bg-[#F8FAFC] w-36 md:w-44 p-2" />
                {trimInfo.map(({ trim, model, brand }) => (
                  <th
                    key={trim.id}
                    className="p-2 align-top min-w-[180px] md:min-w-[210px]"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm"
                    >
                      <div className="relative">
                        <PlaceholderImage
                          aspectRatio="16/10"
                          label={trim.name}
                        />
                        {/* Remove button */}
                        <button
                          onClick={() => removeTrim(trim.id)}
                          className="absolute top-2 end-2 p-1 bg-white/90 rounded-full text-[#64748B] hover:text-[#EF4444] transition-colors shadow-sm"
                          aria-label={`Remove ${trim.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {/* Swap icon (visual) */}
                        <div className="absolute top-2 start-2 p-1 bg-white/90 rounded-full text-[#64748B] shadow-sm">
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="p-3 text-start">
                        <p className="text-xs text-[#64748B]">
                          {brand?.name}
                        </p>
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
                    <EmbedLink
                      href="/browse"
                      className="flex flex-col items-center justify-center h-full min-h-[220px] bg-white rounded-xl border-2 border-dashed border-[#E2E8F0] hover:border-[#1A56DB] hover:bg-[#1A56DB]/5 transition-colors"
                    >
                      <Plus className="w-8 h-8 text-[#64748B] mb-2" />
                      <span className="text-sm font-medium text-[#64748B]">
                        Add Vehicle
                      </span>
                    </EmbedLink>
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {/* Overview */}
              <SectionHeader title="Overview" colSpan={totalCols} />
              {overviewRows.map((row) => {
                const rawVals = selectedTrims.map(row.getRaw);
                return (
                  <CompareRow
                    key={row.label}
                    label={row.label}
                    values={selectedTrims.map(row.getValue)}
                    highlight={isDiff(rawVals)}
                    hasAddCol={hasAddCol}
                  />
                );
              })}

              {/* Engine & Performance */}
              <SectionHeader
                title="Engine & Performance"
                colSpan={totalCols}
              />
              {engineRows.map((row) => {
                const rawVals = selectedTrims.map(row.getRaw);
                return (
                  <CompareRow
                    key={row.label}
                    label={row.label}
                    values={selectedTrims.map(row.getValue)}
                    highlight={isDiff(rawVals)}
                    hasAddCol={hasAddCol}
                  />
                );
              })}

              {/* Dimensions & Capacity */}
              <SectionHeader
                title="Dimensions & Capacity"
                colSpan={totalCols}
              />
              {dimensionRows.map((row) => {
                const rawVals = selectedTrims.map(row.getRaw);
                return (
                  <CompareRow
                    key={row.label}
                    label={row.label}
                    values={selectedTrims.map(row.getValue)}
                    highlight={isDiff(rawVals)}
                    hasAddCol={hasAddCol}
                  />
                );
              })}

              {/* Fuel Economy */}
              <SectionHeader title="Fuel Economy" colSpan={totalCols} />
              {fuelRows.map((row) => {
                const rawVals = selectedTrims.map(row.getRaw);
                return (
                  <CompareRow
                    key={row.label}
                    label={row.label}
                    values={selectedTrims.map(row.getValue)}
                    highlight={isDiff(rawVals)}
                    hasAddCol={hasAddCol}
                  />
                );
              })}

              {/* Equipment Highlights */}
              <SectionHeader
                title="Equipment Highlights"
                colSpan={totalCols}
              />
              {KEY_FEATURES.map((feature) => {
                const rawVals = selectedTrims.map((t) => {
                  const eq = t.equipment.find((e) => e.name === feature);
                  return eq?.isStandard ? "standard" : eq ? "optional" : "none";
                });
                return (
                  <EquipmentRow
                    key={feature}
                    feature={feature}
                    trims={selectedTrims}
                    highlight={isDiff(rawVals)}
                    hasAddCol={hasAddCol}
                  />
                );
              })}

              {/* Pricing */}
              <SectionHeader title="Pricing" colSpan={totalCols} />
              {pricingRows.map((row) => {
                const rawVals = selectedTrims.map(row.getRaw);
                return (
                  <CompareRow
                    key={row.label}
                    label={row.label}
                    values={selectedTrims.map(row.getValue)}
                    highlight={isDiff(rawVals)}
                    hasAddCol={hasAddCol}
                  />
                );
              })}

              {/* CTA Row */}
              <tr>
                <td className="sticky start-0 z-10 bg-[#F8FAFC] p-2" />
                {trimInfo.map(({ trim, brand }) => (
                  <td key={trim.id} className="p-3">
                    <div className="space-y-2">
                      <button
                        onClick={() =>
                          setLeadModal({ open: true, trim })
                        }
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

        {/* Add Vehicle button below table */}
        {hasAddCol && (
          <div className="mt-4 text-center">
            <EmbedLink
              href="/browse"
              className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-dashed border-[#1A56DB] text-[#1A56DB] text-sm font-bold rounded-xl hover:bg-[#1A56DB]/5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </EmbedLink>
          </div>
        )}
      </main>

      <Footer />
      <MobileTabBar activeTab="compare" compareCount={items.length} />

      {/* Lead Form Modal */}
      {leadModal.trim && (
        <LeadFormModal
          isOpen={leadModal.open}
          onClose={() => setLeadModal({ open: false, trim: null })}
          vehicle={{
            brandName:
              getBrandByModelId(leadModal.trim.modelId)?.name || "",
            modelName:
              getModelById(leadModal.trim.modelId)?.name || "",
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
