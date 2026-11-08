"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { LinkItem } from "@/content/types";

export function DesktopNav({ links }: { links: LinkItem[] }) {
  const pathname = usePathname();
  const nav = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("");
  const [line, setLine] = useState({ x: 0, width: 0 });
  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (pathname.startsWith("/work")) { setActive(links.find((link) => link.href.includes("#work"))?.href || ""); return; }
      if (pathname !== "/") { setActive(""); return; }
      let current = "";
      let closest = -Infinity;
      for (const link of links) {
        const id = link.href.split("#")[1];
        const element = id ? document.getElementById(id) : null;
        const top = element?.getBoundingClientRect().top;
        if (top !== undefined && top <= 200 && top > closest) { current = link.href; closest = top; }
      }
      setActive(current);
    };
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [pathname, links]);
  useEffect(() => {
    const measure = () => {
      const element = nav.current?.querySelector<HTMLAnchorElement>('[aria-current]');
      setLine(element ? { x: element.offsetLeft, width: element.offsetWidth } : { x: 0, width: 0 });
    };
    measure();
    const resize = new ResizeObserver(measure);
    if (nav.current) resize.observe(nav.current);
    return () => resize.disconnect();
  }, [active]);
  return <div className="nav-links" ref={nav}>
    {links.map((link) => <Link key={link.href + link.label} href={link.href} aria-current={active === link.href ? "location" : undefined}>{link.label}</Link>)}
    <span className="nav-thread" aria-hidden="true" style={{ width: line.width, transform: `translateX(${line.x}px)` }} />
  </div>;
}
