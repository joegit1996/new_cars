/**
 * seed-mercedes.ts
 *
 * Imports ONLY Mercedes-Benz data (brand, models, trims, equipment,
 * trim-variants, dealers) from mock-data.ts to the staging backend.
 *
 * Run with:  npx tsx scripts/seed-mercedes.ts
 *
 * Uses cached media-url-map.json for image URLs (SKIP_UPLOAD=1 by default).
 * Set SEED_API_KEY env var for auth if needed.
 */

import * as fs from "fs";
import * as path from "path";
import { brands, models, trims, branches } from "../src/data/mock-data";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const API_BASE = "https://staging-services.q84sale.com/api/v1/new-cars-catalog";
const API_KEY = process.env.SEED_API_KEY ?? "";
const MEDIA_MAP_FILE = path.resolve(__dirname, "media-url-map.json");

// The backend uses "mercedes-benz" as the brand code, but our mock data uses "mercedes".
// Remap all brand_code references to match the backend.
const BRAND_CODE = "mercedes-benz";

// ---------------------------------------------------------------------------
// Filter Mercedes-only data
// ---------------------------------------------------------------------------

const mercBrand = brands.filter((b) => b.id === "mercedes");
const mercModelIds = new Set(models.filter((m) => m.brandId === "mercedes").map((m) => m.id));
const mercModels = models.filter((m) => m.brandId === "mercedes");
const mercTrims = trims.filter((t) => mercModelIds.has(t.modelId));
const mercBranches = branches.filter((b) => b.brandId === "all" || b.brandId === "mercedes");

console.log("=".repeat(70));
console.log("[SEED] Mercedes-Benz only import");
console.log(`[SEED] Brand:          ${mercBrand.length}`);
console.log(`[SEED] Models:         ${mercModels.length}`);
console.log(`[SEED] Trims:          ${mercTrims.length}`);
console.log(`[SEED] Trim Variants:  ${mercTrims.reduce((s, t) => s + t.variants.length, 0)}`);
console.log(`[SEED] Equipment:      ${mercTrims.reduce((s, t) => s + t.equipment.length, 0)} items`);
console.log(`[SEED] Dealers:        ${mercBranches.length} branch records`);
console.log("=".repeat(70));

// ---------------------------------------------------------------------------
// Media URL mapping (use cached file)
// ---------------------------------------------------------------------------

let mediaUrlMap: Record<string, string> = {};
try {
  mediaUrlMap = JSON.parse(fs.readFileSync(MEDIA_MAP_FILE, "utf-8"));
  console.log(`[MEDIA] Loaded ${Object.keys(mediaUrlMap).length} cached URL mappings`);
} catch {
  console.warn("[MEDIA] No media-url-map.json found -- URLs will use local path fallback");
}

