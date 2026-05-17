// API Mappers -- transform API (snake_case) responses into existing frontend types.
// This lets pages remain unchanged regardless of data source.

import type {
  ApiBrand,
  ApiBrandEditorialResponse,
  ApiHomeResponse,
  ApiHomeModelCard,
  ApiHomeBrandCard,
  ApiHomeCollectionCard,
  ApiModel,
  ApiModelAggregateSpecs,
  ApiTrim,
  ApiTrimVariant,
  ApiEquipmentItem,
  ApiSearchResult,
  ApiSearchItem,
  ApiSearchSuggestion,
} from "./api-types";

import type {
  Brand,
  BrandEditorial,
  BrandHeroMedia,
  BrandStat,
  BrandServiceLink,
  Model,
  ModelSpecsSummary,
  Trim,
  TrimVariant,
  Spec,
  Equipment,
  LifestyleCollection,
  SearchEntry,
  ModelAggregateSpecs,
  MinMax,
} from "./types";

import {
  BodyType,
  FuelType,
  TransmissionType,
  DriveType,
  SpecRegion,
  EquipmentCategory,
} from "./types";

// ---------------------------------------------------------------------------
// Enum mapping helpers
// ---------------------------------------------------------------------------

const bodyTypeMap: Record<string, BodyType> = {
  sedan: BodyType.Sedan,
  suv: BodyType.SUV,
  hatchback: BodyType.Hatchback,
  coupe: BodyType.Coupe,
  pickup: BodyType.Pickup,
  van: BodyType.Van,
  convertible: BodyType.Convertible,
};

function toBodyType(code: string): BodyType {
  return bodyTypeMap[code?.toLowerCase()] ?? BodyType.Sedan;
}

const fuelTypeMap: Record<string, FuelType> = {
  petrol: FuelType.Petrol,
  gasoline: FuelType.Petrol,
  diesel: FuelType.Diesel,
  hybrid: FuelType.Hybrid,
  phev: FuelType.PHEV,
  electric: FuelType.Electric,
  ev: FuelType.Electric,
};

function toFuelType(s: string): FuelType {
  return fuelTypeMap[s?.toLowerCase()] ?? FuelType.Petrol;
}

function toFuelTypes(arr: string[]): FuelType[] {
  return arr?.map(toFuelType) ?? [];
}

const transmissionMap: Record<string, TransmissionType> = {
  automatic: TransmissionType.Automatic,
  manual: TransmissionType.Manual,
  cvt: TransmissionType.CVT,
};

function toTransmission(s: string): TransmissionType {
  return transmissionMap[s?.toLowerCase()] ?? TransmissionType.Automatic;
}

const driveTypeMap: Record<string, DriveType> = {
  fwd: DriveType.FWD,
  rwd: DriveType.RWD,
  awd: DriveType.AWD,
  "4wd": DriveType.FourWD,
};

function toDriveType(s: string): DriveType {
  return driveTypeMap[s?.toLowerCase()] ?? DriveType.RWD;
}

const specRegionMap: Record<string, SpecRegion> = {
  gcc: SpecRegion.GCC,
  us: SpecRegion.US,
  european: SpecRegion.European,
};

function toSpecRegion(s: string): SpecRegion {
  return specRegionMap[s?.toLowerCase()] ?? SpecRegion.GCC;
}

const equipCategoryMap: Record<string, EquipmentCategory> = {
  safety: EquipmentCategory.Safety,
  comfort: EquipmentCategory.Comfort,
  technology: EquipmentCategory.Technology,
  exterior: EquipmentCategory.Exterior,
  interior: EquipmentCategory.Interior,
};

function toEquipCategory(s: string): EquipmentCategory {
  return equipCategoryMap[s?.toLowerCase()] ?? EquipmentCategory.Technology;
}

// ---------------------------------------------------------------------------
// Brand mappers
// ---------------------------------------------------------------------------

