"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import PlaceholderImage, { silhouetteMap } from "./PlaceholderImage";

export interface GalleryImage {
  label: string;
  category: string;
}

interface CircularGalleryProps {
  images: GalleryImage[];
  filter: string;
}

function getCardStyle(angleDeg: number, containerW: number, cardW: number) {
  let a = ((angleDeg % 360) + 360) % 360;
  if (a > 180) a -= 360;

  const absA = Math.abs(a);
  const spread = containerW * 0.48;
  const x = Math.sin((a * Math.PI) / 180) * spread;
  const scale = 1 - absA / 220;
  const opacity = absA > 120 ? 0 : Math.max(0.2, 1 - absA / 100);
  const zIndex = Math.round((180 - absA) / 180 * 10);
  const y = absA * 0.35;

  return {
    x: x - cardW / 2,
    y,
    scale: Math.max(0.45, scale),
    opacity,
    zIndex,
    visible: absA <= 120,
  };
}

export default function CircularGallery({ images, filter }: CircularGalleryProps) {
  const [rotation, setRotation] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [containerW, setContainerW] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragCommitted = useRef(false); // true once we know this is a horizontal drag
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const dragStartRotation = useRef(0);
  const totalDragDist = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const momentumRef = useRef<number | null>(null);
  const pointerDownCardIndex = useRef(-1);
  const lightboxTouchStart = useRef(0);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) setContainerW(containerRef.current.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    setRotation(0);
    setExpandedIndex(null);
  }, [filter]);

  const filtered =
    filter === "All" ? images : images.filter((img) => img.category === filter);
  const count = filtered.length;
  const anglePerItem = count > 0 ? 360 / count : 360;

  const isMobile = containerW < 640;
  const CARD_W = isMobile
    ? Math.min(containerW * 0.55, 220)
    : Math.min(containerW * 0.3, 340);
  const CARD_H = CARD_W * 0.667;

  const stopMomentum = useCallback(() => {
    if (momentumRef.current) {
      cancelAnimationFrame(momentumRef.current);
      momentumRef.current = null;
    }
  }, []);

  const startMomentum = useCallback(() => {
    stopMomentum();
    const decay = () => {
      velocityRef.current *= 0.93;
      if (Math.abs(velocityRef.current) < 0.03) {
        velocityRef.current = 0;
        return;
      }
      setRotation((r) => r + velocityRef.current);
      momentumRef.current = requestAnimationFrame(decay);
    };
    momentumRef.current = requestAnimationFrame(decay);
  }, [stopMomentum]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, cardIndex: number) => {
      stopMomentum();
      isDragging.current = true;
      dragCommitted.current = false;
      totalDragDist.current = 0;
      pointerDownCardIndex.current = cardIndex;
      dragStartX.current = e.clientX;
      dragStartY.current = e.clientY;
      dragStartRotation.current = rotation;
      lastXRef.current = e.clientX;
      lastTimeRef.current = Date.now();
      velocityRef.current = 0;
    },
    [rotation, stopMomentum]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;

      const dx = e.clientX - dragStartX.current;
      const dy = e.clientY - dragStartY.current;

      // If we haven't committed to a drag direction yet, check threshold
      if (!dragCommitted.current) {
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        // Need at least 8px movement to decide
        if (absDx < 8 && absDy < 8) return;
        if (absDy > absDx) {
          // Vertical swipe -- abort drag, let page scroll
          isDragging.current = false;
          pointerDownCardIndex.current = -1;
          return;
        }
        // Horizontal -- commit to carousel drag, prevent page scroll
        dragCommitted.current = true;
        e.preventDefault();
      }

      totalDragDist.current = Math.abs(dx);
      const sensitivity = 0.2;
      setRotation(dragStartRotation.current + dx * sensitivity);

      const now = Date.now();
      const dt = now - lastTimeRef.current;
      if (dt > 0) {
        velocityRef.current =
          ((e.clientX - lastXRef.current) * sensitivity) /
          Math.max(dt / 16, 1);
      }
      lastXRef.current = e.clientX;
      lastTimeRef.current = now;
    },
    []
  );

  const handlePointerUp = useCallback(
    (_e: React.PointerEvent) => {
      const wasDrag = totalDragDist.current > 8;
      isDragging.current = false;
      dragCommitted.current = false;

      if (wasDrag) {
        startMomentum();
      } else if (pointerDownCardIndex.current >= 0) {
        setExpandedIndex(pointerDownCardIndex.current);
      }

      pointerDownCardIndex.current = -1;
    },
    [startMomentum]
  );

  useEffect(() => () => stopMomentum(), [stopMomentum]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (expandedIndex !== null) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [expandedIndex]);

  if (count === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-[#64748B]">
        No images in this category.
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Carousel area -- touch-action: pan-y allows vertical scroll, we handle horizontal */}
      <div
        className="relative w-full select-none cursor-grab active:cursor-grabbing"
        style={{
          height: CARD_H + 60,
          touchAction: "pan-y",
          visibility: expandedIndex !== null ? "hidden" : "visible",
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {filtered.map((img, i) => {
          const angle = rotation + i * anglePerItem;
          const s = getCardStyle(angle, containerW, CARD_W);
          if (!s.visible) return null;

          return (
            <div
              key={`${img.label}-${i}`}
              className="absolute top-0"
              style={{
                width: CARD_W,
                height: CARD_H,
                left: "50%",
                transform: `translate(${s.x}px, ${s.y}px) scale(${s.scale})`,
                opacity: s.opacity,
                zIndex: s.zIndex,
                transition: isDragging.current
                  ? "none"
                  : "transform 0.15s ease-out, opacity 0.15s ease-out",
                transformOrigin: "center top",
              }}
              onPointerDown={(e) => handlePointerDown(e, i)}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-[#E2E8F0] hover:shadow-xl transition-shadow cursor-pointer">
                <PlaceholderImage
                  aspectRatio="3/2"
                  className="w-full h-full"
                  label={img.label}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Drag hint */}
      <p className="text-center text-xs text-[#94A3B8] mt-3">
        Drag to browse &middot; Click to expand
      </p>

      {/* Expanded lightbox -- portalled to body to escape stacking contexts */}
      {typeof document !== "undefined" &&
        expandedIndex !== null &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100dvh",
              backgroundColor: "rgba(0, 0, 0, 0.92)",
              zIndex: 99999,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            onClick={() => setExpandedIndex(null)}
            onTouchStart={(e) => {
              lightboxTouchStart.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - lightboxTouchStart.current;
              if (Math.abs(dx) > 50) {
                if (dx < 0 && expandedIndex < filtered.length - 1) {
                  setExpandedIndex(expandedIndex + 1);
                } else if (dx > 0 && expandedIndex > 0) {
                  setExpandedIndex(expandedIndex - 1);
                }
              }
            }}
          >
            {/* Top bar: close button */}
            <div className="flex-none flex justify-end p-3">
              <button
                onClick={() => setExpandedIndex(null)}
                className="w-11 h-11 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                aria-label="Close lightbox"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Image area -- fills all remaining space */}
            <div
              className="flex-1 min-h-0 px-3 sm:px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-4xl mx-auto h-full rounded-lg overflow-hidden bg-[#E2E8F0] relative flex items-center justify-center">
                <svg
                  viewBox="0 0 120 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-1/3 h-auto opacity-30"
                >
                  {(() => {
                    const Sil = silhouetteMap["SUV"] ?? (() => null);
                    return <Sil />;
                  })()}
                </svg>
              </div>
            </div>

            {/* Bottom controls bar */}
            <div
              className="flex-none w-full max-w-4xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => expandedIndex > 0 && setExpandedIndex(expandedIndex - 1)}
                className={`w-11 h-11 flex items-center justify-center rounded-full text-white transition-colors ${
                  expandedIndex > 0
                    ? "bg-white/10 hover:bg-white/20"
                    : "opacity-30 cursor-default"
                }`}
                aria-label="Previous image"
                disabled={expandedIndex <= 0}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <p className="text-white/70 text-sm text-center">
                {filtered[expandedIndex]?.label} -- {expandedIndex + 1} of{" "}
                {filtered.length}
              </p>

              <button
                onClick={() =>
                  expandedIndex < filtered.length - 1 &&
                  setExpandedIndex(expandedIndex + 1)
                }
                className={`w-11 h-11 flex items-center justify-center rounded-full text-white transition-colors ${
                  expandedIndex < filtered.length - 1
                    ? "bg-white/10 hover:bg-white/20"
                    : "opacity-30 cursor-default"
                }`}
                aria-label="Next image"
                disabled={expandedIndex >= filtered.length - 1}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
