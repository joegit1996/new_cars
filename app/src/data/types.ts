// 4Sale New Cars -- TypeScript Types
// All interfaces and enums for the platform

export enum BodyType {
  Sedan = "Sedan",
  SUV = "SUV",
  Hatchback = "Hatchback",
  Coupe = "Coupe",
  Pickup = "Pickup",
  Van = "Van",
  Convertible = "Convertible",
}

export enum FuelType {
  Petrol = "Petrol",
  Diesel = "Diesel",
  Hybrid = "Hybrid",
  PHEV = "PHEV",
  Electric = "Electric",
}

export enum TransmissionType {
  Automatic = "Automatic",
  Manual = "Manual",
  CVT = "CVT",
}

export enum DriveType {
  FWD = "FWD",
  RWD = "RWD",
  AWD = "AWD",
  FourWD = "4WD",
}

export enum SpecRegion {
  GCC = "GCC",
  US = "US",
  European = "European",
}

export enum EquipmentCategory {
  Safety = "Safety",
  Comfort = "Comfort",
  Technology = "Technology",
  Exterior = "Exterior",
  Interior = "Interior",
}

export interface BrandStat {
  label: string;
  value: string;
}

export interface BrandServiceLink {
  title: string;
  description: string;
  icon: string;
  href: string;
}

export interface BrandEditorial {
  heroGradient: string;
  story: string;
  heritage: {
    title: string;
    description: string;
    founded: string;
    milestone: string;
  };
  stats: BrandStat[];
  innovationTitle: string;
  innovationDescription: string;
  sustainability?: string;
  serviceLinks: BrandServiceLink[];
}

export interface HeroMedia {
  type: "video" | "image";
  url: string;
}

export type BrandHeroMedia = HeroMedia;

export interface Brand {
  id: string;
  slug?: string;
  name: string;
  logoUrl: string;
  modelCount: number;
  featured?: boolean;
  tagline?: string;
  editorial?: BrandEditorial;
  heroMedia?: BrandHeroMedia;
  editorialImages?: {
    heritage?: string;
    innovation?: string;
  };
  /** Optional override for the home-page Featured Brands card image. Defaults to the brand's first model's imageUrl. */
  featuredImageUrl?: string;
}

export interface Model {
  id: string;
  slug?: string;
  brandId: string;
  name: string;
  bodyType: BodyType;
  year: number;
  startingPrice: number;
  /** True when the dealer lists this model as "Price upon request"; startingPrice is unreliable for sort/display. */
  priceOnRequest?: boolean;
  trimCount: number;
  isNew: boolean;
  isUpdated: boolean;
  featured: boolean;
  specsSummary: ModelSpecsSummary;
  imageUrl: string;
  images?: {
    front?: string;
    rear?: string;
    side?: string;
    detail?: string;
    hero?: string;
  };
  segmentOrder?: number;
  modelFamily?: string;
  /** Optional per-model hero video/image. When set, the model detail page uses this instead of the brand's heroMedia. */
  heroMedia?: HeroMedia;
}

export interface ModelSpecsSummary {
  engineRange: string;
  hpRange: string;
  fuelTypes: FuelType[];
}

export interface Trim {
  id: string;
  modelId: string;
  name: string;
  price: number;
  /** True when this trim is sold "Price upon request"; price is a placeholder and should display as such. */
  priceOnRequest?: boolean;
  engineSummary: string;
  horsepower: number;
  torque: number;
  fuelType: FuelType;
  images: string[];
  variants: TrimVariant[];
  specs: Spec;
  equipment: Equipment[];
  leadFormUrl?: string;
  websiteUrl?: string;
}

export interface TrimVariant {
  id: string;
  trimId: string;
  name: string;
  price: number;
  description: string;
  images?: string[];
}

export interface Spec {
  engineType: string;
  displacement: number;
  cylinders: number;
  horsepower: number;
  torque: number;
  zeroToHundred: number;
  topSpeed: number;
  fuelEconomyCity: number;
  fuelEconomyHighway: number;
  fuelEconomyCombined: number;
  transmission: TransmissionType;
  driveType: DriveType;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  wheelbaseMm: number;
  trunkVolumeLiters: number;
  curbWeightKg: number;
  fuelTankLiters: number;
  seatingCapacity: number;
  warranty: string;
  specRegion: SpecRegion;
}

