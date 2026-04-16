"use client";
import { FC, ReactNode } from "react";

interface iCardItem {
  title: string;
  description: string;
  tag: string;
  image: ReactNode;
  color: string;
  textColor: string;
}

interface iCardProps extends iCardItem {
  i: number;
}

const Card: FC<iCardProps> = ({
  title,
  description,
  tag,
  image,
  color,
  textColor,
  i,
}) => {
  const isEven = i % 2 === 0;

  return (
    <div className="h-[100cqh] md:h-[100dvh] sticky top-0" style={{ zIndex: i }}>
      <div
        className="w-full h-full flex flex-col items-stretch justify-between md:flex-row md:items-center md:justify-center md:gap-0"
        style={{ backgroundColor: color }}
      >
        {/* Text side */}
        <div
          className={`shrink-0 md:flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-14 md:pt-0 ${
            isEven ? "md:order-1" : "md:order-2"
          }`}
        >
          <p
            className="text-xs font-bold uppercase tracking-wider mb-3 opacity-50"
            style={{ color: textColor }}
          >
            {tag}
          </p>
          <h3
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3"
            style={{ color: textColor }}
          >
            {title}
          </h3>
          <p
            className="text-sm md:text-base lg:text-lg leading-relaxed opacity-60 max-w-lg"
            style={{ color: textColor }}
          >
            {description}
          </p>
        </div>

        {/* Image side */}
        <div
          className={`flex-1 min-h-0 flex items-center justify-center md:p-10 lg:p-16 ${
            isEven ? "md:order-2" : "md:order-1"
          }`}
        >
          <div className="w-full">
            {image}
          </div>
        </div>
      </div>
    </div>
  );
};

interface iCardSlideProps {
  items: iCardItem[];
}

const CardsParallax: FC<iCardSlideProps> = ({ items }) => {
  return (
    <div style={{ scrollSnapAlign: "start" }}>
      {items.map((item, i) => (
        <Card key={i} {...item} i={i} />
      ))}
    </div>
  );
};

export { CardsParallax, type iCardItem };
