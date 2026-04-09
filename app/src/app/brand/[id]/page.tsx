import { redirect } from "next/navigation";
import { brands } from "../../../data/mock-data";

export function generateStaticParams() {
  return brands.map((b) => ({ id: b.id }));
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/browse?brand=${id}`);
}
