import { Brand, Trim } from "@/types";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import VariantCard from "@/components/VariantCard/VariantCard";
import styles from "./VariantListing.module.css";

interface VariantListingProps {
  brand: Brand;
  trim: Trim;
  modelName: string;
}

export default function VariantListing({ brand, trim, modelName }: VariantListingProps) {
  const breadcrumbItems = [
    { label: brand.name, href: `/brands/${brand.slug}` },
    { label: modelName },
    { label: trim.name },
  ];

  return (
    <div className={styles.container}>
      <Breadcrumb items={breadcrumbItems} />
      <h1 className={styles.title}>{trim.name}</h1>
      <p className={styles.subtitle}>
        {trim.variants.length} variants available
      </p>
      <div className={styles.list}>
        {trim.variants.map((variant) => (
          <VariantCard
            key={variant.id}
            variant={variant}
            brandSlug={brand.slug}
            trimId={trim.id}
            trimImage={trim.image}
          />
        ))}
      </div>
    </div>
  );
}
