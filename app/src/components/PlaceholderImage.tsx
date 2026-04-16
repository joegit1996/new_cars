"use client";

import { useState } from "react";

interface PlaceholderImageProps {
  className?: string;
  aspectRatio?: string;
  label?: string;
  bodyType?: string;
  /** Controls the car silhouette size. "sm" = 33%, "md" = 50%, "lg" = 65% of container width */
  silhouetteSize?: "sm" | "md" | "lg";
  /** When provided, renders a real image instead of the SVG silhouette */
  imageUrl?: string;
}

function SedanSilhouette() {
  return (
    <>
      {/* Body */}
      <path
        d="M10 42 L20 42 L25 28 L42 22 L78 22 L95 28 L100 42 L110 42 L110 48 L10 48 Z"
        fill="#94A3B8"
      />
      {/* Windows */}
      <path d="M30 28 L42 24 L55 24 L55 28 Z" fill="#CBD5E1" />
      <path d="M57 24 L78 24 L88 28 L57 28 Z" fill="#CBD5E1" />
      {/* Wheels */}
      <circle cx="32" cy="48" r="7" fill="#64748B" />
      <circle cx="32" cy="48" r="3" fill="#94A3B8" />
      <circle cx="88" cy="48" r="7" fill="#64748B" />
      <circle cx="88" cy="48" r="3" fill="#94A3B8" />
      {/* Headlights */}
      <rect x="100" y="34" width="6" height="4" rx="1" fill="#F59E0B" opacity="0.6" />
      <rect x="14" y="34" width="6" height="4" rx="1" fill="#EF4444" opacity="0.6" />
    </>
  );
}

function SUVSilhouette() {
  return (
    <>
      {/* Body - taller profile */}
      <path
        d="M10 42 L18 42 L22 24 L38 16 L82 16 L96 24 L100 42 L110 42 L110 48 L10 48 Z"
        fill="#94A3B8"
      />
      {/* Windows */}
      <path d="M28 24 L38 18 L55 18 L55 24 Z" fill="#CBD5E1" />
      <path d="M57 18 L82 18 L90 24 L57 24 Z" fill="#CBD5E1" />
      {/* Roof rails */}
      <rect x="36" y="14" width="48" height="2" rx="1" fill="#64748B" />
      {/* Wheels - larger */}
      <circle cx="32" cy="48" r="8" fill="#64748B" />
      <circle cx="32" cy="48" r="4" fill="#94A3B8" />
      <circle cx="88" cy="48" r="8" fill="#64748B" />
      <circle cx="88" cy="48" r="4" fill="#94A3B8" />
      {/* Headlights */}
      <rect x="100" y="32" width="6" height="5" rx="1" fill="#F59E0B" opacity="0.6" />
      <rect x="14" y="32" width="6" height="5" rx="1" fill="#EF4444" opacity="0.6" />
    </>
  );
}

function HatchbackSilhouette() {
  return (
    <>
      {/* Body - shorter rear with steep angle */}
      <path
        d="M10 42 L18 42 L22 30 L15 28 L15 42 L10 42 Z"
        fill="#94A3B8"
      />
      <path
        d="M10 42 L15 42 L15 28 L40 22 L78 22 L95 28 L100 42 L110 42 L110 48 L10 48 Z"
        fill="#94A3B8"
      />
      {/* Windows */}
      <path d="M28 28 L40 24 L55 24 L55 28 Z" fill="#CBD5E1" />
      <path d="M57 24 L78 24 L88 28 L57 28 Z" fill="#CBD5E1" />
      {/* Rear hatch window */}
      <path d="M18 30 L25 28 L26 24 L20 28 Z" fill="#CBD5E1" />
      {/* Wheels */}
      <circle cx="32" cy="48" r="7" fill="#64748B" />
      <circle cx="32" cy="48" r="3" fill="#94A3B8" />
      <circle cx="88" cy="48" r="7" fill="#64748B" />
      <circle cx="88" cy="48" r="3" fill="#94A3B8" />
      {/* Headlights */}
      <rect x="100" y="34" width="6" height="4" rx="1" fill="#F59E0B" opacity="0.6" />
      <rect x="12" y="32" width="4" height="6" rx="1" fill="#EF4444" opacity="0.6" />
    </>
  );
}

function CoupeSilhouette() {
  return (
    <>
      {/* Body - very low, long sloped roofline */}
      <path
        d="M10 44 L20 44 L24 32 L50 24 L85 24 L98 32 L102 44 L110 44 L110 48 L10 48 Z"
        fill="#94A3B8"
      />
      {/* Windows - low and wide */}
      <path d="M34 32 L50 26 L62 26 L62 32 Z" fill="#CBD5E1" />
      <path d="M64 26 L85 26 L92 32 L64 32 Z" fill="#CBD5E1" />
      {/* Wheels */}
      <circle cx="34" cy="48" r="7" fill="#64748B" />
      <circle cx="34" cy="48" r="3" fill="#94A3B8" />
      <circle cx="90" cy="48" r="7" fill="#64748B" />
      <circle cx="90" cy="48" r="3" fill="#94A3B8" />
      {/* Headlights */}
      <rect x="102" y="36" width="5" height="3" rx="1" fill="#F59E0B" opacity="0.6" />
      <rect x="14" y="36" width="5" height="3" rx="1" fill="#EF4444" opacity="0.6" />
    </>
  );
}

