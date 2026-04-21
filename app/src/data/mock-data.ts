import {
  type Brand, type Model, type Trim, type Branch, type LifestyleCollection,
  type BrandEditorial,
  BodyType, FuelType, TransmissionType, DriveType, SpecRegion, EquipmentCategory,
} from "./types";



// ============ BRAND EDITORIAL DATA ============
const mercedesEditorial: BrandEditorial = {
  heroGradient: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 40%, #16213e 70%, #0a0a0a 100%)",
  story: "Mercedes-Benz has stood at the forefront of automotive innovation since Karl Benz patented the first automobile in 1886. From the legendary Silver Arrows of the 1930s to today's groundbreaking EQ electric lineup, the brand has consistently defined what luxury motoring means. In the Middle East, Mercedes-Benz has been a symbol of prestige and engineering excellence for decades, offering vehicles that blend cutting-edge technology with uncompromising comfort. Every model in the lineup reflects the brand's founding philosophy: the best or nothing.",
  heritage: {
    title: "140 Years of Innovation",
    description: "From Karl Benz's Patent-Motorwagen in 1886 to the electrified EQ lineup of today, Mercedes-Benz has never stopped redefining what an automobile can be. Every era has brought breakthroughs -- from the first diesel passenger car to the invention of crumple zones, from the Silver Arrows that dominated Grand Prix racing to the S-Class that pioneered autonomous driving technology. This relentless pursuit of excellence is what defines the marque.",
    founded: "1886",
    milestone: "The world's first automobile -- the Benz Patent-Motorwagen -- was built in Mannheim, Germany, marking the birth of the automotive industry.",
  },
  stats: [
    { label: "Founded", value: "1886" },
    { label: "Models in Kuwait", value: "11" },
    { label: "Dealerships", value: "3" },
    { label: "Warranty", value: "5 Years" },
  ],
  innovationTitle: "Defining Class Through Technology",
  innovationDescription: "Mercedes-Benz Intelligent Drive brings together a suite of advanced driver assistance systems that work in harmony to make every journey safer and more relaxing. The MBUX infotainment system with natural voice recognition, the predictive MAGIC BODY CONTROL suspension, and the DIGITAL LIGHT headlamp system with projection capability represent just a fraction of the brand's technological arsenal. With the EQ sub-brand, Mercedes-Benz is leading the charge into an electric future where luxury and sustainability coexist seamlessly.",
  sustainability: "Mercedes-Benz is committed to carbon neutrality across the entire value chain by 2039. The Ambition 2039 initiative drives the transition to an all-electric fleet, with sustainable materials, renewable energy in production, and a circular economy approach shaping every vehicle from concept to end of life.",
  serviceLinks: [
    { title: "Book a Test Drive", description: "Experience the Mercedes-Benz lineup firsthand at your nearest dealership.", icon: "car", href: "#" },
    { title: "Find a Dealer", description: "Locate authorized Mercedes-Benz dealerships across Kuwait.", icon: "map-pin", href: "#" },
    { title: "Service & Maintenance", description: "Schedule your next service appointment with certified technicians.", icon: "wrench", href: "#" },
    { title: "Mercedes me connect", description: "Stay connected to your vehicle with the Mercedes me app.", icon: "smartphone", href: "#" },
  ],
};

