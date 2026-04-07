export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
}

export interface Model {
  id: string;
  brandId: string;
  name: string;
  slug: string;
  image: string;
  startingPrice: number; // KWD
}

export interface TrimSpec {
  engine: string;
  horsepower: number;
  torque: string;
  transmission: string;
  drivetrain: string;
  zeroToHundred: string;
  topSpeed: string;
  fuelType: string;
  fuelTank: string;
  fuelConsumption: string;
  seatingCapacity: number;
  bodyType: string;
  year: number;
  length: string;
  width: string;
  height: string;
  wheelbase: string;
  curbWeight: string;
  cargoVolume: string;
  infotainmentScreen: string;
  features: string[];
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface TrimVariant {
  id: string;
  trimId: string;
  name: string;
  price: number;
  specs: TrimSpec;
  colors: ColorOption[];
  images: string[];
}

export interface Trim {
  id: string;
  modelId: string;
  brandId: string;
  name: string;
  image: string;
  startingPrice: number;
  specTags: string[]; // e.g. ["2.0L Turbo", "RWD", "255 HP"]
  variants: TrimVariant[];
}
