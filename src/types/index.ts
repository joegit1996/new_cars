export type BodyType = "sedan" | "suv" | "hatchback" | "coupe" | "truck" | "van" | "convertible" | "wagon";
export type FuelType = "gasoline" | "diesel" | "hybrid" | "plug-in-hybrid" | "electric";
export type Drivetrain = "FWD" | "RWD" | "AWD" | "4WD";
export type Transmission = "automatic" | "manual" | "cvt" | "dct";
export type Availability = "in-stock" | "in-transit" | "build-to-order" | "sold";

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  country: string;
  foundedYear: number;
  models: Model[];
}

export interface Model {
  id: string;
  brandId: string;
  name: string;
  image: string;
  year: number;
  bodyType: BodyType;
  priceRange: { min: number; max: number; currency: string };
  description: string;
  trims: Trim[];
}

export interface Trim {
  id: string;
  modelId: string;
  name: string;
  basePrice: number;
  engine: string;
  transmission: Transmission;
  horsepower: number;
  torque: number;
  fuelType: FuelType;
  drivetrain: Drivetrain;
  fuelEconomy: { city: number; highway: number; combined: number };
  variants: Variant[];
}

export interface Variant {
  id: string;
  trimId: string;
  name: string;
  price: number;
  additionalFeatures: string[];
  colorOptions: ColorOption[];
  availability: Availability;
}

export interface ColorOption {
  name: string;
  hex: string;
  type: "solid" | "metallic" | "pearl";
  upcharge: number;
}

export interface Listing {
  id: string;
  vin: string;
  brandId: string;
  modelId: string;
  trimId: string;
  variantId: string;
  year: number;
  price: number;
  msrp: number;
  color: { exterior: ColorOption; interior: string };
  mileage: number;
  condition: "new";
  dealer: { id: string; name: string; city: string; phone: string; rating: number };
  images: string[];
  features: string[];
  specs: {
    engine: string;
    transmission: Transmission;
    drivetrain: Drivetrain;
    horsepower: number;
    torque: number;
    fuelType: FuelType;
    fuelEconomy: { city: number; highway: number; combined: number };
    seatingCapacity: number;
    cargoVolume: number;
    curbWeight: number;
    dimensions?: { length: number; width: number; height: number; wheelbase: number; groundClearance: number };
  };
  warranty: { basic: string; powertrain: string; corrosion: string; roadside: string };
  safetyRating?: { nhtsa: number; iihsTopPick: boolean };
  addedDate: string;
  status: Availability;
}

export interface Filters {
  brandId: string | null;
  modelIds: string[];
  trimIds: string[];
  variantIds: string[];
  priceRange: [number, number];
  bodyTypes: BodyType[];
  fuelTypes: FuelType[];
  transmissions: Transmission[];
  drivetrains: Drivetrain[];
  exteriorColors: string[];
  features: string[];
  sortBy: "price-asc" | "price-desc" | "newest" | "hp-desc" | "mpg-desc";
}

export interface ComparisonItem {
  listing: Listing;
  brand: Brand;
  model: Model;
  trim: Trim;
  variant: Variant;
}
