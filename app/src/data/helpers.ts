import { brands, models, trims, branches, lifestyleCollections } from "./mock-data";
import type { Model, Brand, Trim, LifestyleCollection, SortBy } from "./types";
import { type FilterState } from "../components/FilterPanel";

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
