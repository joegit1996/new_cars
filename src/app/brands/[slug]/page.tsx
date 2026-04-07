import { getBrandBySlug, getModelsByBrandId, getTrimsByBrandId } from "@/data";
import { notFound } from "next/navigation";
import BrandPageClient from "./BrandPageClient";

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();
  const models = getModelsByBrandId(brand.id);
  const trims = getTrimsByBrandId(brand.id);
  return <BrandPageClient brand={brand} models={models} trims={trims} />;
}
