/**
 * seed-backend.ts
 *
 * Reads ALL mock data from src/data/mock-data.ts and uploads it to the
 * staging backend via the admin import endpoints.
 *
 * Run with:  npx tsx scripts/seed-backend.ts
 *
 * Endpoints are called in dependency order:
 *   1. brands
 *   2. models
 *   3. trims
 *   4. equipment  (parallel with variants and dealers)
 *   5. trim-variants
 *   6. dealers
 *   7. publish (final)
 */

import { brands, models, trims, branches } from "../src/data/mock-data";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const API_BASE = "https://staging-services.q84sale.com/api/v1/new-cars-catalog";

// Set via env var if you need auth; the script will still run without it.
const API_KEY = process.env.SEED_API_KEY ?? "";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface BatchResult {
  created: number;
  updated: number;
  failed: number;
  errors?: { index: number; code: string; message: string }[];
}

interface ApiResponse {
  data?: BatchResult;
  error?: string;
  message?: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

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

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if (API_KEY) {
        headers["Authorization"] = `Bearer ${API_KEY}`;
      }

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      // Retry on 502/503/504
      if (res.status >= 502 && res.status <= 504 && attempt < MAX_RETRIES) {
        console.warn(`[SEED] Received ${res.status}, retrying in ${RETRY_DELAY_MS}ms (attempt ${attempt}/${MAX_RETRIES})...`);
        await sleep(RETRY_DELAY_MS);
        continue;
      }

      let body: ApiResponse;
      try {
        body = JSON.parse(text);
      } catch {
        console.error(`[SEED] Non-JSON response (${res.status}): ${text.slice(0, 500)}`);
        if (attempt < MAX_RETRIES) {
          console.warn(`[SEED] Retrying in ${RETRY_DELAY_MS}ms (attempt ${attempt}/${MAX_RETRIES})...`);
          await sleep(RETRY_DELAY_MS);
          continue;
        }
        return null;
      }

      if (!res.ok) {
        console.error(`[SEED] HTTP ${res.status}: ${body.message ?? body.error ?? text.slice(0, 500)}`);
        return null;
      }

      const result = body.data ?? (body as unknown as BatchResult);
      console.log(
        `[SEED] Result -- created: ${result.created ?? 0}, updated: ${result.updated ?? 0}, failed: ${result.failed ?? 0}`,
      );
      if (result.errors && result.errors.length > 0) {
        for (const err of result.errors.slice(0, 10)) {
          console.error(`  [ERR] index=${err.index} code=${err.code} msg=${err.message}`);
        }
        if (result.errors.length > 10) {
          console.error(`  ... and ${result.errors.length - 10} more errors`);
        }
      }
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (attempt < MAX_RETRIES) {
        console.warn(`[SEED] Network error: ${msg}. Retrying in ${RETRY_DELAY_MS}ms (attempt ${attempt}/${MAX_RETRIES})...`);
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      console.error(`[SEED] Network error after ${MAX_RETRIES} attempts: ${msg}`);
      return null;
    }
  }
  return null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Strip leading slash so backend base URL concatenation doesn't produce double slashes */
function mediaKey(path: string): string {
  return path.replace(/^\/+/, "");
}

// ---------------------------------------------------------------------------
// 1. Map Brands
// ---------------------------------------------------------------------------

function mapBrands() {
  return brands.map((b, idx) => {
    const editorial = b.editorial;
    const payload: Record<string, unknown> = {
      code: b.id,
      name_en: b.name,
      slug: slugify(b.name),
      is_featured: b.featured ?? false,
      logo_key: mediaKey(b.logoUrl),
      sort_order: idx + 1,
      status: "active",
    };

    if (b.tagline) {
      payload.tagline_en = b.tagline;
    }

    if (b.heroMedia) {
      payload.hero_media_type = b.heroMedia.type;
      payload.hero_media_key = mediaKey(b.heroMedia.url);
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

      if (editorial.innovationTitle) {
        payload.innovation_title_en = editorial.innovationTitle;
      }
      if (editorial.innovationDescription) {
        payload.innovation_description_en = editorial.innovationDescription;
      }
      if (editorial.sustainability) {
        payload.sustainability_en = editorial.sustainability;
      }

      if (editorial.stats) {
        payload.editorial_stats = editorial.stats;
      }

      if (editorial.serviceLinks) {
        payload.service_links = editorial.serviceLinks;
      }
    }

    if (b.editorialImages) {
      if (b.editorialImages.heritage) {
        payload.heritage_image_key = mediaKey(b.editorialImages.heritage);
      }
      if (b.editorialImages.innovation) {
        payload.innovation_image_key = mediaKey(b.editorialImages.innovation);
      }
    }

    return payload;
  });
}

