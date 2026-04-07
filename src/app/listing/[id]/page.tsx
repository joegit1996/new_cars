import { notFound } from "next/navigation";
import { getListingById, listings } from "@/data/listings";
import { getBrandById, getModelById, getTrimById } from "@/data/brands";
import ImageGallery from "@/components/ImageGallery/ImageGallery";
import SpecsTable from "@/components/SpecsTable/SpecsTable";
import {
  CompareButton,
  CollapsibleSection,
  SimilarListingsCarousel,
} from "./ListingActions";
import styles from "./page.module.css";

function formatPrice(price: number): string {
  return `$${price.toLocaleString("en-US")}`;
}

function renderStars(rating: number): string {
  const full = Math.round(rating);
  return "\u2B50".repeat(full);
}

function renderSafetyStars(rating: number): string {
  const filled = "\u2605";
  const empty = "\u2606";
  return filled.repeat(rating) + empty.repeat(5 - rating);
}

const TRANSMISSION_LABELS: Record<string, string> = {
  cvt: "CVT",
  dct: "DCT",
  automatic: "Automatic",
  manual: "Manual",
};

const FUEL_TYPE_LABELS: Record<string, string> = {
  gasoline: "Gasoline",
  diesel: "Diesel",
  hybrid: "Hybrid",
  "plug-in-hybrid": "Plug-in Hybrid",
  electric: "Electric",
};

const BADGE_MAP: Record<string, { label: string; className: string }> = {
  "in-stock": { label: "In Stock", className: "badgeInStock" },
  "in-transit": { label: "In Transit", className: "badgeInTransit" },
  "build-to-order": { label: "Build to Order", className: "badgeBuildToOrder" },
};