function resolveMedia(localPath: string): string {
  if (!localPath) return "";
  if (mediaUrlMap[localPath]) return mediaUrlMap[localPath];
  return localPath.replace(/^\/+/, "");
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface BatchResult {
  created: number;
  updated: number;
  failed: number;
  errors?: { index: number; code: string; message: string }[];
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postImport(
  endpoint: string,
  payload: unknown[],
  label: string,
): Promise<BatchResult | null> {
  const url = `${API_BASE}${endpoint}`;
  console.log(`\n[${"=".repeat(60)}]`);
  console.log(`[SEED] ${label}`);
  console.log(`[SEED] POST ${url}`);
  console.log(`[SEED] Payload size: ${payload.length} items`);

  const MAX_RETRIES = 3;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if (API_KEY) headers["Authorization"] = `Bearer ${API_KEY}`;

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      if (res.status >= 502 && res.status <= 504 && attempt < MAX_RETRIES) {
        console.warn(`[SEED] ${res.status} -- retrying (${attempt}/${MAX_RETRIES})...`);
        await sleep(3000);
        continue;
      }

      let body: Record<string, unknown>;
      try {
        body = JSON.parse(text);
      } catch {
        console.error(`[SEED] Non-JSON response (${res.status}): ${text.slice(0, 500)}`);
        return null;
      }

      if (!res.ok) {
        console.error(`[SEED] HTTP ${res.status}: ${(body.message ?? body.error ?? text.slice(0, 500)) as string}`);
        return null;
      }

      const result = (body.data ?? body) as BatchResult;
      console.log(`[SEED] Result -- created: ${result.created ?? 0}, updated: ${result.updated ?? 0}, failed: ${result.failed ?? 0}`);
      if (result.errors && result.errors.length > 0) {
        for (const err of result.errors.slice(0, 10)) {
          console.error(`  [ERR] index=${err.index} code=${err.code} msg=${err.message}`);
        }
      }
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (attempt < MAX_RETRIES) {
        console.warn(`[SEED] Network error: ${msg}. Retrying...`);
        await sleep(3000);
        continue;
      }
      console.error(`[SEED] Network error after ${MAX_RETRIES} attempts: ${msg}`);
      return null;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// JSON fetch helper (for public GET endpoints)
// ---------------------------------------------------------------------------

async function fetchJson(url: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function getBrandNumericId(): Promise<number> {
  const data = await fetchJson(`${API_BASE}/v1/public/brands`);
  const brands = (data?.data ?? []) as Record<string, unknown>[];
  const merc = brands.find((b) => b.code === BRAND_CODE);
  return (merc?.id as number) ?? 0;
}

async function getModelIdsFromHome(): Promise<number[]> {
  const data = await fetchJson(`${API_BASE}/v1/public/home`);
  const home = (data?.data ?? {}) as Record<string, unknown[]>;
  const ids = new Set<number>();
  for (const section of ["whats_new", "featured_models"]) {
    for (const item of (home[section] ?? []) as Record<string, unknown>[]) {
      if ((item.brand_id as number) === (await getBrandNumericId())) {
        ids.add(item.id as number);
      }
    }
  }
  return [...ids];
}

// ---------------------------------------------------------------------------
// Mappers (Mercedes subset of the full seed-backend mappers)
// ---------------------------------------------------------------------------

function mapBrands() {
  return mercBrand.map((b, idx) => {
    const editorial = b.editorial;
    const payload: Record<string, unknown> = {
      code: BRAND_CODE,
      name_en: b.name,
      slug: slugify(b.name),
      is_featured: b.featured ?? false,
      logo_key: resolveMedia(b.logoUrl),
      sort_order: idx + 1,
      status: "active",
    };

    if (b.tagline) payload.tagline_en = b.tagline;
    if (b.heroMedia) {
      payload.hero_media_type = b.heroMedia.type;
      payload.hero_media_key = resolveMedia(b.heroMedia.url);
    }

    if (editorial) {
      payload.hero_gradient = editorial.heroGradient;
      payload.story_en = editorial.story;
      if (editorial.heritage) {
        payload.heritage_title_en = editorial.heritage.title;
        payload.heritage_description_en = editorial.heritage.description;
        payload.heritage_founded = editorial.heritage.founded;
        payload.heritage_milestone_en = editorial.heritage.milestone;
      }
      if (editorial.innovationTitle) payload.innovation_title_en = editorial.innovationTitle;
      if (editorial.innovationDescription) payload.innovation_description_en = editorial.innovationDescription;
      if (editorial.sustainability) payload.sustainability_en = editorial.sustainability;
      if (editorial.stats) payload.editorial_stats = editorial.stats;
      if (editorial.serviceLinks) payload.service_links = editorial.serviceLinks;
    }

    if (b.editorialImages) {
      if (b.editorialImages.heritage) payload.heritage_image_key = resolveMedia(b.editorialImages.heritage);
      if (b.editorialImages.innovation) payload.innovation_image_key = resolveMedia(b.editorialImages.innovation);
    }

    return payload;
  });
}

function mapModels() {
  return mercModels.map((m, idx) => {
    const images: { image_key: string; alt_en: string; category: string; sort_order: number }[] = [];
    if (m.images) {
      const imgEntries = Object.entries(m.images) as [string, string][];
      imgEntries.forEach(([category, url], i) => {
        if (url) {
          images.push({
            image_key: resolveMedia(url),
            alt_en: `${m.name} ${category}`,
            category,
            sort_order: i + 1,
          });
        }
      });
    }

    return {
      brand_code: BRAND_CODE,
      code: m.id,
      name_en: m.name,
      slug: slugify(`${BRAND_CODE}-${m.name}`),
      model_year: m.year,
      body_style_code: m.bodyType.toLowerCase(),
      starting_price: m.startingPrice,
      is_new: m.isNew,
      is_updated: m.isUpdated,
      is_featured: m.featured,
      hero_image_key: resolveMedia(m.imageUrl),
      family_code: m.modelFamily ? slugify(m.modelFamily) : "",
      segment_order: m.segmentOrder ?? idx + 1,
      currency: "KWD",
      status: "active",
      publish_state: "published",
      images,
      metadata: {
        specs_summary: m.specsSummary,
        model_family: m.modelFamily ?? null,
      },
    };
  });
}

function mapTrims() {
  return mercTrims.map((t, idx) => {
    const specs = t.specs;
    const images = (t.images ?? []).map((url, i) => ({
      image_key: resolveMedia(url),
      alt_en: `${t.name} view ${i + 1}`,
      category: i === 0 ? "hero" : "gallery",
      sort_order: i + 1,
    }));

    const payload: Record<string, unknown> = {
      model_code: t.modelId,
      variant_code: t.id,
      display_name_en: t.name,
      slug: slugify(t.id),
      starting_price: t.price,
      currency: "KWD",
      engine_summary: t.engineSummary,
      fuel_type: t.fuelType.toLowerCase(),
      horsepower: t.horsepower,
      torque: t.torque,
      transmission: specs.transmission.toLowerCase(),
      drivetrain: specs.driveType,
      seats: specs.seatingCapacity,
      spec_region: specs.specRegion,
      hero_image_key: resolveMedia(t.images?.[0] ?? ""),
      sort_order: idx + 1,
      images,
      is_default: idx === 0 || t.name === "Standard" || t.name === "Avantgarde",
      metadata: {
        specs: {
          engine_type: specs.engineType,
          displacement: specs.displacement,
          cylinders: specs.cylinders,
          zero_to_hundred: specs.zeroToHundred,
          top_speed: specs.topSpeed,
          fuel_economy_city: specs.fuelEconomyCity,
          fuel_economy_highway: specs.fuelEconomyHighway,
          fuel_economy_combined: specs.fuelEconomyCombined,
          length_mm: specs.lengthMm,
          width_mm: specs.widthMm,
          height_mm: specs.heightMm,
          wheelbase_mm: specs.wheelbaseMm,
          trunk_volume_liters: specs.trunkVolumeLiters,
          curb_weight_kg: specs.curbWeightKg,
          fuel_tank_liters: specs.fuelTankLiters,
          warranty: specs.warranty,
        },
      },
    };

    if (t.leadFormUrl) payload.lead_form_url = t.leadFormUrl;
    if (t.websiteUrl) payload.website_url = t.websiteUrl;

    return payload;
  });
}

function mapEquipment() {
  const items: Record<string, unknown>[] = [];
  for (const t of mercTrims) {
    for (let i = 0; i < t.equipment.length; i++) {
      const eq = t.equipment[i];
      items.push({
        trim_code: t.id,
        name_en: eq.name,
        category: eq.category.toLowerCase(),
        is_standard: eq.isStandard,
        is_optional: !eq.isStandard,
        sort_order: i + 1,
      });
    }
  }
  return items;
}

function mapTrimVariants() {
  const items: Record<string, unknown>[] = [];
  for (const t of mercTrims) {
    for (const v of t.variants) {
      items.push({
        trim_code: v.trimId,
        code: v.id,
        name_en: v.name,
        price: v.price,
        currency: "KWD",
        slug: slugify(v.id),
        description_en: v.description ?? "",
        hero_image_key: resolveMedia(v.images?.[0] ?? ""),
      });
    }
  }
  return items;
}

function mapDealers() {
  const items: Record<string, unknown>[] = [];
  for (const b of mercBranches) {
    let latitude = 0;
    let longitude = 0;
    const coordMatch = b.mapUrl.match(/q=([\d.-]+),([\d.-]+)/);
    if (coordMatch) {
      latitude = parseFloat(coordMatch[1]);
      longitude = parseFloat(coordMatch[2]);
    }

    if (b.brandId === "all") {
      items.push({
        brand_code: BRAND_CODE,
        code: `${b.id}-${BRAND_CODE}`,
        name_en: b.name,
        address_en: b.location,
        phone: b.phone,
        map_url: b.mapUrl,
        latitude,
        longitude,
      });
    } else {
      items.push({
        brand_code: b.brandId,
        code: b.id,
        name_en: b.name,
        address_en: b.location,
        phone: b.phone,
        map_url: b.mapUrl,
        latitude,
        longitude,
      });
    }
  }
  return items;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const results: { step: string; result: BatchResult | null }[] = [];

  // 1. Brand
  const brandResult = await postImport("/v1/admin/import/brands", mapBrands(), "Step 1/7: Import Mercedes Brand");
  results.push({ step: "Brand", result: brandResult });
  await sleep(1000);

  // 2. Models
  const modelResult = await postImport("/v1/admin/import/models", mapModels(), "Step 2/7: Import Mercedes Models");
  results.push({ step: "Models", result: modelResult });
  await sleep(1000);

  // 3. Trims
  const trimResult = await postImport("/v1/admin/import/trims", mapTrims(), "Step 3/7: Import Mercedes Trims");
  results.push({ step: "Trims", result: trimResult });
  await sleep(1000);

  // 4. Equipment
  const equipPayload = mapEquipment();
  const equipResult = await postImport("/v1/admin/import/equipment", equipPayload, "Step 4/7: Import Mercedes Equipment");
  results.push({ step: "Equipment", result: equipResult });
  await sleep(1000);

  // 5. Trim Variants
  const variantPayload = mapTrimVariants();
  let variantResult: BatchResult | null = null;
  if (variantPayload.length > 0) {
    variantResult = await postImport("/v1/admin/import/trim-variants", variantPayload, "Step 5/7: Import Mercedes Trim Variants");
  } else {
    console.log("\n[SEED] Step 5/7: No Mercedes trim variants to import (none defined).");
  }
  results.push({ step: "Trim Variants", result: variantResult });
  await sleep(1000);

  // 6. Dealers
  const dealerResult = await postImport("/v1/admin/import/dealers", mapDealers(), "Step 6/7: Import Mercedes Dealers");
  results.push({ step: "Dealers", result: dealerResult });

  // 6.5. Trigger search index by PATCHing each model via admin CRUD
  // The import endpoint doesn't trigger the search index; admin PATCH does.
  console.log(`\n[${"=".repeat(60)}]`);
  console.log("[SEED] Step 6.5: Trigger search index (PATCH models)");
  const browseResult = await fetchJson(`${API_BASE}/v1/public/browse?brand_id=${await getBrandNumericId()}&per_page=100`);
  const browseItems = (browseResult?.data as Record<string, unknown>)?.items as Array<Record<string, unknown>> ?? [];
  const modelIds = browseItems.length > 0
    ? browseItems.map((item: Record<string, unknown>) => item.id as number)
    : await getModelIdsFromHome();

  let patchOk = 0;
  for (const mid of modelIds) {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if (API_KEY) headers["Authorization"] = `Bearer ${API_KEY}`;

      const res = await fetch(`${API_BASE}/v1/admin/models/${mid}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ publish_state: "published" }),
      });
      if (res.ok) patchOk++;
    } catch { /* skip */ }
  }
  console.log(`[SEED] PATCHed ${patchOk}/${modelIds.length} models for search indexing`);
  await sleep(2000);

  // 7. Publish
  console.log(`\n[${"=".repeat(60)}]`);
  console.log("[SEED] Step 7/7: Publish all content");

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (API_KEY) headers["Authorization"] = `Bearer ${API_KEY}`;

    const publishRes = await fetch(`${API_BASE}/v1/admin/publish`, {
      method: "POST",
      headers,
      body: JSON.stringify({ external_surface: "web", is_published: true }),
    });

    const publishText = await publishRes.text();
    if (publishRes.ok) {
      console.log(`[SEED] Publish response (${publishRes.status}): ${publishText.slice(0, 300)}`);
    } else {
      console.error(`[SEED] Publish failed (${publishRes.status}): ${publishText.slice(0, 500)}`);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[SEED] Publish error: ${msg}`);
  }

  // Summary
  console.log(`\n${"=".repeat(70)}`);
  console.log("[SEED] MERCEDES IMPORT SUMMARY");
  console.log("=".repeat(70));

  let totalCreated = 0, totalUpdated = 0, totalFailed = 0;
  for (const { step, result } of results) {
    if (result) {
      const c = result.created ?? 0;
      const u = result.updated ?? 0;
      const f = result.failed ?? 0;
      totalCreated += c;
      totalUpdated += u;
      totalFailed += f;
      console.log(`  ${step.padEnd(20)} created=${String(c).padStart(4)}  updated=${String(u).padStart(4)}  failed=${String(f).padStart(4)}  [${f > 0 ? "PARTIAL" : "OK"}]`);
    } else {
      console.log(`  ${step.padEnd(20)} -- SKIPPED or FAILED --`);
    }
  }

  console.log("-".repeat(70));
  console.log(`  ${"TOTAL".padEnd(20)} created=${String(totalCreated).padStart(4)}  updated=${String(totalUpdated).padStart(4)}  failed=${String(totalFailed).padStart(4)}`);
  console.log("=".repeat(70));

  if (totalFailed > 0) {
    console.log("\n[SEED] Completed with errors.");
    process.exit(1);
  } else {
    console.log("\n[SEED] Mercedes seed completed successfully.");
  }
}

main().catch((err) => {
  console.error("[SEED] Fatal error:", err);
  process.exit(1);
});
