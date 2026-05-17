// API Types -- matches swagger v2 definitions (snake_case from the backend)
// These types represent the raw shapes returned by the New Cars Catalog Service API.

// ============ Response Envelope ============

export interface ApiEnvelope<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiErrorBody;
  meta?: Record<string, unknown>;
  pagination?: ApiPagination;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiPagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

// ============ Brands ============

export interface ApiBrand {
  id: number;
  code: string;
  slug: string;
  name_en: string;
  name_ar: string;
  tagline_en: string;
  tagline_ar: string;
  logo_url: string;
  logo_key: string;
  logo_dark_url: string;
  logo_dark_key: string;
  banner_url: string;
  banner_key: string;
  country_of_origin: string;
  country_of_manufacturing: string;
  hero_media_type: string;
  hero_media_url: string;
  hero_media_key: string;
  hero_gradient: string;
  hero_media: ApiMediaRef;
  editorial: ApiBrandEditorial;
  editorial_images: ApiBrandEditorialImages;
  editorial_stats: Record<string, unknown>;
  service_links: Record<string, unknown>;
  model_count: number;
  is_featured: boolean;
  sort_order: number;
  status: string;
  metadata: Record<string, unknown>;
  story_en: string;
  story_ar: string;
  sustainability_en: string;
  sustainability_ar: string;
  heritage_title_en: string;
  heritage_title_ar: string;
  heritage_description_en: string;
  heritage_description_ar: string;
  heritage_founded: string;
  heritage_milestone_en: string;
  heritage_milestone_ar: string;
  heritage_image_url: string;
  heritage_image_key: string;
  innovation_title_en: string;
  innovation_title_ar: string;
  innovation_description_en: string;
  innovation_description_ar: string;
  innovation_image_url: string;
  innovation_image_key: string;
  created_at: string;
  updated_at: string;
}

export interface ApiMediaRef {
  type: string;
  url: string;
}

export interface ApiBrandEditorial {
  hero_gradient: string;
  story_en: string;
  story_ar: string;
  sustainability_en: string;
  sustainability_ar: string;
  heritage: ApiBrandHeritageEditorial;
  innovation: ApiBrandInnovationEditorial;
  stats: Record<string, unknown>;
  service_links: Record<string, unknown>;
}

export interface ApiBrandHeritageEditorial {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  founded: string;
  milestone_en: string;
  milestone_ar: string;
}

export interface ApiBrandInnovationEditorial {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
}

export interface ApiBrandEditorialImages {
  heritage: string;
  innovation: string;
}

export interface ApiBrandEditorialResponse {
  brand_id: number;
  hero_media: ApiMediaRef;
  editorial: ApiBrandEditorial;
  editorial_images: ApiBrandEditorialImages;
}

// ============ Home ============

export interface ApiHomeResponse {
  hero: ApiHomeHero;
  featured_brands: ApiHomeBrandCard[];
  whats_new: ApiHomeModelCard[];
  featured_models: ApiHomeModelCard[];
  collections: ApiHomeCollectionCard[];
}

export interface ApiHomeHero {
  media_type: string;
  media_url: string;
}

export interface ApiHomeBrandCard {
  id: number;
  code: string;
  slug: string;
  name_en: string;
  name_ar: string;
  tagline_en: string;
  tagline_ar: string;
  logo_url: string;
  banner_url: string;
  model_count: number;
  is_featured: boolean;
  sort_order: number;
}

export interface ApiHomeModelCard {
  id: number;
  code: string;
  slug: string;
  name_en: string;
  name_ar: string;
  brand_id: number;
  brand_slug: string;
  brand_name_en: string;
  brand_name_ar: string;
  body_style_code: string;
  family_code: string;
  model_year: number;
  starting_price: number;
  currency: string;
  trim_count: number;
  hero_image_url: string;
  is_new: boolean;
  is_updated: boolean;
  is_featured: boolean;
  segment_order: number;
  specs_summary: ApiSpecsSummary;
}

export interface ApiSpecsSummary {
  engine_range: string;
  hp_range: string;
  fuel_types: string[];
}

export interface ApiHomeCollectionCard {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  image_url: string;
  model_ids: number[];
}

// ============ Models ============

