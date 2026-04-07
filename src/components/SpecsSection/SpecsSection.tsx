import { TrimSpec } from "@/types";
import styles from "./SpecsSection.module.css";

interface SpecsSectionProps {
  specs: TrimSpec;
}

interface SpecRow {
  label: string;
  value: string;
}

interface SpecGroup {
  title: string;
  rows: SpecRow[];
}

function buildGroups(specs: TrimSpec): SpecGroup[] {
  return [
    {
      title: "Performance",
      rows: [
        { label: "Engine", value: specs.engine },
        { label: "Horsepower", value: `${specs.horsepower} HP` },
        { label: "Torque", value: specs.torque },
        { label: "Transmission", value: specs.transmission },
        { label: "Drivetrain", value: specs.drivetrain },
        { label: "0-100 km/h", value: specs.zeroToHundred },
        { label: "Top Speed", value: specs.topSpeed },
      ],
    },
    {
      title: "Dimensions",
      rows: [
        { label: "Length", value: specs.length },
        { label: "Width", value: specs.width },
        { label: "Height", value: specs.height },
        { label: "Wheelbase", value: specs.wheelbase },
        { label: "Curb Weight", value: specs.curbWeight },
        { label: "Cargo Volume", value: specs.cargoVolume },
      ],
    },
    {
      title: "Comfort & Features",
      rows: [
        { label: "Seating Capacity", value: String(specs.seatingCapacity) },
        { label: "Infotainment Screen", value: specs.infotainmentScreen },
        { label: "Features", value: specs.features.join(", ") },
      ],
    },
    {
      title: "Fuel & Efficiency",
      rows: [
        { label: "Fuel Type", value: specs.fuelType },
        { label: "Fuel Tank", value: specs.fuelTank },
        { label: "Fuel Consumption", value: specs.fuelConsumption },
      ],
    },
  ];
}

export default function SpecsSection({ specs }: SpecsSectionProps) {
  const groups = buildGroups(specs);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Specifications</h2>
      {groups.map((group) => (
        <div key={group.title} className={styles.group}>
          <h3 className={styles.groupTitle}>{group.title}</h3>
          <div className={styles.grid}>
            {group.rows.map((row) => (
              <div key={row.label} className={styles.row}>
                <span className={styles.label}>{row.label}</span>
                <span className={styles.value}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
