// Mock Data Switcher
// Set NEXT_PUBLIC_MOCK_VERSION="v2" to use the v2 dataset (Mercedes, Porsche, Mitsubishi, SouEast)
// Default (unset or "v1") uses the original dataset (Mercedes, BMW, Toyota, Lexus, Porsche, Changan, Haval, MG)

import * as v1 from "./mock-data-v1";
import * as v2 from "./mock-data-v2";

function isV2(): boolean {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_MOCK_VERSION === "v2") {
    return true;
  }
  if (typeof window !== "undefined") {
    return (window as unknown as Record<string, unknown>).__NEXT_MOCK_VERSION__ === "v2";
  }
  return false;
}

const src = isV2() ? v2 : v1;

export const brands = src.brands;
export const trims = src.trims;
export const models = src.models;
export const branches = src.branches;
export const lifestyleCollections = src.lifestyleCollections;
