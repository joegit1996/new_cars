"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, X, Scale } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";

export interface ComparisonItem {
  id: string;
  name: string;
  trimName: string;
}

interface ComparisonTrayProps {
  items: ComparisonItem[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onCompare: () => void;
}

export default function ComparisonTray({
  items,
  onRemove,
  onClearAll,
  onCompare,
}: ComparisonTrayProps) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      {/* Desktop Tray */}
      <div className="hidden md:block fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E2E8F0] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#1A56DB]" />
            <span className="text-sm font-bold text-[#1E293B]">
              {items.length} selected
            </span>
          </div>

          <div className="flex items-center gap-3 flex-1 justify-center overflow-x-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 bg-[#F1F5F9] rounded-lg ps-1 pe-2 py-1 shrink-0"
              >
                <div className="w-12 h-8 rounded overflow-hidden">
                  <PlaceholderImage aspectRatio="3/2" className="w-full h-full" />
                </div>
                <span className="text-xs font-medium text-[#1E293B] whitespace-nowrap">
                  {item.trimName}
                </span>
                <button
                  onClick={() => onRemove(item.id)}
                  className="p-0.5 rounded-full hover:bg-[#EF4444]/10 text-[#64748B] hover:text-[#EF4444] transition-colors"
                  aria-label={`Remove ${item.trimName}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onClearAll}
              className="text-xs text-[#64748B] hover:text-[#EF4444] transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={onCompare}
              disabled={items.length < 2}
              className="px-5 py-2 bg-[#1A56DB] text-white text-sm font-bold rounded-xl hover:bg-[#1A56DB]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Compare Now
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tray */}
      <div className="md:hidden fixed bottom-[60px] inset-x-0 z-40">
        <AnimatePresence>
          {expanded ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white border-t border-[#E2E8F0] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] overflow-hidden"
            >
              <div className="px-4 py-3">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#1A56DB]" />
                    <span className="text-sm font-bold text-[#1E293B]">
                      {items.length} selected
                    </span>
                  </div>
                  <button
                    onClick={() => setExpanded(false)}
                    className="p-1 text-[#64748B]"
                    aria-label="Collapse"
                  >
                    <ChevronUp className="w-5 h-5 rotate-180" />
                  </button>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 bg-[#F1F5F9] rounded-lg ps-1 pe-2 py-1.5"
                    >
                      <div className="w-14 h-9 rounded overflow-hidden shrink-0">
                        <PlaceholderImage aspectRatio="3/2" className="w-full h-full" />
                      </div>
                      <span className="text-xs font-medium text-[#1E293B] flex-1">
                        {item.trimName}
                      </span>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="p-1 text-[#64748B] hover:text-[#EF4444]"
                        aria-label={`Remove ${item.trimName}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={onClearAll}
                    className="text-xs text-[#64748B] hover:text-[#EF4444]"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={onCompare}
                    disabled={items.length < 2}
                    className="px-5 py-2.5 bg-[#1A56DB] text-white text-sm font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Compare Now
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() => setExpanded(true)}
              className="mx-4 mb-2 w-[calc(100%-2rem)] flex items-center justify-between bg-[#1A56DB] text-white rounded-xl px-4 py-2.5 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4" />
                <span className="text-sm font-bold">{items.length} to compare</span>
              </div>
              <ChevronUp className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
