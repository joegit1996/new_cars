import Link from "next/link";
import Image from "next/image";
import styles from "./BrandCard.module.css";
import { Brand } from "@/types";

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link href={`/brands/${brand.slug}`} className={styles.card}>
      <div className={styles.logoWrap}>
        <Image src={brand.logo} alt={brand.name} width={64} height={64} className={styles.logo} />
      </div>
      <span className={styles.name}>{brand.name}</span>
    </Link>
  );
}
