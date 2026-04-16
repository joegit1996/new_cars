import { brands, models, trims, branches, lifestyleCollections } from "./mock-data";
import type { Model, Brand, Trim, LifestyleCollection, SortBy, BrandEditorial, SearchEntry, ModelAggregateSpecs } from "./types";
import { type FilterState } from "../components/FilterPanel";

export const brandColors: Record<string, string> = {
  mercedes: "#1E293B",
  bmw: "#1A56DB",
  toyota: "#EF4444",
  lexus: "#1E293B",
  porsche: "#B91C1C",
  changan: "#1A56DB",
  haval: "#DC2626",
  mg: "#EF4444",
};

export function getBrandById(id: string): Brand | undefined {
  return brands.find((b) => b.id === id);
}

export function getBrandByModelId(modelId: string): Brand | undefined {
  const model = getModelById(modelId);
  if (!model) return undefined;
  return getBrandById(model.brandId);
}

export function getModelById(id: string): Model | undefined {
  return models.find((m) => m.id === id);
}

export function getModelsByBrand(brandId: string): Model[] {
  return models.filter((m) => m.brandId === brandId);
}

export function getModelsByBrandSegmentOrder(brandId: string): Model[] {
  return getModelsByBrand(brandId).sort((a, b) => (a.segmentOrder ?? 999) - (b.segmentOrder ?? 999));
}

export function getBrandEditorial(brandId: string): BrandEditorial | undefined {
  return getBrandById(brandId)?.editorial;
}

export function getModelsByBodyType(bodyType: string): Model[] {
  return models.filter((m) => m.bodyType === bodyType);
}

export function getTrimsByModel(modelId: string): Trim[] {
  return trims.filter((t) => t.modelId === modelId);
}

export function getTrimById(id: string): Trim | undefined {
  return trims.find((t) => t.id === id);
}

export function getNewModels(): Model[] {
  return models.filter((m) => m.isNew || m.isUpdated);
}

export function getModelsByPriceRange(min: number, max: number): Model[] {
  return models.filter((m) => m.startingPrice >= min && m.startingPrice <= max);
}

export function getModelsByLifestyleCollection(collectionId: string): Model[] {
  const collection = lifestyleCollections.find((c) => c.id === collectionId);
  if (!collection) return [];
  return collection.modelIds
    .map((id) => getModelById(id))
    .filter((m): m is Model => m !== undefined);
}

export function getCollectionById(id: string): LifestyleCollection | undefined {
  return lifestyleCollections.find((c) => c.id === id);
}

export function getBranchesForModel(_modelId: string) {
  return branches;
}

export function searchModels(query: string): Model[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return models.filter((m) => {
    const brand = getBrandById(m.brandId);
    const searchStr = `${brand?.name || ""} ${m.name} ${m.bodyType}`.toLowerCase();
    return searchStr.includes(q);
  });
}

// ---------------------------------------------------------------------------
// Trim-level search index
// ---------------------------------------------------------------------------

function cylinderTerms(cylinders: number): string {
  const map: Record<number, string> = {
    3: "i3 inline-3 3-cylinder",
    4: "i4 inline-4 4-cylinder",
    5: "i5 inline-5 5-cylinder",
    6: "v6 inline-6 6-cylinder",
    8: "v8 8-cylinder",
    10: "v10 10-cylinder",
    12: "v12 12-cylinder",
  };
  return map[cylinders] || `${cylinders}-cylinder`;
}

function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];
  for (const model of models) {
    const brand = getBrandById(model.brandId);
    const brandName = brand?.name || "";
    const modelTrims = getTrimsByModel(model.id);

    for (const trim of modelTrims) {
      const equipmentNames = trim.equipment.map((e) => e.name).join(" ");
      const searchText = [
        brandName,
        model.name,
        trim.name,
        model.bodyType,
        trim.engineSummary,
        cylinderTerms(trim.specs.cylinders),
        trim.fuelType,
        trim.specs.driveType,
        trim.specs.transmission,
        `${trim.horsepower}hp`,
        `${trim.specs.displacement}L`,
        equipmentNames,
      ]
        .join(" ")
        .toLowerCase();

      entries.push({
        modelId: model.id,
        trimId: trim.id,
        brandId: model.brandId,
        brandName,
        modelName: model.name,
        trimName: trim.name,
        price: trim.price,
        imageUrl: model.imageUrl,
        bodyType: model.bodyType,
        searchText,
      });
    }
  }
  return entries;
}

const searchIndex = buildSearchIndex();

export function searchTrims(query: string): SearchEntry[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];

  const matches = searchIndex.filter((entry) => entry.searchText.includes(q));

  // Sort: identity matches (brand/model/trim name) first, then attribute matches
  // Within each group, sort by price ascending
  const identity: SearchEntry[] = [];
  const attribute: SearchEntry[] = [];

  for (const entry of matches) {
    const nameText = `${entry.brandName} ${entry.modelName} ${entry.trimName}`.toLowerCase();
    if (nameText.includes(q)) {
      identity.push(entry);
    } else {
      attribute.push(entry);
    }
  }

  identity.sort((a, b) => a.price - b.price);
  attribute.sort((a, b) => a.price - b.price);

  return [...identity, ...attribute];
}

