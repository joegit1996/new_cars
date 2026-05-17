// API Helpers -- API-backed versions of every helper function from helpers.ts.
// These call the backend API and map responses to the same frontend types
// that pages already consume. Import these instead of helpers.ts when using
// the live backend.

import type {
  Brand,
  Model,
  Trim,
  TrimVariant,
  Equipment,
  LifestyleCollection,
  SearchEntry,
  ModelAggregateSpecs,
  BrandEditorial,
  SortBy,
} from "./types";
import { type FilterState } from "../components/FilterPanel";
import {
  fetchHome,
  fetchBrands,
  fetchBrand,
  fetchBrandEditorial,
  fetchModel,
  fetchModelTrims,
  fetchTrim,
  fetchTrimEquipment,
  fetchTrimVariants,
  fetchModelAggregateSpecs,
  fetchBrowse,
  fetchSearch,
  fetchSearchSuggestions,
  fetchCompareTrims,
  submitLead as apiSubmitLead,
} from "./api-client";
import {
  mapApiBrandToBrand,
  mapApiBrandEditorialResponse,
  mapApiModelToModel,
  mapSearchItemToModel,
  mapHomeModelCardToModel,
  mapHomeBrandCardToBrand,
  mapHomeCollectionToLifestyle,
  mapApiTrimToTrim,
  mapApiTrimVariant,
  mapApiEquipmentItem,
  mapApiAggregateSpecs,
  mapSearchItemToSearchEntry,
} from "./api-mappers";
import type { ApiCreateLeadInput } from "./api-types";

// Re-export brandColors (static, same for both data sources)
export { brandColors } from "./helpers";

// ---------------------------------------------------------------------------
// ID mapping -- the API uses numeric IDs; existing pages use string slugs.
// We keep a lookup cache that gets populated as data is fetched.
// ---------------------------------------------------------------------------

const brandSlugToId = new Map<string, number>();
const modelSlugToId = new Map<string, number>();

function cacheBrand(brand: Brand, numericId: number) {
  brandSlugToId.set(brand.id, numericId);
}

function cacheModel(model: Model, numericId: number) {
  modelSlugToId.set(model.id, numericId);
}

function parseBrandId(idOrSlug: string): number {
  const cached = brandSlugToId.get(idOrSlug);
  if (cached) return cached;
  const n = Number(idOrSlug);
  if (!isNaN(n)) return n;
  return 0;
}

function parseModelId(idOrSlug: string): number {
  const cached = modelSlugToId.get(idOrSlug);
  if (cached) return cached;
  const n = Number(idOrSlug);
  if (!isNaN(n)) return n;
  return 0;
}

// ---------------------------------------------------------------------------
// Home page data
// ---------------------------------------------------------------------------

export interface HomePageData {
  brands: Brand[];
  whatsNew: Model[];
  featuredModels: Model[];
  collections: LifestyleCollection[];
}

export async function getHomePageData(): Promise<HomePageData> {
  const home = await fetchHome();
  const brands = (home.featured_brands ?? []).map(mapHomeBrandCardToBrand);
  const whatsNew = (home.whats_new ?? []).map(mapHomeModelCardToModel);
  const featuredModels = (home.featured_models ?? []).map(mapHomeModelCardToModel);
  const collections = (home.collections ?? []).map(mapHomeCollectionToLifestyle);

  // Cache IDs
  home.featured_brands?.forEach((b) => brandSlugToId.set(String(b.id), b.id));
  home.whats_new?.forEach((m) => modelSlugToId.set(String(m.id), m.id));
  home.featured_models?.forEach((m) => modelSlugToId.set(String(m.id), m.id));

  return { brands, whatsNew, featuredModels, collections };
}

// ---------------------------------------------------------------------------
// Brand helpers
// ---------------------------------------------------------------------------

let brandsCache: Brand[] | null = null;

export async function getAllBrands(): Promise<Brand[]> {
  if (brandsCache) return brandsCache;
  const apiBrands = await fetchBrands();
  brandsCache = apiBrands.map((b) => {
    const brand = mapApiBrandToBrand(b);
    cacheBrand(brand, b.id);
    return brand;
  });
  return brandsCache;
}

