# New Cars Showroom Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a new cars showroom for q84sale.com where users can browse brands, discover models/trims/variants via a premium carousel experience, filter listings with comprehensive filters, view detailed listing pages, and compare cars side-by-side.

**Architecture:** Next.js App Router with CSS Modules following 4Sale's design system (Q84SALE-DESIGN-SYSTEM.md). Mock data served from local JSON files via server components. Client-side filtering with URL state. Comparison stored in React context. Use impeccable.style skills (@animate, @delight, @polish) for the premium carousel and key interactions.

**Tech Stack:** Next.js 14 (App Router), TypeScript, CSS Modules, Swiper.js (carousels), 4Sale design tokens

**Design System:** All UI must follow Q84SALE-DESIGN-SYSTEM.md — tokens, typography, motion, interaction patterns.

---

## Phase 1: Project Scaffolding & Data Layer

### Task 1.1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

**Step 1: Scaffold Next.js app**

```bash
cd /Users/joe/new_cars
npx create-next-app@latest . --typescript --app --src-dir --no-tailwind --no-eslint --import-alias "@/*" --use-npm
```

Accept overwrite prompts for existing files.

**Step 2: Add 4Sale design tokens to globals.css**

Replace `src/app/globals.css` with the full `:root` token set from Q84SALE-DESIGN-SYSTEM.md:

```css
:root {
  /* Primary */
  --prim_50: #edf4ff;
  --prim_100: #ccdfff;
  --prim_200: #9ec3ff;
  --prim_300: #69a3ff;
  --prim_400: #428aff;
  --prim_500: #0062ff;
  --prim_600: #004bc5;
  --prim_700: #004bc5;
  --prim_800: #00368c;
  --prim_900: #00296b;

  /* Neutral */
  --neutral_50: #f7f8fa;
  --neutral_100: #e9ebf2;
  --neutral_200: #dadfeb;
  --neutral_300: #ccd2e0;
  --neutral_400: #b2bacf;
  --neutral_500: #7280a3;
  --neutral_600: #59688e;
  --neutral_700: #324575;
  --neutral_800: #15295c;
  --neutral_900: #021442;

  /* Warning */
  --warning_50: #fff8e6;
  --warning_100: #ffe9b0;
  --warning_200: #ffde8a;
  --warning_300: #ffcf54;
  --warning_400: #ffc533;
  --warning_500: #ffb700;
  --warning_600: #b58200;
  --warning_700: #8c6500;
  --warning_800: #664900;
  --warning_900: #332500;

  /* Success */
  --success_50: #e6f8ee;
  --success_100: #d4f1e0;
  --success_200: #9de3b9;
  --success_300: #6bd696;
  --success_400: #3ac873;
  --success_500: #09ba50;
  --success_600: #079540;
  --success_700: #057030;
  --success_800: #044a20;
  --success_900: #022510;

  /* Energy */
  --energy_50: #fff1e8;
  --energy_100: #ffd4b7;
  --energy_200: #ffbf95;
  --energy_300: #ffa264;
  --energy_400: #ff9046;
  --energy_500: #ff7418;
  --energy_600: #b55211;
  --energy_700: #7a380b;
  --energy_800: #8c400d;
  --energy_900: #401d06;

  /* Shades */
  --shades_0: #ffffff;
  --shades_100: #000000;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--shades_0);
  color: var(--neutral_900);
}

a {
  color: inherit;
  text-decoration: none;
}
```

**Step 3: Verify dev server starts**

```bash
cd /Users/joe/new_cars && npm run dev
```

Expected: Server running on localhost:3000

**Step 4: Commit**

```bash
git init && git add -A && git commit -m "feat: scaffold Next.js app with 4Sale design tokens"
```

---

### Task 1.2: Data Types & Mock Data

**Files:**
- Create: `src/types/index.ts`
- Create: `src/data/brands.ts`
- Create: `src/data/listings.ts`

**Step 1: Create TypeScript types**