export function mapApiBrandToBrand(b: ApiBrand): Brand {
  const editorial: BrandEditorial | undefined = b.editorial
    ? {
        heroGradient: b.editorial.hero_gradient || b.hero_gradient || "",
        story: b.editorial.story_en || b.story_en || "",
        heritage: {
          title: b.editorial.heritage?.title_en || b.heritage_title_en || "",
          description: b.editorial.heritage?.description_en || b.heritage_description_en || "",
          founded: b.editorial.heritage?.founded || b.heritage_founded || "",
          milestone: b.editorial.heritage?.milestone_en || b.heritage_milestone_en || "",
        },
        stats: parseStats(b.editorial.stats || b.editorial_stats),
        innovationTitle: b.editorial.innovation?.title_en || b.innovation_title_en || "",
        innovationDescription: b.editorial.innovation?.description_en || b.innovation_description_en || "",
        sustainability: b.editorial.sustainability_en || b.sustainability_en || undefined,
        serviceLinks: parseServiceLinks(b.editorial.service_links || b.service_links),
      }
    : undefined;

  const heroMedia: BrandHeroMedia | undefined =
    b.hero_media?.url || b.hero_media_url
      ? {
          type: (b.hero_media?.type || b.hero_media_type || "image") as "video" | "image",
          url: b.hero_media?.url || b.hero_media_url || "",
        }
      : undefined;

  return {
    id: String(b.id),
    slug: b.slug || undefined,
    name: b.name_en,
    logoUrl: b.logo_url || "",
    modelCount: b.model_count ?? 0,
    featured: b.is_featured ?? false,
    tagline: b.tagline_en || undefined,
    editorial,
    heroMedia,
    editorialImages: b.editorial_images
      ? {
          heritage: b.editorial_images.heritage || undefined,
          innovation: b.editorial_images.innovation || undefined,
        }
      : undefined,
  };
}

function parseStats(raw: unknown): BrandStat[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((s: Record<string, string>) => ({
      label: s.label || s.label_en || "",
      value: s.value || "",
    }));
  }
  // If object-shaped: { "Founded": "1886", ... }
  if (typeof raw === "object") {
    return Object.entries(raw as Record<string, string>).map(([label, value]) => ({
      label,
      value: String(value),
    }));
  }
  return [];
}

function parseServiceLinks(raw: unknown): BrandServiceLink[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((s: Record<string, string>) => ({
      title: s.title || s.title_en || "",
      description: s.description || s.description_en || "",
      icon: s.icon || "car",
      href: s.href || s.url || "#",
    }));
  }
  return [];
}

export function mapApiBrandEditorialResponse(
  resp: ApiBrandEditorialResponse,
  existingBrand: Brand
): Brand {
  const editorial: BrandEditorial = {
    heroGradient: resp.editorial?.hero_gradient || "",
    story: resp.editorial?.story_en || "",
    heritage: {
      title: resp.editorial?.heritage?.title_en || "",
      description: resp.editorial?.heritage?.description_en || "",
      founded: resp.editorial?.heritage?.founded || "",
      milestone: resp.editorial?.heritage?.milestone_en || "",
    },
    stats: parseStats(resp.editorial?.stats),
    innovationTitle: resp.editorial?.innovation?.title_en || "",
    innovationDescription: resp.editorial?.innovation?.description_en || "",
    sustainability: resp.editorial?.sustainability_en || undefined,
    serviceLinks: parseServiceLinks(resp.editorial?.service_links),
  };

  return {
    ...existingBrand,
    editorial,
    heroMedia: resp.hero_media?.url
      ? { type: (resp.hero_media.type || "image") as "video" | "image", url: resp.hero_media.url }
      : existingBrand.heroMedia,
    editorialImages: resp.editorial_images
      ? {
          heritage: resp.editorial_images.heritage || undefined,
          innovation: resp.editorial_images.innovation || undefined,
        }
      : existingBrand.editorialImages,
  };
}

// ---------------------------------------------------------------------------
// Model mappers
// ---------------------------------------------------------------------------

// Resolve image URL: some records store the URL in hero_image_key when hero_image_url is empty
function resolveImageUrl(url?: string, key?: string): string {
  if (url) return url;
  if (key && (key.startsWith("http://") || key.startsWith("https://") || key.startsWith("/"))) return key;
  return "";
}

