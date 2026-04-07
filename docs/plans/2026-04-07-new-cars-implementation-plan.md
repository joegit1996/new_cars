# New Cars Platform Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a mobile-first new car browsing platform with brand grid, model carousel, trim feed, variant selection, and details pages -- all styled to the Q84Sale design system.

**Architecture:** Next.js App Router with static mock data. Pages are server components by default; interactive pieces (carousel, filters, variant selector) are client components. CSS Modules for styling with design tokens as CSS custom properties on `:root`. Card-stack component from 21st.dev for the model carousel (Framer Motion dependency). Swiper.js for image galleries.

**Tech Stack:** Next.js 15 (App Router), TypeScript, CSS Modules, Framer Motion, Swiper.js, card-stack (21st.dev)

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/fonts/` (copy font files)

**Step 1: Initialize Next.js project**

```bash
cd /Users/joe/new_cars
npx create-next-app@latest . --typescript --app --src-dir --no-tailwind --no-eslint --import-alias "@/*" --yes
```

If prompted about existing files, allow overwrite. The scaffolder creates the base structure.

**Step 2: Install dependencies**

```bash
npm install framer-motion swiper
```

**Step 3: Copy font files into the project**

```bash
mkdir -p src/fonts
cp /Users/joe/Downloads/Font/sakrPro-Bold.otf src/fonts/
cp /Users/joe/Downloads/Font/sakrPro-Light.otf src/fonts/
cp /Users/joe/Downloads/Font/sakrPro-Medium.otf src/fonts/
cp /Users/joe/Downloads/Font/sakrPro-Regular.otf src/fonts/
```

**Step 4: Set up globals.css with all design tokens**

Replace `src/app/globals.css` with the full token system. Define all CSS custom properties on `:root`:

```css
@font-face {
  font-family: 'sakr font';
  src: url('../fonts/sakrPro-Regular.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'sakr font';
  src: url('../fonts/sakrPro-Medium.otf') format('opentype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'sakr font';
  src: url('../fonts/sakrPro-Bold.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'sakr font';
  src: url('../fonts/sakrPro-Light.otf') format('opentype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

:root {
  /* Primary (Brand Blue) */
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

  /* Neutral (Grays) */
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

  /* Warning (Yellow/Amber) */
  --warning_50: #fff8e6;
  --warning_100: #ffe9b0;
  --warning_300: #ffcf54;
  --warning_500: #ffb700;
  --warning_700: #8c6500;

  /* Success (Green) */
  --success_50: #e6f8ee;
  --success_300: #6bd696;
  --success_500: #09ba50;
  --success_700: #057030;

  /* Energy (Orange) */
  --energy_50: #fff1e8;
  --energy_300: #ffa264;
  --energy_500: #ff7418;
  --energy_700: #7a380b;

  /* Shades */
  --shades_0: #ffffff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'sakr font', sans-serif;
  color: var(--neutral_900);
  background-color: var(--shades_0);
  -webkit-font-smoothing: antialiased;
}

h1 { font-size: 32px; font-weight: 700; line-height: normal; color: var(--neutral_900); }
h2 { font-size: 24px; font-weight: 700; line-height: normal; color: var(--neutral_900); }
h3 { font-size: 16px; font-weight: 500; line-height: 24px; color: var(--neutral_900); }
h4 { font-size: 16px; font-weight: 700; line-height: 24px; color: var(--neutral_900); }
p { font-size: 14px; font-weight: 400; line-height: 1.4; }
a { font-size: 16px; font-weight: 400; color: var(--prim_500); text-decoration: none; }

/* Shimmer animation (global -- reused across skeleton components) */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(calc(100% + 100px)); }
}
```

**Step 5: Set up root layout**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Q84Sale - New Cars",
  description: "Browse new cars in Kuwait",
  viewport: "width=device-width, initial-scale=1.0, interactive-widget=resizes-content",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**Step 6: Verify the app runs**

```bash
npm run dev
```

Open http://localhost:3000 -- should show the default Next.js page with the sakr font applied.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with design tokens, fonts, and dependencies"
```

---

## Task 2: TypeScript Types and Mock Data

**Files:**
- Create: `src/types/index.ts`
- Create: `src/data/brands.ts`
- Create: `src/data/models.ts`
- Create: `src/data/trims.ts`
- Create: `src/data/variants.ts`
- Create: `src/data/index.ts`
- Create: `public/images/brands/` (brand logos)
- Create: `public/images/cars/` (car images)

**Step 1: Define TypeScript types**

Create `src/types/index.ts`:

```ts
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string; // path to /public/images/brands/
}

export interface Model {
  id: string;
  brandId: string;
  name: string;
  slug: string;
  image: string;
  startingPrice: number; // KWD
}

export interface TrimSpec {
  engine: string;
  horsepower: number;
  torque: string;
  transmission: string;
  drivetrain: string;
  zeroToHundred: string;
  topSpeed: string;
  fuelType: string;
  fuelTank: string;
  fuelConsumption: string;
  seatingCapacity: number;
  bodyType: string;
  year: number;
  length: string;
  width: string;
  height: string;
  wheelbase: string;
  curbWeight: string;
  cargoVolume: string;
  infotainmentScreen: string;
  features: string[];
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface TrimVariant {
  id: string;
  trimId: string;
  name: string;
  price: number; // KWD
  specs: TrimSpec;
  colors: ColorOption[];
  images: string[];
}

export interface Trim {
  id: string;
  modelId: string;
  brandId: string;
  name: string;
  image: string;
  startingPrice: number;
  specTags: string[]; // e.g., ["2.0L Turbo", "RWD", "255 HP"]
  variants: TrimVariant[];
}
```

**Step 2: Source real car images**

Use web search to find royalty-free / public domain car images for each brand and model. Download to `public/images/cars/` organized by brand slug. For brand logos, source SVGs from public brand asset pages or icon libraries.

Directory structure:
```
public/images/
  brands/
    mercedes-benz.svg
    bmw.svg
    toyota.svg
    lexus.svg
    porsche.svg
    land-rover.svg
  cars/
    mercedes-benz/
      c-class-1.jpg
      c-class-2.jpg
      e-class-1.jpg
      ...
    bmw/
      3-series-1.jpg
      ...
    ...
```

Use `WebFetch` or `WebSearch` to find and download real car images (exterior shots, interiors). Aim for 3-4 images per model, with variants sharing model images where distinct photos aren't available.

**Step 3: Create brand data**

Create `src/data/brands.ts`:

```ts
import { Brand } from "@/types";

export const brands: Brand[] = [
  { id: "mercedes", name: "Mercedes-Benz", slug: "mercedes-benz", logo: "/images/brands/mercedes-benz.svg" },
  { id: "bmw", name: "BMW", slug: "bmw", logo: "/images/brands/bmw.svg" },
  { id: "toyota", name: "Toyota", slug: "toyota", logo: "/images/brands/toyota.svg" },
  { id: "lexus", name: "Lexus", slug: "lexus", logo: "/images/brands/lexus.svg" },
  { id: "porsche", name: "Porsche", slug: "porsche", logo: "/images/brands/porsche.svg" },
  { id: "land-rover", name: "Land Rover", slug: "land-rover", logo: "/images/brands/land-rover.svg" },
];
```

**Step 4: Create model data**

Create `src/data/models.ts` with 3-5 models per brand. Example for Mercedes:

```ts
import { Model } from "@/types";

export const models: Model[] = [
  // Mercedes-Benz
  { id: "merc-c-class", brandId: "mercedes", name: "C-Class", slug: "c-class", image: "/images/cars/mercedes-benz/c-class-1.jpg", startingPrice: 12500 },
  { id: "merc-e-class", brandId: "mercedes", name: "E-Class", slug: "e-class", image: "/images/cars/mercedes-benz/e-class-1.jpg", startingPrice: 17800 },
  { id: "merc-s-class", brandId: "mercedes", name: "S-Class", slug: "s-class", image: "/images/cars/mercedes-benz/s-class-1.jpg", startingPrice: 29500 },
  { id: "merc-glc", brandId: "mercedes", name: "GLC", slug: "glc", image: "/images/cars/mercedes-benz/glc-1.jpg", startingPrice: 16200 },
  // BMW
  { id: "bmw-3-series", brandId: "bmw", name: "3 Series", slug: "3-series", image: "/images/cars/bmw/3-series-1.jpg", startingPrice: 11800 },
  { id: "bmw-5-series", brandId: "bmw", name: "5 Series", slug: "5-series", image: "/images/cars/bmw/5-series-1.jpg", startingPrice: 16500 },
  { id: "bmw-x5", brandId: "bmw", name: "X5", slug: "x5", image: "/images/cars/bmw/x5-1.jpg", startingPrice: 22000 },
  { id: "bmw-7-series", brandId: "bmw", name: "7 Series", slug: "7-series", image: "/images/cars/bmw/7-series-1.jpg", startingPrice: 32000 },
  // Toyota
  { id: "toyota-camry", brandId: "toyota", name: "Camry", slug: "camry", image: "/images/cars/toyota/camry-1.jpg", startingPrice: 7800 },
  { id: "toyota-land-cruiser", brandId: "toyota", name: "Land Cruiser", slug: "land-cruiser", image: "/images/cars/toyota/land-cruiser-1.jpg", startingPrice: 22500 },
  { id: "toyota-corolla", brandId: "toyota", name: "Corolla", slug: "corolla", image: "/images/cars/toyota/corolla-1.jpg", startingPrice: 5900 },
  // Lexus
  { id: "lexus-es", brandId: "lexus", name: "ES", slug: "es", image: "/images/cars/lexus/es-1.jpg", startingPrice: 13500 },
  { id: "lexus-rx", brandId: "lexus", name: "RX", slug: "rx", image: "/images/cars/lexus/rx-1.jpg", startingPrice: 18900 },
  { id: "lexus-lx", brandId: "lexus", name: "LX", slug: "lx", image: "/images/cars/lexus/lx-1.jpg", startingPrice: 35000 },
  // Porsche
  { id: "porsche-cayenne", brandId: "porsche", name: "Cayenne", slug: "cayenne", image: "/images/cars/porsche/cayenne-1.jpg", startingPrice: 28000 },
  { id: "porsche-macan", brandId: "porsche", name: "Macan", slug: "macan", image: "/images/cars/porsche/macan-1.jpg", startingPrice: 22000 },
  { id: "porsche-911", brandId: "porsche", name: "911", slug: "911", image: "/images/cars/porsche/911-1.jpg", startingPrice: 42000 },
  // Land Rover
  { id: "lr-defender", brandId: "land-rover", name: "Defender", slug: "defender", image: "/images/cars/land-rover/defender-1.jpg", startingPrice: 24000 },
  { id: "lr-range-rover", brandId: "land-rover", name: "Range Rover", slug: "range-rover", image: "/images/cars/land-rover/range-rover-1.jpg", startingPrice: 38000 },
  { id: "lr-sport", brandId: "land-rover", name: "Range Rover Sport", slug: "range-rover-sport", image: "/images/cars/land-rover/rr-sport-1.jpg", startingPrice: 29000 },
];
```

**Step 5: Create trim and variant data**

Create `src/data/trims.ts` with 2-4 trims per model. Each trim has 1-3 variants. Include at least one trim with >7 variants to exercise the variant listing page.

Populate realistic specs for each variant: engine sizes, HP, torque, transmission, drivetrain, dimensions, fuel data, features, colors. Prices in KWD.

This file will be large (~500-800 lines). Generate it with realistic data for all brands. Each `Trim` object contains its `TrimVariant[]` array inline.

**Step 6: Create data index with helper functions**

Create `src/data/index.ts`:

```ts
import { brands } from "./brands";
import { models } from "./models";
import { trims } from "./trims";
import { Brand, Model, Trim, TrimVariant } from "@/types";

export function getAllBrands(): Brand[] {
  return brands;
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getModelsByBrandId(brandId: string): Model[] {
  return models.filter((m) => m.brandId === brandId);
}

export function getModelById(modelId: string): Model | undefined {
  return models.find((m) => m.id === modelId);
}

export function getTrimsByBrandId(brandId: string): Trim[] {
  return trims.filter((t) => t.brandId === brandId);
}

export function getTrimsByModelIds(modelIds: string[]): Trim[] {
  if (modelIds.length === 0) return [];
  return trims.filter((t) => modelIds.includes(t.modelId));
}

export function getTrimById(trimId: string): Trim | undefined {
  return trims.find((t) => t.id === trimId);
}

export function getVariantById(trimId: string, variantId: string): TrimVariant | undefined {
  const trim = getTrimById(trimId);
  return trim?.variants.find((v) => v.id === variantId);
}
```

**Step 7: Verify types compile**

```bash
npx tsc --noEmit
```

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: add TypeScript types, mock data with real images for 6 brands"
```

---

## Task 3: Shared Components (Skeleton, Breadcrumb, Chip)

**Files:**
- Create: `src/components/Skeleton/Skeleton.tsx`
- Create: `src/components/Skeleton/Skeleton.module.css`
- Create: `src/components/Breadcrumb/Breadcrumb.tsx`
- Create: `src/components/Breadcrumb/Breadcrumb.module.css`
- Create: `src/components/Chip/Chip.tsx`
- Create: `src/components/Chip/Chip.module.css`

**Step 1: Build Skeleton component**

The shimmer loading skeleton used across the app. Must match the design system signature: `translateX(-100%)` to `translateX(calc(100% + 100px))` at 1.5s linear infinite.

`Skeleton.tsx`:
```tsx
import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
}

export default function Skeleton({ width = "100%", height = "16px", borderRadius = "4px" }: SkeletonProps) {
  return (
    <div className={styles.skeleton} style={{ width, height, borderRadius }}>
      <div className={styles.shimmer} />
    </div>
  );
}
```

`Skeleton.module.css`:
```css
.skeleton {
  background-color: var(--neutral_100);
  position: relative;
  overflow: hidden;
}

.shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmer 1.5s linear infinite;
}
```

**Step 2: Build Breadcrumb component**

`Breadcrumb.tsx`:
```tsx
import Link from "next/link";
import styles from "./Breadcrumb.module.css";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className={styles.breadcrumb}>
      {items.map((item, i) => (
        <span key={i}>
          {item.href ? (
            <Link href={item.href} className={styles.link}>{item.label}</Link>
          ) : (
            <span className={styles.current}>{item.label}</span>
          )}
          {i < items.length - 1 && <span className={styles.separator}>&gt;</span>}
        </span>
      ))}
    </nav>
  );
}
```

`Breadcrumb.module.css`:
```css
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 400;
}