Create `src/types/index.ts` with these interfaces:

```typescript
export type BodyType = "sedan" | "suv" | "hatchback" | "coupe" | "truck" | "van" | "convertible" | "wagon";
export type FuelType = "gasoline" | "diesel" | "hybrid" | "plug-in-hybrid" | "electric";
export type Drivetrain = "FWD" | "RWD" | "AWD" | "4WD";
export type Transmission = "automatic" | "manual" | "cvt" | "dct";
export type Availability = "in-stock" | "in-transit" | "build-to-order" | "sold";

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  country: string;
  foundedYear: number;
  models: Model[];
}

export interface Model {
  id: string;
  brandId: string;
  name: string;
  image: string;
  year: number;
  bodyType: BodyType;
  priceRange: { min: number; max: number; currency: string };
  description: string;
  trims: Trim[];
}

export interface Trim {
  id: string;
  modelId: string;
  name: string;
  basePrice: number;
  engine: string;
  transmission: Transmission;
  horsepower: number;
  torque: number;
  fuelType: FuelType;
  drivetrain: Drivetrain;
  fuelEconomy: { city: number; highway: number; combined: number };
  variants: Variant[];
}

export interface Variant {
  id: string;
  trimId: string;
  name: string;
  price: number;
  additionalFeatures: string[];
  colorOptions: ColorOption[];
  availability: Availability;
}

export interface ColorOption {
  name: string;
  hex: string;
  type: "solid" | "metallic" | "pearl";
  upcharge: number;
}

export interface Listing {
  id: string;
  vin: string;
  brandId: string;
  modelId: string;
  trimId: string;
  variantId: string;
  year: number;
  price: number;
  msrp: number;
  color: { exterior: ColorOption; interior: string };
  mileage: number;
  condition: "new";
  dealer: {
    id: string;
    name: string;
    city: string;
    phone: string;
    rating: number;
  };
  images: string[];
  features: string[];
  specs: {
    engine: string;
    transmission: Transmission;
    drivetrain: Drivetrain;
    horsepower: number;
    torque: number;
    fuelType: FuelType;
    fuelEconomy: { city: number; highway: number; combined: number };
    seatingCapacity: number;
    cargoVolume: number;
    curbWeight: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
      wheelbase: number;
      groundClearance: number;
    };
  };
  warranty: {
    basic: string;
    powertrain: string;
    corrosion: string;
    roadside: string;
  };
  safetyRating?: { nhtsa: number; iihsTopPick: boolean };
  addedDate: string;
  status: Availability;
}

export interface Filters {
  brandId: string | null;
  modelIds: string[];
  trimIds: string[];
  variantIds: string[];
  priceRange: [number, number];
  bodyTypes: BodyType[];
  fuelTypes: FuelType[];
  transmissions: Transmission[];
  drivetrains: Drivetrain[];
  exteriorColors: string[];
  features: string[];
  sortBy: "price-asc" | "price-desc" | "newest" | "hp-desc" | "mpg-desc";
}

export interface ComparisonItem {
  listing: Listing;
  brand: Brand;
  model: Model;
  trim: Trim;
  variant: Variant;
}
```

**Step 2: Create mock brand data**

Create `src/data/brands.ts` containing 5 brands (Toyota, BMW, Mercedes, Honda, Kia) with 3-4 models each, 2-3 trims per model, 1-2 variants per trim. Use the complete Toyota and BMW data from research. Add Mercedes, Honda, Kia with similar depth. Use placeholder image paths like `/images/models/toyota-camry.jpg` — we'll use `https://placehold.co/600x400/e9ebf2/324575?text=Toyota+Camry` as actual placeholder URLs.

Export: `export const brands: Brand[]`

Also export helper functions:
```typescript
export function getBrandById(id: string): Brand | undefined
export function getModelById(brandId: string, modelId: string): Model | undefined
export function getTrimById(modelId: string, trimId: string): Trim | undefined
export function getAllModelsForBrand(brandId: string): Model[]
```

