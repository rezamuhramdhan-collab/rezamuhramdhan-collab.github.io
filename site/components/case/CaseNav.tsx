"use client";

import { useEffect, useState } from "react";

export function CaseNav({ anchors }: { anchors: string[] }) {
  const [activeAnchor, setActiveAnchor] = useState(anchors[0] ?? "");

  useEffect(() => {
    if (anchors.length === 0) return;

    const updateActiveAnchor = () => {
      let current = anchors[0];
      for (const anchor of anchors) {
        const section = document.getElementById(anchor);
        if (section && section.getBoundingClientRect().top <= 120) {
          current = anchor;
        }
      }
      setActiveAnchor(current);
    };

    updateActiveAnchor();
    window.addEventListener("scroll", updateActiveAnchor, { passive: true });
    window.addEventListener("hashchange", updateActiveAnchor);

    return () => {
      window.removeEventListener("scroll", updateActiveAnchor);
      window.removeEventListener("hashchange", updateActiveAnchor);
    };
  }, [anchors]);

  return (
    <nav className="tab-nav" aria-label="Case study sections">
      {anchors.map((anchor) => {
        const active = anchor === activeAnchor;
        return (
          <a
            key={anchor}
            className={active ? "active" : undefined}
            href={`#${anchor}`}
            aria-current={active ? "location" : undefined}
            onClick={() => setActiveAnchor(anchor)}
          >
            {anchor.replace(/-/g, " ")}
          </a>
        );
      })}
    </nav>
  );
}
