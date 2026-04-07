import styles from "./page.module.css";
import BrandCard from "@/components/BrandCard/BrandCard";
import { getAllBrands } from "@/data";

export default function HomePage() {
  const brands = getAllBrands();
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Explore New Cars</h1>
          <p className={styles.heroSubtitle}>
            Browse the latest models from top brands in Kuwait
            <span className={styles.brandCount}> ({brands.length} brands)</span>
          </p>
        </div>
        <div className={styles.grid}>
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </main>
  );
}