**Step 3: Create mock listings data**

Create `src/data/listings.ts` with 30-40 listings spread across all brands/models. Each listing should reference valid brand/model/trim/variant IDs from brands.ts.

Export:
```typescript
export const listings: Listing[]
export function getListingById(id: string): Listing | undefined
export function getListingsForBrand(brandId: string): Listing[]
export function filterListings(filters: Partial<Filters>): Listing[]
```

The `filterListings` function should handle all filter fields: brandId, modelIds (multi-select), trimIds, variantIds, priceRange, bodyTypes, fuelTypes, transmissions, drivetrains, exteriorColors, features, and sorting.

**Step 4: Commit**

```bash
git add src/types src/data && git commit -m "feat: add data types and mock data for 5 car brands with listings"
```

---

## Phase 2: Brand Selection & Page Layout

### Task 2.1: App Shell & Navigation

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/Header/Header.tsx`
- Create: `src/components/Header/Header.module.css`

**Step 1: Create Header component**

Header with 4Sale-style design: logo area on left, "New Cars" title center, minimal nav. Use the header box-shadow from the design system: `rgb(233, 235, 242) 0px 0px 0px 1px`.

**Step 2: Update layout.tsx**

Add the Header to the root layout. Set metadata title to "4Sale - New Cars Showroom".

**Step 3: Commit**

```bash
git add src/components src/app && git commit -m "feat: add app shell with header navigation"
```

---

### Task 2.2: Brand Selection Bar

**Files:**
- Create: `src/components/BrandSelector/BrandSelector.tsx`
- Create: `src/components/BrandSelector/BrandSelector.module.css`
- Modify: `src/app/page.tsx`

**Step 1: Build BrandSelector component**

Horizontal scrollable row of brand logos/names. Each brand is a clickable card showing logo + name. Selected brand gets `--prim_500` border/accent. Use the chip/label interaction pattern from the design system: `border-color` transitions at `0.2s ease-in-out`, hover overlay at `opacity: 0.08`.

Props:
```typescript
interface BrandSelectorProps {
  brands: Brand[];
  selectedBrandId: string | null;
  onSelectBrand: (brandId: string) => void;
}
```

**Step 2: Wire up in page.tsx**

The home page should:
1. Show the BrandSelector at the top
2. Manage `selectedBrandId` state
3. When a brand is selected, render the showroom content below (placeholder for now)

**Step 3: Commit**

```bash
git add src/components/BrandSelector src/app && git commit -m "feat: add brand selection bar with 4Sale styling"
```

---

## Phase 3: Model Carousel (Premium Experience)

### Task 3.1: Model Card Component

**Files:**
- Create: `src/components/ModelCard/ModelCard.tsx`
- Create: `src/components/ModelCard/ModelCard.module.css`

**Step 1: Build ModelCard**

This is the hero component — the "special experience". Each card shows:
- Large car image (fills card width)
- Model name (h3, 700 weight)
- Year badge
- Price range formatted as "From $XX,XXX - $XX,XXX"
- Body type tag
- Number of trims available
- Subtle gradient overlay on the image bottom for text readability

Card design:
- Elevated card with rounded corners (8px border-radius)
- On hover: card lifts slightly (`translateY(-4px)`) with a shadow appearing
- On hover: car image scales up subtly (`scale(1.03)`) with overflow hidden
- Transition: `0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)` (from 4Sale's slide-in-top timing)
- Selected state: `--prim_500` border glow

Use `@animate` and `@delight` skills during implementation for the hover/selection micro-interactions.

Props:
```typescript
interface ModelCardProps {
  model: Model;
  isSelected: boolean;
  onSelect: (modelId: string) => void;
}
```

**Step 2: Commit**

```bash
git add src/components/ModelCard && git commit -m "feat: add premium model card with hover animations"
```

---

### Task 3.2: Model Carousel

**Files:**
- Create: `src/components/ModelCarousel/ModelCarousel.tsx`
- Create: `src/components/ModelCarousel/ModelCarousel.module.css`

**Step 1: Install Swiper**

```bash
npm install swiper
```

**Step 2: Build ModelCarousel**

Horizontal carousel of ModelCards using Swiper. Configuration:
- `slidesPerView: "auto"` with 16px gap
- Centered first slide with peek of next slides
- Snap scrolling with momentum
- Custom navigation arrows (left/right) styled with 4Sale tokens
- Pagination dots that fill with `--prim_500` (match the 5s fill animation pattern)
- Shimmer skeleton loading state while data loads (using 4Sale's shimmer pattern: `translateX(-100%)` to `translateX(calc(100% + 100px))` at 1.5s linear infinite)

Cards support multi-select (click toggles selection, selected cards have blue border).

Props:
```typescript
interface ModelCarouselProps {
  models: Model[];
  selectedModelIds: string[];
  onToggleModel: (modelId: string) => void;
}
```

Use `@delight` skill for the carousel entrance animation (slide-in from right on brand change).

**Step 3: Commit**

```bash
git add src/components/ModelCarousel && git commit -m "feat: add model carousel with Swiper and premium animations"
```

---

## Phase 4: Filters System

### Task 4.1: Filter Sidebar Components

**Files:**
- Create: `src/components/Filters/FilterPanel.tsx`
- Create: `src/components/Filters/FilterPanel.module.css`
- Create: `src/components/Filters/PriceRangeFilter.tsx`
- Create: `src/components/Filters/MultiSelectFilter.tsx`
- Create: `src/components/Filters/ColorFilter.tsx`
- Create: `src/components/Filters/FeatureFilter.tsx`
- Create: `src/components/Filters/TrimSelector.tsx`
- Create: `src/components/Filters/VariantSelector.tsx`

**Step 1: Build FilterPanel (container)**

Sticky sidebar (desktop) / bottom sheet (mobile) containing all filter groups. Each filter group is a collapsible accordion section. "Clear All" button at top. Active filter count badge.

**Step 2: Build TrimSelector**

Dependent on selected models. Shows available trims as multi-select chips. Uses the 4Sale chip styling: `::before` overlay on hover, border transitions.

**Step 3: Build VariantSelector**

Dependent on selected trims. Shows variants as selectable chips with price displayed.

**Step 4: Build PriceRangeFilter**

Dual-handle range slider. Min/max inputs below. Range: derived from available listings. Use `--prim_500` for the active track color.

**Step 5: Build MultiSelectFilter**

Reusable component for: Body Type, Fuel Type, Transmission, Drivetrain. Renders checkboxes with 4Sale checkbox styling (custom `::before` overlay, `0.2s ease-in-out` transition).

**Step 6: Build ColorFilter**

Grid of color swatches (circles). Each swatch shows the actual color hex. Selected swatches get a check mark and `--prim_500` ring. Derive available colors from current filtered listings.

**Step 7: Build FeatureFilter**

Grouped checkboxes for common features (Safety, Comfort, Technology). Expandable accordion per group.

**Step 8: Wire all filters into FilterPanel**

FilterPanel manages the complete `Filters` state and passes callbacks to each sub-filter. Emits `onFiltersChange(filters: Filters)` to parent.

**Step 9: Commit**

```bash
git add src/components/Filters && git commit -m "feat: add comprehensive filter system with 7 filter types"
```

---

### Task 4.2: Active Filters Bar

**Files:**
- Create: `src/components/ActiveFilters/ActiveFilters.tsx`
- Create: `src/components/ActiveFilters/ActiveFilters.module.css`

**Step 1: Build ActiveFilters**

Horizontal scrollable row of active filter chips (shown between carousel and listings). Each chip shows filter label + remove (X) button. "Clear All" at the end. Chips use 4Sale's chip styling with `--prim_50` background and `--prim_500` text for active filters.

**Step 2: Commit**

```bash
git add src/components/ActiveFilters && git commit -m "feat: add active filters bar with removable chips"
```

---

## Phase 5: Listings Feed

### Task 5.1: Listing Card Component

**Files:**
- Create: `src/components/ListingCard/ListingCard.tsx`
- Create: `src/components/ListingCard/ListingCard.module.css`

**Step 1: Build ListingCard**

Card showing:
- Car image (with color dot overlay showing exterior color)
- Year + Brand + Model + Trim + Variant name
- Price (large, bold, `--neutral_900`)
- MSRP with strikethrough if different from price
- Key specs row: HP | MPG | Drivetrain | Transmission
- Exterior + Interior color names
- Availability badge (in-stock = `--success_500`, in-transit = `--warning_500`, build-to-order = `--prim_500`)
- "Compare" checkbox in corner
- Dealer name + rating stars

Card interaction:
- Click navigates to listing detail page
- Hover: subtle lift (`translateY(-2px)`) with `0.2s ease-in-out`
- Compare checkbox: click stops propagation, toggles comparison

**Step 2: Commit**

```bash
git add src/components/ListingCard && git commit -m "feat: add listing card with specs, pricing, and compare toggle"
```

---

### Task 5.2: Listings Feed Grid

**Files:**
- Create: `src/components/ListingsFeed/ListingsFeed.tsx`
- Create: `src/components/ListingsFeed/ListingsFeed.module.css`

**Step 1: Build ListingsFeed**

Responsive grid of ListingCards. Desktop: 3 columns. Tablet: 2. Mobile: 1. Shows result count and sort dropdown at top. Empty state when no listings match filters.

Sorting options: Price Low→High, Price High→Low, Newest, Horsepower, MPG.

Grid items animate in with a staggered entrance (each card delays 50ms after the previous). Use the `slide-in-top` animation from 4Sale's design system.

**Step 2: Commit**

```bash
git add src/components/ListingsFeed && git commit -m "feat: add listings feed grid with sorting and staggered entrance"
```

---

### Task 5.3: Wire Up Showroom Page

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/hooks/useFilters.ts`
- Create: `src/context/ComparisonContext.tsx`

