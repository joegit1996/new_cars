"use client";

import { useState } from "react";
import { brands } from "@/data/brands";
import BrandSelector from "@/components/BrandSelector/BrandSelector";
import ModelCarousel from "@/components/ModelCarousel/ModelCarousel";

export default function Home() {
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);

  const selectedBrand = brands.find((b) => b.id === selectedBrandId);

  const handleSelectBrand = (id: string) => {
    if (id === selectedBrandId) {
      setSelectedBrandId(null);
      setSelectedModelIds([]);
    } else {
      setSelectedBrandId(id);
      setSelectedModelIds([]);
    }
  };

  const handleToggleModel = (modelId: string) => {
    setSelectedModelIds((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId]
    );
  };

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
      <BrandSelector
        brands={brands}
        selectedBrandId={selectedBrandId}
        onSelectBrand={handleSelectBrand}
      />
      {selectedBrand && (
        <ModelCarousel
          models={selectedBrand.models}
          selectedModelIds={selectedModelIds}
          onToggleModel={handleToggleModel}
        />
      )}
    </main>
  );
}
