"use client";

import { useEffect } from "react";

// Scroll-reveal via IntersectionObserver — progressive enhancement.
// Content is fully visible without JS (the hidden state only applies once this
// adds `reveal-ready`). Elements already in/above the viewport on load reveal
// instantly (no flash); below-the-fold ones animate as they scroll into view.
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-ready");

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    const vh = window.innerHeight;
    for (const el of els) {
      // Already visible on load → show immediately (same tick = no animation, no flash).
      if (el.getBoundingClientRect().top < vh * 0.9) {
        el.classList.add("is-visible");
      } else {
        io.observe(el);
      }
    }

    return () => io.disconnect();
  }, []);

  return null;
}