**Step 1: Create useFilters hook**

Custom hook managing all filter state with URL search params sync. Handles:
- Setting/clearing individual filters
- Deriving available filter options from current data
- Calling `filterListings()` from data layer
- Debouncing filter updates

**Step 2: Create ComparisonContext**

React context for managing comparison list (max 4 cars). Provides:
- `comparisonItems: ComparisonItem[]`
- `addToComparison(listing: Listing): void`
- `removeFromComparison(listingId: string): void`
- `isInComparison(listingId: string): boolean`
- `clearComparison(): void`

**Step 3: Assemble the showroom page**

Layout:
```
[Header]
[BrandSelector]                          ← full width
[ModelCarousel]                          ← full width, shown when brand selected
[ActiveFilters]                          ← full width
[FilterPanel (sidebar)] [ListingsFeed]   ← two column layout
[ComparisonBar]                          ← sticky bottom bar when items selected
```

The page manages the flow:
1. User selects brand → models load in carousel
2. User multi-selects models → trims appear in filter panel
3. User selects trims → variants appear
4. All selections + filters update the listings feed
5. Compare checkboxes on listings populate the comparison bar

**Step 4: Commit**

```bash
git add src/app src/hooks src/context && git commit -m "feat: wire up showroom page with filters, carousel, and listings"
```

