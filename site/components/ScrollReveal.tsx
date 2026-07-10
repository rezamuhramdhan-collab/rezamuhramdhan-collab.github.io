"use client";

import { useEffect } from "react";

// Scroll-reveal via IntersectionObserver — progressive enhancement.
// Content is fully visible without JS (the hidden state only applies once this
// adds `reveal-ready`). Elements already in/above the viewport reveal
// instantly (no flash); below-the-fold ones animate as they scroll into view.
//
// This lives in the root layout, which persists across client-side
// navigations, so a MutationObserver re-scans for [data-reveal] elements as
// the router swaps page content — new pages' sections are picked up whenever
// they land in the DOM, independent of App Router commit/streaming timing.
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-ready");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const instant = reduce || !("IntersectionObserver" in window);

    const els: HTMLElement[] = [];
    const seen = new WeakSet<HTMLElement>();

    const reveal = (el: Element) => {
      el.classList.add("is-visible");
      io?.unobserve(el);
    };

    const io = instant
      ? null
      : new IntersectionObserver(
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

    // Register any [data-reveal] elements not yet handled: reveal those
    // already in/above view, observe the rest.
    const scan = () => {
      for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
        if (seen.has(el)) continue;
        seen.add(el);
        els.push(el);
        if (instant || inView(el)) el.classList.add("is-visible");
        else io!.observe(el);
      }
    };
    scan();

    // Client-side navigation replaces page content without remounting this
    // component — rescan whenever the DOM changes.
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

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
      mo.disconnect();
      io?.disconnect();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
