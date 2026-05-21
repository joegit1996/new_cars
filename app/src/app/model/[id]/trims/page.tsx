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
import { useAppData } from "@/context/AppDataContext";
import { useLanguage, tFormat } from "@/context/LanguageContext";
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
  const { toggleItem, isInCompare } = useCompare();
  const inCompare = isInCompare(trim.id);
  const { t, ln } = useLanguage();

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm"
    >
      {/* Trim Image */}
      <PlaceholderImage aspectRatio="16/9" label={ln.trim(trim.name)} />

      {/* Content */}
      <div className="p-4 md:p-5 space-y-4">
        {/* Name + Price */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-[#1E293B] leading-tight">
              {ln.trim(trim.name)}
            </h2>
            <p className="text-sm text-[#64748B] mt-0.5">
              {ln.engineSummary(trim.engineSummary)}
            </p>
          </div>
          <p className="text-lg font-bold text-[#F59E0B] whitespace-nowrap shrink-0">
            {trim.price.toLocaleString()} {t.common.kwd}
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
                : t.fuelTypes.Electric}
            </span>
          </div>
        </div>

        {/* Variant Chips */}
        {trim.variants.length > 0 && (
          <div>
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-2">
              {t.trims.variants}
            </p>
            <div className="flex flex-wrap gap-2">
              {trim.variants.map((v) => (
                <EmbedLink
                  key={v.id}
                  href={`/model/${modelId}?trim=${trim.id}&variant=${v.id}`}
                  className="px-3 py-1.5 bg-[#F1F5F9] text-xs font-medium text-[#1E293B] rounded-lg border border-[#E2E8F0] hover:border-[#1A56DB] hover:text-[#1A56DB] transition-colors"
                >
                  {ln.trim(v.name)} {"\u00B7"} {v.price.toLocaleString()} {t.common.kwd}
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
            {t.common.viewDetails}
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
            {inCompare ? t.trims.added : t.trims.compare}
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
  const { getModelById, getTrimsByModel, getBrandById, loading } = useAppData();
  const { t, dir, ln } = useLanguage();
  const model = useMemo(() => getModelById(modelId), [modelId, getModelById]);
  const brand = useMemo(
    () => (model ? getBrandById(model.brandId) : undefined),
    [model, getBrandById],
  );
  const modelTrims = useMemo(
    () => getTrimsByModel(modelId),
    [modelId, getTrimsByModel],
  );
  const { totalCount } = useCompare();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!model || !brand) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <p className="text-[#64748B]">{t.trims.modelNotFound}</p>
        </main>
        <Footer />
        <MobileTabBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar compareCount={totalCount} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-6 pt-6 pb-24 md:pb-10">
        {/* Breadcrumb -- desktop */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs text-[#64748B] mb-6 flex-wrap">
          <EmbedLink href="/" className="hover:text-[#1A56DB] transition-colors">
            {t.common.home}
          </EmbedLink>
          <ChevronRight className={`w-3 h-3 shrink-0 ${dir === "rtl" ? "rotate-180" : ""}`} />
          <EmbedLink
            href={`/browse?brand=${brand.id}`}
            className="hover:text-[#1A56DB] transition-colors"
          >
            {ln.brand(brand.name)}
          </EmbedLink>
          <ChevronRight className={`w-3 h-3 shrink-0 ${dir === "rtl" ? "rotate-180" : ""}`} />
          <EmbedLink
            href={`/model/${model.id}`}
            className="hover:text-[#1A56DB] transition-colors"
          >
            {ln.model(model.name)}
          </EmbedLink>
          <ChevronRight className={`w-3 h-3 shrink-0 ${dir === "rtl" ? "rotate-180" : ""}`} />
          <span className="text-[#1E293B] font-medium">{t.trims.allTrims}</span>
        </nav>
        {/* Mobile back button */}
        <div className="md:hidden mb-4">
          <EmbedLink
            href={`/model/${model.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#1A56DB] transition-colors"
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${dir === "rtl" ? "rotate-180" : ""}`} />
            <span>{tFormat(t.trims.backToModel, { model: ln.model(model.name) })}</span>
          </EmbedLink>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B]">
            {ln.brand(brand.name)} {ln.model(model.name)}{" "}
            <span className="text-[#64748B] font-medium">{"\u2014"} {t.trims.allTrims}</span>
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            {tFormat(t.trims.trimsAvailable, { count: modelTrims.length })}
          </p>
        </div>

        {/* Trims Feed */}
        <div className="space-y-6">
          {modelTrims.map((trim, index) => (
            <TrimCard
              key={trim.id}
              trim={trim}
              modelId={model.id}
              brandName={ln.brand(brand.name)}
              index={index}
            />
          ))}
        </div>
      </main>

      <Footer />
      <MobileTabBar compareCount={totalCount} />
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