---

## Phase 6: Listing Detail Page

### Task 6.1: Listing Detail Page

**Files:**
- Create: `src/app/listing/[id]/page.tsx`
- Create: `src/app/listing/[id]/page.module.css`
- Create: `src/components/ImageGallery/ImageGallery.tsx`
- Create: `src/components/ImageGallery/ImageGallery.module.css`
- Create: `src/components/SpecsTable/SpecsTable.tsx`
- Create: `src/components/SpecsTable/SpecsTable.module.css`

**Step 1: Build ImageGallery**

Hero image with thumbnail strip below. Click thumbnail to swap main image. Swipe on mobile. Uses Swiper for the thumbnail strip. Shimmer loading skeleton.

**Step 2: Build SpecsTable**

Reusable table component for displaying key-value spec data in grouped sections. Alternating row backgrounds (`--neutral_50` / white).

**Step 3: Build the detail page**

Full listing detail page with these sections:

**Hero Section:**
- ImageGallery (left 60%)
- Title + Price panel (right 40%): Year/Brand/Model/Trim/Variant, Price, MSRP, Availability badge, Exterior/Interior color with swatch, "Add to Compare" button, "Contact Dealer" CTA button (`--prim_500`)

**Quick Stats Row:**
- HP | Torque | MPG (combined) | Drivetrain | Transmission | Fuel Type
- Pill badges with `--neutral_50` background

