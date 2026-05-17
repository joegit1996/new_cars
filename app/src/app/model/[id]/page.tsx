import { Suspense } from "react";
import { models } from "@/data/mock-data";
import ModelDetailClient from "./ModelDetailClient";

export function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_DATA_SOURCE === "api") return [];
  return models.map((m) => ({ id: m.id }));
}

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense>
      <ModelDetailClient id={id} />
    </Suspense>
  );
}
