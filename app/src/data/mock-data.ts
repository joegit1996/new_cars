import {
  type Brand, type Model, type Trim, type Branch, type LifestyleCollection,
  BodyType, FuelType, TransmissionType, DriveType, SpecRegion, EquipmentCategory,
} from "./types";

const img = "/images/placeholder-car.svg";

// ============ BRANDS ============
export const brands: Brand[] = [
  { id: "mercedes", name: "Mercedes-Benz", logoUrl: img, modelCount: 5, featured: true, tagline: "The best or nothing" },
  { id: "bmw", name: "BMW", logoUrl: img, modelCount: 5, featured: true, tagline: "Sheer driving pleasure" },
  { id: "toyota", name: "Toyota", logoUrl: img, modelCount: 5, featured: true, tagline: "Let's go places" },
  { id: "lexus", name: "Lexus", logoUrl: img, modelCount: 4 },
  { id: "porsche", name: "Porsche", logoUrl: img, modelCount: 4, featured: true, tagline: "There is no substitute" },
  { id: "changan", name: "Changan", logoUrl: img, modelCount: 4 },
  { id: "haval", name: "Haval", logoUrl: img, modelCount: 3 },
  { id: "mg", name: "MG", logoUrl: img, modelCount: 4 },
];

// Helper to build equipment lists
function eq(items: [string, string, boolean][]) {
  return items.map(([name, cat, std]) => ({
    name,
    category: cat as EquipmentCategory,
    isStandard: std,
  }));
}

// Helper to build a spec object
function spec(
  p: Partial<{
    et: string; disp: number; cyl: number; hp: number; tq: number;
    z: number; ts: number; fc: number; fh: number; fcm: number;
    tr: TransmissionType; dr: DriveType;
    l: number; w: number; h: number; wb: number;
    trunk: number; wt: number; tank: number; seat: number;
    warranty: string; region: SpecRegion;
  }>
) {
  return {
    engineType: p.et || "Inline-4 Turbo",
    displacement: p.disp || 2.0,
    cylinders: p.cyl || 4,
    horsepower: p.hp || 200,
    torque: p.tq || 300,
    zeroToHundred: p.z || 7.5,
    topSpeed: p.ts || 240,
    fuelEconomyCity: p.fc || 9.5,
    fuelEconomyHighway: p.fh || 6.5,
    fuelEconomyCombined: p.fcm || 7.8,
    transmission: p.tr || TransmissionType.Automatic,
    driveType: p.dr || DriveType.RWD,
    lengthMm: p.l || 4686,
    widthMm: p.w || 1810,
    heightMm: p.h || 1442,
    wheelbaseMm: p.wb || 2865,
    trunkVolumeLiters: p.trunk || 455,
    curbWeightKg: p.wt || 1550,
    fuelTankLiters: p.tank || 66,
    seatingCapacity: p.seat || 5,
    warranty: p.warranty || "5 years / 100,000 km",
    specRegion: p.region || SpecRegion.GCC,
  };
}

const safetyEquip = eq([
  ["Adaptive Cruise Control", EquipmentCategory.Safety, true],
  ["Lane Keep Assist", EquipmentCategory.Safety, true],
  ["Blind Spot Monitor", EquipmentCategory.Safety, true],
  ["360 Camera", EquipmentCategory.Safety, false],
  ["Automatic Emergency Braking", EquipmentCategory.Safety, true],
]);

const comfortEquip = eq([
  ["Dual-Zone Climate Control", EquipmentCategory.Comfort, true],
  ["Heated Seats", EquipmentCategory.Comfort, false],
  ["Ventilated Seats", EquipmentCategory.Comfort, false],
  ["Power Tailgate", EquipmentCategory.Comfort, false],
  ["Keyless Entry & Start", EquipmentCategory.Comfort, true],
]);

const techEquip = eq([
  ["12.3-inch Infotainment Display", EquipmentCategory.Technology, true],
  ["Digital Instrument Cluster", EquipmentCategory.Technology, true],
  ["Wireless Apple CarPlay", EquipmentCategory.Technology, true],
  ["Head-Up Display", EquipmentCategory.Technology, false],
  ["Wireless Charging", EquipmentCategory.Technology, false],
]);

const baseEquip = [...safetyEquip, ...comfortEquip, ...techEquip];

const premiumEquip = baseEquip.map((e) => ({ ...e, isStandard: true }));

