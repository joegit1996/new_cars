"use client";

import { useState } from "react";
import { brands } from "@/data/brands";
import BrandSelector from "@/components/BrandSelector/BrandSelector";

export default function Home() {
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  const selectedBrand = brands.find((b) => b.id === selectedBrandId);

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
      <BrandSelector
        brands={brands}
        selectedBrandId={selectedBrandId}
        onSelectBrand={(id) =>
          setSelectedBrandId(id === selectedBrandId ? null : id)
        }
      />
      {selectedBrand && (
        <p
          style={{
            marginTop: 24,
            fontSize: 16,
            fontWeight: 500,
            color: "var(--neutral_700)",
          }}
        >
          Showing {selectedBrand.name} models
        </p>
      )}
    </main>
  );
}