export async function getBrandById(id: string): Promise<Brand | undefined> {
  // Try cache first
  const all = brandsCache;
  if (all) {
    const found = all.find((b) => b.id === id);
    if (found) return found;
  }

  const numId = parseBrandId(id);
  if (!numId) return undefined;
  try {
    const apiBrand = await fetchBrand(numId);
    const brand = mapApiBrandToBrand(apiBrand);
    cacheBrand(brand, apiBrand.id);
    return brand;
  } catch {
    return undefined;
  }
}

export async function getBrandByModelId(modelId: string): Promise<Brand | undefined> {
  const model = await getModelById(modelId);
  if (!model) return undefined;
  return getBrandById(model.brandId);
}

export async function getBrandEditorial(brandId: string): Promise<BrandEditorial | undefined> {
  const brand = await getBrandById(brandId);
  if (!brand) return undefined;
  if (brand.editorial) return brand.editorial;

  const numId = parseBrandId(brandId);
  if (!numId) return undefined;
  try {
    const resp = await fetchBrandEditorial(numId);
    const updated = mapApiBrandEditorialResponse(resp, brand);
    return updated.editorial;
  } catch {
    return undefined;
  }
}

// ---------------------------------------------------------------------------
// Model helpers
// ---------------------------------------------------------------------------

export async function getModelById(id: string): Promise<Model | undefined> {
  const numId = parseModelId(id);
  if (!numId) return undefined;
  try {
    const apiModel = await fetchModel(numId);
    const model = mapApiModelToModel(apiModel);
    cacheModel(model, apiModel.id);
    return model;
  } catch {
    return undefined;
  }
}

export async function getModelsByBrand(brandId: string): Promise<Model[]> {
  const numId = parseBrandId(brandId);
  if (!numId) return [];
  try {
    const result = await fetchBrowse({ brand_id: numId, per_page: 100 });
    return (result.items ?? []).map((item) => {
      const model = mapSearchItemToModel(item);
      modelSlugToId.set(model.id, item.id);
      return model;
    });
  } catch {
    return [];
  }
}

export async function getModelsByBrandSegmentOrder(brandId: string): Promise<Model[]> {
  const models = await getModelsByBrand(brandId);
  return models.sort((a, b) => (a.segmentOrder ?? 999) - (b.segmentOrder ?? 999));
}

export async function getModelsByBodyType(bodyType: string): Promise<Model[]> {
  try {
    const result = await fetchBrowse({ body_style_code: bodyType.toLowerCase(), per_page: 100 });
    return (result.items ?? []).map((item) => {
      const model = mapSearchItemToModel(item);
      modelSlugToId.set(model.id, item.id);
      return model;
    });
  } catch {
    return [];
  }
}

export async function getNewModels(): Promise<Model[]> {
  try {
    const result = await fetchBrowse({ is_new: true, per_page: 100 });
    return (result.items ?? []).map((item) =>
      mapSearchItemToModel(item)
    );
  } catch {
    return [];
  }
}