// ============ BRANDS ============
export const brands: Brand[] = [
  { id: "mercedes", name: "Mercedes-Benz", logoUrl: "/images/brands/mercedes.png", modelCount: 11, featured: true, tagline: "The best or nothing", editorial: mercedesEditorial , heroMedia: { type: "video", url: "/videos/merc-hero.mp4" }, editorialImages: { heritage: "/images/brands/editorial/mercedes-heritage.jpg", innovation: "/images/brands/editorial/mercedes-innovation.jpg" }},
  { id: "bmw", name: "BMW", logoUrl: "/images/brands/bmw.png", modelCount: 5, featured: true, tagline: "Sheer driving pleasure" , heroMedia: { type: "video", url: "/videos/bmw-hero.mp4" }, editorialImages: { heritage: "/images/brands/editorial/bmw-heritage.jpg", innovation: "/images/brands/editorial/bmw-innovation.jpg" }},
  { id: "toyota", name: "Toyota", logoUrl: "/images/brands/toyota.png", modelCount: 5, featured: true, tagline: "Let's go places" , heroMedia: { type: "image", url: "/images/brands/editorial/toyota-hero.jpg" }, editorialImages: { heritage: "/images/brands/editorial/toyota-heritage.jpg", innovation: "/images/brands/editorial/toyota-innovation.jpg" }},
  { id: "lexus", name: "Lexus", logoUrl: "/images/brands/lexus.png", modelCount: 4 , heroMedia: { type: "video", url: "/videos/lexus-hero.mp4" }, editorialImages: { heritage: "/images/brands/editorial/lexus-heritage.jpg", innovation: "/images/brands/editorial/lexus-innovation.jpg" }},
  { id: "porsche", name: "Porsche", logoUrl: "/images/brands/porsche.png", modelCount: 4, featured: true, tagline: "There is no substitute" , heroMedia: { type: "video", url: "/videos/porsche-hero.mp4" }, editorialImages: { heritage: "/images/brands/editorial/porsche-heritage.jpg", innovation: "/images/brands/editorial/porsche-innovation.jpg" }},
  { id: "changan", name: "Changan", logoUrl: "/images/brands/changan.png", modelCount: 4 , heroMedia: { type: "image", url: "/images/brands/editorial/changan-hero.jpg" }, editorialImages: { heritage: "/images/brands/editorial/changan-heritage.jpg", innovation: "/images/brands/editorial/changan-innovation.jpg" }},
  { id: "haval", name: "Haval", logoUrl: "/images/brands/haval.png", modelCount: 3 , heroMedia: { type: "image", url: "/images/brands/editorial/haval-hero.jpg" }, editorialImages: { heritage: "/images/brands/editorial/haval-heritage.jpg", innovation: "/images/brands/editorial/haval-innovation.jpg" }},
  { id: "mg", name: "MG", logoUrl: "/images/brands/mg.png", modelCount: 4 , heroMedia: { type: "image", url: "/images/brands/editorial/mg-hero.jpg" }, editorialImages: { heritage: "/images/brands/editorial/mg-heritage.jpg", innovation: "/images/brands/editorial/mg-innovation.jpg" }},
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
  // --- Mercedes A 200 ---
  {
    id: "merc-a200-std", modelId: "merc-a200", name: "Standard",
    price: 11000, engineSummary: "1.3L 4-cyl Turbo, 163 hp", horsepower: 163, torque: 250,
    fuelType: FuelType.Petrol, images: ["/images/cars/merc-a200-front.jpg", "/images/cars/merc-a200-side.jpg", "/images/cars/merc-a200-rear.jpg", "/images/cars/merc-a200-detail.jpg"], variants: [],
    specs: spec({ disp: 1.3, hp: 163, tq: 250, z: 8.1, ts: 225, l: 4419, h: 1440, trunk: 370 }),
    equipment: baseEquip,
  },
  // --- Mercedes A 250 ---
  {
    id: "merc-a250-std", modelId: "merc-a250", name: "Standard",
    price: 13800, engineSummary: "2.0L 4-cyl Turbo, 224 hp", horsepower: 224, torque: 350,
    fuelType: FuelType.Petrol, images: ["/images/cars/merc-a250-front.jpg", "/images/cars/merc-a250-side.jpg", "/images/cars/merc-a250-rear.jpg", "/images/cars/merc-a250-detail.jpg"], variants: [],
    specs: spec({ disp: 2.0, hp: 224, tq: 350, z: 6.5, ts: 250, l: 4419, h: 1440, trunk: 370 }),
    equipment: premiumEquip,
  },
  // --- Mercedes C 200 ---
  {
    id: "merc-c200-avg", modelId: "merc-c200", name: "Avantgarde",
    price: 13500, engineSummary: "1.5L 4-cyl Turbo, 204 hp", horsepower: 204, torque: 300,
    fuelType: FuelType.Petrol, images: ["/images/cars/merc-c200-front.jpg", "/images/cars/merc-c200-side.jpg", "/images/cars/merc-c200-rear.jpg", "/images/cars/merc-c200-detail.jpg"], variants: [],
    specs: spec({ disp: 1.5, hp: 204, tq: 300, z: 7.3, ts: 246, dr: DriveType.RWD }),
    equipment: baseEquip,
  },
  {
    id: "merc-c200-amg", modelId: "merc-c200", name: "AMG Line",
    price: 15100, engineSummary: "1.5L 4-cyl Turbo, 204 hp", horsepower: 204, torque: 300,
    fuelType: FuelType.Petrol, images: ["/images/cars/merc-c200-front.jpg", "/images/cars/merc-c200-side.jpg", "/images/cars/merc-c200-rear.jpg", "/images/cars/merc-c200-detail.jpg"], variants: [],
    specs: spec({ disp: 1.5, hp: 204, tq: 300, z: 7.3, ts: 246, dr: DriveType.RWD }),
    equipment: premiumEquip,
  },
  // --- Mercedes C 300 ---
  {
    id: "merc-c300-std", modelId: "merc-c300", name: "Standard",
    price: 16800, engineSummary: "2.0L 4-cyl Turbo, 258 hp", horsepower: 258, torque: 400,
    fuelType: FuelType.Petrol, images: ["/images/cars/merc-c300-front.jpg", "/images/cars/merc-c300-side.jpg", "/images/cars/merc-c300-rear.jpg", "/images/cars/merc-c300-detail.jpg"], variants: [],
    specs: spec({ disp: 2.0, hp: 258, tq: 400, z: 6.0, ts: 250 }),
    equipment: baseEquip,
  },
  {
    id: "merc-c300-amg", modelId: "merc-c300", name: "AMG Line",
    price: 18200, engineSummary: "2.0L 4-cyl Turbo, 258 hp", horsepower: 258, torque: 400,
    fuelType: FuelType.Petrol, images: ["/images/cars/merc-c300-front.jpg", "/images/cars/merc-c300-side.jpg", "/images/cars/merc-c300-rear.jpg", "/images/cars/merc-c300-detail.jpg"], variants: [],
    specs: spec({ disp: 2.0, hp: 258, tq: 400, z: 6.0, ts: 250 }),
    equipment: premiumEquip,
  },
  // --- Mercedes C 43 AMG ---
  {
    id: "merc-c43-std", modelId: "merc-c43", name: "Standard",
    price: 24500, engineSummary: "2.0L 4-cyl Turbo, 408 hp", horsepower: 408, torque: 500,
    fuelType: FuelType.Petrol, images: ["/images/cars/merc-c43-front.jpg", "/images/cars/merc-c43-side.jpg", "/images/cars/merc-c43-rear.jpg", "/images/cars/merc-c43-detail.jpg"], variants: [],
    specs: spec({ disp: 2.0, hp: 408, tq: 500, z: 4.6, ts: 265, dr: DriveType.AWD }),
    equipment: premiumEquip,
  },
  // --- Mercedes E 200 ---
  {
    id: "merc-e200-std", modelId: "merc-e200", name: "Standard",
    price: 18500, engineSummary: "2.0L 4-cyl Turbo, 204 hp", horsepower: 204, torque: 320,
    fuelType: FuelType.Petrol, images: ["/images/cars/merc-e200-front.jpg", "/images/cars/merc-e200-side.jpg", "/images/cars/merc-e200-rear.jpg", "/images/cars/merc-e200-detail.jpg"], variants: [],
    specs: spec({ disp: 2.0, hp: 204, tq: 320, z: 7.5, ts: 240, l: 4942, wb: 2939, trunk: 540 }),
    equipment: baseEquip,
  },
  {
    id: "merc-e200-amg", modelId: "merc-e200", name: "AMG Line",
    price: 20200, engineSummary: "2.0L 4-cyl Turbo, 204 hp", horsepower: 204, torque: 320,
    fuelType: FuelType.Petrol, images: ["/images/cars/merc-e200-front.jpg", "/images/cars/merc-e200-side.jpg", "/images/cars/merc-e200-rear.jpg", "/images/cars/merc-e200-detail.jpg"], variants: [],
    specs: spec({ disp: 2.0, hp: 204, tq: 320, z: 7.5, ts: 240, l: 4942, wb: 2939, trunk: 540 }),
    equipment: premiumEquip,
  },
  // --- Mercedes E 300 ---
  {
    id: "merc-e300-std", modelId: "merc-e300", name: "Standard",
    price: 22000, engineSummary: "2.0L 4-cyl Turbo, 258 hp", horsepower: 258, torque: 400,
    fuelType: FuelType.Petrol, images: ["/images/cars/merc-e300-front.jpg", "/images/cars/merc-e300-side.jpg", "/images/cars/merc-e300-rear.jpg", "/images/cars/merc-e300-detail.jpg"], variants: [],
    specs: spec({ disp: 2.0, hp: 258, tq: 400, z: 6.2, ts: 250, l: 4942, wb: 2939, trunk: 540 }),
    equipment: premiumEquip,
  },
  // --- Mercedes GLC 200 ---
  {
    id: "merc-glc200-std", modelId: "merc-glc200", name: "Standard",
    price: 17500, engineSummary: "2.0L 4-cyl Turbo, 204 hp", horsepower: 204, torque: 320,
    fuelType: FuelType.Petrol, images: ["/images/cars/merc-glc200-front.jpg", "/images/cars/merc-glc200-side.jpg", "/images/cars/merc-glc200-rear.jpg", "/images/cars/merc-glc200-detail.jpg"], variants: [],
    specs: spec({ hp: 204, tq: 320, z: 7.8, ts: 220, h: 1640, trunk: 620, dr: DriveType.AWD, seat: 5 }),
    equipment: baseEquip,
  },
  {
    id: "merc-glc200-amg", modelId: "merc-glc200", name: "AMG Line",
    price: 19000, engineSummary: "2.0L 4-cyl Turbo, 204 hp", horsepower: 204, torque: 320,
    fuelType: FuelType.Petrol, images: ["/images/cars/merc-glc200-front.jpg", "/images/cars/merc-glc200-side.jpg", "/images/cars/merc-glc200-rear.jpg", "/images/cars/merc-glc200-detail.jpg"], variants: [],
    specs: spec({ hp: 204, tq: 320, z: 7.8, ts: 220, h: 1640, trunk: 620, dr: DriveType.AWD, seat: 5 }),
    equipment: premiumEquip,
  },
  // --- Mercedes GLC 300 ---
  {
    id: "merc-glc300-std", modelId: "merc-glc300", name: "Standard",
    price: 21000, engineSummary: "2.0L 4-cyl Turbo, 258 hp", horsepower: 258, torque: 400,
    fuelType: FuelType.Petrol, images: ["/images/cars/merc-glc300-front.jpg", "/images/cars/merc-glc300-side.jpg", "/images/cars/merc-glc300-rear.jpg", "/images/cars/merc-glc300-detail.jpg"], variants: [],
    specs: spec({ hp: 258, tq: 400, z: 6.4, ts: 240, h: 1640, trunk: 620, dr: DriveType.AWD }),
    equipment: premiumEquip,
  },
  // --- Mercedes GLE 450 ---
  {
    id: "merc-gle450-std", modelId: "merc-gle450", name: "Standard",
    price: 28000, engineSummary: "3.0L 6-cyl Turbo, 367 hp", horsepower: 367, torque: 500,
    fuelType: FuelType.Petrol, images: ["/images/cars/merc-gle450-front.jpg", "/images/cars/merc-gle450-side.jpg", "/images/cars/merc-gle450-rear.jpg", "/images/cars/merc-gle450-detail.jpg"], variants: [],
    specs: spec({ et: "Inline-6 Turbo", disp: 3.0, cyl: 6, hp: 367, tq: 500, z: 5.7, ts: 250, h: 1796, l: 4924, trunk: 630, dr: DriveType.AWD, seat: 5, wt: 2170 }),
    equipment: premiumEquip,
  },
  // --- Mercedes AMG GLE 53 ---
  {
    id: "merc-gle53-std", modelId: "merc-gle53", name: "Standard",
    price: 38000, engineSummary: "3.0L 6-cyl Turbo, 429 hp", horsepower: 429, torque: 520,
    fuelType: FuelType.Petrol, images: ["/images/cars/merc-gle53-front.jpg", "/images/cars/merc-gle53-side.jpg", "/images/cars/merc-gle53-rear.jpg", "/images/cars/merc-gle53-detail.jpg"], variants: [],
    specs: spec({ et: "Inline-6 Turbo", disp: 3.0, cyl: 6, hp: 429, tq: 520, z: 5.3, ts: 250, h: 1796, l: 4924, trunk: 630, dr: DriveType.AWD, wt: 2220 }),
    equipment: premiumEquip,
  },

  // --- BMW 3 Series ---
  {
    id: "bmw-320i", modelId: "bmw-3-series", name: "320i", price: 12800,
    engineSummary: "2.0L 4-cyl Turbo, 184 hp", horsepower: 184, torque: 300,
    fuelType: FuelType.Petrol, images: ["/images/cars/bmw-3-series-front.jpg", "/images/cars/bmw-3-series-side.jpg", "/images/cars/bmw-3-series-rear.jpg", "/images/cars/bmw-3-series-detail.jpg"], variants: [
      { id: "bmw-320i-sport", trimId: "bmw-320i", name: "Sport Line", price: 13500, description: "Sport styling package", images: ["/images/cars/bmw-3-series-front.jpg", "/images/cars/bmw-3-series-side.jpg", "/images/cars/bmw-3-series-rear.jpg", "/images/cars/bmw-3-series-detail.jpg"] },
      { id: "bmw-320i-lux", trimId: "bmw-320i", name: "Luxury Line", price: 13800, description: "Premium luxury trim", images: ["/images/cars/bmw-3-series-front.jpg", "/images/cars/bmw-3-series-side.jpg", "/images/cars/bmw-3-series-rear.jpg", "/images/cars/bmw-3-series-detail.jpg"] },
    ],
    specs: spec({ hp: 184, tq: 300, z: 7.1, ts: 246, l: 4713 }),
    equipment: baseEquip,
  },
  {
    id: "bmw-330i", modelId: "bmw-3-series", name: "330i", price: 15500,
    engineSummary: "2.0L 4-cyl Turbo, 258 hp", horsepower: 258, torque: 400,
    fuelType: FuelType.Petrol, images: ["/images/cars/bmw-3-series-front.jpg", "/images/cars/bmw-3-series-side.jpg", "/images/cars/bmw-3-series-rear.jpg", "/images/cars/bmw-3-series-detail.jpg"], variants: [
      { id: "bmw-330i-msport", trimId: "bmw-330i", name: "M Sport", price: 16800, description: "M Sport package with enhanced dynamics", images: ["/images/cars/bmw-3-series-front.jpg", "/images/cars/bmw-3-series-side.jpg", "/images/cars/bmw-3-series-rear.jpg", "/images/cars/bmw-3-series-detail.jpg"] },
    ],
    specs: spec({ hp: 258, tq: 400, z: 5.8, ts: 250, l: 4713 }),
    equipment: premiumEquip,
  },
  {
    id: "bmw-m340i", modelId: "bmw-3-series", name: "M340i", price: 21500,
    engineSummary: "3.0L 6-cyl Turbo, 374 hp", horsepower: 374, torque: 500,
    fuelType: FuelType.Petrol, images: ["/images/cars/bmw-3-series-front.jpg", "/images/cars/bmw-3-series-side.jpg", "/images/cars/bmw-3-series-rear.jpg", "/images/cars/bmw-3-series-detail.jpg"], variants: [],
    specs: spec({ et: "Inline-6 Turbo", disp: 3.0, cyl: 6, hp: 374, tq: 500, z: 4.4, ts: 250, dr: DriveType.AWD, l: 4713 }),
    equipment: premiumEquip,
  },

  // --- BMW 5 Series ---
  {
    id: "bmw-520i", modelId: "bmw-5-series", name: "520i", price: 18000,
    engineSummary: "2.0L 4-cyl Turbo, 208 hp", horsepower: 208, torque: 330,
    fuelType: FuelType.Petrol, images: ["/images/cars/bmw-5-series-front.jpg", "/images/cars/bmw-5-series-side.jpg", "/images/cars/bmw-5-series-rear.jpg", "/images/cars/bmw-5-series-detail.jpg"], variants: [],
    specs: spec({ hp: 208, tq: 330, z: 7.0, ts: 245, l: 5060, wb: 2995, trunk: 520 }),
    equipment: baseEquip,
  },
  {
    id: "bmw-530i", modelId: "bmw-5-series", name: "530i", price: 22000,
    engineSummary: "2.0L 4-cyl Turbo, 245 hp", horsepower: 245, torque: 400,
    fuelType: FuelType.Petrol, images: ["/images/cars/bmw-5-series-front.jpg", "/images/cars/bmw-5-series-side.jpg", "/images/cars/bmw-5-series-rear.jpg", "/images/cars/bmw-5-series-detail.jpg"], variants: [],
    specs: spec({ hp: 245, tq: 400, z: 6.2, ts: 250, l: 5060, wb: 2995, trunk: 520 }),
    equipment: premiumEquip,
  },

  // --- BMW X3 ---
  {
    id: "bmw-x3-20", modelId: "bmw-x3", name: "xDrive20i", price: 16500,
    engineSummary: "2.0L 4-cyl Turbo, 184 hp", horsepower: 184, torque: 300,
    fuelType: FuelType.Petrol, images: ["/images/cars/bmw-x3-front.jpg", "/images/cars/bmw-x3-side.jpg", "/images/cars/bmw-x3-rear.jpg", "/images/cars/bmw-x3-detail.jpg"], variants: [],
    specs: spec({ hp: 184, tq: 300, z: 8.2, ts: 215, h: 1676, trunk: 550, dr: DriveType.AWD }),
    equipment: baseEquip,
  },
  {
    id: "bmw-x3-30", modelId: "bmw-x3", name: "xDrive30i", price: 20000,
    engineSummary: "2.0L 4-cyl Turbo, 245 hp", horsepower: 245, torque: 400,
    fuelType: FuelType.Petrol, images: ["/images/cars/bmw-x3-front.jpg", "/images/cars/bmw-x3-side.jpg", "/images/cars/bmw-x3-rear.jpg", "/images/cars/bmw-x3-detail.jpg"], variants: [
      { id: "bmw-x3-30-msport", trimId: "bmw-x3-30", name: "M Sport", price: 21500, description: "M Sport design package", images: ["/images/cars/bmw-x3-front.jpg", "/images/cars/bmw-x3-side.jpg", "/images/cars/bmw-x3-rear.jpg", "/images/cars/bmw-x3-detail.jpg"] },
    ],
    specs: spec({ hp: 245, tq: 400, z: 6.6, ts: 240, h: 1676, trunk: 550, dr: DriveType.AWD }),
    equipment: premiumEquip,
  },

  // --- BMW X5 ---
  {
    id: "bmw-x5-40i", modelId: "bmw-x5", name: "xDrive40i", price: 28500,
    engineSummary: "3.0L 6-cyl Turbo, 340 hp", horsepower: 340, torque: 450,
    fuelType: FuelType.Petrol, images: ["/images/cars/bmw-x5-front.jpg", "/images/cars/bmw-x5-side.jpg", "/images/cars/bmw-x5-rear.jpg", "/images/cars/bmw-x5-detail.jpg"], variants: [
      { id: "bmw-x5-40i-msport", trimId: "bmw-x5-40i", name: "M Sport", price: 30000, description: "M Sport package", images: ["/images/cars/bmw-x5-front.jpg", "/images/cars/bmw-x5-side.jpg", "/images/cars/bmw-x5-rear.jpg", "/images/cars/bmw-x5-detail.jpg"] },
    ],
    specs: spec({ et: "Inline-6 Turbo", disp: 3.0, cyl: 6, hp: 340, tq: 450, z: 5.5, ts: 243, h: 1745, l: 4935, trunk: 650, dr: DriveType.AWD, seat: 5, wt: 2135 }),
    equipment: premiumEquip,
  },
  {
    id: "bmw-x5-m50i", modelId: "bmw-x5", name: "M50i", price: 38000,
    engineSummary: "4.4L V8 Turbo, 530 hp", horsepower: 530, torque: 750,
    fuelType: FuelType.Petrol, images: ["/images/cars/bmw-x5-front.jpg", "/images/cars/bmw-x5-side.jpg", "/images/cars/bmw-x5-rear.jpg", "/images/cars/bmw-x5-detail.jpg"], variants: [],
    specs: spec({ et: "V8 Twin-Turbo", disp: 4.4, cyl: 8, hp: 530, tq: 750, z: 4.3, ts: 250, h: 1745, l: 4935, trunk: 650, dr: DriveType.AWD, wt: 2310 }),
    equipment: premiumEquip,
  },

  // --- BMW 4 Series Coupe ---
  {
    id: "bmw-420i", modelId: "bmw-4-coupe", name: "420i", price: 16000,
    engineSummary: "2.0L 4-cyl Turbo, 184 hp", horsepower: 184, torque: 300,
    fuelType: FuelType.Petrol, images: ["/images/cars/bmw-4-coupe-front.jpg", "/images/cars/bmw-4-coupe-side.jpg", "/images/cars/bmw-4-coupe-rear.jpg", "/images/cars/bmw-4-coupe-detail.jpg"], variants: [],
    specs: spec({ hp: 184, tq: 300, z: 7.5, ts: 240, l: 4773, h: 1383, trunk: 440 }),
    equipment: baseEquip,
  },
  {
    id: "bmw-m440i", modelId: "bmw-4-coupe", name: "M440i", price: 23000,
    engineSummary: "3.0L 6-cyl Turbo, 374 hp", horsepower: 374, torque: 500,
    fuelType: FuelType.Petrol, images: ["/images/cars/bmw-4-coupe-front.jpg", "/images/cars/bmw-4-coupe-side.jpg", "/images/cars/bmw-4-coupe-rear.jpg", "/images/cars/bmw-4-coupe-detail.jpg"], variants: [],
    specs: spec({ et: "Inline-6 Turbo", disp: 3.0, cyl: 6, hp: 374, tq: 500, z: 4.7, ts: 250, l: 4773, h: 1383, trunk: 440, dr: DriveType.AWD }),
    equipment: premiumEquip,
  },

  // --- Toyota Camry ---
  {
    id: "toy-camry-le", modelId: "toyota-camry", name: "LE", price: 7800,
    engineSummary: "2.5L 4-cyl, 203 hp", horsepower: 203, torque: 250,
    fuelType: FuelType.Petrol, images: ["/images/cars/toyota-camry-front.jpg", "/images/cars/toyota-camry-side.jpg", "/images/cars/toyota-camry-rear.jpg", "/images/cars/toyota-camry-detail.jpg"], variants: [],
    specs: spec({ et: "Inline-4", disp: 2.5, hp: 203, tq: 250, z: 8.3, ts: 210, fc: 8.5, fh: 6.0, fcm: 7.0, dr: DriveType.FWD, l: 4885, trunk: 428, warranty: "3 years / 100,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "toy-camry-se", modelId: "toyota-camry", name: "SE", price: 8500,
    engineSummary: "2.5L 4-cyl, 203 hp", horsepower: 203, torque: 250,
    fuelType: FuelType.Petrol, images: ["/images/cars/toyota-camry-front.jpg", "/images/cars/toyota-camry-side.jpg", "/images/cars/toyota-camry-rear.jpg", "/images/cars/toyota-camry-detail.jpg"], variants: [],
    specs: spec({ et: "Inline-4", disp: 2.5, hp: 203, tq: 250, z: 8.3, ts: 210, dr: DriveType.FWD, l: 4885, trunk: 428, warranty: "3 years / 100,000 km" }),
    equipment: premiumEquip,
  },
  {
    id: "toy-camry-v6", modelId: "toyota-camry", name: "Grande V6", price: 10500,
    engineSummary: "3.5L V6, 301 hp", horsepower: 301, torque: 362,
    fuelType: FuelType.Petrol, images: ["/images/cars/toyota-camry-front.jpg", "/images/cars/toyota-camry-side.jpg", "/images/cars/toyota-camry-rear.jpg", "/images/cars/toyota-camry-detail.jpg"], variants: [],
    specs: spec({ et: "V6", disp: 3.5, cyl: 6, hp: 301, tq: 362, z: 6.1, ts: 235, dr: DriveType.FWD, l: 4885, trunk: 428, warranty: "3 years / 100,000 km" }),
    equipment: premiumEquip,
  },

  // --- Toyota Land Cruiser ---
  {
    id: "toy-lc-gxr", modelId: "toyota-lc", name: "GXR", price: 22000,
    engineSummary: "3.5L V6 Twin-Turbo, 409 hp", horsepower: 409, torque: 650,
    fuelType: FuelType.Petrol, images: ["/images/cars/toyota-lc-front.jpg", "/images/cars/toyota-lc-side.jpg", "/images/cars/toyota-lc-rear.jpg", "/images/cars/toyota-lc-detail.jpg"], variants: [],
    specs: spec({ et: "V6 Twin-Turbo", disp: 3.5, cyl: 6, hp: 409, tq: 650, z: 6.7, ts: 210, fc: 14.0, fh: 10.0, fcm: 12.0, dr: DriveType.FourWD, l: 4985, h: 1935, trunk: 1131, seat: 7, wt: 2490, tank: 110, warranty: "3 years / 100,000 km" }),
    equipment: premiumEquip,
  },
  {
    id: "toy-lc-vxr", modelId: "toyota-lc", name: "VXR", price: 28000,
    engineSummary: "3.5L V6 Twin-Turbo, 409 hp", horsepower: 409, torque: 650,
    fuelType: FuelType.Petrol, images: ["/images/cars/toyota-lc-front.jpg", "/images/cars/toyota-lc-side.jpg", "/images/cars/toyota-lc-rear.jpg", "/images/cars/toyota-lc-detail.jpg"], variants: [],
    specs: spec({ et: "V6 Twin-Turbo", disp: 3.5, cyl: 6, hp: 409, tq: 650, z: 6.7, ts: 210, fc: 14.0, fh: 10.0, fcm: 12.0, dr: DriveType.FourWD, l: 4985, h: 1935, trunk: 1131, seat: 7, wt: 2530, tank: 110, warranty: "3 years / 100,000 km" }),
    equipment: premiumEquip,
  },

  // --- Toyota RAV4 ---
  {
    id: "toy-rav4-le", modelId: "toyota-rav4", name: "LE", price: 9200,
    engineSummary: "2.0L 4-cyl, 170 hp", horsepower: 170, torque: 203,
    fuelType: FuelType.Petrol, images: ["/images/cars/toyota-rav4-front.jpg", "/images/cars/toyota-rav4-side.jpg", "/images/cars/toyota-rav4-rear.jpg", "/images/cars/toyota-rav4-detail.jpg"], variants: [],
    specs: spec({ et: "Inline-4", disp: 2.0, hp: 170, tq: 203, z: 9.8, ts: 190, dr: DriveType.FWD, h: 1685, trunk: 580, warranty: "3 years / 100,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "toy-rav4-xle", modelId: "toyota-rav4", name: "XLE Hybrid", price: 11500,
    engineSummary: "2.5L Hybrid, 219 hp", horsepower: 219, torque: 221,
    fuelType: FuelType.Hybrid, images: ["/images/cars/toyota-rav4-front.jpg", "/images/cars/toyota-rav4-side.jpg", "/images/cars/toyota-rav4-rear.jpg", "/images/cars/toyota-rav4-detail.jpg"], variants: [],
    specs: spec({ et: "Hybrid", disp: 2.5, hp: 219, tq: 221, z: 7.8, ts: 180, fc: 5.8, fh: 5.0, fcm: 5.4, dr: DriveType.AWD, h: 1685, trunk: 580, warranty: "3 years / 100,000 km" }),
    equipment: premiumEquip,
  },

  // --- Toyota Corolla ---
  {
    id: "toy-corolla-xli", modelId: "toyota-corolla", name: "XLI", price: 5800,
    engineSummary: "1.6L 4-cyl, 121 hp", horsepower: 121, torque: 154,
    fuelType: FuelType.Petrol, images: ["/images/cars/toyota-corolla-front.jpg", "/images/cars/toyota-corolla-side.jpg", "/images/cars/toyota-corolla-rear.jpg", "/images/cars/toyota-corolla-detail.jpg"], variants: [],
    specs: spec({ et: "Inline-4", disp: 1.6, hp: 121, tq: 154, z: 11.2, ts: 185, dr: DriveType.FWD, l: 4630, trunk: 470, warranty: "3 years / 100,000 km", tr: TransmissionType.CVT }),
    equipment: baseEquip,
  },
  {
    id: "toy-corolla-gli", modelId: "toyota-corolla", name: "GLI", price: 6500,
    engineSummary: "2.0L 4-cyl, 168 hp", horsepower: 168, torque: 205,
    fuelType: FuelType.Petrol, images: ["/images/cars/toyota-corolla-front.jpg", "/images/cars/toyota-corolla-side.jpg", "/images/cars/toyota-corolla-rear.jpg", "/images/cars/toyota-corolla-detail.jpg"], variants: [],
    specs: spec({ et: "Inline-4", disp: 2.0, hp: 168, tq: 205, z: 9.0, ts: 200, dr: DriveType.FWD, l: 4630, trunk: 470, warranty: "3 years / 100,000 km", tr: TransmissionType.CVT }),
    equipment: premiumEquip,
  },

  // --- Toyota Hilux ---
  {
    id: "toy-hilux-sr", modelId: "toyota-hilux", name: "SR5", price: 10500,
    engineSummary: "2.8L Diesel Turbo, 204 hp", horsepower: 204, torque: 500,
    fuelType: FuelType.Diesel, images: ["/images/cars/toyota-hilux-front.jpg", "/images/cars/toyota-hilux-side.jpg", "/images/cars/toyota-hilux-rear.jpg", "/images/cars/toyota-hilux-detail.jpg"], variants: [],
    specs: spec({ et: "Diesel Turbo", disp: 2.8, hp: 204, tq: 500, z: 10.0, ts: 175, fc: 10.5, fh: 7.5, fcm: 8.8, dr: DriveType.FourWD, l: 5325, h: 1815, trunk: 0, seat: 5, wt: 2070, tank: 80, warranty: "3 years / 100,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "toy-hilux-trd", modelId: "toyota-hilux", name: "TRD Sport", price: 13000,
    engineSummary: "2.8L Diesel Turbo, 204 hp", horsepower: 204, torque: 500,
    fuelType: FuelType.Diesel, images: ["/images/cars/toyota-hilux-front.jpg", "/images/cars/toyota-hilux-side.jpg", "/images/cars/toyota-hilux-rear.jpg", "/images/cars/toyota-hilux-detail.jpg"], variants: [],
    specs: spec({ et: "Diesel Turbo", disp: 2.8, hp: 204, tq: 500, z: 10.0, ts: 175, dr: DriveType.FourWD, l: 5325, h: 1815, seat: 5, wt: 2100, tank: 80, warranty: "3 years / 100,000 km" }),
    equipment: premiumEquip,
  },

  // --- Lexus ES ---
  {
    id: "lex-es250", modelId: "lexus-es", name: "ES 250", price: 12500,
    engineSummary: "2.5L 4-cyl, 203 hp", horsepower: 203, torque: 250,
    fuelType: FuelType.Petrol, images: ["/images/cars/lexus-es-front.jpg", "/images/cars/lexus-es-side.jpg", "/images/cars/lexus-es-rear.jpg", "/images/cars/lexus-es-detail.jpg"], variants: [],
    specs: spec({ et: "Inline-4", disp: 2.5, hp: 203, tq: 250, z: 8.9, ts: 210, dr: DriveType.FWD, l: 4975 }),
    equipment: baseEquip,
  },
  {
    id: "lex-es350", modelId: "lexus-es", name: "ES 350", price: 15500,
    engineSummary: "3.5L V6, 302 hp", horsepower: 302, torque: 362,
    fuelType: FuelType.Petrol, images: ["/images/cars/lexus-es-front.jpg", "/images/cars/lexus-es-side.jpg", "/images/cars/lexus-es-rear.jpg", "/images/cars/lexus-es-detail.jpg"], variants: [
      { id: "lex-es350-fsport", trimId: "lex-es350", name: "F Sport", price: 17000, description: "F Sport performance styling", images: ["/images/cars/lexus-es-front.jpg", "/images/cars/lexus-es-side.jpg", "/images/cars/lexus-es-rear.jpg", "/images/cars/lexus-es-detail.jpg"] },
    ],
    specs: spec({ et: "V6", disp: 3.5, cyl: 6, hp: 302, tq: 362, z: 6.1, ts: 240, dr: DriveType.FWD, l: 4975 }),
    equipment: premiumEquip,
  },

  // --- Lexus RX ---
  {
    id: "lex-rx350", modelId: "lexus-rx", name: "RX 350", price: 19500,
    engineSummary: "2.4L Turbo, 275 hp", horsepower: 275, torque: 430,
    fuelType: FuelType.Petrol, images: ["/images/cars/lexus-rx-front.jpg", "/images/cars/lexus-rx-side.jpg", "/images/cars/lexus-rx-rear.jpg", "/images/cars/lexus-rx-detail.jpg"], variants: [
      { id: "lex-rx350-fsport", trimId: "lex-rx350", name: "F Sport", price: 21500, description: "F Sport design", images: ["/images/cars/lexus-rx-front.jpg", "/images/cars/lexus-rx-side.jpg", "/images/cars/lexus-rx-rear.jpg", "/images/cars/lexus-rx-detail.jpg"] },
    ],
    specs: spec({ et: "Inline-4 Turbo", disp: 2.4, hp: 275, tq: 430, z: 7.2, ts: 210, dr: DriveType.AWD, h: 1705, trunk: 612 }),
    equipment: premiumEquip,
  },
  {
    id: "lex-rx500h", modelId: "lexus-rx", name: "RX 500h", price: 26000,
    engineSummary: "2.4L Turbo Hybrid, 366 hp", horsepower: 366, torque: 460,
    fuelType: FuelType.Hybrid, images: ["/images/cars/lexus-rx-front.jpg", "/images/cars/lexus-rx-side.jpg", "/images/cars/lexus-rx-rear.jpg", "/images/cars/lexus-rx-detail.jpg"], variants: [],
    specs: spec({ et: "Turbo Hybrid", disp: 2.4, hp: 366, tq: 460, z: 6.0, ts: 220, fc: 7.5, fh: 6.5, fcm: 7.0, dr: DriveType.AWD, h: 1705, trunk: 612 }),
    equipment: premiumEquip,
  },

  // --- Lexus NX ---
  {
    id: "lex-nx250", modelId: "lexus-nx", name: "NX 250", price: 14000,
    engineSummary: "2.5L 4-cyl, 203 hp", horsepower: 203, torque: 250,
    fuelType: FuelType.Petrol, images: ["/images/cars/lexus-nx-front.jpg", "/images/cars/lexus-nx-side.jpg", "/images/cars/lexus-nx-rear.jpg", "/images/cars/lexus-nx-detail.jpg"], variants: [],
    specs: spec({ et: "Inline-4", disp: 2.5, hp: 203, tq: 250, z: 8.5, ts: 200, dr: DriveType.FWD, h: 1660, trunk: 520 }),
    equipment: baseEquip,
  },
  {
    id: "lex-nx350h", modelId: "lexus-nx", name: "NX 350h", price: 17500,
    engineSummary: "2.5L Hybrid, 239 hp", horsepower: 239, torque: 270,
    fuelType: FuelType.Hybrid, images: ["/images/cars/lexus-nx-front.jpg", "/images/cars/lexus-nx-side.jpg", "/images/cars/lexus-nx-rear.jpg", "/images/cars/lexus-nx-detail.jpg"], variants: [],
    specs: spec({ et: "Hybrid", disp: 2.5, hp: 239, tq: 270, z: 7.7, ts: 200, fc: 5.5, fh: 5.0, fcm: 5.2, dr: DriveType.AWD, h: 1660, trunk: 520 }),
    equipment: premiumEquip,
  },

  // --- Lexus IS ---
  {
    id: "lex-is300", modelId: "lexus-is", name: "IS 300", price: 14500,
    engineSummary: "2.0L 4-cyl Turbo, 241 hp", horsepower: 241, torque: 350,
    fuelType: FuelType.Petrol, images: ["/images/cars/lexus-is-front.jpg", "/images/cars/lexus-is-side.jpg", "/images/cars/lexus-is-rear.jpg", "/images/cars/lexus-is-detail.jpg"], variants: [
      { id: "lex-is300-fsport", trimId: "lex-is300", name: "F Sport", price: 16000, description: "F Sport handling package", images: ["/images/cars/lexus-is-front.jpg", "/images/cars/lexus-is-side.jpg", "/images/cars/lexus-is-rear.jpg", "/images/cars/lexus-is-detail.jpg"] },
    ],
    specs: spec({ hp: 241, tq: 350, z: 6.9, ts: 230, l: 4710 }),
    equipment: baseEquip,
  },
  {
    id: "lex-is500", modelId: "lexus-is", name: "IS 500", price: 24000,
    engineSummary: "5.0L V8, 472 hp", horsepower: 472, torque: 535,
    fuelType: FuelType.Petrol, images: ["/images/cars/lexus-is-front.jpg", "/images/cars/lexus-is-side.jpg", "/images/cars/lexus-is-rear.jpg", "/images/cars/lexus-is-detail.jpg"], variants: [],
    specs: spec({ et: "V8", disp: 5.0, cyl: 8, hp: 472, tq: 535, z: 4.5, ts: 270, l: 4710, fc: 13.0, fh: 9.5, fcm: 11.0 }),
    equipment: premiumEquip,
  },

  // --- Porsche 911 ---
  {
    id: "por-911-carrera", modelId: "porsche-911", name: "Carrera", price: 32000,
    engineSummary: "3.0L Flat-6 Turbo, 394 hp", horsepower: 394, torque: 450,
    fuelType: FuelType.Petrol, images: ["/images/cars/porsche-911-front.jpg", "/images/cars/porsche-911-side.jpg", "/images/cars/porsche-911-rear.jpg", "/images/cars/porsche-911-detail.jpg"], variants: [],
    specs: spec({ et: "Flat-6 Turbo", disp: 3.0, cyl: 6, hp: 394, tq: 450, z: 4.1, ts: 294, dr: DriveType.RWD, l: 4519, h: 1302, trunk: 132, seat: 4, wt: 1530, warranty: "4 years / unlimited km" }),
    equipment: premiumEquip,
  },
  {
    id: "por-911-s", modelId: "porsche-911", name: "Carrera S", price: 38000,
    engineSummary: "3.0L Flat-6 Turbo, 450 hp", horsepower: 450, torque: 530,
    fuelType: FuelType.Petrol, images: ["/images/cars/porsche-911-front.jpg", "/images/cars/porsche-911-side.jpg", "/images/cars/porsche-911-rear.jpg", "/images/cars/porsche-911-detail.jpg"], variants: [],
    specs: spec({ et: "Flat-6 Turbo", disp: 3.0, cyl: 6, hp: 450, tq: 530, z: 3.5, ts: 308, dr: DriveType.RWD, l: 4519, h: 1302, trunk: 132, seat: 4, wt: 1560, warranty: "4 years / unlimited km" }),
    equipment: premiumEquip,
  },

  // --- Porsche Cayenne ---
  {
    id: "por-cayenne", modelId: "porsche-cayenne", name: "Cayenne", price: 27000,
    engineSummary: "3.0L V6 Turbo, 353 hp", horsepower: 353, torque: 500,
    fuelType: FuelType.Petrol, images: ["/images/cars/porsche-cayenne-front.jpg", "/images/cars/porsche-cayenne-side.jpg", "/images/cars/porsche-cayenne-rear.jpg", "/images/cars/porsche-cayenne-detail.jpg"], variants: [],
    specs: spec({ et: "V6 Turbo", disp: 3.0, cyl: 6, hp: 353, tq: 500, z: 5.9, ts: 248, dr: DriveType.AWD, h: 1696, l: 4918, trunk: 772, wt: 2045, warranty: "4 years / unlimited km" }),
    equipment: premiumEquip,
  },
  {
    id: "por-cayenne-s", modelId: "porsche-cayenne", name: "Cayenne S", price: 35500,
    engineSummary: "4.0L V8 Turbo, 474 hp", horsepower: 474, torque: 600,
    fuelType: FuelType.Petrol, images: ["/images/cars/porsche-cayenne-front.jpg", "/images/cars/porsche-cayenne-side.jpg", "/images/cars/porsche-cayenne-rear.jpg", "/images/cars/porsche-cayenne-detail.jpg"], variants: [],
    specs: spec({ et: "V8 Twin-Turbo", disp: 4.0, cyl: 8, hp: 474, tq: 600, z: 4.7, ts: 264, dr: DriveType.AWD, h: 1696, l: 4918, trunk: 772, wt: 2175, warranty: "4 years / unlimited km" }),
    equipment: premiumEquip,
  },

  // --- Porsche Macan ---
  {
    id: "por-macan", modelId: "porsche-macan", name: "Macan", price: 20000,
    engineSummary: "2.0L 4-cyl Turbo, 265 hp", horsepower: 265, torque: 400,
    fuelType: FuelType.Petrol, images: ["/images/cars/porsche-macan-front.jpg", "/images/cars/porsche-macan-side.jpg", "/images/cars/porsche-macan-rear.jpg", "/images/cars/porsche-macan-detail.jpg"], variants: [],
    specs: spec({ hp: 265, tq: 400, z: 6.2, ts: 232, dr: DriveType.AWD, h: 1621, l: 4726, trunk: 488, wt: 1870, warranty: "4 years / unlimited km" }),
    equipment: baseEquip,
  },
  {
    id: "por-macan-s", modelId: "porsche-macan", name: "Macan S", price: 25000,
    engineSummary: "2.9L V6 Turbo, 380 hp", horsepower: 380, torque: 520,
    fuelType: FuelType.Petrol, images: ["/images/cars/porsche-macan-front.jpg", "/images/cars/porsche-macan-side.jpg", "/images/cars/porsche-macan-rear.jpg", "/images/cars/porsche-macan-detail.jpg"], variants: [],
    specs: spec({ et: "V6 Twin-Turbo", disp: 2.9, cyl: 6, hp: 380, tq: 520, z: 4.8, ts: 259, dr: DriveType.AWD, h: 1621, l: 4726, trunk: 488, wt: 1940, warranty: "4 years / unlimited km" }),
    equipment: premiumEquip,
  },

  // --- Porsche Taycan ---
  {
    id: "por-taycan", modelId: "porsche-taycan", name: "Taycan", price: 30000,
    engineSummary: "Electric, 408 hp", horsepower: 408, torque: 345,
    fuelType: FuelType.Electric, images: ["/images/cars/porsche-taycan-front.jpg", "/images/cars/porsche-taycan-side.jpg", "/images/cars/porsche-taycan-rear.jpg", "/images/cars/porsche-taycan-detail.jpg"], variants: [],
    specs: spec({ et: "Electric", disp: 0, cyl: 0, hp: 408, tq: 345, z: 5.4, ts: 230, fc: 0, fh: 0, fcm: 0, dr: DriveType.RWD, l: 4963, trunk: 407, wt: 2140, warranty: "4 years / unlimited km" }),
    equipment: premiumEquip,
  },
  {
    id: "por-taycan-4s", modelId: "porsche-taycan", name: "Taycan 4S", price: 40000,
    engineSummary: "Electric, 530 hp", horsepower: 530, torque: 640,
    fuelType: FuelType.Electric, images: ["/images/cars/porsche-taycan-front.jpg", "/images/cars/porsche-taycan-side.jpg", "/images/cars/porsche-taycan-rear.jpg", "/images/cars/porsche-taycan-detail.jpg"], variants: [],
    specs: spec({ et: "Electric", disp: 0, cyl: 0, hp: 530, tq: 640, z: 4.0, ts: 250, fc: 0, fh: 0, fcm: 0, dr: DriveType.AWD, l: 4963, trunk: 407, wt: 2295, warranty: "4 years / unlimited km" }),
    equipment: premiumEquip,
  },

  // --- Changan CS75 Plus ---
  {
    id: "cha-cs75-comfort", modelId: "changan-cs75", name: "Comfort", price: 4500,
    engineSummary: "1.5L Turbo, 181 hp", horsepower: 181, torque: 300,
    fuelType: FuelType.Petrol, images: ["/images/cars/changan-cs75-front.jpg", "/images/cars/changan-cs75-side.jpg", "/images/cars/changan-cs75-rear.jpg", "/images/cars/changan-cs75-detail.jpg"], variants: [],
    specs: spec({ disp: 1.5, hp: 181, tq: 300, z: 9.0, ts: 190, dr: DriveType.FWD, h: 1690, trunk: 620, warranty: "5 years / 150,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "cha-cs75-luxury", modelId: "changan-cs75", name: "Luxury", price: 5200,
    engineSummary: "2.0L Turbo, 233 hp", horsepower: 233, torque: 360,
    fuelType: FuelType.Petrol, images: ["/images/cars/changan-cs75-front.jpg", "/images/cars/changan-cs75-side.jpg", "/images/cars/changan-cs75-rear.jpg", "/images/cars/changan-cs75-detail.jpg"], variants: [],
    specs: spec({ hp: 233, tq: 360, z: 7.8, ts: 205, dr: DriveType.FWD, h: 1690, trunk: 620, warranty: "5 years / 150,000 km" }),
    equipment: premiumEquip,
  },

  // --- Changan CS55 Plus ---
  {
    id: "cha-cs55-classic", modelId: "changan-cs55", name: "Classic", price: 3800,
    engineSummary: "1.5L Turbo, 181 hp", horsepower: 181, torque: 300,
    fuelType: FuelType.Petrol, images: ["/images/cars/changan-cs55-front.jpg", "/images/cars/changan-cs55-side.jpg", "/images/cars/changan-cs55-rear.jpg", "/images/cars/changan-cs55-detail.jpg"], variants: [],
    specs: spec({ disp: 1.5, hp: 181, tq: 300, z: 9.5, ts: 185, dr: DriveType.FWD, h: 1660, trunk: 560, warranty: "5 years / 150,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "cha-cs55-premium", modelId: "changan-cs55", name: "Premium", price: 4400,
    engineSummary: "1.5L Turbo, 181 hp", horsepower: 181, torque: 300,
    fuelType: FuelType.Petrol, images: ["/images/cars/changan-cs55-front.jpg", "/images/cars/changan-cs55-side.jpg", "/images/cars/changan-cs55-rear.jpg", "/images/cars/changan-cs55-detail.jpg"], variants: [],
    specs: spec({ disp: 1.5, hp: 181, tq: 300, z: 9.5, ts: 185, dr: DriveType.FWD, h: 1660, trunk: 560, warranty: "5 years / 150,000 km" }),
    equipment: premiumEquip,
  },

  // --- Changan Alsvin ---
  {
    id: "cha-alsvin-comfort", modelId: "changan-alsvin", name: "Comfort", price: 3200,
    engineSummary: "1.5L 4-cyl, 105 hp", horsepower: 105, torque: 145,
    fuelType: FuelType.Petrol, images: ["/images/cars/changan-alsvin-front.jpg", "/images/cars/changan-alsvin-side.jpg", "/images/cars/changan-alsvin-rear.jpg", "/images/cars/changan-alsvin-detail.jpg"], variants: [],
    specs: spec({ et: "Inline-4", disp: 1.5, hp: 105, tq: 145, z: 12.0, ts: 170, dr: DriveType.FWD, l: 4390, trunk: 390, warranty: "5 years / 150,000 km", tr: TransmissionType.CVT }),
    equipment: baseEquip,
  },
  {
    id: "cha-alsvin-luxury", modelId: "changan-alsvin", name: "Luxury", price: 3800,
    engineSummary: "1.5L 4-cyl, 105 hp", horsepower: 105, torque: 145,
    fuelType: FuelType.Petrol, images: ["/images/cars/changan-alsvin-front.jpg", "/images/cars/changan-alsvin-side.jpg", "/images/cars/changan-alsvin-rear.jpg", "/images/cars/changan-alsvin-detail.jpg"], variants: [],
    specs: spec({ et: "Inline-4", disp: 1.5, hp: 105, tq: 145, z: 12.0, ts: 170, dr: DriveType.FWD, l: 4390, trunk: 390, warranty: "5 years / 150,000 km", tr: TransmissionType.CVT }),
    equipment: premiumEquip,
  },

  // --- Changan Uni-T ---
  {
    id: "cha-unit-standard", modelId: "changan-unit", name: "Standard", price: 5000,
    engineSummary: "1.5L Turbo, 181 hp", horsepower: 181, torque: 300,
    fuelType: FuelType.Petrol, images: ["/images/cars/changan-unit-front.jpg", "/images/cars/changan-unit-side.jpg", "/images/cars/changan-unit-rear.jpg", "/images/cars/changan-unit-detail.jpg"], variants: [],
    specs: spec({ disp: 1.5, hp: 181, tq: 300, z: 8.8, ts: 195, dr: DriveType.FWD, h: 1680, trunk: 490, warranty: "5 years / 150,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "cha-unit-premium", modelId: "changan-unit", name: "Premium", price: 5800,
    engineSummary: "2.0L Turbo, 233 hp", horsepower: 233, torque: 360,
    fuelType: FuelType.Petrol, images: ["/images/cars/changan-unit-front.jpg", "/images/cars/changan-unit-side.jpg", "/images/cars/changan-unit-rear.jpg", "/images/cars/changan-unit-detail.jpg"], variants: [],
    specs: spec({ hp: 233, tq: 360, z: 7.5, ts: 210, dr: DriveType.FWD, h: 1680, trunk: 490, warranty: "5 years / 150,000 km" }),
    equipment: premiumEquip,
  },

  // --- Haval H6 ---
  {
    id: "hav-h6-comfort", modelId: "haval-h6", name: "Comfort", price: 5500,
    engineSummary: "1.5L Turbo, 169 hp", horsepower: 169, torque: 285,
    fuelType: FuelType.Petrol, images: ["/images/cars/haval-h6-front.jpg", "/images/cars/haval-h6-side.jpg", "/images/cars/haval-h6-rear.jpg", "/images/cars/haval-h6-detail.jpg"], variants: [],
    specs: spec({ disp: 1.5, hp: 169, tq: 285, z: 9.7, ts: 185, dr: DriveType.FWD, h: 1696, trunk: 600, warranty: "5 years / 100,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "hav-h6-supreme", modelId: "haval-h6", name: "Supreme", price: 6500,
    engineSummary: "2.0L Turbo, 211 hp", horsepower: 211, torque: 325,
    fuelType: FuelType.Petrol, images: ["/images/cars/haval-h6-front.jpg", "/images/cars/haval-h6-side.jpg", "/images/cars/haval-h6-rear.jpg", "/images/cars/haval-h6-detail.jpg"], variants: [],
    specs: spec({ hp: 211, tq: 325, z: 8.5, ts: 200, dr: DriveType.AWD, h: 1696, trunk: 600, warranty: "5 years / 100,000 km" }),
    equipment: premiumEquip,
  },

  // --- Haval Jolion ---
  {
    id: "hav-jolion-active", modelId: "haval-jolion", name: "Active", price: 4200,
    engineSummary: "1.5L Turbo, 150 hp", horsepower: 150, torque: 220,
    fuelType: FuelType.Petrol, images: ["/images/cars/haval-jolion-front.jpg", "/images/cars/haval-jolion-side.jpg", "/images/cars/haval-jolion-rear.jpg", "/images/cars/haval-jolion-detail.jpg"], variants: [],
    specs: spec({ disp: 1.5, hp: 150, tq: 220, z: 10.5, ts: 180, dr: DriveType.FWD, h: 1665, trunk: 420, warranty: "5 years / 100,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "hav-jolion-premium", modelId: "haval-jolion", name: "Premium", price: 5000,
    engineSummary: "1.5L Turbo, 150 hp", horsepower: 150, torque: 220,
    fuelType: FuelType.Petrol, images: ["/images/cars/haval-jolion-front.jpg", "/images/cars/haval-jolion-side.jpg", "/images/cars/haval-jolion-rear.jpg", "/images/cars/haval-jolion-detail.jpg"], variants: [],
    specs: spec({ disp: 1.5, hp: 150, tq: 220, z: 10.5, ts: 180, dr: DriveType.FWD, h: 1665, trunk: 420, warranty: "5 years / 100,000 km" }),
    equipment: premiumEquip,
  },

  // --- Haval Dargo ---
  {
    id: "hav-dargo-standard", modelId: "haval-dargo", name: "Standard", price: 6500,
    engineSummary: "2.0L Turbo, 211 hp", horsepower: 211, torque: 325,
    fuelType: FuelType.Petrol, images: ["/images/cars/haval-dargo-front.jpg", "/images/cars/haval-dargo-side.jpg", "/images/cars/haval-dargo-rear.jpg", "/images/cars/haval-dargo-detail.jpg"], variants: [],
    specs: spec({ hp: 211, tq: 325, z: 8.8, ts: 195, dr: DriveType.FourWD, l: 4780, h: 1810, trunk: 560, seat: 5, warranty: "5 years / 100,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "hav-dargo-premium", modelId: "haval-dargo", name: "Premium", price: 7500,
    engineSummary: "2.0L Turbo, 211 hp", horsepower: 211, torque: 325,
    fuelType: FuelType.Petrol, images: ["/images/cars/haval-dargo-front.jpg", "/images/cars/haval-dargo-side.jpg", "/images/cars/haval-dargo-rear.jpg", "/images/cars/haval-dargo-detail.jpg"], variants: [],
    specs: spec({ hp: 211, tq: 325, z: 8.8, ts: 195, dr: DriveType.FourWD, l: 4780, h: 1810, trunk: 560, seat: 5, warranty: "5 years / 100,000 km" }),
    equipment: premiumEquip,
  },

  // --- MG HS ---
  {
    id: "mg-hs-com", modelId: "mg-hs", name: "Comfort", price: 5200,
    engineSummary: "1.5L Turbo, 162 hp", horsepower: 162, torque: 250,
    fuelType: FuelType.Petrol, images: ["/images/cars/mg-hs-front.jpg", "/images/cars/mg-hs-side.jpg", "/images/cars/mg-hs-rear.jpg", "/images/cars/mg-hs-detail.jpg"], variants: [],
    specs: spec({ disp: 1.5, hp: 162, tq: 250, z: 9.7, ts: 190, dr: DriveType.FWD, h: 1685, trunk: 463, warranty: "6 years / 150,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "mg-hs-lux", modelId: "mg-hs", name: "Luxury", price: 6200,
    engineSummary: "2.0L Turbo, 231 hp", horsepower: 231, torque: 370,
    fuelType: FuelType.Petrol, images: ["/images/cars/mg-hs-front.jpg", "/images/cars/mg-hs-side.jpg", "/images/cars/mg-hs-rear.jpg", "/images/cars/mg-hs-detail.jpg"], variants: [],
    specs: spec({ hp: 231, tq: 370, z: 7.8, ts: 210, dr: DriveType.AWD, h: 1685, trunk: 463, warranty: "6 years / 150,000 km" }),
    equipment: premiumEquip,
  },

  // --- MG ZS ---
  {
    id: "mg-zs-std", modelId: "mg-zs", name: "Standard", price: 3800,
    engineSummary: "1.5L 4-cyl, 106 hp", horsepower: 106, torque: 141,
    fuelType: FuelType.Petrol, images: ["/images/cars/mg-zs-front.jpg", "/images/cars/mg-zs-side.jpg", "/images/cars/mg-zs-rear.jpg", "/images/cars/mg-zs-detail.jpg"], variants: [],
    specs: spec({ et: "Inline-4", disp: 1.5, hp: 106, tq: 141, z: 11.5, ts: 175, dr: DriveType.FWD, h: 1644, trunk: 448, warranty: "6 years / 150,000 km", tr: TransmissionType.CVT }),
    equipment: baseEquip,
  },
  {
    id: "mg-zs-lux", modelId: "mg-zs", name: "Luxury", price: 4500,
    engineSummary: "1.5L 4-cyl, 106 hp", horsepower: 106, torque: 141,
    fuelType: FuelType.Petrol, images: ["/images/cars/mg-zs-front.jpg", "/images/cars/mg-zs-side.jpg", "/images/cars/mg-zs-rear.jpg", "/images/cars/mg-zs-detail.jpg"], variants: [],
    specs: spec({ et: "Inline-4", disp: 1.5, hp: 106, tq: 141, z: 11.5, ts: 175, dr: DriveType.FWD, h: 1644, trunk: 448, warranty: "6 years / 150,000 km", tr: TransmissionType.CVT }),
    equipment: premiumEquip,
  },

  // --- MG 5 ---
  {
    id: "mg-5-std", modelId: "mg-5", name: "Standard", price: 3500,
    engineSummary: "1.5L 4-cyl, 112 hp", horsepower: 112, torque: 150,
    fuelType: FuelType.Petrol, images: ["/images/cars/mg-5-front.jpg", "/images/cars/mg-5-side.jpg", "/images/cars/mg-5-rear.jpg", "/images/cars/mg-5-detail.jpg"], variants: [],
    specs: spec({ et: "Inline-4", disp: 1.5, hp: 112, tq: 150, z: 11.8, ts: 180, dr: DriveType.FWD, l: 4675, trunk: 512, warranty: "6 years / 150,000 km", tr: TransmissionType.CVT }),
    equipment: baseEquip,
  },
  {
    id: "mg-5-lux", modelId: "mg-5", name: "Luxury", price: 4200,
    engineSummary: "1.5L Turbo, 162 hp", horsepower: 162, torque: 250,
    fuelType: FuelType.Petrol, images: ["/images/cars/mg-5-front.jpg", "/images/cars/mg-5-side.jpg", "/images/cars/mg-5-rear.jpg", "/images/cars/mg-5-detail.jpg"], variants: [],
    specs: spec({ disp: 1.5, hp: 162, tq: 250, z: 9.5, ts: 200, dr: DriveType.FWD, l: 4675, trunk: 512, warranty: "6 years / 150,000 km" }),
    equipment: premiumEquip,
  },

  // --- MG 4 ---
  {
    id: "mg-4-se", modelId: "mg-4", name: "SE", price: 7500,
    engineSummary: "Electric, 170 hp", horsepower: 170, torque: 250,
    fuelType: FuelType.Electric, images: ["/images/cars/mg-4-front.jpg", "/images/cars/mg-4-side.jpg", "/images/cars/mg-4-rear.jpg", "/images/cars/mg-4-detail.jpg"], variants: [],
    specs: spec({ et: "Electric", disp: 0, cyl: 0, hp: 170, tq: 250, z: 7.7, ts: 160, fc: 0, fh: 0, fcm: 0, dr: DriveType.RWD, l: 4287, h: 1504, trunk: 363, warranty: "6 years / 150,000 km" }),
    equipment: baseEquip,
  },
  {
    id: "mg-4-trophy", modelId: "mg-4", name: "Trophy Extended Range", price: 9000,
    engineSummary: "Electric, 245 hp", horsepower: 245, torque: 350,
    fuelType: FuelType.Electric, images: ["/images/cars/mg-4-front.jpg", "/images/cars/mg-4-side.jpg", "/images/cars/mg-4-rear.jpg", "/images/cars/mg-4-detail.jpg"], variants: [],
    specs: spec({ et: "Electric", disp: 0, cyl: 0, hp: 245, tq: 350, z: 6.5, ts: 170, fc: 0, fh: 0, fcm: 0, dr: DriveType.RWD, l: 4287, h: 1504, trunk: 363, warranty: "6 years / 150,000 km" }),
    equipment: premiumEquip,
  },
].map((t) => ({ ...t, leadFormUrl: "https://example.com/interest", websiteUrl: "https://example.com/model" }));

// ============ MODELS ============
export const models: Model[] = [
  // Mercedes-Benz (flattened: each variant is its own model, ordered by segment)
  { id: "merc-a200", brandId: "mercedes", name: "A 200", bodyType: BodyType.Hatchback, year: 2026, startingPrice: 11000, trimCount: 1, isNew: false, isUpdated: false, featured: false, specsSummary: { engineRange: "1.3L", hpRange: "163 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/merc-a200-front.jpg", segmentOrder: 1, modelFamily: "A-Class" , images: { front: "/images/cars/merc-a200-front.jpg", rear: "/images/cars/merc-a200-rear.jpg", side: "/images/cars/merc-a200-side.jpg", detail: "/images/cars/merc-a200-detail.jpg", hero: "/images/cars/merc-a200-hero.jpg" }},
  { id: "merc-a250", brandId: "mercedes", name: "A 250", bodyType: BodyType.Hatchback, year: 2026, startingPrice: 13800, trimCount: 1, isNew: false, isUpdated: false, featured: false, specsSummary: { engineRange: "2.0L", hpRange: "224 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/merc-a250-front.jpg", segmentOrder: 2, modelFamily: "A-Class" , images: { front: "/images/cars/merc-a250-front.jpg", rear: "/images/cars/merc-a250-rear.jpg", side: "/images/cars/merc-a250-side.jpg", detail: "/images/cars/merc-a250-detail.jpg", hero: "/images/cars/merc-a250-hero.jpg" }},
  { id: "merc-c200", brandId: "mercedes", name: "C 200", bodyType: BodyType.Sedan, year: 2026, startingPrice: 13500, trimCount: 2, isNew: false, isUpdated: true, featured: true, specsSummary: { engineRange: "1.5L", hpRange: "204 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/merc-c200-front.jpg", segmentOrder: 3, modelFamily: "C-Class" , images: { front: "/images/cars/merc-c200-front.jpg", rear: "/images/cars/merc-c200-rear.jpg", side: "/images/cars/merc-c200-side.jpg", detail: "/images/cars/merc-c200-detail.jpg", hero: "/images/cars/merc-c200-hero.jpg" }},
  { id: "merc-c300", brandId: "mercedes", name: "C 300", bodyType: BodyType.Sedan, year: 2026, startingPrice: 16800, trimCount: 2, isNew: false, isUpdated: true, featured: false, specsSummary: { engineRange: "2.0L", hpRange: "258 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/merc-c300-front.jpg", segmentOrder: 4, modelFamily: "C-Class" , images: { front: "/images/cars/merc-c300-front.jpg", rear: "/images/cars/merc-c300-rear.jpg", side: "/images/cars/merc-c300-side.jpg", detail: "/images/cars/merc-c300-detail.jpg", hero: "/images/cars/merc-c300-hero.jpg" }},
  { id: "merc-c43", brandId: "mercedes", name: "C 43 AMG", bodyType: BodyType.Sedan, year: 2026, startingPrice: 24500, trimCount: 1, isNew: false, isUpdated: false, featured: true, specsSummary: { engineRange: "2.0L", hpRange: "408 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/merc-c43-front.jpg", segmentOrder: 5, modelFamily: "C-Class" , images: { front: "/images/cars/merc-c43-front.jpg", rear: "/images/cars/merc-c43-rear.jpg", side: "/images/cars/merc-c43-side.jpg", detail: "/images/cars/merc-c43-detail.jpg", hero: "/images/cars/merc-c43-hero.jpg" }},
  { id: "merc-e200", brandId: "mercedes", name: "E 200", bodyType: BodyType.Sedan, year: 2026, startingPrice: 18500, trimCount: 2, isNew: true, isUpdated: false, featured: true, specsSummary: { engineRange: "2.0L", hpRange: "204 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/merc-e200-front.jpg", segmentOrder: 6, modelFamily: "E-Class" , images: { front: "/images/cars/merc-e200-front.jpg", rear: "/images/cars/merc-e200-rear.jpg", side: "/images/cars/merc-e200-side.jpg", detail: "/images/cars/merc-e200-detail.jpg", hero: "/images/cars/merc-e200-hero.jpg" }},
  { id: "merc-e300", brandId: "mercedes", name: "E 300", bodyType: BodyType.Sedan, year: 2026, startingPrice: 22000, trimCount: 1, isNew: true, isUpdated: false, featured: true, specsSummary: { engineRange: "2.0L", hpRange: "258 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/merc-e300-front.jpg", segmentOrder: 7, modelFamily: "E-Class" , images: { front: "/images/cars/merc-e300-front.jpg", rear: "/images/cars/merc-e300-rear.jpg", side: "/images/cars/merc-e300-side.jpg", detail: "/images/cars/merc-e300-detail.jpg", hero: "/images/cars/merc-e300-hero.jpg" }},
  { id: "merc-glc200", brandId: "mercedes", name: "GLC 200", bodyType: BodyType.SUV, year: 2026, startingPrice: 17500, trimCount: 2, isNew: false, isUpdated: false, featured: true, specsSummary: { engineRange: "2.0L", hpRange: "204 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/merc-glc200-front.jpg", segmentOrder: 8, modelFamily: "GLC" , images: { front: "/images/cars/merc-glc200-front.jpg", rear: "/images/cars/merc-glc200-rear.jpg", side: "/images/cars/merc-glc200-side.jpg", detail: "/images/cars/merc-glc200-detail.jpg", hero: "/images/cars/merc-glc200-hero.jpg" }},
  { id: "merc-glc300", brandId: "mercedes", name: "GLC 300", bodyType: BodyType.SUV, year: 2026, startingPrice: 21000, trimCount: 1, isNew: false, isUpdated: false, featured: false, specsSummary: { engineRange: "2.0L", hpRange: "258 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/merc-glc300-front.jpg", segmentOrder: 9, modelFamily: "GLC" , images: { front: "/images/cars/merc-glc300-front.jpg", rear: "/images/cars/merc-glc300-rear.jpg", side: "/images/cars/merc-glc300-side.jpg", detail: "/images/cars/merc-glc300-detail.jpg", hero: "/images/cars/merc-glc300-hero.jpg" }},
  { id: "merc-gle450", brandId: "mercedes", name: "GLE 450", bodyType: BodyType.SUV, year: 2026, startingPrice: 28000, trimCount: 1, isNew: false, isUpdated: false, featured: true, specsSummary: { engineRange: "3.0L", hpRange: "367 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/merc-gle450-front.jpg", segmentOrder: 10, modelFamily: "GLE" , images: { front: "/images/cars/merc-gle450-front.jpg", rear: "/images/cars/merc-gle450-rear.jpg", side: "/images/cars/merc-gle450-side.jpg", detail: "/images/cars/merc-gle450-detail.jpg", hero: "/images/cars/merc-gle450-hero.jpg" }},
  { id: "merc-gle53", brandId: "mercedes", name: "AMG GLE 53", bodyType: BodyType.SUV, year: 2026, startingPrice: 38000, trimCount: 1, isNew: false, isUpdated: false, featured: false, specsSummary: { engineRange: "3.0L", hpRange: "429 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/merc-gle53-front.jpg", segmentOrder: 11, modelFamily: "GLE" , images: { front: "/images/cars/merc-gle53-front.jpg", rear: "/images/cars/merc-gle53-rear.jpg", side: "/images/cars/merc-gle53-side.jpg", detail: "/images/cars/merc-gle53-detail.jpg", hero: "/images/cars/merc-gle53-hero.jpg" }},

  // BMW
  { id: "bmw-3-series", brandId: "bmw", name: "3 Series", bodyType: BodyType.Sedan, year: 2026, startingPrice: 12800, trimCount: 3, isNew: false, isUpdated: true, featured: true, specsSummary: { engineRange: "2.0L - 3.0L", hpRange: "184 - 374 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/bmw-3-series-front.jpg" , images: { front: "/images/cars/bmw-3-series-front.jpg", rear: "/images/cars/bmw-3-series-rear.jpg", side: "/images/cars/bmw-3-series-side.jpg", detail: "/images/cars/bmw-3-series-detail.jpg", hero: "/images/cars/bmw-3-series-hero.jpg" }},
  { id: "bmw-5-series", brandId: "bmw", name: "5 Series", bodyType: BodyType.Sedan, year: 2026, startingPrice: 18000, trimCount: 2, isNew: false, isUpdated: false, featured: false, specsSummary: { engineRange: "2.0L", hpRange: "208 - 245 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/bmw-5-series-front.jpg" , images: { front: "/images/cars/bmw-5-series-front.jpg", rear: "/images/cars/bmw-5-series-rear.jpg", side: "/images/cars/bmw-5-series-side.jpg", detail: "/images/cars/bmw-5-series-detail.jpg", hero: "/images/cars/bmw-5-series-hero.jpg" }},
  { id: "bmw-x3", brandId: "bmw", name: "X3", bodyType: BodyType.SUV, year: 2026, startingPrice: 16500, trimCount: 2, isNew: true, isUpdated: false, featured: false, specsSummary: { engineRange: "2.0L", hpRange: "184 - 245 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/bmw-x3-front.jpg" , images: { front: "/images/cars/bmw-x3-front.jpg", rear: "/images/cars/bmw-x3-rear.jpg", side: "/images/cars/bmw-x3-side.jpg", detail: "/images/cars/bmw-x3-detail.jpg", hero: "/images/cars/bmw-x3-hero.jpg" }},
  { id: "bmw-x5", brandId: "bmw", name: "X5", bodyType: BodyType.SUV, year: 2026, startingPrice: 28500, trimCount: 2, isNew: false, isUpdated: false, featured: true, specsSummary: { engineRange: "3.0L - 4.4L", hpRange: "340 - 530 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/bmw-x5-front.jpg" , images: { front: "/images/cars/bmw-x5-front.jpg", rear: "/images/cars/bmw-x5-rear.jpg", side: "/images/cars/bmw-x5-side.jpg", detail: "/images/cars/bmw-x5-detail.jpg", hero: "/images/cars/bmw-x5-hero.jpg" }},
  { id: "bmw-4-coupe", brandId: "bmw", name: "4 Series Coupe", bodyType: BodyType.Coupe, year: 2026, startingPrice: 16000, trimCount: 2, isNew: false, isUpdated: false, featured: false, specsSummary: { engineRange: "2.0L - 3.0L", hpRange: "184 - 374 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/bmw-4-coupe-front.jpg" , images: { front: "/images/cars/bmw-4-coupe-front.jpg", rear: "/images/cars/bmw-4-coupe-rear.jpg", side: "/images/cars/bmw-4-coupe-side.jpg", detail: "/images/cars/bmw-4-coupe-detail.jpg", hero: "/images/cars/bmw-4-coupe-hero.jpg" }},

  // Toyota
  { id: "toyota-camry", brandId: "toyota", name: "Camry", bodyType: BodyType.Sedan, year: 2026, startingPrice: 7800, trimCount: 3, isNew: false, isUpdated: true, featured: true, specsSummary: { engineRange: "2.5L - 3.5L", hpRange: "203 - 301 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/toyota-camry-front.jpg" , images: { front: "/images/cars/toyota-camry-front.jpg", rear: "/images/cars/toyota-camry-rear.jpg", side: "/images/cars/toyota-camry-side.jpg", detail: "/images/cars/toyota-camry-detail.jpg", hero: "/images/cars/toyota-camry-hero.jpg" }},
  { id: "toyota-lc", brandId: "toyota", name: "Land Cruiser", bodyType: BodyType.SUV, year: 2026, startingPrice: 22000, trimCount: 2, isNew: true, isUpdated: false, featured: true, specsSummary: { engineRange: "3.5L V6", hpRange: "409 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/toyota-lc-front.jpg" , images: { front: "/images/cars/toyota-lc-front.jpg", rear: "/images/cars/toyota-lc-rear.jpg", side: "/images/cars/toyota-lc-side.jpg", detail: "/images/cars/toyota-lc-detail.jpg", hero: "/images/cars/toyota-lc-hero.jpg" }},
  { id: "toyota-rav4", brandId: "toyota", name: "RAV4", bodyType: BodyType.SUV, year: 2026, startingPrice: 9200, trimCount: 2, isNew: false, isUpdated: false, featured: false, specsSummary: { engineRange: "2.0L - 2.5L", hpRange: "170 - 219 hp", fuelTypes: [FuelType.Petrol, FuelType.Hybrid] }, imageUrl: "/images/cars/toyota-rav4-front.jpg" , images: { front: "/images/cars/toyota-rav4-front.jpg", rear: "/images/cars/toyota-rav4-rear.jpg", side: "/images/cars/toyota-rav4-side.jpg", detail: "/images/cars/toyota-rav4-detail.jpg", hero: "/images/cars/toyota-rav4-hero.jpg" }},
  { id: "toyota-corolla", brandId: "toyota", name: "Corolla", bodyType: BodyType.Sedan, year: 2026, startingPrice: 5800, trimCount: 2, isNew: false, isUpdated: false, featured: false, specsSummary: { engineRange: "1.6L - 2.0L", hpRange: "121 - 168 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/toyota-corolla-front.jpg" , images: { front: "/images/cars/toyota-corolla-front.jpg", rear: "/images/cars/toyota-corolla-rear.jpg", side: "/images/cars/toyota-corolla-side.jpg", detail: "/images/cars/toyota-corolla-detail.jpg", hero: "/images/cars/toyota-corolla-hero.jpg" }},
  { id: "toyota-hilux", brandId: "toyota", name: "Hilux", bodyType: BodyType.Pickup, year: 2026, startingPrice: 10500, trimCount: 2, isNew: false, isUpdated: true, featured: false, specsSummary: { engineRange: "2.8L Diesel", hpRange: "204 hp", fuelTypes: [FuelType.Diesel] }, imageUrl: "/images/cars/toyota-hilux-front.jpg" , images: { front: "/images/cars/toyota-hilux-front.jpg", rear: "/images/cars/toyota-hilux-rear.jpg", side: "/images/cars/toyota-hilux-side.jpg", detail: "/images/cars/toyota-hilux-detail.jpg", hero: "/images/cars/toyota-hilux-hero.jpg" }},

  // Lexus
  { id: "lexus-es", brandId: "lexus", name: "ES", bodyType: BodyType.Sedan, year: 2026, startingPrice: 12500, trimCount: 2, isNew: false, isUpdated: false, featured: false, specsSummary: { engineRange: "2.5L - 3.5L", hpRange: "203 - 302 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/lexus-es-front.jpg" , images: { front: "/images/cars/lexus-es-front.jpg", rear: "/images/cars/lexus-es-rear.jpg", side: "/images/cars/lexus-es-side.jpg", detail: "/images/cars/lexus-es-detail.jpg", hero: "/images/cars/lexus-es-hero.jpg" }},
  { id: "lexus-rx", brandId: "lexus", name: "RX", bodyType: BodyType.SUV, year: 2026, startingPrice: 19500, trimCount: 2, isNew: true, isUpdated: false, featured: true, specsSummary: { engineRange: "2.4L Turbo", hpRange: "275 - 366 hp", fuelTypes: [FuelType.Petrol, FuelType.Hybrid] }, imageUrl: "/images/cars/lexus-rx-front.jpg" , images: { front: "/images/cars/lexus-rx-front.jpg", rear: "/images/cars/lexus-rx-rear.jpg", side: "/images/cars/lexus-rx-side.jpg", detail: "/images/cars/lexus-rx-detail.jpg", hero: "/images/cars/lexus-rx-hero.jpg" }},
  { id: "lexus-nx", brandId: "lexus", name: "NX", bodyType: BodyType.SUV, year: 2026, startingPrice: 14000, trimCount: 2, isNew: false, isUpdated: false, featured: false, specsSummary: { engineRange: "2.5L", hpRange: "203 - 239 hp", fuelTypes: [FuelType.Petrol, FuelType.Hybrid] }, imageUrl: "/images/cars/lexus-nx-front.jpg" , images: { front: "/images/cars/lexus-nx-front.jpg", rear: "/images/cars/lexus-nx-rear.jpg", side: "/images/cars/lexus-nx-side.jpg", detail: "/images/cars/lexus-nx-detail.jpg", hero: "/images/cars/lexus-nx-hero.jpg" }},
  { id: "lexus-is", brandId: "lexus", name: "IS", bodyType: BodyType.Sedan, year: 2026, startingPrice: 14500, trimCount: 2, isNew: false, isUpdated: false, featured: true, specsSummary: { engineRange: "2.0L - 5.0L", hpRange: "241 - 472 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/lexus-is-front.jpg" , images: { front: "/images/cars/lexus-is-front.jpg", rear: "/images/cars/lexus-is-rear.jpg", side: "/images/cars/lexus-is-side.jpg", detail: "/images/cars/lexus-is-detail.jpg", hero: "/images/cars/lexus-is-hero.jpg" }},

  // Porsche
  { id: "porsche-911", brandId: "porsche", name: "911", bodyType: BodyType.Coupe, year: 2026, startingPrice: 32000, trimCount: 2, isNew: false, isUpdated: true, featured: true, specsSummary: { engineRange: "3.0L Flat-6", hpRange: "394 - 450 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/porsche-911-front.jpg" , images: { front: "/images/cars/porsche-911-front.jpg", rear: "/images/cars/porsche-911-rear.jpg", side: "/images/cars/porsche-911-side.jpg", detail: "/images/cars/porsche-911-detail.jpg", hero: "/images/cars/porsche-911-hero.jpg" }},
  { id: "porsche-cayenne", brandId: "porsche", name: "Cayenne", bodyType: BodyType.SUV, year: 2026, startingPrice: 27000, trimCount: 2, isNew: false, isUpdated: false, featured: false, specsSummary: { engineRange: "3.0L - 4.0L", hpRange: "353 - 474 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/porsche-cayenne-front.jpg" , images: { front: "/images/cars/porsche-cayenne-front.jpg", rear: "/images/cars/porsche-cayenne-rear.jpg", side: "/images/cars/porsche-cayenne-side.jpg", detail: "/images/cars/porsche-cayenne-detail.jpg", hero: "/images/cars/porsche-cayenne-hero.jpg" }},
  { id: "porsche-macan", brandId: "porsche", name: "Macan", bodyType: BodyType.SUV, year: 2026, startingPrice: 20000, trimCount: 2, isNew: false, isUpdated: false, featured: false, specsSummary: { engineRange: "2.0L - 2.9L", hpRange: "265 - 380 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/porsche-macan-front.jpg" , images: { front: "/images/cars/porsche-macan-front.jpg", rear: "/images/cars/porsche-macan-rear.jpg", side: "/images/cars/porsche-macan-side.jpg", detail: "/images/cars/porsche-macan-detail.jpg", hero: "/images/cars/porsche-macan-hero.jpg" }},
  { id: "porsche-taycan", brandId: "porsche", name: "Taycan", bodyType: BodyType.Sedan, year: 2026, startingPrice: 30000, trimCount: 2, isNew: true, isUpdated: false, featured: true, specsSummary: { engineRange: "Electric", hpRange: "408 - 530 hp", fuelTypes: [FuelType.Electric] }, imageUrl: "/images/cars/porsche-taycan-front.jpg" , images: { front: "/images/cars/porsche-taycan-front.jpg", rear: "/images/cars/porsche-taycan-rear.jpg", side: "/images/cars/porsche-taycan-side.jpg", detail: "/images/cars/porsche-taycan-detail.jpg", hero: "/images/cars/porsche-taycan-hero.jpg" }},

  // Changan
  { id: "changan-cs75", brandId: "changan", name: "CS75 Plus", bodyType: BodyType.SUV, year: 2026, startingPrice: 4500, trimCount: 2, isNew: false, isUpdated: true, featured: true, specsSummary: { engineRange: "1.5L - 2.0L", hpRange: "181 - 233 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/changan-cs75-front.jpg" , images: { front: "/images/cars/changan-cs75-front.jpg", rear: "/images/cars/changan-cs75-rear.jpg", side: "/images/cars/changan-cs75-side.jpg", detail: "/images/cars/changan-cs75-detail.jpg", hero: "/images/cars/changan-cs75-hero.jpg" }},
  { id: "changan-cs55", brandId: "changan", name: "CS55 Plus", bodyType: BodyType.SUV, year: 2026, startingPrice: 3800, trimCount: 2, isNew: false, isUpdated: false, featured: false, specsSummary: { engineRange: "1.5L", hpRange: "181 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/changan-cs55-front.jpg" , images: { front: "/images/cars/changan-cs55-front.jpg", rear: "/images/cars/changan-cs55-rear.jpg", side: "/images/cars/changan-cs55-side.jpg", detail: "/images/cars/changan-cs55-detail.jpg", hero: "/images/cars/changan-cs55-hero.jpg" }},
  { id: "changan-alsvin", brandId: "changan", name: "Alsvin", bodyType: BodyType.Sedan, year: 2026, startingPrice: 3200, trimCount: 2, isNew: true, isUpdated: false, featured: false, specsSummary: { engineRange: "1.5L", hpRange: "105 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/changan-alsvin-front.jpg" , images: { front: "/images/cars/changan-alsvin-front.jpg", rear: "/images/cars/changan-alsvin-rear.jpg", side: "/images/cars/changan-alsvin-side.jpg", detail: "/images/cars/changan-alsvin-detail.jpg", hero: "/images/cars/changan-alsvin-hero.jpg" }},
  { id: "changan-unit", brandId: "changan", name: "Uni-T", bodyType: BodyType.SUV, year: 2026, startingPrice: 5000, trimCount: 2, isNew: false, isUpdated: false, featured: false, specsSummary: { engineRange: "1.5L - 2.0L", hpRange: "181 - 233 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/changan-unit-front.jpg" , images: { front: "/images/cars/changan-unit-front.jpg", rear: "/images/cars/changan-unit-rear.jpg", side: "/images/cars/changan-unit-side.jpg", detail: "/images/cars/changan-unit-detail.jpg", hero: "/images/cars/changan-unit-hero.jpg" }},

  // Haval
  { id: "haval-h6", brandId: "haval", name: "H6", bodyType: BodyType.SUV, year: 2026, startingPrice: 5500, trimCount: 2, isNew: false, isUpdated: false, featured: true, specsSummary: { engineRange: "1.5L - 2.0L", hpRange: "169 - 211 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/haval-h6-front.jpg" , images: { front: "/images/cars/haval-h6-front.jpg", rear: "/images/cars/haval-h6-rear.jpg", side: "/images/cars/haval-h6-side.jpg", detail: "/images/cars/haval-h6-detail.jpg", hero: "/images/cars/haval-h6-hero.jpg" }},
  { id: "haval-jolion", brandId: "haval", name: "Jolion", bodyType: BodyType.SUV, year: 2026, startingPrice: 4200, trimCount: 2, isNew: true, isUpdated: false, featured: false, specsSummary: { engineRange: "1.5L", hpRange: "150 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/haval-jolion-front.jpg" , images: { front: "/images/cars/haval-jolion-front.jpg", rear: "/images/cars/haval-jolion-rear.jpg", side: "/images/cars/haval-jolion-side.jpg", detail: "/images/cars/haval-jolion-detail.jpg", hero: "/images/cars/haval-jolion-hero.jpg" }},
  { id: "haval-dargo", brandId: "haval", name: "Dargo", bodyType: BodyType.Pickup, year: 2026, startingPrice: 6500, trimCount: 2, isNew: false, isUpdated: false, featured: false, specsSummary: { engineRange: "2.0L", hpRange: "211 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/haval-dargo-front.jpg" , images: { front: "/images/cars/haval-dargo-front.jpg", rear: "/images/cars/haval-dargo-rear.jpg", side: "/images/cars/haval-dargo-side.jpg", detail: "/images/cars/haval-dargo-detail.jpg", hero: "/images/cars/haval-dargo-hero.jpg" }},

  // MG
  { id: "mg-hs", brandId: "mg", name: "HS", bodyType: BodyType.SUV, year: 2026, startingPrice: 5200, trimCount: 2, isNew: false, isUpdated: false, featured: true, specsSummary: { engineRange: "1.5L - 2.0L", hpRange: "162 - 231 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/mg-hs-front.jpg" , images: { front: "/images/cars/mg-hs-front.jpg", rear: "/images/cars/mg-hs-rear.jpg", side: "/images/cars/mg-hs-side.jpg", detail: "/images/cars/mg-hs-detail.jpg", hero: "/images/cars/mg-hs-hero.jpg" }},
  { id: "mg-zs", brandId: "mg", name: "ZS", bodyType: BodyType.SUV, year: 2026, startingPrice: 3800, trimCount: 2, isNew: false, isUpdated: true, featured: false, specsSummary: { engineRange: "1.5L", hpRange: "106 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/mg-zs-front.jpg" , images: { front: "/images/cars/mg-zs-front.jpg", rear: "/images/cars/mg-zs-rear.jpg", side: "/images/cars/mg-zs-side.jpg", detail: "/images/cars/mg-zs-detail.jpg", hero: "/images/cars/mg-zs-hero.jpg" }},
  { id: "mg-5", brandId: "mg", name: "MG5", bodyType: BodyType.Sedan, year: 2026, startingPrice: 3500, trimCount: 2, isNew: false, isUpdated: false, featured: false, specsSummary: { engineRange: "1.5L", hpRange: "112 - 162 hp", fuelTypes: [FuelType.Petrol] }, imageUrl: "/images/cars/mg-5-front.jpg" , images: { front: "/images/cars/mg-5-front.jpg", rear: "/images/cars/mg-5-rear.jpg", side: "/images/cars/mg-5-side.jpg", detail: "/images/cars/mg-5-detail.jpg", hero: "/images/cars/mg-5-hero.jpg" }},
  { id: "mg-4", brandId: "mg", name: "MG4 Electric", bodyType: BodyType.Hatchback, year: 2026, startingPrice: 7500, trimCount: 2, isNew: true, isUpdated: false, featured: true, specsSummary: { engineRange: "Electric", hpRange: "170 - 245 hp", fuelTypes: [FuelType.Electric] }, imageUrl: "/images/cars/mg-4-front.jpg" , images: { front: "/images/cars/mg-4-front.jpg", rear: "/images/cars/mg-4-rear.jpg", side: "/images/cars/mg-4-side.jpg", detail: "/images/cars/mg-4-detail.jpg", hero: "/images/cars/mg-4-hero.jpg" }},
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
    imageUrl: "/images/cars/toyota-rav4-front.jpg",
    modelIds: ["toyota-rav4", "merc-glc200", "bmw-x3", "lexus-nx", "haval-h6", "mg-hs", "changan-cs75"],
  },
  {
    id: "performance", title: "Performance & Sport",
    description: "For those who live life in the fast lane.",
    imageUrl: "/images/cars/toyota-rav4-front.jpg",
    modelIds: ["porsche-911", "bmw-4-coupe", "merc-c43", "lexus-is", "porsche-taycan"],
  },
  {
    id: "luxury-daily", title: "Luxury Daily Drivers",
    description: "Arrive in style every single day.",
    imageUrl: "/images/cars/toyota-rav4-front.jpg",
    modelIds: ["merc-e200", "bmw-5-series", "lexus-es", "porsche-macan", "porsche-cayenne"],
  },
  {
    id: "first-car", title: "First-Car Picks Under 8,000 KWD",
    description: "Great value cars perfect for new drivers.",
    imageUrl: "/images/cars/toyota-rav4-front.jpg",
    modelIds: ["toyota-corolla", "toyota-camry", "changan-alsvin", "mg-5", "mg-zs", "haval-jolion", "changan-cs55"],
  },
];
