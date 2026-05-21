"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const SCROLL_KEY = "__scrollY";
const NAV_KEY = "__navKey";
const MAX_RESTORE_ATTEMPTS = 60; // ~1s at 60fps

type ScrollState = {
  [SCROLL_KEY]?: number;
  [NAV_KEY]?: string;
};

function makeNavKey(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function readScrollState(): ScrollState {
  if (typeof window === "undefined") return {};
  return (window.history.state ?? {}) as ScrollState;
}

function mergeHistoryState(patch: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const current = (window.history.state ?? {}) as Record<string, unknown>;
  try {
    window.history.replaceState(
      { ...current, ...patch },
      "",
      window.location.href,
    );
  } catch {
    /* ignore */
  }
}

function tryRestoreScroll(target: number) {
  let attempts = 0;
  const tick = () => {
    attempts++;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll >= target || attempts >= MAX_RESTORE_ATTEMPTS) {
      window.scrollTo({ top: target, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = target;
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function scrollToTopAllContainers() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.querySelectorAll("main").forEach((el) => {
    el.scrollTo({ top: 0, left: 0, behavior: "instant" });
  });
}

export default function ScrollToTop() {
  const pathname = usePathname();
  const lastNavKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      // Take over from the browser; we restore manually after content settles.
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Throttled scroll save into history.state for this entry.
  useEffect(() => {
    let rafId: number | undefined;
    const onScroll = () => {
      if (rafId !== undefined) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = undefined;
        mergeHistoryState({ [SCROLL_KEY]: window.scrollY });
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== undefined) cancelAnimationFrame(rafId);
    };
  }, []);

  useIsoLayoutEffect(() => {
    const state = readScrollState();
    let key = state[NAV_KEY];
    const savedScroll = state[SCROLL_KEY];

    if (!key) {
      // No tag on this entry yet → it's a fresh push (forward navigation)
      // or a first-ever visit. Tag it now.
      key = makeNavKey();
      mergeHistoryState({ [NAV_KEY]: key });
    }

    const previousKey = lastNavKeyRef.current;
    lastNavKeyRef.current = key;

    if (previousKey === null) {
      // Initial layout mount. Restore scroll if this entry has a saved one
      // (e.g., page reload on a deep entry); otherwise leave at top.
      if (typeof savedScroll === "number" && savedScroll > 0) {
        tryRestoreScroll(savedScroll);
      }
      return;
    }

    if (previousKey === key) return;

    if (typeof savedScroll === "number") {
      // Known entry with a saved scroll → back/forward navigation.
      tryRestoreScroll(savedScroll);
    } else {
      // Brand-new entry → forward navigation. Scroll to top.
      scrollToTopAllContainers();
    }
  }, [pathname]);

  return null;
}
