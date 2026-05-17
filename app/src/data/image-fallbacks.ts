// Local image fallbacks for API data that lacks image URLs.
// Maps brand slugs to local logo paths, and brand+model patterns to local car images.

export const LOCAL_BRAND_LOGOS: Record<string, string> = {
  "mercedes-benz": "/images/brands/mercedes.png",
  bmw: "/images/brands/bmw.png",
  toyota: "/images/brands/toyota.png",
  lexus: "/images/brands/lexus.png",
  porsche: "/images/brands/porsche.png",
  changan: "/images/brands/changan.png",
  haval: "/images/brands/haval.png",
  mg: "/images/brands/mg.png",
};

// Pattern: [brandSlug, modelNameKeyword] → local image path
const MODEL_IMAGE_MAP: [string, string, string][] = [
  // Mercedes-Benz
  ["mercedes-benz", "a-class", "/images/cars/merc-a200-front.jpg"],
  ["mercedes-benz", "cla", "/images/cars/merc-a250-front.jpg"],
  ["mercedes-benz", "c-class", "/images/cars/merc-c200-front.jpg"],
  ["mercedes-benz", "e-class", "/images/cars/merc-e200-front.jpg"],
  ["mercedes-benz", "s-class", "/images/cars/merc-e300-front.jpg"],
  ["mercedes-benz", "glc", "/images/cars/merc-glc200-front.jpg"],
  ["mercedes-benz", "gla", "/images/cars/merc-glc200-front.jpg"],
  ["mercedes-benz", "glb", "/images/cars/merc-glc300-front.jpg"],
  ["mercedes-benz", "gle", "/images/cars/merc-gle450-front.jpg"],
  ["mercedes-benz", "gls", "/images/cars/merc-gle53-front.jpg"],
  ["mercedes-benz", "g-class", "/images/cars/merc-gle53-front.jpg"],
  ["mercedes-benz", "amg gt", "/images/cars/merc-c43-front.jpg"],
  ["mercedes-benz", "amg sl", "/images/cars/merc-c300-front.jpg"],
  ["mercedes-benz", "maybach", "/images/cars/merc-e300-front.jpg"],
  // BMW
  ["bmw", "3 series", "/images/cars/bmw-3-series-front.jpg"],
  ["bmw", "2 series", "/images/cars/bmw-3-series-front.jpg"],
  ["bmw", "4 series", "/images/cars/bmw-4-coupe-front.jpg"],
  ["bmw", "5 series", "/images/cars/bmw-5-series-front.jpg"],
  ["bmw", "7 series", "/images/cars/bmw-5-series-front.jpg"],
  ["bmw", "x1", "/images/cars/bmw-x3-front.jpg"],
  ["bmw", "x2", "/images/cars/bmw-x3-front.jpg"],
  ["bmw", "x3", "/images/cars/bmw-x3-front.jpg"],
  ["bmw", "x4", "/images/cars/bmw-x3-front.jpg"],
  ["bmw", "x5", "/images/cars/bmw-x5-front.jpg"],
  ["bmw", "x6", "/images/cars/bmw-x5-front.jpg"],
  ["bmw", "x7", "/images/cars/bmw-x5-front.jpg"],
  ["bmw", "m2", "/images/cars/bmw-4-coupe-front.jpg"],
  ["bmw", "m3", "/images/cars/bmw-3-series-front.jpg"],
  ["bmw", "m4", "/images/cars/bmw-4-coupe-front.jpg"],
  ["bmw", "m5", "/images/cars/bmw-5-series-front.jpg"],
  // Toyota
  ["toyota", "camry", "/images/cars/toyota-camry-front.jpg"],
  ["toyota", "corolla", "/images/cars/toyota-corolla-front.jpg"],
  ["toyota", "rav4", "/images/cars/toyota-rav4-front.jpg"],
  ["toyota", "land cruiser", "/images/cars/toyota-lc-front.jpg"],
  ["toyota", "prado", "/images/cars/toyota-lc-front.jpg"],
  ["toyota", "hilux", "/images/cars/toyota-hilux-front.jpg"],
  ["toyota", "fortuner", "/images/cars/toyota-rav4-front.jpg"],
  ["toyota", "yaris", "/images/cars/toyota-corolla-front.jpg"],
  // Lexus
  ["lexus", "es", "/images/cars/lexus-es-front.jpg"],
  ["lexus", "is", "/images/cars/lexus-is-front.jpg"],
  ["lexus", "ls", "/images/cars/lexus-es-front.jpg"],
  ["lexus", "nx", "/images/cars/lexus-nx-front.jpg"],
  ["lexus", "rx", "/images/cars/lexus-rx-front.jpg"],
  ["lexus", "lx", "/images/cars/lexus-rx-front.jpg"],
  // Porsche
  ["porsche", "911", "/images/cars/porsche-911-front.jpg"],
  ["porsche", "cayenne", "/images/cars/porsche-cayenne-front.jpg"],
  ["porsche", "macan", "/images/cars/porsche-macan-front.jpg"],
  ["porsche", "taycan", "/images/cars/porsche-taycan-front.jpg"],
  // Changan
  ["changan", "alsvin", "/images/cars/changan-alsvin-front.jpg"],
  ["changan", "cs55", "/images/cars/changan-cs55-front.jpg"],
  ["changan", "cs75", "/images/cars/changan-cs75-front.jpg"],
  ["changan", "uni", "/images/cars/changan-unit-front.jpg"],
  // Haval
  ["haval", "dargo", "/images/cars/haval-dargo-front.jpg"],
  ["haval", "h6", "/images/cars/haval-h6-front.jpg"],
  ["haval", "jolion", "/images/cars/haval-jolion-front.jpg"],
  // MG
  ["mg", "mg4", "/images/cars/mg-4-front.jpg"],
  ["mg", "mg 4", "/images/cars/mg-4-front.jpg"],
  ["mg", "mg5", "/images/cars/mg-5-front.jpg"],
  ["mg", "mg 5", "/images/cars/mg-5-front.jpg"],
  ["mg", "hs", "/images/cars/mg-hs-front.jpg"],
  ["mg", "zs", "/images/cars/mg-zs-front.jpg"],
];

