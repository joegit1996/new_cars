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

export function getVariantById(
  trimId: string,
  variantId: string
): TrimVariant | undefined {
  const trim = getTrimById(trimId);
  return trim?.variants.find((v) => v.id === variantId);
}
