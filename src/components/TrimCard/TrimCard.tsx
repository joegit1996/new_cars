import Link from "next/link";
import { Trim } from "@/types";
import styles from "./TrimCard.module.css";

interface TrimCardProps {
  trim: Trim;
  brandSlug: string;
  modelName: string;
}

export default function TrimCard({ trim, brandSlug, modelName }: TrimCardProps) {
  return (
    <Link href={`/brands/${brandSlug}/${trim.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={trim.image} alt={trim.name} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h4 className={styles.name}>{trim.name}</h4>
        <p className={styles.model}>{modelName}</p>
        <p className={styles.price}>From KWD {trim.startingPrice.toLocaleString()}</p>
        {trim.specTags.length > 0 && (
          <div className={styles.tags}>
            {trim.specTags.map((tag, i) => (
              <span key={i} className={styles.tag}>
                {i > 0 && <span className={styles.dot}>&middot;</span>}
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
