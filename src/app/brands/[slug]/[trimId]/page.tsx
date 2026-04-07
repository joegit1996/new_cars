import { getBrandBySlug, getTrimById, getModelById } from "@/data";
import { notFound } from "next/navigation";
import VariantListing from "./VariantListing";

export default async function TrimPage({ params }: { params: Promise<{ slug: string; trimId: string }> }) {
  const { slug, trimId } = await params;
  const brand = getBrandBySlug(slug);
  const trim = getTrimById(trimId);
  if (!brand || !trim) notFound();

  const model = getModelById(trim.modelId);

  if (trim.variants.length > 7) {
    return <VariantListing brand={brand} trim={trim} modelName={model?.name || ""} />;
  }

  // Details page placeholder for now (Task 8 will replace this)
  return (
    <div style={{ padding: "24px 16px", maxWidth: 700, margin: "0 auto" }}>
      <h1>{trim.name}</h1>
      <p>Details page coming in Task 8 ({trim.variants.length} variants)</p>
    </div>
  );
}
