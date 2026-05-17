"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import type { Brand, Model, Trim, LifestyleCollection, SearchEntry, ModelAggregateSpecs, BrandEditorial, SortBy } from "@/data/types";
import { type FilterState } from "@/components/FilterPanel";

// ---------------------------------------------------------------------------
// Mock data source (synchronous)
// ---------------------------------------------------------------------------
import { brands as mockBrands, models as mockModels, lifestyleCollections as mockCollections } from "@/data/mock-data";
import * as mockHelpers from "@/data/helpers";

// ---------------------------------------------------------------------------
// API data source
// ---------------------------------------------------------------------------
import * as apiClient from "@/data/api-client";
import * as mappers from "@/data/api-mappers";

function isApiMode(): boolean {
  return process.env.NEXT_PUBLIC_DATA_SOURCE === "api";
}

// ---------------------------------------------------------------------------
// Context types
// ---------------------------------------------------------------------------

interface AppData {
  loading: boolean;
  isApi: boolean;
  brands: Brand[];
  models: Model[];
  lifestyleCollections: LifestyleCollection[];
  // Helpers
  getBrandById: (id: string) => Brand | undefined;
  getBrandByModelId: (modelId: string) => Brand | undefined;
  getBrandEditorial: (brandId: string) => BrandEditorial | undefined;
  getModelById: (id: string) => Model | undefined;
  getModelsByBrand: (brandId: string) => Model[];
  getModelsByBrandSegmentOrder: (brandId: string) => Model[];
  getModelsByBodyType: (bodyType: string) => Model[];
  getNewModels: () => Model[];
  getModelsByPriceRange: (min: number, max: number) => Model[];
  getModelsByLifestyleCollection: (id: string) => Model[];
  getCollectionById: (id: string) => LifestyleCollection | undefined;
  getTrimsByModel: (modelId: string) => Trim[];
  getTrimById: (id: string) => Trim | undefined;
  getModelAggregateSpecs: (modelId: string) => ModelAggregateSpecs | undefined;
  searchModels: (query: string) => Model[];
  searchTrims: (query: string) => SearchEntry[];
  searchModelsDeduped: (query: string) => SearchEntry[];
  filterModels: (allModels: Model[], filters: FilterState) => Model[];
  sortModels: (allModels: Model[], sortBy: SortBy) => Model[];
  getBranchesForModel: (modelId: string) => ReturnType<typeof mockHelpers.getBranchesForModel>;
  brandColors: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Mock data (immediate, synchronous)
// ---------------------------------------------------------------------------

const mockData: AppData = {
  loading: false,
  isApi: false,
  brands: mockBrands,
  models: mockModels,
  lifestyleCollections: mockCollections,
  getBrandById: mockHelpers.getBrandById,
  getBrandByModelId: mockHelpers.getBrandByModelId,
  getBrandEditorial: mockHelpers.getBrandEditorial,
  getModelById: mockHelpers.getModelById,
  getModelsByBrand: mockHelpers.getModelsByBrand,
  getModelsByBrandSegmentOrder: mockHelpers.getModelsByBrandSegmentOrder,
  getModelsByBodyType: mockHelpers.getModelsByBodyType,
  getNewModels: mockHelpers.getNewModels,
  getModelsByPriceRange: mockHelpers.getModelsByPriceRange,
  getModelsByLifestyleCollection: mockHelpers.getModelsByLifestyleCollection,
  getCollectionById: mockHelpers.getCollectionById,
  getTrimsByModel: mockHelpers.getTrimsByModel,
  getTrimById: mockHelpers.getTrimById,
  getModelAggregateSpecs: mockHelpers.getModelAggregateSpecs,
  searchModels: mockHelpers.searchModels,
  searchTrims: mockHelpers.searchTrims,
  searchModelsDeduped: mockHelpers.searchModelsDeduped,
  filterModels: mockHelpers.filterModels,
  sortModels: mockHelpers.sortModels,
  getBranchesForModel: mockHelpers.getBranchesForModel,
  brandColors: mockHelpers.brandColors,
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AppDataContext = createContext<AppData>(mockData);

export function useAppData() {
  return useContext(AppDataContext);
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AppDataProvider({ children }: { children: ReactNode }) {
  const api = isApiMode();

  if (!api) {
    return (
      <AppDataContext.Provider value={mockData}>
        {children}
      </AppDataContext.Provider>
    );
  }

  return <ApiDataProvider>{children}</ApiDataProvider>;
}

// ---------------------------------------------------------------------------
// API Provider -- fetches data from the backend
// ---------------------------------------------------------------------------

// Module-level cache so data persists across re-renders and navigations
let _apiBrands: Brand[] = [];
let _apiModels: Model[] = [];
let _apiCollections: LifestyleCollection[] = [];
let _apiTrimsCache: Record<string, Trim[]> = {};
let _apiInitialized = false;

function ApiDataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(!_apiInitialized);
  const [brands, setBrands] = useState<Brand[]>(_apiBrands);
  const [models, setModels] = useState<Model[]>(_apiModels);
  const [collections, setCollections] = useState<LifestyleCollection[]>(_apiCollections);
  const [trimsCache, setTrimsCache] = useState<Record<string, Trim[]>>(_apiTrimsCache);
  const fetchedRef = useRef(_apiInitialized);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    (async () => {
      try {
        // Fetch brands + browse all models in parallel
        const [apiBrands, browseResult] = await Promise.all([
          apiClient.fetchBrands(),
          apiClient.fetchBrowse({ per_page: 200 }),
        ]);

        const mappedBrands = apiBrands
          .filter((ab) => {
            // Filter out junk/test brands from the backend
            if (!ab.name_en || ab.name_en.trim().length < 2) return false;
            const code = (ab.code || "").toUpperCase();
            if (code.includes("TEST") || code.includes("INVALID")) return false;
            return true;
          })
          .map((ab) => mappers.mapApiBrandToBrand(ab));

        const mappedModels = (browseResult.items ?? []).map((item) =>
          mappers.mapSearchItemToModel(item)
        );

        // Try to fetch home data for collections
        let mappedCollections: LifestyleCollection[] = [];
        try {
          const home = await apiClient.fetchHome();
          mappedCollections = (home.collections ?? []).map(mappers.mapHomeCollectionToLifestyle);
        } catch { /* no collections available */ }

        // Populate module-level cache
        _apiBrands = mappedBrands;
        _apiModels = mappedModels;
        _apiCollections = mappedCollections;
        _apiInitialized = true;

        setBrands(mappedBrands);
        setModels(mappedModels);
        setCollections(mappedCollections);
      } catch (err) {
        console.error("Failed to fetch API data:", err);
        // No fallback -- API mode depends solely on the backend
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Build synchronous helper functions that work against fetched data
  // Helper: resolve a brand ID that may be a slug, numeric string, or partial slug
  const resolveBrand = useCallback(
    (id: string) => {
      const q = id.toLowerCase();
      return brands.find(
        (b) =>
          b.id === id ||
          b.slug === q ||
          b.slug?.startsWith(q + "-") ||
          b.name.toLowerCase().replace(/[^a-z0-9]/g, "").startsWith(q)
      );
    },
    [brands]
  );

  const resolveModel = useCallback(
    (id: string) => {
      const q = id.toLowerCase();
      return models.find(
        (m) =>
          m.id === id ||
          m.slug === q ||
          m.slug?.startsWith(q + "-")
      );
    },
    [models]
  );

  const getBrandById = useCallback(
    (id: string) => resolveBrand(id),
    [resolveBrand]
  );

  const getModelById = useCallback(
    (id: string) => resolveModel(id),
    [resolveModel]
  );

  const getBrandByModelId = useCallback(
    (modelId: string) => {
      const model = resolveModel(modelId);
      if (!model) return undefined;
      return brands.find((b) => b.id === model.brandId);
    },
    [brands, resolveModel]
  );

  const getBrandEditorial = useCallback(
    (brandId: string) => {
      const brand = resolveBrand(brandId);
      return brand?.editorial;
    },
    [resolveBrand]
  );

  const getModelsByBrand = useCallback(
    (brandId: string) => {
      const brand = resolveBrand(brandId);
      const resolvedId = brand?.id ?? brandId;
      return models.filter((m) => m.brandId === resolvedId);
    },
    [models, resolveBrand]
  );

  const getModelsByBrandSegmentOrder = useCallback(
    (brandId: string) => {
      const brand = resolveBrand(brandId);
      const resolvedId = brand?.id ?? brandId;
      return models
        .filter((m) => m.brandId === resolvedId)
        .sort((a, b) => (a.segmentOrder ?? 999) - (b.segmentOrder ?? 999));
    },
    [models, resolveBrand]
  );

  const getModelsByBodyType = useCallback(
    (bodyType: string) => models.filter((m) => m.bodyType === bodyType),
    [models]
  );

  const getNewModels = useCallback(
    () => models.filter((m) => m.isNew || m.isUpdated),
    [models]
  );

  const getModelsByPriceRange = useCallback(
    (min: number, max: number) =>
      models.filter((m) => m.startingPrice >= min && m.startingPrice <= max),
    [models]
  );

  const getModelsByLifestyleCollection = useCallback(
    (id: string) => {
      const collection = collections.find((c) => c.id === id);
      if (!collection) return [];
      return collection.modelIds
        .map((mid) => models.find((m) => m.id === mid))
        .filter((m): m is Model => m !== undefined);
    },
    [models, collections]
  );

  const getCollectionById = useCallback(
    (id: string) => collections.find((c) => c.id === id),
    [collections]
  );

  // Trims: fetch from API on demand, cache in state
  const getTrimsByModel = useCallback(
    (modelId: string): Trim[] => {
      // Resolve slug to numeric ID
      const model = resolveModel(modelId);
      const resolvedId = model?.id ?? modelId;
      if (trimsCache[resolvedId]) return trimsCache[resolvedId];
      // Trigger async fetch, return empty for now
      const numId = Number(resolvedId);
      if (!isNaN(numId)) {
        apiClient
          .fetchModelTrims(numId)
          .then((apiTrims) => {
            const mapped = apiTrims.map(mappers.mapApiTrimToTrim);
            _apiTrimsCache[resolvedId] = mapped;
            setTrimsCache((prev) => ({ ...prev, [resolvedId]: mapped }));
          })
          .catch(() => {});
      }
      return [];
    },
    [trimsCache, resolveModel]
  );

  const getTrimById = useCallback(
    (id: string): Trim | undefined => {
      for (const trims of Object.values(trimsCache)) {
        const found = trims.find((t) => t.id === id);
        if (found) return found;
      }
      return undefined;
    },
    [trimsCache]
  );

  const getModelAggregateSpecs = useCallback(
    (modelId: string): ModelAggregateSpecs | undefined => {
      const model = resolveModel(modelId);
      const resolvedId = model?.id ?? modelId;
      const modelTrims = trimsCache[resolvedId];
      if (!modelTrims || modelTrims.length === 0) return undefined;
      return mockHelpers.getModelAggregateSpecs(resolvedId);
    },
    [trimsCache, resolveModel]
  );

  // Search: use the API
  const searchTrimsApi = useCallback(
    (query: string): SearchEntry[] => {
      // For synchronous interface, search against cached models
      const q = query.toLowerCase().trim();
      if (q.length < 2) return [];
      const entries: SearchEntry[] = [];
      for (const model of models) {
        const brand = brands.find((b) => b.id === model.brandId);
        const searchStr = `${brand?.name || ""} ${model.name} ${model.bodyType}`.toLowerCase();
        if (searchStr.includes(q)) {
          entries.push({
            modelId: model.id,
            trimId: "",
            brandId: model.brandId,
            brandName: brand?.name ?? "",
            modelName: model.name,
            trimName: "",
            price: model.startingPrice,
            imageUrl: model.imageUrl,
            bodyType: model.bodyType,
            searchText: searchStr,
          });
        }
      }
      return entries;
    },
    [brands, models]
  );

  const searchModelsApi = useCallback(
    (query: string): Model[] => {
      const q = query.toLowerCase().trim();
      if (!q) return [];
      return models.filter((m) => {
        const brand = brands.find((b) => b.id === m.brandId);
        const searchStr = `${brand?.name || ""} ${m.name} ${m.bodyType}`.toLowerCase();
        return searchStr.includes(q);
      });
    },
    [brands, models]
  );

  const searchModelsDeduped = useCallback(
    (query: string): SearchEntry[] => {
      const all = searchTrimsApi(query);
      const seen = new Set<string>();
      return all.filter((e) => {
        if (seen.has(e.modelId)) return false;
        seen.add(e.modelId);
        return true;
      });
    },
    [searchTrimsApi]
  );

  const value: AppData = {
    loading,
    isApi: true,
    brands,
    models,
    lifestyleCollections: collections,
    getBrandById,
    getBrandByModelId,
    getBrandEditorial,
    getModelById,
    getModelsByBrand,
    getModelsByBrandSegmentOrder,
    getModelsByBodyType,
    getNewModels,
    getModelsByPriceRange,
    getModelsByLifestyleCollection,
    getCollectionById,
    getTrimsByModel,
    getTrimById,
    getModelAggregateSpecs,
    searchModels: searchModelsApi,
    searchTrims: searchTrimsApi,
    searchModelsDeduped,
    filterModels: mockHelpers.filterModels,
    sortModels: mockHelpers.sortModels,
    getBranchesForModel: () => [],
    brandColors: mockHelpers.brandColors,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}
