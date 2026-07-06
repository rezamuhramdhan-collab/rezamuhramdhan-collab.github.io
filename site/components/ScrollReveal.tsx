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

    const reveal = (el: Element) => {
      el.classList.add("is-visible");
      io.unobserve(el);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(entry.target);
        }
      },
      // threshold 0: any pixel entering the trigger area reveals the element.
      // (A higher threshold never fires for elements taller than ~6x the
      // viewport — common in single-column mobile layouts — leaving them hidden.)
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );

    const inView = (el: Element) => el.getBoundingClientRect().top < window.innerHeight * 0.9;

    // Reveal anything already in/above view on load; observe the rest.
    for (const el of els) {
      if (inView(el)) el.classList.add("is-visible");
      else io.observe(el);
    }

    // Safety net for breakpoint / orientation changes: a reflow can move a
    // still-hidden element into view — reveal any that are now visible.
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        for (const el of els) {
          if (!el.classList.contains("is-visible") && inView(el)) reveal(el);
        }
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
