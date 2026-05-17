// Data Source -- unified abstraction that switches between mock data and the
// live API based on the NEXT_PUBLIC_DATA_SOURCE environment variable.
//
// Usage in pages:
//   import { ds } from "@/data/data-source";
//   const brand = await ds.getBrandById("mercedes");
//
// Set NEXT_PUBLIC_DATA_SOURCE="api" and NEXT_PUBLIC_API_BASE_URL to use the
// live backend. Any other value (or unset) uses the existing mock data.

import type {
  Brand,
  BrandEditorial,
  Model,
  Trim,
  LifestyleCollection,
  SearchEntry,
  ModelAggregateSpecs,
  SortBy,
} from "./types";
import { type FilterState } from "../components/FilterPanel";

// ---------------------------------------------------------------------------
// Mock data source (existing, synchronous)
// ---------------------------------------------------------------------------

import { brands as mockBrands, models as mockModels, lifestyleCollections as mockCollections } from "./mock-data";
import * as mockHelpers from "./helpers";

const mockDataSource = {
  isApi: false as const,

  // Brands
  getAllBrands: async () => mockBrands,
  getBrandById: async (id: string) => mockHelpers.getBrandById(id),
  getBrandByModelId: async (modelId: string) => mockHelpers.getBrandByModelId(modelId),
  getBrandEditorial: async (brandId: string) => mockHelpers.getBrandEditorial(brandId),

  // Models
  getModelById: async (id: string) => mockHelpers.getModelById(id),
  getModelsByBrand: async (brandId: string) => mockHelpers.getModelsByBrand(brandId),
  getModelsByBrandSegmentOrder: async (brandId: string) => mockHelpers.getModelsByBrandSegmentOrder(brandId),
  getModelsByBodyType: async (bodyType: string) => mockHelpers.getModelsByBodyType(bodyType),
  getNewModels: async () => mockHelpers.getNewModels(),
  getModelsByPriceRange: async (min: number, max: number) => mockHelpers.getModelsByPriceRange(min, max),
  getModelsByLifestyleCollection: async (id: string) => mockHelpers.getModelsByLifestyleCollection(id),
  getCollectionById: async (id: string) => mockHelpers.getCollectionById(id),

  // Trims
  getTrimsByModel: async (modelId: string) => mockHelpers.getTrimsByModel(modelId),
  getTrimById: async (id: string) => mockHelpers.getTrimById(id),

  // Aggregate specs
  getModelAggregateSpecs: async (modelId: string) => mockHelpers.getModelAggregateSpecs(modelId),

  // Search
  searchModels: async (query: string) => mockHelpers.searchModels(query),
  searchTrims: async (query: string) => mockHelpers.searchTrims(query),
  searchModelsDeduped: async (query: string) => mockHelpers.searchModelsDeduped(query),

  // Filter / Sort (synchronous passthrough)
  filterModels: (allModels: Model[], filters: FilterState) => mockHelpers.filterModels(allModels, filters),
  sortModels: (allModels: Model[], sortBy: SortBy) => mockHelpers.sortModels(allModels, sortBy),

  // Branches
  getBranchesForModel: (_modelId: string) => mockHelpers.getBranchesForModel(_modelId),

  // Home page composite
  getHomePageData: async () => ({
    brands: mockBrands,
    whatsNew: mockHelpers.getNewModels(),
    featuredModels: mockModels.filter((m) => m.featured),
    collections: mockCollections,
  }),

  // Raw access
  get brands() { return mockBrands; },
  get models() { return mockModels; },
  get lifestyleCollections() { return mockCollections; },

  // Brand colors
  brandColors: mockHelpers.brandColors,
};

// ---------------------------------------------------------------------------
// API data source (async, calls backend)
// ---------------------------------------------------------------------------

import * as apiHelpers from "./api-helpers";

const apiDataSource = {
  isApi: true as const,

  // Brands
  getAllBrands: () => apiHelpers.getAllBrands(),
  getBrandById: (id: string) => apiHelpers.getBrandById(id),
  getBrandByModelId: (modelId: string) => apiHelpers.getBrandByModelId(modelId),
  getBrandEditorial: (brandId: string) => apiHelpers.getBrandEditorial(brandId),

  // Models
  getModelById: (id: string) => apiHelpers.getModelById(id),
  getModelsByBrand: (brandId: string) => apiHelpers.getModelsByBrand(brandId),
  getModelsByBrandSegmentOrder: (brandId: string) => apiHelpers.getModelsByBrandSegmentOrder(brandId),
  getModelsByBodyType: (bodyType: string) => apiHelpers.getModelsByBodyType(bodyType),
  getNewModels: () => apiHelpers.getNewModels(),
  getModelsByPriceRange: (min: number, max: number) => apiHelpers.getModelsByPriceRange(min, max),
  getModelsByLifestyleCollection: (id: string) => apiHelpers.getModelsByLifestyleCollection(id),
  getCollectionById: (id: string) => apiHelpers.getCollectionById(id),

  // Trims
  getTrimsByModel: (modelId: string) => apiHelpers.getTrimsByModel(modelId),
  getTrimById: (id: string) => apiHelpers.getTrimById(id),

  // Aggregate specs
  getModelAggregateSpecs: (modelId: string) => apiHelpers.getModelAggregateSpecs(modelId),

  // Search
  searchModels: (query: string) => apiHelpers.searchModels(query),
  searchTrims: (query: string) => apiHelpers.searchTrims(query),
  searchModelsDeduped: (query: string) => apiHelpers.searchModelsDeduped(query),

  // Filter / Sort (client-side fallback using mock helpers)
  filterModels: (allModels: Model[], filters: FilterState) => apiHelpers.filterModels(allModels, filters),
  sortModels: (allModels: Model[], sortBy: SortBy) => apiHelpers.sortModels(allModels, sortBy),

  // Branches
  getBranchesForModel: (_modelId: string) => apiHelpers.getBranchesForModel(_modelId),

  // Home page composite
  getHomePageData: () => apiHelpers.getHomePageData(),

  // Raw access (not available with API -- return empty to avoid type errors)
  get brands(): Brand[] { return []; },
  get models(): Model[] { return []; },
  get lifestyleCollections(): LifestyleCollection[] { return []; },

  // Brand colors
  brandColors: apiHelpers.brandColors,
};

// ---------------------------------------------------------------------------
// Export the active data source
// ---------------------------------------------------------------------------

function isApiMode(): boolean {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_DATA_SOURCE === "api") {
    return true;
  }
  // Also check window for client components
  if (typeof window !== "undefined") {
    return (window as unknown as Record<string, unknown>).__NEXT_DATA_SOURCE__ === "api";
  }
  return false;
}

export type DataSource = typeof mockDataSource | typeof apiDataSource;

/**
 * The active data source. Use `ds.getBrandById(...)`, `ds.searchTrims(...)`, etc.
 *
 * - Default (mock): uses the existing mock-data.ts / helpers.ts
 * - API mode: set NEXT_PUBLIC_DATA_SOURCE="api" and NEXT_PUBLIC_API_BASE_URL
 */
export const ds: DataSource = isApiMode() ? apiDataSource : mockDataSource;

/**
 * Check at runtime which source is active.
 */
export function getDataSourceMode(): "mock" | "api" {
  return isApiMode() ? "api" : "mock";
}
