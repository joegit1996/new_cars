"use client";

import { use, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Scale,
  Gauge,
  Zap,
  Fuel,
  Timer,
  ArrowLeft,
} from "lucide-react";
import EmbedLink from "../../../../components/EmbedLink";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import MobileTabBar from "../../../../components/MobileTabBar";
import PlaceholderImage from "../../../../components/PlaceholderImage";
import {
  CompareProvider,
  useCompare,
} from "../../../../context/CompareContext";
import {
  getModelById,
  getTrimsByModel,
  getBrandById,
} from "../../../../data/helpers";
import type { Trim } from "../../../../data/types";

/* ------------------------------------------------------------------ */
/* Trim Card                                                          */
/* ------------------------------------------------------------------ */

function TrimCard({
  trim,
  modelId,
  brandName,
  index,
}: {
  trim: Trim;
  modelId: string;
  brandName: string;
  index: number;
}) {
  const { toggleItem, isInCompare, items } = useCompare();
  const inCompare = isInCompare(trim.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm"
    >
      {/* Trim Image */}
      <PlaceholderImage aspectRatio="16/9" label={trim.name} />

      {/* Content */}
      <div className="p-4 md:p-5 space-y-4">
        {/* Name + Price */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-[#1E293B] leading-tight">
              {trim.name}
            </h2>
            <p className="text-sm text-[#64748B] mt-0.5">
              {trim.engineSummary}
            </p>
          </div>
          <p className="text-lg font-bold text-[#F59E0B] whitespace-nowrap shrink-0">
            {trim.price.toLocaleString()} KWD
          </p>
        </div>

        {/* Key Specs Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="w-4 h-4 shrink-0 text-[#1A56DB]" />
            <span className="text-[#64748B]">{trim.specs.horsepower} hp</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 shrink-0 text-[#F59E0B]" />
            <span className="text-[#64748B]">{trim.specs.torque} Nm</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Timer className="w-4 h-4 shrink-0 text-[#10B981]" />
            <span className="text-[#64748B]">
              {trim.specs.zeroToHundred}s 0-100
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Fuel className="w-4 h-4 shrink-0 text-[#06B6D4]" />
            <span className="text-[#64748B]">
              {trim.specs.fuelEconomyCombined > 0
                ? `${trim.specs.fuelEconomyCombined} L/100km`
                : "Electric"}
            </span>
          </div>
        </div>

        {/* Variant Chips */}
        {trim.variants.length > 0 && (
          <div>
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-2">
              Variants
            </p>
            <div className="flex flex-wrap gap-2">
              {trim.variants.map((v) => (
                <EmbedLink
                  key={v.id}
                  href={`/model/${modelId}?trim=${trim.id}&variant=${v.id}`}
                  className="px-3 py-1.5 bg-[#F1F5F9] text-xs font-medium text-[#1E293B] rounded-lg border border-[#E2E8F0] hover:border-[#1A56DB] hover:text-[#1A56DB] transition-colors"
                >
                  {v.name} {"\u00B7"} {v.price.toLocaleString()} KWD
                </EmbedLink>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-[#E2E8F0]">
          <EmbedLink
            href={`/model/${modelId}?trim=${trim.id}`}
            className="flex-1 py-2.5 text-center bg-[#1A56DB] text-white text-sm font-bold rounded-xl hover:bg-[#1A56DB]/90 transition-colors"
          >
            View Details
          </EmbedLink>
          <button
            onClick={() =>
              toggleItem({
                id: trim.id,
                name: trim.name,
                brandName,
                price: trim.price,
                imageUrl: "/images/placeholder-car.svg",
              })
            }
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-xl border transition-colors ${
              inCompare
                ? "bg-[#1A56DB]/10 text-[#1A56DB] border-[#1A56DB]"
                : "text-[#64748B] border-[#E2E8F0] hover:border-[#1A56DB] hover:text-[#1A56DB]"
            }`}
          >
            <Scale className="w-4 h-4" />
            {inCompare ? "Added" : "Compare"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Page content                                                       */
/* ------------------------------------------------------------------ */

function TrimsContent({ modelId }: { modelId: string }) {
  const model = useMemo(() => getModelById(modelId), [modelId]);
  const brand = useMemo(
    () => (model ? getBrandById(model.brandId) : undefined),
    [model],
  );
  const modelTrims = useMemo(
    () => getTrimsByModel(modelId),
    [modelId],
  );
  const { items } = useCompare();

  if (!model || !brand) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <p className="text-[#64748B]">Model not found.</p>
        </main>
        <Footer />
        <MobileTabBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar compareCount={items.length} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-6 pt-6 pb-24 md:pb-10">
        {/* Breadcrumb -- desktop */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs text-[#64748B] mb-6 flex-wrap">
          <EmbedLink href="/" className="hover:text-[#1A56DB] transition-colors">
            Home
          </EmbedLink>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <EmbedLink
            href={`/browse?brand=${brand.id}`}
            className="hover:text-[#1A56DB] transition-colors"
          >
            {brand.name}
          </EmbedLink>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <EmbedLink
            href={`/model/${model.id}`}
            className="hover:text-[#1A56DB] transition-colors"
          >
            {model.name}
          </EmbedLink>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-[#1E293B] font-medium">All Trims</span>
        </nav>
        {/* Mobile back button */}
        <div className="md:hidden mb-4">
          <EmbedLink
            href={`/model/${model.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#1A56DB] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {model.name}</span>
          </EmbedLink>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B]">
            {brand.name} {model.name}{" "}
            <span className="text-[#64748B] font-medium">{"\u2014"} All Trims</span>
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            {modelTrims.length} trim
            {modelTrims.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Trims Feed */}
        <div className="space-y-6">
          {modelTrims.map((trim, index) => (
            <TrimCard
              key={trim.id}
              trim={trim}
              modelId={model.id}
              brandName={brand.name}
              index={index}
            />
          ))}
        </div>
      </main>

      <Footer />
      <MobileTabBar compareCount={items.length} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page export                                                        */
/* ------------------------------------------------------------------ */

export default function TrimsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <CompareProvider>
      <TrimsContent modelId={id} />
    </CompareProvider>
  );
}
