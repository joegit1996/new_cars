import styles from "./page.module.css";
import BrandCard from "@/components/BrandCard/BrandCard";
import { getAllBrands } from "@/data";

export default function HomePage() {
  const brands = getAllBrands();
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>New Cars</h1>
        <div className={styles.grid}>
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </main>
  );
}
