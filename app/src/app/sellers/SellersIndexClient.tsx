"use client";

import { useMemo } from "react";
import { Home, ChevronRight, ArrowLeft } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileTabBar from "@/components/MobileTabBar";
import SellerCard from "@/components/SellerCard";
import { EmbedAnchor } from "@/components/EmbedLink";
import { CompareProvider, useCompare } from "@/context/CompareContext";

export default function SellersIndexClient() {
  return (
    <CompareProvider>
      <Inner />
    </CompareProvider>
  );
}

function Inner() {
  const { sellers, getListingsBySeller } = useAppData();
  const { t, dir } = useLanguage();
  const compare = useCompare();

  // Featured first, then everything else by name
  const ordered = useMemo(() => {
    const arr = [...sellers];
    arr.sort((a, b) => {
      const af = a.featured ? 0 : 1;
      const bf = b.featured ? 0 : 1;
      if (af !== bf) return af - bf;
      return a.name.localeCompare(b.name);
    });
    return arr;
  }, [sellers]);

  const financiers = ordered.filter((s) => s.type === "financier");
  const dealers = ordered.filter((s) => s.type === "dealer");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar compareCount={compare.totalCount} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 pt-6">
          <nav className="hidden md:flex items-center gap-1.5 text-xs text-[#64748B]">
            <EmbedAnchor
              href="/"
              className="flex items-center gap-1 hover:text-[#1A56DB] transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t.common.home}</span>
            </EmbedAnchor>
            <ChevronRight className={`w-3 h-3 ${dir === "rtl" ? "rotate-180" : ""}`} />
            <span className="text-[#1E293B] font-medium">{t.sellersIndex.title}</span>
          </nav>
          <div className="md:hidden">
            <EmbedAnchor
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#1A56DB] transition-colors"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${dir === "rtl" ? "rotate-180" : ""}`} />
              <span>{t.common.backToHome}</span>
            </EmbedAnchor>
          </div>
        </div>

        {/* Header */}
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 pt-6 pb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B]">
            {t.sellersIndex.title}
          </h1>
          <p className="text-sm md:text-base text-[#64748B] mt-2 max-w-2xl">
            {t.sellersIndex.subtitle}
          </p>
        </div>

        {ordered.length === 0 ? (
          <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-16">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center text-sm text-[#64748B]">
              {t.sellersIndex.empty}
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-10 space-y-12">
            {financiers.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#1A56DB] mb-3">
                  {t.sellersIndex.financiers}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  {financiers.map((s) => (
                    <SellerCard
                      key={s.id}
                      seller={s}
                      listingCount={getListingsBySeller(s.id).length}
                    />
                  ))}
                </div>
              </section>
            )}

            {dealers.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#1A56DB] mb-3">
                  {t.sellersIndex.dealers}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  {dealers.map((s) => (
                    <SellerCard
                      key={s.id}
                      seller={s}
                      listingCount={getListingsBySeller(s.id).length}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />
      <MobileTabBar activeTab="search" compareCount={compare.totalCount} />
    </div>
  );
}