function PickupSilhouette() {
  return (
    <>
      {/* Cab */}
      <path
        d="M10 42 L18 42 L22 24 L38 18 L58 18 L62 24 L62 42 L10 42 Z"
        fill="#94A3B8"
      />
      {/* Open bed */}
      <path
        d="M62 42 L62 30 L108 30 L108 42 L110 42 L110 48 L10 48 L10 42 Z"
        fill="#94A3B8"
      />
      {/* Bed interior (open top) */}
      <rect x="64" y="28" width="42" height="2" rx="0" fill="#64748B" />
      {/* Cab windows */}
      <path d="M28 24 L38 20 L55 20 L55 24 Z" fill="#CBD5E1" />
      {/* Wheels - larger for truck */}
      <circle cx="32" cy="48" r="8" fill="#64748B" />
      <circle cx="32" cy="48" r="4" fill="#94A3B8" />
      <circle cx="92" cy="48" r="8" fill="#64748B" />
      <circle cx="92" cy="48" r="4" fill="#94A3B8" />
      {/* Headlights */}
      <rect x="14" y="32" width="5" height="5" rx="1" fill="#EF4444" opacity="0.6" />
      <rect x="108" y="32" width="4" height="5" rx="1" fill="#F59E0B" opacity="0.6" />
    </>
  );
}

function ConvertibleSilhouette() {
  return (
    <>
      {/* Body - no roof, low profile */}
      <path
        d="M10 44 L20 44 L24 34 L40 30 L80 30 L98 34 L102 44 L110 44 L110 48 L10 48 Z"
        fill="#94A3B8"
      />
      {/* Windshield only (no roof) */}
      <path d="M38 30 L42 24 L46 24 L46 30 Z" fill="#CBD5E1" />
      {/* Interior visible where roof would be */}
      <path d="M48 30 L80 30 L80 28 L50 28 Z" fill="#64748B" opacity="0.4" />
      {/* Wheels */}
      <circle cx="34" cy="48" r="7" fill="#64748B" />
      <circle cx="34" cy="48" r="3" fill="#94A3B8" />
      <circle cx="90" cy="48" r="7" fill="#64748B" />
      <circle cx="90" cy="48" r="3" fill="#94A3B8" />
      {/* Headlights */}
      <rect x="102" y="36" width="5" height="3" rx="1" fill="#F59E0B" opacity="0.6" />
      <rect x="14" y="36" width="5" height="3" rx="1" fill="#EF4444" opacity="0.6" />
    </>
  );
}

function VanSilhouette() {
  return (
    <>
      {/* Body - tall box shape */}
      <path
        d="M10 42 L14 42 L14 16 L18 14 L90 14 L98 20 L102 42 L110 42 L110 48 L10 48 Z"
        fill="#94A3B8"
      />
      {/* Windows - tall */}
      <path d="M18 20 L18 16 L40 16 L40 20 Z" fill="#CBD5E1" />
      <path d="M42 16 L62 16 L62 20 L42 20 Z" fill="#CBD5E1" />
      <path d="M64 16 L84 16 L90 20 L64 20 Z" fill="#CBD5E1" />
      {/* Side panel line */}
      <line x1="14" y1="24" x2="98" y2="24" stroke="#64748B" strokeWidth="0.5" opacity="0.5" />
      {/* Wheels */}
      <circle cx="30" cy="48" r="7" fill="#64748B" />
      <circle cx="30" cy="48" r="3" fill="#94A3B8" />
      <circle cx="90" cy="48" r="7" fill="#64748B" />
      <circle cx="90" cy="48" r="3" fill="#94A3B8" />
      {/* Headlights */}
      <rect x="100" y="30" width="5" height="6" rx="1" fill="#F59E0B" opacity="0.6" />
      <rect x="10" y="30" width="4" height="6" rx="1" fill="#EF4444" opacity="0.6" />
    </>
  );
}

export const silhouetteMap: Record<string, () => React.JSX.Element> = {
  Sedan: SedanSilhouette,
  SUV: SUVSilhouette,
  Hatchback: HatchbackSilhouette,
  Coupe: CoupeSilhouette,
  Pickup: PickupSilhouette,
  Convertible: ConvertibleSilhouette,
  Van: VanSilhouette,
};

const sizeClasses = {
  sm: "w-1/3",
  md: "w-1/2",
  lg: "w-2/3",
} as const;

const PLACEHOLDER_PATH = "/images/placeholder-car.svg";

export default function PlaceholderImage({
  className = "",
  aspectRatio = "16/9",
  label,
  bodyType,
  silhouetteSize = "sm",
  imageUrl,
}: PlaceholderImageProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const hasRealImage = imageUrl && imageUrl !== PLACEHOLDER_PATH && !imgError;
  const SilhouetteComponent = silhouetteMap[bodyType ?? "Sedan"] ?? SedanSilhouette;

  return (
    <div
      className={`relative flex items-center justify-center bg-[#E2E8F0] overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      {hasRealImage ? (
        <>
          {/* SVG fallback shown while image loads */}
          {!imgLoaded && (
            <svg
              viewBox="0 0 120 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${sizeClasses[silhouetteSize]} h-auto opacity-30 absolute`}
            >
              <SilhouetteComponent />
            </svg>
          )}
          <img
            ref={(el) => {
              if (el && el.complete && el.naturalWidth > 0 && !imgLoaded) {
                setImgLoaded(true);
              }
            }}
            src={imageUrl}
            alt={label || "Car"}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        </>
      ) : (
        <svg
          viewBox="0 0 120 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses[silhouetteSize]} h-auto opacity-30`}
        >
          <SilhouetteComponent />
        </svg>
      )}
    </div>
  );
}
