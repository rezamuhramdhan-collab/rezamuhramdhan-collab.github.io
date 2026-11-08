"use client";

import { useEffect, useState } from "react";

type ContentsItem = { id: string; label: string };

export function CaseNav({ items }: { items: ContentsItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  useEffect(() => {
    if (!items.length) return;
    let frame = 0;
    const update = () => {
      let current = items[0].id;
      for (const { id } of items) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= 160) current = id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", update);
    };
  }, [items]);

  return (
    <nav className="tab-nav" aria-label="Case study sections">
      {items.map(({ id, label }, index) => (
        <a key={id} className={id === activeId ? "active" : undefined} href={`#${id}`}
          aria-current={id === activeId ? "location" : undefined} onClick={() => setActiveId(id)}>
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{label}
        </a>
      ))}
    </nav>
  );
}
