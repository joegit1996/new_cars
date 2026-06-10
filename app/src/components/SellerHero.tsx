"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export interface SellerHeroProps {
  imageUrl: string;
  logoUrl?: string;
  title: string;
  subtitle?: string;
  brandColor: string;
  brandColorDark?: string;
  children?: React.ReactNode;
}

/**
 * Static seller hero: one image, brand gradient overlay, logo + title block.
 * No scroll hijacking, no crossfade, no transition timers.
 */
export default function SellerHero({
  imageUrl,
  logoUrl,
  title,
  subtitle,
  brandColor,
  brandColorDark,
  children,
}: SellerHeroProps) {
  const dark = brandColorDark ?? brandColor;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(380px, 55vh, 580px)" }}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
          unoptimized
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(110deg, ${dark}E6 0%, ${brandColor}99 45%, ${brandColor}33 75%, transparent 100%)`,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.18))",
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-6xl mx-auto h-full px-4 md:px-6 flex flex-col justify-center text-white">
        {logoUrl && (
          <span className="inline-flex items-center justify-center bg-white rounded-lg p-2 w-fit mb-4 shadow-sm">
            <Image
              src={logoUrl}
              alt={title}
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
              unoptimized
            />
          </span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl drop-shadow-sm"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-base md:text-lg mt-3 max-w-xl text-white/90"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mt-6"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
