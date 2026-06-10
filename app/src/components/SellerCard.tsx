"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { EmbedAnchor } from "./EmbedLink";
import { useLanguage } from "@/context/LanguageContext";
import type { Seller } from "@/data/types";

interface SellerCardProps {
  seller: Seller;
  listingCount?: number;
  variant?: "feature" | "compact";
  dir?: "ltr" | "rtl";
}

export default function SellerCard({
  seller,
  listingCount,
  variant = "feature",
}: SellerCardProps) {
  const { t, dir } = useLanguage();
  const primary = seller.brandColor;
  const primaryDark = seller.brandColorDark ?? primary;
  const heroUrl = seller.heroMedia?.url ?? seller.heroImages?.[0];

  if (variant === "compact") {
    return (
      <EmbedAnchor
        href={`/sellers/${seller.slug}`}
        className="group flex items-center gap-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#1A56DB] transition-colors p-4"
      >
        <span
          className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white border shrink-0"
          style={{ borderColor: `${primary}33` }}
        >
          <Image
            src={seller.logoUrl}
            alt={seller.name}
            width={48}
            height={48}
            className="object-contain max-w-[40px] max-h-[40px]"
            unoptimized
          />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider font-bold" style={{ color: primary }}>
            {seller.type === "financier"
              ? t.sellers.financierLabel
              : t.sellers.dealerLabel}
          </p>
          <h3 className="font-bold text-[#1E293B] truncate">{seller.name}</h3>
          {seller.tagline && (
            <p className="text-xs text-[#64748B] truncate">{seller.tagline}</p>
          )}
        </div>
        <ArrowRight
          className={`w-4 h-4 text-[#64748B] group-hover:text-[#1A56DB] transition-colors ${
            dir === "rtl" ? "rotate-180" : ""
          }`}
        />
      </EmbedAnchor>
    );
  }

  // feature variant -- large card with hero background
  return (
    <EmbedAnchor
      href={`/sellers/${seller.slug}`}
      className="group relative block overflow-hidden rounded-2xl"
      style={{
        background: `linear-gradient(135deg, ${primaryDark} 0%, ${primary} 100%)`,
        minHeight: 280,
      }}
    >
      {heroUrl && (
        <Image
          src={heroUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
          unoptimized
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(140deg, ${primaryDark}CC 0%, ${primary}80 55%, transparent 100%)`,
        }}
      />
      <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-black/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />

      {/* Top: logo + type chip */}
      <div className="relative z-10 p-5 md:p-6 flex items-center gap-3">
        <span className="inline-flex items-center justify-center bg-white rounded-xl p-1.5">
          <Image
            src={seller.logoUrl}
            alt={seller.name}
            width={96}
            height={28}
            className="h-7 w-auto object-contain"
            unoptimized
          />
        </span>
        <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/15 text-white backdrop-blur-sm">
          {seller.type === "financier"
            ? t.sellers.financierLabel
            : t.sellers.dealerLabel}
        </span>
      </div>

      {/* Bottom: title + CTA */}
      <div className="absolute bottom-0 inset-x-0 z-10 p-5 md:p-6 text-white">
        <h3 className="text-2xl md:text-3xl font-bold leading-tight">
          {seller.name}
        </h3>
        {seller.tagline && (
          <p className="text-sm text-white/85 mt-1">{seller.tagline}</p>
        )}
        <div className="flex items-center justify-between mt-4 gap-3 flex-wrap">
          {typeof listingCount === "number" && listingCount > 0 && (
            <span className="text-[11px] font-medium bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-md">
              {listingCount} {t.home.featuredSellers.listings}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 bg-white/[0.12] backdrop-blur-sm border border-white/15 px-3 py-2 rounded-xl text-xs font-bold">
            {t.home.featuredSellers.explore}
            <ArrowRight
              className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
                dir === "rtl" ? "rotate-180" : ""
              }`}
            />
          </span>
        </div>
      </div>
    </EmbedAnchor>
  );
}
