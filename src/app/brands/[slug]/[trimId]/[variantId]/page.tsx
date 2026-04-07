import { getBrandBySlug, getTrimById, getVariantById } from "@/data";
import { notFound } from "next/navigation";

export default async function VariantPage({ params }: { params: Promise<{ slug: string; trimId: string; variantId: string }> }) {
  const { slug, trimId, variantId } = await params;
  const brand = getBrandBySlug(slug);
  const trim = getTrimById(trimId);
  const variant = getVariantById(trimId, variantId);
  if (!brand || !trim || !variant) notFound();

  // Placeholder for Task 8
  return (
    <div style={{ padding: "24px 16px", maxWidth: 700, margin: "0 auto" }}>
      <h1>{variant.name}</h1>
      <p>Variant details page coming in Task 8 - KWD {variant.price.toLocaleString()}</p>
    </div>
  );
}
