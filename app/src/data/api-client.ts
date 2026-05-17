// API Client -- HTTP layer for the New Cars Catalog Service public endpoints.
// All methods return typed responses. The base URL is configured via
// NEXT_PUBLIC_API_BASE_URL env var.

import type {
  ApiEnvelope,
  ApiBrand,
  ApiBrandEditorialResponse,
  ApiHomeResponse,
  ApiModel,
  ApiModelAggregateSpecs,
  ApiTrim,
  ApiTrimVariant,
  ApiEquipmentItem,
  ApiTrimPackageAvailability,
  ApiSearchResult,
  ApiSearchSuggestion,
  ApiCatalogNode,
  ApiCreateLeadInput,
  ApiCreateLeadResponse,
  ApiAttributeDefinition,
  ApiBrowseParams,
  ApiSearchParams,
  ApiTrimListParams,
} from "./api-types";

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  // Remove trailing slash
  return url.replace(/\/+$/, "");
}

function buildQuery(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (entries.length === 0) return "";
  const qs = entries
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return `?${qs}`;
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${res.statusText} - ${text}`);
  }

  return res.json();
}

// Unwrap an ApiEnvelope, returning the data field
async function fetchEnvelope<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const envelope = await apiFetch<ApiEnvelope<T>>(path, options);
  if (envelope.data !== undefined) return envelope.data;
  // Some endpoints return data directly (arrays)
  return envelope as unknown as T;
}

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------

export async function fetchHome(): Promise<ApiHomeResponse> {
  return fetchEnvelope<ApiHomeResponse>("/v1/public/home");
}

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

export async function fetchBrands(): Promise<ApiBrand[]> {
  return fetchEnvelope<ApiBrand[]>("/v1/public/brands");
}

export async function fetchBrand(brandId: number): Promise<ApiBrand> {
  return fetchEnvelope<ApiBrand>(`/v1/public/brands/${brandId}`);
}

export async function fetchBrandEditorial(
  brandId: number
): Promise<ApiBrandEditorialResponse> {
  return fetchEnvelope<ApiBrandEditorialResponse>(
    `/v1/public/brands/${brandId}/editorial`
  );
}

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

export async function fetchBrandCatalog(
  brandId: number
): Promise<ApiCatalogNode[]> {
  return fetchEnvelope<ApiCatalogNode[]>(
    `/v1/public/brands/${brandId}/catalog`
  );
}

export async function fetchCatalogNode(
  nodeId: number
): Promise<ApiCatalogNode> {
  return fetchEnvelope<ApiCatalogNode>(
    `/v1/public/catalog/nodes/${nodeId}`
  );
}

export async function fetchCatalogNodeChildren(
  nodeId: number
): Promise<ApiCatalogNode[]> {
  return fetchEnvelope<ApiCatalogNode[]>(
    `/v1/public/catalog/nodes/${nodeId}/children`
  );
}

export async function fetchCatalogNodeModels(
  nodeId: number
): Promise<ApiEnvelope> {
  return fetchEnvelope<ApiEnvelope>(
    `/v1/public/catalog/nodes/${nodeId}/models`
  );
}

// ---------------------------------------------------------------------------
// Models
// ---------------------------------------------------------------------------

export async function fetchModel(modelId: number): Promise<ApiModel> {
  return fetchEnvelope<ApiModel>(`/v1/public/models/${modelId}`);
}

export async function fetchModelAggregateSpecs(
  modelId: number
): Promise<ApiModelAggregateSpecs> {
  return fetchEnvelope<ApiModelAggregateSpecs>(
    `/v1/public/models/${modelId}/aggregate-specs`
  );
}

export async function fetchModelFilters(
  modelId: number
): Promise<ApiAttributeDefinition[]> {
  return fetchEnvelope<ApiAttributeDefinition[]>(
    `/v1/public/models/${modelId}/filters`
  );
}

// ---------------------------------------------------------------------------
// Trims
// ---------------------------------------------------------------------------

export async function fetchModelTrims(
  modelId: number,
  params?: ApiTrimListParams
): Promise<ApiTrim[]> {
  const qs = params ? buildQuery(params as Record<string, unknown>) : "";
  return fetchEnvelope<ApiTrim[]>(
    `/v1/public/models/${modelId}/trims${qs}`
  );
}

export async function fetchTrimSearch(
  modelId: number,
  body: Record<string, unknown>
): Promise<{ data: ApiTrim[]; pagination: { page: number; per_page: number; total: number; total_pages: number } }> {
  const envelope = await apiFetch<ApiEnvelope<ApiTrim[]>>(
    `/v1/public/models/${modelId}/trim-search`,
    { method: "POST", body: JSON.stringify(body) }
  );
  return {
    data: envelope.data ?? [],
    pagination: envelope.pagination ?? { page: 1, per_page: 20, total: 0, total_pages: 0 },
  };
}

export async function fetchTrim(trimId: number): Promise<ApiTrim> {
  return fetchEnvelope<ApiTrim>(`/v1/public/trims/${trimId}`);
}

export async function fetchTrimEquipment(
  trimId: number,
  category?: string
): Promise<ApiEquipmentItem[]> {
  const path = category
    ? `/v1/public/trims/${trimId}/equipment/${encodeURIComponent(category)}`
    : `/v1/public/trims/${trimId}/equipment`;
  return fetchEnvelope<ApiEquipmentItem[]>(path);
}

export async function fetchTrimPackages(
  trimId: number
): Promise<ApiTrimPackageAvailability[]> {
  return fetchEnvelope<ApiTrimPackageAvailability[]>(
    `/v1/public/trims/${trimId}/packages`
  );
}

export async function fetchTrimVariants(
  trimId: number
): Promise<ApiTrimVariant[]> {
  return fetchEnvelope<ApiTrimVariant[]>(
    `/v1/public/trims/${trimId}/variants`
  );
}

export async function fetchCompareTrims(
  ids: number[]
): Promise<ApiTrim[]> {
  return fetchEnvelope<ApiTrim[]>(
    `/v1/public/compare/trims?ids=${ids.join(",")}`
  );
}

// ---------------------------------------------------------------------------
// Search & Browse
// ---------------------------------------------------------------------------

export async function fetchBrowse(
  params: ApiBrowseParams
): Promise<ApiSearchResult> {
  const qs = buildQuery(params as Record<string, unknown>);
  return fetchEnvelope<ApiSearchResult>(`/v1/public/browse${qs}`);
}

export async function fetchSearch(
  params: ApiSearchParams
): Promise<ApiSearchResult> {
  const qs = buildQuery(params as Record<string, unknown>);
  return fetchEnvelope<ApiSearchResult>(`/v1/public/search${qs}`);
}

export async function fetchSearchSuggestions(
  q: string
): Promise<ApiSearchSuggestion[]> {
  const qs = buildQuery({ q });
  return fetchEnvelope<ApiSearchSuggestion[]>(
    `/v1/public/search/suggestions${qs}`
  );
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export async function submitLead(
  input: ApiCreateLeadInput
): Promise<ApiCreateLeadResponse> {
  return fetchEnvelope<ApiCreateLeadResponse>("/v1/public/leads", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
