import Link from "next/link";
import { TrimVariant } from "@/types";
import styles from "./VariantCard.module.css";

interface VariantCardProps {
  variant: TrimVariant;
  brandSlug: string;
  trimId: string;
  trimImage?: string;
}

export default function VariantCard({ variant, brandSlug, trimId, trimImage }: VariantCardProps) {
  const imageSrc = variant.images.length > 0 ? variant.images[0] : trimImage || "";
  const specSummary = [
    variant.specs.engine,
    variant.specs.drivetrain,
    `${variant.specs.horsepower} HP`,
  ].join(" -- ");

  return (
    <Link
      href={`/brands/${brandSlug}/${trimId}/${variant.id}`}
      className={styles.card}
    >
      <div className={styles.imageWrap}>
        <img src={imageSrc} alt={variant.name} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h4 className={styles.name}>{variant.name}</h4>
        <p className={styles.price}>KWD {variant.price.toLocaleString()}</p>
        <p className={styles.specs}>{specSummary}</p>
      </div>
    </Link>
  );
}
