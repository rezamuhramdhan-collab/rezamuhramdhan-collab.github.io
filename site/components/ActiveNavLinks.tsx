"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LinkItem } from "@/content/types";

function getAnchor(href: string) {
  const hashIndex = href.indexOf("#");
  return hashIndex >= 0 ? href.slice(hashIndex + 1) : "";
}

export function ActiveNavLinks({ links }: { links: LinkItem[] }) {
  const anchors = links.map((link) => getAnchor(link.href));
  const [activeAnchor, setActiveAnchor] = useState(anchors.find(Boolean) ?? "");

  useEffect(() => {
    const sectionAnchors = anchors.filter(Boolean);
    if (sectionAnchors.length === 0) return;

    const updateActiveAnchor = () => {
      let current = sectionAnchors[0];

      for (const anchor of sectionAnchors) {
        const section = document.getElementById(anchor);
        if (section && section.getBoundingClientRect().top <= 96) {
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
  }, [anchors.join("|")]);

  return (
    <div className="nav-links">
      {links.map((link) => {
        const anchor = getAnchor(link.href);
        const active = Boolean(anchor) && anchor === activeAnchor;

        return (
          <Link
            key={link.label}
            className={active ? "active" : undefined}
            href={link.href}
            aria-current={active ? "location" : undefined}
            onClick={() => anchor && setActiveAnchor(anchor)}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
