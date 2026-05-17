/**
 * seed-backend.ts
 *
 * Reads ALL mock data from src/data/mock-data.ts, uploads media files
 * via the presigned uploader, then imports data to the staging backend.
 *
 * Run with:  npx tsx scripts/seed-backend.ts
 *
 * Required env vars for media upload:
 *   UPLOAD_ADMIN_TOKEN   - admin-console-token JWT
 *   UPLOAD_CUSTOM_AUTH   - X-Custom-Authorization header value
 *
 * Optional env vars:
 *   SEED_API_KEY         - Bearer token for catalog admin endpoints
 *   SKIP_UPLOAD          - set to "1" to skip media upload (use cached mapping)
 *
 * Steps:
 *   0. Upload media files to S3 via presigned URLs
 *   1. brands
 *   2. models
 *   3. trims
 *   4. equipment
 *   5. trim-variants
 *   6. dealers
 *   7. publish
 */

import * as fs from "fs";
import * as path from "path";
import { brands, models, trims, branches } from "../src/data/mock-data";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const API_BASE = "https://staging-services.q84sale.com/api/v1/new-cars-catalog";
const UPLOAD_API = "https://staging-services.q84sale.com/api/v1/presigned-uploader";

const API_KEY = process.env.SEED_API_KEY ?? "";
const UPLOAD_ADMIN_TOKEN = process.env.UPLOAD_ADMIN_TOKEN ?? "";
const UPLOAD_CUSTOM_AUTH = process.env.UPLOAD_CUSTOM_AUTH ?? "";
const SKIP_UPLOAD = process.env.SKIP_UPLOAD === "1";

const PUBLIC_DIR = path.resolve(__dirname, "..", "public");
const MEDIA_MAP_FILE = path.resolve(__dirname, "media-url-map.json");

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

/** Post large payloads in chunks to avoid overwhelming the backend */
async function postImportBatched(
  endpoint: string,
  payload: unknown[],
  label: string,
  batchSize = 200,
): Promise<BatchResult> {
  const total: BatchResult = { created: 0, updated: 0, failed: 0 };
  const totalBatches = Math.ceil(payload.length / batchSize);

  for (let i = 0; i < payload.length; i += batchSize) {
    const chunk = payload.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const batchLabel = `${label} [batch ${batchNum}/${totalBatches}]`;
    const result = await postImport(endpoint, chunk, batchLabel);
    if (result) {
      total.created += result.created ?? 0;
      total.updated += result.updated ?? 0;
      total.failed += result.failed ?? 0;
    } else {
      total.failed += chunk.length;
    }
    // Delay between batches to let the backend breathe
    if (i + batchSize < payload.length) {
      await sleep(2000);
    }
  }

  return total;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------------------------------------------------------------------------
// Media Upload
// ---------------------------------------------------------------------------

let mediaUrlMap: Record<string, string> = {};

// Load cached mapping if it exists
try {
  mediaUrlMap = JSON.parse(fs.readFileSync(MEDIA_MAP_FILE, "utf-8"));
} catch {
  // No cache yet
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".mp4": "video/mp4",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };
  return mimes[ext] ?? "application/octet-stream";
}

/** Collect every unique local media path referenced in the mock data */
function collectAllMediaPaths(): string[] {
  const paths = new Set<string>();

  for (const b of brands) {
    if (b.logoUrl) paths.add(b.logoUrl);
    if (b.heroMedia?.url) paths.add(b.heroMedia.url);
    if (b.editorialImages?.heritage) paths.add(b.editorialImages.heritage);
    if (b.editorialImages?.innovation) paths.add(b.editorialImages.innovation);
  }

  for (const m of models) {
    if (m.imageUrl) paths.add(m.imageUrl);
    if (m.images) {
      for (const url of Object.values(m.images)) {
        if (url) paths.add(url as string);
      }
    }
  }

  for (const t of trims) {
    if (t.images) {
      for (const url of t.images) {
        if (url) paths.add(url);
      }
    }
    for (const v of t.variants) {
      if (v.images) {
        for (const url of v.images) {
          if (url) paths.add(url);
        }
      }
    }
  }

  // Only local paths (starting with /), skip empty strings
  return [...paths].filter((p) => p.startsWith("/"));
}

interface PresignedResult {
  uploadUrl: string;
  publicUrls: { url: string };
  method: string;
  headers: Record<string, string>;
}

