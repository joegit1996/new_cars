import { Listing, Filters } from "@/types";

const dealers = [
  { id: "dealer-1", name: "Kuwait Auto Gallery", city: "Kuwait City", phone: "+965-2222-1001", rating: 4.8 },
  { id: "dealer-2", name: "Salmiya Motors", city: "Salmiya", phone: "+965-2222-2002", rating: 4.6 },
  { id: "dealer-3", name: "Hawalli Premium Cars", city: "Hawalli", phone: "+965-2222-3003", rating: 4.7 },
  { id: "dealer-4", name: "Jahra Automotive Center", city: "Jahra", phone: "+965-2222-4004", rating: 4.5 },
  { id: "dealer-5", name: "Ahmadi Car World", city: "Ahmadi", phone: "+965-2222-5005", rating: 4.9 },
];

export const listings: Listing[] = [
  // ─── TOYOTA CAMRY LISTINGS ───────────────────────────────
  {
    id: "lst-001",
    vin: "4T1BZ1HK6RU000101",
    brandId: "toyota",
    modelId: "toyota-camry",
    trimId: "camry-le",
    variantId: "camry-le-std",
    year: 2026,
    price: 29500,
    msrp: 29500,
    color: { exterior: { name: "White", hex: "#FFFFFF", type: "solid", upcharge: 0 }, interior: "Black Fabric" },
    mileage: 0,
    condition: "new",
    dealer: dealers[0],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=Camry+LE+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=Camry+LE+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=Camry+LE+Rear"
    ],
    features: ["7-inch touchscreen", "Apple CarPlay", "Android Auto", "Toyota Safety Sense 3.0", "Adaptive cruise control", "Lane departure warning", "Automatic high beams", "Dual-zone climate control"],
    specs: {
      engine: "2.5L 4-Cylinder Hybrid",
      transmission: "cvt",
      drivetrain: "FWD",
      horsepower: 225,
      torque: 176,
      fuelType: "hybrid",
      fuelEconomy: { city: 51, highway: 53, combined: 52 },
      seatingCapacity: 5,
      cargoVolume: 15.1,
      curbWeight: 3572,
      dimensions: { length: 194.1, width: 72.4, height: 56.9, wheelbase: 111.2, groundClearance: 5.7 }
    },
    warranty: { basic: "3 years / 36,000 miles", powertrain: "5 years / 60,000 miles", corrosion: "5 years / unlimited miles", roadside: "2 years / 25,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-15",
    status: "in-stock"
  },
  {
    id: "lst-002",
    vin: "4T1BZ1HK6RU000102",
    brandId: "toyota",
    modelId: "toyota-camry",
    trimId: "camry-le",
    variantId: "camry-le-conv",
    year: 2026,
    price: 31200,
    msrp: 31200,
    color: { exterior: { name: "Blue", hex: "#003399", type: "metallic", upcharge: 400 }, interior: "Black Fabric" },
    mileage: 0,
    condition: "new",
    dealer: dealers[1],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=Camry+LE+Conv+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=Camry+LE+Conv+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=Camry+LE+Conv+Rear"
    ],
    features: ["7-inch touchscreen", "Apple CarPlay", "Android Auto", "Toyota Safety Sense 3.0", "Adaptive cruise control", "Lane departure warning", "Automatic high beams", "Dual-zone climate control", "Power driver seat", "Blind spot monitor", "Rear cross traffic alert", "Wireless charging pad"],
    specs: {
      engine: "2.5L 4-Cylinder Hybrid",
      transmission: "cvt",
      drivetrain: "FWD",
      horsepower: 225,
      torque: 176,
      fuelType: "hybrid",
      fuelEconomy: { city: 51, highway: 53, combined: 52 },
      seatingCapacity: 5,
      cargoVolume: 15.1,
      curbWeight: 3572,
      dimensions: { length: 194.1, width: 72.4, height: 56.9, wheelbase: 111.2, groundClearance: 5.7 }
    },
    warranty: { basic: "3 years / 36,000 miles", powertrain: "5 years / 60,000 miles", corrosion: "5 years / unlimited miles", roadside: "2 years / 25,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-18",
    status: "in-stock"
  },
  {
    id: "lst-003",
    vin: "4T1BZ1HK6RU000103",
    brandId: "toyota",
    modelId: "toyota-camry",
    trimId: "camry-xle",
    variantId: "camry-xle-prem",
    year: 2026,
    price: 36500,
    msrp: 36000,
    color: { exterior: { name: "Pearl White", hex: "#F5F5F0", type: "pearl", upcharge: 500 }, interior: "Cognac Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[2],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=Camry+XLE+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=Camry+XLE+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=Camry+XLE+Interior"
    ],
    features: ["12.3-inch touchscreen", "Apple CarPlay", "Android Auto", "Toyota Safety Sense 3.0", "Leather seats", "Heated and ventilated front seats", "Heated rear seats", "Panoramic moonroof", "Blind spot monitor", "Rear cross traffic alert", "Wireless charging pad", "JBL premium audio", "Head-up display", "Digital rearview mirror", "Parking sensors"],
    specs: {
      engine: "2.5L 4-Cylinder Hybrid",
      transmission: "cvt",
      drivetrain: "FWD",
      horsepower: 225,
      torque: 176,
      fuelType: "hybrid",
      fuelEconomy: { city: 51, highway: 53, combined: 52 },
      seatingCapacity: 5,
      cargoVolume: 15.1,
      curbWeight: 3620,
      dimensions: { length: 194.1, width: 72.4, height: 56.9, wheelbase: 111.2, groundClearance: 5.7 }
    },
    warranty: { basic: "3 years / 36,000 miles", powertrain: "5 years / 60,000 miles", corrosion: "5 years / unlimited miles", roadside: "2 years / 25,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-20",
    status: "in-transit"
  },

  // ─── TOYOTA RAV4 LISTINGS ────────────────────────────────
  {
    id: "lst-004",
    vin: "2T3P1RFV8RW000201",
    brandId: "toyota",
    modelId: "toyota-rav4",
    trimId: "rav4-le",
    variantId: "rav4-le-std",
    year: 2026,
    price: 32500,
    msrp: 32500,
    color: { exterior: { name: "Silver", hex: "#C0C0C0", type: "metallic", upcharge: 200 }, interior: "Black Fabric" },
    mileage: 0,
    condition: "new",
    dealer: dealers[3],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=RAV4+LE+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=RAV4+LE+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=RAV4+LE+Rear"
    ],
    features: ["8-inch touchscreen", "Apple CarPlay", "Android Auto", "Toyota Safety Sense 3.0", "Adaptive cruise control", "LED headlights", "Dual-zone climate control", "Roof rails"],
    specs: {
      engine: "2.5L 4-Cylinder Hybrid",
      transmission: "cvt",
      drivetrain: "AWD",
      horsepower: 219,
      torque: 163,
      fuelType: "hybrid",
      fuelEconomy: { city: 41, highway: 38, combined: 40 },
      seatingCapacity: 5,
      cargoVolume: 37.5,
      curbWeight: 3800,
      dimensions: { length: 180.9, width: 73.0, height: 67.0, wheelbase: 105.9, groundClearance: 8.1 }
    },
    warranty: { basic: "3 years / 36,000 miles", powertrain: "5 years / 60,000 miles", corrosion: "5 years / unlimited miles", roadside: "2 years / 25,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-10",
    status: "in-stock"
  },
  {
    id: "lst-005",
    vin: "2T3P1RFV8RW000202",
    brandId: "toyota",
    modelId: "toyota-rav4",
    trimId: "rav4-se",
    variantId: "rav4-se-std",
    year: 2026,
    price: 38900,
    msrp: 38400,
    color: { exterior: { name: "Red", hex: "#CC0000", type: "metallic", upcharge: 400 }, interior: "Black SofTex" },
    mileage: 0,
    condition: "new",
    dealer: dealers[4],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=RAV4+SE+PHEV+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=RAV4+SE+PHEV+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=RAV4+SE+PHEV+Rear"
    ],
    features: ["9-inch touchscreen", "Apple CarPlay", "Android Auto", "Toyota Safety Sense 3.0", "Plug-in hybrid with 42-mile EV range", "Heated front seats", "Power liftgate", "LED fog lights", "18-inch alloy wheels", "Wireless charging pad"],
    specs: {
      engine: "2.5L 4-Cylinder Plug-in Hybrid",
      transmission: "cvt",
      drivetrain: "AWD",
      horsepower: 302,
      torque: 199,
      fuelType: "plug-in-hybrid",
      fuelEconomy: { city: 94, highway: 84, combined: 38 },
      seatingCapacity: 5,
      cargoVolume: 33.5,
      curbWeight: 4235,
      dimensions: { length: 180.9, width: 73.0, height: 67.0, wheelbase: 105.9, groundClearance: 8.1 }
    },
    warranty: { basic: "3 years / 36,000 miles", powertrain: "5 years / 60,000 miles", corrosion: "5 years / unlimited miles", roadside: "2 years / 25,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-12",
    status: "in-stock"
  },

  // ─── TOYOTA COROLLA LISTINGS ─────────────────────────────
  {
    id: "lst-006",
    vin: "JTDEPRAE6RJ000301",
    brandId: "toyota",
    modelId: "toyota-corolla",
    trimId: "corolla-se",
    variantId: "corolla-se-std",
    year: 2026,
    price: 25500,
    msrp: 25500,
    color: { exterior: { name: "Black", hex: "#000000", type: "metallic", upcharge: 200 }, interior: "Black Fabric" },
    mileage: 0,
    condition: "new",
    dealer: dealers[0],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=Corolla+SE+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=Corolla+SE+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=Corolla+SE+Rear"
    ],
    features: ["8-inch touchscreen", "Apple CarPlay", "Android Auto", "Toyota Safety Sense 3.0", "Sport-tuned suspension", "18-inch alloy wheels", "Dual-zone climate control", "LED headlights", "Blind spot monitor"],
    specs: {
      engine: "2.0L 4-Cylinder",
      transmission: "cvt",
      drivetrain: "FWD",
      horsepower: 169,
      torque: 151,
      fuelType: "gasoline",
      fuelEconomy: { city: 31, highway: 40, combined: 34 },
      seatingCapacity: 5,
      cargoVolume: 13.1,
      curbWeight: 3100,
      dimensions: { length: 182.3, width: 70.9, height: 56.5, wheelbase: 106.3, groundClearance: 5.3 }
    },
    warranty: { basic: "3 years / 36,000 miles", powertrain: "5 years / 60,000 miles", corrosion: "5 years / unlimited miles", roadside: "2 years / 25,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-22",
    status: "in-stock"
  },

  // ─── BMW 3 SERIES LISTINGS ───────────────────────────────
  {
    id: "lst-007",
    vin: "WBA53BJ06RWP00401",
    brandId: "bmw",
    modelId: "bmw-3series",
    trimId: "3series-330i",
    variantId: "330i-premium",
    year: 2026,
    price: 47500,
    msrp: 47500,
    color: { exterior: { name: "Alpine White", hex: "#F2F2F0", type: "solid", upcharge: 0 }, interior: "Black Vernasca Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[0],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=330i+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=330i+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=330i+Interior"
    ],
    features: ["12.3-inch digital instrument cluster", "14.9-inch infotainment display", "Vernasca leather upholstery", "Heated front seats", "Power tailgate", "Ambient lighting", "Harman Kardon surround sound", "Parking assistant"],
    specs: {
      engine: "2.0L TwinPower Turbo 4-Cylinder",
      transmission: "automatic",
      drivetrain: "RWD",
      horsepower: 255,
      torque: 295,
      fuelType: "gasoline",
      fuelEconomy: { city: 26, highway: 36, combined: 30 },
      seatingCapacity: 5,
      cargoVolume: 17.0,
      curbWeight: 3627,
      dimensions: { length: 187.6, width: 71.9, height: 56.8, wheelbase: 112.2, groundClearance: 5.5 }
    },
    warranty: { basic: "4 years / 50,000 miles", powertrain: "4 years / 50,000 miles", corrosion: "12 years / unlimited miles", roadside: "4 years / unlimited miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-08",
    status: "in-stock"
  },
  {
    id: "lst-008",
    vin: "WBA53BJ06RWP00402",
    brandId: "bmw",
    modelId: "bmw-3series",
    trimId: "3series-330i-xdrive",
    variantId: "330i-xdrive-exec",
    year: 2026,
    price: 54000,
    msrp: 53400,
    color: { exterior: { name: "Black Sapphire", hex: "#0A0A0A", type: "metallic", upcharge: 625 }, interior: "Cognac Vernasca Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[2],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=330i+xDrive+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=330i+xDrive+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=330i+xDrive+Interior"
    ],
    features: ["12.3-inch digital instrument cluster", "14.9-inch infotainment display", "Vernasca leather upholstery", "Heated front seats", "Heated steering wheel", "Power tailgate", "Ambient lighting", "Harman Kardon surround sound", "xDrive all-wheel drive", "Parking assistant plus", "Head-up display", "Gesture control", "Comfort access", "Soft-close doors"],
    specs: {
      engine: "2.0L TwinPower Turbo 4-Cylinder",
      transmission: "automatic",
      drivetrain: "AWD",
      horsepower: 255,
      torque: 295,
      fuelType: "gasoline",
      fuelEconomy: { city: 25, highway: 34, combined: 29 },
      seatingCapacity: 5,
      cargoVolume: 17.0,
      curbWeight: 3736,
      dimensions: { length: 187.6, width: 71.9, height: 56.8, wheelbase: 112.2, groundClearance: 5.5 }
    },
    warranty: { basic: "4 years / 50,000 miles", powertrain: "4 years / 50,000 miles", corrosion: "12 years / unlimited miles", roadside: "4 years / unlimited miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-14",
    status: "in-transit"
  },
  {
    id: "lst-009",
    vin: "WBA53BJ06RWP00403",
    brandId: "bmw",
    modelId: "bmw-3series",
    trimId: "3series-m340i",
    variantId: "m340i-premium",
    year: 2026,
    price: 59500,
    msrp: 59500,
    color: { exterior: { name: "Portimao Blue", hex: "#1E3A5F", type: "metallic", upcharge: 625 }, interior: "Black Vernasca Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[4],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=M340i+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=M340i+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=M340i+Interior"
    ],
    features: ["12.3-inch digital instrument cluster", "14.9-inch infotainment display", "Vernasca leather upholstery", "M Sport brakes", "M Sport differential", "Adaptive M suspension", "Heated front seats", "Harman Kardon surround sound", "Head-up display", "Parking assistant plus"],
    specs: {
      engine: "3.0L TwinPower Turbo Inline-6",
      transmission: "automatic",
      drivetrain: "AWD",
      horsepower: 382,
      torque: 369,
      fuelType: "gasoline",
      fuelEconomy: { city: 22, highway: 31, combined: 26 },
      seatingCapacity: 5,
      cargoVolume: 17.0,
      curbWeight: 3857,
      dimensions: { length: 188.2, width: 72.8, height: 56.8, wheelbase: 112.2, groundClearance: 5.3 }
    },
    warranty: { basic: "4 years / 50,000 miles", powertrain: "4 years / 50,000 miles", corrosion: "12 years / unlimited miles", roadside: "4 years / unlimited miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-05",
    status: "in-stock"
  },

  // ─── BMW X3 LISTINGS ─────────────────────────────────────
  {
    id: "lst-010",
    vin: "5UX53DP05RWL00501",
    brandId: "bmw",
    modelId: "bmw-x3",
    trimId: "x3-30-xdrive",
    variantId: "x3-30-premium",
    year: 2026,
    price: 53400,
    msrp: 53400,
    color: { exterior: { name: "Phytonic Blue", hex: "#1C3A5F", type: "metallic", upcharge: 625 }, interior: "Oyster Vernasca Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[1],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=X3+30+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=X3+30+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=X3+30+Rear"
    ],
    features: ["12.3-inch digital instrument cluster", "14.9-inch infotainment display", "Vernasca leather upholstery", "Panoramic sunroof", "Heated front seats", "Power tailgate", "Ambient lighting", "Harman Kardon surround sound", "Parking assistant"],
    specs: {
      engine: "2.0L TwinPower Turbo 4-Cylinder",
      transmission: "automatic",
      drivetrain: "AWD",
      horsepower: 255,
      torque: 295,
      fuelType: "gasoline",
      fuelEconomy: { city: 24, highway: 31, combined: 27 },
      seatingCapacity: 5,
      cargoVolume: 28.7,
      curbWeight: 4156,
      dimensions: { length: 186.6, width: 74.4, height: 66.0, wheelbase: 112.1, groundClearance: 8.0 }
    },
    warranty: { basic: "4 years / 50,000 miles", powertrain: "4 years / 50,000 miles", corrosion: "12 years / unlimited miles", roadside: "4 years / unlimited miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-11",
    status: "in-stock"
  },
  {
    id: "lst-011",
    vin: "5UX53DP05RWL00502",
    brandId: "bmw",
    modelId: "bmw-x3",
    trimId: "x3-m50-xdrive",
    variantId: "x3-m50-premium",
    year: 2026,
    price: 67200,
    msrp: 66500,
    color: { exterior: { name: "Toronto Red", hex: "#8B1A1A", type: "metallic", upcharge: 625 }, interior: "Black Merino Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[3],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=X3+M50+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=X3+M50+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=X3+M50+Interior"
    ],
    features: ["12.3-inch digital instrument cluster", "14.9-inch infotainment display", "Extended Merino leather", "M Sport brakes", "Adaptive M suspension", "Panoramic sunroof", "Heated front seats", "Head-up display", "Bowers & Wilkins surround sound", "M Sport exhaust"],
    specs: {
      engine: "3.0L TwinPower Turbo Inline-6",
      transmission: "automatic",
      drivetrain: "AWD",
      horsepower: 393,
      torque: 428,
      fuelType: "gasoline",
      fuelEconomy: { city: 20, highway: 27, combined: 23 },
      seatingCapacity: 5,
      cargoVolume: 28.7,
      curbWeight: 4430,
      dimensions: { length: 187.4, width: 74.8, height: 66.2, wheelbase: 112.1, groundClearance: 7.8 }
    },
    warranty: { basic: "4 years / 50,000 miles", powertrain: "4 years / 50,000 miles", corrosion: "12 years / unlimited miles", roadside: "4 years / unlimited miles" },
    safetyRating: { nhtsa: 4, iihsTopPick: true },
    addedDate: "2026-03-16",
    status: "in-transit"
  },

  // ─── BMW i4 LISTINGS ─────────────────────────────────────
  {
    id: "lst-012",
    vin: "WBY73AW09RCH00601",
    brandId: "bmw",
    modelId: "bmw-i4",
    trimId: "i4-edrive35",
    variantId: "i4-edrive35-prem",
    year: 2026,
    price: 57800,
    msrp: 57800,
    color: { exterior: { name: "Skyscraper Grey", hex: "#5A5A5A", type: "metallic", upcharge: 625 }, interior: "Cognac Vernasca Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[0],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=i4+eDrive35+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=i4+eDrive35+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=i4+eDrive35+Interior"
    ],
    features: ["12.3-inch digital instrument cluster", "14.9-inch curved display", "Vernasca leather upholstery", "Heated front seats", "Heated steering wheel", "282-mile range", "150 kW DC fast charging", "Parking assistant plus", "Harman Kardon surround sound", "Head-up display", "Panoramic sunroof"],
    specs: {
      engine: "Single Electric Motor",
      transmission: "automatic",
      drivetrain: "RWD",
      horsepower: 281,
      torque: 295,
      fuelType: "electric",
      fuelEconomy: { city: 120, highway: 100, combined: 110 },
      seatingCapacity: 5,
      cargoVolume: 14.0,
      curbWeight: 4440,
      dimensions: { length: 188.3, width: 72.5, height: 57.0, wheelbase: 112.2, groundClearance: 5.2 }
    },
    warranty: { basic: "4 years / 50,000 miles", powertrain: "4 years / 50,000 miles", corrosion: "12 years / unlimited miles", roadside: "4 years / unlimited miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-19",
    status: "in-stock"
  },
  {
    id: "lst-013",
    vin: "WBY73AW09RCH00602",
    brandId: "bmw",
    modelId: "bmw-i4",
    trimId: "i4-m50",
    variantId: "i4-m50-std",
    year: 2026,
    price: 70300,
    msrp: 69700,
    color: { exterior: { name: "Portimao Blue", hex: "#1E3A5F", type: "metallic", upcharge: 625 }, interior: "Black Vernasca Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[2],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=i4+M50+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=i4+M50+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=i4+M50+Rear"
    ],
    features: ["12.3-inch digital instrument cluster", "14.9-inch curved display", "Vernasca leather upholstery", "M Sport brakes", "Adaptive M suspension", "Heated front seats", "270-mile range", "200 kW DC fast charging", "Harman Kardon surround sound", "Head-up display"],
    specs: {
      engine: "Dual Electric Motors",
      transmission: "automatic",
      drivetrain: "AWD",
      horsepower: 536,
      torque: 586,
      fuelType: "electric",
      fuelEconomy: { city: 105, highway: 92, combined: 99 },
      seatingCapacity: 5,
      cargoVolume: 14.0,
      curbWeight: 4825,
      dimensions: { length: 188.3, width: 72.9, height: 57.0, wheelbase: 112.2, groundClearance: 5.0 }
    },
    warranty: { basic: "4 years / 50,000 miles", powertrain: "4 years / 50,000 miles", corrosion: "12 years / unlimited miles", roadside: "4 years / unlimited miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-21",
    status: "in-stock"
  },

  // ─── MERCEDES C-CLASS LISTINGS ───────────────────────────
  {
    id: "lst-014",
    vin: "W1KZF8DB6RA000701",
    brandId: "mercedes",
    modelId: "mercedes-cclass",
    trimId: "cclass-c300",
    variantId: "c300-exclusive",
    year: 2026,
    price: 48500,
    msrp: 48500,
    color: { exterior: { name: "Polar White", hex: "#F5F5F5", type: "solid", upcharge: 0 }, interior: "Black MB-Tex" },
    mileage: 0,
    condition: "new",
    dealer: dealers[1],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=C300+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=C300+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=C300+Interior"
    ],
    features: ["11.9-inch OLED central display", "12.3-inch digital instrument cluster", "MB-Tex upholstery", "Heated front seats", "64-color ambient lighting", "Burmester surround sound", "Wireless Apple CarPlay", "Wireless Android Auto", "Active parking assist"],
    specs: {
      engine: "2.0L Turbo 4-Cylinder with EQ Boost",
      transmission: "automatic",
      drivetrain: "RWD",
      horsepower: 255,
      torque: 295,
      fuelType: "gasoline",
      fuelEconomy: { city: 25, highway: 35, combined: 29 },
      seatingCapacity: 5,
      cargoVolume: 12.6,
      curbWeight: 3726,
      dimensions: { length: 187.5, width: 71.8, height: 56.6, wheelbase: 112.8, groundClearance: 4.5 }
    },
    warranty: { basic: "4 years / 50,000 miles", powertrain: "4 years / 50,000 miles", corrosion: "4 years / 50,000 miles", roadside: "4 years / 50,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-06",
    status: "in-stock"
  },
  {
    id: "lst-015",
    vin: "W1KZF8DB6RA000702",
    brandId: "mercedes",
    modelId: "mercedes-cclass",
    trimId: "cclass-c300",
    variantId: "c300-pinnacle",
    year: 2026,
    price: 52500,
    msrp: 52000,
    color: { exterior: { name: "Selenite Grey", hex: "#7A7A7A", type: "metallic", upcharge: 720 }, interior: "Macchiato Beige Nappa Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[4],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=C300+Pinnacle+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=C300+Pinnacle+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=C300+Pinnacle+Interior"
    ],
    features: ["11.9-inch OLED central display", "12.3-inch digital instrument cluster", "Nappa leather upholstery", "Heated and ventilated front seats", "Head-up display", "64-color ambient lighting", "Burmester 3D surround sound", "Wireless Apple CarPlay", "Wireless Android Auto", "Active parking assist", "Panoramic sunroof", "Air suspension", "Soft-close doors"],
    specs: {
      engine: "2.0L Turbo 4-Cylinder with EQ Boost",
      transmission: "automatic",
      drivetrain: "RWD",
      horsepower: 255,
      torque: 295,
      fuelType: "gasoline",
      fuelEconomy: { city: 25, highway: 35, combined: 29 },
      seatingCapacity: 5,
      cargoVolume: 12.6,
      curbWeight: 3790,
      dimensions: { length: 187.5, width: 71.8, height: 56.6, wheelbase: 112.8, groundClearance: 4.5 }
    },
    warranty: { basic: "4 years / 50,000 miles", powertrain: "4 years / 50,000 miles", corrosion: "4 years / 50,000 miles", roadside: "4 years / 50,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-09",
    status: "in-stock"
  },
  {
    id: "lst-016",
    vin: "W1KZF8DB6RA000703",
    brandId: "mercedes",
    modelId: "mercedes-cclass",
    trimId: "cclass-amg-c43",
    variantId: "amg-c43-std",
    year: 2026,
    price: 58500,
    msrp: 58000,
    color: { exterior: { name: "Obsidian Black", hex: "#0D0D0D", type: "metallic", upcharge: 720 }, interior: "Black AMG Sport Seats" },
    mileage: 0,
    condition: "new",
    dealer: dealers[0],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=AMG+C43+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=AMG+C43+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=AMG+C43+Interior"
    ],
    features: ["11.9-inch OLED central display", "12.3-inch digital instrument cluster", "AMG sport seats with MB-Tex/microfiber", "AMG Performance exhaust", "AMG RIDE CONTROL suspension", "AMG-specific steering wheel", "Burmester surround sound", "Head-up display", "AMG Track Pace app"],
    specs: {
      engine: "2.0L AMG-Enhanced Turbo 4-Cylinder with EQ Boost",
      transmission: "automatic",
      drivetrain: "AWD",
      horsepower: 402,
      torque: 369,
      fuelType: "gasoline",
      fuelEconomy: { city: 21, highway: 30, combined: 25 },
      seatingCapacity: 5,
      cargoVolume: 12.6,
      curbWeight: 4012,
      dimensions: { length: 187.9, width: 72.4, height: 55.9, wheelbase: 112.8, groundClearance: 4.3 }
    },
    warranty: { basic: "4 years / 50,000 miles", powertrain: "4 years / 50,000 miles", corrosion: "4 years / 50,000 miles", roadside: "4 years / 50,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: false },
    addedDate: "2026-03-17",
    status: "in-transit"
  },

  // ─── MERCEDES GLC LISTINGS ───────────────────────────────
  {
    id: "lst-017",
    vin: "W1NKM4HB8RA000801",
    brandId: "mercedes",
    modelId: "mercedes-glc",
    trimId: "glc-300-4matic",
    variantId: "glc300-4matic-exclusive",
    year: 2026,
    price: 53500,
    msrp: 53500,
    color: { exterior: { name: "Nautic Blue", hex: "#1B3A5C", type: "metallic", upcharge: 720 }, interior: "Black MB-Tex" },
    mileage: 0,
    condition: "new",
    dealer: dealers[3],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=GLC+300+4MATIC+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=GLC+300+4MATIC+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=GLC+300+4MATIC+Rear"
    ],
    features: ["11.9-inch OLED central display", "12.3-inch digital instrument cluster", "MB-Tex upholstery", "Heated front seats", "64-color ambient lighting", "Burmester surround sound", "4MATIC all-wheel drive", "Power liftgate", "Active parking assist"],
    specs: {
      engine: "2.0L Turbo 4-Cylinder with EQ Boost",
      transmission: "automatic",
      drivetrain: "AWD",
      horsepower: 258,
      torque: 295,
      fuelType: "gasoline",
      fuelEconomy: { city: 23, highway: 30, combined: 26 },
      seatingCapacity: 5,
      cargoVolume: 21.4,
      curbWeight: 4222,
      dimensions: { length: 187.1, width: 74.4, height: 64.7, wheelbase: 113.1, groundClearance: 7.9 }
    },
    warranty: { basic: "4 years / 50,000 miles", powertrain: "4 years / 50,000 miles", corrosion: "4 years / 50,000 miles", roadside: "4 years / 50,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-07",
    status: "in-stock"
  },
  {
    id: "lst-018",
    vin: "W1NKM4HB8RA000802",
    brandId: "mercedes",
    modelId: "mercedes-glc",
    trimId: "glc-amg43",
    variantId: "glc-amg43-std",
    year: 2026,
    price: 62500,
    msrp: 62000,
    color: { exterior: { name: "Polar White", hex: "#F5F5F5", type: "solid", upcharge: 0 }, interior: "Black AMG Sport Seats" },
    mileage: 0,
    condition: "new",
    dealer: dealers[2],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=AMG+GLC43+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=AMG+GLC43+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=AMG+GLC43+Rear"
    ],
    features: ["11.9-inch OLED central display", "12.3-inch digital instrument cluster", "AMG sport seats with MB-Tex/microfiber", "AMG Performance exhaust", "AMG RIDE CONTROL suspension", "Burmester surround sound", "Head-up display", "Power liftgate", "AMG Track Pace app"],
    specs: {
      engine: "2.0L AMG-Enhanced Turbo 4-Cylinder with EQ Boost",
      transmission: "automatic",
      drivetrain: "AWD",
      horsepower: 416,
      torque: 369,
      fuelType: "gasoline",
      fuelEconomy: { city: 19, highway: 26, combined: 22 },
      seatingCapacity: 5,
      cargoVolume: 21.4,
      curbWeight: 4500,
      dimensions: { length: 187.5, width: 74.8, height: 64.5, wheelbase: 113.1, groundClearance: 7.6 }
    },
    warranty: { basic: "4 years / 50,000 miles", powertrain: "4 years / 50,000 miles", corrosion: "4 years / 50,000 miles", roadside: "4 years / 50,000 miles" },
    safetyRating: { nhtsa: 4, iihsTopPick: false },
    addedDate: "2026-03-13",
    status: "in-stock"
  },

  // ─── MERCEDES EQE LISTINGS ───────────────────────────────
  {
    id: "lst-019",
    vin: "W1KZF8EB0RA000901",
    brandId: "mercedes",
    modelId: "mercedes-eqe",
    trimId: "eqe-350plus",
    variantId: "eqe350-exclusive",
    year: 2026,
    price: 58500,
    msrp: 58500,
    color: { exterior: { name: "Sodalite Blue", hex: "#1A2D5A", type: "metallic", upcharge: 720 }, interior: "Black MB-Tex" },
    mileage: 0,
    condition: "new",
    dealer: dealers[0],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=EQE+350+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=EQE+350+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=EQE+350+Interior"
    ],
    features: ["12.8-inch OLED central display", "12.3-inch digital instrument cluster", "MB-Tex upholstery", "Heated front seats", "64-color ambient lighting", "Burmester surround sound", "305-mile range", "170 kW DC fast charging", "Active parking assist"],
    specs: {
      engine: "Single Electric Motor",
      transmission: "automatic",
      drivetrain: "RWD",
      horsepower: 288,
      torque: 391,
      fuelType: "electric",
      fuelEconomy: { city: 115, highway: 98, combined: 107 },
      seatingCapacity: 5,
      cargoVolume: 14.0,
      curbWeight: 5060,
      dimensions: { length: 195.7, width: 74.0, height: 58.4, wheelbase: 122.2, groundClearance: 5.3 }
    },
    warranty: { basic: "4 years / 50,000 miles", powertrain: "4 years / 50,000 miles", corrosion: "4 years / 50,000 miles", roadside: "4 years / 50,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-23",
    status: "in-stock"
  },
  {
    id: "lst-020",
    vin: "W1KZF8EB0RA000902",
    brandId: "mercedes",
    modelId: "mercedes-eqe",
    trimId: "eqe-500-4matic",
    variantId: "eqe500-exclusive",
    year: 2026,
    price: 72000,
    msrp: 72000,
    color: { exterior: { name: "Graphite Grey", hex: "#4A4A4A", type: "metallic", upcharge: 720 }, interior: "Macchiato Beige MB-Tex" },
    mileage: 0,
    condition: "new",
    dealer: dealers[1],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=EQE+500+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=EQE+500+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=EQE+500+Interior"
    ],
    features: ["12.8-inch OLED central display", "12.3-inch digital instrument cluster", "MB-Tex upholstery", "Heated front seats", "64-color ambient lighting", "Burmester surround sound", "285-mile range", "170 kW DC fast charging", "4MATIC all-wheel drive", "Active parking assist"],
    specs: {
      engine: "Dual Electric Motors",
      transmission: "automatic",
      drivetrain: "AWD",
      horsepower: 402,
      torque: 564,
      fuelType: "electric",
      fuelEconomy: { city: 100, highway: 88, combined: 94 },
      seatingCapacity: 5,
      cargoVolume: 14.0,
      curbWeight: 5340,
      dimensions: { length: 195.7, width: 74.0, height: 58.4, wheelbase: 122.2, groundClearance: 5.3 }
    },
    warranty: { basic: "4 years / 50,000 miles", powertrain: "4 years / 50,000 miles", corrosion: "4 years / 50,000 miles", roadside: "4 years / 50,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-25",
    status: "in-stock"
  },

  // ─── HONDA CIVIC LISTINGS ────────────────────────────────
  {
    id: "lst-021",
    vin: "2HGFE2F50RH001001",
    brandId: "honda",
    modelId: "honda-civic",
    trimId: "civic-lx",
    variantId: "civic-lx-std",
    year: 2026,
    price: 24500,
    msrp: 24500,
    color: { exterior: { name: "White", hex: "#FFFFFF", type: "solid", upcharge: 0 }, interior: "Black Cloth" },
    mileage: 0,
    condition: "new",
    dealer: dealers[2],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=Civic+LX+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=Civic+LX+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=Civic+LX+Rear"
    ],
    features: ["7-inch touchscreen", "Apple CarPlay", "Android Auto", "Honda Sensing suite", "Adaptive cruise control", "Lane keeping assist", "Collision mitigation braking", "Automatic climate control"],
    specs: {
      engine: "2.0L 4-Cylinder",
      transmission: "cvt",
      drivetrain: "FWD",
      horsepower: 158,
      torque: 138,
      fuelType: "gasoline",
      fuelEconomy: { city: 31, highway: 40, combined: 35 },
      seatingCapacity: 5,
      cargoVolume: 14.8,
      curbWeight: 2935,
      dimensions: { length: 184.0, width: 70.9, height: 55.7, wheelbase: 107.7, groundClearance: 5.1 }
    },
    warranty: { basic: "3 years / 36,000 miles", powertrain: "5 years / 60,000 miles", corrosion: "5 years / unlimited miles", roadside: "3 years / 36,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-14",
    status: "in-stock"
  },
  {
    id: "lst-022",
    vin: "2HGFE2F50RH001002",
    brandId: "honda",
    modelId: "honda-civic",
    trimId: "civic-sport",
    variantId: "civic-sport-hpt",
    year: 2026,
    price: 29500,
    msrp: 29500,
    color: { exterior: { name: "Red", hex: "#CC0000", type: "metallic", upcharge: 400 }, interior: "Black Sport Cloth" },
    mileage: 0,
    condition: "new",
    dealer: dealers[4],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=Civic+Sport+HPT+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=Civic+Sport+HPT+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=Civic+Sport+HPT+Interior"
    ],
    features: ["9-inch touchscreen", "Apple CarPlay", "Android Auto", "Honda Sensing suite", "Sport pedals", "18-inch alloy wheels", "LED headlights", "Dual-zone climate control", "Rear decklid spoiler", "Leather-wrapped steering wheel", "Blind spot information", "Wireless charging pad", "Bose premium audio"],
    specs: {
      engine: "1.5L Turbo 4-Cylinder",
      transmission: "cvt",
      drivetrain: "FWD",
      horsepower: 180,
      torque: 177,
      fuelType: "gasoline",
      fuelEconomy: { city: 30, highway: 37, combined: 33 },
      seatingCapacity: 5,
      cargoVolume: 14.8,
      curbWeight: 3016,
      dimensions: { length: 184.0, width: 70.9, height: 55.7, wheelbase: 107.7, groundClearance: 5.1 }
    },
    warranty: { basic: "3 years / 36,000 miles", powertrain: "5 years / 60,000 miles", corrosion: "5 years / unlimited miles", roadside: "3 years / 36,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-16",
    status: "in-stock"
  },
  {
    id: "lst-023",
    vin: "2HGFE2F50RH001003",
    brandId: "honda",
    modelId: "honda-civic",
    trimId: "civic-touring",
    variantId: "civic-touring-std",
    year: 2026,
    price: 31000,
    msrp: 31000,
    color: { exterior: { name: "Pearl White", hex: "#F5F5F0", type: "pearl", upcharge: 500 }, interior: "Black Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[0],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=Civic+Touring+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=Civic+Touring+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=Civic+Touring+Interior"
    ],
    features: ["9-inch touchscreen with wireless Apple CarPlay", "10.2-inch digital instrument cluster", "Honda Sensing suite", "Leather seats", "Heated front seats", "Power sunroof", "Bose premium audio", "Wireless charging pad", "Blind spot information", "Rear cross traffic alert", "Parking sensors", "Rain-sensing wipers"],
    specs: {
      engine: "1.5L Turbo 4-Cylinder",
      transmission: "cvt",
      drivetrain: "FWD",
      horsepower: 180,
      torque: 177,
      fuelType: "gasoline",
      fuelEconomy: { city: 30, highway: 37, combined: 33 },
      seatingCapacity: 5,
      cargoVolume: 14.8,
      curbWeight: 3077,
      dimensions: { length: 184.0, width: 70.9, height: 55.7, wheelbase: 107.7, groundClearance: 5.1 }
    },
    warranty: { basic: "3 years / 36,000 miles", powertrain: "5 years / 60,000 miles", corrosion: "5 years / unlimited miles", roadside: "3 years / 36,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-18",
    status: "in-stock"
  },

  // ─── HONDA CR-V LISTINGS ─────────────────────────────────
  {
    id: "lst-024",
    vin: "7FARS4H70RE001101",
    brandId: "honda",
    modelId: "honda-crv",
    trimId: "crv-ex",
    variantId: "crv-ex-tech",
    year: 2026,
    price: 36500,
    msrp: 36000,
    color: { exterior: { name: "Blue", hex: "#003399", type: "metallic", upcharge: 400 }, interior: "Gray Cloth" },
    mileage: 0,
    condition: "new",
    dealer: dealers[3],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=CR-V+EX+Tech+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=CR-V+EX+Tech+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=CR-V+EX+Tech+Interior"
    ],
    features: ["9-inch touchscreen", "Apple CarPlay", "Android Auto", "Honda Sensing suite", "Heated front seats", "Power tailgate", "Dual-zone climate control", "Remote start", "18-inch alloy wheels", "Blind spot information", "Rear cross traffic alert", "Wireless charging pad", "Bose premium audio"],
    specs: {
      engine: "2.0L 4-Cylinder Hybrid",
      transmission: "cvt",
      drivetrain: "AWD",
      horsepower: 204,
      torque: 247,
      fuelType: "hybrid",
      fuelEconomy: { city: 43, highway: 36, combined: 40 },
      seatingCapacity: 5,
      cargoVolume: 36.3,
      curbWeight: 3796,
      dimensions: { length: 184.8, width: 73.4, height: 67.5, wheelbase: 106.3, groundClearance: 7.8 }
    },
    warranty: { basic: "3 years / 36,000 miles", powertrain: "5 years / 60,000 miles", corrosion: "5 years / unlimited miles", roadside: "3 years / 36,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-10",
    status: "in-stock"
  },
  {
    id: "lst-025",
    vin: "7FARS4H70RE001102",
    brandId: "honda",
    modelId: "honda-crv",
    trimId: "crv-sport-touring",
    variantId: "crv-sport-touring-std",
    year: 2026,
    price: 38500,
    msrp: 38500,
    color: { exterior: { name: "Pearl White", hex: "#F5F5F0", type: "pearl", upcharge: 500 }, interior: "Black Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[1],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=CR-V+Sport+Touring+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=CR-V+Sport+Touring+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=CR-V+Sport+Touring+Interior"
    ],
    features: ["9-inch touchscreen with wireless Apple CarPlay", "10.2-inch digital instrument cluster", "Honda Sensing suite", "Leather seats", "Heated and ventilated front seats", "Heated rear seats", "Hands-free power tailgate", "Panoramic sunroof", "Bose premium audio", "Wireless charging pad", "Parking sensors", "19-inch alloy wheels"],
    specs: {
      engine: "2.0L 4-Cylinder Hybrid",
      transmission: "cvt",
      drivetrain: "AWD",
      horsepower: 204,
      torque: 247,
      fuelType: "hybrid",
      fuelEconomy: { city: 40, highway: 34, combined: 37 },
      seatingCapacity: 5,
      cargoVolume: 36.3,
      curbWeight: 3896,
      dimensions: { length: 184.8, width: 73.4, height: 67.5, wheelbase: 106.3, groundClearance: 7.8 }
    },
    warranty: { basic: "3 years / 36,000 miles", powertrain: "5 years / 60,000 miles", corrosion: "5 years / unlimited miles", roadside: "3 years / 36,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-20",
    status: "in-stock"
  },

  // ─── HONDA ACCORD LISTINGS ───────────────────────────────
  {
    id: "lst-026",
    vin: "1HGCY2F70RA001201",
    brandId: "honda",
    modelId: "honda-accord",
    trimId: "accord-sport",
    variantId: "accord-sport-std",
    year: 2026,
    price: 33000,
    msrp: 33000,
    color: { exterior: { name: "Black", hex: "#000000", type: "metallic", upcharge: 200 }, interior: "Black Sport Cloth" },
    mileage: 0,
    condition: "new",
    dealer: dealers[4],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=Accord+Sport+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=Accord+Sport+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=Accord+Sport+Interior"
    ],
    features: ["12.3-inch touchscreen", "Apple CarPlay", "Android Auto", "Honda Sensing suite", "19-inch alloy wheels", "Sport styling", "Dual-zone climate control", "LED fog lights", "Rear decklid spoiler"],
    specs: {
      engine: "2.0L 4-Cylinder Hybrid",
      transmission: "cvt",
      drivetrain: "FWD",
      horsepower: 204,
      torque: 247,
      fuelType: "hybrid",
      fuelEconomy: { city: 51, highway: 44, combined: 48 },
      seatingCapacity: 5,
      cargoVolume: 16.7,
      curbWeight: 3530,
      dimensions: { length: 195.7, width: 73.3, height: 57.1, wheelbase: 111.4, groundClearance: 5.4 }
    },
    warranty: { basic: "3 years / 36,000 miles", powertrain: "5 years / 60,000 miles", corrosion: "5 years / unlimited miles", roadside: "3 years / 36,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-11",
    status: "in-stock"
  },
  {
    id: "lst-027",
    vin: "1HGCY2F70RA001202",
    brandId: "honda",
    modelId: "honda-accord",
    trimId: "accord-touring",
    variantId: "accord-touring-std",
    year: 2026,
    price: 39000,
    msrp: 38500,
    color: { exterior: { name: "Dark Blue", hex: "#00264D", type: "metallic", upcharge: 400 }, interior: "Ivory Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[0],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=Accord+Touring+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=Accord+Touring+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=Accord+Touring+Interior"
    ],
    features: ["12.3-inch touchscreen with wireless Apple CarPlay", "10.2-inch digital instrument cluster", "Honda Sensing suite", "Leather seats", "Heated and ventilated front seats", "Heated rear seats", "Power sunroof", "Bose premium audio", "Wireless charging pad", "Head-up display", "Parking sensors", "Rain-sensing wipers"],
    specs: {
      engine: "2.0L 4-Cylinder Hybrid",
      transmission: "cvt",
      drivetrain: "FWD",
      horsepower: 204,
      torque: 247,
      fuelType: "hybrid",
      fuelEconomy: { city: 48, highway: 42, combined: 46 },
      seatingCapacity: 5,
      cargoVolume: 16.7,
      curbWeight: 3615,
      dimensions: { length: 195.7, width: 73.3, height: 57.1, wheelbase: 111.4, groundClearance: 5.4 }
    },
    warranty: { basic: "3 years / 36,000 miles", powertrain: "5 years / 60,000 miles", corrosion: "5 years / unlimited miles", roadside: "3 years / 36,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-22",
    status: "in-stock"
  },

  // ─── KIA SPORTAGE LISTINGS ───────────────────────────────
  {
    id: "lst-028",
    vin: "KNDPM3AC0R7001301",
    brandId: "kia",
    modelId: "kia-sportage",
    trimId: "sportage-lx",
    variantId: "sportage-lx-std",
    year: 2026,
    price: 32000,
    msrp: 32000,
    color: { exterior: { name: "Silver", hex: "#C0C0C0", type: "metallic", upcharge: 200 }, interior: "Black Cloth" },
    mileage: 0,
    condition: "new",
    dealer: dealers[3],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=Sportage+LX+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=Sportage+LX+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=Sportage+LX+Rear"
    ],
    features: ["8-inch touchscreen", "Apple CarPlay", "Android Auto", "Forward collision avoidance", "Lane keeping assist", "Adaptive cruise control", "LED headlights", "Dual-zone climate control"],
    specs: {
      engine: "2.5L 4-Cylinder",
      transmission: "automatic",
      drivetrain: "AWD",
      horsepower: 187,
      torque: 178,
      fuelType: "gasoline",
      fuelEconomy: { city: 25, highway: 32, combined: 28 },
      seatingCapacity: 5,
      cargoVolume: 39.6,
      curbWeight: 3660,
      dimensions: { length: 183.5, width: 73.4, height: 66.1, wheelbase: 108.3, groundClearance: 7.1 }
    },
    warranty: { basic: "5 years / 60,000 miles", powertrain: "10 years / 100,000 miles", corrosion: "5 years / 100,000 miles", roadside: "5 years / 60,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-08",
    status: "in-stock"
  },
  {
    id: "lst-029",
    vin: "KNDPM3AC0R7001302",
    brandId: "kia",
    modelId: "kia-sportage",
    trimId: "sportage-ex",
    variantId: "sportage-ex-tech",
    year: 2026,
    price: 38500,
    msrp: 38500,
    color: { exterior: { name: "Red", hex: "#CC0000", type: "metallic", upcharge: 400 }, interior: "Gray Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[0],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=Sportage+EX+Tech+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=Sportage+EX+Tech+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=Sportage+EX+Tech+Interior"
    ],
    features: ["12.3-inch dual panoramic display", "Apple CarPlay", "Android Auto", "Forward collision avoidance", "Lane keeping assist", "Adaptive cruise control", "Leather seats", "Heated and ventilated front seats", "Power liftgate", "Blind spot monitor", "Panoramic sunroof", "Harman Kardon premium audio", "Wireless charging pad", "Parking sensors"],
    specs: {
      engine: "1.6L Turbo Hybrid",
      transmission: "automatic",
      drivetrain: "AWD",
      horsepower: 227,
      torque: 258,
      fuelType: "hybrid",
      fuelEconomy: { city: 42, highway: 44, combined: 43 },
      seatingCapacity: 5,
      cargoVolume: 39.6,
      curbWeight: 3825,
      dimensions: { length: 183.5, width: 73.4, height: 66.1, wheelbase: 108.3, groundClearance: 7.1 }
    },
    warranty: { basic: "5 years / 60,000 miles", powertrain: "10 years / 100,000 miles", corrosion: "5 years / 100,000 miles", roadside: "5 years / 60,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-12",
    status: "in-stock"
  },
  {
    id: "lst-030",
    vin: "KNDPM3AC0R7001303",
    brandId: "kia",
    modelId: "kia-sportage",
    trimId: "sportage-sx-prestige",
    variantId: "sportage-sx-prem",
    year: 2026,
    price: 42500,
    msrp: 42000,
    color: { exterior: { name: "Dark Blue", hex: "#00264D", type: "metallic", upcharge: 400 }, interior: "Black Nappa Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[2],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=Sportage+SX+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=Sportage+SX+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=Sportage+SX+Interior"
    ],
    features: ["12.3-inch dual panoramic display", "Apple CarPlay", "Android Auto", "Forward collision avoidance", "Highway driving assist 2", "Nappa leather seats", "Heated and ventilated front seats", "Heated rear seats", "Heated steering wheel", "Power liftgate", "Panoramic sunroof", "Harman Kardon premium audio", "Head-up display", "Surround view monitor", "Remote smart parking assist", "Dual-pane acoustic glass", "Digital key"],
    specs: {
      engine: "1.6L Turbo Hybrid",
      transmission: "automatic",
      drivetrain: "AWD",
      horsepower: 227,
      torque: 258,
      fuelType: "hybrid",
      fuelEconomy: { city: 42, highway: 44, combined: 43 },
      seatingCapacity: 5,
      cargoVolume: 39.6,
      curbWeight: 3900,
      dimensions: { length: 183.5, width: 73.4, height: 66.1, wheelbase: 108.3, groundClearance: 7.1 }
    },
    warranty: { basic: "5 years / 60,000 miles", powertrain: "10 years / 100,000 miles", corrosion: "5 years / 100,000 miles", roadside: "5 years / 60,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-19",
    status: "in-transit"
  },

  // ─── KIA EV6 LISTINGS ────────────────────────────────────
  {
    id: "lst-031",
    vin: "KNDC3DLC0R7001401",
    brandId: "kia",
    modelId: "kia-ev6",
    trimId: "ev6-light",
    variantId: "ev6-light-std",
    year: 2026,
    price: 43000,
    msrp: 43000,
    color: { exterior: { name: "White", hex: "#FFFFFF", type: "solid", upcharge: 0 }, interior: "Black Cloth" },
    mileage: 0,
    condition: "new",
    dealer: dealers[4],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=EV6+Light+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=EV6+Light+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=EV6+Light+Rear"
    ],
    features: ["12.3-inch dual display", "Apple CarPlay", "Android Auto", "Forward collision avoidance", "Lane keeping assist", "232-mile range", "350 kW DC ultra-fast charging", "Vehicle-to-load (V2L) capability", "LED headlights"],
    specs: {
      engine: "Single Electric Motor",
      transmission: "automatic",
      drivetrain: "RWD",
      horsepower: 225,
      torque: 258,
      fuelType: "electric",
      fuelEconomy: { city: 130, highway: 101, combined: 117 },
      seatingCapacity: 5,
      cargoVolume: 24.4,
      curbWeight: 4233,
      dimensions: { length: 184.8, width: 74.4, height: 60.8, wheelbase: 114.2, groundClearance: 6.3 }
    },
    warranty: { basic: "5 years / 60,000 miles", powertrain: "10 years / 100,000 miles", corrosion: "5 years / 100,000 miles", roadside: "5 years / 60,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-15",
    status: "in-stock"
  },
  {
    id: "lst-032",
    vin: "KNDC3DLC0R7001402",
    brandId: "kia",
    modelId: "kia-ev6",
    trimId: "ev6-wind",
    variantId: "ev6-wind-tech",
    year: 2026,
    price: 51500,
    msrp: 51000,
    color: { exterior: { name: "Blue", hex: "#003399", type: "metallic", upcharge: 400 }, interior: "Gray Vegan Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[1],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=EV6+Wind+Tech+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=EV6+Wind+Tech+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=EV6+Wind+Tech+Interior"
    ],
    features: ["12.3-inch dual display", "Apple CarPlay", "Android Auto", "Forward collision avoidance", "Highway driving assist 2", "274-mile range", "350 kW DC ultra-fast charging", "Heated and ventilated front seats", "Power liftgate", "Vehicle-to-load (V2L) capability", "Panoramic sunroof", "Meridian premium audio", "Surround view monitor", "Parking sensors"],
    specs: {
      engine: "Dual Electric Motors",
      transmission: "automatic",
      drivetrain: "AWD",
      horsepower: 320,
      torque: 446,
      fuelType: "electric",
      fuelEconomy: { city: 116, highway: 94, combined: 105 },
      seatingCapacity: 5,
      cargoVolume: 24.4,
      curbWeight: 4564,
      dimensions: { length: 184.8, width: 74.4, height: 60.8, wheelbase: 114.2, groundClearance: 6.3 }
    },
    warranty: { basic: "5 years / 60,000 miles", powertrain: "10 years / 100,000 miles", corrosion: "5 years / 100,000 miles", roadside: "5 years / 60,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-17",
    status: "in-stock"
  },
  {
    id: "lst-033",
    vin: "KNDC3DLC0R7001403",
    brandId: "kia",
    modelId: "kia-ev6",
    trimId: "ev6-gt-line",
    variantId: "ev6-gt-line-std",
    year: 2026,
    price: 54000,
    msrp: 54000,
    color: { exterior: { name: "Pearl White", hex: "#F5F5F0", type: "pearl", upcharge: 500 }, interior: "Black Nappa Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[0],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=EV6+GT-Line+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=EV6+GT-Line+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=EV6+GT-Line+Interior"
    ],
    features: ["12.3-inch dual curved display", "Apple CarPlay", "Android Auto", "Forward collision avoidance", "Highway driving assist 2", "Remote smart parking assist", "270-mile range", "350 kW DC ultra-fast charging", "Nappa leather seats", "Heated and ventilated front seats", "Heated rear seats", "Power liftgate", "Panoramic sunroof", "Meridian premium audio", "Head-up display", "Surround view monitor"],
    specs: {
      engine: "Dual Electric Motors",
      transmission: "automatic",
      drivetrain: "AWD",
      horsepower: 320,
      torque: 446,
      fuelType: "electric",
      fuelEconomy: { city: 113, highway: 90, combined: 101 },
      seatingCapacity: 5,
      cargoVolume: 24.4,
      curbWeight: 4600,
      dimensions: { length: 184.8, width: 74.4, height: 60.8, wheelbase: 114.2, groundClearance: 6.3 }
    },
    warranty: { basic: "5 years / 60,000 miles", powertrain: "10 years / 100,000 miles", corrosion: "5 years / 100,000 miles", roadside: "5 years / 60,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-21",
    status: "in-stock"
  },

  // ─── KIA K5 LISTINGS ─────────────────────────────────────
  {
    id: "lst-034",
    vin: "KNAGT4L36R5001501",
    brandId: "kia",
    modelId: "kia-k5",
    trimId: "k5-lxs",
    variantId: "k5-lxs-std",
    year: 2026,
    price: 28500,
    msrp: 28500,
    color: { exterior: { name: "White", hex: "#FFFFFF", type: "solid", upcharge: 0 }, interior: "Black Cloth" },
    mileage: 0,
    condition: "new",
    dealer: dealers[3],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=K5+LXS+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=K5+LXS+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=K5+LXS+Rear"
    ],
    features: ["8-inch touchscreen", "Apple CarPlay", "Android Auto", "Forward collision avoidance", "Lane keeping assist", "Adaptive cruise control", "LED headlights", "Dual-zone climate control", "16-inch alloy wheels"],
    specs: {
      engine: "1.6L Turbo 4-Cylinder",
      transmission: "automatic",
      drivetrain: "FWD",
      horsepower: 180,
      torque: 195,
      fuelType: "gasoline",
      fuelEconomy: { city: 29, highway: 38, combined: 32 },
      seatingCapacity: 5,
      cargoVolume: 16.0,
      curbWeight: 3325,
      dimensions: { length: 191.1, width: 72.8, height: 56.9, wheelbase: 112.2, groundClearance: 5.3 }
    },
    warranty: { basic: "5 years / 60,000 miles", powertrain: "10 years / 100,000 miles", corrosion: "5 years / 100,000 miles", roadside: "5 years / 60,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-09",
    status: "in-stock"
  },
  {
    id: "lst-035",
    vin: "KNAGT4L36R5001502",
    brandId: "kia",
    modelId: "kia-k5",
    trimId: "k5-gt-line",
    variantId: "k5-gt-line-tech",
    year: 2026,
    price: 33500,
    msrp: 33500,
    color: { exterior: { name: "Red", hex: "#CC0000", type: "metallic", upcharge: 400 }, interior: "Black Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[2],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=K5+GT-Line+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=K5+GT-Line+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=K5+GT-Line+Interior"
    ],
    features: ["12.3-inch touchscreen", "Apple CarPlay", "Android Auto", "Forward collision avoidance", "Highway driving assist", "Adaptive cruise control", "LED headlights", "Dual-zone climate control", "18-inch alloy wheels", "Sport styling package", "Leather seats", "Panoramic sunroof", "Bose premium audio", "Wireless charging pad", "Surround view monitor"],
    specs: {
      engine: "1.6L Turbo 4-Cylinder",
      transmission: "automatic",
      drivetrain: "FWD",
      horsepower: 180,
      torque: 195,
      fuelType: "gasoline",
      fuelEconomy: { city: 29, highway: 38, combined: 32 },
      seatingCapacity: 5,
      cargoVolume: 16.0,
      curbWeight: 3428,
      dimensions: { length: 191.1, width: 72.8, height: 56.9, wheelbase: 112.2, groundClearance: 5.3 }
    },
    warranty: { basic: "5 years / 60,000 miles", powertrain: "10 years / 100,000 miles", corrosion: "5 years / 100,000 miles", roadside: "5 years / 60,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-13",
    status: "in-stock"
  },
  {
    id: "lst-036",
    vin: "KNAGT4L36R5001503",
    brandId: "kia",
    modelId: "kia-k5",
    trimId: "k5-gt",
    variantId: "k5-gt-std",
    year: 2026,
    price: 34500,
    msrp: 34000,
    color: { exterior: { name: "Black", hex: "#000000", type: "metallic", upcharge: 200 }, interior: "Red/Black GT Sport Seats" },
    mileage: 0,
    condition: "new",
    dealer: dealers[4],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=K5+GT+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=K5+GT+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=K5+GT+Interior"
    ],
    features: ["12.3-inch touchscreen", "Apple CarPlay", "Android Auto", "Forward collision avoidance", "Highway driving assist", "GT sport seats", "Launch control", "19-inch alloy wheels", "Sport exhaust", "LED headlights", "Dual-zone climate control", "Bose premium audio"],
    specs: {
      engine: "2.5L Turbo 4-Cylinder",
      transmission: "dct",
      drivetrain: "FWD",
      horsepower: 290,
      torque: 311,
      fuelType: "gasoline",
      fuelEconomy: { city: 24, highway: 32, combined: 27 },
      seatingCapacity: 5,
      cargoVolume: 16.0,
      curbWeight: 3558,
      dimensions: { length: 191.1, width: 72.8, height: 56.9, wheelbase: 112.2, groundClearance: 5.3 }
    },
    warranty: { basic: "5 years / 60,000 miles", powertrain: "10 years / 100,000 miles", corrosion: "5 years / 100,000 miles", roadside: "5 years / 60,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-03-24",
    status: "in-stock"
  },

  // ─── ADDITIONAL LISTINGS FOR VARIETY ─────────────────────
  {
    id: "lst-037",
    vin: "4T1BZ1HK6RU000104",
    brandId: "toyota",
    modelId: "toyota-camry",
    trimId: "camry-se",
    variantId: "camry-se-std",
    year: 2026,
    price: 31500,
    msrp: 31000,
    color: { exterior: { name: "Red", hex: "#CC0000", type: "metallic", upcharge: 400 }, interior: "Black Sport Fabric" },
    mileage: 0,
    condition: "new",
    dealer: dealers[4],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=Camry+SE+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=Camry+SE+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=Camry+SE+Rear"
    ],
    features: ["9-inch touchscreen", "Apple CarPlay", "Android Auto", "Toyota Safety Sense 3.0", "Sport-tuned suspension", "18-inch alloy wheels", "Paddle shifters", "Dual-zone climate control", "LED headlights"],
    specs: {
      engine: "2.5L 4-Cylinder Hybrid",
      transmission: "cvt",
      drivetrain: "FWD",
      horsepower: 225,
      torque: 176,
      fuelType: "hybrid",
      fuelEconomy: { city: 44, highway: 47, combined: 46 },
      seatingCapacity: 5,
      cargoVolume: 15.1,
      curbWeight: 3572,
      dimensions: { length: 194.1, width: 72.4, height: 56.9, wheelbase: 111.2, groundClearance: 5.7 }
    },
    warranty: { basic: "3 years / 36,000 miles", powertrain: "5 years / 60,000 miles", corrosion: "5 years / unlimited miles", roadside: "2 years / 25,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-04-01",
    status: "in-stock"
  },
  {
    id: "lst-038",
    vin: "WBA53BJ06RWP00404",
    brandId: "bmw",
    modelId: "bmw-3series",
    trimId: "3series-330i",
    variantId: "330i-exec",
    year: 2026,
    price: 51500,
    msrp: 50900,
    color: { exterior: { name: "Tanzanite Blue", hex: "#1A1B4B", type: "metallic", upcharge: 625 }, interior: "Oyster Vernasca Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[1],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=330i+Exec+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=330i+Exec+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=330i+Exec+Interior"
    ],
    features: ["12.3-inch digital instrument cluster", "14.9-inch infotainment display", "Vernasca leather upholstery", "Heated front seats", "Heated steering wheel", "Power tailgate", "Ambient lighting", "Harman Kardon surround sound", "Parking assistant plus", "Head-up display", "Gesture control", "Comfort access", "Soft-close doors"],
    specs: {
      engine: "2.0L TwinPower Turbo 4-Cylinder",
      transmission: "automatic",
      drivetrain: "RWD",
      horsepower: 255,
      torque: 295,
      fuelType: "gasoline",
      fuelEconomy: { city: 26, highway: 36, combined: 30 },
      seatingCapacity: 5,
      cargoVolume: 17.0,
      curbWeight: 3660,
      dimensions: { length: 187.6, width: 71.9, height: 56.8, wheelbase: 112.2, groundClearance: 5.5 }
    },
    warranty: { basic: "4 years / 50,000 miles", powertrain: "4 years / 50,000 miles", corrosion: "12 years / unlimited miles", roadside: "4 years / unlimited miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-04-02",
    status: "in-transit"
  },
  {
    id: "lst-039",
    vin: "W1KZF8DB6RA000704",
    brandId: "mercedes",
    modelId: "mercedes-cclass",
    trimId: "cclass-c300-4matic",
    variantId: "c300-4matic-exclusive",
    year: 2026,
    price: 51000,
    msrp: 51000,
    color: { exterior: { name: "Spectral Blue", hex: "#1A3355", type: "metallic", upcharge: 720 }, interior: "Black MB-Tex" },
    mileage: 0,
    condition: "new",
    dealer: dealers[3],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=C300+4MATIC+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=C300+4MATIC+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=C300+4MATIC+Interior"
    ],
    features: ["11.9-inch OLED central display", "12.3-inch digital instrument cluster", "MB-Tex upholstery", "Heated front seats", "64-color ambient lighting", "Burmester surround sound", "4MATIC all-wheel drive", "Active parking assist"],
    specs: {
      engine: "2.0L Turbo 4-Cylinder with EQ Boost",
      transmission: "automatic",
      drivetrain: "AWD",
      horsepower: 255,
      torque: 295,
      fuelType: "gasoline",
      fuelEconomy: { city: 24, highway: 33, combined: 28 },
      seatingCapacity: 5,
      cargoVolume: 12.6,
      curbWeight: 3830,
      dimensions: { length: 187.5, width: 71.8, height: 56.6, wheelbase: 112.8, groundClearance: 4.5 }
    },
    warranty: { basic: "4 years / 50,000 miles", powertrain: "4 years / 50,000 miles", corrosion: "4 years / 50,000 miles", roadside: "4 years / 50,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-04-03",
    status: "in-stock"
  },
  {
    id: "lst-040",
    vin: "2HGFE2F50RH001004",
    brandId: "honda",
    modelId: "honda-civic",
    trimId: "civic-sport",
    variantId: "civic-sport-std",
    year: 2026,
    price: 27000,
    msrp: 27000,
    color: { exterior: { name: "Blue", hex: "#003399", type: "metallic", upcharge: 400 }, interior: "Black Cloth" },
    mileage: 0,
    condition: "new",
    dealer: dealers[1],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=Civic+Sport+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=Civic+Sport+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=Civic+Sport+Rear"
    ],
    features: ["9-inch touchscreen", "Apple CarPlay", "Android Auto", "Honda Sensing suite", "Sport pedals", "18-inch alloy wheels", "LED headlights", "Dual-zone climate control", "Rear decklid spoiler"],
    specs: {
      engine: "1.5L Turbo 4-Cylinder",
      transmission: "cvt",
      drivetrain: "FWD",
      horsepower: 180,
      torque: 177,
      fuelType: "gasoline",
      fuelEconomy: { city: 30, highway: 37, combined: 33 },
      seatingCapacity: 5,
      cargoVolume: 14.8,
      curbWeight: 2980,
      dimensions: { length: 184.0, width: 70.9, height: 55.7, wheelbase: 107.7, groundClearance: 5.1 }
    },
    warranty: { basic: "3 years / 36,000 miles", powertrain: "5 years / 60,000 miles", corrosion: "5 years / unlimited miles", roadside: "3 years / 36,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-04-04",
    status: "in-stock"
  },
  {
    id: "lst-041",
    vin: "KNDC3DLC0R7001404",
    brandId: "kia",
    modelId: "kia-ev6",
    trimId: "ev6-gt-line",
    variantId: "ev6-gt-line-prem",
    year: 2026,
    price: 56500,
    msrp: 56000,
    color: { exterior: { name: "Dark Blue", hex: "#00264D", type: "metallic", upcharge: 400 }, interior: "Black Nappa Leather" },
    mileage: 0,
    condition: "new",
    dealer: dealers[2],
    images: [
      "https://placehold.co/600x400/e9ebf2/324575?text=EV6+GT-Line+Prem+Front",
      "https://placehold.co/600x400/e9ebf2/324575?text=EV6+GT-Line+Prem+Side",
      "https://placehold.co/600x400/e9ebf2/324575?text=EV6+GT-Line+Prem+Interior"
    ],
    features: ["12.3-inch dual curved display", "Apple CarPlay", "Android Auto", "Forward collision avoidance", "Highway driving assist 2", "Remote smart parking assist", "270-mile range", "350 kW DC ultra-fast charging", "Nappa leather seats", "Heated and ventilated front seats", "Heated rear seats", "Heated steering wheel", "Power liftgate", "Panoramic sunroof", "Meridian premium audio", "Head-up display", "Surround view monitor", "Digital key", "Dual-pane acoustic glass"],
    specs: {
      engine: "Dual Electric Motors",
      transmission: "automatic",
      drivetrain: "AWD",
      horsepower: 320,
      torque: 446,
      fuelType: "electric",
      fuelEconomy: { city: 113, highway: 90, combined: 101 },
      seatingCapacity: 5,
      cargoVolume: 24.4,
      curbWeight: 4620,
      dimensions: { length: 184.8, width: 74.4, height: 60.8, wheelbase: 114.2, groundClearance: 6.3 }
    },
    warranty: { basic: "5 years / 60,000 miles", powertrain: "10 years / 100,000 miles", corrosion: "5 years / 100,000 miles", roadside: "5 years / 60,000 miles" },
    safetyRating: { nhtsa: 5, iihsTopPick: true },
    addedDate: "2026-04-05",
    status: "build-to-order"
  }
];

export function getListingById(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}

export function getListingsForBrand(brandId: string): Listing[] {
  return listings.filter((l) => l.brandId === brandId);
}

export function filterListings(filters: Partial<Filters>): Listing[] {
  let result = [...listings];

  if (filters.brandId) {
    result = result.filter((l) => l.brandId === filters.brandId);
  }

  if (filters.modelIds && filters.modelIds.length > 0) {
    result = result.filter((l) => filters.modelIds!.includes(l.modelId));
  }

  if (filters.trimIds && filters.trimIds.length > 0) {
    result = result.filter((l) => filters.trimIds!.includes(l.trimId));
  }

  if (filters.variantIds && filters.variantIds.length > 0) {
    result = result.filter((l) => filters.variantIds!.includes(l.variantId));
  }

  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    result = result.filter((l) => l.price >= min && l.price <= max);
  }

  if (filters.bodyTypes && filters.bodyTypes.length > 0) {
    result = result.filter((l) => {
      const bodyType = getBodyTypeForListing(l);
      return bodyType ? filters.bodyTypes!.includes(bodyType) : false;
    });
  }

  if (filters.fuelTypes && filters.fuelTypes.length > 0) {
    result = result.filter((l) => filters.fuelTypes!.includes(l.specs.fuelType));
  }

  if (filters.transmissions && filters.transmissions.length > 0) {
    result = result.filter((l) => filters.transmissions!.includes(l.specs.transmission));
  }

  if (filters.drivetrains && filters.drivetrains.length > 0) {
    result = result.filter((l) => filters.drivetrains!.includes(l.specs.drivetrain));
  }

  if (filters.exteriorColors && filters.exteriorColors.length > 0) {
    result = result.filter((l) =>
      filters.exteriorColors!.some(
        (c) => l.color.exterior.name.toLowerCase() === c.toLowerCase()
      )
    );
  }

  if (filters.features && filters.features.length > 0) {
    result = result.filter((l) =>
      filters.features!.every((f) =>
        l.features.some((lf) => lf.toLowerCase().includes(f.toLowerCase()))
      )
    );
  }

  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
        break;
      case "hp-desc":
        result.sort((a, b) => b.specs.horsepower - a.specs.horsepower);
        break;
      case "mpg-desc":
        result.sort((a, b) => b.specs.fuelEconomy.combined - a.specs.fuelEconomy.combined);
        break;
    }
  }

  return result;
}

import { brands } from "./brands";
import { BodyType } from "@/types";

function getBodyTypeForListing(listing: Listing): BodyType | undefined {
  const brand = brands.find((b) => b.id === listing.brandId);
  if (!brand) return undefined;
  const model = brand.models.find((m) => m.id === listing.modelId);
  return model?.bodyType;
}