// ---------------------------------------------------------------------------
// 2. Map Models
// ---------------------------------------------------------------------------

function mapModels() {
  return models.map((m, idx) => {
    // Build gallery images array from the model's images object
    const images: { image_key: string; alt_en: string; category: string; sort_order: number }[] =
      [];
    if (m.images) {
      const imgEntries = Object.entries(m.images) as [string, string][];
      imgEntries.forEach(([category, url], i) => {
        if (url) {
          images.push({
            image_key: mediaKey(url),
            alt_en: `${m.name} ${category}`,
            category,
            sort_order: i + 1,
          });
        }
      });
    }

    const payload: Record<string, unknown> = {
      brand_code: m.brandId,
      code: m.id,
      name_en: m.name,
      slug: slugify(`${m.brandId}-${m.name}`),
      model_year: m.year,
      body_style_code: m.bodyType.toLowerCase(),
      starting_price: m.startingPrice,
      is_new: m.isNew,
      is_updated: m.isUpdated,
      is_featured: m.featured,
      hero_image_key: mediaKey(m.imageUrl),
      segment_order: m.segmentOrder ?? idx + 1,
      currency: "KWD",
      status: "active",
      publish_state: "draft",
      images,
      metadata: {
        specs_summary: m.specsSummary,
        model_family: m.modelFamily ?? null,
      },
    };

    return payload;
  });
}

// ---------------------------------------------------------------------------
// 3. Map Trims
// ---------------------------------------------------------------------------

