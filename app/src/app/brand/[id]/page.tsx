import { brands } from "../../../data/mock-data";
import BrandShowcasePage from "./BrandShowcaseClient";

export function generateStaticParams() {
  return brands.map((b) => ({ id: b.id }));
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BrandShowcasePage brandId={id} />;
}
