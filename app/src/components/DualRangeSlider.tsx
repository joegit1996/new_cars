"use client";

import { useCallback, useMemo, useRef } from "react";

export interface DualRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  minGap?: number;
  /** Track + fill color theme. `dark` is for dark backgrounds. */
  variant?: "light" | "dark";
  /** RTL flips the active fill so it visually connects the two thumbs. */
  dir?: "ltr" | "rtl";
  className?: string;
}

/**
 * A dual-thumb range slider that works correctly in both LTR and RTL contexts.
 * Two `<input type="range">` elements overlay each other; the visible track
 * and fill are pure divs positioned via percentages (mirrored under RTL).
 */
export default function DualRangeSlider({
  min,
  max,
  value,
  onChange,
  step = 500,
  minGap = 0,
  variant = "light",
  dir = "ltr",
  className,
}: DualRangeSliderProps) {
  const [lo, hi] = value;
  const range = Math.max(1, max - min);
  const loPct = ((lo - min) / range) * 100;
  const hiPct = ((hi - min) / range) * 100;
  const isRTL = dir === "rtl";

  // Stable handlers
  const onLoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value);
      if (!Number.isFinite(v)) return;
      if (v <= hi - minGap) onChange([v, hi]);
    },
    [hi, minGap, onChange],
  );
  const onHiChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value);
      if (!Number.isFinite(v)) return;
      if (v >= lo + minGap) onChange([lo, v]);
    },
    [lo, minGap, onChange],
  );

  const trackBg =
    variant === "dark" ? "bg-white/15" : "bg-[#E2E8F0]";
  const fillBg = "bg-[#1A56DB]";
  const thumbStyles = useMemo(
    () =>
      [
        "appearance-none bg-transparent pointer-events-none",
        // WebKit thumb
        "[&::-webkit-slider-thumb]:appearance-none",
        "[&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5",
        "[&::-webkit-slider-thumb]:rounded-full",
        "[&::-webkit-slider-thumb]:bg-white",
        "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#1A56DB]",
        "[&::-webkit-slider-thumb]:cursor-pointer",
        "[&::-webkit-slider-thumb]:shadow-md",
        "[&::-webkit-slider-thumb]:pointer-events-auto",
        // Firefox thumb
        "[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5",
        "[&::-moz-range-thumb]:rounded-full",
        "[&::-moz-range-thumb]:bg-white",
        "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#1A56DB]",
        "[&::-moz-range-thumb]:cursor-pointer",
        "[&::-moz-range-thumb]:shadow-md",
        "[&::-moz-range-thumb]:pointer-events-auto",
        // Hide track outline
        "[&::-webkit-slider-runnable-track]:bg-transparent",
        "[&::-moz-range-track]:bg-transparent",
      ].join(" "),
    [],
  );

  // Layer order: the thumb closer to its end of the track stays on top so it
  // can still be grabbed when both thumbs collide.
  const loOnTop = loPct > 100 - hiPct;

  // For LTR the active fill spans from loPct to hiPct using left/right.
  // For RTL we mirror via right/left so it visually connects the thumbs.
  const fillStyle = isRTL
    ? { right: `${loPct}%`, left: `${100 - hiPct}%` }
    : { left: `${loPct}%`, right: `${100 - hiPct}%` };

  // The native range input mirrors in RTL only if we set `dir` on it.
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`relative h-6 flex items-center ${className ?? ""}`}>
      <div
        ref={trackRef}
        className={`absolute inset-x-0 h-1.5 ${trackBg} rounded-full`}
      />
      <div
        className={`absolute h-1.5 ${fillBg} rounded-full`}
        style={fillStyle}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={lo}
        dir={dir}
        onChange={onLoChange}
        aria-label="Minimum"
        className={`absolute inset-x-0 w-full h-6 ${thumbStyles}`}
        style={{ zIndex: loOnTop ? 4 : 3 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={hi}
        dir={dir}
        onChange={onHiChange}
        aria-label="Maximum"
        className={`absolute inset-x-0 w-full h-6 ${thumbStyles}`}
        style={{ zIndex: loOnTop ? 3 : 4 }}
      />
    </div>
  );
}