const SAFETY_KEYWORDS = [
  "safety",
  "airbag",
  "blind spot",
  "collision",
  "lane departure",
  "lane keeping",
  "adaptive cruise",
  "emergency braking",
  "rear cross traffic",
  "parking sensor",
  "backup camera",
  "surround view",
  "forward collision",
  "pedestrian detection",
  "pre-collision",
];

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    notFound();
  }

  const brand = getBrandById(listing.brandId);
  const model = getModelById(listing.brandId, listing.modelId);
  const trim = getTrimById(listing.modelId, listing.trimId);
  const variant = trim?.variants.find((v) => v.id === listing.variantId);

  const brandName = brand?.name || listing.brandId;
  const modelName = model?.name || listing.modelId;
  const trimName = trim?.name || listing.trimId;
  const variantName = variant?.name || listing.variantId;

  const title = `${listing.year} ${brandName} ${modelName} ${trimName} ${variantName}`;
  const badge = BADGE_MAP[listing.status];
  const showSavings = listing.price !== listing.msrp;
  const savings = listing.msrp - listing.price;
  const transmissionLabel =
    TRANSMISSION_LABELS[listing.specs.transmission] || listing.specs.transmission;
  const fuelTypeLabel =
    FUEL_TYPE_LABELS[listing.specs.fuelType] || listing.specs.fuelType;

  // Safety features
  const safetyFeatures = listing.features.filter((f) =>
    SAFETY_KEYWORDS.some((kw) => f.toLowerCase().includes(kw))
  );

  // Specs table sections
  const specsSections = [
    {
      title: "Engine & Performance",
      rows: [
        { label: "Engine", value: listing.specs.engine },
        { label: "Horsepower", value: `${listing.specs.horsepower} HP` },
        { label: "Torque", value: `${listing.specs.torque} lb-ft` },
        { label: "Transmission", value: transmissionLabel },
        { label: "Drivetrain", value: listing.specs.drivetrain },
      ],
    },
    {
      title: "Fuel Economy",
      rows: [
        { label: "City", value: `${listing.specs.fuelEconomy.city} MPG` },
        { label: "Highway", value: `${listing.specs.fuelEconomy.highway} MPG` },
        {
          label: "Combined",
          value: `${listing.specs.fuelEconomy.combined} MPG`,
        },
      ],
    },
    ...(listing.specs.dimensions
      ? [
          {
            title: "Dimensions",
            rows: [
              {
                label: "Length",
                value: `${listing.specs.dimensions.length} in`,
              },
              { label: "Width", value: `${listing.specs.dimensions.width} in` },
              {
                label: "Height",
                value: `${listing.specs.dimensions.height} in`,
              },
              {
                label: "Wheelbase",
                value: `${listing.specs.dimensions.wheelbase} in`,
              },
              {
                label: "Ground Clearance",
                value: `${listing.specs.dimensions.groundClearance} in`,
              },
            ],
          },
        ]
      : []),
    {
      title: "Capacity",
      rows: [
        { label: "Seating Capacity", value: listing.specs.seatingCapacity },
        {
          label: "Cargo Volume",
          value: `${listing.specs.cargoVolume} cu ft`,
        },
        {
          label: "Curb Weight",
          value: `${listing.specs.curbWeight.toLocaleString("en-US")} lbs`,
        },
      ],
    },
    {
      title: "Warranty",
      rows: [
        { label: "Basic", value: listing.warranty.basic },
        { label: "Powertrain", value: listing.warranty.powertrain },
        { label: "Corrosion", value: listing.warranty.corrosion },
        { label: "Roadside Assistance", value: listing.warranty.roadside },
      ],
    },
  ];

  // Similar listings
  const similarListings = listings
    .filter(
      (l) =>
        l.brandId === listing.brandId &&
        l.modelId === listing.modelId &&
        l.id !== listing.id
    )
    .slice(0, 6);

  // Build name maps for similar listings
  const similarBrandNames: Record<string, string> = {};
  const similarModelNames: Record<string, string> = {};
  const similarTrimNames: Record<string, string> = {};
  const similarVariantNames: Record<string, string> = {};

  for (const sl of similarListings) {
    const slBrand = getBrandById(sl.brandId);
    const slModel = getModelById(sl.brandId, sl.modelId);
    const slTrim = getTrimById(sl.modelId, sl.trimId);
    const slVariant = slTrim?.variants.find((v) => v.id === sl.variantId);
    similarBrandNames[sl.id] = slBrand?.name || sl.brandId;
    similarModelNames[sl.id] = slModel?.name || sl.modelId;
    similarTrimNames[sl.id] = slTrim?.name || sl.trimId;
    similarVariantNames[sl.id] = slVariant?.name || sl.variantId;
  }

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <ImageGallery
            images={listing.images}
            alt={`${listing.year} ${brandName} ${modelName}`}
          />
        </div>
        <div className={styles.heroRight}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.priceSection}>
            <span className={styles.price}>{formatPrice(listing.price)}</span>
            {showSavings && (
              <div className={styles.savingsRow}>
                <span className={styles.msrp}>
                  MSRP {formatPrice(listing.msrp)}
                </span>
                <span className={styles.savings}>
                  Save {formatPrice(Math.abs(savings))}
                </span>
              </div>
            )}
          </div>

          {badge && (
            <span className={`${styles.badge} ${styles[badge.className]}`}>
              {badge.label}
            </span>
          )}

          <div className={styles.divider} />

          <div className={styles.colorSection}>
            <div className={styles.colorRow}>
              <span className={styles.colorLabel}>Exterior</span>
              <span className={styles.colorValue}>
                <span
                  className={styles.colorSwatch}
                  style={{ backgroundColor: listing.color.exterior.hex }}
                />
                {listing.color.exterior.name}
              </span>
            </div>
            <div className={styles.colorRow}>
              <span className={styles.colorLabel}>Interior</span>
              <span className={styles.colorValue}>
                {listing.color.interior}
              </span>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.dealerSection}>
            <p className={styles.dealerName}>{listing.dealer.name}</p>
            <p className={styles.dealerInfo}>
              {listing.dealer.city} &bull; {listing.dealer.phone}
            </p>
            <p className={styles.dealerRating}>
              {renderStars(listing.dealer.rating)} {listing.dealer.rating}
            </p>
          </div>

          <div className={styles.ctaGroup}>
            <button type="button" className={styles.contactButton}>
              Contact Dealer
            </button>
            <CompareButton listing={listing} />
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className={styles.quickStats}>
        <span className={styles.statPill}>
          <span className={styles.statIcon}>{"\u26A1"}</span>
          {listing.specs.horsepower} HP
        </span>
        <span className={styles.statPill}>
          <span className={styles.statIcon}>{"\uD83D\uDD27"}</span>
          {listing.specs.torque} lb-ft
        </span>
        <span className={styles.statPill}>
          <span className={styles.statIcon}>{"\u26FD"}</span>
          {listing.specs.fuelEconomy.combined} MPG
        </span>
        <span className={styles.statPill}>
          <span className={styles.statIcon}>{"\uD83D\uDE97"}</span>
          {listing.specs.drivetrain}
        </span>
        <span className={styles.statPill}>
          <span className={styles.statIcon}>{"\u2699\uFE0F"}</span>
          {transmissionLabel}
        </span>
        <span className={styles.statPill}>
          <span className={styles.statIcon}>{"\uD83D\uDD0B"}</span>
          {fuelTypeLabel}
        </span>
      </div>

      {/* Tabbed Content Sections */}
      <div className={styles.sections}>
        <CollapsibleSection title="Overview">
          <p className={styles.description}>
            {model?.description || `${listing.year} ${brandName} ${modelName} ${trimName}`}
          </p>
          {listing.features.length > 0 && (
            <>
              <h3 className={styles.featuresHeading}>Key Features</h3>
              <div className={styles.featuresGrid}>
                {listing.features.map((feature) => (
                  <div key={feature} className={styles.featureItem}>
                    <span className={styles.featureCheck}>{"\u2713"}</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CollapsibleSection>

        <CollapsibleSection title="Specifications">
          <SpecsTable sections={specsSections} />
        </CollapsibleSection>

        <CollapsibleSection title="Safety">
          {listing.safetyRating && (
            <div className={styles.safetyRatings}>
              <div className={styles.safetyRow}>
                <span className={styles.safetyLabel}>NHTSA Overall Rating</span>
                <span className={styles.safetyStars}>
                  {renderSafetyStars(listing.safetyRating.nhtsa)}{" "}
                  {listing.safetyRating.nhtsa} / 5
                </span>
              </div>
              {listing.safetyRating.iihsTopPick && (
                <span className={styles.iihsBadge}>
                  IIHS Top Safety Pick+
                </span>
              )}
            </div>
          )}
          {safetyFeatures.length > 0 && (
            <div className={styles.safetyFeatures}>
              <h3 className={styles.featuresHeading}>Safety Features</h3>
              <div className={styles.featuresGrid}>
                {safetyFeatures.map((feature) => (
                  <div key={feature} className={styles.featureItem}>
                    <span className={styles.featureCheck}>{"\u2713"}</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!listing.safetyRating && safetyFeatures.length === 0 && (
            <p className={styles.noData}>
              No safety rating data available for this listing.
            </p>
          )}
        </CollapsibleSection>

        <CollapsibleSection title="Dealer Information">
          <div className={styles.dealerDetail}>
            <h3 className={styles.dealerDetailName}>{listing.dealer.name}</h3>
            <p className={styles.dealerDetailInfo}>
              {listing.dealer.city} &bull; {listing.dealer.phone}
            </p>
            <p className={styles.dealerDetailRating}>
              {renderStars(listing.dealer.rating)} {listing.dealer.rating}
            </p>
            <div className={styles.mapPlaceholder}>
              <span>Map</span>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Similar Listings">
          <SimilarListingsCarousel
            listings={similarListings}
            brandNames={similarBrandNames}
            modelNames={similarModelNames}
            trimNames={similarTrimNames}
            variantNames={similarVariantNames}
          />
        </CollapsibleSection>
      </div>
    </div>
  );
}
