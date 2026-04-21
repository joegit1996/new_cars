"use client";

import { useRef, useEffect } from "react";

interface HeroMedia {
  type: "video" | "image";
  url: string;
}

export default function VideoHero({
  media,
  children,
  className = "",
}: {
  media?: HeroMedia;
  children?: React.ReactNode;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  }, [media]);

  const isVideo = media ? media.type === "video" : true;
  const src = media?.url ?? "/videos/porsche-hero.mp4";

  return (
    <div className={`relative w-full overflow-hidden bg-black ${className}`}>
      <div className="relative w-full" style={{ aspectRatio: "21/9" }}>
        {isVideo ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <img
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
      {children}
    </div>
  );
}
