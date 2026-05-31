"use client";

// Web-sourced car body-type icons from Iconify (Material Design Icons set).
// Single MDI icon family gives uniform stroke weight, perspective, and proportions
// across every type. The CSS-mask technique lets the icon take its color from the
// surrounding text (so `text-secondary`, `text-blue-600`, etc. still drive the fill).

const ICON_BASE = "https://api.iconify.design/mdi";

const bodyTypeIconNames: Record<string, string> = {
  Sedan: "car",
  SUV: "car-suv",
  Hatchback: "car-hatchback",
  Coupe: "car-sports",
  Convertible: "car-convertible",
  Pickup: "car-pickup",
  Van: "van-utility",
};

function maskStyle(name: string): React.CSSProperties {
  const url = `${ICON_BASE}/${name}.svg`;
  return {
    backgroundColor: "currentColor",
    WebkitMaskImage: `url(${url})`,
    maskImage: `url(${url})`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    display: "inline-block",
  };
}

export function BodyTypeIcon({ type, className }: { type: string; className?: string }) {
  const name = bodyTypeIconNames[type] || bodyTypeIconNames.Sedan;
  return (
    <span
      aria-hidden
      className={className || "w-16 h-8 text-secondary"}
      style={maskStyle(name)}
    />
  );
}