export function mapApiModelToModel(m: ApiModel, brandIdStr?: string): Model {
  const specsSummary: ModelSpecsSummary = {
    engineRange: m.specs_summary?.engine_range || "",
    hpRange: m.specs_summary?.hp_range || "",
    fuelTypes: toFuelTypes(m.specs_summary?.fuel_types || []),
  };

  return {
    id: String(m.id),
    slug: m.slug || undefined,
    brandId: brandIdStr || String(m.brand_id),
    name: m.name_en,
    bodyType: toBodyType(m.body_style_code),
    year: m.model_year,
    startingPrice: m.starting_price ?? 0,
    trimCount: m.trim_count ?? 0,
    isNew: m.is_new ?? false,
    isUpdated: m.is_updated ?? false,
    featured: m.is_featured ?? false,
    specsSummary,
    imageUrl: resolveImageUrl(m.hero_image_url, m.hero_image_key) || m.images?.hero || "",
    images: m.images
      ? {
          front: m.images.front || undefined,
          rear: m.images.rear || undefined,
          side: m.images.side || undefined,
          detail: m.images.detail || undefined,
          hero: m.images.hero || undefined,
        }
      : undefined,
    segmentOrder: m.segment_order,
    modelFamily: m.family_code || undefined,
  };
}

export function mapSearchItemToModel(item: ApiSearchItem): Model {
  return {
    id: String(item.id),
    slug: item.slug || undefined,
    brandId: String(item.brand?.id ?? 0),
    name: item.name_en,
    bodyType: toBodyType(item.body_style_code),
    year: item.model_year ?? 0,
    startingPrice: item.min_price ?? item.price ?? 0,
    trimCount: item.trim_count ?? 0,
    isNew: item.is_new ?? false,
    isUpdated: item.is_updated ?? false,
    featured: item.is_featured ?? false,
    specsSummary: {
      engineRange: item.specs_summary?.engine_range || "",
      hpRange: item.specs_summary?.hp_range || "",
      fuelTypes: toFuelTypes(item.specs_summary?.fuel_types || []),
    },
    imageUrl: resolveImageUrl(item.hero_image_url, item.hero_image_key),
    segmentOrder: item.segment_order,
    modelFamily: item.family_code || undefined,
  };
}

export function mapHomeModelCardToModel(c: ApiHomeModelCard): Model {
  return {
    id: String(c.id),
    slug: c.slug || undefined,
    brandId: String(c.brand_id),
    name: c.name_en,
    bodyType: toBodyType(c.body_style_code),
    year: c.model_year,
    startingPrice: c.starting_price ?? 0,
    trimCount: c.trim_count ?? 0,
    isNew: c.is_new ?? false,
    isUpdated: c.is_updated ?? false,
    featured: c.is_featured ?? false,
    specsSummary: {
      engineRange: c.specs_summary?.engine_range || "",
      hpRange: c.specs_summary?.hp_range || "",
      fuelTypes: toFuelTypes(c.specs_summary?.fuel_types || []),
    },
    imageUrl: c.hero_image_url || "",
    segmentOrder: c.segment_order ?? 0,
    modelFamily: c.family_code || undefined,
  };
}

export function mapHomeBrandCardToBrand(c: ApiHomeBrandCard): Brand {
  return {
    id: String(c.id),
    name: c.name_en,
    logoUrl: c.logo_url || "",
    modelCount: c.model_count ?? 0,
    featured: c.is_featured ?? false,
    tagline: c.tagline_en || undefined,
  };
}

export function mapHomeCollectionToLifestyle(c: ApiHomeCollectionCard): LifestyleCollection {
  return {
    id: String(c.id),
    title: c.title_en,
    description: c.description_en,
    imageUrl: c.image_url || "",
    modelIds: c.model_ids?.map(String) ?? [],
  };
}

// ---------------------------------------------------------------------------
// Trim mappers
// ---------------------------------------------------------------------------

