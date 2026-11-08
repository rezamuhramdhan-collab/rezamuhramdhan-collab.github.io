"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function JourneyEffects() {
  const pathname = usePathname();
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      document.documentElement.dataset.atmosphere = preference.matches ? "paused" : "playing";
    };
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const distance = document.documentElement.scrollHeight - innerHeight;
      const value = distance > 0 ? Math.min(100, Math.max(0, Math.round(scrollY / distance * 100))) : 0;
      progress.current?.style.setProperty("--reading-progress", String(value / 100));
      progress.current?.setAttribute("aria-valuenow", String(value));
    };
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const resize = new ResizeObserver(onScroll);
    resize.observe(document.body);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0, rootMargin: "0px 0px 30px" });
    document.documentElement.classList.add("journey-enhanced");
    const observe = () => document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((element) => observer.observe(element));
    observe();
    const changes = new MutationObserver(observe);
    changes.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      resize.disconnect(); observer.disconnect(); changes.disconnect();
    };
  }, [pathname]);

  return <div ref={progress} className="journey-progress" role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}><span /></div>;
}

export function ArrivalComet() {
  return <span className="arrival-comet" aria-hidden="true">
    <span className="comet-tail" /><span className="comet-core" />
  </span>;
}
