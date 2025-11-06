"use client";

import { useEffect } from "react";
export default function PerfScrollOptimizer() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let timer = null;
    const DEBOUNCE = 250; // ms - how long to keep blur disabled after interaction

    const enableReduce = () => {
      document.documentElement.classList.add("reduce-blur");
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        document.documentElement.classList.remove("reduce-blur");
        timer = null;
      }, DEBOUNCE);
    };

    // Use passive listeners where possible to avoid blocking scroll
    window.addEventListener("scroll", enableReduce, { passive: true });
    window.addEventListener("touchstart", enableReduce, { passive: true });
    window.addEventListener("touchmove", enableReduce, { passive: true });
    window.addEventListener("pointerdown", enableReduce, { passive: true });
    window.addEventListener("keydown", enableReduce, { passive: true });

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("scroll", enableReduce);
      window.removeEventListener("touchstart", enableReduce);
      window.removeEventListener("touchmove", enableReduce);
      window.removeEventListener("pointerdown", enableReduce);
      window.removeEventListener("keydown", enableReduce);
    };
  }, []);

  return null;
}
