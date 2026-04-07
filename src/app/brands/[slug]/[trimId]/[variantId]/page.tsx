import { getBrandBySlug, getTrimById, getModelById, getVariantById } from "@/data";
import { notFound } from "next/navigation";
import DetailsPage from "../DetailsPage";

export default async function VariantPage({ params }: { params: Promise<{ slug: string; trimId: string; variantId: string }> }) {
  const { slug, trimId, variantId } = await params;
  const brand = getBrandBySlug(slug);
  const trim = getTrimById(trimId);
  const variant = getVariantById(trimId, variantId);
  if (!brand || !trim || !variant) notFound();

  const model = getModelById(trim.modelId);

  return (
    <DetailsPage
      brand={brand}
      trim={trim}
      modelName={model?.name || ""}
      initialVariantId={variantId}
    />
  );
}
