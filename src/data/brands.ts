import { Brand, Model, Trim, ColorOption } from "@/types";

const whiteColor: ColorOption = { name: "White", hex: "#FFFFFF", type: "solid", upcharge: 0 };
const blackColor: ColorOption = { name: "Black", hex: "#000000", type: "metallic", upcharge: 200 };
const silverColor: ColorOption = { name: "Silver", hex: "#C0C0C0", type: "metallic", upcharge: 200 };
const redColor: ColorOption = { name: "Red", hex: "#CC0000", type: "metallic", upcharge: 400 };
const blueColor: ColorOption = { name: "Blue", hex: "#003399", type: "metallic", upcharge: 400 };
const grayColor: ColorOption = { name: "Gray", hex: "#808080", type: "metallic", upcharge: 200 };
const pearlWhite: ColorOption = { name: "Pearl White", hex: "#F5F5F0", type: "pearl", upcharge: 500 };
const darkBlue: ColorOption = { name: "Dark Blue", hex: "#00264D", type: "metallic", upcharge: 400 };
const greenColor: ColorOption = { name: "Green", hex: "#2E6B30", type: "metallic", upcharge: 400 };
const burgundyColor: ColorOption = { name: "Burgundy", hex: "#800020", type: "pearl", upcharge: 500 };