// ============ TRIMS ============
export const trims: Trim[] = [
  // --- Mercedes C-Class Sedan ---
  {
    id: "merc-c200", modelId: "merc-c-sedan", name: "C 200", price: 13500,
    engineSummary: "1.5L 4-cyl Turbo, 204 hp", horsepower: 204, torque: 300,
    fuelType: FuelType.Petrol, images: [img], variants: [
      { id: "merc-c200-avg", trimId: "merc-c200", name: "Avantgarde", price: 14200, description: "Elegant styling package", images: [img, img, img] },
      { id: "merc-c200-amg", trimId: "merc-c200", name: "AMG Line", price: 15100, description: "Sporty AMG exterior and interior", images: [img, img, img] },
    ],
    specs: spec({ disp: 1.5, hp: 204, tq: 300, z: 7.3, ts: 246, dr: DriveType.RWD }),
    equipment: baseEquip,
  },
  {
    id: "merc-c300", modelId: "merc-c-sedan", name: "C 300", price: 16800,
    engineSummary: "2.0L 4-cyl Turbo, 258 hp", horsepower: 258, torque: 400,
    fuelType: FuelType.Petrol, images: [img], variants: [
      { id: "merc-c300-amg", trimId: "merc-c300", name: "AMG Line", price: 18200, description: "Sporty AMG package with 258 hp", images: [img, img, img] },
    ],
    specs: spec({ disp: 2.0, hp: 258, tq: 400, z: 6.0, ts: 250 }),
    equipment: premiumEquip,
  },
  {
    id: "merc-c43", modelId: "merc-c-sedan", name: "C 43 AMG", price: 24500,
    engineSummary: "2.0L 4-cyl Turbo, 408 hp", horsepower: 408, torque: 500,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ disp: 2.0, hp: 408, tq: 500, z: 4.6, ts: 265, dr: DriveType.AWD }),
    equipment: premiumEquip,
  },

  // --- Mercedes E-Class Sedan ---
  {
    id: "merc-e200", modelId: "merc-e-sedan", name: "E 200", price: 18500,
    engineSummary: "2.0L 4-cyl Turbo, 204 hp", horsepower: 204, torque: 320,
    fuelType: FuelType.Petrol, images: [img], variants: [
      { id: "merc-e200-amg", trimId: "merc-e200", name: "AMG Line", price: 20200, description: "AMG styling package", images: [img, img, img] },
    ],
    specs: spec({ disp: 2.0, hp: 204, tq: 320, z: 7.5, ts: 240, l: 4942, wb: 2939, trunk: 540 }),
    equipment: baseEquip,
  },
  {
    id: "merc-e300", modelId: "merc-e-sedan", name: "E 300", price: 22000,
    engineSummary: "2.0L 4-cyl Turbo, 258 hp", horsepower: 258, torque: 400,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ disp: 2.0, hp: 258, tq: 400, z: 6.2, ts: 250, l: 4942, wb: 2939, trunk: 540 }),
    equipment: premiumEquip,
  },

  // --- Mercedes GLC SUV ---
  {
    id: "merc-glc200", modelId: "merc-glc", name: "GLC 200", price: 17500,
    engineSummary: "2.0L 4-cyl Turbo, 204 hp", horsepower: 204, torque: 320,
    fuelType: FuelType.Petrol, images: [img], variants: [
      { id: "merc-glc200-amg", trimId: "merc-glc200", name: "AMG Line", price: 19000, description: "AMG exterior styling", images: [img, img, img] },
    ],
    specs: spec({ hp: 204, tq: 320, z: 7.8, ts: 220, h: 1640, trunk: 620, dr: DriveType.AWD, seat: 5 }),
    equipment: baseEquip,
  },
  {
    id: "merc-glc300", modelId: "merc-glc", name: "GLC 300", price: 21000,
    engineSummary: "2.0L 4-cyl Turbo, 258 hp", horsepower: 258, torque: 400,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ hp: 258, tq: 400, z: 6.4, ts: 240, h: 1640, trunk: 620, dr: DriveType.AWD }),
    equipment: premiumEquip,
  },

  // --- Mercedes GLE SUV ---
  {
    id: "merc-gle450", modelId: "merc-gle", name: "GLE 450", price: 28000,
    engineSummary: "3.0L 6-cyl Turbo, 367 hp", horsepower: 367, torque: 500,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "Inline-6 Turbo", disp: 3.0, cyl: 6, hp: 367, tq: 500, z: 5.7, ts: 250, h: 1796, l: 4924, trunk: 630, dr: DriveType.AWD, seat: 5, wt: 2170 }),
    equipment: premiumEquip,
  },
  {
    id: "merc-gle53", modelId: "merc-gle", name: "AMG GLE 53", price: 38000,
    engineSummary: "3.0L 6-cyl Turbo, 429 hp", horsepower: 429, torque: 520,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "Inline-6 Turbo", disp: 3.0, cyl: 6, hp: 429, tq: 520, z: 5.3, ts: 250, h: 1796, l: 4924, trunk: 630, dr: DriveType.AWD, wt: 2220 }),
    equipment: premiumEquip,
  },

  // --- Mercedes A-Class ---
  {
    id: "merc-a200", modelId: "merc-a-class", name: "A 200", price: 11000,
    engineSummary: "1.3L 4-cyl Turbo, 163 hp", horsepower: 163, torque: 250,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ disp: 1.3, hp: 163, tq: 250, z: 8.1, ts: 225, l: 4419, h: 1440, trunk: 370 }),
    equipment: baseEquip,
  },
  {
    id: "merc-a250", modelId: "merc-a-class", name: "A 250", price: 13800,
    engineSummary: "2.0L 4-cyl Turbo, 224 hp", horsepower: 224, torque: 350,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ disp: 2.0, hp: 224, tq: 350, z: 6.5, ts: 250, l: 4419, h: 1440, trunk: 370 }),
    equipment: premiumEquip,
  },

  // --- BMW 3 Series ---
  {
    id: "bmw-320i", modelId: "bmw-3-series", name: "320i", price: 12800,
    engineSummary: "2.0L 4-cyl Turbo, 184 hp", horsepower: 184, torque: 300,
    fuelType: FuelType.Petrol, images: [img], variants: [
      { id: "bmw-320i-sport", trimId: "bmw-320i", name: "Sport Line", price: 13500, description: "Sport styling package", images: [img, img, img] },
      { id: "bmw-320i-lux", trimId: "bmw-320i", name: "Luxury Line", price: 13800, description: "Premium luxury trim", images: [img, img, img] },
    ],
    specs: spec({ hp: 184, tq: 300, z: 7.1, ts: 246, l: 4713 }),
    equipment: baseEquip,
  },
  {
    id: "bmw-330i", modelId: "bmw-3-series", name: "330i", price: 15500,
    engineSummary: "2.0L 4-cyl Turbo, 258 hp", horsepower: 258, torque: 400,
    fuelType: FuelType.Petrol, images: [img], variants: [
      { id: "bmw-330i-msport", trimId: "bmw-330i", name: "M Sport", price: 16800, description: "M Sport package with enhanced dynamics", images: [img, img, img] },
    ],
    specs: spec({ hp: 258, tq: 400, z: 5.8, ts: 250, l: 4713 }),
    equipment: premiumEquip,
  },
  {
    id: "bmw-m340i", modelId: "bmw-3-series", name: "M340i", price: 21500,
    engineSummary: "3.0L 6-cyl Turbo, 374 hp", horsepower: 374, torque: 500,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "Inline-6 Turbo", disp: 3.0, cyl: 6, hp: 374, tq: 500, z: 4.4, ts: 250, dr: DriveType.AWD, l: 4713 }),
    equipment: premiumEquip,
  },

  // --- BMW 5 Series ---
  {
    id: "bmw-520i", modelId: "bmw-5-series", name: "520i", price: 18000,
    engineSummary: "2.0L 4-cyl Turbo, 208 hp", horsepower: 208, torque: 330,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ hp: 208, tq: 330, z: 7.0, ts: 245, l: 5060, wb: 2995, trunk: 520 }),
    equipment: baseEquip,
  },
  {
    id: "bmw-530i", modelId: "bmw-5-series", name: "530i", price: 22000,
    engineSummary: "2.0L 4-cyl Turbo, 245 hp", horsepower: 245, torque: 400,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ hp: 245, tq: 400, z: 6.2, ts: 250, l: 5060, wb: 2995, trunk: 520 }),
    equipment: premiumEquip,
  },

  // --- BMW X3 ---
  {
    id: "bmw-x3-20", modelId: "bmw-x3", name: "xDrive20i", price: 16500,
    engineSummary: "2.0L 4-cyl Turbo, 184 hp", horsepower: 184, torque: 300,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ hp: 184, tq: 300, z: 8.2, ts: 215, h: 1676, trunk: 550, dr: DriveType.AWD }),
    equipment: baseEquip,
  },
  {
    id: "bmw-x3-30", modelId: "bmw-x3", name: "xDrive30i", price: 20000,
    engineSummary: "2.0L 4-cyl Turbo, 245 hp", horsepower: 245, torque: 400,
    fuelType: FuelType.Petrol, images: [img], variants: [
      { id: "bmw-x3-30-msport", trimId: "bmw-x3-30", name: "M Sport", price: 21500, description: "M Sport design package", images: [img, img, img] },
    ],
    specs: spec({ hp: 245, tq: 400, z: 6.6, ts: 240, h: 1676, trunk: 550, dr: DriveType.AWD }),
    equipment: premiumEquip,
  },

  // --- BMW X5 ---
  {
    id: "bmw-x5-40i", modelId: "bmw-x5", name: "xDrive40i", price: 28500,
    engineSummary: "3.0L 6-cyl Turbo, 340 hp", horsepower: 340, torque: 450,
    fuelType: FuelType.Petrol, images: [img], variants: [
      { id: "bmw-x5-40i-msport", trimId: "bmw-x5-40i", name: "M Sport", price: 30000, description: "M Sport package", images: [img, img, img] },
    ],
    specs: spec({ et: "Inline-6 Turbo", disp: 3.0, cyl: 6, hp: 340, tq: 450, z: 5.5, ts: 243, h: 1745, l: 4935, trunk: 650, dr: DriveType.AWD, seat: 5, wt: 2135 }),
    equipment: premiumEquip,
  },
  {
    id: "bmw-x5-m50i", modelId: "bmw-x5", name: "M50i", price: 38000,
    engineSummary: "4.4L V8 Turbo, 530 hp", horsepower: 530, torque: 750,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "V8 Twin-Turbo", disp: 4.4, cyl: 8, hp: 530, tq: 750, z: 4.3, ts: 250, h: 1745, l: 4935, trunk: 650, dr: DriveType.AWD, wt: 2310 }),
    equipment: premiumEquip,
  },

  // --- BMW 4 Series Coupe ---
  {
    id: "bmw-420i", modelId: "bmw-4-coupe", name: "420i", price: 16000,
    engineSummary: "2.0L 4-cyl Turbo, 184 hp", horsepower: 184, torque: 300,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ hp: 184, tq: 300, z: 7.5, ts: 240, l: 4773, h: 1383, trunk: 440 }),
    equipment: baseEquip,
  },
  {
    id: "bmw-m440i", modelId: "bmw-4-coupe", name: "M440i", price: 23000,
    engineSummary: "3.0L 6-cyl Turbo, 374 hp", horsepower: 374, torque: 500,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "Inline-6 Turbo", disp: 3.0, cyl: 6, hp: 374, tq: 500, z: 4.7, ts: 250, l: 4773, h: 1383, trunk: 440, dr: DriveType.AWD }),
    equipment: premiumEquip,
  },

  // --- Toyota Camry ---
  {
    id: "toy-camry-le", modelId: "toyota-camry", name: "LE", price: 7800,
    engineSummary: "2.5L 4-cyl, 203 hp", horsepower: 203, torque: 250,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "Inline-4", disp: 2.5, hp: 203, tq: 250, z: 8.3, ts: 210, fc: 8.5, fh: 6.0, fcm: 7.0, dr: DriveType.FWD, l: 4885, trunk: 428, warranty: "3 years / 100,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "toy-camry-se", modelId: "toyota-camry", name: "SE", price: 8500,
    engineSummary: "2.5L 4-cyl, 203 hp", horsepower: 203, torque: 250,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "Inline-4", disp: 2.5, hp: 203, tq: 250, z: 8.3, ts: 210, dr: DriveType.FWD, l: 4885, trunk: 428, warranty: "3 years / 100,000 km" }),
    equipment: premiumEquip,
  },
  {
    id: "toy-camry-v6", modelId: "toyota-camry", name: "Grande V6", price: 10500,
    engineSummary: "3.5L V6, 301 hp", horsepower: 301, torque: 362,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "V6", disp: 3.5, cyl: 6, hp: 301, tq: 362, z: 6.1, ts: 235, dr: DriveType.FWD, l: 4885, trunk: 428, warranty: "3 years / 100,000 km" }),
    equipment: premiumEquip,
  },

  // --- Toyota Land Cruiser ---
  {
    id: "toy-lc-gxr", modelId: "toyota-lc", name: "GXR", price: 22000,
    engineSummary: "3.5L V6 Twin-Turbo, 409 hp", horsepower: 409, torque: 650,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "V6 Twin-Turbo", disp: 3.5, cyl: 6, hp: 409, tq: 650, z: 6.7, ts: 210, fc: 14.0, fh: 10.0, fcm: 12.0, dr: DriveType.FourWD, l: 4985, h: 1935, trunk: 1131, seat: 7, wt: 2490, tank: 110, warranty: "3 years / 100,000 km" }),
    equipment: premiumEquip,
  },
  {
    id: "toy-lc-vxr", modelId: "toyota-lc", name: "VXR", price: 28000,
    engineSummary: "3.5L V6 Twin-Turbo, 409 hp", horsepower: 409, torque: 650,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "V6 Twin-Turbo", disp: 3.5, cyl: 6, hp: 409, tq: 650, z: 6.7, ts: 210, fc: 14.0, fh: 10.0, fcm: 12.0, dr: DriveType.FourWD, l: 4985, h: 1935, trunk: 1131, seat: 7, wt: 2530, tank: 110, warranty: "3 years / 100,000 km" }),
    equipment: premiumEquip,
  },

  // --- Toyota RAV4 ---
  {
    id: "toy-rav4-le", modelId: "toyota-rav4", name: "LE", price: 9200,
    engineSummary: "2.0L 4-cyl, 170 hp", horsepower: 170, torque: 203,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "Inline-4", disp: 2.0, hp: 170, tq: 203, z: 9.8, ts: 190, dr: DriveType.FWD, h: 1685, trunk: 580, warranty: "3 years / 100,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "toy-rav4-xle", modelId: "toyota-rav4", name: "XLE Hybrid", price: 11500,
    engineSummary: "2.5L Hybrid, 219 hp", horsepower: 219, torque: 221,
    fuelType: FuelType.Hybrid, images: [img], variants: [],
    specs: spec({ et: "Hybrid", disp: 2.5, hp: 219, tq: 221, z: 7.8, ts: 180, fc: 5.8, fh: 5.0, fcm: 5.4, dr: DriveType.AWD, h: 1685, trunk: 580, warranty: "3 years / 100,000 km" }),
    equipment: premiumEquip,
  },

  // --- Toyota Corolla ---
  {
    id: "toy-corolla-xli", modelId: "toyota-corolla", name: "XLI", price: 5800,
    engineSummary: "1.6L 4-cyl, 121 hp", horsepower: 121, torque: 154,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "Inline-4", disp: 1.6, hp: 121, tq: 154, z: 11.2, ts: 185, dr: DriveType.FWD, l: 4630, trunk: 470, warranty: "3 years / 100,000 km", tr: TransmissionType.CVT }),
    equipment: baseEquip,
  },
  {
    id: "toy-corolla-gli", modelId: "toyota-corolla", name: "GLI", price: 6500,
    engineSummary: "2.0L 4-cyl, 168 hp", horsepower: 168, torque: 205,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "Inline-4", disp: 2.0, hp: 168, tq: 205, z: 9.0, ts: 200, dr: DriveType.FWD, l: 4630, trunk: 470, warranty: "3 years / 100,000 km", tr: TransmissionType.CVT }),
    equipment: premiumEquip,
  },

  // --- Toyota Hilux ---
  {
    id: "toy-hilux-sr", modelId: "toyota-hilux", name: "SR5", price: 10500,
    engineSummary: "2.8L Diesel Turbo, 204 hp", horsepower: 204, torque: 500,
    fuelType: FuelType.Diesel, images: [img], variants: [],
    specs: spec({ et: "Diesel Turbo", disp: 2.8, hp: 204, tq: 500, z: 10.0, ts: 175, fc: 10.5, fh: 7.5, fcm: 8.8, dr: DriveType.FourWD, l: 5325, h: 1815, trunk: 0, seat: 5, wt: 2070, tank: 80, warranty: "3 years / 100,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "toy-hilux-trd", modelId: "toyota-hilux", name: "TRD Sport", price: 13000,
    engineSummary: "2.8L Diesel Turbo, 204 hp", horsepower: 204, torque: 500,
    fuelType: FuelType.Diesel, images: [img], variants: [],
    specs: spec({ et: "Diesel Turbo", disp: 2.8, hp: 204, tq: 500, z: 10.0, ts: 175, dr: DriveType.FourWD, l: 5325, h: 1815, seat: 5, wt: 2100, tank: 80, warranty: "3 years / 100,000 km" }),
    equipment: premiumEquip,
  },

  // --- Lexus ES ---
  {
    id: "lex-es250", modelId: "lexus-es", name: "ES 250", price: 12500,
    engineSummary: "2.5L 4-cyl, 203 hp", horsepower: 203, torque: 250,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "Inline-4", disp: 2.5, hp: 203, tq: 250, z: 8.9, ts: 210, dr: DriveType.FWD, l: 4975 }),
    equipment: baseEquip,
  },
  {
    id: "lex-es350", modelId: "lexus-es", name: "ES 350", price: 15500,
    engineSummary: "3.5L V6, 302 hp", horsepower: 302, torque: 362,
    fuelType: FuelType.Petrol, images: [img], variants: [
      { id: "lex-es350-fsport", trimId: "lex-es350", name: "F Sport", price: 17000, description: "F Sport performance styling", images: [img, img, img] },
    ],
    specs: spec({ et: "V6", disp: 3.5, cyl: 6, hp: 302, tq: 362, z: 6.1, ts: 240, dr: DriveType.FWD, l: 4975 }),
    equipment: premiumEquip,
  },

  // --- Lexus RX ---
  {
    id: "lex-rx350", modelId: "lexus-rx", name: "RX 350", price: 19500,
    engineSummary: "2.4L Turbo, 275 hp", horsepower: 275, torque: 430,
    fuelType: FuelType.Petrol, images: [img], variants: [
      { id: "lex-rx350-fsport", trimId: "lex-rx350", name: "F Sport", price: 21500, description: "F Sport design", images: [img, img, img] },
    ],
    specs: spec({ et: "Inline-4 Turbo", disp: 2.4, hp: 275, tq: 430, z: 7.2, ts: 210, dr: DriveType.AWD, h: 1705, trunk: 612 }),
    equipment: premiumEquip,
  },
  {
    id: "lex-rx500h", modelId: "lexus-rx", name: "RX 500h", price: 26000,
    engineSummary: "2.4L Turbo Hybrid, 366 hp", horsepower: 366, torque: 460,
    fuelType: FuelType.Hybrid, images: [img], variants: [],
    specs: spec({ et: "Turbo Hybrid", disp: 2.4, hp: 366, tq: 460, z: 6.0, ts: 220, fc: 7.5, fh: 6.5, fcm: 7.0, dr: DriveType.AWD, h: 1705, trunk: 612 }),
    equipment: premiumEquip,
  },

  // --- Lexus NX ---
  {
    id: "lex-nx250", modelId: "lexus-nx", name: "NX 250", price: 14000,
    engineSummary: "2.5L 4-cyl, 203 hp", horsepower: 203, torque: 250,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "Inline-4", disp: 2.5, hp: 203, tq: 250, z: 8.5, ts: 200, dr: DriveType.FWD, h: 1660, trunk: 520 }),
    equipment: baseEquip,
  },
  {
    id: "lex-nx350h", modelId: "lexus-nx", name: "NX 350h", price: 17500,
    engineSummary: "2.5L Hybrid, 239 hp", horsepower: 239, torque: 270,
    fuelType: FuelType.Hybrid, images: [img], variants: [],
    specs: spec({ et: "Hybrid", disp: 2.5, hp: 239, tq: 270, z: 7.7, ts: 200, fc: 5.5, fh: 5.0, fcm: 5.2, dr: DriveType.AWD, h: 1660, trunk: 520 }),
    equipment: premiumEquip,
  },

  // --- Lexus IS ---
  {
    id: "lex-is300", modelId: "lexus-is", name: "IS 300", price: 14500,
    engineSummary: "2.0L 4-cyl Turbo, 241 hp", horsepower: 241, torque: 350,
    fuelType: FuelType.Petrol, images: [img], variants: [
      { id: "lex-is300-fsport", trimId: "lex-is300", name: "F Sport", price: 16000, description: "F Sport handling package", images: [img, img, img] },
    ],
    specs: spec({ hp: 241, tq: 350, z: 6.9, ts: 230, l: 4710 }),
    equipment: baseEquip,
  },
  {
    id: "lex-is500", modelId: "lexus-is", name: "IS 500", price: 24000,
    engineSummary: "5.0L V8, 472 hp", horsepower: 472, torque: 535,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "V8", disp: 5.0, cyl: 8, hp: 472, tq: 535, z: 4.5, ts: 270, l: 4710, fc: 13.0, fh: 9.5, fcm: 11.0 }),
    equipment: premiumEquip,
  },

  // --- Porsche 911 ---
  {
    id: "por-911-carrera", modelId: "porsche-911", name: "Carrera", price: 32000,
    engineSummary: "3.0L Flat-6 Turbo, 394 hp", horsepower: 394, torque: 450,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "Flat-6 Turbo", disp: 3.0, cyl: 6, hp: 394, tq: 450, z: 4.1, ts: 294, dr: DriveType.RWD, l: 4519, h: 1302, trunk: 132, seat: 4, wt: 1530, warranty: "4 years / unlimited km" }),
    equipment: premiumEquip,
  },
  {
    id: "por-911-s", modelId: "porsche-911", name: "Carrera S", price: 38000,
    engineSummary: "3.0L Flat-6 Turbo, 450 hp", horsepower: 450, torque: 530,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "Flat-6 Turbo", disp: 3.0, cyl: 6, hp: 450, tq: 530, z: 3.5, ts: 308, dr: DriveType.RWD, l: 4519, h: 1302, trunk: 132, seat: 4, wt: 1560, warranty: "4 years / unlimited km" }),
    equipment: premiumEquip,
  },

  // --- Porsche Cayenne ---
  {
    id: "por-cayenne", modelId: "porsche-cayenne", name: "Cayenne", price: 27000,
    engineSummary: "3.0L V6 Turbo, 353 hp", horsepower: 353, torque: 500,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "V6 Turbo", disp: 3.0, cyl: 6, hp: 353, tq: 500, z: 5.9, ts: 248, dr: DriveType.AWD, h: 1696, l: 4918, trunk: 772, wt: 2045, warranty: "4 years / unlimited km" }),
    equipment: premiumEquip,
  },
  {
    id: "por-cayenne-s", modelId: "porsche-cayenne", name: "Cayenne S", price: 35500,
    engineSummary: "4.0L V8 Turbo, 474 hp", horsepower: 474, torque: 600,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "V8 Twin-Turbo", disp: 4.0, cyl: 8, hp: 474, tq: 600, z: 4.7, ts: 264, dr: DriveType.AWD, h: 1696, l: 4918, trunk: 772, wt: 2175, warranty: "4 years / unlimited km" }),
    equipment: premiumEquip,
  },

  // --- Porsche Macan ---
  {
    id: "por-macan", modelId: "porsche-macan", name: "Macan", price: 20000,
    engineSummary: "2.0L 4-cyl Turbo, 265 hp", horsepower: 265, torque: 400,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ hp: 265, tq: 400, z: 6.2, ts: 232, dr: DriveType.AWD, h: 1621, l: 4726, trunk: 488, wt: 1870, warranty: "4 years / unlimited km" }),
    equipment: baseEquip,
  },
  {
    id: "por-macan-s", modelId: "porsche-macan", name: "Macan S", price: 25000,
    engineSummary: "2.9L V6 Turbo, 380 hp", horsepower: 380, torque: 520,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "V6 Twin-Turbo", disp: 2.9, cyl: 6, hp: 380, tq: 520, z: 4.8, ts: 259, dr: DriveType.AWD, h: 1621, l: 4726, trunk: 488, wt: 1940, warranty: "4 years / unlimited km" }),
    equipment: premiumEquip,
  },

  // --- Porsche Taycan ---
  {
    id: "por-taycan", modelId: "porsche-taycan", name: "Taycan", price: 30000,
    engineSummary: "Electric, 408 hp", horsepower: 408, torque: 345,
    fuelType: FuelType.Electric, images: [img], variants: [],
    specs: spec({ et: "Electric", disp: 0, cyl: 0, hp: 408, tq: 345, z: 5.4, ts: 230, fc: 0, fh: 0, fcm: 0, dr: DriveType.RWD, l: 4963, trunk: 407, wt: 2140, warranty: "4 years / unlimited km" }),
    equipment: premiumEquip,
  },
  {
    id: "por-taycan-4s", modelId: "porsche-taycan", name: "Taycan 4S", price: 40000,
    engineSummary: "Electric, 530 hp", horsepower: 530, torque: 640,
    fuelType: FuelType.Electric, images: [img], variants: [],
    specs: spec({ et: "Electric", disp: 0, cyl: 0, hp: 530, tq: 640, z: 4.0, ts: 250, fc: 0, fh: 0, fcm: 0, dr: DriveType.AWD, l: 4963, trunk: 407, wt: 2295, warranty: "4 years / unlimited km" }),
    equipment: premiumEquip,
  },

  // --- Changan CS75 Plus ---
  {
    id: "cha-cs75-comfort", modelId: "changan-cs75", name: "Comfort", price: 4500,
    engineSummary: "1.5L Turbo, 181 hp", horsepower: 181, torque: 300,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ disp: 1.5, hp: 181, tq: 300, z: 9.0, ts: 190, dr: DriveType.FWD, h: 1690, trunk: 620, warranty: "5 years / 150,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "cha-cs75-luxury", modelId: "changan-cs75", name: "Luxury", price: 5200,
    engineSummary: "2.0L Turbo, 233 hp", horsepower: 233, torque: 360,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ hp: 233, tq: 360, z: 7.8, ts: 205, dr: DriveType.FWD, h: 1690, trunk: 620, warranty: "5 years / 150,000 km" }),
    equipment: premiumEquip,
  },

  // --- Changan CS55 Plus ---
  {
    id: "cha-cs55-classic", modelId: "changan-cs55", name: "Classic", price: 3800,
    engineSummary: "1.5L Turbo, 181 hp", horsepower: 181, torque: 300,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ disp: 1.5, hp: 181, tq: 300, z: 9.5, ts: 185, dr: DriveType.FWD, h: 1660, trunk: 560, warranty: "5 years / 150,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "cha-cs55-premium", modelId: "changan-cs55", name: "Premium", price: 4400,
    engineSummary: "1.5L Turbo, 181 hp", horsepower: 181, torque: 300,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ disp: 1.5, hp: 181, tq: 300, z: 9.5, ts: 185, dr: DriveType.FWD, h: 1660, trunk: 560, warranty: "5 years / 150,000 km" }),
    equipment: premiumEquip,
  },

  // --- Changan Alsvin ---
  {
    id: "cha-alsvin-comfort", modelId: "changan-alsvin", name: "Comfort", price: 3200,
    engineSummary: "1.5L 4-cyl, 105 hp", horsepower: 105, torque: 145,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "Inline-4", disp: 1.5, hp: 105, tq: 145, z: 12.0, ts: 170, dr: DriveType.FWD, l: 4390, trunk: 390, warranty: "5 years / 150,000 km", tr: TransmissionType.CVT }),
    equipment: baseEquip,
  },
  {
    id: "cha-alsvin-luxury", modelId: "changan-alsvin", name: "Luxury", price: 3800,
    engineSummary: "1.5L 4-cyl, 105 hp", horsepower: 105, torque: 145,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "Inline-4", disp: 1.5, hp: 105, tq: 145, z: 12.0, ts: 170, dr: DriveType.FWD, l: 4390, trunk: 390, warranty: "5 years / 150,000 km", tr: TransmissionType.CVT }),
    equipment: premiumEquip,
  },

  // --- Changan Uni-T ---
  {
    id: "cha-unit-standard", modelId: "changan-unit", name: "Standard", price: 5000,
    engineSummary: "1.5L Turbo, 181 hp", horsepower: 181, torque: 300,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ disp: 1.5, hp: 181, tq: 300, z: 8.8, ts: 195, dr: DriveType.FWD, h: 1680, trunk: 490, warranty: "5 years / 150,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "cha-unit-premium", modelId: "changan-unit", name: "Premium", price: 5800,
    engineSummary: "2.0L Turbo, 233 hp", horsepower: 233, torque: 360,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ hp: 233, tq: 360, z: 7.5, ts: 210, dr: DriveType.FWD, h: 1680, trunk: 490, warranty: "5 years / 150,000 km" }),
    equipment: premiumEquip,
  },

  // --- Haval H6 ---
  {
    id: "hav-h6-comfort", modelId: "haval-h6", name: "Comfort", price: 5500,
    engineSummary: "1.5L Turbo, 169 hp", horsepower: 169, torque: 285,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ disp: 1.5, hp: 169, tq: 285, z: 9.7, ts: 185, dr: DriveType.FWD, h: 1696, trunk: 600, warranty: "5 years / 100,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "hav-h6-supreme", modelId: "haval-h6", name: "Supreme", price: 6500,
    engineSummary: "2.0L Turbo, 211 hp", horsepower: 211, torque: 325,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ hp: 211, tq: 325, z: 8.5, ts: 200, dr: DriveType.AWD, h: 1696, trunk: 600, warranty: "5 years / 100,000 km" }),
    equipment: premiumEquip,
  },

  // --- Haval Jolion ---
  {
    id: "hav-jolion-active", modelId: "haval-jolion", name: "Active", price: 4200,
    engineSummary: "1.5L Turbo, 150 hp", horsepower: 150, torque: 220,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ disp: 1.5, hp: 150, tq: 220, z: 10.5, ts: 180, dr: DriveType.FWD, h: 1665, trunk: 420, warranty: "5 years / 100,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "hav-jolion-premium", modelId: "haval-jolion", name: "Premium", price: 5000,
    engineSummary: "1.5L Turbo, 150 hp", horsepower: 150, torque: 220,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ disp: 1.5, hp: 150, tq: 220, z: 10.5, ts: 180, dr: DriveType.FWD, h: 1665, trunk: 420, warranty: "5 years / 100,000 km" }),
    equipment: premiumEquip,
  },

  // --- Haval Dargo ---
  {
    id: "hav-dargo-standard", modelId: "haval-dargo", name: "Standard", price: 6500,
    engineSummary: "2.0L Turbo, 211 hp", horsepower: 211, torque: 325,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ hp: 211, tq: 325, z: 8.8, ts: 195, dr: DriveType.FourWD, l: 4780, h: 1810, trunk: 560, seat: 5, warranty: "5 years / 100,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "hav-dargo-premium", modelId: "haval-dargo", name: "Premium", price: 7500,
    engineSummary: "2.0L Turbo, 211 hp", horsepower: 211, torque: 325,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ hp: 211, tq: 325, z: 8.8, ts: 195, dr: DriveType.FourWD, l: 4780, h: 1810, trunk: 560, seat: 5, warranty: "5 years / 100,000 km" }),
    equipment: premiumEquip,
  },

  // --- MG HS ---
  {
    id: "mg-hs-com", modelId: "mg-hs", name: "Comfort", price: 5200,
    engineSummary: "1.5L Turbo, 162 hp", horsepower: 162, torque: 250,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ disp: 1.5, hp: 162, tq: 250, z: 9.7, ts: 190, dr: DriveType.FWD, h: 1685, trunk: 463, warranty: "6 years / 150,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "mg-hs-lux", modelId: "mg-hs", name: "Luxury", price: 6200,
    engineSummary: "2.0L Turbo, 231 hp", horsepower: 231, torque: 370,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ hp: 231, tq: 370, z: 7.8, ts: 210, dr: DriveType.AWD, h: 1685, trunk: 463, warranty: "6 years / 150,000 km" }),
    equipment: premiumEquip,
  },

  // --- MG ZS ---
  {
    id: "mg-zs-std", modelId: "mg-zs", name: "Standard", price: 3800,
    engineSummary: "1.5L 4-cyl, 106 hp", horsepower: 106, torque: 141,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "Inline-4", disp: 1.5, hp: 106, tq: 141, z: 11.5, ts: 175, dr: DriveType.FWD, h: 1644, trunk: 448, warranty: "6 years / 150,000 km", tr: TransmissionType.CVT }),
    equipment: baseEquip,
  },
  {
    id: "mg-zs-lux", modelId: "mg-zs", name: "Luxury", price: 4500,
    engineSummary: "1.5L 4-cyl, 106 hp", horsepower: 106, torque: 141,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "Inline-4", disp: 1.5, hp: 106, tq: 141, z: 11.5, ts: 175, dr: DriveType.FWD, h: 1644, trunk: 448, warranty: "6 years / 150,000 km", tr: TransmissionType.CVT }),
    equipment: premiumEquip,
  },

  // --- MG 5 ---
  {
    id: "mg-5-std", modelId: "mg-5", name: "Standard", price: 3500,
    engineSummary: "1.5L 4-cyl, 112 hp", horsepower: 112, torque: 150,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ et: "Inline-4", disp: 1.5, hp: 112, tq: 150, z: 11.8, ts: 180, dr: DriveType.FWD, l: 4675, trunk: 512, warranty: "6 years / 150,000 km", tr: TransmissionType.CVT }),
    equipment: baseEquip,
  },
  {
    id: "mg-5-lux", modelId: "mg-5", name: "Luxury", price: 4200,
    engineSummary: "1.5L Turbo, 162 hp", horsepower: 162, torque: 250,
    fuelType: FuelType.Petrol, images: [img], variants: [],
    specs: spec({ disp: 1.5, hp: 162, tq: 250, z: 9.5, ts: 200, dr: DriveType.FWD, l: 4675, trunk: 512, warranty: "6 years / 150,000 km" }),
    equipment: premiumEquip,
  },

  // --- MG 4 ---
  {
    id: "mg-4-se", modelId: "mg-4", name: "SE", price: 7500,
    engineSummary: "Electric, 170 hp", horsepower: 170, torque: 250,
    fuelType: FuelType.Electric, images: [img], variants: [],
    specs: spec({ et: "Electric", disp: 0, cyl: 0, hp: 170, tq: 250, z: 7.7, ts: 160, fc: 0, fh: 0, fcm: 0, dr: DriveType.RWD, l: 4287, h: 1504, trunk: 363, warranty: "6 years / 150,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "mg-4-trophy", modelId: "mg-4", name: "Trophy Extended Range", price: 9000,
    engineSummary: "Electric, 245 hp", horsepower: 245, torque: 350,
    fuelType: FuelType.Electric, images: [img], variants: [],
    specs: spec({ et: "Electric", disp: 0, cyl: 0, hp: 245, tq: 350, z: 6.5, ts: 170, fc: 0, fh: 0, fcm: 0, dr: DriveType.RWD, l: 4287, h: 1504, trunk: 363, warranty: "6 years / 150,000 km" }),
    equipment: premiumEquip,
  },
];

// ============ MODELS ============
export const models: Model[] = [
  // Mercedes-Benz
  { id: "merc-c-sedan", brandId: "mercedes", name: "C-Class Sedan", bodyType: BodyType.Sedan, year: 2026, startingPrice: 13500, trimCount: 3, isNew: false, isUpdated: true, specsSummary: { engineRange: "1.5L - 2.0L", hpRange: "204 - 408 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "merc-e-sedan", brandId: "mercedes", name: "E-Class Sedan", bodyType: BodyType.Sedan, year: 2026, startingPrice: 18500, trimCount: 2, isNew: true, isUpdated: false, specsSummary: { engineRange: "2.0L", hpRange: "204 - 258 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "merc-glc", brandId: "mercedes", name: "GLC SUV", bodyType: BodyType.SUV, year: 2026, startingPrice: 17500, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "2.0L", hpRange: "204 - 258 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "merc-gle", brandId: "mercedes", name: "GLE SUV", bodyType: BodyType.SUV, year: 2026, startingPrice: 28000, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "3.0L", hpRange: "367 - 429 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "merc-a-class", brandId: "mercedes", name: "A-Class", bodyType: BodyType.Hatchback, year: 2026, startingPrice: 11000, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "1.3L - 2.0L", hpRange: "163 - 224 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },

  // BMW
  { id: "bmw-3-series", brandId: "bmw", name: "3 Series", bodyType: BodyType.Sedan, year: 2026, startingPrice: 12800, trimCount: 3, isNew: false, isUpdated: true, specsSummary: { engineRange: "2.0L - 3.0L", hpRange: "184 - 374 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "bmw-5-series", brandId: "bmw", name: "5 Series", bodyType: BodyType.Sedan, year: 2026, startingPrice: 18000, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "2.0L", hpRange: "208 - 245 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "bmw-x3", brandId: "bmw", name: "X3", bodyType: BodyType.SUV, year: 2026, startingPrice: 16500, trimCount: 2, isNew: true, isUpdated: false, specsSummary: { engineRange: "2.0L", hpRange: "184 - 245 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "bmw-x5", brandId: "bmw", name: "X5", bodyType: BodyType.SUV, year: 2026, startingPrice: 28500, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "3.0L - 4.4L", hpRange: "340 - 530 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "bmw-4-coupe", brandId: "bmw", name: "4 Series Coupe", bodyType: BodyType.Coupe, year: 2026, startingPrice: 16000, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "2.0L - 3.0L", hpRange: "184 - 374 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },

  // Toyota
  { id: "toyota-camry", brandId: "toyota", name: "Camry", bodyType: BodyType.Sedan, year: 2026, startingPrice: 7800, trimCount: 3, isNew: false, isUpdated: true, specsSummary: { engineRange: "2.5L - 3.5L", hpRange: "203 - 301 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "toyota-lc", brandId: "toyota", name: "Land Cruiser", bodyType: BodyType.SUV, year: 2026, startingPrice: 22000, trimCount: 2, isNew: true, isUpdated: false, specsSummary: { engineRange: "3.5L V6", hpRange: "409 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "toyota-rav4", brandId: "toyota", name: "RAV4", bodyType: BodyType.SUV, year: 2026, startingPrice: 9200, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "2.0L - 2.5L", hpRange: "170 - 219 hp", fuelTypes: [FuelType.Petrol, FuelType.Hybrid] }, imageUrl: img },
  { id: "toyota-corolla", brandId: "toyota", name: "Corolla", bodyType: BodyType.Sedan, year: 2026, startingPrice: 5800, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "1.6L - 2.0L", hpRange: "121 - 168 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "toyota-hilux", brandId: "toyota", name: "Hilux", bodyType: BodyType.Pickup, year: 2026, startingPrice: 10500, trimCount: 2, isNew: false, isUpdated: true, specsSummary: { engineRange: "2.8L Diesel", hpRange: "204 hp", fuelTypes: [FuelType.Diesel] }, imageUrl: img },

  // Lexus
  { id: "lexus-es", brandId: "lexus", name: "ES", bodyType: BodyType.Sedan, year: 2026, startingPrice: 12500, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "2.5L - 3.5L", hpRange: "203 - 302 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "lexus-rx", brandId: "lexus", name: "RX", bodyType: BodyType.SUV, year: 2026, startingPrice: 19500, trimCount: 2, isNew: true, isUpdated: false, specsSummary: { engineRange: "2.4L Turbo", hpRange: "275 - 366 hp", fuelTypes: [FuelType.Petrol, FuelType.Hybrid] }, imageUrl: img },
  { id: "lexus-nx", brandId: "lexus", name: "NX", bodyType: BodyType.SUV, year: 2026, startingPrice: 14000, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "2.5L", hpRange: "203 - 239 hp", fuelTypes: [FuelType.Petrol, FuelType.Hybrid] }, imageUrl: img },
  { id: "lexus-is", brandId: "lexus", name: "IS", bodyType: BodyType.Sedan, year: 2026, startingPrice: 14500, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "2.0L - 5.0L", hpRange: "241 - 472 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },

  // Porsche
  { id: "porsche-911", brandId: "porsche", name: "911", bodyType: BodyType.Coupe, year: 2026, startingPrice: 32000, trimCount: 2, isNew: false, isUpdated: true, specsSummary: { engineRange: "3.0L Flat-6", hpRange: "394 - 450 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "porsche-cayenne", brandId: "porsche", name: "Cayenne", bodyType: BodyType.SUV, year: 2026, startingPrice: 27000, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "3.0L - 4.0L", hpRange: "353 - 474 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "porsche-macan", brandId: "porsche", name: "Macan", bodyType: BodyType.SUV, year: 2026, startingPrice: 20000, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "2.0L - 2.9L", hpRange: "265 - 380 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "porsche-taycan", brandId: "porsche", name: "Taycan", bodyType: BodyType.Sedan, year: 2026, startingPrice: 30000, trimCount: 2, isNew: true, isUpdated: false, specsSummary: { engineRange: "Electric", hpRange: "408 - 530 hp", fuelTypes: [FuelType.Electric] }, imageUrl: img },

  // Changan
  { id: "changan-cs75", brandId: "changan", name: "CS75 Plus", bodyType: BodyType.SUV, year: 2026, startingPrice: 4500, trimCount: 2, isNew: false, isUpdated: true, specsSummary: { engineRange: "1.5L - 2.0L", hpRange: "181 - 233 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "changan-cs55", brandId: "changan", name: "CS55 Plus", bodyType: BodyType.SUV, year: 2026, startingPrice: 3800, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "1.5L", hpRange: "181 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "changan-alsvin", brandId: "changan", name: "Alsvin", bodyType: BodyType.Sedan, year: 2026, startingPrice: 3200, trimCount: 2, isNew: true, isUpdated: false, specsSummary: { engineRange: "1.5L", hpRange: "105 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "changan-unit", brandId: "changan", name: "Uni-T", bodyType: BodyType.SUV, year: 2026, startingPrice: 5000, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "1.5L - 2.0L", hpRange: "181 - 233 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },

  // Haval
  { id: "haval-h6", brandId: "haval", name: "H6", bodyType: BodyType.SUV, year: 2026, startingPrice: 5500, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "1.5L - 2.0L", hpRange: "169 - 211 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "haval-jolion", brandId: "haval", name: "Jolion", bodyType: BodyType.SUV, year: 2026, startingPrice: 4200, trimCount: 2, isNew: true, isUpdated: false, specsSummary: { engineRange: "1.5L", hpRange: "150 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "haval-dargo", brandId: "haval", name: "Dargo", bodyType: BodyType.Pickup, year: 2026, startingPrice: 6500, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "2.0L", hpRange: "211 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },

  // MG
  { id: "mg-hs", brandId: "mg", name: "HS", bodyType: BodyType.SUV, year: 2026, startingPrice: 5200, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "1.5L - 2.0L", hpRange: "162 - 231 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "mg-zs", brandId: "mg", name: "ZS", bodyType: BodyType.SUV, year: 2026, startingPrice: 3800, trimCount: 2, isNew: false, isUpdated: true, specsSummary: { engineRange: "1.5L", hpRange: "106 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "mg-5", brandId: "mg", name: "MG5", bodyType: BodyType.Sedan, year: 2026, startingPrice: 3500, trimCount: 2, isNew: false, isUpdated: false, specsSummary: { engineRange: "1.5L", hpRange: "112 - 162 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: img },
  { id: "mg-4", brandId: "mg", name: "MG4 Electric", bodyType: BodyType.Hatchback, year: 2026, startingPrice: 7500, trimCount: 2, isNew: true, isUpdated: false, specsSummary: { engineRange: "Electric", hpRange: "170 - 245 hp", fuelTypes: [FuelType.Electric] }, imageUrl: img },
];

// ============ BRANCHES ============
export const branches: Branch[] = [
  { id: "branch-1", brandId: "all", name: "4Sale New Cars - Shuwaikh", location: "Shuwaikh Industrial, Block 1, Kuwait City", phone: "+965 2222 1111", mapUrl: "https://maps.google.com/?q=29.3375,47.9535" },
  { id: "branch-2", brandId: "all", name: "4Sale New Cars - Ahmadi", location: "Ahmadi, Main Street, Kuwait", phone: "+965 2222 2222", mapUrl: "https://maps.google.com/?q=29.0769,48.0838" },
  { id: "branch-3", brandId: "all", name: "4Sale New Cars - Fahaheel", location: "Fahaheel, Mecca Street, Kuwait", phone: "+965 2222 3333", mapUrl: "https://maps.google.com/?q=29.0822,48.1294" },
  { id: "branch-4", brandId: "all", name: "4Sale New Cars - The Avenues", location: "The Avenues Mall, Al Rai, Kuwait", phone: "+965 2222 4444", mapUrl: "https://maps.google.com/?q=29.3058,47.9262" },
];

// ============ LIFESTYLE COLLECTIONS ============
export const lifestyleCollections: LifestyleCollection[] = [
  {
    id: "family-suv", title: "Family-Friendly SUVs",
    description: "Spacious, safe, and loaded with features for the whole family.",
    imageUrl: img,
    modelIds: ["toyota-rav4", "merc-glc", "bmw-x3", "lexus-nx", "haval-h6", "mg-hs", "changan-cs75"],
  },
  {
    id: "performance", title: "Performance & Sport",
    description: "For those who live life in the fast lane.",
    imageUrl: img,
    modelIds: ["porsche-911", "bmw-4-coupe", "merc-c-sedan", "lexus-is", "porsche-taycan"],
  },
  {
    id: "luxury-daily", title: "Luxury Daily Drivers",
    description: "Arrive in style every single day.",
    imageUrl: img,
    modelIds: ["merc-e-sedan", "bmw-5-series", "lexus-es", "porsche-macan", "porsche-cayenne"],
  },
  {
    id: "first-car", title: "First-Car Picks Under 8,000 KWD",
    description: "Great value cars perfect for new drivers.",
    imageUrl: img,
    modelIds: ["toyota-corolla", "toyota-camry", "changan-alsvin", "mg-5", "mg-zs", "haval-jolion", "changan-cs55"],
  },
];
