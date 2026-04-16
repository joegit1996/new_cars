"use client";

import { motion } from "framer-motion";
import { Scale, Bookmark, ArrowRight } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import EmbedLink from "./EmbedLink";
import { brandColors } from "@/data/helpers";

export interface ModelData {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  bodyType: string;
  startingPrice: number;
  engineRange?: string;
  hpRange?: string;
  fuelType?: string;
  trimCount: number;
  isNew?: boolean;
  isUpdated?: boolean;
  imageUrl?: string;
}

interface ModelCardProps {
  model: ModelData;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onCompare?: (id: string) => void;
  onSave?: (id: string) => void;
}

export default function ModelCard({
  model,
  isSelected = false,
  onSelect,
  onCompare,
  onSave,
}: ModelCardProps) {

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.14)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative cursor-pointer rounded-2xl overflow-hidden transition-colors ${
        isSelected
          ? "border-2 border-[#1A56DB] bg-[#1A56DB]/5"
          : "border border-[#E2E8F0] bg-gradient-to-b from-[#EEF2F7] to-[#DEE5EE]"
      }`}
    >
      {/* Clickable area -- navigates to model detail */}
      <EmbedLink href={`/model/${model.id}`} className="block">
        {/* Image -- hero zone, car pops out over the content boundary */}
        <div className="relative">
          <div className="relative overflow-hidden">
            <div className="transition-transform duration-700 ease-out group-hover:scale-[1.18] origin-bottom">
              <PlaceholderImage
                aspectRatio="4/3"
                label={model.name}
                bodyType={model.bodyType}
                silhouetteSize="lg"
                imageUrl={model.imageUrl}
              />
            </div>
          </div>

        </div>

        {/* Content -- white panel slides up over image to create pop-out effect */}
        <div className="relative -mt-6 bg-white rounded-t-2xl px-4 pt-5 pb-3 space-y-2.5">
          {/* Brand logo + Name */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: brandColors[model.brandId] || "#64748B" }}
            >
              <span className="text-white font-semibold text-[10px]">
                {model.brandName.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#64748B] font-medium uppercase tracking-wide truncate">
                {model.brandName}
              </p>
              <h3 className="font-bold text-[#1E293B] text-lg leading-tight">
                {model.name}
              </h3>
            </div>
          </div>

          {/* Spec pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {model.engineRange && (
              <span className="px-2 py-0.5 text-[10px] font-medium text-[#475569] bg-[#F1F5F9] rounded-md">
                {model.engineRange}
              </span>
            )}
            {model.hpRange && (
              <span className="px-2 py-0.5 text-[10px] font-medium text-[#475569] bg-[#F1F5F9] rounded-md">
                {model.hpRange}
              </span>
            )}
            {model.fuelType && (
              <span className="px-2 py-0.5 text-[10px] font-medium text-[#475569] bg-[#F1F5F9] rounded-md">
                {model.fuelType}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-between">
            <p className="text-[#1E293B] font-bold text-base">
              {model.startingPrice.toLocaleString()}{" "}
              <span className="text-[#64748B] font-normal text-sm">KWD</span>
            </p>
            <span className="text-[11px] text-[#94A3B8] font-medium">
              {model.trimCount} trim{model.trimCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </EmbedLink>

      {/* Actions -- outside the link to avoid nested interactive elements */}
      <div className="flex items-center gap-2 px-4 pb-3.5 pt-0 bg-white">
        <EmbedLink
          href={`/model/${model.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#1E293B] text-white text-xs font-semibold rounded-lg hover:bg-[#0F172A] transition-colors"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </EmbedLink>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCompare?.(model.id);
            onSelect?.(model.id);
          }}
          className="p-2 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#1A56DB] hover:text-[#1A56DB] transition-colors"
          aria-label="Add to compare"
        >
          <Scale className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave?.(model.id);
          }}
          className="p-2 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors"
          aria-label="Save"
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
