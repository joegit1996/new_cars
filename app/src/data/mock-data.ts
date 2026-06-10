// Mock Data Switcher
// Set NEXT_PUBLIC_MOCK_VERSION="v2" to use the v2 dataset (Mercedes, Porsche, Mitsubishi, SouEast)
// Default (unset or "v1") uses the original dataset (Mercedes, BMW, Toyota, Lexus, Porsche, Changan, Haval, MG)

import * as v1 from "./mock-data-v1";
import * as v2 from "./mock-data-v2";

const src = process.env.NEXT_PUBLIC_MOCK_VERSION === "v2" ? v2 : v1;

export const brands = src.brands;
export const trims = src.trims;
export const models = src.models;
export const branches = src.branches;
export const lifestyleCollections = src.lifestyleCollections;
// Sellers were introduced with v2. v1 falls back to empty arrays.
import type { Seller, SellerListing } from "./types";
export const sellers: Seller[] = ("sellers" in src ? (src as { sellers: Seller[] }).sellers : []) ?? [];
export const sellerListings: SellerListing[] = ("sellerListings" in src ? (src as { sellerListings: SellerListing[] }).sellerListings : []) ?? [];