async function requestPresignedUrls(
  files: { mime: string; size: number; type: string }[],
): Promise<PresignedResult[]> {
  const res = await fetch(UPLOAD_API, {
    method: "POST",
    headers: {
      "Application-Source": "q84sale",
      "Content-Type": "application/json",
      Accept: "application/json",
      "admin-console-token": UPLOAD_ADMIN_TOKEN,
      "X-Custom-Authorization": UPLOAD_CUSTOM_AUTH,
      "Accept-Language": "en",
    },
    body: JSON.stringify({ files }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Presigned URL request failed (${res.status}): ${text.slice(0, 500)}`);
  }

  const data = (await res.json()) as { results: PresignedResult[] };
  return data.results;
}

async function uploadFileToS3(
  uploadUrl: string,
  absPath: string,
  contentType: string,
): Promise<void> {
  const fileBuffer = fs.readFileSync(absPath);

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: fileBuffer,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`S3 upload failed (${res.status}): ${text.slice(0, 300)}`);
  }
}

async function uploadAllMedia(): Promise<void> {
  const allPaths = collectAllMediaPaths();
  const toUpload = allPaths.filter((p) => !mediaUrlMap[p]);

  console.log(`\n[${"=".repeat(60)}]`);
  console.log(`[UPLOAD] Step 0: Upload Media Files`);
  console.log(`[UPLOAD] Total unique media paths: ${allPaths.length}`);
  console.log(`[UPLOAD] Already cached: ${allPaths.length - toUpload.length}`);
  console.log(`[UPLOAD] Need to upload: ${toUpload.length}`);

  if (toUpload.length === 0) {
    console.log("[UPLOAD] All media already uploaded. Skipping.");
    return;
  }

  if (!UPLOAD_ADMIN_TOKEN || !UPLOAD_CUSTOM_AUTH) {
    console.error("[UPLOAD] ERROR: UPLOAD_ADMIN_TOKEN and UPLOAD_CUSTOM_AUTH env vars are required for media upload.");
    console.error("[UPLOAD] Set SKIP_UPLOAD=1 to skip upload and use cached mapping.");
    process.exit(1);
  }

  // Verify all files exist locally before starting
  const missing: string[] = [];
  for (const localPath of toUpload) {
    const absPath = path.join(PUBLIC_DIR, localPath);
    if (!fs.existsSync(absPath)) {
      missing.push(localPath);
    }
  }
  if (missing.length > 0) {
    console.warn(`[UPLOAD] Warning: ${missing.length} files not found locally, will be skipped:`);
    for (const m of missing.slice(0, 5)) console.warn(`  - ${m}`);
    if (missing.length > 5) console.warn(`  ... and ${missing.length - 5} more`);
  }

  const validFiles = toUpload.filter((p) => !missing.includes(p));

  // Process in batches of 10 (presigned API accepts arrays)
  const BATCH_SIZE = 10;
  let uploaded = 0;
  let failed = 0;

  for (let i = 0; i < validFiles.length; i += BATCH_SIZE) {
    const batch = validFiles.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(validFiles.length / BATCH_SIZE);
    console.log(`[UPLOAD] Batch ${batchNum}/${totalBatches} (${batch.length} files)`);

    // Prepare file metadata
    const filesMeta = batch.map((localPath) => {
      const absPath = path.join(PUBLIC_DIR, localPath);
      const stat = fs.statSync(absPath);
      return {
        localPath,
        absPath,
        mime: getMimeType(localPath),
        size: stat.size,
        type: "new_cars" as const,
      };
    });

    try {
      // Request presigned URLs for this batch
      const presigned = await requestPresignedUrls(
        filesMeta.map((f) => ({ mime: f.mime, size: f.size, type: f.type })),
      );

      // Upload each file
      for (let j = 0; j < batch.length; j++) {
        const { localPath, absPath, mime } = filesMeta[j];
        const { uploadUrl, publicUrls } = presigned[j];

        try {
          await uploadFileToS3(uploadUrl, absPath, mime);
          mediaUrlMap[localPath] = publicUrls.url;
          uploaded++;
          console.log(`  [OK] ${localPath}`);
        } catch (err) {
          failed++;
          console.error(`  [FAIL] ${localPath}: ${err instanceof Error ? err.message : err}`);
        }
      }
    } catch (err) {
      // Presigned URL request failed for whole batch
      failed += batch.length;
      console.error(`  [BATCH FAIL] ${err instanceof Error ? err.message : err}`);
    }

    // Small delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < validFiles.length) {
      await sleep(300);
    }
  }

  // Save mapping to disk
  fs.writeFileSync(MEDIA_MAP_FILE, JSON.stringify(mediaUrlMap, null, 2));
  console.log(`[UPLOAD] Done: ${uploaded} uploaded, ${failed} failed, mapping saved to media-url-map.json`);
}

/**
 * Resolve a local path to its uploaded public URL.
 * Falls back to stripping the leading slash (legacy _key behavior) if not uploaded.
 */
function resolveMedia(localPath: string): string {
  if (!localPath) return "";
  if (mediaUrlMap[localPath]) return mediaUrlMap[localPath];
  // Fallback: strip leading slash for legacy key-based behavior
  return localPath.replace(/^\/+/, "");
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
      logo_key: resolveMedia(b.logoUrl),
      sort_order: idx + 1,
      status: "active",
    };

    if (b.tagline) {
      payload.tagline_en = b.tagline;
    }

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
        payload.heritage_image_key = resolveMedia(b.editorialImages.heritage);
      }
      if (b.editorialImages.innovation) {
        payload.innovation_image_key = resolveMedia(b.editorialImages.innovation);
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
    const images: { image_key: string; alt_en: string; category: string; sort_order: number }[] =
      [];
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
        hero_image_key: resolveMedia(v.images?.[0] ?? ""),
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
    let latitude = 0;
    let longitude = 0;
    const coordMatch = b.mapUrl.match(/q=([\d.-]+),([\d.-]+)/);
    if (coordMatch) {
      latitude = parseFloat(coordMatch[1]);
      longitude = parseFloat(coordMatch[2]);
    }

    if (b.brandId === "all") {
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
  console.log(`[SEED] Upload: ${SKIP_UPLOAD ? "SKIPPED" : UPLOAD_ADMIN_TOKEN ? "Enabled" : "No token (set UPLOAD_ADMIN_TOKEN)"}`);
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

  // -----------------------------------------------------------------------
  // Step 0: Upload media
  // -----------------------------------------------------------------------
  if (!SKIP_UPLOAD) {
    await uploadAllMedia();
  } else {
    const cached = Object.keys(mediaUrlMap).length;
    console.log(`\n[UPLOAD] Skipped (SKIP_UPLOAD=1). Using ${cached} cached URL mappings.`);
  }

  // Track overall results
  const results: { step: string; result: BatchResult | null }[] = [];

  // -----------------------------------------------------------------------
  // Step 1: Brands
  // -----------------------------------------------------------------------
  const brandPayload = mapBrands();
  const brandResult = await postImport("/v1/admin/import/brands", brandPayload, "Step 1/7: Import Brands");
  results.push({ step: "Brands", result: brandResult });
  await sleep(1000);

  // -----------------------------------------------------------------------
  // Step 2: Models
  // -----------------------------------------------------------------------
  const modelPayload = mapModels();
  const modelResult = await postImport("/v1/admin/import/models", modelPayload, "Step 2/7: Import Models");
  results.push({ step: "Models", result: modelResult });
  await sleep(1000);

  // -----------------------------------------------------------------------
  // Step 3: Trims
  // -----------------------------------------------------------------------
  const trimPayload = mapTrims();
  const trimResult = await postImport("/v1/admin/import/trims", trimPayload, "Step 3/7: Import Trims");
  results.push({ step: "Trims", result: trimResult });
  await sleep(2000);

  // -----------------------------------------------------------------------
  // Step 4: Equipment
  // -----------------------------------------------------------------------
  const equipmentPayload = mapEquipment();
  const equipResult = await postImportBatched("/v1/admin/import/equipment", equipmentPayload, "Step 4/7: Import Equipment", 200);
  results.push({ step: "Equipment", result: equipResult });
  await sleep(2000);

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
      const resultStatus = f > 0 ? "PARTIAL" : "OK";
      console.log(
        `  ${step.padEnd(20)} created=${String(c).padStart(4)}  updated=${String(u).padStart(4)}  failed=${String(f).padStart(4)}  [${resultStatus}]`,
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

  const uploadedCount = Object.keys(mediaUrlMap).length;
  console.log(`  Media URLs mapped:  ${uploadedCount}`);

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