**Tabs (collapsible sections on mobile):**

1. **Overview** — Description, key highlights, included features list (grouped: Safety, Comfort, Technology, Exterior)

2. **Specifications** — Full specs table:
   - Engine & Performance: engine, HP, torque, transmission, drivetrain, 0-60 (if available)
   - Fuel Economy: city/highway/combined MPG, fuel tank, annual fuel cost estimate
   - Dimensions: length, width, height, wheelbase, ground clearance, cargo volume, curb weight, seating capacity
   - Warranty: basic, powertrain, corrosion, roadside

3. **Safety** — NHTSA rating (star display), IIHS Top Safety Pick badge, safety features list

4. **Dealer Info** — Dealer name, city, phone, rating (star display)

5. **Similar Listings** — Carousel of ListingCards from same model/trim (using Swiper)

**Step 4: Commit**

```bash
git add src/app/listing src/components/ImageGallery src/components/SpecsTable && git commit -m "feat: add detailed listing page with gallery, specs, and sections"
```

---

## Phase 7: Car Comparison

### Task 7.1: Comparison Bar

**Files:**
- Create: `src/components/ComparisonBar/ComparisonBar.tsx`
- Create: `src/components/ComparisonBar/ComparisonBar.module.css`

**Step 1: Build ComparisonBar**

Sticky bar at bottom of screen (only visible when comparison has items). Shows:
- Thumbnails of compared cars (up to 4 slots)
- Remove (X) on each thumbnail
- "Compare Now" CTA button (`--prim_500`)
- Empty slots shown as dashed border placeholder
- Slides in from bottom using snackbar animation pattern (`translateY(100%)` → `translateY(-24px)`)

**Step 2: Commit**

```bash
git add src/components/ComparisonBar && git commit -m "feat: add sticky comparison bar with slide-in animation"
```

---

### Task 7.2: Comparison Page

**Files:**
- Create: `src/app/compare/page.tsx`
- Create: `src/app/compare/page.module.css`
- Create: `src/components/ComparisonTable/ComparisonTable.tsx`
- Create: `src/components/ComparisonTable/ComparisonTable.module.css`

**Step 1: Build ComparisonTable**

Side-by-side comparison of 2-4 cars. Structure:

**Sticky Header Row:**
- Each column: car image, year/brand/model/trim/variant, price, "Remove" button, "Change Trim" dropdown (swap trim within same model)

**Comparison Sections (collapsible accordions):**

1. **Price & Value**
   - MSRP, Dealer Price, Savings from MSRP

2. **Performance & Powertrain**
   - Engine, Horsepower, Torque, Transmission, Drivetrain

3. **Fuel Economy**
   - City MPG, Highway MPG, Combined MPG

4. **Dimensions & Capacity**
   - Length, Width, Height, Wheelbase, Ground Clearance, Cargo Volume, Curb Weight, Seating Capacity

5. **Features**
   - Row per feature, checkmark (green `--success_500`) if included, dash if not