function mapTrims() {
  return trims.map((t, idx) => {
    const specs = t.specs;

    const images: { image_key: string; alt_en: string; category: string; sort_order: number }[] =
      (t.images ?? []).map((url, i) => ({
        image_key: mediaKey(url),
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
      hero_image_key: mediaKey(t.images?.[0] ?? ""),
      sort_order: idx + 1,
      images,
      is_default: idx === 0 || t.name === "Standard" || t.name === "LE" || t.name === "Comfort",
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

// ---------------------------------------------------------------------------
// 4. Map Equipment
// ---------------------------------------------------------------------------

function mapEquipment() {
  const items: Record<string, unknown>[] = [];

  for (const t of trims) {
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

// ---------------------------------------------------------------------------
// 5. Map Trim Variants
// ---------------------------------------------------------------------------

function mapTrimVariants() {
  const items: Record<string, unknown>[] = [];

  for (const t of trims) {
    for (const v of t.variants) {
      items.push({
        trim_code: v.trimId,
        code: v.id,
        name_en: v.name,
        price: v.price,
        currency: "KWD",
        slug: slugify(v.id),
        description_en: v.description ?? "",
        hero_image_key: mediaKey(v.images?.[0] ?? ""),
      });
    }
  }

  return items;
}

// ---------------------------------------------------------------------------
// 6. Map Dealers (from branches)
// ---------------------------------------------------------------------------

function mapDealers() {
  const items: Record<string, unknown>[] = [];
  const brandCodes = brands.map((b) => b.id);

  for (const b of branches) {
    // Extract lat/lng from mapUrl if present
    let latitude = 0;
    let longitude = 0;
    const coordMatch = b.mapUrl.match(/q=([\d.-]+),([\d.-]+)/);
    if (coordMatch) {
      latitude = parseFloat(coordMatch[1]);
      longitude = parseFloat(coordMatch[2]);
    }

    if (b.brandId === "all") {
      // Platform-wide branches: create one dealer entry per brand
      for (const brandCode of brandCodes) {
        items.push({
          brand_code: brandCode,
          code: `${b.id}-${brandCode}`,
          name_en: b.name,
          address_en: b.location,
          phone: b.phone,
          map_url: b.mapUrl,
          latitude,
          longitude,
        });
      }
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
// Main execution
// ---------------------------------------------------------------------------

async function main() {
  console.log("=".repeat(70));
  console.log("[SEED] Starting backend seed from mock data");
  console.log(`[SEED] API base: ${API_BASE}`);
  console.log(`[SEED] Auth: ${API_KEY ? "Bearer token set" : "No auth token (set SEED_API_KEY env var)"}`);
  console.log(`[SEED] Data summary:`);
  console.log(`       Brands:        ${brands.length}`);
  console.log(`       Models:        ${models.length}`);
  console.log(`       Trims:         ${trims.length}`);
  console.log(`       Branches:      ${branches.length}`);

  const allVariants = trims.flatMap((t) => t.variants);
  const allEquipment = trims.reduce((sum, t) => sum + t.equipment.length, 0);
  console.log(`       Trim Variants: ${allVariants.length}`);
  console.log(`       Equipment:     ${allEquipment} items`);
  console.log("=".repeat(70));

  // Track overall results
  const results: { step: string; result: BatchResult | null }[] = [];

  // -----------------------------------------------------------------------
  // Step 1: Brands
  // -----------------------------------------------------------------------
  const brandPayload = mapBrands();
  const brandResult = await postImport("/v1/admin/import/brands", brandPayload, "Step 1/7: Import Brands");
  results.push({ step: "Brands", result: brandResult });

  // -----------------------------------------------------------------------
  // Step 2: Models
  // -----------------------------------------------------------------------
  const modelPayload = mapModels();
  const modelResult = await postImport("/v1/admin/import/models", modelPayload, "Step 2/7: Import Models");
  results.push({ step: "Models", result: modelResult });

  // -----------------------------------------------------------------------
  // Step 3: Trims
  // -----------------------------------------------------------------------
  const trimPayload = mapTrims();
  const trimResult = await postImport("/v1/admin/import/trims", trimPayload, "Step 3/7: Import Trims");
  results.push({ step: "Trims", result: trimResult });

  // -----------------------------------------------------------------------
  // Step 4: Equipment
  // -----------------------------------------------------------------------
  const equipmentPayload = mapEquipment();
  const equipResult = await postImport("/v1/admin/import/equipment", equipmentPayload, "Step 4/7: Import Equipment");
  results.push({ step: "Equipment", result: equipResult });

  // -----------------------------------------------------------------------
  // Step 5: Trim Variants
  // -----------------------------------------------------------------------
  const trimVariantPayload = mapTrimVariants();
  let variantResult: BatchResult | null = null;
  if (trimVariantPayload.length > 0) {
    variantResult = await postImport("/v1/admin/import/trim-variants", trimVariantPayload, "Step 5/7: Import Trim Variants");
  } else {
    console.log("\n[SEED] Step 5/7: No trim variants to import, skipping.");
  }
  results.push({ step: "Trim Variants", result: variantResult });

  // -----------------------------------------------------------------------
  // Step 6: Dealers
  // -----------------------------------------------------------------------
  const dealerPayload = mapDealers();
  const dealerResult = await postImport("/v1/admin/import/dealers", dealerPayload, "Step 6/7: Import Dealers");
  results.push({ step: "Dealers", result: dealerResult });

  // -----------------------------------------------------------------------
  // Step 7: Publish
  // -----------------------------------------------------------------------
  console.log(`\n[${"=".repeat(60)}]`);
  console.log("[SEED] Step 7/7: Publish all content");

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (API_KEY) {
      headers["Authorization"] = `Bearer ${API_KEY}`;
    }

    const publishRes = await fetch(`${API_BASE}/v1/admin/publish`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        external_surface: "web",
        is_published: true,
      }),
    });

    const publishText = await publishRes.text();
    if (publishRes.ok) {
      console.log(`[SEED] Publish response (${publishRes.status}): ${publishText.slice(0, 300)}`);
    } else {
      console.error(`[SEED] Publish failed (${publishRes.status}): ${publishText.slice(0, 500)}`);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[SEED] Publish network error: ${msg}`);
  }

  // -----------------------------------------------------------------------
  // Summary
  // -----------------------------------------------------------------------
  console.log(`\n${"=".repeat(70)}`);
  console.log("[SEED] SEED SUMMARY");
  console.log("=".repeat(70));

  let totalCreated = 0;
  let totalUpdated = 0;
  let totalFailed = 0;

  for (const { step, result } of results) {
    if (result) {
      const c = result.created ?? 0;
      const u = result.updated ?? 0;
      const f = result.failed ?? 0;
      totalCreated += c;
      totalUpdated += u;
      totalFailed += f;
      const status = f > 0 ? "PARTIAL" : "OK";
      console.log(
        `  ${step.padEnd(20)} created=${String(c).padStart(4)}  updated=${String(u).padStart(4)}  failed=${String(f).padStart(4)}  [${status}]`,
      );
    } else {
      console.log(`  ${step.padEnd(20)} -- SKIPPED or FAILED --`);
    }
  }

  console.log("-".repeat(70));
  console.log(
    `  ${"TOTAL".padEnd(20)} created=${String(totalCreated).padStart(4)}  updated=${String(totalUpdated).padStart(4)}  failed=${String(totalFailed).padStart(4)}`,
  );
  console.log("=".repeat(70));

  if (totalFailed > 0) {
    console.log("\n[SEED] Completed with errors. Check the logs above for details.");
    process.exit(1);
  } else {
    console.log("\n[SEED] Seed completed successfully.");
  }
}

main().catch((err) => {
  console.error("[SEED] Fatal error:", err);
  process.exit(1);
});