export function mapApiTrimToTrim(t: ApiTrim): Trim {
  const specs: Spec = {
    engineType: t.specs?.engine_type || t.engine_summary || "",
    displacement: t.specs?.displacement ?? 0,
    cylinders: t.specs?.cylinders ?? 0,
    horsepower: t.horsepower ?? 0,
    torque: t.torque ?? 0,
    zeroToHundred: t.specs?.zero_to_hundred ?? 0,
    topSpeed: t.specs?.top_speed ?? 0,
    fuelEconomyCity: t.specs?.fuel_economy_city ?? 0,
    fuelEconomyHighway: t.specs?.fuel_economy_highway ?? 0,
    fuelEconomyCombined: t.specs?.fuel_economy_combined ?? 0,
    transmission: toTransmission(t.transmission || t.specs?.transmission || ""),
    driveType: toDriveType(t.drivetrain || t.specs?.drive_type || ""),
    lengthMm: t.specs?.length_mm ?? 0,
    widthMm: t.specs?.width_mm ?? 0,
    heightMm: t.specs?.height_mm ?? 0,
    wheelbaseMm: t.specs?.wheelbase_mm ?? 0,
    trunkVolumeLiters: t.specs?.trunk_volume_liters ?? 0,
    curbWeightKg: t.specs?.curb_weight_kg ?? 0,
    fuelTankLiters: t.specs?.fuel_tank_liters ?? 0,
    seatingCapacity: t.specs?.seating_capacity ?? t.seats ?? 5,
    warranty: t.specs?.warranty || "",
    specRegion: toSpecRegion(t.spec_region || t.specs?.spec_region || ""),
  };

  const variants: TrimVariant[] = []; // Populated separately via fetchTrimVariants

  return {
    id: String(t.id),
    modelId: String(t.product_line_id),
    name: t.display_name_en,
    price: t.starting_price ?? 0,
    engineSummary: t.engine_summary || "",
    horsepower: t.horsepower ?? 0,
    torque: t.torque ?? 0,
    fuelType: toFuelType(t.fuel_type || ""),
    images: t.images?.map((img) => img.image_url).filter(Boolean) ?? [],
    variants,
    specs,
    equipment: [], // Populated separately via fetchTrimEquipment
    leadFormUrl: t.lead_form_url || undefined,
    websiteUrl: t.website_url || undefined,
  };
}

export function mapApiTrimVariant(v: ApiTrimVariant): TrimVariant {
  return {
    id: String(v.id),
    trimId: String(v.trim_id),
    name: v.name_en,
    price: v.price ?? 0,
    description: v.description_en || "",
    images: v.images ?? undefined,
  };
}

export function mapApiEquipmentItem(e: ApiEquipmentItem): Equipment {
  return {
    name: e.name_en,
    category: toEquipCategory(e.category),
    isStandard: e.is_standard ?? false,
  };
}

// ---------------------------------------------------------------------------
// Aggregate specs mapper
// ---------------------------------------------------------------------------

export function mapApiAggregateSpecs(a: ApiModelAggregateSpecs): ModelAggregateSpecs {
  const mm = (r: { min: number; max: number } | undefined): MinMax =>
    r ? { min: r.min, max: r.max } : { min: 0, max: 0 };

  return {
    priceRange: mm(a.price_range),
    hpRange: mm(a.hp_range),
    torqueRange: mm(a.torque_range),
    fuelTypes: toFuelTypes(a.fuel_types || []),
    transmissions: (a.transmissions || []).map(toTransmission),
    driveTypes: (a.drive_types || []).map(toDriveType),
    seatingRange: mm(a.seating_range),
    displacementRange: mm(a.displacement_range),
    dimensionRanges: {
      length: mm(a.dimension_ranges?.length),
      width: mm(a.dimension_ranges?.width),
      height: mm(a.dimension_ranges?.height),
      wheelbase: mm(a.dimension_ranges?.wheelbase),
    },
    equipmentMap: (a.equipment_map as Record<string, "standard" | "some" | "none">) ?? {},
    trimCount: a.trim_count ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Search mappers
// ---------------------------------------------------------------------------

export function mapSearchItemToSearchEntry(item: ApiSearchItem): SearchEntry {
  return {
    modelId: String(item.model?.id ?? item.id),
    trimId: item.type === "trim" ? String(item.id) : "",
    brandId: String(item.brand?.id ?? 0),
    brandName: item.brand?.name_en ?? "",
    modelName: item.type === "model" ? item.name_en : (item.model?.name_en ?? ""),
    trimName: item.type === "trim" ? item.name_en : "",
    price: item.price ?? item.min_price ?? 0,
    imageUrl: item.hero_image_url ?? "",
    bodyType: item.body_style_code ?? "",
    searchText: "", // Not needed for API results
  };
}

export function mapSuggestionToSearchEntry(s: ApiSearchSuggestion): SearchEntry {
  return {
    modelId: s.type === "model" ? String(s.id) : "",
    trimId: s.type === "trim" ? String(s.id) : "",
    brandId: s.type === "brand" ? String(s.id) : "",
    brandName: s.subtitle || "",
    modelName: s.text,
    trimName: s.type === "trim" ? s.text : "",
    price: 0,
    imageUrl: "",
    bodyType: "",
    searchText: s.text.toLowerCase(),
  };
}
