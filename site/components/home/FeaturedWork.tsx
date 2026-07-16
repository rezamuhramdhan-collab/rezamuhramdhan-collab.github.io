"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/content/types";
import { ArrowLeft, ArrowRight } from "../icons";
import { thumbnailSvg } from "../thumbs";

// Featured Work grid with client-side pagination: 4 projects per page,
// controls appear only when there are more. Client-side because the site
// ships as a static export — there's no server to render ?page= variants.

const PAGE_SIZE = 4;

function Thumb({ value }: { value: string }) {
  const svg = thumbnailSvg(value);
  if (svg) return <div dangerouslySetInnerHTML={{ __html: svg }} />;
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
                <div className="thumb-overlay">
                  View Case Study
                  <ArrowRight />
                </div>
              </div>
              <div className="project-body">
                <div className="project-meta">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                </div>
                <div className="project-title">{project.title}</div>
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
