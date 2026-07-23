"use client";

import { useEffect, useState, type ReactNode } from "react";

export function StickyNavShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolledState = () => setScrolled(window.scrollY > 16);

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

  return (
    <nav className={`site-nav px${scrolled ? " is-scrolled" : ""}`}>
      {children}
    </nav>
  );
}