export const brands: Brand[] = [
  // ─── TOYOTA ──────────────────────────────────────────────
  {
    id: "toyota",
    name: "Toyota",
    logo: "https://placehold.co/200x200/e9ebf2/324575?text=Toyota",
    description: "Toyota Motor Corporation is a Japanese multinational automotive manufacturer known for reliability, efficiency, and innovation.",
    country: "Japan",
    foundedYear: 1937,
    models: [
      {
        id: "toyota-camry",
        brandId: "toyota",
        name: "Camry",
        image: "https://placehold.co/600x400/e9ebf2/324575?text=Toyota+Camry",
        year: 2026,
        bodyType: "sedan",
        priceRange: { min: 29500, max: 36000, currency: "USD" },
        description: "The Toyota Camry is a midsize sedan that combines hybrid efficiency with a refined driving experience and advanced safety features.",
        trims: [
          {
            id: "camry-le",
            modelId: "toyota-camry",
            name: "LE",
            basePrice: 29500,
            engine: "2.5L 4-Cylinder Hybrid",
            transmission: "cvt",
            horsepower: 225,
            torque: 176,
            fuelType: "hybrid",
            drivetrain: "FWD",
            fuelEconomy: { city: 51, highway: 53, combined: 52 },
            variants: [
              {
                id: "camry-le-std",
                trimId: "camry-le",
                name: "Standard",
                price: 29500,
                additionalFeatures: [
                  "7-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Toyota Safety Sense 3.0",
                  "Adaptive cruise control",
                  "Lane departure warning",
                  "Automatic high beams",
                  "Dual-zone climate control"
                ],
                colorOptions: [whiteColor, blackColor, silverColor],
                availability: "in-stock"
              },
              {
                id: "camry-le-conv",
                trimId: "camry-le",
                name: "Convenience",
                price: 31200,
                additionalFeatures: [
                  "7-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Toyota Safety Sense 3.0",
                  "Adaptive cruise control",
                  "Lane departure warning",
                  "Automatic high beams",
                  "Dual-zone climate control",
                  "Power driver seat",
                  "Blind spot monitor",
                  "Rear cross traffic alert",
                  "Wireless charging pad"
                ],
                colorOptions: [whiteColor, blackColor, silverColor, blueColor],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "camry-se",
            modelId: "toyota-camry",
            name: "SE",
            basePrice: 31000,
            engine: "2.5L 4-Cylinder Hybrid",
            transmission: "cvt",
            horsepower: 225,
            torque: 176,
            fuelType: "hybrid",
            drivetrain: "FWD",
            fuelEconomy: { city: 44, highway: 47, combined: 46 },
            variants: [
              {
                id: "camry-se-std",
                trimId: "camry-se",
                name: "Standard",
                price: 31000,
                additionalFeatures: [
                  "9-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Toyota Safety Sense 3.0",
                  "Sport-tuned suspension",
                  "18-inch alloy wheels",
                  "Paddle shifters",
                  "Dual-zone climate control",
                  "LED headlights"
                ],
                colorOptions: [whiteColor, blackColor, redColor],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "camry-xle",
            modelId: "toyota-camry",
            name: "XLE",
            basePrice: 34100,
            engine: "2.5L 4-Cylinder Hybrid",
            transmission: "cvt",
            horsepower: 225,
            torque: 176,
            fuelType: "hybrid",
            drivetrain: "FWD",
            fuelEconomy: { city: 51, highway: 53, combined: 52 },
            variants: [
              {
                id: "camry-xle-std",
                trimId: "camry-xle",
                name: "Standard",
                price: 34100,
                additionalFeatures: [
                  "9-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Toyota Safety Sense 3.0",
                  "Leather seats",
                  "Heated front seats",
                  "Power moonroof",
                  "Blind spot monitor",
                  "Rear cross traffic alert",
                  "Wireless charging pad",
                  "JBL premium audio"
                ],
                colorOptions: [pearlWhite, blackColor, silverColor, blueColor],
                availability: "in-stock"
              },
              {
                id: "camry-xle-prem",
                trimId: "camry-xle",
                name: "Premium",
                price: 36000,
                additionalFeatures: [
                  "12.3-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Toyota Safety Sense 3.0",
                  "Leather seats",
                  "Heated and ventilated front seats",
                  "Heated rear seats",
                  "Panoramic moonroof",
                  "Blind spot monitor",
                  "Rear cross traffic alert",
                  "Wireless charging pad",
                  "JBL premium audio",
                  "Head-up display",
                  "Digital rearview mirror",
                  "Parking sensors"
                ],
                colorOptions: [pearlWhite, blackColor, burgundyColor],
                availability: "in-transit"
              }
            ]
          }
        ]
      },
      {
        id: "toyota-rav4",
        brandId: "toyota",
        name: "RAV4",
        image: "https://placehold.co/600x400/e9ebf2/324575?text=Toyota+RAV4",
        year: 2026,
        bodyType: "suv",
        priceRange: { min: 32500, max: 42000, currency: "USD" },
        description: "The Toyota RAV4 is a compact SUV offering hybrid and plug-in hybrid powertrains with capable all-weather performance.",
        trims: [
          {
            id: "rav4-le",
            modelId: "toyota-rav4",
            name: "LE",
            basePrice: 32500,
            engine: "2.5L 4-Cylinder Hybrid",
            transmission: "cvt",
            horsepower: 219,
            torque: 163,
            fuelType: "hybrid",
            drivetrain: "AWD",
            fuelEconomy: { city: 41, highway: 38, combined: 40 },
            variants: [
              {
                id: "rav4-le-std",
                trimId: "rav4-le",
                name: "Standard",
                price: 32500,
                additionalFeatures: [
                  "8-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Toyota Safety Sense 3.0",
                  "Adaptive cruise control",
                  "LED headlights",
                  "Dual-zone climate control",
                  "Roof rails"
                ],
                colorOptions: [whiteColor, blackColor, silverColor],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "rav4-xle-prem",
            modelId: "toyota-rav4",
            name: "XLE Premium",
            basePrice: 36200,
            engine: "2.5L 4-Cylinder Hybrid",
            transmission: "cvt",
            horsepower: 219,
            torque: 163,
            fuelType: "hybrid",
            drivetrain: "AWD",
            fuelEconomy: { city: 41, highway: 38, combined: 40 },
            variants: [
              {
                id: "rav4-xle-prem-std",
                trimId: "rav4-xle-prem",
                name: "Standard",
                price: 36200,
                additionalFeatures: [
                  "8-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Toyota Safety Sense 3.0",
                  "SofTex leather seats",
                  "Power liftgate",
                  "Sunroof",
                  "Blind spot monitor",
                  "Rear cross traffic alert",
                  "Heated front seats"
                ],
                colorOptions: [whiteColor, blackColor, blueColor, redColor],
                availability: "in-stock"
              },
              {
                id: "rav4-xle-prem-wtr",
                trimId: "rav4-xle-prem",
                name: "Weather Package",
                price: 37500,
                additionalFeatures: [
                  "8-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Toyota Safety Sense 3.0",
                  "SofTex leather seats",
                  "Power liftgate",
                  "Sunroof",
                  "Blind spot monitor",
                  "Rear cross traffic alert",
                  "Heated front seats",
                  "Heated steering wheel",
                  "Rain-sensing wipers",
                  "De-icer windshield"
                ],
                colorOptions: [whiteColor, blackColor, silverColor],
                availability: "in-transit"
              }
            ]
          },
          {
            id: "rav4-se",
            modelId: "toyota-rav4",
            name: "SE",
            basePrice: 38400,
            engine: "2.5L 4-Cylinder Plug-in Hybrid",
            transmission: "cvt",
            horsepower: 302,
            torque: 199,
            fuelType: "plug-in-hybrid",
            drivetrain: "AWD",
            fuelEconomy: { city: 94, highway: 84, combined: 38 },
            variants: [
              {
                id: "rav4-se-std",
                trimId: "rav4-se",
                name: "Standard",
                price: 38400,
                additionalFeatures: [
                  "9-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Toyota Safety Sense 3.0",
                  "Plug-in hybrid with 42-mile EV range",
                  "Heated front seats",
                  "Power liftgate",
                  "LED fog lights",
                  "18-inch alloy wheels",
                  "Wireless charging pad"
                ],
                colorOptions: [whiteColor, blackColor, redColor, greenColor],
                availability: "in-stock"
              },
              {
                id: "rav4-se-prem",
                trimId: "rav4-se",
                name: "Premium",
                price: 42000,
                additionalFeatures: [
                  "9-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Toyota Safety Sense 3.0",
                  "Plug-in hybrid with 42-mile EV range",
                  "Leather seats",
                  "Heated and ventilated front seats",
                  "Power liftgate",
                  "Panoramic sunroof",
                  "JBL premium audio",
                  "Head-up display",
                  "Digital rearview mirror",
                  "Parking sensors",
                  "19-inch alloy wheels"
                ],
                colorOptions: [pearlWhite, blackColor, darkBlue],
                availability: "build-to-order"
              }
            ]
          }
        ]
      },
      {
        id: "toyota-corolla",
        brandId: "toyota",
        name: "Corolla",
        image: "https://placehold.co/600x400/e9ebf2/324575?text=Toyota+Corolla",
        year: 2026,
        bodyType: "sedan",
        priceRange: { min: 23500, max: 27000, currency: "USD" },
        description: "The Toyota Corolla is a compact sedan delivering dependable performance, excellent fuel economy, and comprehensive safety features.",
        trims: [
          {
            id: "corolla-le",
            modelId: "toyota-corolla",
            name: "LE",
            basePrice: 23500,
            engine: "2.0L 4-Cylinder",
            transmission: "cvt",
            horsepower: 169,
            torque: 151,
            fuelType: "gasoline",
            drivetrain: "FWD",
            fuelEconomy: { city: 32, highway: 41, combined: 35 },
            variants: [
              {
                id: "corolla-le-std",
                trimId: "corolla-le",
                name: "Standard",
                price: 23500,
                additionalFeatures: [
                  "7-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Toyota Safety Sense 3.0",
                  "Adaptive cruise control",
                  "LED headlights",
                  "Automatic climate control"
                ],
                colorOptions: [whiteColor, blackColor, silverColor],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "corolla-se",
            modelId: "toyota-corolla",
            name: "SE",
            basePrice: 25500,
            engine: "2.0L 4-Cylinder",
            transmission: "cvt",
            horsepower: 169,
            torque: 151,
            fuelType: "gasoline",
            drivetrain: "FWD",
            fuelEconomy: { city: 31, highway: 40, combined: 34 },
            variants: [
              {
                id: "corolla-se-std",
                trimId: "corolla-se",
                name: "Standard",
                price: 25500,
                additionalFeatures: [
                  "8-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Toyota Safety Sense 3.0",
                  "Sport-tuned suspension",
                  "18-inch alloy wheels",
                  "Dual-zone climate control",
                  "LED headlights",
                  "Blind spot monitor"
                ],
                colorOptions: [whiteColor, blackColor, redColor, blueColor],
                availability: "in-stock"
              },
              {
                id: "corolla-se-prem",
                trimId: "corolla-se",
                name: "Premium",
                price: 27000,
                additionalFeatures: [
                  "8-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Toyota Safety Sense 3.0",
                  "Sport-tuned suspension",
                  "18-inch alloy wheels",
                  "Dual-zone climate control",
                  "LED headlights",
                  "Blind spot monitor",
                  "Sunroof",
                  "Wireless charging pad",
                  "Upgraded audio system"
                ],
                colorOptions: [pearlWhite, blackColor, redColor],
                availability: "in-transit"
              }
            ]
          }
        ]
      }
    ]
  },

  // ─── BMW ──────────────────────────────────────────────────
  {
    id: "bmw",
    name: "BMW",
    logo: "https://placehold.co/200x200/e9ebf2/324575?text=BMW",
    description: "Bayerische Motoren Werke AG is a German luxury automaker known for performance-oriented vehicles and cutting-edge technology.",
    country: "Germany",
    foundedYear: 1916,
    models: [
      {
        id: "bmw-3series",
        brandId: "bmw",
        name: "3 Series",
        image: "https://placehold.co/600x400/e9ebf2/324575?text=BMW+3+Series",
        year: 2026,
        bodyType: "sedan",
        priceRange: { min: 44900, max: 62000, currency: "USD" },
        description: "The BMW 3 Series is the quintessential sport sedan, blending dynamic driving with luxury and advanced technology.",
        trims: [
          {
            id: "3series-330i",
            modelId: "bmw-3series",
            name: "330i",
            basePrice: 44900,
            engine: "2.0L TwinPower Turbo 4-Cylinder",
            transmission: "automatic",
            horsepower: 255,
            torque: 295,
            fuelType: "gasoline",
            drivetrain: "RWD",
            fuelEconomy: { city: 26, highway: 36, combined: 30 },
            variants: [
              {
                id: "330i-premium",
                trimId: "3series-330i",
                name: "Premium",
                price: 47500,
                additionalFeatures: [
                  "12.3-inch digital instrument cluster",
                  "14.9-inch infotainment display",
                  "Vernasca leather upholstery",
                  "Heated front seats",
                  "Power tailgate",
                  "Ambient lighting",
                  "Harman Kardon surround sound",
                  "Parking assistant"
                ],
                colorOptions: [
                  { name: "Alpine White", hex: "#F2F2F0", type: "solid", upcharge: 0 },
                  { name: "Black Sapphire", hex: "#0A0A0A", type: "metallic", upcharge: 625 },
                  { name: "Portimao Blue", hex: "#1E3A5F", type: "metallic", upcharge: 625 }
                ],
                availability: "in-stock"
              },
              {
                id: "330i-exec",
                trimId: "3series-330i",
                name: "Executive",
                price: 50900,
                additionalFeatures: [
                  "12.3-inch digital instrument cluster",
                  "14.9-inch infotainment display",
                  "Vernasca leather upholstery",
                  "Heated front seats",
                  "Heated steering wheel",
                  "Power tailgate",
                  "Ambient lighting",
                  "Harman Kardon surround sound",
                  "Parking assistant plus",
                  "Head-up display",
                  "Gesture control",
                  "Comfort access",
                  "Soft-close doors"
                ],
                colorOptions: [
                  { name: "Alpine White", hex: "#F2F2F0", type: "solid", upcharge: 0 },
                  { name: "Black Sapphire", hex: "#0A0A0A", type: "metallic", upcharge: 625 },
                  { name: "Tanzanite Blue", hex: "#1A1B4B", type: "metallic", upcharge: 625 }
                ],
                availability: "in-transit"
              }
            ]
          },
          {
            id: "3series-330i-xdrive",
            modelId: "bmw-3series",
            name: "330i xDrive",
            basePrice: 46900,
            engine: "2.0L TwinPower Turbo 4-Cylinder",
            transmission: "automatic",
            horsepower: 255,
            torque: 295,
            fuelType: "gasoline",
            drivetrain: "AWD",
            fuelEconomy: { city: 25, highway: 34, combined: 29 },
            variants: [
              {
                id: "330i-xdrive-premium",
                trimId: "3series-330i-xdrive",
                name: "Premium",
                price: 49500,
                additionalFeatures: [
                  "12.3-inch digital instrument cluster",
                  "14.9-inch infotainment display",
                  "Vernasca leather upholstery",
                  "Heated front seats",
                  "Power tailgate",
                  "Ambient lighting",
                  "Harman Kardon surround sound",
                  "xDrive all-wheel drive",
                  "Parking assistant"
                ],
                colorOptions: [
                  { name: "Alpine White", hex: "#F2F2F0", type: "solid", upcharge: 0 },
                  { name: "Mineral White", hex: "#E8E6DF", type: "metallic", upcharge: 625 },
                  { name: "M Brooklyn Grey", hex: "#6B6E6F", type: "metallic", upcharge: 625 }
                ],
                availability: "in-stock"
              },
              {
                id: "330i-xdrive-exec",
                trimId: "3series-330i-xdrive",
                name: "Executive",
                price: 53400,
                additionalFeatures: [
                  "12.3-inch digital instrument cluster",
                  "14.9-inch infotainment display",
                  "Vernasca leather upholstery",
                  "Heated front seats",
                  "Heated steering wheel",
                  "Power tailgate",
                  "Ambient lighting",
                  "Harman Kardon surround sound",
                  "xDrive all-wheel drive",
                  "Parking assistant plus",
                  "Head-up display",
                  "Gesture control",
                  "Comfort access",
                  "Soft-close doors"
                ],
                colorOptions: [
                  { name: "Alpine White", hex: "#F2F2F0", type: "solid", upcharge: 0 },
                  { name: "Black Sapphire", hex: "#0A0A0A", type: "metallic", upcharge: 625 }
                ],
                availability: "in-transit"
              }
            ]
          },
          {
            id: "3series-m340i",
            modelId: "bmw-3series",
            name: "M340i xDrive",
            basePrice: 56900,
            engine: "3.0L TwinPower Turbo Inline-6",
            transmission: "automatic",
            horsepower: 382,
            torque: 369,
            fuelType: "gasoline",
            drivetrain: "AWD",
            fuelEconomy: { city: 22, highway: 31, combined: 26 },
            variants: [
              {
                id: "m340i-premium",
                trimId: "3series-m340i",
                name: "Premium",
                price: 59500,
                additionalFeatures: [
                  "12.3-inch digital instrument cluster",
                  "14.9-inch infotainment display",
                  "Vernasca leather upholstery",
                  "M Sport brakes",
                  "M Sport differential",
                  "Adaptive M suspension",
                  "Heated front seats",
                  "Harman Kardon surround sound",
                  "Head-up display",
                  "Parking assistant plus"
                ],
                colorOptions: [
                  { name: "Alpine White", hex: "#F2F2F0", type: "solid", upcharge: 0 },
                  { name: "Portimao Blue", hex: "#1E3A5F", type: "metallic", upcharge: 625 },
                  { name: "Isle of Man Green", hex: "#2D4A2B", type: "metallic", upcharge: 625 }
                ],
                availability: "in-stock"
              },
              {
                id: "m340i-exec",
                trimId: "3series-m340i",
                name: "Executive",
                price: 62000,
                additionalFeatures: [
                  "12.3-inch digital instrument cluster",
                  "14.9-inch infotainment display",
                  "Extended Merino leather",
                  "M Sport brakes",
                  "M Sport differential",
                  "Adaptive M suspension",
                  "Heated front seats",
                  "Heated steering wheel",
                  "Bowers & Wilkins Diamond surround sound",
                  "Head-up display",
                  "Parking assistant plus",
                  "Comfort access",
                  "Soft-close doors",
                  "Gesture control"
                ],
                colorOptions: [
                  { name: "Black Sapphire", hex: "#0A0A0A", type: "metallic", upcharge: 625 },
                  { name: "Dravit Grey", hex: "#4A4A4A", type: "metallic", upcharge: 625 }
                ],
                availability: "build-to-order"
              }
            ]
          }
        ]
      },
      {
        id: "bmw-x3",
        brandId: "bmw",
        name: "X3",
        image: "https://placehold.co/600x400/e9ebf2/324575?text=BMW+X3",
        year: 2026,
        bodyType: "suv",
        priceRange: { min: 49900, max: 68000, currency: "USD" },
        description: "The BMW X3 is a premium compact SUV that combines versatility with BMW's signature driving dynamics.",
        trims: [
          {
            id: "x3-30-xdrive",
            modelId: "bmw-x3",
            name: "30 xDrive",
            basePrice: 49900,
            engine: "2.0L TwinPower Turbo 4-Cylinder",
            transmission: "automatic",
            horsepower: 255,
            torque: 295,
            fuelType: "gasoline",
            drivetrain: "AWD",
            fuelEconomy: { city: 24, highway: 31, combined: 27 },
            variants: [
              {
                id: "x3-30-premium",
                trimId: "x3-30-xdrive",
                name: "Premium",
                price: 53400,
                additionalFeatures: [
                  "12.3-inch digital instrument cluster",
                  "14.9-inch infotainment display",
                  "Vernasca leather upholstery",
                  "Panoramic sunroof",
                  "Heated front seats",
                  "Power tailgate",
                  "Ambient lighting",
                  "Harman Kardon surround sound",
                  "Parking assistant"
                ],
                colorOptions: [
                  { name: "Alpine White", hex: "#F2F2F0", type: "solid", upcharge: 0 },
                  { name: "Black Sapphire", hex: "#0A0A0A", type: "metallic", upcharge: 625 },
                  { name: "Phytonic Blue", hex: "#1C3A5F", type: "metallic", upcharge: 625 }
                ],
                availability: "in-stock"
              },
              {
                id: "x3-30-exec",
                trimId: "x3-30-xdrive",
                name: "Executive",
                price: 57500,
                additionalFeatures: [
                  "12.3-inch digital instrument cluster",
                  "14.9-inch infotainment display",
                  "Vernasca leather upholstery",
                  "Panoramic sunroof",
                  "Heated front seats",
                  "Heated steering wheel",
                  "Power tailgate",
                  "Ambient lighting",
                  "Harman Kardon surround sound",
                  "Parking assistant plus",
                  "Head-up display",
                  "Comfort access",
                  "Soft-close doors"
                ],
                colorOptions: [
                  { name: "Alpine White", hex: "#F2F2F0", type: "solid", upcharge: 0 },
                  { name: "Skyscraper Grey", hex: "#5A5A5A", type: "metallic", upcharge: 625 }
                ],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "x3-m50-xdrive",
            modelId: "bmw-x3",
            name: "M50 xDrive",
            basePrice: 63500,
            engine: "3.0L TwinPower Turbo Inline-6",
            transmission: "automatic",
            horsepower: 393,
            torque: 428,
            fuelType: "gasoline",
            drivetrain: "AWD",
            fuelEconomy: { city: 20, highway: 27, combined: 23 },
            variants: [
              {
                id: "x3-m50-premium",
                trimId: "x3-m50-xdrive",
                name: "Premium",
                price: 66500,
                additionalFeatures: [
                  "12.3-inch digital instrument cluster",
                  "14.9-inch infotainment display",
                  "Extended Merino leather",
                  "M Sport brakes",
                  "Adaptive M suspension",
                  "Panoramic sunroof",
                  "Heated front seats",
                  "Head-up display",
                  "Bowers & Wilkins surround sound",
                  "M Sport exhaust"
                ],
                colorOptions: [
                  { name: "Alpine White", hex: "#F2F2F0", type: "solid", upcharge: 0 },
                  { name: "Toronto Red", hex: "#8B1A1A", type: "metallic", upcharge: 625 },
                  { name: "Frozen Pure Grey", hex: "#B0B0B0", type: "metallic", upcharge: 1250 }
                ],
                availability: "in-transit"
              },
              {
                id: "x3-m50-exec",
                trimId: "x3-m50-xdrive",
                name: "Executive",
                price: 68000,
                additionalFeatures: [
                  "12.3-inch digital instrument cluster",
                  "14.9-inch infotainment display",
                  "Extended Merino leather",
                  "M Sport brakes",
                  "Adaptive M suspension",
                  "Panoramic sunroof",
                  "Heated and ventilated front seats",
                  "Heated steering wheel",
                  "Head-up display",
                  "Bowers & Wilkins surround sound",
                  "M Sport exhaust",
                  "Parking assistant plus",
                  "Comfort access",
                  "Soft-close doors"
                ],
                colorOptions: [
                  { name: "Black Sapphire", hex: "#0A0A0A", type: "metallic", upcharge: 625 },
                  { name: "Frozen Pure Grey", hex: "#B0B0B0", type: "metallic", upcharge: 1250 }
                ],
                availability: "build-to-order"
              }
            ]
          }
        ]
      },
      {
        id: "bmw-i4",
        brandId: "bmw",
        name: "i4",
        image: "https://placehold.co/600x400/e9ebf2/324575?text=BMW+i4",
        year: 2026,
        bodyType: "sedan",
        priceRange: { min: 53500, max: 74000, currency: "USD" },
        description: "The BMW i4 is a fully electric Gran Coupe that delivers exhilarating performance with zero emissions.",
        trims: [
          {
            id: "i4-edrive35",
            modelId: "bmw-i4",
            name: "eDrive35",
            basePrice: 53500,
            engine: "Single Electric Motor",
            transmission: "automatic",
            horsepower: 281,
            torque: 295,
            fuelType: "electric",
            drivetrain: "RWD",
            fuelEconomy: { city: 120, highway: 100, combined: 110 },
            variants: [
              {
                id: "i4-edrive35-std",
                trimId: "i4-edrive35",
                name: "Standard",
                price: 53500,
                additionalFeatures: [
                  "12.3-inch digital instrument cluster",
                  "14.9-inch curved display",
                  "SensaTec upholstery",
                  "Heated front seats",
                  "282-mile range",
                  "150 kW DC fast charging",
                  "Parking assistant",
                  "LED headlights"
                ],
                colorOptions: [
                  { name: "Alpine White", hex: "#F2F2F0", type: "solid", upcharge: 0 },
                  { name: "Black Sapphire", hex: "#0A0A0A", type: "metallic", upcharge: 625 },
                  { name: "Mineral White", hex: "#E8E6DF", type: "metallic", upcharge: 625 }
                ],
                availability: "in-stock"
              },
              {
                id: "i4-edrive35-prem",
                trimId: "i4-edrive35",
                name: "Premium",
                price: 57800,
                additionalFeatures: [
                  "12.3-inch digital instrument cluster",
                  "14.9-inch curved display",
                  "Vernasca leather upholstery",
                  "Heated front seats",
                  "Heated steering wheel",
                  "282-mile range",
                  "150 kW DC fast charging",
                  "Parking assistant plus",
                  "Harman Kardon surround sound",
                  "Head-up display",
                  "Panoramic sunroof"
                ],
                colorOptions: [
                  { name: "Alpine White", hex: "#F2F2F0", type: "solid", upcharge: 0 },
                  { name: "Skyscraper Grey", hex: "#5A5A5A", type: "metallic", upcharge: 625 }
                ],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "i4-m50",
            modelId: "bmw-i4",
            name: "M50",
            basePrice: 69700,
            engine: "Dual Electric Motors",
            transmission: "automatic",
            horsepower: 536,
            torque: 586,
            fuelType: "electric",
            drivetrain: "AWD",
            fuelEconomy: { city: 105, highway: 92, combined: 99 },
            variants: [
              {
                id: "i4-m50-std",
                trimId: "i4-m50",
                name: "Standard",
                price: 69700,
                additionalFeatures: [
                  "12.3-inch digital instrument cluster",
                  "14.9-inch curved display",
                  "Vernasca leather upholstery",
                  "M Sport brakes",
                  "Adaptive M suspension",
                  "Heated front seats",
                  "270-mile range",
                  "200 kW DC fast charging",
                  "Harman Kardon surround sound",
                  "Head-up display"
                ],
                colorOptions: [
                  { name: "Alpine White", hex: "#F2F2F0", type: "solid", upcharge: 0 },
                  { name: "Portimao Blue", hex: "#1E3A5F", type: "metallic", upcharge: 625 },
                  { name: "Toronto Red", hex: "#8B1A1A", type: "metallic", upcharge: 625 }
                ],
                availability: "in-stock"
              },
              {
                id: "i4-m50-prem",
                trimId: "i4-m50",
                name: "Premium",
                price: 74000,
                additionalFeatures: [
                  "12.3-inch digital instrument cluster",
                  "14.9-inch curved display",
                  "Extended Merino leather",
                  "M Sport brakes",
                  "Adaptive M suspension",
                  "Heated and ventilated front seats",
                  "Heated steering wheel",
                  "270-mile range",
                  "200 kW DC fast charging",
                  "Bowers & Wilkins Diamond surround sound",
                  "Head-up display",
                  "Parking assistant plus",
                  "Comfort access",
                  "Soft-close doors",
                  "Gesture control"
                ],
                colorOptions: [
                  { name: "Frozen Portimao Blue", hex: "#1C3050", type: "metallic", upcharge: 1250 },
                  { name: "Black Sapphire", hex: "#0A0A0A", type: "metallic", upcharge: 625 }
                ],
                availability: "build-to-order"
              }
            ]
          }
        ]
      }
    ]
  },

  // ─── MERCEDES-BENZ ──────────────────────────────────────
  {
    id: "mercedes",
    name: "Mercedes-Benz",
    logo: "https://placehold.co/200x200/e9ebf2/324575?text=Mercedes",
    description: "Mercedes-Benz is a German luxury automotive brand known for innovation, safety, and sophisticated design.",
    country: "Germany",
    foundedYear: 1926,
    models: [
      {
        id: "mercedes-cclass",
        brandId: "mercedes",
        name: "C-Class",
        image: "https://placehold.co/600x400/e9ebf2/324575?text=Mercedes+C-Class",
        year: 2026,
        bodyType: "sedan",
        priceRange: { min: 46000, max: 62000, currency: "USD" },
        description: "The Mercedes-Benz C-Class is a luxury sedan offering refined comfort, advanced technology, and spirited performance.",
        trims: [
          {
            id: "cclass-c300",
            modelId: "mercedes-cclass",
            name: "C 300",
            basePrice: 46000,
            engine: "2.0L Turbo 4-Cylinder with EQ Boost",
            transmission: "automatic",
            horsepower: 255,
            torque: 295,
            fuelType: "gasoline",
            drivetrain: "RWD",
            fuelEconomy: { city: 25, highway: 35, combined: 29 },
            variants: [
              {
                id: "c300-exclusive",
                trimId: "cclass-c300",
                name: "Exclusive",
                price: 48500,
                additionalFeatures: [
                  "11.9-inch OLED central display",
                  "12.3-inch digital instrument cluster",
                  "MB-Tex upholstery",
                  "Heated front seats",
                  "64-color ambient lighting",
                  "Burmester surround sound",
                  "Wireless Apple CarPlay",
                  "Wireless Android Auto",
                  "Active parking assist"
                ],
                colorOptions: [
                  { name: "Polar White", hex: "#F5F5F5", type: "solid", upcharge: 0 },
                  { name: "Obsidian Black", hex: "#0D0D0D", type: "metallic", upcharge: 720 },
                  { name: "Nautic Blue", hex: "#1B3A5C", type: "metallic", upcharge: 720 }
                ],
                availability: "in-stock"
              },
              {
                id: "c300-pinnacle",
                trimId: "cclass-c300",
                name: "Pinnacle",
                price: 52000,
                additionalFeatures: [
                  "11.9-inch OLED central display",
                  "12.3-inch digital instrument cluster",
                  "Nappa leather upholstery",
                  "Heated and ventilated front seats",
                  "Head-up display",
                  "64-color ambient lighting",
                  "Burmester 3D surround sound",
                  "Wireless Apple CarPlay",
                  "Wireless Android Auto",
                  "Active parking assist",
                  "Panoramic sunroof",
                  "Air suspension",
                  "Soft-close doors"
                ],
                colorOptions: [
                  { name: "Polar White", hex: "#F5F5F5", type: "solid", upcharge: 0 },
                  { name: "Obsidian Black", hex: "#0D0D0D", type: "metallic", upcharge: 720 },
                  { name: "Selenite Grey", hex: "#7A7A7A", type: "metallic", upcharge: 720 }
                ],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "cclass-c300-4matic",
            modelId: "mercedes-cclass",
            name: "C 300 4MATIC",
            basePrice: 48500,
            engine: "2.0L Turbo 4-Cylinder with EQ Boost",
            transmission: "automatic",
            horsepower: 255,
            torque: 295,
            fuelType: "gasoline",
            drivetrain: "AWD",
            fuelEconomy: { city: 24, highway: 33, combined: 28 },
            variants: [
              {
                id: "c300-4matic-exclusive",
                trimId: "cclass-c300-4matic",
                name: "Exclusive",
                price: 51000,
                additionalFeatures: [
                  "11.9-inch OLED central display",
                  "12.3-inch digital instrument cluster",
                  "MB-Tex upholstery",
                  "Heated front seats",
                  "64-color ambient lighting",
                  "Burmester surround sound",
                  "4MATIC all-wheel drive",
                  "Active parking assist"
                ],
                colorOptions: [
                  { name: "Polar White", hex: "#F5F5F5", type: "solid", upcharge: 0 },
                  { name: "Obsidian Black", hex: "#0D0D0D", type: "metallic", upcharge: 720 },
                  { name: "Spectral Blue", hex: "#1A3355", type: "metallic", upcharge: 720 }
                ],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "cclass-amg-c43",
            modelId: "mercedes-cclass",
            name: "AMG C 43",
            basePrice: 58000,
            engine: "2.0L AMG-Enhanced Turbo 4-Cylinder with EQ Boost",
            transmission: "automatic",
            horsepower: 402,
            torque: 369,
            fuelType: "gasoline",
            drivetrain: "AWD",
            fuelEconomy: { city: 21, highway: 30, combined: 25 },
            variants: [
              {
                id: "amg-c43-std",
                trimId: "cclass-amg-c43",
                name: "Standard",
                price: 58000,
                additionalFeatures: [
                  "11.9-inch OLED central display",
                  "12.3-inch digital instrument cluster",
                  "AMG sport seats with MB-Tex/microfiber",
                  "AMG Performance exhaust",
                  "AMG RIDE CONTROL suspension",
                  "AMG-specific steering wheel",
                  "Burmester surround sound",
                  "Head-up display",
                  "AMG Track Pace app"
                ],
                colorOptions: [
                  { name: "Polar White", hex: "#F5F5F5", type: "solid", upcharge: 0 },
                  { name: "Obsidian Black", hex: "#0D0D0D", type: "metallic", upcharge: 720 },
                  { name: "Manufaktur Patagonia Red", hex: "#8B2500", type: "metallic", upcharge: 1950 }
                ],
                availability: "in-transit"
              },
              {
                id: "amg-c43-prem",
                trimId: "cclass-amg-c43",
                name: "Premium",
                price: 62000,
                additionalFeatures: [
                  "11.9-inch OLED central display",
                  "12.3-inch digital instrument cluster",
                  "AMG sport seats with Nappa leather",
                  "AMG Performance exhaust",
                  "AMG RIDE CONTROL+ suspension",
                  "AMG-specific steering wheel",
                  "Burmester 3D surround sound",
                  "Head-up display",
                  "AMG Track Pace app",
                  "Panoramic sunroof",
                  "Active parking assist",
                  "Soft-close doors",
                  "AMG carbon fiber trim"
                ],
                colorOptions: [
                  { name: "Obsidian Black", hex: "#0D0D0D", type: "metallic", upcharge: 720 },
                  { name: "Manufaktur Patagonia Red", hex: "#8B2500", type: "metallic", upcharge: 1950 }
                ],
                availability: "build-to-order"
              }
            ]
          }
        ]
      },
      {
        id: "mercedes-glc",
        brandId: "mercedes",
        name: "GLC",
        image: "https://placehold.co/600x400/e9ebf2/324575?text=Mercedes+GLC",
        year: 2026,
        bodyType: "suv",
        priceRange: { min: 48500, max: 66000, currency: "USD" },
        description: "The Mercedes-Benz GLC is a luxury compact SUV offering a perfect blend of comfort, technology, and versatility.",
        trims: [
          {
            id: "glc-300",
            modelId: "mercedes-glc",
            name: "GLC 300",
            basePrice: 48500,
            engine: "2.0L Turbo 4-Cylinder with EQ Boost",
            transmission: "automatic",
            horsepower: 258,
            torque: 295,
            fuelType: "gasoline",
            drivetrain: "RWD",
            fuelEconomy: { city: 24, highway: 31, combined: 27 },
            variants: [
              {
                id: "glc300-exclusive",
                trimId: "glc-300",
                name: "Exclusive",
                price: 51000,
                additionalFeatures: [
                  "11.9-inch OLED central display",
                  "12.3-inch digital instrument cluster",
                  "MB-Tex upholstery",
                  "Heated front seats",
                  "64-color ambient lighting",
                  "Burmester surround sound",
                  "Power liftgate",
                  "Active parking assist"
                ],
                colorOptions: [
                  { name: "Polar White", hex: "#F5F5F5", type: "solid", upcharge: 0 },
                  { name: "Obsidian Black", hex: "#0D0D0D", type: "metallic", upcharge: 720 },
                  { name: "Selenite Grey", hex: "#7A7A7A", type: "metallic", upcharge: 720 }
                ],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "glc-300-4matic",
            modelId: "mercedes-glc",
            name: "GLC 300 4MATIC",
            basePrice: 50500,
            engine: "2.0L Turbo 4-Cylinder with EQ Boost",
            transmission: "automatic",
            horsepower: 258,
            torque: 295,
            fuelType: "gasoline",
            drivetrain: "AWD",
            fuelEconomy: { city: 23, highway: 30, combined: 26 },
            variants: [
              {
                id: "glc300-4matic-exclusive",
                trimId: "glc-300-4matic",
                name: "Exclusive",
                price: 53500,
                additionalFeatures: [
                  "11.9-inch OLED central display",
                  "12.3-inch digital instrument cluster",
                  "MB-Tex upholstery",
                  "Heated front seats",
                  "64-color ambient lighting",
                  "Burmester surround sound",
                  "4MATIC all-wheel drive",
                  "Power liftgate",
                  "Active parking assist"
                ],
                colorOptions: [
                  { name: "Polar White", hex: "#F5F5F5", type: "solid", upcharge: 0 },
                  { name: "Obsidian Black", hex: "#0D0D0D", type: "metallic", upcharge: 720 },
                  { name: "Nautic Blue", hex: "#1B3A5C", type: "metallic", upcharge: 720 }
                ],
                availability: "in-stock"
              },
              {
                id: "glc300-4matic-pinnacle",
                trimId: "glc-300-4matic",
                name: "Pinnacle",
                price: 57000,
                additionalFeatures: [
                  "11.9-inch OLED central display",
                  "12.3-inch digital instrument cluster",
                  "Nappa leather upholstery",
                  "Heated and ventilated front seats",
                  "Head-up display",
                  "64-color ambient lighting",
                  "Burmester 3D surround sound",
                  "4MATIC all-wheel drive",
                  "Power liftgate",
                  "Active parking assist",
                  "Panoramic sunroof",
                  "Air suspension",
                  "Soft-close doors"
                ],
                colorOptions: [
                  { name: "Polar White", hex: "#F5F5F5", type: "solid", upcharge: 0 },
                  { name: "Obsidian Black", hex: "#0D0D0D", type: "metallic", upcharge: 720 }
                ],
                availability: "in-transit"
              }
            ]
          },
          {
            id: "glc-amg43",
            modelId: "mercedes-glc",
            name: "AMG GLC 43",
            basePrice: 62000,
            engine: "2.0L AMG-Enhanced Turbo 4-Cylinder with EQ Boost",
            transmission: "automatic",
            horsepower: 416,
            torque: 369,
            fuelType: "gasoline",
            drivetrain: "AWD",
            fuelEconomy: { city: 19, highway: 26, combined: 22 },
            variants: [
              {
                id: "glc-amg43-std",
                trimId: "glc-amg43",
                name: "Standard",
                price: 62000,
                additionalFeatures: [
                  "11.9-inch OLED central display",
                  "12.3-inch digital instrument cluster",
                  "AMG sport seats with MB-Tex/microfiber",
                  "AMG Performance exhaust",
                  "AMG RIDE CONTROL suspension",
                  "Burmester surround sound",
                  "Head-up display",
                  "Power liftgate",
                  "AMG Track Pace app"
                ],
                colorOptions: [
                  { name: "Polar White", hex: "#F5F5F5", type: "solid", upcharge: 0 },
                  { name: "Obsidian Black", hex: "#0D0D0D", type: "metallic", upcharge: 720 },
                  { name: "Manufaktur Hyacinth Red", hex: "#990033", type: "metallic", upcharge: 1950 }
                ],
                availability: "in-stock"
              },
              {
                id: "glc-amg43-prem",
                trimId: "glc-amg43",
                name: "Premium",
                price: 66000,
                additionalFeatures: [
                  "11.9-inch OLED central display",
                  "12.3-inch digital instrument cluster",
                  "AMG sport seats with Nappa leather",
                  "AMG Performance exhaust",
                  "AMG RIDE CONTROL+ suspension",
                  "Burmester 3D surround sound",
                  "Head-up display",
                  "Power liftgate",
                  "AMG Track Pace app",
                  "Panoramic sunroof",
                  "Active parking assist",
                  "Soft-close doors",
                  "AMG Night Package"
                ],
                colorOptions: [
                  { name: "Obsidian Black", hex: "#0D0D0D", type: "metallic", upcharge: 720 },
                  { name: "Selenite Grey", hex: "#7A7A7A", type: "metallic", upcharge: 720 }
                ],
                availability: "build-to-order"
              }
            ]
          }
        ]
      },
      {
        id: "mercedes-eqe",
        brandId: "mercedes",
        name: "EQE",
        image: "https://placehold.co/600x400/e9ebf2/324575?text=Mercedes+EQE",
        year: 2026,
        bodyType: "sedan",
        priceRange: { min: 56000, max: 76000, currency: "USD" },
        description: "The Mercedes-Benz EQE is a fully electric luxury sedan offering exceptional range, comfort, and Mercedes-Benz refinement.",
        trims: [
          {
            id: "eqe-350plus",
            modelId: "mercedes-eqe",
            name: "EQE 350+",
            basePrice: 56000,
            engine: "Single Electric Motor",
            transmission: "automatic",
            horsepower: 288,
            torque: 391,
            fuelType: "electric",
            drivetrain: "RWD",
            fuelEconomy: { city: 115, highway: 98, combined: 107 },
            variants: [
              {
                id: "eqe350-exclusive",
                trimId: "eqe-350plus",
                name: "Exclusive",
                price: 58500,
                additionalFeatures: [
                  "12.8-inch OLED central display",
                  "12.3-inch digital instrument cluster",
                  "MB-Tex upholstery",
                  "Heated front seats",
                  "64-color ambient lighting",
                  "Burmester surround sound",
                  "305-mile range",
                  "170 kW DC fast charging",
                  "Active parking assist"
                ],
                colorOptions: [
                  { name: "Polar White", hex: "#F5F5F5", type: "solid", upcharge: 0 },
                  { name: "Obsidian Black", hex: "#0D0D0D", type: "metallic", upcharge: 720 },
                  { name: "Sodalite Blue", hex: "#1A2D5A", type: "metallic", upcharge: 720 }
                ],
                availability: "in-stock"
              },
              {
                id: "eqe350-pinnacle",
                trimId: "eqe-350plus",
                name: "Pinnacle",
                price: 64000,
                additionalFeatures: [
                  "Hyperscreen (56-inch curved display)",
                  "12.3-inch digital instrument cluster",
                  "Nappa leather upholstery",
                  "Heated and ventilated front seats",
                  "Head-up display",
                  "64-color ambient lighting",
                  "Burmester 3D surround sound",
                  "305-mile range",
                  "170 kW DC fast charging",
                  "Active parking assist",
                  "Panoramic sunroof",
                  "Air suspension",
                  "Soft-close doors",
                  "Rear-axle steering"
                ],
                colorOptions: [
                  { name: "Polar White", hex: "#F5F5F5", type: "solid", upcharge: 0 },
                  { name: "Obsidian Black", hex: "#0D0D0D", type: "metallic", upcharge: 720 }
                ],
                availability: "in-transit"
              }
            ]
          },
          {
            id: "eqe-500-4matic",
            modelId: "mercedes-eqe",
            name: "EQE 500 4MATIC",
            basePrice: 72000,
            engine: "Dual Electric Motors",
            transmission: "automatic",
            horsepower: 402,
            torque: 564,
            fuelType: "electric",
            drivetrain: "AWD",
            fuelEconomy: { city: 100, highway: 88, combined: 94 },
            variants: [
              {
                id: "eqe500-exclusive",
                trimId: "eqe-500-4matic",
                name: "Exclusive",
                price: 72000,
                additionalFeatures: [
                  "12.8-inch OLED central display",
                  "12.3-inch digital instrument cluster",
                  "MB-Tex upholstery",
                  "Heated front seats",
                  "64-color ambient lighting",
                  "Burmester surround sound",
                  "285-mile range",
                  "170 kW DC fast charging",
                  "4MATIC all-wheel drive",
                  "Active parking assist"
                ],
                colorOptions: [
                  { name: "Polar White", hex: "#F5F5F5", type: "solid", upcharge: 0 },
                  { name: "Obsidian Black", hex: "#0D0D0D", type: "metallic", upcharge: 720 },
                  { name: "Graphite Grey", hex: "#4A4A4A", type: "metallic", upcharge: 720 }
                ],
                availability: "in-stock"
              },
              {
                id: "eqe500-pinnacle",
                trimId: "eqe-500-4matic",
                name: "Pinnacle",
                price: 76000,
                additionalFeatures: [
                  "Hyperscreen (56-inch curved display)",
                  "12.3-inch digital instrument cluster",
                  "Nappa leather upholstery",
                  "Heated and ventilated front seats",
                  "Heated rear seats",
                  "Head-up display",
                  "64-color ambient lighting",
                  "Burmester 3D surround sound",
                  "285-mile range",
                  "170 kW DC fast charging",
                  "4MATIC all-wheel drive",
                  "Active parking assist",
                  "Panoramic sunroof",
                  "Air suspension",
                  "Soft-close doors",
                  "Rear-axle steering"
                ],
                colorOptions: [
                  { name: "Obsidian Black", hex: "#0D0D0D", type: "metallic", upcharge: 720 },
                  { name: "Manufaktur Vintage Blue", hex: "#2B4B6F", type: "metallic", upcharge: 1950 }
                ],
                availability: "build-to-order"
              }
            ]
          }
        ]
      }
    ]
  },

  // ─── HONDA ──────────────────────────────────────────────
  {
    id: "honda",
    name: "Honda",
    logo: "https://placehold.co/200x200/e9ebf2/324575?text=Honda",
    description: "Honda Motor Co. is a Japanese manufacturer known for engineering excellence, reliability, and fuel-efficient vehicles.",
    country: "Japan",
    foundedYear: 1948,
    models: [
      {
        id: "honda-civic",
        brandId: "honda",
        name: "Civic",
        image: "https://placehold.co/600x400/e9ebf2/324575?text=Honda+Civic",
        year: 2026,
        bodyType: "sedan",
        priceRange: { min: 24500, max: 33000, currency: "USD" },
        description: "The Honda Civic is a compact sedan known for its engaging driving dynamics, spacious interior, and excellent fuel efficiency.",
        trims: [
          {
            id: "civic-lx",
            modelId: "honda-civic",
            name: "LX",
            basePrice: 24500,
            engine: "2.0L 4-Cylinder",
            transmission: "cvt",
            horsepower: 158,
            torque: 138,
            fuelType: "gasoline",
            drivetrain: "FWD",
            fuelEconomy: { city: 31, highway: 40, combined: 35 },
            variants: [
              {
                id: "civic-lx-std",
                trimId: "civic-lx",
                name: "Standard",
                price: 24500,
                additionalFeatures: [
                  "7-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Honda Sensing suite",
                  "Adaptive cruise control",
                  "Lane keeping assist",
                  "Collision mitigation braking",
                  "Automatic climate control"
                ],
                colorOptions: [whiteColor, blackColor, silverColor],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "civic-sport",
            modelId: "honda-civic",
            name: "Sport",
            basePrice: 27000,
            engine: "1.5L Turbo 4-Cylinder",
            transmission: "cvt",
            horsepower: 180,
            torque: 177,
            fuelType: "gasoline",
            drivetrain: "FWD",
            fuelEconomy: { city: 30, highway: 37, combined: 33 },
            variants: [
              {
                id: "civic-sport-std",
                trimId: "civic-sport",
                name: "Standard",
                price: 27000,
                additionalFeatures: [
                  "9-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Honda Sensing suite",
                  "Sport pedals",
                  "18-inch alloy wheels",
                  "LED headlights",
                  "Dual-zone climate control",
                  "Rear decklid spoiler"
                ],
                colorOptions: [whiteColor, blackColor, redColor, blueColor],
                availability: "in-stock"
              },
              {
                id: "civic-sport-hpt",
                trimId: "civic-sport",
                name: "HPT",
                price: 29500,
                additionalFeatures: [
                  "9-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Honda Sensing suite",
                  "Sport pedals",
                  "18-inch alloy wheels",
                  "LED headlights",
                  "Dual-zone climate control",
                  "Rear decklid spoiler",
                  "Leather-wrapped steering wheel",
                  "Blind spot information",
                  "Wireless charging pad",
                  "Bose premium audio"
                ],
                colorOptions: [whiteColor, blackColor, redColor],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "civic-touring",
            modelId: "honda-civic",
            name: "Touring",
            basePrice: 31000,
            engine: "1.5L Turbo 4-Cylinder",
            transmission: "cvt",
            horsepower: 180,
            torque: 177,
            fuelType: "gasoline",
            drivetrain: "FWD",
            fuelEconomy: { city: 30, highway: 37, combined: 33 },
            variants: [
              {
                id: "civic-touring-std",
                trimId: "civic-touring",
                name: "Standard",
                price: 31000,
                additionalFeatures: [
                  "9-inch touchscreen with wireless Apple CarPlay",
                  "10.2-inch digital instrument cluster",
                  "Honda Sensing suite",
                  "Leather seats",
                  "Heated front seats",
                  "Power sunroof",
                  "Bose premium audio",
                  "Wireless charging pad",
                  "Blind spot information",
                  "Rear cross traffic alert",
                  "Parking sensors",
                  "Rain-sensing wipers"
                ],
                colorOptions: [pearlWhite, blackColor, blueColor],
                availability: "in-stock"
              },
              {
                id: "civic-touring-nav",
                trimId: "civic-touring",
                name: "Navigation",
                price: 33000,
                additionalFeatures: [
                  "9-inch touchscreen with wireless Apple CarPlay",
                  "10.2-inch digital instrument cluster",
                  "Honda Sensing suite",
                  "Leather seats",
                  "Heated front seats",
                  "Power sunroof",
                  "Bose premium audio",
                  "Wireless charging pad",
                  "Blind spot information",
                  "Rear cross traffic alert",
                  "Parking sensors",
                  "Rain-sensing wipers",
                  "Built-in navigation",
                  "Head-up display"
                ],
                colorOptions: [pearlWhite, blackColor],
                availability: "in-transit"
              }
            ]
          }
        ]
      },
      {
        id: "honda-crv",
        brandId: "honda",
        name: "CR-V",
        image: "https://placehold.co/600x400/e9ebf2/324575?text=Honda+CR-V",
        year: 2026,
        bodyType: "suv",
        priceRange: { min: 33500, max: 41000, currency: "USD" },
        description: "The Honda CR-V is a compact SUV that offers a spacious cabin, hybrid efficiency, and Honda's renowned reliability.",
        trims: [
          {
            id: "crv-ex",
            modelId: "honda-crv",
            name: "EX",
            basePrice: 33500,
            engine: "2.0L 4-Cylinder Hybrid",
            transmission: "cvt",
            horsepower: 204,
            torque: 247,
            fuelType: "hybrid",
            drivetrain: "AWD",
            fuelEconomy: { city: 43, highway: 36, combined: 40 },
            variants: [
              {
                id: "crv-ex-std",
                trimId: "crv-ex",
                name: "Standard",
                price: 33500,
                additionalFeatures: [
                  "7-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Honda Sensing suite",
                  "Heated front seats",
                  "Power tailgate",
                  "Dual-zone climate control",
                  "Remote start",
                  "17-inch alloy wheels"
                ],
                colorOptions: [whiteColor, blackColor, silverColor],
                availability: "in-stock"
              },
              {
                id: "crv-ex-tech",
                trimId: "crv-ex",
                name: "Technology",
                price: 36000,
                additionalFeatures: [
                  "9-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Honda Sensing suite",
                  "Heated front seats",
                  "Power tailgate",
                  "Dual-zone climate control",
                  "Remote start",
                  "18-inch alloy wheels",
                  "Blind spot information",
                  "Rear cross traffic alert",
                  "Wireless charging pad",
                  "Bose premium audio"
                ],
                colorOptions: [whiteColor, blackColor, blueColor, grayColor],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "crv-sport-touring",
            modelId: "honda-crv",
            name: "Sport Touring",
            basePrice: 38500,
            engine: "2.0L 4-Cylinder Hybrid",
            transmission: "cvt",
            horsepower: 204,
            torque: 247,
            fuelType: "hybrid",
            drivetrain: "AWD",
            fuelEconomy: { city: 40, highway: 34, combined: 37 },
            variants: [
              {
                id: "crv-sport-touring-std",
                trimId: "crv-sport-touring",
                name: "Standard",
                price: 38500,
                additionalFeatures: [
                  "9-inch touchscreen with wireless Apple CarPlay",
                  "10.2-inch digital instrument cluster",
                  "Honda Sensing suite",
                  "Leather seats",
                  "Heated and ventilated front seats",
                  "Heated rear seats",
                  "Hands-free power tailgate",
                  "Panoramic sunroof",
                  "Bose premium audio",
                  "Wireless charging pad",
                  "Parking sensors",
                  "19-inch alloy wheels"
                ],
                colorOptions: [pearlWhite, blackColor, redColor],
                availability: "in-stock"
              },
              {
                id: "crv-sport-touring-prem",
                trimId: "crv-sport-touring",
                name: "Premium",
                price: 41000,
                additionalFeatures: [
                  "9-inch touchscreen with wireless Apple CarPlay",
                  "10.2-inch digital instrument cluster",
                  "Honda Sensing suite",
                  "Leather seats",
                  "Heated and ventilated front seats",
                  "Heated rear seats",
                  "Heated steering wheel",
                  "Hands-free power tailgate",
                  "Panoramic sunroof",
                  "Bose premium audio",
                  "Wireless charging pad",
                  "Parking sensors",
                  "19-inch alloy wheels",
                  "Head-up display",
                  "Rain-sensing wipers"
                ],
                colorOptions: [pearlWhite, blackColor],
                availability: "in-transit"
              }
            ]
          }
        ]
      },
      {
        id: "honda-accord",
        brandId: "honda",
        name: "Accord",
        image: "https://placehold.co/600x400/e9ebf2/324575?text=Honda+Accord",
        year: 2026,
        bodyType: "sedan",
        priceRange: { min: 29500, max: 40000, currency: "USD" },
        description: "The Honda Accord is a midsize sedan offering premium features, hybrid efficiency, and an engaging driving experience.",
        trims: [
          {
            id: "accord-lx",
            modelId: "honda-accord",
            name: "LX",
            basePrice: 29500,
            engine: "2.0L 4-Cylinder Hybrid",
            transmission: "cvt",
            horsepower: 204,
            torque: 247,
            fuelType: "hybrid",
            drivetrain: "FWD",
            fuelEconomy: { city: 51, highway: 44, combined: 48 },
            variants: [
              {
                id: "accord-lx-std",
                trimId: "accord-lx",
                name: "Standard",
                price: 29500,
                additionalFeatures: [
                  "7-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Honda Sensing suite",
                  "Adaptive cruise control",
                  "LED headlights",
                  "Automatic climate control",
                  "Remote start"
                ],
                colorOptions: [whiteColor, blackColor, silverColor],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "accord-sport",
            modelId: "honda-accord",
            name: "Sport",
            basePrice: 33000,
            engine: "2.0L 4-Cylinder Hybrid",
            transmission: "cvt",
            horsepower: 204,
            torque: 247,
            fuelType: "hybrid",
            drivetrain: "FWD",
            fuelEconomy: { city: 51, highway: 44, combined: 48 },
            variants: [
              {
                id: "accord-sport-std",
                trimId: "accord-sport",
                name: "Standard",
                price: 33000,
                additionalFeatures: [
                  "12.3-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Honda Sensing suite",
                  "19-inch alloy wheels",
                  "Sport styling",
                  "Dual-zone climate control",
                  "LED fog lights",
                  "Rear decklid spoiler"
                ],
                colorOptions: [whiteColor, blackColor, redColor, blueColor],
                availability: "in-stock"
              },
              {
                id: "accord-sport-prem",
                trimId: "accord-sport",
                name: "Premium",
                price: 35500,
                additionalFeatures: [
                  "12.3-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Honda Sensing suite",
                  "19-inch alloy wheels",
                  "Sport styling",
                  "Dual-zone climate control",
                  "LED fog lights",
                  "Rear decklid spoiler",
                  "Leather-trimmed seats",
                  "Blind spot information",
                  "Wireless charging pad",
                  "Bose premium audio"
                ],
                colorOptions: [whiteColor, blackColor, redColor],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "accord-touring",
            modelId: "honda-accord",
            name: "Touring",
            basePrice: 38500,
            engine: "2.0L 4-Cylinder Hybrid",
            transmission: "cvt",
            horsepower: 204,
            torque: 247,
            fuelType: "hybrid",
            drivetrain: "FWD",
            fuelEconomy: { city: 48, highway: 42, combined: 46 },
            variants: [
              {
                id: "accord-touring-std",
                trimId: "accord-touring",
                name: "Standard",
                price: 38500,
                additionalFeatures: [
                  "12.3-inch touchscreen with wireless Apple CarPlay",
                  "10.2-inch digital instrument cluster",
                  "Honda Sensing suite",
                  "Leather seats",
                  "Heated and ventilated front seats",
                  "Heated rear seats",
                  "Power sunroof",
                  "Bose premium audio",
                  "Wireless charging pad",
                  "Head-up display",
                  "Parking sensors",
                  "Rain-sensing wipers"
                ],
                colorOptions: [pearlWhite, blackColor, darkBlue],
                availability: "in-stock"
              },
              {
                id: "accord-touring-nav",
                trimId: "accord-touring",
                name: "Navigation",
                price: 40000,
                additionalFeatures: [
                  "12.3-inch touchscreen with wireless Apple CarPlay",
                  "10.2-inch digital instrument cluster",
                  "Honda Sensing suite",
                  "Leather seats",
                  "Heated and ventilated front seats",
                  "Heated rear seats",
                  "Power sunroof",
                  "Bose premium audio",
                  "Wireless charging pad",
                  "Head-up display",
                  "Parking sensors",
                  "Rain-sensing wipers",
                  "Built-in navigation",
                  "Adaptive damper system"
                ],
                colorOptions: [pearlWhite, blackColor],
                availability: "in-transit"
              }
            ]
          }
        ]
      }
    ]
  },

  // ─── KIA ──────────────────────────────────────────────────
  {
    id: "kia",
    name: "Kia",
    logo: "https://placehold.co/200x200/e9ebf2/324575?text=Kia",
    description: "Kia Corporation is a South Korean automaker delivering stylish, feature-rich vehicles with industry-leading warranties.",
    country: "South Korea",
    foundedYear: 1944,
    models: [
      {
        id: "kia-sportage",
        brandId: "kia",
        name: "Sportage",
        image: "https://placehold.co/600x400/e9ebf2/324575?text=Kia+Sportage",
        year: 2026,
        bodyType: "suv",
        priceRange: { min: 32000, max: 42000, currency: "USD" },
        description: "The Kia Sportage is a compact SUV featuring bold design, advanced technology, and available hybrid powertrain.",
        trims: [
          {
            id: "sportage-lx",
            modelId: "kia-sportage",
            name: "LX",
            basePrice: 32000,
            engine: "2.5L 4-Cylinder",
            transmission: "automatic",
            horsepower: 187,
            torque: 178,
            fuelType: "gasoline",
            drivetrain: "AWD",
            fuelEconomy: { city: 25, highway: 32, combined: 28 },
            variants: [
              {
                id: "sportage-lx-std",
                trimId: "sportage-lx",
                name: "Standard",
                price: 32000,
                additionalFeatures: [
                  "8-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Forward collision avoidance",
                  "Lane keeping assist",
                  "Adaptive cruise control",
                  "LED headlights",
                  "Dual-zone climate control"
                ],
                colorOptions: [whiteColor, blackColor, silverColor],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "sportage-ex",
            modelId: "kia-sportage",
            name: "EX",
            basePrice: 36000,
            engine: "1.6L Turbo Hybrid",
            transmission: "automatic",
            horsepower: 227,
            torque: 258,
            fuelType: "hybrid",
            drivetrain: "AWD",
            fuelEconomy: { city: 42, highway: 44, combined: 43 },
            variants: [
              {
                id: "sportage-ex-std",
                trimId: "sportage-ex",
                name: "Standard",
                price: 36000,
                additionalFeatures: [
                  "12.3-inch dual panoramic display",
                  "Apple CarPlay",
                  "Android Auto",
                  "Forward collision avoidance",
                  "Lane keeping assist",
                  "Adaptive cruise control",
                  "Leather seats",
                  "Heated front seats",
                  "Power liftgate",
                  "Blind spot monitor"
                ],
                colorOptions: [whiteColor, blackColor, blueColor, grayColor],
                availability: "in-stock"
              },
              {
                id: "sportage-ex-tech",
                trimId: "sportage-ex",
                name: "Technology",
                price: 38500,
                additionalFeatures: [
                  "12.3-inch dual panoramic display",
                  "Apple CarPlay",
                  "Android Auto",
                  "Forward collision avoidance",
                  "Lane keeping assist",
                  "Adaptive cruise control",
                  "Leather seats",
                  "Heated and ventilated front seats",
                  "Power liftgate",
                  "Blind spot monitor",
                  "Panoramic sunroof",
                  "Harman Kardon premium audio",
                  "Wireless charging pad",
                  "Parking sensors"
                ],
                colorOptions: [whiteColor, blackColor, redColor],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "sportage-sx-prestige",
            modelId: "kia-sportage",
            name: "SX Prestige",
            basePrice: 40000,
            engine: "1.6L Turbo Hybrid",
            transmission: "automatic",
            horsepower: 227,
            torque: 258,
            fuelType: "hybrid",
            drivetrain: "AWD",
            fuelEconomy: { city: 42, highway: 44, combined: 43 },
            variants: [
              {
                id: "sportage-sx-std",
                trimId: "sportage-sx-prestige",
                name: "Standard",
                price: 40000,
                additionalFeatures: [
                  "12.3-inch dual panoramic display",
                  "Apple CarPlay",
                  "Android Auto",
                  "Forward collision avoidance",
                  "Highway driving assist 2",
                  "Nappa leather seats",
                  "Heated and ventilated front seats",
                  "Heated rear seats",
                  "Heated steering wheel",
                  "Power liftgate",
                  "Panoramic sunroof",
                  "Harman Kardon premium audio",
                  "Head-up display",
                  "Surround view monitor",
                  "Remote smart parking assist"
                ],
                colorOptions: [pearlWhite, blackColor, redColor],
                availability: "in-stock"
              },
              {
                id: "sportage-sx-prem",
                trimId: "sportage-sx-prestige",
                name: "Premium",
                price: 42000,
                additionalFeatures: [
                  "12.3-inch dual panoramic display",
                  "Apple CarPlay",
                  "Android Auto",
                  "Forward collision avoidance",
                  "Highway driving assist 2",
                  "Nappa leather seats",
                  "Heated and ventilated front seats",
                  "Heated rear seats",
                  "Heated steering wheel",
                  "Power liftgate",
                  "Panoramic sunroof",
                  "Harman Kardon premium audio",
                  "Head-up display",
                  "Surround view monitor",
                  "Remote smart parking assist",
                  "Dual-pane acoustic glass",
                  "Digital key"
                ],
                colorOptions: [pearlWhite, blackColor, darkBlue],
                availability: "in-transit"
              }
            ]
          }
        ]
      },
      {
        id: "kia-ev6",
        brandId: "kia",
        name: "EV6",
        image: "https://placehold.co/600x400/e9ebf2/324575?text=Kia+EV6",
        year: 2026,
        bodyType: "suv",
        priceRange: { min: 43000, max: 56000, currency: "USD" },
        description: "The Kia EV6 is a fully electric crossover with ultra-fast charging, impressive range, and a futuristic design.",
        trims: [
          {
            id: "ev6-light",
            modelId: "kia-ev6",
            name: "Light",
            basePrice: 43000,
            engine: "Single Electric Motor",
            transmission: "automatic",
            horsepower: 225,
            torque: 258,
            fuelType: "electric",
            drivetrain: "RWD",
            fuelEconomy: { city: 130, highway: 101, combined: 117 },
            variants: [
              {
                id: "ev6-light-std",
                trimId: "ev6-light",
                name: "Standard",
                price: 43000,
                additionalFeatures: [
                  "12.3-inch dual display",
                  "Apple CarPlay",
                  "Android Auto",
                  "Forward collision avoidance",
                  "Lane keeping assist",
                  "232-mile range",
                  "350 kW DC ultra-fast charging",
                  "Vehicle-to-load (V2L) capability",
                  "LED headlights"
                ],
                colorOptions: [whiteColor, blackColor, silverColor],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "ev6-wind",
            modelId: "kia-ev6",
            name: "Wind",
            basePrice: 48000,
            engine: "Dual Electric Motors",
            transmission: "automatic",
            horsepower: 320,
            torque: 446,
            fuelType: "electric",
            drivetrain: "AWD",
            fuelEconomy: { city: 116, highway: 94, combined: 105 },
            variants: [
              {
                id: "ev6-wind-std",
                trimId: "ev6-wind",
                name: "Standard",
                price: 48000,
                additionalFeatures: [
                  "12.3-inch dual display",
                  "Apple CarPlay",
                  "Android Auto",
                  "Forward collision avoidance",
                  "Highway driving assist 2",
                  "274-mile range",
                  "350 kW DC ultra-fast charging",
                  "Heated front seats",
                  "Power liftgate",
                  "Vehicle-to-load (V2L) capability"
                ],
                colorOptions: [whiteColor, blackColor, blueColor, greenColor],
                availability: "in-stock"
              },
              {
                id: "ev6-wind-tech",
                trimId: "ev6-wind",
                name: "Technology",
                price: 51000,
                additionalFeatures: [
                  "12.3-inch dual display",
                  "Apple CarPlay",
                  "Android Auto",
                  "Forward collision avoidance",
                  "Highway driving assist 2",
                  "274-mile range",
                  "350 kW DC ultra-fast charging",
                  "Heated and ventilated front seats",
                  "Power liftgate",
                  "Vehicle-to-load (V2L) capability",
                  "Panoramic sunroof",
                  "Meridian premium audio",
                  "Surround view monitor",
                  "Parking sensors"
                ],
                colorOptions: [whiteColor, blackColor, blueColor],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "ev6-gt-line",
            modelId: "kia-ev6",
            name: "GT-Line",
            basePrice: 54000,
            engine: "Dual Electric Motors",
            transmission: "automatic",
            horsepower: 320,
            torque: 446,
            fuelType: "electric",
            drivetrain: "AWD",
            fuelEconomy: { city: 113, highway: 90, combined: 101 },
            variants: [
              {
                id: "ev6-gt-line-std",
                trimId: "ev6-gt-line",
                name: "Standard",
                price: 54000,
                additionalFeatures: [
                  "12.3-inch dual curved display",
                  "Apple CarPlay",
                  "Android Auto",
                  "Forward collision avoidance",
                  "Highway driving assist 2",
                  "Remote smart parking assist",
                  "270-mile range",
                  "350 kW DC ultra-fast charging",
                  "Nappa leather seats",
                  "Heated and ventilated front seats",
                  "Heated rear seats",
                  "Power liftgate",
                  "Panoramic sunroof",
                  "Meridian premium audio",
                  "Head-up display",
                  "Surround view monitor"
                ],
                colorOptions: [pearlWhite, blackColor, redColor],
                availability: "in-stock"
              },
              {
                id: "ev6-gt-line-prem",
                trimId: "ev6-gt-line",
                name: "Premium",
                price: 56000,
                additionalFeatures: [
                  "12.3-inch dual curved display",
                  "Apple CarPlay",
                  "Android Auto",
                  "Forward collision avoidance",
                  "Highway driving assist 2",
                  "Remote smart parking assist",
                  "270-mile range",
                  "350 kW DC ultra-fast charging",
                  "Nappa leather seats",
                  "Heated and ventilated front seats",
                  "Heated rear seats",
                  "Heated steering wheel",
                  "Power liftgate",
                  "Panoramic sunroof",
                  "Meridian premium audio",
                  "Head-up display",
                  "Surround view monitor",
                  "Digital key",
                  "Dual-pane acoustic glass"
                ],
                colorOptions: [pearlWhite, blackColor, darkBlue],
                availability: "build-to-order"
              }
            ]
          }
        ]
      },
      {
        id: "kia-k5",
        brandId: "kia",
        name: "K5",
        image: "https://placehold.co/600x400/e9ebf2/324575?text=Kia+K5",
        year: 2026,
        bodyType: "sedan",
        priceRange: { min: 28500, max: 35500, currency: "USD" },
        description: "The Kia K5 is a midsize sedan that combines striking design with spirited performance and advanced technology.",
        trims: [
          {
            id: "k5-lxs",
            modelId: "kia-k5",
            name: "LXS",
            basePrice: 28500,
            engine: "1.6L Turbo 4-Cylinder",
            transmission: "automatic",
            horsepower: 180,
            torque: 195,
            fuelType: "gasoline",
            drivetrain: "FWD",
            fuelEconomy: { city: 29, highway: 38, combined: 32 },
            variants: [
              {
                id: "k5-lxs-std",
                trimId: "k5-lxs",
                name: "Standard",
                price: 28500,
                additionalFeatures: [
                  "8-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Forward collision avoidance",
                  "Lane keeping assist",
                  "Adaptive cruise control",
                  "LED headlights",
                  "Dual-zone climate control",
                  "16-inch alloy wheels"
                ],
                colorOptions: [whiteColor, blackColor, silverColor],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "k5-gt-line",
            modelId: "kia-k5",
            name: "GT-Line",
            basePrice: 31000,
            engine: "1.6L Turbo 4-Cylinder",
            transmission: "automatic",
            horsepower: 180,
            torque: 195,
            fuelType: "gasoline",
            drivetrain: "FWD",
            fuelEconomy: { city: 29, highway: 38, combined: 32 },
            variants: [
              {
                id: "k5-gt-line-std",
                trimId: "k5-gt-line",
                name: "Standard",
                price: 31000,
                additionalFeatures: [
                  "12.3-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Forward collision avoidance",
                  "Lane keeping assist",
                  "Adaptive cruise control",
                  "LED headlights",
                  "Dual-zone climate control",
                  "18-inch alloy wheels",
                  "Sport styling package",
                  "Leather seats"
                ],
                colorOptions: [whiteColor, blackColor, redColor, blueColor],
                availability: "in-stock"
              },
              {
                id: "k5-gt-line-tech",
                trimId: "k5-gt-line",
                name: "Technology",
                price: 33500,
                additionalFeatures: [
                  "12.3-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Forward collision avoidance",
                  "Highway driving assist",
                  "Adaptive cruise control",
                  "LED headlights",
                  "Dual-zone climate control",
                  "18-inch alloy wheels",
                  "Sport styling package",
                  "Leather seats",
                  "Panoramic sunroof",
                  "Bose premium audio",
                  "Wireless charging pad",
                  "Surround view monitor"
                ],
                colorOptions: [whiteColor, blackColor, redColor],
                availability: "in-stock"
              }
            ]
          },
          {
            id: "k5-gt",
            modelId: "kia-k5",
            name: "GT",
            basePrice: 34000,
            engine: "2.5L Turbo 4-Cylinder",
            transmission: "dct",
            horsepower: 290,
            torque: 311,
            fuelType: "gasoline",
            drivetrain: "FWD",
            fuelEconomy: { city: 24, highway: 32, combined: 27 },
            variants: [
              {
                id: "k5-gt-std",
                trimId: "k5-gt",
                name: "Standard",
                price: 34000,
                additionalFeatures: [
                  "12.3-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Forward collision avoidance",
                  "Highway driving assist",
                  "GT sport seats",
                  "Launch control",
                  "19-inch alloy wheels",
                  "Sport exhaust",
                  "LED headlights",
                  "Dual-zone climate control",
                  "Bose premium audio"
                ],
                colorOptions: [whiteColor, blackColor, redColor],
                availability: "in-stock"
              },
              {
                id: "k5-gt-prem",
                trimId: "k5-gt",
                name: "Premium",
                price: 35500,
                additionalFeatures: [
                  "12.3-inch touchscreen",
                  "Apple CarPlay",
                  "Android Auto",
                  "Forward collision avoidance",
                  "Highway driving assist",
                  "GT sport seats with Nappa leather",
                  "Launch control",
                  "19-inch alloy wheels",
                  "Sport exhaust",
                  "LED headlights",
                  "Dual-zone climate control",
                  "Bose premium audio",
                  "Panoramic sunroof",
                  "Surround view monitor",
                  "Wireless charging pad",
                  "Head-up display"
                ],
                colorOptions: [pearlWhite, blackColor, redColor],
                availability: "in-transit"
              }
            ]
          }
        ]
      }
    ]
  }
];

export function getBrandById(id: string): Brand | undefined {
  return brands.find((b) => b.id === id);
}

export function getModelById(brandId: string, modelId: string): Model | undefined {
  const brand = getBrandById(brandId);
  if (!brand) return undefined;
  return brand.models.find((m) => m.id === modelId);
}

export function getTrimById(modelId: string, trimId: string): Trim | undefined {
  for (const brand of brands) {
    const model = brand.models.find((m) => m.id === modelId);
    if (model) {
      return model.trims.find((t) => t.id === trimId);
    }
  }
  return undefined;
}

export function getAllModelsForBrand(brandId: string): Model[] {
  const brand = getBrandById(brandId);
  return brand ? brand.models : [];
}