export interface Equipment {
  name: string;
  category: EquipmentCategory;
  isStandard: boolean;
}

export interface Branch {
  id: string;
  brandId: string;
  name: string;
  location: string;
  phone: string;
  mapUrl: string;
}

// ---------------------------------------------------------------------------
// Sellers (dealers, financiers) -- a model/trim can be sold by multiple sellers
// ---------------------------------------------------------------------------

export type SellerType = "dealer" | "financier";

export type PaymentType = "cash" | "installment";

export interface FinancierCalcConfig {
  paymentType: PaymentType;
  /** Down-payment slider config (used when paymentType === "installment"). */
  downPayment?: {
    minPct: number;
    maxPct: number;
    defaultPct: number;
    stepPct: number;
  };
  /** Available tenure options in months. */
  tenure?: {
    optionsMonths: number[];
    defaultMonths: number;
  };
  /** Annualised profit / interest rate (e.g. 0.039 = 3.9%). */
  profitRate?: number;
  /** Flat admin fee in KWD. */
  adminFee?: number;
  /** Optional caveat note shown under the calculator. */
  notes?: string;
  /** Cap on the financed amount, if any (KWD). */
  maxFinanceAmount?: number;
}

export interface SellerHeroMedia {
  type: "image" | "video";
  url: string;
  poster?: string;
}

export interface Seller {
  id: string;
  slug: string;
  name: string;
  type: SellerType;
  /** Show on the home Featured Sellers section and elevate in the index. */
  featured?: boolean;
  logoUrl: string;
  /** Primary brand colour for the seller (used for accents / branded calculator). */
  brandColor: string;
  brandColorDark?: string;
  tagline?: string;
  websiteUrl?: string;
  heroMedia?: SellerHeroMedia;
  /** Multiple images cycled in the seller landing hero (crossfade). */
  heroImages?: string[];
  /** Long-form copy for the seller landing page. */
  about?: {
    headline: string;
    body: string;
    imageUrl?: string;
  };
  /** Financing programme intro (financiers only). */
  financingIntro?: {
    headline: string;
    body: string;
    bullets: string[];
  };
  /** Default calculator config used by listings when they don't override. */
  calculator?: FinancierCalcConfig;
}

export interface SellerListing {
  id: string;
  sellerId: string;
  trimId: string;
  modelId: string;
  /** Listed price in KWD; may differ from trim.price. */
  price: number;
  paymentType: PaymentType;
  /** Marketing text shown on the listing card. */
  promoText?: string;
  /** Deep link to the seller's own page for this car. */
  listingUrl?: string;
  /** Per-listing override on top of the seller's default calculator. */
  calculatorOverride?: Partial<FinancierCalcConfig>;
  /** Thumbnail image shown on the seller-listing card (overrides trim/model imagery). */
  thumbnailUrl?: string;
}

export interface LifestyleCollection {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  modelIds: string[];
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface ModelFilters {
  brandIds?: string[];
  bodyTypes?: BodyType[];
  fuelTypes?: FuelType[];
  priceRange?: PriceRange;
  hpRange?: PriceRange;
  cylinders?: number[];
  transmissions?: TransmissionType[];
  driveTypes?: DriveType[];
  seatingCapacity?: number[];
  specRegions?: SpecRegion[];
  isNew?: boolean;
}

export type SortBy =
  | "price-asc"
  | "price-desc"
  | "newest"
  | "popular"
  | "horsepower";

export interface SearchEntry {
  modelId: string;
  trimId: string;
  brandId: string;
  brandName: string;
  modelName: string;
  trimName: string;
  price: number;
  imageUrl: string;
  bodyType: string;
  searchText: string;
}

export interface MinMax {
  min: number;
  max: number;
}

export interface ModelAggregateSpecs {
  priceRange: MinMax;
  hpRange: MinMax;
  torqueRange: MinMax;
  fuelTypes: FuelType[];
  transmissions: TransmissionType[];
  driveTypes: DriveType[];
  seatingRange: MinMax;
  displacementRange: MinMax;
  dimensionRanges: {
    length: MinMax;
    width: MinMax;
    height: MinMax;
    wheelbase: MinMax;
  };
  equipmentMap: Record<string, "standard" | "some" | "none">;
  trimCount: number;
}
