"use client";

import { useEffect, useRef, useState } from "react";

type ContentsItem = { id: string; label: string };

export function CaseNav({ items }: { items: ContentsItem[] }) {
  const nav = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  useEffect(() => {
    if (!items.length) return;
    let frame = 0;
    const update = () => {
      let current = items[0].id;
      const boundary = (nav.current?.closest(".case-contents")?.getBoundingClientRect().bottom ?? 128) + 32;
      for (const { id } of items) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= boundary) current = id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", update);
    };
  }, [items]);

  useEffect(() => {
    const container = nav.current;
    const active = container?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!container || !active || container.scrollWidth <= container.clientWidth) return;
    const position = active.getBoundingClientRect().left - container.getBoundingClientRect().left + container.scrollLeft;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.atmosphere === "paused";
    container.scrollTo({ left: position - (container.clientWidth - active.offsetWidth) / 2, behavior: reduceMotion ? "instant" : "smooth" });
  }, [activeId]);

  return (
    <nav ref={nav} className="tab-nav" aria-label="Case study sections">
      {items.map(({ id, label }, index) => (
        <a key={id} className={id === activeId ? "active" : undefined} href={`#${id}`}
          aria-current={id === activeId ? "location" : undefined} onClick={() => setActiveId(id)}>
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{label}
        </a>
      ))}
    </nav>
  );
}
