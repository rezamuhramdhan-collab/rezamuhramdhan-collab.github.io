"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/content/types";
import { thumbnailKeys } from "@/content/registry";
import { ArrowLeft, ArrowRight } from "../icons";

// Featured Work grid with client-side pagination: 4 projects per page,
// controls appear only when there are more. Client-side because the site
// ships as a static export — there's no server to render ?page= variants.

const PAGE_SIZE = 4;

// A value matching a known placeholderKey (no upload yet) renders the
// generic placeholder icon, per design.md, rather than a real image —
// replaces the old per-key illustrated art (see components/thumbs.ts, removed).
function Thumb({ value }: { value: string }) {
  if ((thumbnailKeys as readonly string[]).includes(value)) {
    return (
      <svg
        className="placeholder-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="16" rx="1.5" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="M21 16.5 15.5 11 5 20" />
      </svg>
    );
  }
  // fill inside .project-thumb, which reserves space via aspect-ratio
  return (
    <Image
      src={value}
      alt=""
      fill
      sizes="(max-width: 700px) 100vw, 560px"
      style={{ objectFit: "cover" }}
    />
  );
}

export function FeaturedWork({ projects }: { projects: Project[] }) {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(projects.length / PAGE_SIZE);
  const visible = projects.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <section className="work" id="work">
      <div className="container">
        <h2 className="section-heading" data-reveal>Featured Work</h2>
        <p className="section-sub" data-reveal>A selection of projects I&rsquo;m proud of</p>
        <div className="work-grid">
          {visible.map((project) => (
            <Link key={project.id} className="project-card" href={`/work/${project.slug}`} data-reveal>
              <div className="project-thumb">
                <Thumb value={project.thumbnail} />
                <span className="thumb-overlay" aria-hidden="true">+</span>
              </div>
              <div className="project-body">
                <span className="project-category">{project.category}</span>
                <div className="project-title">{project.title}</div>
                <p className="project-summary">{project.summary}</p>
                <div className="project-bottom">
                  <span className="project-link">
                    View case study
                    <ArrowRight />
                  </span>
                  <span className="project-year">{project.year}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {pageCount > 1 && (
          <nav className="work-pagination" aria-label="Featured work pages">
            <button
              type="button"
              className="page-btn"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous projects"
            >
              <ArrowLeft />
            </button>
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                type="button"
                key={i}
                className={`page-btn page-num${i === page ? " active" : ""}`}
                onClick={() => setPage(i)}
                aria-current={i === page ? "page" : undefined}
                aria-label={`Page ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              className="page-btn"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page === pageCount - 1}
              aria-label="Next projects"
            >
              <ArrowRight />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
