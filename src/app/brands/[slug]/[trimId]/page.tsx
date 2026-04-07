import { getBrandBySlug, getTrimById, getModelById } from "@/data";
import { notFound } from "next/navigation";
import VariantListing from "./VariantListing";
import DetailsPage from "./DetailsPage";

export default async function TrimPage({ params }: { params: Promise<{ slug: string; trimId: string }> }) {
  const { slug, trimId } = await params;
  const brand = getBrandBySlug(slug);
  const trim = getTrimById(trimId);
  if (!brand || !trim) notFound();

  const model = getModelById(trim.modelId);

  if (trim.variants.length > 7) {
    return <VariantListing brand={brand} trim={trim} modelName={model?.name || ""} />;
  }

  return (
    <DetailsPage
      brand={brand}
      trim={trim}
      modelName={model?.name || ""}
    />
  );
}