export function filterModels(allModels: Model[], filters: FilterState): Model[] {
  return allModels.filter((m) => {
    if (m.startingPrice < filters.priceRange[0] || m.startingPrice > filters.priceRange[1]) return false;
    if (filters.bodyTypes.length > 0 && !filters.bodyTypes.includes(m.bodyType)) return false;
    if (filters.fuelTypes.length > 0) {
      const modelFuels = m.specsSummary.fuelTypes.map((f) => f as string);
      if (!filters.fuelTypes.some((f) => modelFuels.includes(f))) return false;
    }
    if (filters.brands.length > 0) {
      const brand = getBrandById(m.brandId);
      if (!brand || !filters.brands.includes(brand.name)) return false;
    }
    // Transmission, drive type, seating, spec region: check trims
    const modelTrims = getTrimsByModel(m.id);
    if (filters.transmissions.length > 0) {
      if (!modelTrims.some((t) => filters.transmissions.includes(t.specs.transmission))) return false;
    }
    if (filters.driveTypes.length > 0) {
      const driveMap: Record<string, string[]> = { "AWD/4WD": ["AWD", "4WD"] };
      const targetDrives = filters.driveTypes.flatMap((d) => driveMap[d] || [d]);
      if (!modelTrims.some((t) => targetDrives.includes(t.specs.driveType))) return false;
    }
    if (filters.seating.length > 0) {
      const seatValues = filters.seating.map((s) => (s === "8+" ? 8 : Number(s)));
      if (!modelTrims.some((t) => seatValues.includes(t.specs.seatingCapacity))) return false;
    }
    if (filters.specRegions.length > 0) {
      if (!modelTrims.some((t) => filters.specRegions.includes(t.specs.specRegion))) return false;
    }
    return true;
  });
}

export function sortModels(allModels: Model[], sortBy: SortBy): Model[] {
  const sorted = [...allModels];
  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.startingPrice - b.startingPrice);
    case "price-desc":
      return sorted.sort((a, b) => b.startingPrice - a.startingPrice);
    case "newest":
      return sorted.sort((a, b) => {
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        if (a.isUpdated && !b.isUpdated) return -1;
        return 0;
      });
    case "popular":
      return sorted; // mock: use default order as "popular"
    case "horsepower":
      return sorted.sort((a, b) => {
        const aHp = Math.max(...getTrimsByModel(a.id).map((t) => t.horsepower), 0);
        const bHp = Math.max(...getTrimsByModel(b.id).map((t) => t.horsepower), 0);
        return bHp - aHp;
      });
    default:
      return sorted;
  }
}

// ---------------------------------------------------------------------------
// Model aggregate specs (for model-level comparison)
// ---------------------------------------------------------------------------

export function getModelAggregateSpecs(modelId: string): ModelAggregateSpecs | undefined {
  const modelTrims = getTrimsByModel(modelId);
  if (modelTrims.length === 0) return undefined;

  const mm = (vals: number[]) => ({ min: Math.min(...vals), max: Math.max(...vals) });

  const prices = modelTrims.map((t) => t.price);
  const hps = modelTrims.map((t) => t.specs.horsepower);
  const torques = modelTrims.map((t) => t.specs.torque);
  const seats = modelTrims.map((t) => t.specs.seatingCapacity);
  const disps = modelTrims.map((t) => t.specs.displacement);

  const fuelTypes = [...new Set(modelTrims.map((t) => t.fuelType))];
  const transmissions = [...new Set(modelTrims.map((t) => t.specs.transmission))];
  const driveTypes = [...new Set(modelTrims.map((t) => t.specs.driveType))];

  // Equipment: "standard" if all trims have it as standard, "some" if at least one, "none" otherwise
  const allEquipNames = new Set<string>();
  for (const t of modelTrims) {
    for (const e of t.equipment) allEquipNames.add(e.name);
  }
  const equipmentMap: Record<string, "standard" | "some" | "none"> = {};
  for (const name of allEquipNames) {
    const withFeature = modelTrims.filter((t) => t.equipment.some((e) => e.name === name && e.isStandard));
    if (withFeature.length === modelTrims.length) {
      equipmentMap[name] = "standard";
    } else if (withFeature.length > 0) {
      equipmentMap[name] = "some";
    } else {
      equipmentMap[name] = "none";
    }
  }

  return {
    priceRange: mm(prices),
    hpRange: mm(hps),
    torqueRange: mm(torques),
    fuelTypes,
    transmissions,
    driveTypes,
    seatingRange: mm(seats),
    displacementRange: mm(disps),
    dimensionRanges: {
      length: mm(modelTrims.map((t) => t.specs.lengthMm)),
      width: mm(modelTrims.map((t) => t.specs.widthMm)),
      height: mm(modelTrims.map((t) => t.specs.heightMm)),
      wheelbase: mm(modelTrims.map((t) => t.specs.wheelbaseMm)),
    },
    equipmentMap,
    trimCount: modelTrims.length,
  };
}

// ---------------------------------------------------------------------------
// Deduplicated model-level search (for compare picker)
// ---------------------------------------------------------------------------

export function searchModelsDeduped(query: string): SearchEntry[] {
  const all = searchTrims(query);
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
