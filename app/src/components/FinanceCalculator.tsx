"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import type { FinancierCalcConfig } from "@/data/types";

function formatPrice(price: number) {
  return price.toLocaleString("en-US");
}

export interface FinanceCalculatorProps {
  /** Total estimate the calculator works against (base + reg + insurance, in KWD). */
  totalEstimate: number;
  /** Optional config; falls back to a generic 3.9% rate + 10-50% DP + 12-60 months. */
  config?: FinancierCalcConfig;
  /** Branded accent (background + slider colour). Defaults to platform blue. */
  accent?: {
    primary: string;
    primaryDark?: string;
    logoUrl?: string;
    label?: string;
  };
  /** Show the seller name strip on top. */
  branded?: boolean;
}

const GENERIC_CONFIG: FinancierCalcConfig = {
  paymentType: "installment",
  downPayment: { minPct: 10, maxPct: 50, defaultPct: 20, stepPct: 5 },
  tenure: { optionsMonths: [12, 18, 24, 30, 36, 42, 48, 54, 60], defaultMonths: 48 },
  profitRate: 0.039,
  adminFee: 0,
};

export function FinanceCalculator({
  totalEstimate,
  config,
  accent,
  branded = false,
}: FinanceCalculatorProps) {
  const { t } = useLanguage();

  const cfg = useMemo<FinancierCalcConfig>(
    () => ({
      ...GENERIC_CONFIG,
      ...config,
      downPayment: { ...GENERIC_CONFIG.downPayment!, ...config?.downPayment },
      tenure: { ...GENERIC_CONFIG.tenure!, ...config?.tenure },
    }),
    [config]
  );

  const primary = accent?.primary ?? "#1A56DB";
  const primaryDark = accent?.primaryDark ?? primary;

  const [downPct, setDownPct] = useState(cfg.downPayment!.defaultPct);
  const [tenure, setTenure] = useState(cfg.tenure!.defaultMonths);

  // Reset state when the config changes (e.g. user switches sellers).
  useEffect(() => {
    setDownPct(cfg.downPayment!.defaultPct);
    setTenure(cfg.tenure!.defaultMonths);
  }, [cfg]);

  // Cash-only sellers don't need an installment calculator.
  if (cfg.paymentType === "cash") {
    return (
      <div
        className="rounded-xl p-5 space-y-2"
        style={{ background: branded ? `${primary}10` : "#F1F5F9" }}
      >
        {branded && accent?.label && (
          <SellerStrip accent={accent} primary={primary} />
        )}
        <p className="text-sm text-[#64748B]">{t.model.basePriceLabel}</p>
        <p className="text-2xl font-bold" style={{ color: primaryDark }}>
          {formatPrice(totalEstimate)} {t.common.kwd}
        </p>
        {cfg.notes && (
          <p className="text-xs text-[#64748B] pt-1">{cfg.notes}</p>
        )}
      </div>
    );
  }

  const cappedTotal = cfg.maxFinanceAmount
    ? Math.min(totalEstimate, cfg.maxFinanceAmount)
    : totalEstimate;
  const downPayment = Math.round(cappedTotal * (downPct / 100));
  const financed = cappedTotal - downPayment;
  const rate = cfg.profitRate ?? GENERIC_CONFIG.profitRate!;
  const adminFee = cfg.adminFee ?? 0;
  const monthly =
    tenure > 0
      ? Math.round((financed * (1 + rate * (tenure / 12)) + adminFee) / tenure)
      : 0;

  return (
    <div
      className="rounded-xl p-5 space-y-5"
      style={{
        background: branded ? `${primary}0F` : "#F1F5F9",
        border: branded ? `1px solid ${primary}33` : "none",
      }}
    >
      {branded && accent?.label && (
        <SellerStrip accent={accent} primary={primary} />
      )}
      <h4 className="font-bold text-[#1E293B] text-sm">
        {branded && accent?.label
          ? `${accent.label} ${t.model.monthlyCalculator}`
          : t.model.monthlyCalculator}
      </h4>

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[#64748B]">{t.model.downPayment}</span>
          <span className="text-[#1E293B] font-medium">
            {downPct}% ({formatPrice(downPayment)} {t.common.kwd})
          </span>
        </div>
        <input
          type="range"
          min={cfg.downPayment!.minPct}
          max={cfg.downPayment!.maxPct}
          step={cfg.downPayment!.stepPct}
          value={downPct}
          onChange={(e) => setDownPct(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: primary }}
        />
        <div className="flex justify-between text-xs text-[#64748B] mt-1">
          <span>{cfg.downPayment!.minPct}%</span>
          <span>{cfg.downPayment!.maxPct}%</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[#64748B]">{t.model.tenure}</span>
          <span className="text-[#1E293B] font-medium">
            {tenure} {t.model.months}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {cfg.tenure!.optionsMonths.map((months) => {
            const active = months === tenure;
            return (
              <button
                key={months}
                type="button"
                onClick={() => setTenure(months)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                style={
                  active
                    ? {
                        background: primary,
                        color: "#fff",
                        borderColor: primary,
                      }
                    : {
                        background: "#fff",
                        color: "#1E293B",
                        borderColor: "#E2E8F0",
                      }
                }
              >
                {months} {t.model.months}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 text-center">
        <p className="text-xs text-[#64748B] mb-1">{t.model.estimatedMonthly}</p>
        <p className="text-2xl font-bold" style={{ color: primaryDark }}>
          {formatPrice(monthly)} {t.model.kwdPerMo}
        </p>
        {cfg.maxFinanceAmount && totalEstimate > cfg.maxFinanceAmount && (
          <p className="text-[11px] text-[#64748B] mt-2">
            Finance capped at {formatPrice(cfg.maxFinanceAmount)} {t.common.kwd}
          </p>
        )}
      </div>

      {cfg.notes && (
        <p className="text-xs text-[#64748B] leading-relaxed">{cfg.notes}</p>
      )}
    </div>
  );
}

function SellerStrip({
  accent,
  primary,
}: {
  accent: NonNullable<FinanceCalculatorProps["accent"]>;
  primary: string;
}) {
  return (
    <div className="flex items-center gap-2 pb-1">
      {accent.logoUrl && (
        <span
          className="inline-flex items-center justify-center rounded-md bg-white p-1.5 border"
          style={{ borderColor: `${primary}33` }}
        >
          <Image
            src={accent.logoUrl}
            alt={accent.label ?? ""}
            width={64}
            height={20}
            className="h-5 w-auto object-contain"
            unoptimized
          />
        </span>
      )}
      <span
        className="text-[11px] uppercase tracking-wider font-bold"
        style={{ color: primary }}
      >
        {accent.label}
      </span>
    </div>
  );
}
