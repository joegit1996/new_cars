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

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  modelCount: number;
  featured?: boolean;
  tagline?: string;
  editorial?: BrandEditorial;
}

export interface Model {
  id: string;
  brandId: string;
  name: string;
  bodyType: BodyType;
  year: number;
  startingPrice: number;
  trimCount: number;
  isNew: boolean;
  isUpdated: boolean;
  specsSummary: ModelSpecsSummary;
  imageUrl: string;
  segmentOrder?: number;
  modelFamily?: string;
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
