"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { LinkItem, ButtonItem } from "@/content/types";

export function MobileNav({ links, cta }: { links: LinkItem[]; cta: ButtonItem }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  const close = () => { setOpen(false); toggle.current?.focus(); };
  useEffect(() => {
    if (!open) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close(); }
      if (event.key === "Tab") {
        const items = panel.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])');
        if (!items?.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener("keydown", onKey); };
  }, [open]);
  return <div className="mobile-nav">
    <button ref={toggle} className="menu-toggle" type="button" aria-expanded={open} aria-controls={open ? "mobile-menu" : undefined} onClick={() => setOpen(true)}>Menu <span aria-hidden="true">☰</span></button>
    {open && createPortal(<div ref={panel} className="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Journey navigation">
      <div className="mobile-menu-top"><p className="chapter-label">Find your next chapter</p><button className="menu-close" type="button" onClick={close}>Close menu <span aria-hidden="true">×</span></button></div>
      <nav aria-label="Mobile chapters">{links.map((link, index) => <Link key={link.href + link.label} href={link.href} onClick={close} style={{ "--link-order": index } as React.CSSProperties}><span className="mono">0{index + 1}</span>{link.label}</Link>)}</nav>
      <a className="btn btn-accent" href={cta.href} download={cta.download || undefined} onClick={close}>{cta.label}</a>
      <p className="mobile-menu-signoff">Different paths. A shared destination.</p>
    </div>, document.body)}
  </div>;
}
