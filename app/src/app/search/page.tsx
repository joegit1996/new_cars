"use client";

import { useState, useMemo } from "react";
import { Search, ArrowLeft } from "lucide-react";
import EmbedLink from "../../components/EmbedLink";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MobileTabBar from "../../components/MobileTabBar";
import ModelCard from "../../components/ModelCard";
import PlaceholderImage from "../../components/PlaceholderImage";
import { CompareProvider } from "../../context/CompareContext";
import { searchModels, getBrandById } from "../../data/helpers";
import { brands, models } from "../../data/mock-data";

function SearchPageContent() {
  const [query, setQuery] = useState("");
  const [recentSearches] = useState(["Land Cruiser", "BMW X5", "SUV"]);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    return searchModels(query);
  }, [query]);

  const popularModels = useMemo(
    () => models.filter((m) => m.isNew || m.isUpdated).slice(0, 6),
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-6 pt-6 pb-24 md:pb-10">
        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brands, models, or body types..."
            autoFocus
            className="w-full ps-12 pe-4 py-4 bg-white border border-[#E2E8F0] rounded-2xl text-base text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1A56DB] focus:border-transparent shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute end-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1E293B]"
            >
              Clear
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {query.length < 2 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-sm font-bold text-[#1E293B] mb-3">
                    Recent Searches
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#64748B] hover:border-[#1A56DB] hover:text-[#1A56DB] transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Popular Brands */}
              <section className="mb-8">
                <h2 className="text-sm font-bold text-[#1E293B] mb-3">
                  Popular Brands
                </h2>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {brands.map((brand) => (
                    <EmbedLink
                      key={brand.id}
                      href={`/browse?brand=${brand.id}`}
                      className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-[#E2E8F0] hover:border-[#1A56DB] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-xs font-bold text-[#64748B]">
                        {brand.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[10px] text-[#1E293B] font-medium text-center leading-tight">
                        {brand.name}
                      </span>
                    </EmbedLink>
                  ))}
                </div>
              </section>

              {/* Popular Right Now */}
              <section>
                <h2 className="text-sm font-bold text-[#1E293B] mb-3">
                  Popular Right Now
                </h2>
                {/* Mobile compact list */}
                <div className="md:hidden space-y-2">
                  {popularModels.slice(0, 4).map((model) => {
                    const brand = getBrandById(model.brandId);
                    return (
                      <EmbedLink
                        key={model.id}
                        href={`/model/${model.id}`}
                        className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E2E8F0] hover:border-[#1A56DB] transition-colors"
                      >
                        <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0">
                          <PlaceholderImage aspectRatio="4/3" className="w-full h-full" bodyType={model.bodyType} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[#64748B] uppercase tracking-wide">{brand?.name}</p>
                          <p className="text-sm font-bold text-[#1E293B] truncate">{model.name}</p>
                          <p className="text-xs font-bold text-[#F59E0B]">{model.startingPrice.toLocaleString()} KWD</p>
                        </div>
                      </EmbedLink>
                    );
                  })}
                </div>
                {/* Desktop grid */}
                <div className="hidden md:grid md:grid-cols-3 gap-4">
                  {popularModels.map((model) => {
                    const brand = getBrandById(model.brandId);
                    return (
                      <ModelCard
                        key={model.id}
                        model={{
                          id: model.id,
                          name: model.name,
                          brandName: brand?.name || "",
                          bodyType: model.bodyType,
                          startingPrice: model.startingPrice,
                          engineRange: model.specsSummary.engineRange,
                          hpRange: model.specsSummary.hpRange,
                          fuelType: model.specsSummary.fuelTypes.join(", "),
                          trimCount: model.trimCount,
                          isNew: model.isNew,
                          isUpdated: model.isUpdated,
                        }}
                      />
                    );
                  })}
                </div>
              </section>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sm text-[#64748B] mb-4">
                {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.map((model) => {
                  const brand = getBrandById(model.brandId);
                  return (
                    <ModelCard
                      key={model.id}
                      model={{
                        id: model.id,
                        name: model.name,
                        brandName: brand?.name || "",
                        bodyType: model.bodyType,
                        startingPrice: model.startingPrice,
                        engineRange: model.specsSummary.engineRange,
                        hpRange: model.specsSummary.hpRange,
                        fuelType: model.specsSummary.fuelTypes.join(", "),
                        trimCount: model.trimCount,
                        isNew: model.isNew,
                        isUpdated: model.isUpdated,
                      }}
                    />
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <Search className="w-12 h-12 text-[#E2E8F0] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#1E293B] mb-2">
                No matches for &quot;{query}&quot;
              </h3>
              <p className="text-sm text-[#64748B] mb-4">
                Try a different search term or browse all cars
              </p>
              <EmbedLink
                href="/browse"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A56DB] text-white text-sm font-bold rounded-xl hover:bg-[#1A56DB]/90 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Browse All Cars
              </EmbedLink>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      <MobileTabBar activeTab="search" />
    </div>
  );
}

export default function SearchPage() {
  return (
    <CompareProvider>
      <SearchPageContent />
    </CompareProvider>
  );
}
