import { notFound } from "next/navigation";
import { sellers, sellerListings } from "@/data/mock-data";
import ListingDetailClient from "./ListingDetailClient";

export function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_DATA_SOURCE === "api") return [];
  return sellerListings.map((l) => {
    const seller = sellers.find((s) => s.id === l.sellerId);
    return seller ? { slug: seller.slug, trimId: l.trimId } : null;
  }).filter((x): x is { slug: string; trimId: string } => x !== null);
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string; trimId: string }>;
}) {
  const { slug, trimId } = await params;
  const seller = sellers.find((s) => s.slug === slug);
  if (!seller) notFound();
  const listing = sellerListings.find((l) => l.sellerId === seller.id && l.trimId === trimId);
  if (!listing) notFound();
  return <ListingDetailClient slug={slug} trimId={trimId} />;
}
