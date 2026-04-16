"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, ArrowRight, Scale } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchTrims } from "@/data/helpers";
import type { SearchEntry, BodyType } from "@/data/types";
import PlaceholderImage from "./PlaceholderImage";
import { useRouter, usePathname } from "next/navigation";
import { useIsEmbedded } from "@/hooks/useIsEmbedded";
import { appendEmbedParam } from "@/hooks/useEmbedHref";

const PREVIEW_COUNT = 6;

export default function EmbeddedFloatingButtons() {
  const isEmbedded = useIsEmbedded();
  const pathname = usePathname();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchExpanded) {
      inputRef.current?.focus();
    } else {
      setQuery("");
      setResults([]);
      setHighlightIndex(-1);
    }
  }, [searchExpanded]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    setResults(searchTrims(query));
    setHighlightIndex(-1);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    if (!searchExpanded) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setSearchExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [searchExpanded]);

  // Close on Escape
  useEffect(() => {
    if (!searchExpanded) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSearchExpanded(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [searchExpanded]);

  const navigateToResult = useCallback(
    (entry: SearchEntry) => {
      setSearchExpanded(false);
      setQuery("");
      router.push(appendEmbedParam(`/model/${entry.modelId}?trim=${entry.trimId}`, true));
    },
    [router]
  );

  const navigateToFullResults = useCallback(() => {
    const q = query;
    setSearchExpanded(false);
    setQuery("");
    router.push(appendEmbedParam(`/search?q=${encodeURIComponent(q)}`, true));
  }, [router, query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const preview = results.slice(0, PREVIEW_COUNT);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((i) => Math.min(i + 1, preview.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === "Enter") {
        if (highlightIndex >= 0 && highlightIndex < preview.length) {
          navigateToResult(preview[highlightIndex]);
        } else if (results.length > 0) {
          navigateToFullResults();
        }
      }
    },
    [results, highlightIndex, navigateToResult, navigateToFullResults]
  );

  const preview = results.slice(0, PREVIEW_COUNT);
  const hasMore = results.length > PREVIEW_COUNT;

  // Only render in embedded mode; hide on model detail pages (sticky subnav has these)
  const isModelDetail = /^\/model\/[^/]+$/.test(pathname);
  if (!isEmbedded || isModelDetail) return null;

  return (
    <>
      {/* Floating buttons -- top right, stacked vertically */}
      <AnimatePresence>
        {!searchExpanded && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed top-5 end-5 z-[200] flex flex-row gap-2"
          >
            {/* Search */}
            <button
              onClick={() => setSearchExpanded(true)}
              className="w-10 h-10 rounded-full bg-[#1A56DB] text-white shadow-md flex items-center justify-center hover:bg-[#1A56DB]/90 active:scale-95 transition-transform"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Compare */}
            <button
              onClick={() => router.push(appendEmbedParam("/compare", true))}
              className="w-10 h-10 rounded-full bg-[#1E293B] text-white shadow-md flex items-center justify-center hover:bg-[#0F172A] active:scale-95 transition-transform"
              aria-label="Compare"
            >
              <Scale className="w-[18px] h-[18px]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/40"
            />

            {/* Panel */}
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-3 top-3 md:inset-x-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-[201] bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            >
              {/* Search input */}
              <div className="relative flex items-center border-b border-[#E2E8F0] px-4">
                <Search className="w-5 h-5 text-[#64748B] shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search brands, models, specs..."
                  className="flex-1 px-3 py-4 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none"
                />
                <button
                  onClick={() => setSearchExpanded(false)}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Results */}
              <div className="flex-1 overflow-y-auto">
                {query.length < 2 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-[#94A3B8]">Type to search brands, models, specs...</p>
                  </div>
                ) : preview.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-[#64748B]">No results for &quot;{query}&quot;</p>
                  </div>
                ) : (
                  <>
                    <ul className="py-1">
                      {preview.map((entry, i) => (
                        <li key={`${entry.trimId}-${i}`}>
                          <button
                            onClick={() => navigateToResult(entry)}
                            onMouseEnter={() => setHighlightIndex(i)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                              i === highlightIndex ? "bg-[#F1F5F9]" : "hover:bg-[#F8FAFC]"
                            }`}
                          >
                            <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-[#F1F5F9]">
                              <PlaceholderImage
                                aspectRatio="4/3"
                                className="w-full h-full"
                                bodyType={entry.bodyType as BodyType}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-[#64748B] uppercase">{entry.brandName}</p>
                              <p className="text-sm font-semibold text-[#1E293B] truncate">
                                {entry.modelName}{" "}
                                <span className="font-normal text-[#64748B]">{entry.trimName}</span>
                              </p>
                            </div>
                            <span className="shrink-0 text-xs font-bold text-[#F59E0B]">
                              {entry.price.toLocaleString()} KWD
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    {hasMore && (
                      <button
                        onClick={navigateToFullResults}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-[#1A56DB] border-t border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                      >
                        View all {results.length} results
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