export async function getModelsByPriceRange(min: number, max: number): Promise<Model[]> {
  try {
    const result = await fetchBrowse({ min_price: min, max_price: max, per_page: 100 });
    return (result.items ?? []).map((item) =>
      mapSearchItemToModel(item)
    );
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Trim helpers
// ---------------------------------------------------------------------------

export async function getTrimsByModel(modelId: string): Promise<Trim[]> {
  const numId = parseModelId(modelId);
  if (!numId) return [];
  try {
    const apiTrims = await fetchModelTrims(numId);
    return apiTrims.map(mapApiTrimToTrim);
  } catch {
    return [];
  }
}

export async function getTrimById(id: string): Promise<Trim | undefined> {
  const numId = Number(id);
  if (isNaN(numId)) return undefined;
  try {
    const apiTrim = await fetchTrim(numId);
    const trim = mapApiTrimToTrim(apiTrim);

    // Hydrate equipment and variants
    const [equipment, variants] = await Promise.all([
      fetchTrimEquipment(numId).catch(() => []),
      fetchTrimVariants(numId).catch(() => []),
    ]);

    trim.equipment = equipment.map(mapApiEquipmentItem);
    trim.variants = variants.map(mapApiTrimVariant);

    return trim;
  } catch {
    return undefined;
  }
}

// ---------------------------------------------------------------------------
// Aggregate specs
// ---------------------------------------------------------------------------

export async function getModelAggregateSpecs(
  modelId: string
): Promise<ModelAggregateSpecs | undefined> {
  const numId = parseModelId(modelId);
  if (!numId) return undefined;
  try {
    const apiSpecs = await fetchModelAggregateSpecs(numId);
    return mapApiAggregateSpecs(apiSpecs);
  } catch {
    return undefined;
  }
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export async function searchModels(query: string): Promise<Model[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const result = await fetchSearch({
      q: query,
      type: "product_line",
      per_page: 20,
    });
    return (result.items ?? []).map((item) =>
      mapSearchItemToModel(item)
    );
  } catch {
    return [];
  }
}

export async function searchTrims(query: string): Promise<SearchEntry[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const result = await fetchSearch({
      q: query,
      type: "variant",
      per_page: 50,
    });
    return (result.items ?? []).map(mapSearchItemToSearchEntry);
  } catch {
    return [];
  }
}

export async function searchModelsDeduped(query: string): Promise<SearchEntry[]> {
  const all = await searchTrims(query);
  const seen = new Set<string>();
  const deduped: SearchEntry[] = [];
  for (const entry of all) {
    if (!seen.has(entry.modelId)) {
      seen.add(entry.modelId);
      deduped.push(entry);
    }
  }
  return deduped;
}

// ---------------------------------------------------------------------------
// Browse / filter
// ---------------------------------------------------------------------------

export async function browseModels(params: {
  brandId?: string;
  bodyType?: string;
  fuelType?: string;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  sort?: string;
  sortDirection?: string;
  page?: number;
  perPage?: number;
}): Promise<{ models: Model[]; total: number; totalPages: number }> {
  try {
    const result = await fetchBrowse({
      brand_id: params.brandId ? parseBrandId(params.brandId) : undefined,
      body_style_code: params.bodyType?.toLowerCase(),
      fuel_type: params.fuelType,
      min_price: params.minPrice,
      max_price: params.maxPrice,
      is_new: params.isNew,
      sort: params.sort,
      sort_direction: params.sortDirection,
      page: params.page,
      per_page: params.perPage,
    });
    const models = (result.items ?? []).map((item) =>
      mapSearchItemToModel(item)
    );
    return { models, total: result.total ?? 0, totalPages: result.total_pages ?? 1 };
  } catch {
    return { models: [], total: 0, totalPages: 0 };
  }
}

// Client-side filter/sort (for compatibility with existing pages that pass FilterState)
export { filterModels, sortModels } from "./helpers";

// ---------------------------------------------------------------------------
// Compare
// ---------------------------------------------------------------------------

export async function getCompareTrims(ids: string[]): Promise<Trim[]> {
  const numIds = ids.map(Number).filter((n) => !isNaN(n));
  if (numIds.length === 0) return [];
  try {
    const apiTrims = await fetchCompareTrims(numIds);
    return apiTrims.map(mapApiTrimToTrim);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Collections / Lifestyle (API-driven via home endpoint)
// ---------------------------------------------------------------------------

export async function getModelsByLifestyleCollection(
  collectionId: string
): Promise<Model[]> {
  // Collections come from the home endpoint; refetch and find the right one
  const home = await getHomePageData();
  const collection = home.collections.find((c) => c.id === collectionId);
  if (!collection) return [];

  // Fetch each model by ID
  const models = await Promise.all(
    collection.modelIds.map((id) => getModelById(id))
  );
  return models.filter((m): m is Model => m !== undefined);
}

export async function getCollectionById(
  id: string
): Promise<LifestyleCollection | undefined> {
  const home = await getHomePageData();
  return home.collections.find((c) => c.id === id);
}

// ---------------------------------------------------------------------------
// Branches (not in API yet, return empty)
// ---------------------------------------------------------------------------

export function getBranchesForModel(_modelId: string) {
  return [];
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export async function submitLeadForm(input: {
  fullName: string;
  phone: string;
  email: string;
  brandName: string;
  modelName: string;
  trimName: string;
  variantName?: string;
  contactMethod: string;
  preferredTime: string;
  notes?: string;
}): Promise<{ id: number }> {
  const apiInput: ApiCreateLeadInput = {
    full_name: input.fullName,
    phone: input.phone,
    email: input.email,
    brand_name: input.brandName,
    model_name: input.modelName,
    trim_name: input.trimName,
    variant_name: input.variantName,
    contact_method: input.contactMethod,
    preferred_time: input.preferredTime,
    notes: input.notes,
  };
  return apiSubmitLead(apiInput);
}