export function resolveModelImageFallback(
  brandSlug: string | undefined,
  modelName: string
): string {
  if (!brandSlug) return "";
  const slug = brandSlug.toLowerCase();
  const name = modelName.toLowerCase();
  for (const [bs, keyword, path] of MODEL_IMAGE_MAP) {
    if (slug === bs && name.includes(keyword)) return path;
  }
  return "";
}

// Domains known to return 403/404 for our data
const BROKEN_DOMAINS = [
  "staging-media.q84sale.com",
  "toyota-cms-media.s3.amazonaws.com",
];

export function isKnownBrokenUrl(url: string): boolean {
  return BROKEN_DOMAINS.some((d) => url.includes(d));
}

// Local hero media (video/image) for brand showcase pages
const LOCAL_BRAND_HERO_MEDIA: Record<string, { type: "video" | "image"; url: string }> = {
  "mercedes-benz": { type: "video", url: "/videos/merc-hero.mp4" },
  bmw: { type: "video", url: "/videos/bmw-hero.mp4" },
  porsche: { type: "video", url: "/videos/porsche-hero.mp4" },
  lexus: { type: "video", url: "/videos/lexus-hero.mp4" },
  toyota: { type: "image", url: "/images/brands/editorial/toyota-hero.jpg" },
  changan: { type: "image", url: "/images/brands/editorial/changan-hero.jpg" },
  haval: { type: "image", url: "/images/brands/editorial/haval-hero.jpg" },
  mg: { type: "image", url: "/images/brands/editorial/mg-hero.jpg" },
};

export function resolveBrandHeroMediaFallback(
  slug: string | undefined,
  current: { type: "video" | "image"; url: string } | undefined
): { type: "video" | "image"; url: string } | undefined {
  if (current?.url && !isKnownBrokenUrl(current.url)) return current;
  if (slug && LOCAL_BRAND_HERO_MEDIA[slug]) return LOCAL_BRAND_HERO_MEDIA[slug];
  return current;
}

// Local editorial images for brand showcase pages
const LOCAL_BRAND_EDITORIAL_IMAGES: Record<string, { heritage?: string; innovation?: string }> = {
  "mercedes-benz": { heritage: "/images/brands/editorial/mercedes-heritage.jpg", innovation: "/images/brands/editorial/mercedes-innovation.jpg" },
  bmw: { heritage: "/images/brands/editorial/bmw-heritage.jpg", innovation: "/images/brands/editorial/bmw-innovation.jpg" },
  porsche: { heritage: "/images/brands/editorial/porsche-heritage.jpg", innovation: "/images/brands/editorial/porsche-innovation.jpg" },
  lexus: { heritage: "/images/brands/editorial/lexus-heritage.jpg", innovation: "/images/brands/editorial/lexus-innovation.jpg" },
  toyota: { heritage: "/images/brands/editorial/toyota-heritage.jpg", innovation: "/images/brands/editorial/toyota-innovation.jpg" },
  changan: { heritage: "/images/brands/editorial/changan-heritage.jpg", innovation: "/images/brands/editorial/changan-innovation.jpg" },
  haval: { heritage: "/images/brands/editorial/haval-heritage.jpg", innovation: "/images/brands/editorial/haval-innovation.jpg" },
  mg: { heritage: "/images/brands/editorial/mg-heritage.jpg", innovation: "/images/brands/editorial/mg-innovation.jpg" },
};

export function resolveBrandEditorialImagesFallback(
  slug: string | undefined,
  current: { heritage?: string; innovation?: string } | undefined
): { heritage?: string; innovation?: string } | undefined {
  const fallback = slug ? LOCAL_BRAND_EDITORIAL_IMAGES[slug] : undefined;
  if (!fallback) return current;
  return {
    heritage: (current?.heritage && !isKnownBrokenUrl(current.heritage)) ? current.heritage : fallback.heritage,
    innovation: (current?.innovation && !isKnownBrokenUrl(current.innovation)) ? current.innovation : fallback.innovation,
  };
}

export function resolveBrandLogoFallback(
  slug: string | undefined,
  currentUrl: string
): string {
  // If the current URL works (external CDNs like pngimg.com), keep it
  if (currentUrl && !isKnownBrokenUrl(currentUrl)) {
    return currentUrl;
  }
  // Fall back to local asset if available
  if (slug && LOCAL_BRAND_LOGOS[slug]) {
    return LOCAL_BRAND_LOGOS[slug];
  }
  return currentUrl;
}
