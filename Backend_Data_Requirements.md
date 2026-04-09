**BACKEND DATA REQUIREMENTS**

**4Sale New Cars Platform**

This document specifies every data entity, field, relationship, and endpoint the backend must provide to power the frontend application. It is derived from an exhaustive audit of every page, component, filter, sort, form, and computed value in the current codebase.

Nothing in this document is optional unless explicitly marked. If a field is listed, the frontend consumes it.

Prepared by Youssef Emad | April 2026

---

## Table of Contents

1. [Entity Definitions](#1-entity-definitions)
2. [Enumerations](#2-enumerations)
3. [Entity Relationships](#3-entity-relationships)
4. [Page-by-Page Data Requirements](#4-page-by-page-data-requirements)
5. [API Endpoints](#5-api-endpoints)
6. [Filtering & Sorting Logic](#6-filtering--sorting-logic)
7. [Computed & Derived Values](#7-computed--derived-values)
8. [Form Submissions (Write Operations)](#8-form-submissions-write-operations)
9. [Constants & Configuration](#9-constants--configuration)
10. [Image & Media Requirements](#10-image--media-requirements)
11. [Search Requirements](#11-search-requirements)
12. [URL Parameter Contracts](#12-url-parameter-contracts)

---

## 1. Entity Definitions

### 1.1 Brand

Represents a car manufacturer or marque.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Unique identifier (slug format, e.g., `"mercedes"`, `"bmw"`) |
| `name` | string | Yes | Display name (e.g., `"Mercedes-Benz"`) |
| `logoUrl` | string | Yes | URL to brand logo image |
| `modelCount` | integer | Yes | Total number of active models for this brand |
| `featured` | boolean | Yes | Whether this brand is a paying/featured brand (controls homepage Featured Brands strip) |
| `tagline` | string | No | Short marketing tagline for featured brands (e.g., `"The Best or Nothing"`) |

**Where used:**
- Homepage: Browse by Brand grid (all brands), Featured Brands strip (featured=true only)
- Browse page: Brand filter chips, brand hero overlay
- Search page: Popular Brands grid
- Model detail page: Brand name in breadcrumb, hero, CTAs
- Compare page: Brand name per vehicle column

---

### 1.2 Model

Represents a distinct product line within a brand. Different body styles of the same nameplate are separate Models (e.g., C-Class Sedan and C-Class Cabriolet).

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Unique identifier (slug format, e.g., `"merc-c-sedan"`) |
| `brandId` | string | Yes | Foreign key to Brand |
| `name` | string | Yes | Display name (e.g., `"C-Class Sedan"`) |
| `bodyType` | BodyType enum | Yes | One of: Sedan, SUV, Hatchback, Coupe, Pickup, Van, Convertible |
| `year` | integer | Yes | Model year (e.g., `2025`) |
| `startingPrice` | number | Yes | Lowest trim price in KWD (e.g., `18500`) |
| `trimCount` | integer | Yes | Number of available trims |
| `isNew` | boolean | Yes | Whether the model is newly launched (within 90 days) |
| `isUpdated` | boolean | Yes | Whether the model has been recently updated/refreshed |
| `specsSummary` | ModelSpecsSummary | Yes | Aggregated specs across all trims (see below) |
| `imageUrl` | string | Yes | Primary hero/card image URL |

**ModelSpecsSummary** (nested object):

| Field | Type | Required | Description |
|---|---|---|---|
| `engineRange` | string | Yes | Engine displacement range across trims (e.g., `"1.5L - 2.0L Turbo"`) |
| `hpRange` | string | Yes | Horsepower range across trims (e.g., `"204 - 408 hp"`) |
| `fuelTypes` | FuelType[] | Yes | Array of unique fuel types available across all trims |

**Where used:**
- Homepage: Popular Models, What's New, Lifestyle Collections, Featured Brands (top model)
- Browse page: Model cards in grid/carousel, result count, pagination
- Search page: Search results
- Model detail page: Hero section, overview panel
- Compare page: Vehicle columns
- All Trims page: Page title, breadcrumb

---

### 1.3 Trim

Represents a specific engine/powertrain variant of a model (e.g., C 200, C 300).

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Unique identifier (e.g., `"merc-c200"`) |
| `modelId` | string | Yes | Foreign key to Model |
| `name` | string | Yes | Display name (e.g., `"C 200"`) |
| `price` | number | Yes | Base price in KWD |
| `engineSummary` | string | Yes | Human-readable engine description (e.g., `"2.0L 4-cyl Turbo"`) |
| `horsepower` | integer | Yes | Peak horsepower |
| `torque` | integer | Yes | Peak torque in Nm |
| `fuelType` | FuelType enum | Yes | Fuel type for this trim |
| `images` | string[] | Yes | Array of image URLs (minimum 3 recommended for hero carousel) |
| `variants` | TrimVariant[] | Yes | Array of variant objects (can be empty) |
| `specs` | Spec | Yes | Full technical specification object (see below) |
| `equipment` | Equipment[] | Yes | Array of equipment items |

**Where used:**
- Model detail page: Trim selector, specs panel, equipment tabs, pricing breakdown, compare trims table
- All Trims page: Trim cards with full details
- Compare page: Primary comparison entity (each column = one trim)
- Browse page: Sorting by horsepower uses max trim HP per model

---

### 1.4 TrimVariant

Represents a factory-defined styling/equipment package within a trim (e.g., AMG Line, Avantgarde).

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Unique identifier (e.g., `"merc-c200-amg"`) |
| `trimId` | string | Yes | Foreign key to Trim |
| `name` | string | Yes | Display name (e.g., `"AMG Line"`) |
| `price` | number | Yes | Price in KWD for this variant |
| `description` | string | Yes | Short description of what this variant adds |
| `images` | string[] | No | Variant-specific images (if different from base trim). When present, displayed as an inline preview strip below the variant selector. |

**Where used:**
- Model detail page: Variant selector pills, image preview strip, price updates, specs context
- All Trims page: Variant chips on each trim card
- Lead form: Variant name auto-captured in submission context
- Compare page: Variant context in vehicle column header

---

### 1.5 Spec

Full technical specification for a trim. Every field is displayed on the model detail page and used in the comparison table.

| Field | Type | Unit | Required | Description |
|---|---|---|---|---|
| `engineType` | string | -- | Yes | Engine description (e.g., `"2.0L Inline-4 Turbo"`) |
| `displacement` | number | L | Yes | Engine displacement in liters (e.g., `2.0`) |
| `cylinders` | integer | -- | Yes | Number of cylinders (e.g., `4`). Used in filters. |
| `horsepower` | integer | hp | Yes | Peak horsepower |
| `torque` | integer | Nm | Yes | Peak torque |
| `zeroToHundred` | number | s | Yes | 0-100 km/h time in seconds (e.g., `7.3`) |
| `topSpeed` | integer | km/h | Yes | Top speed |
| `fuelEconomyCity` | number | L/100km | Yes | City fuel consumption. `0` for electric vehicles. |
| `fuelEconomyHighway` | number | L/100km | Yes | Highway fuel consumption. `0` for electric vehicles. |
| `fuelEconomyCombined` | number | L/100km | Yes | Combined fuel consumption. `0` for electric vehicles. |
| `transmission` | TransmissionType enum | -- | Yes | Automatic, Manual, or CVT |
| `driveType` | DriveType enum | -- | Yes | FWD, RWD, AWD, or 4WD |
| `lengthMm` | integer | mm | Yes | Vehicle length |
| `widthMm` | integer | mm | Yes | Vehicle width |
| `heightMm` | integer | mm | Yes | Vehicle height |
| `wheelbaseMm` | integer | mm | Yes | Wheelbase |
| `trunkVolumeLiters` | integer | L | Yes | Trunk/cargo volume |
| `curbWeightKg` | integer | kg | Yes | Curb weight |
| `fuelTankLiters` | integer | L | Yes | Fuel tank capacity. `0` for electric vehicles (frontend displays battery capacity label instead). |
| `seatingCapacity` | integer | seats | Yes | Number of seats. Used in filters. |
| `warranty` | string | -- | Yes | Warranty description (e.g., `"5 years / 100,000 km"`) |
| `specRegion` | SpecRegion enum | -- | Yes | GCC, US, or European. Used in filters and displayed as a badge. |

**Where used:**
- Model detail page: Key Specs Panel (all 21 fields displayed with units), Compare Trims table
- Compare page: Engine & Performance section, Dimensions & Capacity section, Fuel Economy section, Overview section
- Browse page: Filtering by transmission, drive type, seating, spec region (traverses model -> trims -> specs)
- All Trims page: Key specs per trim card (HP, torque, 0-100, fuel economy)

---

### 1.6 Equipment

Represents a single equipment feature/option on a trim.

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Equipment name (e.g., `"Adaptive Cruise Control"`) |
| `category` | EquipmentCategory enum | Yes | Safety, Comfort, Technology, Exterior, or Interior |
| `isStandard` | boolean | Yes | `true` = included standard, `false` = available as option |

**Where used:**
- Model detail page: Equipment tabs (grouped by category), "Show differences from base trim" filter
- Compare page: Equipment Highlights section (10 key features checked across vehicles)

**Critical: The comparison page checks for these 10 specific equipment names.** The backend must use these exact strings (or the frontend list must be configurable):

1. Adaptive Cruise Control
2. Lane Departure Warning
3. Blind Spot Monitor
4. 360-Degree Camera
5. Panoramic Sunroof
6. Leather Seats
7. Apple CarPlay
8. Android Auto
9. Wireless Charging
10. LED Headlights

For each of these, the comparison table displays one of three states:
- **Standard** (green check): Equipment exists with `isStandard: true`
- **Optional** (amber label): Equipment exists with `isStandard: false`
- **Not Available** (red minus): Equipment name not found in the trim's equipment array

---

### 1.7 Branch

Represents a physical dealership/showroom location.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Unique identifier |
| `brandId` | string | Yes | Foreign key to Brand (which brand this branch serves) |
| `name` | string | Yes | Branch name (e.g., `"4Sale New Cars - Shuwaikh"`) |
| `location` | string | Yes | Human-readable address (e.g., `"Shuwaikh Industrial, Block 1"`) |
| `phone` | string | Yes | Phone number in international format (e.g., `"+965 2222 1111"`). Used for tap-to-call on mobile. |
| `mapUrl` | string | Yes | Google Maps URL with coordinates for "Get Directions" link |

**Where used:**
- Model detail page: Branches section (all branches for the model's brand), "Contact Dealership" scrolls here
- Mobile sticky footer: First branch's phone number used for tap-to-call button

**Current behavior:** `getBranchesForModel()` returns ALL branches regardless of model. The backend should return branches relevant to the model's brand.

---

### 1.8 LifestyleCollection

Represents an editorially curated grouping of models.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Unique identifier (slug format, e.g., `"family-suv"`) |
| `title` | string | Yes | Display title (e.g., `"Family-Friendly SUVs"`) |
| `description` | string | Yes | Short description (1-2 sentences) |
| `imageUrl` | string | Yes | Collection hero image URL |
| `modelIds` | string[] | Yes | Array of Model IDs included in this collection |

**Where used:**
- Homepage: Explore by Lifestyle section (card per collection, `modelIds.length` shown as count)
- Browse page: `?collection={id}` pre-filters to collection's models

**Current collections (4):**
1. `"family-suv"` -- Family-Friendly SUVs (7 models)
2. `"performance"` -- Performance & Sport (5 models)
3. `"luxury-daily"` -- Luxury Daily Drivers (5 models)
4. `"first-car"` -- First-Car Picks Under 8,000 KWD (7 models)

---

## 2. Enumerations

The backend must support these exact enum values. They are used in filters, display badges, and sort logic.

### BodyType
| Value | Display Label | UI Color |
|---|---|---|
| `"Sedan"` | Sedan | Blue (`#1A56DB`) |
| `"SUV"` | SUV | Green (`#10B981`) |
| `"Hatchback"` | Hatchback | Amber (`#F59E0B`) |
| `"Coupe"` | Coupe | Red (`#EF4444`) |
| `"Pickup"` | Pickup | Gray (`#64748B`) |
| `"Van"` | Van | Cyan (`#06B6D4`) |
| `"Convertible"` | Convertible | Purple (`#8B5CF6`) |

### FuelType
| Value | Display Label |
|---|---|
| `"Petrol"` | Petrol |
| `"Diesel"` | Diesel |
| `"Hybrid"` | Hybrid |
| `"PHEV"` | PHEV |
| `"Electric"` | Electric |

### TransmissionType
| Value | Display Label |
|---|---|
| `"Automatic"` | Automatic |
| `"Manual"` | Manual |
| `"CVT"` | CVT |

### DriveType
| Value | Display Label | Filter Grouping |
|---|---|---|
| `"FWD"` | FWD | Standalone |
| `"RWD"` | RWD | Standalone |
| `"AWD"` | AWD | Grouped with 4WD in filter as "AWD/4WD" |
| `"4WD"` | 4WD | Grouped with AWD in filter as "AWD/4WD" |

**Important:** The filter UI presents AWD and 4WD as a single option "AWD/4WD". When selected, both `"AWD"` and `"4WD"` values must match.

### SpecRegion
| Value | Display Label |
|---|---|
| `"GCC"` | GCC |
| `"US"` | US |
| `"European"` | European |

### EquipmentCategory
| Value | Display Label |
|---|---|
| `"Safety"` | Safety |
| `"Comfort"` | Comfort |
| `"Technology"` | Technology |
| `"Exterior"` | Exterior |
| `"Interior"` | Interior |

---

## 3. Entity Relationships

```
Brand (1) ──────< (many) Model
Brand (1) ──────< (many) Branch
Model (1) ──────< (many) Trim
Trim  (1) ──────< (many) TrimVariant
Trim  (1) ──────── (1)   Spec
Trim  (1) ──────< (many) Equipment
LifestyleCollection (1) ──< (many) Model  [many-to-many via modelIds array]
```

**Traversals the frontend performs:**
1. `Model -> Brand`: Look up brand by `model.brandId` (used on every model card, detail page, compare page)
2. `Model -> Trims`: Get all trims by `model.id` (model detail page, all trims page, sorting by HP)
3. `Trim -> Model -> Brand`: Chain lookup for trim context (compare page, lead form)
4. `Brand -> Models`: Get all models by `brand.id` (browse page with brand filter, featured brands strip)
5. `LifestyleCollection -> Models`: Resolve `modelIds` array to model objects (homepage, browse page)
6. `Brand -> Branches`: Get branches by `brand.id` (model detail page branch section)
7. `Model -> Body Type -> Models`: Find models with same body type for "Similar Models" section

---

## 4. Page-by-Page Data Requirements

### 4.1 Homepage (`/`)

| Section | Data Needed | Query |
|---|---|---|
| Hero | Static content (hardcoded) | None |
| Featured Brands | All brands where `featured=true`, plus top model per brand | `brands.filter(featured)` + `getModelsByBrand(id)[0]` |
| Browse by Brand | All brands | All brands |
| Browse by Body Type | Count of models per body type | `getModelsByBodyType(type).length` for each of 7 types |
| Popular Models | First 8 models (ordered by popularity) | `models.slice(0, 8)` -- backend should provide a popularity-sorted list |
| Browse by Budget | No initial data (interactive widget) | None until "Show Results" navigates to browse |
| What's New | Models where `isNew=true` OR `isUpdated=true` | `getNewModels()` |
| Explore by Lifestyle | All 4 lifestyle collections with `modelIds.length` | All collections |

**Total entities loaded on homepage:** All brands, all models, all lifestyle collections.

---

### 4.2 Browse Page (`/browse`)

| Data Needed | Query |
|---|---|
| All models (for client-side filtering) | All models |
| All brands (for brand filter + hero) | All brands |
| All trims per model (for spec-level filtering) | All trims -- needed to filter by transmission, drive type, seating, spec region, and to sort by horsepower |
| Lifestyle collection (when `?collection` param set) | `getCollectionById(id)` |
| Brand hero images (when `?brand` param set) | Brand's model images for carousel |

**This is the most data-intensive page.** Currently loads all models and all trims upfront for client-side filtering. If the backend provides server-side filtering, only filtered results need to be returned.

---

### 4.3 Search Page (`/search`)

| Data Needed | Query |
|---|---|
| All brands | For Popular Brands grid |
| New/Updated models (max 6) | `getNewModels().slice(0, 6)` for Popular Right Now |
| Search results | `searchModels(query)` -- matches against brand name + model name + body type |

---

### 4.4 Model Detail Page (`/model/[id]`)

| Data Needed | Query |
|---|---|
| Single model by ID | `getModelById(id)` |
| Brand for this model | `getBrandById(model.brandId)` |
| All trims for this model | `getTrimsByModel(model.id)` -- includes full specs, equipment, variants, images |
| All branches for this model's brand | `getBranchesForModel(model.id)` |
| Similar models (same body type, different brand) | `models.filter(m.bodyType === model.bodyType && m.id !== model.id).slice(0, 6)` |
| All brands (for similar model cards) | Brand lookups for similar models |

**This page requires the deepest data:** full trim specs (25 fields each), full equipment lists, all variants with images, and branch data.

---

### 4.5 All Trims Page (`/model/[id]/trims`)

| Data Needed | Query |
|---|---|
| Single model by ID | `getModelById(id)` |
| Brand for this model | `getBrandById(model.brandId)` |
| All trims with specs and variants | `getTrimsByModel(model.id)` |

---

### 4.6 Compare Page (`/compare`)

| Data Needed | Query |
|---|---|
| Trims by ID (when `?trims` param) | `getTrimById(id)` for each trim ID |
| Models by ID (when `?ids` param) | `getModelById(id)` + `getTrimsByModel(id)[0]` for first trim |
| Brand per trim | Chain: `trim -> model -> brand` |
| Full specs per trim | `trim.specs` (all 25 fields) |
| Equipment per trim | `trim.equipment` (full array, checked against 10 key feature names) |

---

### 4.7 Brand Page (`/brand/[id]`)

Redirects to `/browse?brand={id}`. No additional data beyond what the browse page requires.

---

## 5. API Endpoints

Based on the data access patterns above, the backend should expose these endpoints (REST or GraphQL):

### Core Entity Endpoints

| Method | Endpoint | Description | Response |
|---|---|---|---|
| GET | `/api/brands` | List all brands | `Brand[]` |
| GET | `/api/brands/:id` | Single brand by ID | `Brand` |
| GET | `/api/models` | List all models (supports query params for filtering/sorting) | `Model[]` with pagination |
| GET | `/api/models/:id` | Single model with full detail | `Model` + `Trim[]` (with specs, equipment, variants) |
| GET | `/api/trims/:id` | Single trim with full detail | `Trim` (with specs, equipment, variants) |
| GET | `/api/branches` | List branches, filterable by brandId | `Branch[]` |
| GET | `/api/collections` | List all lifestyle collections | `LifestyleCollection[]` |
| GET | `/api/collections/:id` | Single collection with resolved models | `LifestyleCollection` + `Model[]` |
| GET | `/api/search?q={query}` | Full-text search across brands, models, body types | `Model[]` |

### Filtering & Sorting (on `/api/models`)

| Parameter | Type | Description |
|---|---|---|
| `brandId` | string | Filter by brand |
| `bodyType` | string | Filter by body type |
| `fuelType` | string (comma-separated) | Filter by fuel types |
| `minPrice` | number | Minimum starting price |
| `maxPrice` | number | Maximum starting price |
| `transmission` | string (comma-separated) | Filter by transmission types (requires trim-level check) |
| `driveType` | string (comma-separated) | Filter by drive types (requires trim-level check) |
| `seating` | string (comma-separated) | Filter by seating capacity (requires trim-level check) |
| `specRegion` | string (comma-separated) | Filter by spec region (requires trim-level check) |
| `isNew` | boolean | Filter to new/updated models only |
| `collectionId` | string | Filter to models in a specific lifestyle collection |
| `sort` | string | Sort order: `price-asc`, `price-desc`, `newest`, `popular`, `horsepower` |
| `page` | integer | Page number (default 1) |
| `limit` | integer | Items per page (default 12) |

### Write Endpoints

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| POST | `/api/leads` | Submit interest form | See Section 8 |

---

## 6. Filtering & Sorting Logic

### 6.1 Filter Logic (currently client-side)

Filters are applied as AND conditions across categories, OR within each category:

```
result = models.filter(model =>
  matchesPriceRange(model, filters.priceRange) AND
  matchesBodyType(model, filters.bodyTypes) AND        // OR within body types
  matchesFuelType(model, filters.fuelTypes) AND        // OR within fuel types, checks model.specsSummary.fuelTypes
  matchesBrand(model, filters.brandIds) AND            // OR within brands
  matchesTransmission(model, filters.transmissions) AND // OR within types, checks ANY trim's spec
  matchesDriveType(model, filters.driveTypes) AND      // OR within types, checks ANY trim's spec
  matchesSeating(model, filters.seatingCapacity) AND   // OR within values, checks ANY trim's spec
  matchesSpecRegion(model, filters.specRegions) AND    // OR within regions, checks ANY trim's spec
  matchesNew(model, filters.isNew)
)
```

**Important: Transmission, Drive Type, Seating, and Spec Region filters operate at the TRIM level.** A model matches if ANY of its trims match the filter criteria. This means the backend must be able to query trim-level spec fields when filtering models.

### 6.2 Drive Type Special Case

The filter UI groups AWD and 4WD together as "AWD/4WD". When this filter is selected, both `"AWD"` and `"4WD"` drive type values must match.

### 6.3 Seating Capacity Special Case

The filter option "8+" maps to the integer value `8`. Any seating capacity >= 8 should match.

### 6.4 Sort Logic

| Sort Key | Logic |
|---|---|
| `price-asc` | `model.startingPrice` ascending |
| `price-desc` | `model.startingPrice` descending |
| `newest` | Models with `isNew=true` first, then `isUpdated=true`, then rest |
| `popular` | By popularity score (currently undefined -- backend should provide a popularity metric, e.g., page views) |
| `horsepower` | Maximum `trim.horsepower` across all trims for each model, descending |

**Note:** The `horsepower` sort requires knowing the max HP across all trims for each model. The backend should either pre-compute this or support this sort server-side.

---

## 7. Computed & Derived Values

These values are currently computed on the frontend. The backend can either pre-compute them or provide the raw data for client-side computation.

### 7.1 Model-Level Aggregations

| Computed Field | Formula | Used Where |
|---|---|---|
| `startingPrice` | `MIN(trim.price)` across all trims | Model cards, browse page, homepage |
| `trimCount` | `COUNT(trims)` for model | Model cards, model detail page |
| `specsSummary.engineRange` | Range string of trim engine displacements | Model cards |
| `specsSummary.hpRange` | Range string of trim horsepower values | Model cards |
| `specsSummary.fuelTypes` | `DISTINCT(trim.fuelType)` across all trims | Model cards, fuel type filter |

### 7.2 Pricing Calculations (Model Detail Page)

| Calculation | Formula |
|---|---|
| Registration fee estimate | `basePrice * 0.02` (2%) |
| Insurance fee estimate | `basePrice * 0.035` (3.5%) |
| Total estimated price | `basePrice + registration + insurance` |
| Monthly installment | `(loanAmount * (monthlyRate * (1 + monthlyRate)^tenure)) / ((1 + monthlyRate)^tenure - 1)` where `monthlyRate = 0.039 / 12`, `loanAmount = basePrice - downPayment` |

These rates may need to be configurable via the backend rather than hardcoded.

### 7.3 Price Formatting

All prices displayed as: `{number.toLocaleString()} KWD` (e.g., `"18,500 KWD"`)

### 7.4 Budget Monthly Conversion

Homepage budget slider monthly mode: `price / 60` (simple division, not amortized)

---

## 8. Form Submissions (Write Operations)

### 8.1 Lead Form ("I'm Interested")

**Triggered from:** Model detail page (hero CTA + mobile sticky footer), Compare page (per vehicle)

**User-entered fields:**

| Field | Type | Required | Validation |
|---|---|---|---|
| `fullName` | string | Yes | Non-empty |
| `phone` | string | Yes | Non-empty, should validate Kuwait phone format |
| `email` | string | No | Valid email format if provided |
| `contactMethod` | enum | Yes | One of: `"Call"`, `"WhatsApp"`, `"Email"` |
| `preferredTime` | enum | No | One of: `"Morning"`, `"Afternoon"`, `"Evening"`, `"Anytime"` |
| `notes` | string | No | Free text |

**Auto-captured context (sent with submission):**

| Field | Type | Description |
|---|---|---|
| `brandName` | string | Brand of the vehicle being viewed |
| `modelName` | string | Model name |
| `trimName` | string | Currently selected trim name |
| `variantName` | string or null | Currently selected variant name (if any) |
| `sourcePage` | string | Page where form was submitted (e.g., `"model-detail"`, `"compare"`) |
| `timestamp` | ISO datetime | Time of submission |

**Success response:** The frontend displays a confirmation message. No complex response payload needed.

---

## 9. Constants & Configuration

These values are currently hardcoded in the frontend. Consider making them configurable via a backend config endpoint.

### 9.1 Price & Finance Constants

| Constant | Current Value | Used Where |
|---|---|---|
| `PRICE_MIN` | 3,000 KWD | Budget slider, price filter minimum |
| `PRICE_MAX` | 80,000 KWD | Budget slider, price filter maximum |
| `PRICE_STEP` | 500 KWD | Slider increment |
| `REGISTRATION_FEE_RATE` | 2% | Pricing breakdown |
| `INSURANCE_FEE_RATE` | 3.5% | Pricing breakdown |
| `INTEREST_RATE` | 3.9% annual | Monthly installment calculator |
| `DOWN_PAYMENT_MIN` | 10% | Installment calculator |
| `DOWN_PAYMENT_MAX` | 50% | Installment calculator |
| `DOWN_PAYMENT_STEP` | 5% | Installment calculator |
| `TENURE_MIN` | 12 months | Installment calculator |
| `TENURE_MAX` | 60 months | Installment calculator |
| `TENURE_STEP` | 6 months | Installment calculator |
| `BUDGET_MONTHLY_DIVISOR` | 60 | Homepage budget monthly estimate |

### 9.2 Pagination & Limits

| Constant | Value | Used Where |
|---|---|---|
| `ITEMS_PER_PAGE` | 12 | Browse page load-more pagination |
| `MAX_COMPARE_ITEMS` | 4 | Comparison tray maximum |
| `MIN_COMPARE_ITEMS` | 2 | Minimum to enable "Compare" button |
| `SEARCH_MIN_CHARS` | 2 | Search input minimum query length |
| `POPULAR_MODELS_COUNT` | 8 | Homepage popular models section |
| `POPULAR_NOW_COUNT` | 6 | Search page popular right now |
| `SIMILAR_MODELS_COUNT` | 6 | Model detail similar models |

### 9.3 Carousel & Animation

| Constant | Value | Used Where |
|---|---|---|
| `AUTO_SWIPE_INTERVAL` | 5,000 ms | Hero carousel, brand hero carousel |
| `SWIPE_THRESHOLD` | 50 px | Touch swipe minimum distance |
| `HERO_SLIDES_COUNT` | 3 | Model detail hero images |

### 9.4 Comparison Key Features

The compare page checks for exactly these 10 equipment names:

```json
[
  "Adaptive Cruise Control",
  "Lane Departure Warning",
  "Blind Spot Monitor",
  "360-Degree Camera",
  "Panoramic Sunroof",
  "Leather Seats",
  "Apple CarPlay",
  "Android Auto",
  "Wireless Charging",
  "LED Headlights"
]
```

The backend must ensure these exact names appear in equipment arrays where applicable.

### 9.5 Hero Stats (Homepage)

Currently hardcoded:
- `"45+"` Brands
- `"300+"` Models
- `"Daily"` Updated

These should be dynamic from the backend (actual brand count, model count, last update timestamp).

---

## 10. Image & Media Requirements

### 10.1 Image Types Needed

| Entity | Image Type | Aspect Ratio | Recommended Size | Count |
|---|---|---|---|---|
| Brand | Logo | 1:1 (circle crop) | 200x200 px | 1 per brand |
| Model | Card hero image | 16:10 | 600x375 px | 1 per model |
| Trim | Gallery images | 21:9 (hero carousel) | 1260x540 px | Minimum 3 per trim |
| Trim | Gallery images | 4:3 (gallery grid) | 800x600 px | 9 recommended (5 exterior + 4 interior) |
| TrimVariant | Variant preview images | 16:10 | 400x250 px | 3 per variant (optional) |
| LifestyleCollection | Collection hero | 16:9 | 800x450 px | 1 per collection |
| Branch | Map/location | -- | -- | Via mapUrl (Google Maps embed) |

### 10.2 Image Labels (Model Detail Gallery)

The gallery currently uses these labels for 9 images:

**Exterior (5):**
1. Front Three-Quarter
2. Side Profile
3. Rear View
4. Front Grille Detail
5. Wheel Design

**Interior (4):**
6. Dashboard
7. Rear Seats
8. Steering Wheel
9. Center Console

The backend should tag images with category (`"Exterior"` or `"Interior"`) and label for the gallery filter tabs.

### 10.3 Brand Hero Images (Browse Page)

When the browse page is filtered to a specific brand (`?brand={id}`), a hero carousel shows brand-level marketing images. The backend should provide 2-3 hero images per brand for this carousel.

---

## 11. Search Requirements

### 11.1 Current Search Implementation

The search function matches a query string against a concatenation of:
```
"{brandName} {modelName} {bodyType}"
```

Case-insensitive substring match. Minimum 2 characters.

### 11.2 Backend Search Recommendations

The backend search should support:
- Brand name matching (e.g., "BMW" returns all BMW models)
- Model name matching (e.g., "C-Class" returns Mercedes C-Class variants)
- Body type matching (e.g., "SUV" returns all SUVs)
- Combined matching (e.g., "BMW SUV" returns BMW X3, X5)
- Partial matching (e.g., "Cam" returns Camry)
- Results sorted by relevance

---

## 12. URL Parameter Contracts

These are the URL parameters the frontend reads. The backend does not need to handle these directly (they are client-side routing), but they define the data access patterns.

### Browse Page (`/browse`)

| Parameter | Type | Effect |
|---|---|---|
| `brand` | string (brand ID) | Pre-filter to brand, show brand hero |
| `body` | string (body type, lowercase) | Pre-filter to body type |
| `collection` | string (collection ID) | Pre-filter to lifestyle collection models |
| `minPrice` | number | Set price filter minimum |
| `maxPrice` | number | Set price filter maximum |
| `sort` | SortBy string | Set initial sort order |
| `view` | `"brands"` | Show brands grid view instead of models |

### Compare Page (`/compare`)

| Parameter | Type | Effect |
|---|---|---|
| `ids` | comma-separated model IDs | Load models + first trim each for comparison |
| `trims` | comma-separated trim IDs | Load specific trims for comparison |

### Model Detail Page (`/model/[id]`)

| Parameter | Type | Effect |
|---|---|---|
| `[id]` | string (model ID) | Route parameter -- loads the model |

### Brand Page (`/brand/[id]`)

| Parameter | Type | Effect |
|---|---|---|
| `[id]` | string (brand ID) | Redirects to `/browse?brand={id}` |

### Global

| Parameter | Type | Effect |
|---|---|---|
| `standalone` | `"true"` | Activates standalone mode (shows Navbar, Footer, MobileTabBar) |

---

## Appendix A: Complete Field Reference by Display Location

### Model Card (appears on Homepage, Browse, Search, Similar Models)

| Field | Source | Format |
|---|---|---|
| Brand name | `brand.name` | UPPERCASE, small text |
| Model name | `model.name` | Bold |
| Body type badge | `model.bodyType` | Color-coded pill |
| Starting price | `model.startingPrice` | `"{n.toLocaleString()} KWD"` |
| Engine range | `model.specsSummary.engineRange` | As-is |
| HP range | `model.specsSummary.hpRange` | As-is |
| Fuel type(s) | `model.specsSummary.fuelTypes` | Joined by `", "` |
| Trim count | `model.trimCount` | `"{n} trims"` |
| New badge | `model.isNew` | "New" if true |
| Updated badge | `model.isUpdated` | "Updated" if true |
| Image | `model.imageUrl` | Card hero |

### Trim Card (Model Detail Trim Selector)

| Field | Source | Format |
|---|---|---|
| Trim name | `trim.name` | Bold |
| Price | `trim.price` | `"{n.toLocaleString()} KWD"` |
| Engine summary | `trim.engineSummary` | As-is (e.g., "2.0L 4-cyl Turbo") |
| Fuel type | `trim.fuelType` | Badge |

### Variant Pill (Model Detail Variant Selector)

| Field | Source | Format |
|---|---|---|
| Variant name | `variant.name` | Pill label |
| Variant price | `variant.price` | `"{n.toLocaleString()} KWD"` |
| Variant images | `variant.images` | Inline thumbnail strip (3 images) |

### Spec Display (Model Detail Key Specs)

| Label | Field | Unit/Format |
|---|---|---|
| Engine | `specs.engineType` | As-is |
| Displacement | `specs.displacement` | `"{n}L"` |
| Cylinders | `specs.cylinders` | As-is |
| Horsepower | `specs.horsepower` | `"{n} hp"` |
| Torque | `specs.torque` | `"{n} Nm"` |
| 0-100 km/h | `specs.zeroToHundred` | `"{n}s"` |
| Top Speed | `specs.topSpeed` | `"{n} km/h"` |
| Fuel Economy (City) | `specs.fuelEconomyCity` | `"{n} L/100km"` or `"N/A"` if 0 |
| Fuel Economy (Highway) | `specs.fuelEconomyHighway` | `"{n} L/100km"` or `"N/A"` if 0 |
| Fuel Economy (Combined) | `specs.fuelEconomyCombined` | `"{n} L/100km"` or `"N/A"` if 0 |
| Transmission | `specs.transmission` | As-is |
| Drive Type | `specs.driveType` | As-is |
| Length | `specs.lengthMm` | `"{n} mm"` |
| Width | `specs.widthMm` | `"{n} mm"` |
| Height | `specs.heightMm` | `"{n} mm"` |
| Wheelbase | `specs.wheelbaseMm` | `"{n} mm"` |
| Trunk Volume | `specs.trunkVolumeLiters` | `"{n} L"` |
| Curb Weight | `specs.curbWeightKg` | `"{n} kg"` |
| Fuel Tank | `specs.fuelTankLiters` | `"{n} L"` |
| Seating | `specs.seatingCapacity` | `"{n} seats"` |
| Warranty | `specs.warranty` | As-is (e.g., "5 years / 100,000 km") |
| Spec Region | `specs.specRegion` | As-is (e.g., "GCC") |

### Branch Card (Model Detail Branches Section)

| Field | Source | Format |
|---|---|---|
| Branch name | `branch.name` | Bold |
| Location | `branch.location` | Secondary text |
| Phone | `branch.phone` | Tap-to-call link |
| Map | `branch.mapUrl` | "Get Directions" link |

### Lead Form Auto-Context

| Field | Source |
|---|---|
| Brand name | `brand.name` |
| Model name | `model.name` |
| Trim name | `selectedTrim.name` |
| Variant name | `selectedVariant?.name` (if applicable) |

---

## Appendix B: Data Volume Estimates

Based on the current mock data for scope planning:

| Entity | Current Count | Expected at Scale |
|---|---|---|
| Brands | 8 | 30-50 |
| Models | 36 | 200-400 |
| Trims | 84 | 500-1,500 |
| TrimVariants | ~120 | 500-2,000 |
| Equipment items per trim | 10-15 | 15-30 |
| Branches | 4 | 50-150 |
| Lifestyle Collections | 4 | 10-20 |
| Images per trim | 3 (placeholder) | 10-20 (real photography) |

---

## Appendix C: Popular Comparisons (Editorial)

The compare page empty state shows pre-built comparison suggestions. These are currently hardcoded:

| Comparison Title | Model IDs |
|---|---|
| C-Class vs 3 Series | `merc-c200`, `bmw-320i` |
| Land Cruiser vs X5 | `toyota-lc-gxr`, `bmw-x5-40i` |
| Camry vs 3 Series | `toyota-camry-le`, `bmw-320i` |

The backend should provide an endpoint for editorially curated popular comparisons, similar to lifestyle collections.
