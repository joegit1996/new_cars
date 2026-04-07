import { Model } from "@/types";

const imgBase = "https://cdn.imagin.studio/getImage?customer=img&zoomType=fullscreen";

function carImg(make: string, model: string, angle = "01"): string {
  return `${imgBase}&make=${make}&modelFamily=${model}&modelYear=2025&angle=${angle}`;
}

export const models: Model[] = [
  // Mercedes-Benz
  {
    id: "model-mb-cclass",
    brandId: "brand-mercedes",
    name: "C-Class",
    slug: "c-class",
    image: carImg("mercedes-benz", "c-class"),
    startingPrice: 12500,
  },
  {
    id: "model-mb-eclass",
    brandId: "brand-mercedes",
    name: "E-Class",
    slug: "e-class",
    image: carImg("mercedes-benz", "e-class"),
    startingPrice: 17800,
  },
  {
    id: "model-mb-sclass",
    brandId: "brand-mercedes",
    name: "S-Class",
    slug: "s-class",
    image: carImg("mercedes-benz", "s-class"),
    startingPrice: 29500,
  },
  {
    id: "model-mb-glc",
    brandId: "brand-mercedes",
    name: "GLC",
    slug: "glc",
    image: carImg("mercedes-benz", "glc"),
    startingPrice: 16200,
  },

  // BMW
  {
    id: "model-bmw-3series",
    brandId: "brand-bmw",
    name: "3 Series",
    slug: "3-series",
    image: carImg("bmw", "3-series"),
    startingPrice: 11800,
  },
  {
    id: "model-bmw-5series",
    brandId: "brand-bmw",
    name: "5 Series",
    slug: "5-series",
    image: carImg("bmw", "5-series"),
    startingPrice: 16500,
  },
  {
    id: "model-bmw-x5",
    brandId: "brand-bmw",
    name: "X5",
    slug: "x5",
    image: carImg("bmw", "x5"),
    startingPrice: 22000,
  },
  {
    id: "model-bmw-7series",
    brandId: "brand-bmw",
    name: "7 Series",
    slug: "7-series",
    image: carImg("bmw", "7-series"),
    startingPrice: 32000,
  },

  // Toyota
  {
    id: "model-toyota-camry",
    brandId: "brand-toyota",
    name: "Camry",
    slug: "camry",
    image: carImg("toyota", "camry"),
    startingPrice: 7800,
  },
  {
    id: "model-toyota-landcruiser",
    brandId: "brand-toyota",
    name: "Land Cruiser",
    slug: "land-cruiser",
    image: carImg("toyota", "land-cruiser"),
    startingPrice: 22500,
  },
  {
    id: "model-toyota-corolla",
    brandId: "brand-toyota",
    name: "Corolla",
    slug: "corolla",
    image: carImg("toyota", "corolla"),
    startingPrice: 5900,
  },

  // Lexus
  {
    id: "model-lexus-es",
    brandId: "brand-lexus",
    name: "ES",
    slug: "es",
    image: carImg("lexus", "es"),
    startingPrice: 13500,
  },
  {
    id: "model-lexus-rx",
    brandId: "brand-lexus",
    name: "RX",
    slug: "rx",
    image: carImg("lexus", "rx"),
    startingPrice: 18900,
  },
  {
    id: "model-lexus-lx",
    brandId: "brand-lexus",
    name: "LX",
    slug: "lx",
    image: carImg("lexus", "lx"),
    startingPrice: 35000,
  },

  // Porsche
  {
    id: "model-porsche-cayenne",
    brandId: "brand-porsche",
    name: "Cayenne",
    slug: "cayenne",
    image: carImg("porsche", "cayenne"),
    startingPrice: 28000,
  },
  {
    id: "model-porsche-macan",
    brandId: "brand-porsche",
    name: "Macan",
    slug: "macan",
    image: carImg("porsche", "macan"),
    startingPrice: 22000,
  },
  {
    id: "model-porsche-911",
    brandId: "brand-porsche",
    name: "911",
    slug: "911",
    image: carImg("porsche", "911"),
    startingPrice: 42000,
  },

  // Land Rover
  {
    id: "model-lr-defender",
    brandId: "brand-landrover",
    name: "Defender",
    slug: "defender",
    image: carImg("land-rover", "defender"),
    startingPrice: 24000,
  },
  {
    id: "model-lr-rangerover",
    brandId: "brand-landrover",
    name: "Range Rover",
    slug: "range-rover",
    image: carImg("land-rover", "range-rover"),
    startingPrice: 38000,
  },
  {
    id: "model-lr-rrsport",
    brandId: "brand-landrover",
    name: "Range Rover Sport",
    slug: "range-rover-sport",
    image: carImg("land-rover", "range-rover-sport"),
    startingPrice: 29000,
  },
];