.link {
  color: var(--neutral_500);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease-in-out;
}

.link:hover {
  color: var(--prim_500);
}

.separator {
  color: var(--neutral_400);
  font-size: 12px;
}

.current {
  color: var(--neutral_700);
}
```

**Step 3: Build Chip component**

Reusable chip matching design system: border-based states, `::before` hover overlay at 0.08 opacity, 0.2s ease-in-out.

`Chip.tsx`:
```tsx
"use client";

import styles from "./Chip.module.css";

interface ChipProps {
  label: string;
  active?: boolean;
  onToggle?: () => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

export default function Chip({ label, active = false, onToggle, onRemove, showRemove = false }: ChipProps) {
  return (
    <button
      className={`${styles.chip} ${active ? styles.active : ""}`}
      onClick={onToggle}
      type="button"
    >
      <span className={styles.label}>{label}</span>
      {showRemove && (
        <span
          className={styles.remove}
          onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
          role="button"
          tabIndex={0}
        >
          x
        </span>
      )}
    </button>
  );
}
```

`Chip.module.css`:
```css
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--neutral_100);
  border-radius: 100px;
  background: var(--shades_0);
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  color: var(--neutral_700);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
}

.chip::before {
  content: "";
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.chip:hover::before {
  opacity: 0.08;
}

.chip:hover {
  border-color: var(--neutral_400);
}

.active {
  background: var(--prim_100);
  border-color: var(--prim_500);
  color: var(--prim_500);
}

.active:hover {
  border-color: var(--prim_600);
}

.remove {
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
}

.label {
  position: relative;
  z-index: 1;
}
```

**Step 4: Verify build**

```bash
npm run build
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Skeleton, Breadcrumb, and Chip shared components"
```

---

## Task 4: Home Page -- Brand Selection Grid

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/app/page.module.css`
- Create: `src/components/BrandCard/BrandCard.tsx`
- Create: `src/components/BrandCard/BrandCard.module.css`

**Step 1: Build BrandCard component**

`BrandCard.tsx`:
```tsx
import Link from "next/link";
import Image from "next/image";
import styles from "./BrandCard.module.css";
import { Brand } from "@/types";

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link href={`/brands/${brand.slug}`} className={styles.card}>
      <div className={styles.logoWrap}>
        <Image src={brand.logo} alt={brand.name} width={64} height={64} className={styles.logo} />
      </div>
      <span className={styles.name}>{brand.name}</span>
    </Link>
  );
}
```

`BrandCard.module.css`:
```css
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px 16px;
  background: var(--shades_0);
  border: 1px solid var(--neutral_100);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}

.card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--neutral_900);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.card:hover::before {
  opacity: 0.08;
}

.logoWrap {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.logo {
  object-fit: contain;
}

.name {
  font-size: 14px;
  font-weight: 700;
  color: var(--neutral_900);
  position: relative;
  z-index: 1;
}
```

**Step 2: Build Home page**

`src/app/page.tsx`:
```tsx
import styles from "./page.module.css";
import BrandCard from "@/components/BrandCard/BrandCard";
import { getAllBrands } from "@/data";

export default function HomePage() {
  const brands = getAllBrands();

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>New Cars</h1>
        <div className={styles.grid}>
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </main>
  );
}
```

`src/app/page.module.css`:
```css
.main {
  min-height: 100vh;
  background: var(--neutral_50);
}

.container {
  max-width: 700px;
  margin: 0 auto;
  padding: 24px 16px;
}

.title {
  margin-bottom: 24px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

**Step 3: Verify in browser**

```bash
npm run dev
```

Open http://localhost:3000 -- should see "New Cars" title and a 2-column grid of brand cards. Tap one to navigate (will 404 for now -- that is expected).

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add home page with brand selection grid"
```

---

## Task 5: Card-Stack Component Integration

**Files:**
- Create: `src/components/ModelCarousel/CardStack.tsx`
- Create: `src/components/ModelCarousel/CardStack.module.css`
- Create: `src/components/ModelCarousel/ModelCarousel.tsx`
- Create: `src/components/ModelCarousel/ModelCarousel.module.css`

**Step 1: Install the card-stack component**

```bash
npx shadcn@latest add https://21st.dev/r/ruixen.ui/card-stack
```

If this fails or requires shadcn setup, manually create the component based on the 21st.dev source. The key dependencies are Framer Motion (already installed) and the component code itself. Adapt imports to match our project structure.

**Step 2: Create ModelCarousel wrapper**

This wraps the card-stack with our model data and adds multi-select behavior. Each card renders a model image, name, and starting price. Tapping toggles selection (blue ring). A chip row below shows selected models.

`ModelCarousel.tsx`:
```tsx
"use client";

import { useState, useCallback } from "react";
import { Model } from "@/types";
import Chip from "@/components/Chip/Chip";
import styles from "./ModelCarousel.module.css";
// Import CardStack -- path depends on how Step 1 resolves
// import { CardStack } from "./CardStack";

interface ModelCarouselProps {
  models: Model[];
  selectedModelIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export default function ModelCarousel({ models, selectedModelIds, onSelectionChange }: ModelCarouselProps) {
  const toggleModel = useCallback((modelId: string) => {
    onSelectionChange(
      selectedModelIds.includes(modelId)
        ? selectedModelIds.filter((id) => id !== modelId)
        : [...selectedModelIds, modelId]
    );
  }, [selectedModelIds, onSelectionChange]);

  const removeModel = useCallback((modelId: string) => {
    onSelectionChange(selectedModelIds.filter((id) => id !== modelId));
  }, [selectedModelIds, onSelectionChange]);

  // Render each card in the stack with model info and selected state
  const renderCard = (model: Model) => {
    const isSelected = selectedModelIds.includes(model.id);
    return (
      <div
        className={`${styles.modelCard} ${isSelected ? styles.selected : ""}`}
        onClick={() => toggleModel(model.id)}
      >
        <img src={model.image} alt={model.name} className={styles.modelImage} />
        <div className={styles.modelInfo}>
          <h3 className={styles.modelName}>{model.name}</h3>
          <p className={styles.modelPrice}>From KWD {model.startingPrice.toLocaleString()}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      {/* CardStack integration here -- pass models as items, renderCard as custom renderer */}
      {/* Exact API depends on Step 1 resolution */}
      <div className={styles.cardStackPlaceholder}>
        {/* Temporary: render cards in a horizontal scroll until CardStack is integrated */}
        <div className={styles.tempScroll}>
          {models.map((model) => (
            <div key={model.id}>{renderCard(model)}</div>
          ))}
        </div>
      </div>

      {selectedModelIds.length > 0 && (
        <div className={styles.selectedChips}>
          {selectedModelIds.map((id) => {
            const model = models.find((m) => m.id === id);
            if (!model) return null;
            return (
              <Chip
                key={id}
                label={model.name}
                active
                showRemove
                onRemove={() => removeModel(id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
```

`ModelCarousel.module.css`:
```css
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modelCard {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  border: 3px solid transparent;
  transition: border-color 0.2s ease-in-out;
}

.selected {
  border-color: var(--prim_500);
}

.modelImage {
  width: 100%;
  height: 70%;
  object-fit: cover;
}

.modelInfo {
  padding: 12px 16px;
  background: var(--shades_0);
}

.modelName {
  font-size: 16px;
  font-weight: 700;
  color: var(--neutral_900);
}

.modelPrice {
  font-size: 14px;
  font-weight: 500;
  color: var(--neutral_500);
  margin-top: 4px;
}

.selectedChips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tempScroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.tempScroll > div {
  min-width: 280px;
}

.cardStackPlaceholder {
  min-height: 320px;
}
```

**Step 3: Verify card-stack renders**

```bash
npm run dev
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add ModelCarousel with card-stack integration and multi-select"
```

---

## Task 6: Brand Page -- Layout, Filters, and Trim Feed

**Files:**
- Create: `src/app/brands/[slug]/page.tsx`
- Create: `src/app/brands/[slug]/page.module.css`
- Create: `src/components/TrimCard/TrimCard.tsx`
- Create: `src/components/TrimCard/TrimCard.module.css`
- Create: `src/components/FilterRow/FilterRow.tsx`
- Create: `src/components/FilterRow/FilterRow.module.css`
- Create: `src/components/BottomSheet/BottomSheet.tsx`
- Create: `src/components/BottomSheet/BottomSheet.module.css`
- Create: `src/components/TrimFeed/TrimFeed.tsx`
- Create: `src/components/TrimFeed/TrimFeed.module.css`

**Step 1: Build TrimCard**

Horizontal layout: image left, text right. Trim name (h4), model subtitle, starting price, spec tags. Border bottom separator. Links to trim detail.

**Step 2: Build BottomSheet**

Slides up from bottom with `translateY(100%)` to `translateY(0)`, 0.3s ease-in-out. Overlay at 0.5 opacity. Requires explicit close (X button or tap overlay). This is the container for filter options.

**Step 3: Build FilterRow**

Horizontal scrollable row of Chip components. Filters: Price range, Year, Body type, Engine type, Drivetrain, Transmission. Tapping a chip opens the BottomSheet with relevant options. Active filters use `--prim_100` bg / `--prim_500` border.

**Step 4: Build TrimFeed**

Takes an array of trims, renders TrimCards in a vertical list. Shows shimmer skeletons during loading state (when model selection changes). Accepts filter criteria to narrow results.

**Step 5: Assemble Brand Page**

`src/app/brands/[slug]/page.tsx` -- server component that fetches brand data, wraps the interactive parts in a client component:

```tsx
import { getBrandBySlug, getModelsByBrandId, getTrimsByBrandId } from "@/data";
import { notFound } from "next/navigation";
import BrandPageClient from "./BrandPageClient";

export default function BrandPage({ params }: { params: { slug: string } }) {
  const brand = getBrandBySlug(params.slug);
  if (!brand) notFound();

  const models = getModelsByBrandId(brand.id);
  const trims = getTrimsByBrandId(brand.id);

  return <BrandPageClient brand={brand} models={models} trims={trims} />;
}
```

Create `BrandPageClient.tsx` as a `"use client"` component that manages:
- Model selection state (multi-select from carousel)
- Filter state
- Derived trim list (filtered by selected models + active filters)
- Shimmer loading transition when selection changes

**Step 6: Verify in browser**

Navigate from home page to a brand. Carousel should show models, tapping selects them, feed updates below, filters work.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add brand page with model carousel, filters, and trim feed"
```

---

## Task 7: Variant Listing Page (Conditional >7 Variants)

**Files:**
- Create: `src/app/brands/[slug]/[trimId]/page.tsx`
- Create: `src/app/brands/[slug]/[trimId]/page.module.css`
- Create: `src/components/VariantCard/VariantCard.tsx`
- Create: `src/components/VariantCard/VariantCard.module.css`

**Step 1: Build VariantCard**

Same horizontal layout rhythm as TrimCard: image left, variant name + price right. Links to `/brands/[slug]/[trimId]/[variantId]`.

**Step 2: Build the routing logic**

`src/app/brands/[slug]/[trimId]/page.tsx`:

This page does double duty based on variant count:
- If trim has >7 variants: render variant listing
- If trim has <=7 variants: render details page with variant chip selector

```tsx
import { getBrandBySlug, getTrimById } from "@/data";
import { notFound } from "next/navigation";
import VariantListing from "./VariantListing";
import DetailsPage from "./DetailsPage";

export default function TrimPage({ params }: { params: { slug: string; trimId: string } }) {
  const brand = getBrandBySlug(params.slug);
  const trim = getTrimById(params.trimId);
  if (!brand || !trim) notFound();

  if (trim.variants.length > 7) {
    return <VariantListing brand={brand} trim={trim} />;
  }

  return <DetailsPage brand={brand} trim={trim} />;
}
```

**Step 3: Build VariantListing component**

Shows h1 trim name, breadcrumb (Brand > Model > Trim), and vertical list of VariantCards.

**Step 4: Verify routing**

Navigate to a trim with >7 variants -- should show variant listing. Navigate to a trim with <=7 -- should show details page (built in next task).

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add variant listing page for trims with >7 variants"
```

---

## Task 8: Details Page

**Files:**
- Create: `src/app/brands/[slug]/[trimId]/DetailsPage.tsx`
- Create: `src/app/brands/[slug]/[trimId]/DetailsPage.module.css`
- Create: `src/app/brands/[slug]/[trimId]/[variantId]/page.tsx`
- Create: `src/components/ImageGallery/ImageGallery.tsx`
- Create: `src/components/ImageGallery/ImageGallery.module.css`
- Create: `src/components/VariantSelector/VariantSelector.tsx`
- Create: `src/components/VariantSelector/VariantSelector.module.css`
- Create: `src/components/ColorSwatches/ColorSwatches.tsx`
- Create: `src/components/ColorSwatches/ColorSwatches.module.css`
- Create: `src/components/SpecsSection/SpecsSection.tsx`
- Create: `src/components/SpecsSection/SpecsSection.module.css`

**Step 1: Build ImageGallery**

Full-width Swiper carousel. Edge-to-edge on mobile. 16:9 aspect ratio, capped height on desktop. Dot pagination. Swipe on mobile, arrows on desktop hover.

```tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import styles from "./ImageGallery.module.css";

export default function ImageGallery({ images }: { images: string[] }) {
  return (
    <div className={styles.gallery}>
      <Swiper
        modules={[Pagination, Navigation]}
        pagination={{ clickable: true }}
        navigation
        className={styles.swiper}
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <img src={src} alt={`View ${i + 1}`} className={styles.image} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
```

**Step 2: Build VariantSelector**

Horizontal scrollable chip row. Each chip: variant name + " - KWD X,XXX". Selected chip: `--prim_500` bg, white text. Unselected: white bg, `--neutral_100` border. Switching triggers shimmer and updates all content below.

**Step 3: Build ColorSwatches**

Small circles with actual color hex fills. Selected swatch gets a `--prim_500` ring (2px outline offset). Interactive -- tapping selects a color.

**Step 4: Build SpecsSection**

Two-column key-value grid grouped by category (Performance, Dimensions, Comfort, Fuel). On mobile (<640px): single column, label above value. On tablet+: two columns side by side.

**Step 5: Assemble DetailsPage component**

Composes: Breadcrumb, ImageGallery, VariantSelector (if <=7 variants), title/price block, ColorSwatches, SpecsSection. Manages active variant state.

**Step 6: Build the variantId route**

`src/app/brands/[slug]/[trimId]/[variantId]/page.tsx` -- for direct variant access (from variant listing). Renders the same DetailsPage but with a fixed variant (no selector).

**Step 7: Verify full flow**

Test the complete journey:
1. Home -- tap Mercedes-Benz
2. Brand page -- select C-Class from carousel, see trims in feed
3. Tap a trim -- lands on details (or variant listing if >7)
4. Details page -- variant selector works, color swatches work, specs render

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: add details page with image gallery, variant selector, colors, and specs"
```

---

## Task 9: Responsive Polish and Final Touches

**Files:**
- Modify: all `.module.css` files as needed
- Modify: `src/app/globals.css` (add any missing responsive utilities)

**Step 1: Mobile testing**

Open Chrome DevTools, test at 375px width. Walk through every page:
- Home: 2-col grid, tap targets >= 44px
- Brand page: carousel scales, chips wrap, feed cards readable, bottom sheets slide up correctly
- Variant listing: cards fill width
- Details: images edge-to-edge, specs stack to single column, variant chips scroll horizontally

Fix any spacing, overflow, or touch target issues found.

**Step 2: Tablet testing**

Test at 768px. Home grid goes to 3-col. Brand page has more breathing room. Details specs stay two-column.

**Step 3: Desktop testing**

Test at 1280px. Container caps at 700px centered. 4-col home grid. Everything centered and readable.

**Step 4: Verify shimmer loading**

When changing model selection on brand page, the feed should show skeleton cards with the shimmer animation for a brief moment before the new trims appear. Add a small artificial delay (200-300ms) if the data swap is instant, to let the shimmer be visible.

**Step 5: Verify all animations match design system**

- Chip hovers: 0.2s ease-in-out
- Bottom sheet: `translateY` slide, 0.3s ease-in-out
- Overlay: opacity 0 to 0.5, 0.3s ease-in-out
- Shimmer: 1.5s linear infinite

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: responsive polish and animation verification across all breakpoints"
```

---

## Task Summary

| Task | What | Key Files |
|------|------|-----------|
| 1 | Project scaffolding, tokens, fonts | `globals.css`, `layout.tsx` |
| 2 | Types + mock data + real images | `src/types/`, `src/data/`, `public/images/` |
| 3 | Shared components (Skeleton, Breadcrumb, Chip) | `src/components/` |
| 4 | Home page (brand grid) | `src/app/page.tsx` |
| 5 | Card-stack + ModelCarousel | `src/components/ModelCarousel/` |
| 6 | Brand page (carousel + filters + feed) | `src/app/brands/[slug]/` |
| 7 | Variant listing (>7 variants) | `src/app/brands/[slug]/[trimId]/` |
| 8 | Details page (gallery, selector, specs) | Details + variant route |
| 9 | Responsive polish | All CSS modules |
