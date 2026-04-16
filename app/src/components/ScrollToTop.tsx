"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Use 'instant' to bypass CSS scroll-behavior: smooth
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Also reset nested overflow containers (e.g. model detail app-shell)
    document.querySelectorAll("main").forEach((el) => {
      el.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
  }, [pathname]);

  return null;
}
