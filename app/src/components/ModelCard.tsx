"use client";

import { motion } from "framer-motion";
import { Scale, Bookmark } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import EmbedLink from "./EmbedLink";

export interface ModelData {
  id: string;
  name: string;
  brandName: string;
  bodyType: string;
  startingPrice: number;
  engineRange?: string;
  hpRange?: string;
  fuelType?: string;
  trimCount: number;
  isNew?: boolean;
  isUpdated?: boolean;
}

interface ModelCardProps {
  model: ModelData;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onCompare?: (id: string) => void;
  onSave?: (id: string) => void;
}

const bodyTypeColors: Record<string, string> = {
  Sedan: "bg-[#1A56DB]/10 text-[#1A56DB]",
  SUV: "bg-[#10B981]/10 text-[#10B981]",
  Hatchback: "bg-[#F59E0B]/10 text-[#F59E0B]",
  Coupe: "bg-[#EF4444]/10 text-[#EF4444]",
  Pickup: "bg-[#64748B]/10 text-[#64748B]",
  Van: "bg-[#06B6D4]/10 text-[#06B6D4]",
  Convertible: "bg-[#8B5CF6]/10 text-[#8B5CF6]",
};

export default function ModelCard({
  model,
  isSelected = false,
  onSelect,
  onCompare,
  onSave,
}: ModelCardProps) {
  const bodyTypeStyle =
    bodyTypeColors[model.bodyType] || "bg-[#64748B]/10 text-[#64748B]";

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative cursor-pointer rounded-lg overflow-hidden transition-colors ${
        isSelected
          ? "border-2 border-[#1A56DB] bg-[#1A56DB]/5"
          : "border border-[#E2E8F0] bg-[#F1F5F9]"
      }`}
    >
      {/* Clickable area -- navigates to model detail */}
      <EmbedLink href={`/model/${model.id}`} className="block">
        {/* Image */}
        <div className="relative">
          <PlaceholderImage aspectRatio="16/9" label={model.name} bodyType={model.bodyType} />

          {/* Badge */}
          {(model.isNew || model.isUpdated) && (
            <span className="absolute top-2 end-2 px-2.5 py-1 bg-[#06B6D4] text-white text-xs font-bold rounded-md">
              {model.isNew ? "New" : "Updated"}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          {/* Brand + Name + Body Type */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] text-[#64748B] font-medium uppercase tracking-wide">
                {model.brandName}
              </p>
              <h3 className="font-bold text-[#1E293B] text-sm leading-tight">
                {model.name}
              </h3>
            </div>
            <span
              className={`shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-md ${bodyTypeStyle}`}
            >
              {model.bodyType}
            </span>
          </div>

          {/* Price */}
          <p className="text-[#F59E0B] font-bold text-sm">
            Starting from {model.startingPrice.toLocaleString()} KWD
          </p>

          {/* Specs Row */}
          <div className="flex items-center gap-3 text-[10px] text-[#64748B]">
            {model.engineRange && <span>{model.engineRange}</span>}
            {model.hpRange && (
              <>
                <span className="w-px h-3 bg-[#E2E8F0]" />
                <span>{model.hpRange}</span>
              </>
            )}
            {model.fuelType && (
              <>
                <span className="w-px h-3 bg-[#E2E8F0]" />
                <span>{model.fuelType}</span>
              </>
            )}
          </div>
        </div>
      </EmbedLink>

      {/* Trim Count + Actions -- outside the link to avoid nested interactive elements */}
      <div className="flex items-center justify-between px-3 pb-3 pt-1 border-t border-[#E2E8F0]">
        <span className="text-xs text-[#64748B]">
          {model.trimCount} trim{model.trimCount !== 1 ? "s" : ""} available
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCompare?.(model.id);
              onSelect?.(model.id);
            }}
            className="p-1.5 rounded-md border border-[#E2E8F0] text-[#64748B] hover:border-[#1A56DB] hover:text-[#1A56DB] transition-colors"
            aria-label="Add to compare"
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave?.(model.id);
            }}
            className="p-1.5 rounded-md border border-[#E2E8F0] text-[#64748B] hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors"
            aria-label="Save"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