6. **Safety**
   - NHTSA rating, IIHS status, safety feature checklist

7. **Warranty**
   - Basic, Powertrain, Corrosion, Roadside

**UX Features:**
- "Highlight Differences" toggle — dims rows where all values match, highlights rows with differences
- "Best" indicator — green highlight / bold on the winning value per row (highest HP, lowest price, best MPG)
- On mobile: horizontal swipe between columns with sticky left label column
- "Add Another Car" button to add cars from a dropdown (Brand → Model → Trim → Variant cascade)

**Step 2: Build the comparison page**

Route: `/compare`. Reads comparison items from ComparisonContext. Shows empty state if no items with CTA to browse showroom. Renders ComparisonTable with all items.

**Step 3: Commit**

```bash
git add src/app/compare src/components/ComparisonTable && git commit -m "feat: add car comparison page with side-by-side specs and highlights"
```

---

## Phase 8: Polish & Premium Touches

### Task 8.1: Loading States & Skeleton Screens

**Files:**
- Create: `src/components/Skeleton/Skeleton.tsx`
- Create: `src/components/Skeleton/Skeleton.module.css`

**Step 1: Build Skeleton component**

Reusable shimmer skeleton using 4Sale's shimmer animation (`translateX(-100%)` → `translateX(calc(100% + 100px))`, 1.5s linear infinite). Variants: `line`, `card`, `circle`, `image`.

**Step 2: Add skeletons to ModelCarousel, ListingsFeed, and ListingDetail**

Show skeletons during data loading / filter transitions.

**Step 3: Commit**

```bash
git add src/components/Skeleton && git commit -m "feat: add shimmer skeleton loading states"
```

---

### Task 8.2: Responsive Design

**Files:**
- Modify: All `.module.css` files

**Step 1: Add responsive breakpoints**

Following 4Sale's responsive approach:
- Desktop: `> 1024px` — full layout with sidebar
- Tablet: `768px - 1024px` — stacked layout, 2-column grid
- Mobile: `< 768px` — single column, bottom sheet filters, compact cards

Key responsive changes:
- FilterPanel becomes a slide-up bottom sheet on mobile (using the bottom sheet animation pattern)
- ModelCarousel shows fewer slides with smaller cards
- ListingsFeed switches to 1 column
- ComparisonTable becomes swipeable
- Header adapts to compact mode

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add responsive design across all breakpoints"
```

---

### Task 8.3: Final Polish with impeccable.style Skills

**Step 1: Run @animate skill**

Apply purposeful animations to:
- Brand selection transition (carousel swaps with crossfade)
- Filter panel open/close on mobile
- Listing card entrance stagger
- Comparison bar appearance

**Step 2: Run @delight skill**

Add micro-delights:
- Car image subtle parallax on hover in model cards
- Smooth counter animation for results count
- Color swatch ripple on selection
- Comparison "slot filled" bounce

**Step 3: Run @polish skill**

Final pass on:
- Alignment and spacing consistency
- Border radius consistency
- Shadow depth hierarchy
- Typography rhythm

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: polish with animations, micro-interactions, and visual consistency"
```

---

## Summary

| Phase | What | Key Components |
|-------|------|----------------|
| 1 | Scaffolding + Data | Next.js setup, types, 5 brands mock data, 40 listings |
| 2 | Brand Selection | Header, BrandSelector bar |
| 3 | Model Carousel | Premium ModelCard, Swiper carousel, multi-select |
| 4 | Filters | 7 filter types, trim/variant cascade, active filters bar |
| 5 | Listings Feed | ListingCard, responsive grid, sorting, comparison toggle |
| 6 | Listing Detail | Gallery, specs table, safety, dealer, similar listings |
| 7 | Comparison | Sticky bar, side-by-side table, highlight differences |
| 8 | Polish | Skeletons, responsive, animations, micro-interactions |

**Total estimated components:** ~25
**Total pages:** 3 (Showroom, Listing Detail, Comparison)