export interface ApiModel {
  id: number;
  code: string;
  slug: string;
  name_en: string;
  name_ar: string;
  brand_id: number;
  body_style_code: string;
  family_code: string;
  sub_brand_code: string;
  model_year: number;
  starting_price: number;
  currency: string;
  trim_count: number;
  hero_image_url: string;
  hero_image_key: string;
  is_new: boolean;
  is_updated: boolean;
  is_featured: boolean;
  segment_order: number;
  short_description_en: string;
  short_description_ar: string;
  primary_node_id: number;
  publish_state: string;
  status: string;
  specs_summary: ApiSpecsSummary;
  images: ApiModelImages;
  gallery_images: ApiModelImage[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ApiModelImages {
  front: string;
  rear: string;
  side: string;
  detail: string;
  hero: string;
}

export interface ApiModelImage {
  id: number;
  image_url: string;
  image_key: string;
  category: string;
  alt_en: string;
  alt_ar: string;
  sort_order: number;
}

export interface ApiModelAggregateSpecs {
  price_range: ApiFloatRange;
  hp_range: ApiIntRange;
  torque_range: ApiIntRange;
  fuel_types: string[];
  transmissions: string[];
  drive_types: string[];
  seating_range: ApiIntRange;
  displacement_range: ApiFloatRange;
  dimension_ranges: ApiDimensionRanges;
  equipment_map: Record<string, string>;
  trim_count: number;
}

export interface ApiFloatRange {
  min: number;
  max: number;
}

export interface ApiIntRange {
  min: number;
  max: number;
}

export interface ApiDimensionRanges {
  length: ApiFloatRange;
  width: ApiFloatRange;
  height: ApiFloatRange;
  wheelbase: ApiFloatRange;
}

// ============ Trims ============

export interface ApiTrim {
  id: number;
  variant_code: string;
  slug: string;
  display_name_en: string;
  display_name_ar: string;
  product_line_id: number;
  starting_price: number;
  currency: string;
  engine_summary: string;
  engine_code: string;
  horsepower: number;
  torque: number;
  fuel_type: string;
  powertrain_type: string;
  transmission: string;
  drivetrain: string;
  performance_line: string;
  trim_badge: string;
  seats: number;
  doors: number;
  battery_capacity: number;
  electric_range: number;
  spec_region: string;
  availability_status: string;
  is_default: boolean;
  sort_order: number;
  hero_image_url: string;
  hero_image_key: string;
  lead_form_url: string;
  website_url: string;
  specs: ApiTrimSpecs;
  images: ApiTrimImage[];
  colors: ApiTrimColor[];
  attributes: ApiTrimAttribute[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ApiTrimSpecs {
  engine_type: string;
  displacement: number;
  cylinders: number;
  zero_to_hundred: number;
  top_speed: number;
  fuel_economy_city: number;
  fuel_economy_highway: number;
  fuel_economy_combined: number;
  transmission: string;
  drive_type: string;
  length_mm: number;
  width_mm: number;
  height_mm: number;
  wheelbase_mm: number;
  trunk_volume_liters: number;
  curb_weight_kg: number;
  fuel_tank_liters: number;
  seating_capacity: number;
  warranty: string;
  spec_region: string;
}

export interface ApiTrimImage {
  id: number;
  image_url: string;
  image_key: string;
  category: string;
  alt_en: string;
  alt_ar: string;
  sort_order: number;
}

export interface ApiTrimColor {
  id: number;
  name_en: string;
  name_ar: string;
  hex_code: string;
  swatch_url: string;
  swatch_key: string;
  image_url: string;
  image_key: string;
  sort_order: number;
}

export interface ApiTrimAttribute {
  code: string;
  label_en: string;
  label_ar: string;
  category: string;
  unit: string;
  value: unknown;
  sort_order: number;
}

// ============ Trim Variants ============

export interface ApiTrimVariant {
  id: number;
  trim_id: number;
  code: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price: number;
  currency: string;
  hero_image_url: string;
  hero_image_key: string;
  images: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ============ Equipment ============

export interface ApiEquipmentItem {
  id: number;
  trim_id: number;
  name_en: string;
  name_ar: string;
  category: string;
  is_standard: boolean;
  is_optional: boolean;
  sort_order: number;
}

// ============ Packages ============

export interface ApiPackageDefinition {
  id: number;
  brand_id: number;
  code: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  package_type: string;
  thumbnail_url: string;
  thumbnail_key: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ApiTrimPackageAvailability {
  id: number;
  trim_id: number;
  package_id: number;
  is_standard: boolean;
  is_optional: boolean;
  constraints_json: Record<string, unknown>;
  package: ApiPackageDefinition;
  created_at: string;
  updated_at: string;
}

// ============ Search ============

export interface ApiSearchResult {
  items: ApiSearchItem[];
  facets: Record<string, ApiSearchFacet[]>;
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  did_you_mean: string;
}

export interface ApiSearchItem {
  id: number;
  type: string; // "model" or "trim"
  slug: string;
  name_en: string;
  name_ar: string;
  hero_image_url: string;
  hero_image_key: string;
  score: number;
  // Model fields
  family_code: string;
  body_style_code: string;
  model_year: number;
  is_new: boolean;
  is_updated: boolean;
  is_featured: boolean;
  segment_order: number;
  trim_count: number;
  min_price: number;
  max_price: number;
  currency: string;
  specs_summary: ApiSpecsSummary;
  trims: ApiSearchTrimSummary[];
  // Trim fields
  price: number;
  horsepower: number;
  engine_summary: string;
  drivetrain: string;
  powertrain_type: string;
  spec_region: string;
  trim_badge: string;
  is_default: boolean;
  model: ApiSearchModelRef;
  // Common
  brand: ApiSearchBrand;
  highlights: Record<string, string>;
}

export interface ApiSearchBrand {
  id: number;
  slug: string;
  name_en: string;
  name_ar: string;
  logo_url: string;
  country_of_origin: string;
  manufacturing_countries: string[];
}

export interface ApiSearchModelRef {
  id: number;
  slug: string;
  name_en: string;
  name_ar: string;
  model_year: number;
  hero_image_key: string;
}

export interface ApiSearchTrimSummary {
  id: number;
  slug: string;
  name_en: string;
  price: number;
  trim_badge: string;
  is_default: boolean;
}

export interface ApiSearchFacet {
  value: string;
  count: number;
}

export interface ApiSearchSuggestion {
  id: number;
  type: string; // "brand" | "model" | "trim"
  slug: string;
  text: string;
  subtitle: string;
}

// ============ Catalog ============

export interface ApiCatalogNode {
  id: number;
  brand_id: number;
  parent_id: number;
  code: string;
  slug: string;
  name_en: string;
  name_ar: string;
  node_kind: string;
  level: number;
  path: string;
  is_leaf: boolean;
  child_count: number;
  sort_order: number;
  status: string;
  thumbnail_url: string;
  thumbnail_key: string;
  banner_url: string;
  banner_key: string;
  children: ApiCatalogNode[];
  breadcrumbs: ApiCatalogBreadcrumb[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ApiCatalogBreadcrumb {
  id: number;
  slug: string;
  name_en: string;
  name_ar: string;
  node_kind: string;
  level: number;
}

// ============ Leads ============

export interface ApiCreateLeadInput {
  full_name: string;
  phone: string;
  email: string;
  brand_name: string;
  model_name: string;
  trim_name: string;
  variant_name?: string;
  contact_method: string;
  preferred_time: string;
  notes?: string;
}

export interface ApiCreateLeadResponse {
  id: number;
}

// ============ Attribute Definitions ============

export interface ApiAttributeDefinition {
  code: string;
  label_en: string;
  label_ar: string;
  category: string;
  scope: string;
  unit: string;
  sort_order: number;
}

// ============ Browse Filters ============

export interface ApiBrowseParams {
  brand_id?: number;
  family_code?: string;
  body_style_code?: string;
  model_year?: number;
  fuel_type?: string;
  drivetrain?: string;
  powertrain_type?: string;
  transmission?: string;
  seats?: number;
  doors?: number;
  spec_region?: string;
  is_new?: boolean;
  featured?: boolean;
  min_price?: number;
  max_price?: number;
  sort?: string;
  sort_direction?: string;
  page?: number;
  per_page?: number;
}

export interface ApiSearchParams extends ApiBrowseParams {
  q?: string;
  type?: string; // "product_line" | "variant"
  performance_line?: string;
  include_facets?: string;
}

export interface ApiTrimListParams {
  powertrain_type?: string;
  fuel_type?: string;
  drivetrain?: string;
  transmission?: string;
  performance_line?: string;
  availability_status?: string;
  min_price?: number;
  max_price?: number;
  seats?: number;
  doors?: number;
  spec_region?: string;
  page?: number;
  per_page?: number;
}
