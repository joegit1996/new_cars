import { notFound } from "next/navigation";
import { sellers } from "@/data/mock-data";
import SellerLandingClient from "./SellerLandingClient";

export function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_DATA_SOURCE === "api") return [];
  return sellers.map((s) => ({ slug: s.slug }));
}

export default async function SellerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seller = sellers.find((s) => s.slug === slug);
  if (!seller) notFound();
  return <SellerLandingClient slug={slug} />;
}
