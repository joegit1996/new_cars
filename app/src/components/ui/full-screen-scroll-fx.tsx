"use client";

import React, {
  CSSProperties,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Section = {
  id?: string;
  background: string;
  leftLabel?: ReactNode;
  title: string | ReactNode;
  rightLabel?: ReactNode;
  bottomContent?: ReactNode;
  renderBackground?: (active: boolean, previous: boolean) => ReactNode;
};

type Colors = Partial<{
  text: string;
  overlay: string;
  pageBg: string;
  stageBg: string;
}>;

type Durations = Partial<{
  change: number;
  snap: number;
}>;

export type FullScreenFXAPI = {
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  getIndex: () => number;
  refresh: () => void;
};

export type FullScreenFXProps = {
  sections: Section[];
  className?: string;
  style?: CSSProperties;
  fontFamily?: string;
  header?: ReactNode;
  footer?: ReactNode;
  gap?: number;
  gridPaddingX?: number;
  showProgress?: boolean;
  debug?: boolean;
  durations?: Durations;
  reduceMotion?: boolean;
  smoothScroll?: boolean;
  bgTransition?: "fade" | "wipe";
  parallaxAmount?: number;
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  initialIndex?: number;
  colors?: Colors;
  apiRef?: React.Ref<FullScreenFXAPI>;
  ariaLabel?: string;
};

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

export const FullScreenScrollFX = forwardRef<HTMLDivElement, FullScreenFXProps>(
  (
    {
      sections,
      className,
      style,
      fontFamily = '"Sakr Pro", system-ui, -apple-system, "Segoe UI", Roboto',
      header,
      footer,
      gap = 1,
      gridPaddingX = 2,
      showProgress = true,
      debug = false,
      durations = { change: 0.7, snap: 800 },
      reduceMotion,
      smoothScroll = false,
      bgTransition = "fade",
      parallaxAmount = 4,
      currentIndex,
      onIndexChange,
      initialIndex = 0,
      colors = {
        text: "rgba(245,245,245,0.92)",
        overlay: "rgba(0,0,0,0.0)",
        pageBg: "#111318",
        stageBg: "#111318",
      },
      apiRef,
      ariaLabel = "Full screen scroll slideshow",
    },
    ref
  ) => {
    const total = sections.length;
    const [localIndex, setLocalIndex] = useState(
      clamp(initialIndex, 0, Math.max(0, total - 1))
    );
    const isControlled = typeof currentIndex === "number";
    const index = isControlled
      ? clamp(currentIndex!, 0, Math.max(0, total - 1))
      : localIndex;

    const rootRef = useRef<HTMLDivElement | null>(null);
    const fixedRef = useRef<HTMLDivElement | null>(null);
    const fixedSectionRef = useRef<HTMLDivElement | null>(null);
    const bgRefs = useRef<(HTMLElement | null)[]>([]);
    const wordRefs = useRef<HTMLSpanElement[][]>([]);
    const leftTrackRef = useRef<HTMLDivElement | null>(null);
    const rightTrackRef = useRef<HTMLDivElement | null>(null);
    const leftItemRefs = useRef<HTMLDivElement[]>([]);
    const rightItemRefs = useRef<HTMLDivElement[]>([]);
    const progressFillRef = useRef<HTMLDivElement | null>(null);
    const currentNumberRef = useRef<HTMLSpanElement | null>(null);
    const stRef = useRef<ScrollTrigger | null>(null);
    const lastIndexRef = useRef(index);
    const isAnimatingRef = useRef(false);
    const isSnappingRef = useRef(false);
    const sectionTopRef = useRef<number[]>([]);

    const prefersReduced = useMemo(() => {
      if (typeof window === "undefined") return false;
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    }, []);
    const motionOff = reduceMotion ?? prefersReduced;

    const tempWordBucket = useRef<HTMLSpanElement[]>([]);

    const splitWords = (text: string) => {
      const words = text.split(/\s+/).filter(Boolean);
      return words.map((w, i) => (
        <span className="inline-block overflow-hidden align-middle" key={i}>
          <span
            className="inline-block align-middle"
            ref={(el) => { if (el) tempWordBucket.current.push(el); }}
          >
            {w}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ));
    };

    const WordsCollector = ({ onReady }: { onReady: () => void }) => {
      useEffect(() => onReady(), []);
      return null;
    };

    const computePositions = () => {
      const el = fixedSectionRef.current;
      if (!el) return;
      const top = el.offsetTop;
      const h = el.offsetHeight;
      const arr: number[] = [];
      for (let i = 0; i < total; i++) arr.push(top + (h * i) / total);
      sectionTopRef.current = arr;
    };

    const measureRAF = (fn: () => void) => {
      if (typeof window === "undefined") return;
      requestAnimationFrame(() => requestAnimationFrame(fn));
    };

    const measureAndCenterLists = (toIndex = index, animate = true) => {
      const centerTrack = (
        container: HTMLDivElement | null,
        items: HTMLDivElement[],
        isRight: boolean
      ) => {
        if (!container || items.length === 0) return;
        const first = items[0];
        const second = items[1];
        const contRect = container.getBoundingClientRect();
        let rowH = first.getBoundingClientRect().height;
        if (second) {
          rowH =
            second.getBoundingClientRect().top -
            first.getBoundingClientRect().top;
        }
        const targetY = contRect.height / 2 - rowH / 2 - toIndex * rowH;
        const prop = isRight ? rightTrackRef : leftTrackRef;
        if (!prop.current) return;
        if (animate) {
          gsap.to(prop.current, {
            y: targetY,
            duration: (durations.change ?? 0.7) * 0.9,
            ease: "power3.out",
          });
        } else {
          gsap.set(prop.current, { y: targetY });
        }
      };

      measureRAF(() => {
        measureRAF(() => {
          centerTrack(leftTrackRef.current, leftItemRefs.current, false);
          centerTrack(rightTrackRef.current, rightItemRefs.current, true);
        });
      });
    };

    useLayoutEffect(() => {
      if (typeof window === "undefined") return;
      const fixed = fixedRef.current;
      const fs = fixedSectionRef.current;
      if (!fixed || !fs || total === 0) return;

      const validBgs = bgRefs.current.filter(Boolean) as HTMLElement[];
      gsap.set(validBgs, { opacity: 0, scale: 1.0, yPercent: 0 });
      if (validBgs[0]) {
        gsap.set(validBgs[0], { opacity: 1, scale: 1.0 });
        // Ken Burns zoom on the initial section
        gsap.to(validBgs[0], { scale: 1.12, duration: 4, ease: "none" });
      }

      wordRefs.current.forEach((words, sIdx) => {
        words.forEach((w) => {
          gsap.set(w, {
            yPercent: sIdx === index ? 0 : 100,
            opacity: sIdx === index ? 1 : 0,
          });
        });
      });

      computePositions();
      measureAndCenterLists(index, false);

      const st = ScrollTrigger.create({
        trigger: fs,
        start: "top top",
        end: "bottom bottom",
        pin: fixed,
        pinSpacing: true,
        onUpdate: (self) => {
          if (motionOff || isSnappingRef.current) return;
          const prog = self.progress;
          const target = Math.min(total - 1, Math.floor(prog * total));
          if (target !== lastIndexRef.current && !isAnimatingRef.current) {
            const next =
              lastIndexRef.current +
              (target > lastIndexRef.current ? 1 : -1);
            goTo(next, false);
          }
          if (progressFillRef.current) {
            const p = (lastIndexRef.current / (total - 1 || 1)) * 100;
            progressFillRef.current.style.width = `${p}%`;
          }
        },
      });

      stRef.current = st;

      if (initialIndex && initialIndex > 0 && initialIndex < total) {
        requestAnimationFrame(() => goTo(initialIndex, false));
      }

      const ro = new ResizeObserver(() => {
        computePositions();
        measureAndCenterLists(lastIndexRef.current, false);
        ScrollTrigger.refresh();
      });
      ro.observe(fs);

      return () => {
        ro.disconnect();
        st.kill();
        stRef.current = null;
      };
    }, [total, initialIndex, motionOff, bgTransition, parallaxAmount]);

    const changeSection = (to: number) => {
      if (to === lastIndexRef.current || isAnimatingRef.current) return;
      const from = lastIndexRef.current;
      const down = to > from;
      isAnimatingRef.current = true;

      if (!isControlled) setLocalIndex(to);
      onIndexChange?.(to);

      if (currentNumberRef.current) {
        currentNumberRef.current.textContent = String(to + 1).padStart(2, "0");
      }
      if (progressFillRef.current) {
        const p = (to / (total - 1 || 1)) * 100;
        progressFillRef.current.style.width = `${p}%`;
      }

      const D = durations.change ?? 0.7;

      const outWords = wordRefs.current[from] || [];
      const inWords = wordRefs.current[to] || [];

      if (outWords.length) {
        gsap.to(outWords, {
          yPercent: down ? -100 : 100,
          opacity: 0,
          duration: D * 0.6,
          stagger: down ? 0.03 : -0.03,
          ease: "power3.out",
        });
      }

      if (inWords.length) {
        gsap.set(inWords, { yPercent: down ? 100 : -100, opacity: 0 });
        gsap.to(inWords, {
          yPercent: 0,
          opacity: 1,
          duration: D,
          stagger: down ? 0.05 : -0.05,
          ease: "power3.out",
        });
      }

      const prevBg = bgRefs.current[from];
      const newBg = bgRefs.current[to];

      if (bgTransition === "fade") {
        if (newBg) {
          gsap.set(newBg, {
            opacity: 0,
            scale: 1.0,
            yPercent: down ? 1 : -1,
          });
          gsap.to(newBg, {
            opacity: 1,
            scale: 1.0,
            yPercent: 0,
            duration: D,
            ease: "power2.out",
          });
          // Slow Ken Burns zoom while this section is active
          gsap.to(newBg, {
            scale: 1.12,
            duration: 4,
            ease: "none",
          });
        }
        if (prevBg) {
          gsap.killTweensOf(prevBg, "scale");
          gsap.to(prevBg, {
            opacity: 0,
            yPercent: down ? -parallaxAmount : parallaxAmount,
            duration: D,
            ease: "power2.out",
          });
        }
      } else {
        if (newBg) {
          gsap.set(newBg, {
            opacity: 1,
            clipPath: down ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)",
            scale: 1,
            yPercent: 0,
          });
          gsap.to(newBg, {
            clipPath: "inset(0 0 0 0)",
            duration: D,
            ease: "power3.out",
          });
        }
        if (prevBg) {
          gsap.to(prevBg, {
            opacity: 0,
            duration: D * 0.8,
            ease: "power2.out",
          });
        }
      }

      measureAndCenterLists(to, true);

      leftItemRefs.current.forEach((el, i) => {
        gsap.to(el, {
          opacity: i === to ? 1 : 0.35,
          x: i === to ? 10 : 0,
          duration: D * 0.6,
          ease: "power3.out",
        });
      });

      rightItemRefs.current.forEach((el, i) => {
        gsap.to(el, {
          opacity: i === to ? 1 : 0.35,
          x: i === to ? -10 : 0,
          duration: D * 0.6,
          ease: "power3.out",
        });
      });

      gsap.delayedCall(D, () => {
        lastIndexRef.current = to;
        isAnimatingRef.current = false;
      });
    };

    const goTo = (to: number, withScroll = true) => {
      const clamped = clamp(to, 0, total - 1);
      isSnappingRef.current = true;
      changeSection(clamped);

      const pos = sectionTopRef.current[clamped];
      const snapMs = durations.snap ?? 800;

      if (withScroll && typeof window !== "undefined") {
        window.scrollTo({ top: pos, behavior: "smooth" });
        setTimeout(() => (isSnappingRef.current = false), snapMs);
      } else {
        setTimeout(() => (isSnappingRef.current = false), 10);
      }
    };

    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    useImperativeHandle(apiRef, () => ({
      next,
      prev,
      goTo,
      getIndex: () => index,
      refresh: () => ScrollTrigger.refresh(),
    }));

    const handleJump = (i: number) => goTo(i);

    const handleLoadedStagger = () => {
      leftItemRefs.current.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: i === index ? 1 : 0.35,
            y: 0,
            duration: 0.5,
            delay: i * 0.06,
            ease: "power3.out",
          }
        );
      });
      rightItemRefs.current.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: i === index ? 1 : 0.35,
            y: 0,
            duration: 0.5,
            delay: 0.2 + i * 0.06,
            ease: "power3.out",
          }
        );
      });
    };

    useEffect(() => {
      handleLoadedStagger();
      measureAndCenterLists(index, false);
    }, []);

    const cssVars = {
      "--fx-font": fontFamily,
      "--fx-text": colors.text ?? "rgba(245,245,245,0.92)",
      "--fx-overlay": colors.overlay ?? "rgba(0,0,0,0.0)",
      "--fx-page-bg": colors.pageBg ?? "#111318",
      "--fx-stage-bg": colors.stageBg ?? "#111318",
      "--fx-gap": `${gap}rem`,
      "--fx-grid-px": `${gridPaddingX}rem`,
      "--fx-row-gap": "10px",
    } as CSSProperties;

    return (
      <div
        ref={(node) => {
          (rootRef as React.MutableRefObject<HTMLDivElement | null>).current =
            node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (
              ref as React.MutableRefObject<HTMLDivElement | null>
            ).current = node;
        }}
        className={`fx-root w-full overflow-hidden uppercase tracking-tight ${className || ""}`}
        style={{ ...cssVars, ...style, background: "var(--fx-page-bg)", color: "#000", fontFamily: "var(--fx-font)" }}
        aria-label={ariaLabel}
      >
        {debug && (
          <div className="fixed bottom-2.5 right-2.5 z-[9999] bg-white/80 text-black px-2 py-1.5 text-xs font-mono rounded">
            Section: {index}
          </div>
        )}

        <div className="fx-scroll">
          <div
            className="fx-fixed-section relative"
            ref={fixedSectionRef}
            style={{ height: `${Math.max(1, total + 1)}00vh` }}
          >
            <div
              className="fx-fixed sticky top-0 h-screen w-full overflow-hidden"
              ref={fixedRef}
              style={{ background: "var(--fx-page-bg)" }}
            >
              {/* Background images */}
              <div
                className="absolute inset-0 z-[1]"
                aria-hidden="true"
                style={{ background: "var(--fx-stage-bg)" }}
              >
                {sections.map((s, i) => (
                  <div className="absolute inset-0" key={s.id ?? i}>
                    {s.renderBackground ? (
                      s.renderBackground(
                        index === i,
                        lastIndexRef.current === i
                      )
                    ) : (
                      <>
                        <div
                          ref={(el) => {
                            if (el) bgRefs.current[i] = el;
                          }}
                          className="absolute w-full will-change-transform"
                          style={{
                            inset: "-10% 0 -10% 0",
                            height: "120%",
                            opacity: 0,
                          }}
                        >
                          <img
                            src={s.background}
                            alt=""
                            className="w-full h-full object-cover"
                            style={{ filter: "brightness(1)" }}
                          />
                        </div>
                        <div
                          className="absolute inset-0"
                          style={{ background: "var(--fx-overlay)" }}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Grid overlay */}
              <div
                className="fx-grid relative z-[2] grid grid-cols-12 h-full"
                style={{
                  gap: "var(--fx-gap)",
                  padding: "0 var(--fx-grid-px)",
                }}
              >
                {header && (
                  <div className="col-span-12 self-start pt-[6vh] text-center text-[clamp(2rem,9vw,9rem)] leading-[0.86]"
                    style={{ color: "var(--fx-text)" }}
                  >
                    {header}
                  </div>
                )}

                {/* Side labels: vertically centered */}
                <div className="col-span-12 absolute inset-0 grid fx-content-grid items-center h-full pointer-events-none"
                  style={{ padding: "0 var(--fx-grid-px)" }}
                >
                  {/* Left column */}
                  <div className="h-[60vh] overflow-hidden grid content-center justify-items-start max-md:hidden pointer-events-auto">
                    <div
                      className="will-change-transform"
                      ref={leftTrackRef}
                    >
                      {sections.map((s, i) => (
                        <div
                          key={`L-${s.id ?? i}`}
                          className={`fx-item text-[clamp(1rem,2.4vw,1.8rem)] font-extrabold leading-none select-none cursor-pointer transition-all duration-300 ${
                            i === index ? "opacity-100 pl-4" : "opacity-35"
                          }`}
                          style={{
                            color: "var(--fx-text)",
                            margin: "calc(var(--fx-row-gap) / 2) 0",
                          }}
                          ref={(el) => {
                            if (el) leftItemRefs.current[i] = el;
                          }}
                          onClick={() => handleJump(i)}
                          role="button"
                          tabIndex={0}
                          aria-pressed={i === index}
                        >
                          {i === index && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                              style={{ background: "var(--fx-text)" }}
                            />
                          )}
                          <span className="relative">{s.leftLabel}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Center spacer (image fills this area) */}
                  <div />

                  {/* Right column */}
                  <div className="h-[60vh] overflow-hidden grid content-center justify-items-end max-md:hidden pointer-events-auto">
                    <div
                      className="will-change-transform"
                      ref={rightTrackRef}
                    >
                      {sections.map((s, i) => (
                        <div
                          key={`R-${s.id ?? i}`}
                          className={`fx-item text-right text-[clamp(1rem,2.4vw,1.8rem)] font-extrabold leading-none select-none cursor-pointer transition-all duration-300 ${
                            i === index ? "opacity-100 pr-4" : "opacity-35"
                          }`}
                          style={{
                            color: "var(--fx-text)",
                            margin: "calc(var(--fx-row-gap) / 2) 0",
                          }}
                          ref={(el) => {
                            if (el) rightItemRefs.current[i] = el;
                          }}
                          onClick={() => handleJump(i)}
                          role="button"
                          tabIndex={0}
                          aria-pressed={i === index}
                        >
                          <span className="relative">{s.rightLabel}</span>
                          {i === index && (
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                              style={{ background: "var(--fx-text)" }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom content: model details anchored to bottom */}
                <div className="col-span-12 absolute bottom-0 inset-x-0 z-[3]"
                  style={{ padding: "0 var(--fx-grid-px)" }}
                >
                  {sections.map((s, sIdx) => {
                    tempWordBucket.current = [];
                    const isString = typeof s.title === "string";
                    return (
                      <div
                        key={`C-${s.id ?? sIdx}`}
                        className={`absolute bottom-0 inset-x-0 transition-all duration-500 ${
                          sIdx === index
                            ? "opacity-100 visible translate-y-0"
                            : "opacity-0 invisible translate-y-4"
                        }`}
                        style={{ padding: "0 var(--fx-grid-px)" }}
                      >
                        {/* Title with word animation */}
                        <div className="text-center mb-2">
                          <div className="text-[clamp(1.6rem,5vw,4rem)] font-black tracking-tight"
                            style={{ color: "var(--fx-text)" }}
                          >
                            {isString
                              ? splitWords(s.title as string)
                              : s.title}
                          </div>
                        </div>
                        <WordsCollector
                          onReady={() => {
                            if (tempWordBucket.current.length) {
                              wordRefs.current[sIdx] = [
                                ...tempWordBucket.current,
                              ];
                            }
                            tempWordBucket.current = [];
                          }}
                        />
                        {/* Bottom content slot */}
                        {s.bottomContent && (
                          <div className="text-center">{s.bottomContent}</div>
                        )}
                        {/* Progress dots */}
                        {showProgress && (
                          <div className="flex items-center justify-center gap-1.5 pt-4 pb-5">
                            {sections.map((_, dotIdx) => (
                              <button
                                key={dotIdx}
                                onClick={() => handleJump(dotIdx)}
                                className="h-1.5 rounded-full transition-all duration-300"
                                style={{
                                  width: dotIdx === sIdx ? 20 : 6,
                                  background: dotIdx === sIdx
                                    ? "var(--fx-text)"
                                    : "rgba(255,255,255,0.25)",
                                }}
                                aria-label={`Go to model ${dotIdx + 1}`}
                              />
                            ))}
                          </div>
                        )}
                        {!showProgress && <div className="pb-5" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

FullScreenScrollFX.displayName = "FullScreenScrollFX";
