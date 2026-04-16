"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { searchTrims } from "@/data/helpers";
import type { SearchEntry } from "@/data/types";
import PlaceholderImage from "./PlaceholderImage";
import type { BodyType } from "@/data/types";
import { useRouter } from "next/navigation";

const PREVIEW_COUNT = 6;

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Search on query change
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const all = searchTrims(query);
    setResults(all);
    setHighlightIndex(-1);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navigateToResult = useCallback(
    (entry: SearchEntry) => {
      setOpen(false);
      setQuery("");
      router.push(`/model/${entry.modelId}?trim=${entry.trimId}`);
    },
    [router]
  );

  const navigateToFullResults = useCallback(() => {
    setOpen(false);
    const q = query;
    setQuery("");
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }, [router, query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const preview = results.slice(0, PREVIEW_COUNT);
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      } else if (e.key === "ArrowDown") {
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
  const showDropdown = open && query.length >= 2;

  // Figure out what attribute matched (for the tag)
  function getMatchTag(entry: SearchEntry): string | null {
    const q = query.toLowerCase();
    const nameParts = `${entry.brandName} ${entry.modelName} ${entry.trimName}`.toLowerCase();
    if (nameParts.includes(q)) return null; // identity match, no tag needed
    // Check common attribute patterns
    const parts = entry.searchText.split(" ");
    // Try to find which segment matches
    const segments = [
      { text: entry.bodyType.toLowerCase(), label: entry.bodyType },
    ];
    // We can't easily reverse-map all attributes, so just show a generic "Specs" tag
    // unless it's a recognizable pattern
    if (entry.searchText.includes(q)) {
      // Check for common patterns
      if (q.includes("v8") || q.includes("v6") || q.includes("v12") || q.includes("cylinder")) return "Engine";
      if (q.includes("hp")) return "Power";
      if (q.includes("awd") || q.includes("4wd") || q.includes("fwd") || q.includes("rwd")) return "Drivetrain";
      if (q.includes("automatic") || q.includes("manual") || q.includes("cvt")) return "Transmission";
      if (q.includes("petrol") || q.includes("diesel") || q.includes("hybrid") || q.includes("electric")) return "Fuel";
      if (q.includes("sedan") || q.includes("suv") || q.includes("coupe") || q.includes("pickup") || q.includes("van") || q.includes("hatchback") || q.includes("convertible")) return entry.bodyType;
      return "Specs";
    }
    return null;
  }

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xl">
      {/* Input */}
      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search brands, models, specs, features..."
          className="w-full ps-10 pe-9 py-2.5 bg-white rounded-full text-sm text-[#1E293B] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1E293B] transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full mt-2 inset-x-0 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden z-[100]">
          {preview.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-[#64748B]">No results for &quot;{query}&quot;</p>
            </div>
          ) : (
            <>
              <ul className="py-1">
                {preview.map((entry, i) => {
                  const tag = getMatchTag(entry);
                  return (
                    <li key={`${entry.trimId}-${i}`}>
                      <button
                        onClick={() => navigateToResult(entry)}
                        onMouseEnter={() => setHighlightIndex(i)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
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
                          <p className="text-xs text-[#64748B]">{entry.brandName}</p>
                          <p className="text-sm font-semibold text-[#1E293B] truncate">
                            {entry.modelName}{" "}
                            <span className="font-normal text-[#64748B]">{entry.trimName}</span>
                          </p>
                        </div>
                        {tag && (
                          <span className="shrink-0 text-[10px] font-medium text-[#1A56DB] bg-[#EFF6FF] px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        )}
                        <span className="shrink-0 text-xs font-bold text-[#F59E0B]">
                          {entry.price.toLocaleString()} KWD
                        </span>
                      </button>
                    </li>
                  );
                })}
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
      )}
    </div>
  );
}

// Mobile version: full-width input that appears below the nav
export function MobileGlobalSearch({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    setResults(searchTrims(query));
  }, [query]);

  const navigateToResult = useCallback(
    (entry: SearchEntry) => {
      onClose();
      setQuery("");
      router.push(`/model/${entry.modelId}?trim=${entry.trimId}`);
    },
    [router, onClose]
  );

  const navigateToFullResults = useCallback(() => {
    const q = query;
    onClose();
    setQuery("");
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }, [router, query, onClose]);

  if (!open) return null;

  const preview = results.slice(0, PREVIEW_COUNT);
  const hasMore = results.length > PREVIEW_COUNT;

  return (
    <div className="md:hidden bg-[#0F1B2D] px-4 pb-3">
      <div className="relative mb-2">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B] pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Enter" && results.length > 0) {
              if (results.length === 1) {
                navigateToResult(results[0]);
              } else {
                navigateToFullResults();
              }
            }
          }}
          placeholder="Search brands, models, specs..."
          autoFocus
          className="w-full ps-10 pe-9 py-2.5 bg-white rounded-full text-sm text-[#1E293B] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1E293B]"
            aria-label="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mobile results */}
      {query.length >= 2 && (
        <div className="bg-white rounded-2xl overflow-hidden max-h-[60vh] overflow-y-auto">
          {preview.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-[#64748B]">No results for &quot;{query}&quot;</p>
            </div>
          ) : (
            <>
              {preview.map((entry, i) => (
                <button
                  key={`${entry.trimId}-${i}`}
                  onClick={() => navigateToResult(entry)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-[#F1F5F9] last:border-0 active:bg-[#F1F5F9]"
                >
                  <div className="w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-[#F1F5F9]">
                    <PlaceholderImage
                      aspectRatio="4/3"
                      className="w-full h-full"
                      bodyType={entry.bodyType as BodyType}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#64748B] uppercase">{entry.brandName}</p>
                    <p className="text-sm font-semibold text-[#1E293B] truncate">
                      {entry.modelName} <span className="font-normal text-[#64748B]">{entry.trimName}</span>
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-[#F59E0B]">
                    {entry.price.toLocaleString()} KWD
                  </span>
                </button>
              ))}
              {hasMore && (
                <button
                  onClick={navigateToFullResults}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-[#1A56DB] border-t border-[#E2E8F0] active:bg-[#F8FAFC]"
                >
                  View all {results.length} results
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
